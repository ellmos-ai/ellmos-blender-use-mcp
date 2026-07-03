<p align="center">
  <img src="https://raw.githubusercontent.com/ellmos-ai/ellmos-blender-use-mcp/main/assets/logo.jpg" alt="ellmos Blender Use MCP Logo" width="280">
</p>

# ellmos Blender Use MCP

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
