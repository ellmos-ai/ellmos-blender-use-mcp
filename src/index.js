#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "node:fs/promises";
import * as fsSync from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import updateNotifier from "update-notifier";
import { createRequire } from "node:module";

const DEFAULT_WINDOWS_BLENDER = "C:\\_Local_DEV\\TOOLS\\Blender\\current\\blender.exe";

const server = new McpServer({
  name: "ellmos-blender-use-mcp",
  version: "0.1.0-alpha.1"
});

function fileExists(filePath) {
  try {
    return fsSync.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function findOnPath(command) {
  const pathEnv = process.env.PATH || "";
  const extensions = process.platform === "win32" ? [".exe", ".cmd", ".bat", ""] : [""];
  for (const dir of pathEnv.split(path.delimiter)) {
    for (const ext of extensions) {
      const candidate = path.join(dir, command.endsWith(ext) ? command : `${command}${ext}`);
      if (fileExists(candidate)) return candidate;
    }
  }
  return null;
}

function resolveBlender(explicit) {
  const candidates = [
    explicit,
    process.env.BLENDER_EXE,
    DEFAULT_WINDOWS_BLENDER,
    findOnPath("blender")
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (fileExists(candidate)) return candidate;
  }
  throw new Error("Blender executable not found. Pass blenderPath or set BLENDER_EXE.");
}

function killProcessTree(child) {
  // child.kill() beendet unter Windows nur den direkten Kindprozess; ein Blender,
  // das selbst Subprozesse startet, kann verwaisen. Daher auf Windows den ganzen
  // Prozessbaum per taskkill /T beenden, sonst SIGKILL.
  if (process.platform === "win32" && child.pid) {
    try {
      spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { windowsHide: true });
      return;
    } catch {
      // Fallback auf den Standard-Kill, falls taskkill nicht verfuegbar ist.
    }
  }
  try {
    child.kill("SIGKILL");
  } catch {
    /* Prozess ist moeglicherweise schon beendet. */
  }
}

function boundedTail(text, maxChars) {
  if (text.length <= maxChars) return text;
  return text.slice(text.length - maxChars);
}

async function runProcess(command, args, cwd, timeoutMs) {
  const started = Date.now();
  return await new Promise((resolve) => {
    const child = spawn(command, args, { cwd, windowsHide: true });
    let output = "";
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      killProcessTree(child);
      resolve({ exitCode: null, timedOut: true, output, durationMs: Date.now() - started });
    }, timeoutMs);
    child.stdout.on("data", (chunk) => {
      output += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      output += chunk.toString();
    });
    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ exitCode: code, timedOut: false, output, durationMs: Date.now() - started });
    });
    child.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ exitCode: 1, timedOut: false, output: `${output}\n${error.message}`, durationMs: Date.now() - started });
    });
  });
}

function textResult(value) {
  return {
    content: [{ type: "text", text: JSON.stringify(value, null, 2) }]
  };
}

server.tool(
  "blender_locate",
  "Resolve the local Blender executable used for background automation.",
  { blenderPath: z.string().optional() },
  async ({ blenderPath }) => {
    const resolved = resolveBlender(blenderPath);
    return textResult({ ok: true, blender: resolved });
  }
);

server.tool(
  "blender_run_script",
  "Run Blender in background mode with an explicit Python script and optional script arguments.",
  {
    scriptPath: z.string(),
    cwd: z.string().optional(),
    blenderPath: z.string().optional(),
    scriptArgs: z.array(z.string()).default([]),
    timeoutMs: z.number().int().positive().max(600000).default(120000),
    outputTailChars: z.number().int().positive().max(50000).default(8000)
  },
  async ({ scriptPath, cwd, blenderPath, scriptArgs, timeoutMs, outputTailChars }) => {
    const blender = resolveBlender(blenderPath);
    const resolvedScript = path.resolve(scriptPath);
    if (!fileExists(resolvedScript)) throw new Error(`Script not found: ${resolvedScript}`);
    const resolvedCwd = cwd ? path.resolve(cwd) : path.dirname(resolvedScript);
    const args = ["--background", "--python", resolvedScript];
    if (scriptArgs.length) args.push("--", ...scriptArgs);
    const run = await runProcess(blender, args, resolvedCwd, timeoutMs);
    return textResult({
      ok: run.exitCode === 0 && !run.timedOut,
      blender,
      scriptPath: resolvedScript,
      cwd: resolvedCwd,
      exitCode: run.exitCode,
      timedOut: run.timedOut,
      durationMs: run.durationMs,
      outputTail: boundedTail(run.output, outputTailChars)
    });
  }
);

