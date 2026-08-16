import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const server = JSON.parse(readFileSync(path.join(root, "server.json"), "utf8"));
const glama = JSON.parse(readFileSync(path.join(root, "glama.json"), "utf8"));
const readmeEn = readFileSync(path.join(root, "README.md"), "utf8");
const readmeDe = readFileSync(path.join(root, "README_de.md"), "utf8");
const llmsTxt = readFileSync(path.join(root, "llms.txt"), "utf8");

// 1. Version parity across manifests
assert.equal(server.version, pkg.version, "server.json version mismatch");
assert.equal(glama.version, pkg.version, "glama.json version mismatch");
assert.equal(server.packages[0].version, pkg.version, "server.json package[0] version mismatch");

// 2. Package and identifier parity
assert.equal(server.packages[0].identifier, pkg.name, "server.json package identifier mismatch");
assert.equal(glama.name, pkg.name, "glama.json package name mismatch");
assert.equal(server.name, pkg.mcpName, "server.json MCP name mismatch");

// 3. License parity
assert.equal(glama.license, pkg.license, "glama.json license mismatch");

// 4. Packaging files existence
assert.ok(pkg.files.includes("SECURITY.md"), "SECURITY.md must be included in package.json files");
for (const relPath of pkg.files) {
  const target = path.join(root, relPath);
  assert.ok(existsSync(target), `Packaged file or directory missing: ${relPath}`);
}

// 5. Tool count consistency in glama.json and llms.txt
assert.equal(glama.tools.count, 3, "glama.json tool count mismatch (expected 3)");
assert.ok(llmsTxt.includes("blender_verify_fbx_reimport"), "llms.txt missing blender_verify_fbx_reimport tool");
assert.ok(llmsTxt.includes("blender_run_script"), "llms.txt missing blender_run_script tool");
assert.ok(llmsTxt.includes("blender_locate"), "llms.txt missing blender_locate tool");

// 6. Security and Documentation existence
assert.ok(existsSync(path.join(root, "SECURITY.md")), "SECURITY.md must exist");
assert.ok(readmeEn.includes("ellmos-blender-use-mcp"), "README.md missing package name");
assert.ok(readmeDe.includes("ellmos-blender-use-mcp"), "README_de.md missing package name");

console.log("All manifest-parity tests passed successfully.");
