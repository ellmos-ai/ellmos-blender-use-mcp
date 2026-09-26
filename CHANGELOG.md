# Changelog

All notable changes to `ellmos-blender-use-mcp` are tracked here.

## [Unreleased]

### Security & Dependency Remediation, SLA Contract & Gitignore Hardening (2026-09-26)
- Remediated 3 moderate supply chain vulnerabilities in transitive dependencies (GHSA-gqvv-2mrq-wpjv, GHSA-g6gw-c38x-mqfc, GHSA-crvj-82cr-hjcx) by pinning `@hono/node-server` to `^2.0.12`, `hono` to `^4.13.8`, `qs` to `^6.16.0`, `vitest` to `^4.1.11`, and `@vitest/mocker` to `^4.1.11` across `package.json` overrides and `package-lock.json` (`npm audit` 100% clean, 0 vulnerabilities).
- Formalized explicit 30-calendar-day remediation SLA commitment (`INV-SLA-10`) in English and German sections of `SECURITY.md`.
- Hardened `.gitignore` against credential and synchronization artifacts including SSH key wildcards (`id_rsa*`, `id_ed25519*`, `id_ecdsa*`, `id_dsa*`), certificate signing requests (`*.csr`), token/secret files (`*.token`, `*.secret`), and multi-host review protocols (`CONFLICT_REVIEW_LOG*`).
- Expanded automated contract test suite in `test/manifest-parity.test.js` to guard the 30-day remediation SLA commitment and the new credential/sync `.gitignore` patterns.

### Discoverability, 18-Point Bilingual Navigation, Target Personas & Comparative Matrix (Pfad B) (2026-09-22)
- Established full 18-point bilingual quick navigation parity with reciprocal dual HTML anchors (`<a id="..."></a>`) across `README.md` and `README_de.md`.
- Saturated GitHub repository topics to full 20/20 capacity (`asset-pipeline`, `blender`, `fbx`, `headless`, `local-first`, `mcp`, `model-context-protocol`, `qa`, `3d-assets`, `blender-mcp`, `game-development`, `mcp-server`, `ci-cd`, `developer-tools`, `ellmos-ai`, `offline-first`, `open-bricks`, `visual-verification`, `zero-egress`, `four-view-rendering`).
- Defined 4 distinct target personas ([PERSONA-01] to [PERSONA-04]) and high-intent SEO queries for Technical Artists, CI/CD Engineers, AI Agent Developers, and Studio Compliance Officers.
- Established a 10-dimension 5-way comparative matrix against alternative tools (Interactive TCP Add-ons, Ad-hoc Python Scripts, Heavy DCC Validators, Cloud SaaS Checkers) mapped across invariants `INV-LOCAL-01` to `INV-SLA-10`.
- Added canonical root `NOTICE` attribution file (Lukas Geiger, ellmos-ai, open-bricks) and integrated it into `package.json` package files.
- Upgraded Level 1 SBOM in `THIRD_PARTY_LICENSES.md` (Stand 2026-09-22) with Section 4 Invariant Cross-Reference Matrix table, unprivileged RunAsInvoker non-elevation certification, and 100% Permissive Zero-Copyleft isolation guarantee.
- Integrated German statutory disclaimer (§ 521 BGB Gefälligkeitsrecht) and binding 48h Security Response SLA into Section 18 of `README.md` and `README_de.md`.
- Updated machine-readable context in `llms.txt` with audit timestamp `2026-09-22`, NOTICE attribution, statutory disclaimer, and 20/20 topics.
- Strictly maintained version freeze discipline on `0.1.0-alpha.10` per T-20260920-167562623.
- Expanded automated contract test suite in `test/manifest-parity.test.js` to guard 18-point navigation parity, dual reciprocal anchors, personas, comparative matrix, § 521 BGB notice, NOTICE file, and Level 1 SBOM invariants.

## 0.1.0-alpha.10 - 2026-09-20

