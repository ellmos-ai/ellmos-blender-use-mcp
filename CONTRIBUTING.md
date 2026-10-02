# Contributing to ellmos-blender-use-mcp / Mitwirken an ellmos-blender-use-mcp

[English](#english) | [Deutsch](#deutsch)

---

<a id="english"></a>
## English

Thank you for your interest in contributing to **ellmos-blender-use-mcp** (`ellmos-ai/ellmos-blender-use-mcp`), the authoritative Model Context Protocol (MCP) server for local-first, add-on-free, headless Blender FBX reimport QA, four-view visual geometry verification, and bounded background script execution.

### 1. Architectural Principles & 10 Governance Invariants

All contributions must strictly adhere to our core architectural invariants:

1. **100% Local-First & Zero-Egress (`INV-LOCAL-01`)**: All asset QA checks, headless Blender subprocess invocations, and visual verification renders execute strictly locally. Zero telemetry, zero cloud calls, zero outbound network sockets.
2. **Stateless & Add-on-Free Headless Execution (`INV-HEADLESS-02`)**: Spawns isolated, ephemeral `blender --background` child processes. Does not install Blender add-ons, does not open TCP listening ports, and does not maintain persistent background daemons.
3. **Non-Elevation User Mode (`INV-SEC-03`)**: Pure `RunAsInvoker` standard user mode execution. The server and its background scripts require zero administrative elevation, zero root/sudo rights, and zero system daemon registrations.
4. **Strict Timeout & Tail-Buffer Bounding (`INV-BOUND-04`)**: All child process stdout/stderr streams are captured in bounded tail buffers (default 8 KB, max 50 KB) with 15-minute runaway timeouts preventing memory exhaustion.
5. **Deterministic JSON QA & Evidence Integrity (`INV-INTEG-05`)**: Produces reproducible, structured machine-readable JSON reports for mesh counts, material slots, empties, and prefix conventions (`SM_`, `M_`).
6. **Four-View Multi-Angle Visual Verification (`INV-VISUAL-06`)**: Renders standardized orthogonal (front, side, top) and perspective camera views to detect geometry anomalies that structural counts miss (unapplied rotation, floating sub-meshes, pivot displacement).
7. **Fail-Closed Ephemeral Staging & Script Cleanup (`INV-CLEAN-07`)**: Ephemeral Python scripts and temporary render output files are unconditionally purged upon execution completion.
8. **Cross-Platform OS Parity (`INV-CROSS-08`)**: Full compatibility across Windows, POSIX Linux, and macOS across Node.js 18-24.
9. **Cloud-Sync Conflict & Multi-Agent Lock Defense (`INV-SYNC-09`)**: Hardened `.gitignore` preventing cloud-sync collision tokens (`*-WORKSTATION*`, `*-IDEAPAD*`, `*conflicted copy*`) and multi-agent lockfiles (`LOCK*`, `LOCK.user.*`, `LOCK.until.*`, `LOCK.condition.*`).
10. **Bilingual Security SLA (`INV-SLA-10`)**: Binding 48-hour initial response SLA, 5-business-day triage assessment, and 30-day remediation commitment for all reported vulnerabilities via `security@ellmos.ai` and `security@open-bricks.org`.

### 2. Plan D Local Development Workflow

In accordance with our architecture (Plan D), the local git repository serves as the authoritative **Source of Truth**. Development, testing, and commits must take place exclusively in the canonical local clone.

```bash
# Clone the canonical repository
git clone https://github.com/ellmos-ai/ellmos-blender-use-mcp.git
cd ellmos-blender-use-mcp

# Install dependencies
npm install

# Run syntax check and build verification
npm run build

# Run complete automated test suite
npm test
```

### 3. Version Freeze Discipline (`T-20260920-167562623`)

`ellmos-blender-use-mcp` operates under strict version-freeze discipline. Version `0.1.0-alpha.10` in `package.json`, `package-lock.json`, `server.json`, `glama.json`, and documentation badges must not be incremented without explicit release authorization. All technical hygiene, documentation updates, and workflow additions are documented under `## [Unreleased]` in `CHANGELOG.md`.

### 4. Quality Gates

Before submitting a pull request, verify that all local quality gates pass:
1. `npm run build`: Zero syntax errors.
2. `npm test`: 100% green test execution across all 5 test suites (privacy-hygiene, runtime-safety, tool-surface, blender-resolution, manifest-parity).
3. `git diff --check`: Zero whitespace anomalies.
4. `git diff -G"version"`: Zero unauthorized version bumps.

### 5. Statutory Notice (§ 521 BGB) & Liability Disclaimer

This software is provided free of charge as open-source software under the MIT License. In accordance with statutory German law (§ 521 BGB - Gefälligkeitsrecht), liability for defects in quality and title is strictly limited to intentional misconduct (*Vorsatz*) and gross negligence (*grobe Fahrlässigkeit*).

### 6. Security Contact & Vulnerability Reporting

Please report security issues privately:
- Maintainer & Security Team: [security@ellmos.ai](mailto:security@ellmos.ai), [security@open-bricks.org](mailto:security@open-bricks.org), [lukas@ellmos.ai](mailto:lukas@ellmos.ai), [support@lukasgeiger.com](mailto:support@lukasgeiger.com)
- Adhere to the 48h Security Response SLA (`INV-SLA-10`) as detailed in [SECURITY.md](SECURITY.md).

---

<a id="deutsch"></a>
## Deutsch

Vielen Dank für dein Interesse an einer Mitwirkung bei **ellmos-blender-use-mcp** (`ellmos-ai/ellmos-blender-use-mcp`), dem maßgeblichen Model Context Protocol (MCP) Server für lokale, Add-on-freie Headless-Blender FBX-Reimport-Prüfung, 4-Sichten visuelle Geometrieverifikation und ressourcenbegrenzte Python-Hintergrundausführung.

### 1. Architektur-Prinzipien & 10 Governance-Invarianten

Alle Beiträge müssen unsere verbindlichen Kern-Invarianten strikt einhalten:

1. **100% Local-First & Zero-Egress (`INV-LOCAL-01`)**: Alle Asset-QA-Prüfungen, Headless-Blender-Subprozess-Aufrufe und visuellen Verifikations-Renderings laufen ausschließlich lokal ab. Null Telemetrie, null Cloud-Aufrufe, null ausgehende Netzwerk-Sockets.
2. **Zustandslose & Add-on-freie Headless-Ausführung (`INV-HEADLESS-02`)**: Startet isolierte, ephemere `blender --background`-Kindprozesse. Installiert keine Blender-Add-ons, öffnet keine TCP-Netzwerkports und betreibt keine dauerhaften Hintergrund-Daemons.
3. **Rechtefreier Benutzermodus (`INV-SEC-03`)**: Reiner `RunAsInvoker`-Standardbenutzermodus. Der Server und seine Hintergrundskripte erfordern keinerlei administrative Rechte, kein root/sudo und keine System-Daemon-Registrierungen.
4. **Strikte Timeouts & Tail-Puffer-Begrenzung (`INV-BOUND-04`)**: Alle stdout/stderr-Ausgaben von Kindprozessen werden in begrenzten Tail-Puffern (Standard: 8 KB, max: 50 KB) mit 15-Minuten-Runaway-Timeouts abgefangen, um Speicherüberläufe zu verhindern.
5. **Deterministische JSON-QA & Beweissicherheit (`INV-INTEG-05`)**: Erzeugt reproduzierbare, strukturierte maschinenlesbare JSON-Prüfberichte für Mesh-Zahlen, Material-Slots, Empties und Namenspräfix-Konventionen (`SM_`, `M_`).
6. **Vier-Sichten Multi-Winkel Visuelle Verifikation (`INV-VISUAL-06`)**: Rendert standardisierte orthogonale (Vorne, Seite, Oben) und perspektivische Kameraansichten, um Geometriefehler aufzudecken, die reine Zählprüfungen übersehen (nicht angewendete Rotationen, schwebende Sub-Meshes, verschobene Drehpunkte/Pivots).
7. **Ausfallsichere ephemere Bereinigung (`INV-CLEAN-07`)**: Temporäre Python-Skripte und temporäre Render-Ausgabedateien werden nach Abschluss der Ausführung bedingungslos bereinigt.
8. **Plattformübergreifende Betriebssystem-Parität (`INV-CROSS-08`)**: Vollständige Kompatibilität unter Windows, POSIX-Linux und macOS über Node.js 18-24 hinweg.
9. **Cloud-Sync Konflikt- & Lock-Schutz (`INV-SYNC-09`)**: Gehärtete `.gitignore` gegen Cloud-Sync-Konfliktdateien (`*-WORKSTATION*`, `*-IDEAPAD*`, `*conflicted copy*`) und Multi-Agenten-Locks (`LOCK*`, `LOCK.user.*`, `LOCK.until.*`, `LOCK.condition.*`).
10. **Zweisprachige Sicherheits-SLA (`INV-SLA-10`)**: Verbindliche 48-Stunden-Erstantwortgarantie, 5-Werktage-Triage-Zusage und 30-Tage-Behebungszusage für Sicherheitsmeldungen über `security@ellmos.ai` und `security@open-bricks.org`.

### 2. Plan D Lokaler Entwicklungsworkflow

Gemäß unserer Architektur (Plan D) bildet das lokale Git-Repository die alleinige maßgebliche **Source of Truth**. Entwicklung, Tests und Commits finden ausschließlich im kanonischen lokalen Klon statt.

```bash
# Kanonischen Klon verwenden
git clone https://github.com/ellmos-ai/ellmos-blender-use-mcp.git
cd ellmos-blender-use-mcp

# Abhängigkeiten installieren
npm install

# Syntax- und Build-Prüfung ausführen
npm run build

# Vollständige automatisierte Testsuite ausführen
npm test
```

### 3. Version-Freeze-Disziplin (`T-20260920-167562623`)

`ellmos-blender-use-mcp` unterliegt einer strikten Version-Freeze-Disziplin. Die Version `0.1.0-alpha.10` in `package.json`, `package-lock.json`, `server.json`, `glama.json` und Dokumentations-Badges darf ohne ausdrückliche Release-Freigabe nicht erhöht werden. Sämtliche technische Hygiene, Dokumentationsaktualisierungen und Workflow-Ergänzungen werden unter `## [Unreleased]` in `CHANGELOG.md` dokumentiert.

### 4. Qualitäts-Tore (Quality Gates)

Vor dem Einreichen von Änderungen muss verifiziert werden, dass alle lokalen Qualitäts-Tore grün sind:
1. `npm run build`: Null Syntax- oder Buildfehler.
2. `npm test`: 100% grün über alle 5 Testsuiten hinweg (privacy-hygiene, runtime-safety, tool-surface, blender-resolution, manifest-parity).
3. `git diff --check`: Null Whitespace-Fehler.
4. `git diff -G"version"`: Null unautorisierte Versionsänderungen.

### 5. Gesetzlicher Haftungsausschluss (§ 521 BGB Gefälligkeitsrecht)

Diese Software wird unentgeltlich als Open-Source-Software unter der MIT-Lizenz bereitgestellt. Gemäß § 521 BGB (Gefälligkeitsrecht) ist die Haftung für Sach- und Rechtsmängel auf Vorsatz und grobe Fahrlässigkeit beschränkt.

### 6. Sicherheitskontakt & Meldung von Sicherheitslücken

Sicherheitsbefunde bitte vertraulich melden:
- Maintainer & Security-Team: [security@ellmos.ai](mailto:security@ellmos.ai), [security@open-bricks.org](mailto:security@open-bricks.org), [lukas@ellmos.ai](mailto:lukas@ellmos.ai), [support@lukasgeiger.com](mailto:support@lukasgeiger.com)
- Einhaltung der 48h Security Response SLA (`INV-SLA-10`) gemäß [SECURITY.md](SECURITY.md).
