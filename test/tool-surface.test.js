import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runProcess } from "../src/index.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));

// 1. Test clean process execution
const successResult = await runProcess(
  process.execPath,
  ["-e", 'console.log("blender-qa-ok");'],
  root,
  5000,
  1024
);
assert.equal(successResult.exitCode, 0, "Expected exit code 0 for normal script");
assert.equal(successResult.timedOut, false, "Expected timedOut to be false");
assert.match(successResult.output, /blender-qa-ok/, "Expected output to contain log message");
assert.ok(successResult.durationMs >= 0, "Expected non-negative duration");

// 2. Test timeout handling & process tree killing
const timeoutResult = await runProcess(
  process.execPath,
  ["-e", "setInterval(() => {}, 1000);"],
  root,
  300,
  1024
);
assert.equal(timeoutResult.timedOut, true, "Expected timedOut to be true on long-running process");
assert.equal(timeoutResult.exitCode, null, "Expected null exitCode on timeout kill");
assert.ok(timeoutResult.durationMs >= 250, "Expected duration to reflect timeout duration");

// 3. Test non-existent command error handling
const nonExistentResult = await runProcess(
  "non_existent_binary_for_testing_12345",
  ["--version"],
  root,
  2000,
  1024
);
assert.equal(nonExistentResult.exitCode, 1, "Expected exitCode 1 on spawn error");
assert.equal(nonExistentResult.timedOut, false, "Expected timedOut to be false on spawn error");
assert.match(nonExistentResult.output, /non_existent_binary|ENOENT|spawn/i, "Expected error in output");

// 4. Test CLI --version and --help flags exit cleanly without blocking on stdio
const versionResult = await runProcess(process.execPath, ["src/index.js", "--version"], root, 5000, 1024);
assert.equal(versionResult.exitCode, 0, "Expected exitCode 0 for --version");
assert.equal(versionResult.timedOut, false, "Expected --version not to time out");
assert.equal(versionResult.output.trim(), pkg.version, "Expected --version to output package.json version");

const helpResult = await runProcess(process.execPath, ["src/index.js", "--help"], root, 5000, 1024);
assert.equal(helpResult.exitCode, 0, "Expected exitCode 0 for --help");
assert.equal(helpResult.timedOut, false, "Expected --help not to time out");
assert.match(helpResult.output, /BLENDER_EXE/, "Expected --help to mention BLENDER_EXE");

console.log("All tool-surface tests passed successfully.");
