import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ignoredDirs = new Set(["node_modules", ".git"]);
const ignoredFiles = new Set(["package-lock.json", "push-protocoll.txt", "changelog-protocoll.txt"]);
// Any literal Windows user-profile path leaks the developer's local machine
// layout. Matching only one hardcoded username would miss the same leak
// under a different account name, so match any username here.
const privatePathPattern = new RegExp(String.raw`C:[/\\]Users[/\\][^"'\s/\\]+`, "i");

// User-profile paths are not the only way local layout leaks. A hardcoded
// private working root is just as unresolvable for a reader and just as
// revealing, but contains no username and therefore passed the check above
// unnoticed for several maintenance runs. Guard the workspace and sync
// directory names of this development setup explicitly. Keep these as patterns
// only — never spell a full example path out here, or this file trips its own
// assertion.
// Note the character classes in the last alternative: they keep the pattern from
// matching its own source text while still matching the real directory name.
const privateWorkspacePattern = new RegExp(
  String.raw`[A-Z]:[/\\]_Local_DEV|[/\\]\.TOPICS[/\\]|[/\\]\.SOFTWARE[/\\]|[/\\]\.SYNC[/\\]|_control[-]cent[e]r`,
  "i"
);

const patterns = [privatePathPattern, privateWorkspacePattern];

function collectFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        files.push(...collectFiles(path.join(dir, entry.name)));
      }
      continue;
    }
    if (entry.isFile() && !ignoredFiles.has(entry.name)) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

const leaks = [];
for (const file of collectFiles(root)) {
  if (statSync(file).size > 1024 * 1024) continue;
  const text = readFileSync(file, "utf8");
  if (patterns.some((pattern) => pattern.test(text))) {
    leaks.push(path.relative(root, file));
  }
}

assert.deepEqual(leaks, [], `Private local path leaked in: ${leaks.join(", ")}`);