### Technical Hygiene, CI Workflows & Multi-Host Lock Defense (Pfad A) (2026-09-20)
- Hardened GitHub Actions CI configuration (`.github/workflows/ci.yml`) with least-privilege `permissions: contents: read` guardrail on the test matrix job.
- Deployed automated community lifecycle workflows: `stale.yml` (actions/stale@v9 with daily 01:30 UTC schedule, timeout-minutes: 10, operations-per-run: 30) and `welcome.yml` (actions/first-interaction@v3 with timeout-minutes: 5, cancel-in-progress concurrency).
- Hardened `.gitignore` multi-host sync and canonical lock defense patterns (`*conflicted copy*`, `* (Kopie)*`, `* (Copy)*`, `*-WORKSTATION*`, `*-LAPTOP*`, `*-ASUS*`, `*-Mac Studio*`, `*-MacBook*`, `LOCK.user.*`, `LOCK.until.*`, `LOCK.condition.*`, `LOCK.permissions.json`, `.automation-lock`, `.hypothesis/`, `*.rej`).
- Performed Level 1 SBOM third-party license audit in `THIRD_PARTY_LICENSES.md` (Stand 2026-09-20, zero copyleft, unprivileged RunAsInvoker non-elevation verification).
- Harmonized package and MCP server version to `0.1.0-alpha.10` synchronously across `package.json`, `package-lock.json`, `server.json`, `glama.json`, and `MARKETING-LOG.txt`.
- Synchronized documentation badges in `README.md` and `README_de.md` and machine-readable `llms.txt` with audit timestamp `2026-09-20`.
- Expanded automated contract test suite in `test/manifest-parity.test.js` to guard new CI workflows (`stale.yml`, `welcome.yml`), CI permissions, expanded lock defenses, and version `0.1.0-alpha.10`.

## 0.1.0-alpha.9 - 2026-09-11

### Discoverability, JSON Output Schemas & Multi-View Geometry Projection (Pfad B) (2026-09-13)
- Expanded `README.md` and `README_de.md` with a dedicated deep dive for `blender_verify_fbx_reimport`, detailing input parameters, invocation syntax, and deterministic JSON report schema.
- Added ASCII Four-View Orthogonal Projection diagram illustrating camera placements (Top, Front, Side, Perspective) and geometric defect detection boundaries for `blender_verify_visual`.
- Documented full deterministic JSON output schemas for both visual verification and structural reimport verification to accelerate technical artist and AI assistant onboarding.
- Added copy-pasteable CI/CD pipeline integration snippet (GitHub Actions workflow) for automated headless asset QA gates on pull requests.
- Synchronized audit badges to `2026-09-13` across English and German documentation, updated `MARKETING-LOG.txt`, and refreshed search keywords in `llms.txt`.

### Technical Hygiene, Packaging Defense & CI Hardening (Pfad A) (2026-09-11)
- Added runaway execution timeout guardrail (`timeout-minutes: 15`) to GitHub Actions CI test matrix (`.github/workflows/ci.yml`), preventing resource starvation from unhandled headless process stalls or runner network hangs.
- Restricted `package.json` distribution files list from directory wildcard `scripts/` to the explicit script artifact `scripts/verify_asset_visual.py`, preventing stray compilation artifacts (`scripts/__pycache__/*.pyc`) from inadvertently leaking into npm tarball releases.
- Hardened `.gitignore` with additional multi-host sync conflict patterns (`* (kopie)*`, `* (copy)*`, `*.sync-temp-*`), merge residue (`*.orig`), and coverage/cache directories (`.turbo/`, `build/`, `.nyc_output/`, `coverage/`, `.tox/`, `.mypy_cache/`).
- Harmonized package and MCP server version to `0.1.0-alpha.9` synchronously across `package.json`, `package-lock.json`, `server.json`, `glama.json`, and `MARKETING-LOG.txt`.
- Synchronized documentation badges in `README.md` and `README_de.md` and machine-readable `llms.txt` with audit timestamp `2026-09-11`.
- Expanded automated contract test suite in `test/manifest-parity.test.js` to guard CI timeout specification, specific script packaging hygiene, `.gitignore` conflict patterns, and documentation timestamp freshness.

