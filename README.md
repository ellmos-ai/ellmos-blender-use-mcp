<p align="center">
  <img src="https://raw.githubusercontent.com/ellmos-ai/ellmos-blender-use-mcp/main/assets/logo.jpg" alt="ellmos Blender Use MCP logo" width="280">
</p>

# ellmos Blender Use MCP

An asset-QA tool for game and 3D asset pipelines: verify that an exported FBX actually reimports cleanly in headless Blender — mesh count, material count, and required naming prefixes checked automatically, with a deterministic JSON result instead of a manual eyeball pass. `blender_verify_fbx_reimport` is the core tool; `blender_locate` and `blender_run_script` are the general-purpose primitives it is built on.

**No add-on. No TCP port. No background daemon.** This server does not install anything into Blender, does not open a socket for a running Blender instance to connect to, and does not keep Blender resident. Each call spawns `blender --background --python <script.py>`, waits for a bounded, timeout-guarded exit, and returns the result — headless and stateless by design. It does not download assets and does not collect telemetry.

**How this differs from other Blender MCP servers.** Most Blender MCP projects (e.g. `ahujasid/blender-mcp`, the official Blender Labs MCP server) drive a *live, running* Blender GUI over a TCP/add-on bridge for interactive scene editing — a different use case with a different trust model (an open socket, an installed add-on, a persistent process). This server instead targets **CI-style, one-shot asset verification**: run it in a pipeline step, get a pass/fail JSON, move on. If you need live GUI control, use a reviewed Blender MCP add-on separately (see Safety below).

## Tools

| Tool | Purpose |
|---|---|
| `blender_verify_fbx_reimport` | Generate a temporary Blender verification script, import an FBX, and write a JSON result with mesh/material counts and missing required prefixes. |
| `blender_run_script` | Run `blender --background --python <script.py>` with optional arguments and bounded stdout tail. |
| `blender_locate` | Resolve the Blender executable from an explicit path, `BLENDER_EXE`, the verified local default, or PATH. |

## Safety

- This server runs local Python inside Blender. Use only scripts and asset paths you trust.
- The default timeout is bounded.
- No remote asset marketplaces, API keys, or telemetry are included.
- For live GUI control, use a reviewed Blender MCP add-on separately.

## Installation

### Option 1: Run via npx (no install)

```json
{
  "mcpServers": {
    "blender-use": {
      "command": "npx",
      "args": ["-y", "ellmos-blender-use-mcp"]
    }
  }
}
```

### Option 2: Install from source

```bash
git clone https://github.com/ellmos-ai/ellmos-blender-use-mcp.git
cd ellmos-blender-use-mcp
npm install
npm run build
node src/index.js
```

For a local checkout, point `command`/`args` at the cloned `src/index.js` instead:

```json
{
  "mcpServers": {
    "blender-use": {
      "command": "node",
      "args": ["<path-to-repo>/src/index.js"]
    }
  }
}
```

## Configuration

- `BLENDER_EXE` — optional path to the Blender executable. Without it, tools try the explicit `blenderPath` argument, then `BLENDER_EXE`, then a verified local Windows default, then `PATH`.
- Every tool also accepts an explicit `blenderPath` argument per call, which takes priority over `BLENDER_EXE`.
