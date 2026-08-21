# Security Policy / Sicherheitsrichtlinie

[English](#english) | [Deutsch](#deutsch)

---

<a name="english"></a>
## English

### Security Overview

`ellmos-blender-use-mcp` is an asset-QA Model Context Protocol (MCP) server for automated, headless Blender FBX reimport verification and background Python script runs. Because it executes local scripts within Blender, security, isolation, and bounded resource consumption are fundamental design constraints.

### Threat Model & Execution Isolation

1. **Headless and Stateless Process Lifecycle**:
   - Each tool invocation spawns a fresh `blender --background` child process.
   - The server **does not** install Blender add-ons, **does not** open TCP listening ports, and **does not** maintain resident background daemons.
   - All ephemeral state is discarded upon process termination.

2. **Process Tree Termination & Orphan Prevention**:
   - Under Windows, child processes are terminated using `taskkill /pid <PID> /T /F` to ensure any spawned subprocesses are cleanly killed and do not become orphaned.
   - Under POSIX environments, `SIGKILL` signals are dispatched to the process tree.

3. **Bounded Memory & Tail Buffer Protection**:
   - Standard output and error streams are captured into a bounded tail buffer (default: 8,000 characters, maximum configurable: 50,000 characters).
   - When output exceeds the limit, earlier output is discarded and `outputTruncated: true` is reported, preventing memory exhaustion attacks from verbose scripts.

4. **Local Python Trust Boundaries & Non-Elevation**:
   - The server executes Python scripts inside Blender in normal user-mode (no privilege escalation requested or required).
   - Only asset files and scripts from trusted local sources should be processed.
   - The server does not download scripts or assets from remote repositories or marketplaces.

5. **Local-First, Zero-Egress & Zero Telemetry**:
   - No tracking, usage analytics, telemetry, or external API calls are performed (100% offline & zero-egress).
   - All operations operate entirely local-first.

### Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |
| < 0.1.0 | No        |

### Reporting a Vulnerability

If you discover a potential security issue in `ellmos-blender-use-mcp`:

1. Please do **not** open a public issue on GitHub.
2. Report the vulnerability privately via GitHub Security Advisories or by contacting the maintainers directly at [security@ellmos.ai](mailto:security@ellmos.ai), [lukas@ellmos.ai](mailto:lukas@ellmos.ai), or [support@lukasgeiger.com](mailto:support@lukasgeiger.com).
3. Provide a clear description of the vulnerability, steps to reproduce, and potential impact.
4. We acknowledge receipt within 48 hours and coordinate a coordinated disclosure timeline.

---

<a name="deutsch"></a>
## Deutsch

### Sicherheitsüberblick

`ellmos-blender-use-mcp` ist ein Asset-QA Model Context Protocol (MCP) Server für automatisierte, headless Blender FBX-Reimport-Verifikation und Python-Hintergrundausführungen. Da lokaler Python-Code innerhalb von Blender ausgeführt wird, sind Isolation, Ressourcenschonung und Local-First-Prinzipien grundlegende Sicherheitsvorgaben.

### Bedrohungsmodell & Prozess-Isolation

1. **Headless & Zustandsloser Prozess-Lebenszyklus**:
   - Jeder Werkzeugaufruf startet einen neuen, isolierten `blender --background` Kindprozess.
   - Der Server installiert **keine** Blender-Add-ons, öffnet **keine** TCP-Netzwerkports und betreibt **keine** dauerhaften Hintergrund-Daemons.
   - Sämtliche temporären Skripte und Zustände werden nach Prozessende rückstandslos bereinigt.

2. **Prozessbaum-Beendigung & Schutz vor verwaisten Prozessen**:
   - Unter Windows werden Prozesse via `taskkill /pid <PID> /T /F` inklusive aller Subprozesse sauber beendet.
   - Unter POSIX-Systemen (Linux / macOS) werden `SIGKILL`-Signale an den Prozessbaum gesendet.

3. **Begrenzter Speicher & Tail-Pufferschutz**:
   - Standard- und Fehler-Ausgaben werden in einem begrenzten Tail-Puffer (Standard: 8.000 Zeichen, konfigurierbar bis 50.000 Zeichen) gehalten.
   - Bei Überschreitung wird ältere Ausgabe verworfen und `outputTruncated: true` gemeldet, was Speicherüberläufe durch geschwätzige Skripte verhindert.

4. **Vertrauensgrenzen & Benutzer-Modus (Non-Elevation)**:
   - Skripte laufen ausschließlich im unprivilegierten Benutzer-Modus.
   - Nur vertrauenswürdige lokale Skripte und FBX-Dateien verarbeiten.
   - Es werden keine externen Skripte oder Assets aus dem Netz geladen.

5. **100% Offline, Zero-Egress & Keine Telemetrie**:
   - Keinerlei Telemetrie, Tracking oder ausgehende Netzwerkverbindungen.
   - Vollständiger Local-First-Betrieb.

### Meldung von Sicherheitslücken

Sollten Sie eine Sicherheitslücke entdecken:

1. Eröffnen Sie bitte **kein** öffentliches GitHub-Issue.
2. Melden Sie den Befund vertraulich über GitHub Security Advisories oder per E-Mail an [security@ellmos.ai](mailto:security@ellmos.ai), [lukas@ellmos.ai](mailto:lukas@ellmos.ai) oder [support@lukasgeiger.com](mailto:support@lukasgeiger.com).
3. Wir bestätigen den Eingang innerhalb von 48 Stunden und koordinieren die Behebung.