## 0.1.0-alpha.8 - 2026-09-09

### Discoverability, Visual Architecture & Governance Invariants (Pfad B) (2026-09-09)
- Established dedicated Pfad B marketing and discoverability ledger (`MARKETING-LOG.txt`) documenting target personas, ecosystem positioning, asset-QA differentiation, and 10 runtime invariants.
- Upgraded documentation header in `README.md` and `README_de.md` with full Shields.io badge suite (npm version, downloads, CI passing, tests 5 suites / 100% green, Node >=18.0.0, platform, privacy 100% offline, security isolated headless RunAsInvoker, 48h/5d security SLA, standard ESM code style, LLM-Ready, Glama listing, ecosystem, umbrella, and 2026-09-09 audit date).
- Introduced standardized 14-point Quick Navigation bar with bidirectional language switcher and full anchor parity across English and German documentation.
- Formulated 10 Governance & Runtime Invariants (`INV-LOCAL-01` through `INV-SLA-10`) covering zero egress, stateless headless execution, RunAsInvoker, bounded tail-buffers, deterministic JSON results, four-view visual verification, ephemeral script staging cleanup, cross-platform parity, cloud-sync lock discipline, and 48h/5d security SLA.
- Expanded sibling projects and partner organizations ecosystem table to 16 repositories across `ellmos-ai`, `dev-bricks`, `file-bricks`, `doc-bricks`, `entertain-and-more`, and `open-bricks`.
- Synchronized `llms.txt` with marketing ledger reference, 10 governance invariants, and fresh `Last-checked: 2026-09-09`.
- Expanded automated contract test suite in `test/manifest-parity.test.js` to guard `MARKETING-LOG.txt` presence, invariant table integrity, quick navigation anchors, security SLA badges, and timestamp freshness.

### Technical Hygiene & CI Hardening (2026-09-08)
- Expanded GitHub Actions CI test matrix (`.github/workflows/ci.yml`) to include Node.js 18.x (`[18.x, 20.x, 22.x, 24.x]`), aligning CI runtime testing with the package manifest engine requirement (`>=18.0.0`).
- Hardened `.gitignore` with comprehensive multi-host conflict patterns (`*-CONFLIT-*`, `*-conflict-*`, `*.sync-conflict-*`), multi-agent lockfile boundaries (`LOCK.*`, `*.lock` with `!package-lock.json`), and temporary test/cache artifacts (`.ruff_cache/`, `.pytest_cache/`, `*.tmp`, `*.bak`).
- Updated `SECURITY.md` in both English and German to incorporate the umbrella organization security contact (`security@open-bricks.org`) alongside `security@ellmos.ai` and `support@lukasgeiger.com`, with explicit 48-hour SLA and 5 business days triage commitment.
- Performed security dependency audit: updated transitive dependencies (`fast-uri` to 3.1.7, `qs` to 6.16.0) via `npm audit fix`, resolving high and moderate severity advisories (GHSA-5jgf-p345-68v8, GHSA-x5fp-wj9c-mxmx); package-lock.json synchronized to zero audit vulnerabilities and version 0.1.0-alpha.8 parity.
- Extended automated regression suite in `test/manifest-parity.test.js` to assert umbrella security contacts, complete CI matrix coverage, gitignore sync-conflict patterns, and machine-readable context freshness.
- Synchronized `llms.txt` Last-checked timestamp to `2026-09-08`.
- Verified 100% test pass across all 5 test suites (`privacy-hygiene`, `runtime-safety`, `tool-surface`, `blender-resolution`, `manifest-parity`), clean syntax build (`npm run build`), zero leaks, and package dry-run tarball integrity (13 files).

### Added (2026-09-01)

- `blender_verify_visual`: renders four views of an FBX and checks geometry a
  structural reimport cannot see (unapplied rotation, floating parts, pivot outside
  the model, transform residuals, stray empties). Returns the parsed result JSON plus
  the render paths. Ships with `scripts/verify_asset_visual.py`, so the package stays
  self-contained; `scripts/` added to `files`.

