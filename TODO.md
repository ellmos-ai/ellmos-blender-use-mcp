# TASKPLAN-Aufgabenregister — ellmos-blender-use-mcp

Stand: 2026-11-03  |  Rolle: TASKSOLVER  |  Projekt: `ellmos-blender-use-mcp`

Dieses Register hält den aktuellen Sicherheits- und Wartungsstatus fest. Die
vollständigen Aufgabenbeschreibungen, Quellen, Definition of Done, Blocker und
Zuständigkeiten liegen kanonisch in TASKPLAN; die stabilen IDs unten sind maßgeblich.

## Projektfunktion und Ist-Stand

`ellmos-blender-use-mcp` ist ein lokaler, headless Model Context Protocol (MCP) Server
für automatisierte Blender-FBX-Reimport-Verifikation, Hintergrundskripte und 4-Ansichten-
Geometrieprüfung (Local-First, Zero-Egress, unprivileged RunAsInvoker).

- Arbeitsbaum sauber; Git-Status synchron mit origin/main auf Version 0.1.0-alpha.10.
- Alle Testsuiten (privacy-hygiene, runtime-safety, tool-surface, blender-resolution,
  manifest-parity) 100% grün.
- Version 0.1.0-alpha.10 strikt eingefroren per T-20260920-167562623.

## Abgeschlossene TASKPLAN-Aufgaben

| ID | Aufgabe | Status | Abschluss | Lösung |
| --- | --- | --- | --- | --- |
| `BLENDER-SECURITY-001` (TASKPLAN #2201) | Produktions- und transitive Abhängigkeiten gegen aktuellen npm-Audit-Befund härten | ERLEDIGT | 2026-11-03 | Overrides & SDK/Zod-Härtung (`@modelcontextprotocol/sdk@^1.32.2`, `zod@^4.6.7`, Overrides für hono, @hono/node-server, fast-uri, ip-address, qs, proxy-addr, source-map-js, body-parser; 0 Schwachstellen across 150 packages) |

## Offene TASKPLAN-Aufgaben

| ID | Aufgabe | Priorität | Aufwand | Scope | Quelle |
| --- | --- | --- | --- | --- | --- |
| `BLENDER-RELEASE-002` (TASKPLAN #2202) | Blender-Use alpha.10 mit npm dist-tags abgleichen bei Bedarf | niedrig | special | local | npm-Dist-Tags, Registry-Synchronisation |
