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

// 6. Security and Documentation existence & parity
const securityMd = readFileSync(path.join(root, "SECURITY.md"), "utf8");
assert.ok(existsSync(path.join(root, "SECURITY.md")), "SECURITY.md must exist");
assert.ok(securityMd.includes("security@ellmos.ai"), "SECURITY.md missing security@ellmos.ai contact");
assert.ok(securityMd.includes("lukas@ellmos.ai"), "SECURITY.md missing lukas@ellmos.ai contact");
assert.ok(securityMd.includes("support@lukasgeiger.com"), "SECURITY.md missing support@lukasgeiger.com contact");
assert.ok(securityMd.includes("GitHub Security Advisories"), "SECURITY.md missing GitHub Security Advisories reference");
assert.ok(securityMd.includes("## English"), "SECURITY.md missing English section");
assert.ok(securityMd.includes("## Deutsch"), "SECURITY.md missing Deutsch section");

// 7. Readme structure, badges & diagram parity
assert.ok(readmeEn.includes("ellmos-blender-use-mcp"), "README.md missing package name");
assert.ok(readmeDe.includes("ellmos-blender-use-mcp"), "README_de.md missing package name");
assert.ok(readmeEn.includes("sequenceDiagram"), "README.md missing sequenceDiagram");
assert.ok(readmeDe.includes("sequenceDiagram"), "README_de.md missing sequenceDiagram");
assert.ok(readmeEn.includes("Platform"), "README.md missing Platform badge");
assert.ok(readmeDe.includes("Plattform"), "README_de.md missing Plattform badge");
assert.ok(readmeEn.includes("Privacy"), "README.md missing Privacy badge");
assert.ok(readmeDe.includes("Privatsph"), "README_de.md missing Privatsphäre badge");
assert.ok(readmeEn.includes("SECURITY.md"), "README.md missing SECURITY.md reference");
assert.ok(readmeDe.includes("SECURITY.md"), "README_de.md missing SECURITY.md reference");
assert.ok(readmeEn.includes("open-bricks"), "README.md missing open-bricks reference");
assert.ok(readmeDe.includes("open-bricks"), "README_de.md missing open-bricks reference");

// 8. CI workflow sanity
const ciYml = readFileSync(path.join(root, ".github", "workflows", "ci.yml"), "utf8");
assert.ok(ciYml.includes("actions/checkout@v4"), "ci.yml must use checkout@v4");
assert.ok(ciYml.includes("npm test"), "ci.yml must run npm test");

// 9. Third-party licenses inventory parity
const thirdPartyLicenses = readFileSync(path.join(root, "THIRD_PARTY_LICENSES.md"), "utf8");
assert.ok(existsSync(path.join(root, "THIRD_PARTY_LICENSES.md")), "THIRD_PARTY_LICENSES.md must exist");
for (const dep of Object.keys(pkg.dependencies || {})) {
  assert.ok(
    thirdPartyLicenses.includes(`\`${dep}\``),
    `THIRD_PARTY_LICENSES.md missing runtime dependency: ${dep}`
  );
}

// 10. Gitignore security & sync-conflict protection rules
const gitignore = readFileSync(path.join(root, ".gitignore"), "utf8");
assert.ok(gitignore.includes(".npmrc"), ".gitignore must ignore .npmrc");
assert.ok(gitignore.includes("*.pem"), ".gitignore must ignore *.pem certificates");
assert.ok(gitignore.includes("*.key"), ".gitignore must ignore *.key private keys");
assert.ok(gitignore.includes("*-WORKSTATION-LG*"), ".gitignore must ignore *-WORKSTATION-LG* sync conflicts");
assert.ok(gitignore.includes("*-ASUS-GEI*"), ".gitignore must ignore *-ASUS-GEI* sync conflicts");

console.log("All manifest-parity and metadata contract tests passed successfully.");

