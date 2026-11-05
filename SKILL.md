---
name: ellmos-blender-use-mcp
version: "0.1.0-alpha.10"
type: standalone-mcp-tool
standalone: true
visibility: public
provenance: "ellmos-ai MCP suite"
description: "Local-first, add-on-free MCP asset QA for headless Blender: executable discovery, bounded background scripts, structural FBX reimport checks, and four-view visual verification."
---

# ellmos-blender-use-mcp Skill

Use this skill when interacting with the `ellmos-blender-use-mcp` Model Context Protocol (MCP) server or integrating headless Blender 3D asset verification into agentic workflows and CI pipelines.

## Capabilities & Tool Overview

The server provides four focused, one-shot headless tools designed for automated 3D asset QA:

1. **`blender_verify_fbx_reimport`** (Structural Verification):
   - Imports an FBX file into a fresh, headless Blender process.
   - Evaluates object hierarchy, mesh count, material count, and verifies naming conventions (missing required prefixes).
   - Generates deterministic JSON metrics without persisting any Blender state.
   - Bounded stdout/stderr tail (8,000 characters) with truncation signaling.

2. **`blender_verify_visual`** (Visual & Geometry QA):
   - Renders 4 standard orthogonal and perspective views (front, side, top, perspective).
   - Detects geometric defects that counts miss: unapplied rotation (meshes lying on their side), floating disconnected parts, pivots/origins outside the bounding box, transform residuals, and stray empty objects.
   - Returns structured JSON metrics along with file paths to rendered PNG verification images.

3. **`blender_run_script`** (Bounded Headless Script Primitive):
   - Executes an arbitrary Python script using `blender --background --python <script.py>`.
   - Supports custom script arguments, configurable timeout, and output tail buffer bounding (8,000 chars default, max 50,000 chars).
   - Guarantees clean process tree termination on timeout.

4. **`blender_locate`** (Executable Discovery):
   - Resolves the local Blender binary across explicit paths, `BLENDER_EXE` environment variable, default Windows/macOS/Linux install paths (newest version first), or `PATH`.

## Runtime Invariants

Every agent invocation respects the following core guarantees:
- **`INV-LOCAL-01` (Zero Network Egress)**: 100% offline, local-first execution. No external network requests, sockets, or telemetry.
- **`INV-HEADLESS-02` (Stateless Execution)**: No resident background daemon, no open TCP port, and no Blender add-on installation required.
- **`INV-SEC-03` (Unprivileged RunAsInvoker)**: Strictly non-elevated user-mode execution. Never requests administrative rights.
- **`INV-BOUND-04` (Bounded Memory Buffers)**: Fixed-size ring buffers prevent memory exhaustion from verbose Blender logging.
- **`INV-SLA-10` (Vulnerability Disclosure SLA)**: 48-hour response acknowledgment and 30-day remediation SLA.

## Configuration & Usage

Add the server to your MCP client configuration (`mcp_config.json`):

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

Or configure via local clone:

```json
{
  "mcpServers": {
    "blender-use": {
      "command": "node",
      "args": ["src/index.js"],
      "cwd": "/path/to/ellmos-blender-use-mcp"
    }
  }
}
```