## 0.1.0-alpha.7 - 2026-07-31

### Security & Dependency Audit (2026-08-21)
- Hardened `.gitignore` with explicit exclusion patterns for private keys, certificates (`*.pem`, `*.key`, `*.pfx`, `*.p12`, `*.cert`, `*.crt`), npm credentials (`.npmrc`), plaintext credential JSONs (`*secrets*.json`, `credentials.json`, `*recovery*.txt`), and host synchronization conflict copies (`*-WORKSTATION-LG*`, `*-ASUS-GEI*`, `*.conflict`, `*.sync-conflict-*`).
- Updated `THIRD_PARTY_LICENSES.md` runtime inventory to comprehensively account for all direct dependencies including `update-notifier` (`7.3.1`, BSD-2-Clause) alongside `@modelcontextprotocol/sdk` and `zod`.
- Expanded automated contract test suite in `test/manifest-parity.test.js` with validations for third-party license inventory parity and `.gitignore` security exclusion patterns (10/10 contract tests passed).
- Verified zero OSV/npm vulnerabilities via `npm audit` and 100% test pass across all 5 test suites.

### Maintenance (2026-08-21)
- Discoverability, Visual UX & Metadata Parity Check (Pfad B): Added bilingual Mermaid Sequence Diagrams for the Headless Asset-QA Verification Lifecycle in both `README.md` and `README_de.md`.
- Synchronized Shields.io badges (Platform Windows | Linux | macOS, 100% Offline / Zero-Egress Privacy, Isolated Headless Security, Node >=18, 5 Test Suites Passed, LLM-Ready, Glama, Ecosystem, and Umbrella links).
- Upgraded `SECURITY.md` to a comprehensive bilingual policy (English & Deutsch) with explicit zero-egress, non-elevation, process tree termination (`taskkill /T /F` on Windows, `SIGKILL` on POSIX), and official security disclosure contact points (`security@ellmos.ai`, `lukas@ellmos.ai`, `support@lukasgeiger.com`, GitHub Security Advisories).
- Expanded automated contract test suite in `test/manifest-parity.test.js` to assert bilingual security policy presence, security email contacts, badge integrity, sequence diagrams, and CI workflow configurations.
- Synchronized `llms.txt` Last-checked timestamp to `2026-08-21`.
- Verified 100% test pass across all 5 test suites (`test/privacy-hygiene.test.js`, `test/runtime-safety.test.js`, `test/tool-surface.test.js`, `test/blender-resolution.test.js`, `test/manifest-parity.test.js`) and clean syntax build (`npm run build`).

### Maintenance (2026-08-16)
- Discoverability, README-Design, Badges, Test Status & Metadata Parity Check (Pfad B): Synchronized badges in `README.md` and `README_de.md` (5 Test Suites passed, isolated headless security badge, ecosystem, and umbrella links).
- Implemented `SECURITY.md` covering headless stateless execution model, process tree termination, tail buffer limits, trust boundaries, and private vulnerability disclosure policy.
- Added automated regression test `test/tool-surface.test.js` validating process execution, timeout handling, and child error recovery.
- Enhanced `test/manifest-parity.test.js` to assert `SECURITY.md` packaging, tool count coverage in `llms.txt`, and documentation parity across languages.
- Expanded AI infrastructure and desktop software matrix in `README.md` and `README_de.md` with sibling tools (`workflowhooker`, `system-explorer`, `memoryhooker`, `policy-registry`, `ellmos-delegation-authority`, `sqlite-transit-sync`, `ProFiler`, `DokuZen`, `PDFtoPDFocr`, `MediaBrain`, `TextBrain`, `knowledgedigest`, `DevCenter`, `CodeBox`).
- Synchronized `llms.txt` Last-checked timestamp to `2026-08-16`.
- Verified 100% test suite pass (5/5 suites: privacy hygiene, runtime safety, tool surface, blender resolution, manifest parity) and clean syntax build (`npm run build`).

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
