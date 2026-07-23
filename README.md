<p align="center">
  <img src="https://raw.githubusercontent.com/ellmos-ai/ellmos-blender-use-mcp/main/assets/logo.jpg" alt="ellmos Blender Use MCP logo" width="280">
</p>

# ellmos Blender Use MCP

**🇩🇪 [Deutsche Version](README_de.md)**

*Part of the [ellmos-ai](https://github.com/ellmos-ai) family.*

[![npm version](https://img.shields.io/npm/v/ellmos-blender-use-mcp.svg)](https://www.npmjs.com/package/ellmos-blender-use-mcp)
[![npm downloads](https://img.shields.io/npm/dt/ellmos-blender-use-mcp.svg)](https://www.npmjs.com/package/ellmos-blender-use-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)

📦 **[View on npm →](https://www.npmjs.com/package/ellmos-blender-use-mcp)**

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
- Process output is retained only as a tail: `blender_run_script` defaults to 8,000 characters (configurable up to 50,000); FBX verification keeps 8,000. The response marks `outputTruncated: true` when earlier output was discarded, so verbose Blender scripts cannot grow the MCP process memory without bound.

## License

MIT — see [LICENSE](LICENSE).

---

## ellmos-ai Ecosystem

This MCP server is part of the **[ellmos-ai](https://github.com/ellmos-ai)** ecosystem — AI infrastructure, MCP servers, and intelligent tools.

### MCP Server Family

| Server | Tools | Focus | npm |
|--------|-------|-------|-----|
| [FileCommander](https://github.com/ellmos-ai/ellmos-filecommander-mcp) | 45 | Filesystem, process management, interactive sessions, cloud-lock-safe operations | [`ellmos-filecommander-mcp`](https://www.npmjs.com/package/ellmos-filecommander-mcp) |
| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 18 | Code analysis, JSON repair, imports, diffs, regex | [`ellmos-codecommander-mcp`](https://www.npmjs.com/package/ellmos-codecommander-mcp) |
| [Clatcher](https://github.com/ellmos-ai/ellmos-clatcher-mcp) | 12 | File repair, format conversion, batch operations | [`ellmos-clatcher-mcp`](https://www.npmjs.com/package/ellmos-clatcher-mcp) |
| [n8n Manager](https://github.com/ellmos-ai/n8n-manager-mcp) | 18 | n8n workflow management via AI assistants | [`n8n-manager-mcp`](https://www.npmjs.com/package/n8n-manager-mcp) |
| [ControlCenter](https://github.com/ellmos-ai/ellmos-controlcenter-mcp) | 20 | MCP stack discovery, profile management, control plane | [`ellmos-controlcenter-mcp`](https://www.npmjs.com/package/ellmos-controlcenter-mcp) |
| [Homebase](https://github.com/ellmos-ai/ellmos-homebase-mcp) | 45 | Local-first LLM memory, knowledge, state, routing, swarm orchestration | [`ellmos-homebase-mcp`](https://www.npmjs.com/package/ellmos-homebase-mcp) (alpha) |
| [ServerCommander](https://github.com/ellmos-ai/ellmos-servercommander-mcp) | 8 | Server operations: health checks, log analysis, deploy dry-runs, mail diagnostics | [`ellmos-servercommander-mcp`](https://www.npmjs.com/package/ellmos-servercommander-mcp) (alpha) |
| **[Blender Use](https://github.com/ellmos-ai/ellmos-blender-use-mcp)** | **3** | **Headless Blender asset QA and FBX reimport verification** | **[`ellmos-blender-use-mcp`](https://www.npmjs.com/package/ellmos-blender-use-mcp)** (alpha) |
| [Open Compute](https://github.com/ellmos-ai/open-compute-mcp) | 10 | Model-agnostic computer use: capture, safety-gated actions, Windows UIA | [`open-compute-mcp`](https://www.npmjs.com/package/open-compute-mcp) (alpha) |

### AI Infrastructure

| Project | Description |
|---------|-------------|
| [BACH](https://github.com/ellmos-ai/bach) | Local-first text-based OS for LLM agents — 113+ handlers, 550+ tools, SQLite memory |
| [open-compute](https://github.com/ellmos-ai/open-compute) | Model-agnostic computer-use core powering Open Compute MCP |
| [clutch](https://github.com/ellmos-ai/clutch) | Provider-neutral LLM orchestration with auto-routing and budget tracking |
| [rinnsal](https://github.com/ellmos-ai/rinnsal) | Lightweight agent memory, connectors, and automation infrastructure |
| [ellmos-stack](https://github.com/ellmos-ai/ellmos-stack) | Self-hosted AI research stack (Ollama + n8n + Rinnsal + KnowledgeDigest) |
| [MarbleRun](https://github.com/ellmos-ai/MarbleRun) | Autonomous agent chain framework for Claude Code |
| [gardener](https://github.com/ellmos-ai/gardener) | Minimalist database-driven LLM OS prototype (4 functions, 1 table) |
| [ellmos-tests](https://github.com/ellmos-ai/ellmos-tests) | Testing framework for LLM operating systems (7 dimensions) |

### Desktop Software

Our partner organization **[open-bricks](https://github.com/open-bricks)** bundles AI-native desktop applications — a modern, open-source software suite built for the age of AI. Categories include file management, document tools, developer utilities, and more.
