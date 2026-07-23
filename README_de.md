<p align="center">
  <img src="https://raw.githubusercontent.com/ellmos-ai/ellmos-blender-use-mcp/main/assets/logo.jpg" alt="ellmos Blender Use MCP Logo" width="280">
</p>

# ellmos Blender Use MCP

**🇬🇧 [English version](README.md)**

*Teil der [ellmos-ai](https://github.com/ellmos-ai)-Familie.*

[![npm version](https://img.shields.io/npm/v/ellmos-blender-use-mcp.svg)](https://www.npmjs.com/package/ellmos-blender-use-mcp)
[![npm downloads](https://img.shields.io/npm/dt/ellmos-blender-use-mcp.svg)](https://www.npmjs.com/package/ellmos-blender-use-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)

📦 **[Auf npm ansehen →](https://www.npmjs.com/package/ellmos-blender-use-mcp)**

Ein Asset-QA-Werkzeug für Game- und 3D-Asset-Pipelines: prüft, ob eine exportierte FBX-Datei im headless Blender tatsächlich sauber re-importiert — Mesh-Anzahl, Material-Anzahl und geforderte Namens-Präfixe werden automatisch geprüft, mit einem deterministischen JSON-Ergebnis statt einer manuellen Sichtprüfung. `blender_verify_fbx_reimport` ist das Kern-Tool; `blender_locate` und `blender_run_script` sind die allgemeinen Bausteine, auf denen es aufbaut.

**Kein Add-on. Kein TCP-Port. Kein Hintergrund-Daemon.** Dieser Server installiert nichts in Blender, öffnet keinen Socket für eine laufende Blender-Instanz und hält Blender nicht dauerhaft im Speicher. Jeder Aufruf startet `blender --background --python <script.py>`, wartet auf ein zeitlich begrenztes, timeout-geschütztes Ende und gibt das Ergebnis zurück — headless und zustandslos per Design. Es werden keine Assets heruntergeladen und keine Telemetrie erfasst.

**Abgrenzung zu anderen Blender-MCP-Servern.** Die meisten Blender-MCP-Projekte (z. B. `ahujasid/blender-mcp`, der offizielle Blender-Labs-MCP-Server) steuern eine *laufende* Blender-GUI live über eine TCP-/Add-on-Brücke für interaktive Szenenbearbeitung — ein anderer Anwendungsfall mit einem anderen Vertrauensmodell (ein offener Socket, ein installiertes Add-on, ein dauerhaft laufender Prozess). Dieser Server zielt stattdessen auf **CI-artige, einmalige Asset-Verifikation**: in einem Pipeline-Schritt ausführen, ein Pass/Fail-JSON erhalten, weitermachen. Wer live GUI-Kontrolle braucht, nutzt dafür separat ein geprüftes Blender-MCP-Add-on (siehe Sicherheit unten).

## Tools

| Tool | Zweck |
|---|---|
| `blender_verify_fbx_reimport` | Erzeugt ein temporäres Blender-Verifikationsskript, importiert eine FBX-Datei und schreibt ein JSON-Ergebnis mit Mesh-/Material-Anzahl und fehlenden Pflicht-Präfixen. |
| `blender_run_script` | Führt `blender --background --python <script.py>` mit optionalen Argumenten und begrenztem stdout-Tail aus. |
| `blender_locate` | Löst die Blender-Executable auf — aus einem expliziten Pfad, `BLENDER_EXE`, dem verifizierten lokalen Standard oder PATH. |

## Sicherheit

- Dieser Server führt lokalen Python-Code innerhalb von Blender aus. Nur vertrauenswürdige Skripte und Asset-Pfade verwenden.
- Der Standard-Timeout ist begrenzt.
- Keine Remote-Asset-Marktplätze, API-Schlüssel oder Telemetrie enthalten.
- Für live GUI-Kontrolle separat ein geprüftes Blender-MCP-Add-on nutzen.

## Installation

### Option 1: Über npx ausführen (keine Installation nötig)

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

### Option 2: Aus dem Quellcode installieren

```bash
git clone https://github.com/ellmos-ai/ellmos-blender-use-mcp.git
cd ellmos-blender-use-mcp
npm install
npm run build
node src/index.js
```

Bei einem lokalen Checkout `command`/`args` stattdessen auf das geklonte `src/index.js` zeigen lassen:

```json
{
  "mcpServers": {
    "blender-use": {
      "command": "node",
      "args": ["<pfad-zum-repo>/src/index.js"]
    }
  }
}
```

## Konfiguration

- `BLENDER_EXE` — optionaler Pfad zur Blender-Executable. Ohne diesen versuchen die Tools zuerst das explizite `blenderPath`-Argument, dann `BLENDER_EXE`, dann einen verifizierten lokalen Windows-Standard, dann PATH.
- Jedes Tool akzeptiert zusätzlich ein explizites `blenderPath`-Argument pro Aufruf, das Vorrang vor `BLENDER_EXE` hat.
- Prozessausgabe wird nur als Tail gehalten: `blender_run_script` nutzt standardmäßig 8.000 Zeichen (konfigurierbar bis 50.000), die FBX-Verifikation 8.000. `outputTruncated: true` zeigt an, dass frühere Ausgabe verworfen wurde. Auch sehr gesprächige Blender-Skripte können den MCP-Prozess dadurch nicht unbegrenzt mit Ausgabe im Speicher wachsen lassen.

## Lizenz

MIT — siehe [LICENSE](LICENSE).

---

## ellmos-ai-Ökosystem

Dieser MCP-Server ist Teil des **[ellmos-ai](https://github.com/ellmos-ai)**-Ökosystems — KI-Infrastruktur, MCP-Server und intelligente Werkzeuge.

### MCP-Server-Familie

| Server | Tools | Fokus | npm |
|--------|-------|-------|-----|
| [FileCommander](https://github.com/ellmos-ai/ellmos-filecommander-mcp) | 46 | Dateisystem, Prozessverwaltung, interaktive Sitzungen, Cloud-Lock-sichere Operationen | [`ellmos-filecommander-mcp`](https://www.npmjs.com/package/ellmos-filecommander-mcp) |
| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 22 | Code-Analyse, JSON-Reparatur, Imports, Diffs, Regex | [`ellmos-codecommander-mcp`](https://www.npmjs.com/package/ellmos-codecommander-mcp) |
| [Clatcher](https://github.com/ellmos-ai/ellmos-clatcher-mcp) | 12 | Dateireparatur, Formatkonvertierung, Batch-Operationen | [`ellmos-clatcher-mcp`](https://www.npmjs.com/package/ellmos-clatcher-mcp) |
| [n8n Manager](https://github.com/ellmos-ai/n8n-manager-mcp) | 18 | n8n-Workflow-Verwaltung über KI-Assistenten | [`n8n-manager-mcp`](https://www.npmjs.com/package/n8n-manager-mcp) |
| [ControlCenter](https://github.com/ellmos-ai/ellmos-controlcenter-mcp) | 20 | MCP-Stack-Discovery, Profilverwaltung, Control Plane | [`ellmos-controlcenter-mcp`](https://www.npmjs.com/package/ellmos-controlcenter-mcp) |
| [Homebase](https://github.com/ellmos-ai/ellmos-homebase-mcp) | 45 | Local-first LLM-Gedächtnis, Wissen, Zustand, Routing, Schwarm-Orchestrierung | [`ellmos-homebase-mcp`](https://www.npmjs.com/package/ellmos-homebase-mcp) (alpha) |
| [ServerCommander](https://github.com/ellmos-ai/ellmos-servercommander-mcp) | 8 | Server-Operationen: Health-Checks, Log-Analyse, Deploy-Dry-Runs, Mail-Diagnose | [`ellmos-servercommander-mcp`](https://www.npmjs.com/package/ellmos-servercommander-mcp) (alpha) |
| **[Blender Use](https://github.com/ellmos-ai/ellmos-blender-use-mcp)** | **3** | **Headless Blender-Asset-QA und FBX-Reimport-Verifikation** | **[`ellmos-blender-use-mcp`](https://www.npmjs.com/package/ellmos-blender-use-mcp)** (alpha) |
| [Open Compute](https://github.com/ellmos-ai/open-compute-mcp) | 10 | Modell-agnostischer Computer-Use: Capture, safety-gated Aktionen, Windows-UIA | [`open-compute-mcp`](https://www.npmjs.com/package/open-compute-mcp) (alpha) |

### KI-Infrastruktur

| Projekt | Beschreibung |
|---------|-------------|
| [BACH](https://github.com/ellmos-ai/bach) | Local-first textbasiertes OS für LLM-Agenten — 113+ Handler, 550+ Tools, SQLite-Memory |
| [open-compute](https://github.com/ellmos-ai/open-compute) | Modell-agnostischer Computer-Use-Kern hinter Open Compute MCP |
| [clutch](https://github.com/ellmos-ai/clutch) | Provider-neutrale LLM-Orchestrierung mit Auto-Routing und Budget-Tracking |
| [rinnsal](https://github.com/ellmos-ai/rinnsal) | Leichte Agent-Memory-, Connector- und Automatisierungsinfrastruktur |
| [ellmos-stack](https://github.com/ellmos-ai/ellmos-stack) | Self-hosted AI Research Stack (Ollama + n8n + Rinnsal + KnowledgeDigest) |
| [MarbleRun](https://github.com/ellmos-ai/MarbleRun) | Autonomes Agent-Chain-Framework für Claude Code |
| [gardener](https://github.com/ellmos-ai/gardener) | Minimalistischer datenbankgetriebener LLM-OS-Prototyp (4 Funktionen, 1 Tabelle) |
| [ellmos-tests](https://github.com/ellmos-ai/ellmos-tests) | Testframework für LLM-Betriebssysteme (7 Dimensionen) |

### Desktop-Software

Unsere Partnerorganisation **[open-bricks](https://github.com/open-bricks)** bündelt KI-native Desktop-Anwendungen: eine moderne Open-Source-Softwaresuite für Datei-, Dokumenten- und Entwicklerwerkzeuge.
