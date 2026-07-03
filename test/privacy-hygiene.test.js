import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ignoredDirs = new Set(["node_modules", ".git"]);
const ignoredFiles = new Set(["package-lock.json"]);
// Any literal Windows user-profile path leaks the developer's local machine
// layout. Matching only one hardcoded username would miss the same leak
// under a different account name, so match any username here.
const privatePathPattern = new RegExp(String.raw`C:[/\\]Users[/\\][^"'\s/\\]+`, "i");

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
  if (privatePathPattern.test(text)) {
    leaks.push(path.relative(root, file));
  }
}

assert.deepEqual(leaks, [], `Private local path leaked in: ${leaks.join(", ")}`);
