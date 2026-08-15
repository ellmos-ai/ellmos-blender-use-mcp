# Changelog

All notable changes to `ellmos-blender-use-mcp` are tracked here.

## 0.1.0-alpha.7 - 2026-07-31

### Fixed (2026-08-15)
- `blender_locate` and every tool resolving Blender no longer fall back to a single hardcoded path that only existed on the maintainer's machine. The Windows lookup now discovers the standard install roots at runtime (`%ProgramFiles%\Blender Foundation\Blender <version>` plus the 32-bit and per-user equivalents, newest version first). A normal Windows installation without Blender on `PATH` was previously not found at all, despite the documentation promising a "verified local Windows default".
- `README.md`, `README_de.md`, and `llms.txt` described that fallback as a "verified local default"; all three now state which locations are actually probed and that Linux and macOS go straight from `BLENDER_EXE` to `PATH`.

### Added (2026-08-15)
- `test/blender-resolution.test.js`: regression test asserting Blender candidates are derived from the standard install roots and never hardcoded again.
- `test/privacy-hygiene.test.js` now also flags hardcoded private workspace roots. The previous pattern matched literal Windows user-profile paths only, so the leaked path above — which contains no username — passed every hygiene run since 2026-07-26 unnoticed.

### Note (2026-08-15)
- `smithery.yaml` is present again (re-added on 2026-08-14) after the 0.1.0-alpha.5 entry below recorded its removal. That entry is kept for history, but it no longer describes the current state; whether Smithery publication now works without a validated MCPB bundle has not been re-verified in this run.

### Maintenance (2026-08-14)
- Technical Hygiene & Maintenance Check (Pfad A): Added automated regression test `test/manifest-parity.test.js` guarding version, name, license, tools count, and package file integrity across `package.json`, `server.json`, `glama.json`, and filesystem.
- Updated `package.json` test script to include manifest parity test.
- Synchronized `llms.txt` Last-checked timestamp to `2026-08-14`.
- Verified 100% test suite pass (privacy hygiene, runtime memory safety, manifest & file packaging parity) and clean syntax check (`npm run build`).

### Security (2026-08-10)
- Refreshed transitive `fast-uri` (3.1.4 to 3.1.5) and `hono` (4.12.32 to 4.13.1) dependencies; `npm audit` now reports zero vulnerabilities.

### Maintenance (2026-08-10)
- Technical Hygiene Check: Updated `llms.txt` Last-checked timestamp to `2026-08-10` after passing `npm test`, `npm run build`, and package/lock version parity checks for `0.1.0-alpha.7`.

### Maintenance (2026-08-13)
- Registry Metadata Check: Re-verified the npm `latest` and `alpha` dist-tags at `0.1.0-alpha.7` and confirmed `package.json`, `package-lock.json`, `server.json`, and `glama.json` carry the same released version. Updated `llms.txt` to the read-only check date; no publish or registry submission was performed.

### Maintenance (2026-08-04)
- Technical Hygiene & Maintenance Check (Pfad A): Updated `llms.txt` Last-checked timestamp to `2026-08-04`.
- Verified 100% test suite pass (`privacy-hygiene.test.js` & `runtime-safety.test.js`).
- Verified clean syntax build (`npm run build`).

## 0.1.0-alpha.5 - 2026-07-29

### Maintenance (2026-07-29)
- Discoverability, SEO & README-Design Check (Path B): Added Glama.ai badges to `README.md` and `README_de.md`.
- Added `glama.json` to `package.json` `files` array and added the `glama` keyword.
- Updated `llms.txt` header timestamp to `Last-checked: 2026-07-29`.
- Verified 100% test suite pass (`privacy-hygiene.test.js` & `runtime-safety.test.js`).
- Removed the unverified legacy `smithery.yaml`; current Smithery publication for local stdio servers requires a validated MCPB bundle.
- Synchronized 0.1.0-alpha.5 across package, lockfile, and registry manifests.

