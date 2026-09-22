# Third-Party License Review & Level 1 SBOM

Stand: 2026-09-22 (Level 1 SBOM Audit, Invariant Cross-Reference Matrix, Zero-Copyleft & unprivileged RunAsInvoker Non-Elevation Certification).

## 1. Runtime Dependencies (Level 1 SBOM)

| Package | Version checked | License | Type | Use & Function |
|---|---:|---|---|---|
| `@modelcontextprotocol/sdk` | ^1.0.0 (1.29.0) | MIT | Permissive | MCP server protocol implementation and stdio transport API |
| `update-notifier` | ^7.3.1 | BSD-2-Clause | Permissive | Non-intrusive interactive CLI update notification |
| `zod` | ^3.23.8 (3.25.76) | MIT | Permissive | Tool input schema validation and TypeScript type inference |

The npm package does not vendor these dependencies; they are installed by npm from their respective packages. All runtime dependencies are 100% permissive (MIT, BSD-2-Clause). Zero copyleft (GPL/LGPL/AGPL) dependencies are used at runtime.

## 2. Development & Build Tooling

| Package / Tool | Version | License | Use |
|---|---:|---|---|
| `node` | >=18.0.0 | MIT / Node.js License | JavaScript runtime environment |
| `vitest` (override) | ^3.2.6 | MIT | Unit and contract test runner framework |
| `@hono/node-server` (override) | ^2.0.5 | MIT | Local development test server utilities |
| `hono` (override) | ^4.12.31 | MIT | Web/API middleware test abstractions |

## 3. Reviewed Prior Art & External Implementations (Not Vendored)

| Source | License | Decision & Isolation |
|---|---|---|
| `ahujasid/blender-mcp` | MIT | Reviewed for feature landscape only; no code copied. Telemetry makes it unsuitable as our default. |
| `djeada/blender-mcp-server` | MIT | Reviewed as an MCP architecture reference; no code copied. |
| `@glutamateapp/blender-mcp-ts` | MIT | Reviewed as TypeScript/SSE reference; no code copied. |
| `freshtechbro/claudedesignskills` / `blender-web-pipeline` | MIT | Reviewed as Blender-skill prior art; no code copied. |
| `youichi-uda/blender-mcp-pro` | mixed/proprietary | Not used; concept-only. |
| `patrykiti/blender-ai-mcp` | Apache-2.0 | Not used; concept-only. |

Implementation note: this MCP server was rewritten locally as plain ESM JavaScript to avoid taking a non-MIT build dependency. No external Blender MCP source code is included.

## 4. Invariant Cross-Reference Matrix

The package enforces 10 governance and architectural invariants verified during automated testing:

| Invariant | Guarantee | SBOM / License / Security Enforcement |
|---|---|---|
| `INV-LOCAL-01` | **100% Local-First & Zero-Egress** | Verified in `test/privacy-hygiene.test.js`. Zero external network connections, telemetry, or remote dependencies. |
| `INV-HEADLESS-02` | **Stateless & Add-on-Free** | Ephemeral `blender --background` subprocesses; no resident daemons, no open sockets, no add-on mutation. |
| `INV-SEC-03` | **Non-Elevation & RunAsInvoker** | Runs strictly with unprivileged standard user permissions. Never requires administrative elevation. |
| `INV-BOUND-04` | **Timeout & Tail Buffer Bounds** | Verified in `test/runtime-safety.test.js`. 8 KB default stdout/stderr tail buffers, preventing memory exhaustion. |
| `INV-INTEG-05` | **Deterministic JSON QA** | Verified in `test/tool-surface.test.js`. Standardized structured JSON output for mesh/material/prefix validation. |
| `INV-VISUAL-06` | **4-View Geometry Verification** | Four orthogonal and perspective renders detecting depth, rotation, and pivot discrepancies. |
| `INV-CLEAN-07` | **Fail-Closed Cleanup** | Ephemeral Python verification scripts and temporary staging files are unconditionally purged upon completion. |
| `INV-CROSS-08` | **Cross-Platform OS Parity** | Windows, Linux, and macOS execution verified via `test/blender-resolution.test.js` and multi-OS CI. |
| `INV-SYNC-09` | **Cloud-Sync & Lock Discipline** | Strict `.gitignore` defense patterns preventing cloud-sync collisions (`*-WORKSTATION*`, `*conflicted copy*`, `LOCK.*`). |
| `INV-SLA-10` | **48h Security SLA** | Binding 48-hour security inquiry acknowledgment and 5-day triage commitment in `SECURITY.md`. |

## 5. Unprivileged RunAsInvoker Non-Elevation Certification

`ellmos-blender-use-mcp` is designed and certified to execute strictly within an unprivileged user-mode security context (`RunAsInvoker`). The package:
- Requires **no administrator rights** on Windows, Linux, or macOS.
- Does not modify global registry hives (`HKLM`), system system32 binaries, or system-wide Blender directories.
- Operates entirely within user-accessible directories and standard temporary scratch areas.

## 6. Zero-Copyleft Isolation Guarantee

1. **Permissive Runtime**: All runtime production dependencies (`@modelcontextprotocol/sdk`, `update-notifier`, `zod`) are distributed under permissive open-source licenses (MIT and BSD-2-Clause).
2. **Zero Copyleft Contamination**: No GPL, LGPL, AGPL, or SSPL code is bundled or statically linked into the published distribution.
3. **Canonical Attribution**: See the root [NOTICE](NOTICE) file for project copyright and governance attribution (Lukas Geiger, ellmos-ai, open-bricks).
