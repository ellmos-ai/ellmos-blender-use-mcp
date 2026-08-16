# Security Policy

## Security Overview

`ellmos-blender-use-mcp` is an asset-QA Model Context Protocol (MCP) server for automated, headless Blender FBX reimport verification and background Python script runs. Because it executes local scripts within Blender, security, isolation, and bounded resource consumption are fundamental design constraints.

## Threat Model & Execution Isolation

1. **Headless and Stateless Process Lifecycle**:
   - Each tool invocation spawns a fresh `blender --background` child process.
   - The server **does not** install Blender add-ons, **does not** open TCP listening ports, and **does not** maintain resident background daemons.
   - All state is discarded upon process termination.

2. **Process Tree Termination & Orphan Prevention**:
   - Under Windows, child processes are terminated using `taskkill /pid <PID> /T /F` to ensure any spawned subprocesses are cleanly killed and do not become orphaned.
   - Under POSIX environments, `SIGKILL` signals are dispatched to the process tree.

3. **Bounded Memory & Tail Buffer Protection**:
   - Standard output and error streams are captured into a bounded tail buffer (default: 8,000 characters, maximum configurable: 50,000 characters).
   - When output exceeds the limit, earlier output is discarded and `outputTruncated: true` is reported, preventing memory exhaustion attacks from verbose scripts.

4. **Local Python Trust Boundaries**:
   - The server executes Python scripts inside Blender. Only asset files and scripts from trusted local sources should be processed.
   - The server does not download scripts or assets from remote repositories or marketplaces.

5. **Zero Telemetry & Zero Outbound Network Requests**:
   - No tracking, usage analytics, telemetry, or external API calls are performed.
   - All operations operate entirely local-first.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |
| < 0.1.0 | No        |

## Reporting a Vulnerability

If you discover a potential security issue in `ellmos-blender-use-mcp`:

1. Please do **not** open a public issue on GitHub.
2. Report the vulnerability privately via GitHub Security Advisories or by contacting the maintainers directly at [lukas@ellmos.ai](mailto:lukas@ellmos.ai).
3. Provide a clear description of the vulnerability, steps to reproduce, and potential impact.
4. We acknowledge receipt within 48 hours and coordinate a coordinated disclosure timeline.
