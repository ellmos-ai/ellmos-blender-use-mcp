# Changelog

All notable changes to `ellmos-blender-use-mcp` are tracked here.

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
