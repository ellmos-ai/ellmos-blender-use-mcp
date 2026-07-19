import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runProcess } from "../src/index.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const noisyChild = await runProcess(
  process.execPath,
  ["-e", 'process.stdout.write("a".repeat(40000)); process.stderr.write("b".repeat(40000));'],
  root,
  5000,
  1024
);

assert.equal(noisyChild.exitCode, 0);
assert.equal(noisyChild.timedOut, false);
assert.equal(noisyChild.outputTruncated, true);
assert.equal(noisyChild.output.length, 1024);
assert.match(noisyChild.output, /^[ab]+$/);
