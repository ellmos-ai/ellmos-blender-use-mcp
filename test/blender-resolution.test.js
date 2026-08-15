import assert from "node:assert/strict";
import path from "node:path";
import { windowsBlenderCandidates } from "../src/index.js";

// Regression guard for the Blender lookup. Until 2026-08-15 the only built-in
// Windows fallback was a single hardcoded path pointing into the maintainer's
// private working directory: it resolved nothing on a normal machine, while the
// documentation described it as a "verified local Windows default". Candidates
// must therefore be derived from the standard install roots at runtime and must
// never be hardcoded again.
const candidates = windowsBlenderCandidates();

assert.ok(Array.isArray(candidates), "candidate list must always be an array");

if (process.platform !== "win32") {
  assert.deepEqual(candidates, [], "no Windows candidates outside Windows");
} else {
  for (const candidate of candidates) {
    assert.equal(
      path.basename(candidate).toLowerCase(),
      "blender.exe",
      `candidate must point at the executable: ${candidate}`
    );
    assert.ok(
      candidate.includes("Blender Foundation"),
      `candidate must live under a standard install root: ${candidate}`
    );
  }
  assert.equal(
    new Set(candidates).size,
    candidates.length,
    "candidate list must not contain duplicates"
  );
}