server.tool(
  "blender_verify_fbx_reimport",
  "Import an FBX in headless Blender and write/read a JSON verification result.",
  {
    fbxPath: z.string(),
    resultPath: z.string().optional(),
    requiredPrefixes: z.array(z.string()).default([]),
    blenderPath: z.string().optional(),
    timeoutMs: z.number().int().positive().max(600000).default(120000)
  },
  async ({ fbxPath, resultPath, requiredPrefixes, blenderPath, timeoutMs }) => {
    const blender = resolveBlender(blenderPath);
    const resolvedFbx = path.resolve(fbxPath);
    if (!fileExists(resolvedFbx)) throw new Error(`FBX not found: ${resolvedFbx}`);
    const outPath = resultPath ? path.resolve(resultPath) : path.join(path.dirname(resolvedFbx), "verify_reimport_result.json");
    const tempScript = path.join(os.tmpdir(), `blender_verify_fbx_${Date.now()}.py`);
    const requiredJson = JSON.stringify(requiredPrefixes);
    const script = `
import bpy, json
from pathlib import Path
fbx_path = Path(${JSON.stringify(resolvedFbx)})
out_path = Path(${JSON.stringify(outPath)})
required = ${requiredJson}
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete()
bpy.ops.import_scene.fbx(filepath=str(fbx_path))
mesh_objects = [obj.name for obj in bpy.context.scene.objects if obj.type == "MESH"]
empty_objects = [obj.name for obj in bpy.context.scene.objects if obj.type == "EMPTY"]
all_names = mesh_objects + empty_objects
materials = sorted({slot.material.name for obj in bpy.context.scene.objects if obj.type == "MESH" for slot in obj.material_slots if slot.material})
missing = [prefix for prefix in required if not any(name.startswith(prefix) for name in all_names)]
result = {"ok": bool(mesh_objects) and not missing, "fbx": str(fbx_path), "mesh_count": len(mesh_objects), "empty_count": len(empty_objects), "material_count": len(materials), "materials": materials, "missing_prefixes": missing, "script_free": True}
out_path.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
if not result["ok"]:
    raise SystemExit(1)
`;
    await fs.writeFile(tempScript, script, "utf-8");
    const run = await runProcess(blender, ["--background", "--python", tempScript], path.dirname(resolvedFbx), timeoutMs);
    let verification = null;
    try {
      verification = JSON.parse(await fs.readFile(outPath, "utf-8"));
    } catch {
      verification = null;
    }
    await fs.rm(tempScript, { force: true });
    return textResult({
      ok: run.exitCode === 0 && !run.timedOut && Boolean(verification),
      blender,
      fbxPath: resolvedFbx,
      resultPath: outPath,
      exitCode: run.exitCode,
      timedOut: run.timedOut,
      durationMs: run.durationMs,
      verification,
      outputTail: boundedTail(run.output, 8000)
    });
  }
);

async function main() {
  // Update-Hinweis nur im interaktiven Terminal — niemals im stdio-/MCP-Betrieb (Protokoll-Schutz)
  if (process.stdout.isTTY) {
    try {
      updateNotifier({ pkg: createRequire(import.meta.url)("../package.json") }).notify();
    } catch { /* Update-Check darf den Start nie blockieren */ }
  }
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