### Maintenance (2026-07-26)
- Sanitized local Windows path leaks in `push-protocoll.txt` to pass privacy hygiene test suite.
- Updated `llms.txt` header timestamp to `Last-checked: 2026-07-26`.
- Verified 100% test suite pass (`privacy-hygiene.test.js` & `runtime-safety.test.js`).
- Ignore generated local `test_out.txt` so test transcripts cannot be committed accidentally.
- Refreshed the lockfile to remove the high-severity `fast-uri` finding and the resolved Hono findings; two moderate `@hono/node-server` findings remain upstream of the stdio-only MCP transport.



### Added
- GitHub Actions CI workflow (`.github/workflows/ci.yml`) testing Node.js 20, 22, and 24.
- CI status badge and LLM integration note block in `README.md` and `README_de.md`.

### Maintenance
- Updated `llms.txt` header timestamp to `Last-checked: 2026-07-25`.

## 0.1.0-alpha.4 - 2026-07-24

### Fixed
- Correct FileCommander (46) and CodeCommander (22) tool counts in the ecosystem family table; counts now verified against the live MCP `tools/list` surface.

## 0.1.0-alpha.3 - 2026-07-24

### Fixed
- Bound captured stdout/stderr to the returned output-tail size for Blender subprocesses. Responses now expose `outputTruncated` when earlier process output was discarded, preventing verbose scripts from accumulating unbounded MCP-process memory.

### Tests
- Added a regression check that runs a noisy child process and verifies bounded output capture.

### Changed
- Unified the ellmos-ai ecosystem section in README.md and README_de.md: full 9-server MCP family table with refreshed tool counts, AI infrastructure, and desktop software links.
- Added `glama.json` for the Glama MCP directory listing.
- Synced `server.json` version metadata.
- Added a License section to both READMEs.

## 0.1.0-alpha.2 - 2026-07-06

### Changed
- Load server name and version dynamically from `package.json` in `src/index.js` (fixed a mismatch where the server still declared `0.1.0-alpha.1` internally).
- New round **seal emblem** (`assets/logo.jpg`) replacing the previous logo — matches the ellmos seal family (Suzanne wireframe, FBX/QA marks, Blender-orange accents).
- README (EN/DE): added npm version/downloads, license and Node badges plus an explicit "View on npm" link.

## 0.1.0-alpha.1 - 2026-07-03

### Added
- Publish-readiness pass ahead of the first npm/GitHub release: `update-notifier` (TTY-guarded, keeps stdio JSON-RPC output clean), `README_de.md`, `llms.txt`, and this `CHANGELOG.md`.

### Changed
- Repositioned `README.md`/`README_de.md` around the asset-QA use case (`blender_verify_fbx_reimport`) and the no-add-on/no-TCP-port/headless/stateless design, with an explicit distinction from live-GUI, add-on-based Blender MCP servers (e.g. `ahujasid/blender-mcp`, the official Blender Labs MCP server).
- Restructured the install section into npm/source options consistent with sibling ellmos MCP servers.
- Aligned `mcpName` (package.json) and `server.json` `name`/`packages[0].version` with the actual repository and package name `ellmos-blender-use-mcp` (previously `io.github.ellmos-ai/blender-use-mcp`, missing the `ellmos-` prefix).
- `package.json` `files` now also ships `README_de.md`, `llms.txt`, and `CHANGELOG.md` with the npm package.

## 0.1.0-alpha.0 - 2026-06-20

### Added
- Initial local-first MCP server: `blender_locate`, `blender_run_script`, `blender_verify_fbx_reimport`.
- Windows process-tree kill (`taskkill /T /F`) on timeout so a hung Blender subprocess tree cannot orphan.
- `test/privacy-hygiene.test.js`: regression test that fails the build if any file contains a literal Windows per-user profile path.
- `THIRD_PARTY_LICENSES.md` documenting runtime dependency licenses and Blender-MCP prior art reviewed but not vendored.

### Security
- Senior review (2026-06-20): no blockers found. Fixed prior to this entry: personal path leaked in the README MCP-config example, an incorrect third-party license version, and the Windows process-tree timeout gap noted above.
