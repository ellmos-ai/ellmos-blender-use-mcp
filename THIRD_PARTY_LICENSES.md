# Third-Party License Review

Stand: 2026-06-20.

## Runtime dependencies

| Package | Version checked | License | Use |
|---|---:|---|---|
| `@modelcontextprotocol/sdk` | 1.29.0 | MIT | MCP server and stdio transport API |
| `zod` | 3.25.76 | MIT | Tool argument schemas |

The npm package does not vendor these dependencies; they are installed by npm from their packages.

## Reviewed but not vendored

| Source | License | Decision |
|---|---|---|
| `ahujasid/blender-mcp` | MIT | Reviewed for feature landscape only; no code copied. Telemetry makes it unsuitable as our default. |
| `djeada/blender-mcp-server` | MIT | Reviewed as an MCP architecture reference; no code copied. |
| `@glutamateapp/blender-mcp-ts` | MIT | Reviewed as TypeScript/SSE reference; no code copied. |
| `freshtechbro/claudedesignskills` / `blender-web-pipeline` | MIT | Reviewed as Blender-skill prior art; no code copied. |
| `youichi-uda/blender-mcp-pro` | mixed/proprietary | Not used; concept-only. |
| `patrykiti/blender-ai-mcp` | Apache-2.0 | Not used; concept-only. |

Implementation note: this MCP server was rewritten locally as plain ESM JavaScript to avoid taking a non-MIT build dependency. No external Blender MCP source code is included.
