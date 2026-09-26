import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const packageLock = JSON.parse(readFileSync(path.join(root, "package-lock.json"), "utf8"));
const server = JSON.parse(readFileSync(path.join(root, "server.json"), "utf8"));
const glama = JSON.parse(readFileSync(path.join(root, "glama.json"), "utf8"));
const readmeEn = readFileSync(path.join(root, "README.md"), "utf8");
const readmeDe = readFileSync(path.join(root, "README_de.md"), "utf8");
const llmsTxt = readFileSync(path.join(root, "llms.txt"), "utf8");

// 1. Version parity across manifests & strict version freeze discipline (T-20260920-167562623)
assert.equal(pkg.version, "0.1.0-alpha.10", "version must remain strictly frozen at 0.1.0-alpha.10");
assert.equal(server.version, pkg.version, "server.json version mismatch");
assert.equal(glama.version, pkg.version, "glama.json version mismatch");
assert.equal(server.packages[0].version, pkg.version, "server.json package[0] version mismatch");
assert.equal(packageLock.version, pkg.version, "package-lock.json version mismatch");
assert.equal(packageLock.name, pkg.name, "package-lock.json name mismatch");
assert.equal(packageLock.packages[""].version, pkg.version, "package-lock.json root version mismatch");
assert.equal(packageLock.packages[""].name, pkg.name, "package-lock.json root name mismatch");

// 2. Package and identifier parity
assert.equal(server.packages[0].identifier, pkg.name, "server.json package identifier mismatch");
assert.equal(glama.name, pkg.name, "glama.json package name mismatch");
assert.equal(server.name, pkg.mcpName, "server.json MCP name mismatch");

// 3. License & NOTICE parity
assert.equal(glama.license, pkg.license, "glama.json license mismatch");
assert.ok(existsSync(path.join(root, "NOTICE")), "Canonical root NOTICE file must exist");
assert.ok(pkg.files.includes("NOTICE"), "package.json files array must include NOTICE");

// 4. Packaging files existence
assert.ok(pkg.files.includes("SECURITY.md"), "SECURITY.md must be included in package.json files");
assert.ok(pkg.files.includes("THIRD_PARTY_LICENSES.md"), "THIRD_PARTY_LICENSES.md must be included in package.json files");
assert.ok(pkg.files.includes("scripts/verify_asset_visual.py"), "scripts/verify_asset_visual.py must be specifically included in package.json files");
assert.ok(!pkg.files.includes("scripts/"), "package.json files must not wildcard package scripts/ to avoid pycache leaks");
for (const relPath of pkg.files) {
  const target = path.join(root, relPath);
  assert.ok(existsSync(target), `Packaged file or directory missing: ${relPath}`);
}

// 5. Tool count consistency in glama.json and llms.txt
const indexSrc = readFileSync(path.join(root, "src", "index.js"), "utf8");
const registeredTools = [...indexSrc.matchAll(/server\.tool\(\s*["'`]([a-z0-9_]+)["'`]/gi)].map((m) => m[1]);
assert.ok(registeredTools.length > 0, "no server.tool() registrations found in src/index.js");
assert.equal(
  glama.tools.count,
  registeredTools.length,
  `glama.json tool count mismatch (manifest says ${glama.tools.count}, src/index.js registers ${registeredTools.length}: ${registeredTools.join(", ")})`
);
// Every registered tool must be documented in llms.txt -- that file is what agents read.
for (const toolName of registeredTools) {
  assert.ok(llmsTxt.includes(toolName), `llms.txt missing ${toolName} tool`);
  assert.ok(readmeEn.includes(toolName), `README.md missing ${toolName} tool`);
  assert.ok(readmeDe.includes(toolName), `README_de.md missing ${toolName} tool`);
}
assert.match(readmeEn, /\| \*\*\[Blender Use\][^\n]+\| \*\*4\*\* \|/, "README.md Blender Use family tool count mismatch");
assert.match(readmeDe, /\| \*\*\[Blender Use\][^\n]+\| \*\*4\*\* \|/, "README_de.md Blender Use family tool count mismatch");
assert.ok(readmeEn.includes("T4 -->"), "README.md architecture does not connect the fourth tool");
assert.ok(readmeDe.includes("T4 -->"), "README_de.md architecture does not connect the fourth tool");
assert.match(llmsTxt, /## Last-checked:\s*2026-09-\d{2}/, "llms.txt check date is stale");
assert.ok(llmsTxt.includes("Last-checked: 2026-09-22"), "llms.txt must reflect Last-checked: 2026-09-22");

const capabilityTerms = ["executable discovery", "background script", "structural FBX reimport", "four-view visual"];
for (const [manifestName, description] of [
  ["package.json", pkg.description],
  ["server.json", server.description],
  ["glama.json", glama.description]
]) {
  for (const term of capabilityTerms) {
    assert.ok(description.includes(term), `${manifestName} description missing capability: ${term}`);
  }
}

// 6. Security and Documentation existence & parity
const securityMd = readFileSync(path.join(root, "SECURITY.md"), "utf8");
assert.ok(existsSync(path.join(root, "SECURITY.md")), "SECURITY.md must exist");
assert.ok(securityMd.includes("security@open-bricks.org"), "SECURITY.md missing security@open-bricks.org contact");
assert.ok(securityMd.includes("security@ellmos.ai"), "SECURITY.md missing security@ellmos.ai contact");
assert.ok(securityMd.includes("lukas@ellmos.ai"), "SECURITY.md missing lukas@ellmos.ai contact");
assert.ok(securityMd.includes("support@lukasgeiger.com"), "SECURITY.md missing support@lukasgeiger.com contact");
assert.ok(securityMd.includes("GitHub Security Advisories"), "SECURITY.md missing GitHub Security Advisories reference");
assert.ok(securityMd.includes("## English"), "SECURITY.md missing English section");
assert.ok(securityMd.includes("## Deutsch"), "SECURITY.md missing Deutsch section");
assert.ok(securityMd.includes("INV-SLA-10"), "SECURITY.md missing INV-SLA-10 remediation SLA reference");
assert.ok(securityMd.includes("30 calendar days"), "SECURITY.md English missing 30 calendar days SLA");
assert.ok(securityMd.includes("30 Kalendertagen"), "SECURITY.md Deutsch missing 30 Kalendertagen SLA");

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
assert.ok(readmeDe.includes("Privatsphäre"), "README_de.md must use the real umlaut in Privatsphäre");

const visualScript = readFileSync(path.join(root, "scripts", "verify_asset_visual.py"), "utf8");
for (const [fileName, text] of [["README_de.md", readmeDe], ["scripts/verify_asset_visual.py", visualScript]]) {
  assert.ok(!text.includes("\uFFFD"), `${fileName} contains U+FFFD replacement characters`);
  assert.ok(!/[ÃÂ][\u0080-\u00ff]/u.test(text), `${fileName} contains likely mojibake`);
}
const germanReplacementForms = [
  "Privatsphaere", "fuer", "Ergaenzt", "ausserhalb", "Sichtpruefung", "unabhaengig",
  "ueberschreibbar", "Ungueltige", "pruefenden", "Hoehen", "zusaetzlich", "ueberspringen",
  "haeufig", "vollstaendig", "Datenbloecke", "Laeufen", "aufraeumen", "zaehlt", "Prueft",
  "Pruefung", "EINSCHRAENKUNG", "Staerke", "Ueber", "unberuehrt", "beruehren",
  "ueberschneiden", "noetig", "Plausibilitaet", "zaehlen", "standardmaessig", "wuerde"
];
for (const [fileName, text] of [["README_de.md", readmeDe], ["scripts/verify_asset_visual.py", visualScript]]) {
  for (const form of germanReplacementForms) {
    assert.ok(!text.includes(form), `${fileName} contains German replacement form: ${form}`);
  }
}

// 8. 18-Point Bilingual Quick Navigation & Reciprocal Dual Anchors
const expectedNavAnchors = [
  ["key-capabilities", "kernfaehigkeiten"],
  ["target-personas--discoverability", "zielgruppen--auffindbarkeit"],
  ["comparative-matrix-vs-alternatives", "vergleichsmatrix-gegenueber-alternativen"],
  ["architecture--workflow", "architektur--workflow"],
  ["headless-verification-lifecycle", "headless-verifikations-lebenszyklus"],
  ["tools", "werkzeuge"],
  ["blender_verify_fbx_reimport", "blender_verify_fbx_reimport-de"],
  ["blender_verify_visual", "blender_verify_visual-de"],
  ["general-purpose-primitives", "allgemeine-basis-werkzeuge"],
  ["cicd-pipeline-integration", "cicd-pipeline-integration-de"],
  ["governance--runtime-invariants", "governance--laufzeit-invarianten"],
  ["security-policy", "sicherheitsrichtlinie"],
  ["installation", "installation-de"],
  ["configuration", "konfiguration-de"],
  ["third-party-licenses--level-1-sbom", "drittanbieter-lizenzen--level-1-sbom"],
  ["ellmos-ai-ecosystem", "ellmos-ai-oekosystem"],
  ["llm-context-index", "llm-kontextindex"],
  ["license--statutory-disclaimer", "lizenz--haftungsausschluss"]
];

assert.equal(expectedNavAnchors.length, 18, "Navigation must contain exactly 18 reciprocal anchors");

for (const [enAnchor, deAnchor] of expectedNavAnchors) {
  // Dual reciprocal anchors must exist in both READMEs
  assert.ok(
    readmeEn.includes(`id="${enAnchor}"`) && readmeEn.includes(`id="${deAnchor}"`),
    `README.md missing dual reciprocal anchor for ${enAnchor} / ${deAnchor}`
  );
  assert.ok(
    readmeDe.includes(`id="${enAnchor}"`) && readmeDe.includes(`id="${deAnchor}"`),
    `README_de.md missing dual reciprocal anchor for ${enAnchor} / ${deAnchor}`
  );
}

// 9. Target Personas ([PERSONA-01] to [PERSONA-04])
const personas = ["[PERSONA-01]", "[PERSONA-02]", "[PERSONA-03]", "[PERSONA-04]"];
for (const p of personas) {
  assert.ok(readmeEn.includes(p), `README.md missing persona ${p}`);
  assert.ok(readmeDe.includes(p), `README_de.md missing persona ${p}`);
  assert.ok(llmsTxt.includes(p), `llms.txt missing persona ${p}`);
}

// 10. German Statutory Notice (§ 521 BGB Gefälligkeitsrecht) & Security SLA
assert.ok(readmeEn.includes("§ 521 BGB"), "README.md missing § 521 BGB disclaimer");
assert.ok(readmeDe.includes("§ 521 BGB"), "README_de.md missing § 521 BGB disclaimer");
assert.ok(llmsTxt.includes("§ 521 BGB"), "llms.txt missing § 521 BGB disclaimer");
assert.ok(readmeEn.includes("Security%20SLA"), "README.md missing Security SLA badge");
assert.ok(readmeDe.includes("Sicherheits--SLA"), "README_de.md missing Sicherheits-SLA badge");

// 11. CI workflow sanity
const ciYml = readFileSync(path.join(root, ".github", "workflows", "ci.yml"), "utf8");
assert.ok(ciYml.includes("actions/checkout@v4"), "ci.yml must use checkout@v4");
assert.ok(ciYml.includes("npm test"), "ci.yml must run npm test");
assert.ok(ciYml.includes("timeout-minutes: 15"), "ci.yml must specify timeout-minutes: 15 runaway guardrail");
assert.ok(ciYml.includes("contents: read"), "ci.yml must enforce least-privilege contents: read permissions");
assert.ok(ciYml.includes("18.x"), "ci.yml must include Node 18.x in matrix");
assert.ok(ciYml.includes("20.x"), "ci.yml must include Node 20.x in matrix");
assert.ok(ciYml.includes("windows-latest"), "ci.yml must include windows-latest");
assert.ok(ciYml.includes("ubuntu-latest"), "ci.yml must include ubuntu-latest");
assert.ok(ciYml.includes("macos-latest"), "ci.yml must include macos-latest");

const staleYmlPath = path.join(root, ".github", "workflows", "stale.yml");
assert.ok(existsSync(staleYmlPath), "stale.yml workflow must exist");
const staleYml = readFileSync(staleYmlPath, "utf8");
assert.ok(staleYml.includes("actions/stale@v9"), "stale.yml must use actions/stale@v9");
assert.ok(staleYml.includes("timeout-minutes: 10"), "stale.yml must enforce timeout-minutes: 10");
assert.ok(staleYml.includes("30 1 * * *"), "stale.yml must run daily schedule at 01:30 UTC");
assert.ok(staleYml.includes("issues: write"), "stale.yml must declare issues: write");

const welcomeYmlPath = path.join(root, ".github", "workflows", "welcome.yml");
assert.ok(existsSync(welcomeYmlPath), "welcome.yml workflow must exist");
const welcomeYml = readFileSync(welcomeYmlPath, "utf8");
assert.ok(welcomeYml.includes("actions/first-interaction@v3"), "welcome.yml must use actions/first-interaction@v3");
assert.ok(welcomeYml.includes("timeout-minutes: 5"), "welcome.yml must enforce timeout-minutes: 5");
assert.ok(welcomeYml.includes("cancel-in-progress: true"), "welcome.yml must enable cancel-in-progress concurrency");

// 12. Third-party licenses inventory parity & Level 1 SBOM Invariant Matrix
const thirdPartyLicenses = readFileSync(path.join(root, "THIRD_PARTY_LICENSES.md"), "utf8");
assert.ok(existsSync(path.join(root, "THIRD_PARTY_LICENSES.md")), "THIRD_PARTY_LICENSES.md must exist");
assert.ok(thirdPartyLicenses.includes("Stand: 2026-09-22"), "THIRD_PARTY_LICENSES.md must reflect Stand 2026-09-22 audit date");
assert.ok(thirdPartyLicenses.includes("RunAsInvoker"), "THIRD_PARTY_LICENSES.md missing RunAsInvoker certification");
assert.ok(thirdPartyLicenses.includes("Zero-Copyleft"), "THIRD_PARTY_LICENSES.md missing Zero-Copyleft certification");
for (const dep of Object.keys(pkg.dependencies || {})) {
  assert.ok(
    thirdPartyLicenses.includes(`\`${dep}\``),
    `THIRD_PARTY_LICENSES.md missing runtime dependency: ${dep}`
  );
}

// 13. Gitignore security & sync-conflict protection rules
const gitignore = readFileSync(path.join(root, ".gitignore"), "utf8");
assert.ok(gitignore.includes(".npmrc"), ".gitignore must ignore .npmrc");
assert.ok(gitignore.includes("*.pem"), ".gitignore must ignore *.pem certificates");
assert.ok(gitignore.includes("*.key"), ".gitignore must ignore *.key private keys");
assert.ok(gitignore.includes("*.csr"), ".gitignore must ignore *.csr signing requests");
assert.ok(gitignore.includes("*.token"), ".gitignore must ignore *.token secrets");
assert.ok(gitignore.includes("*.secret"), ".gitignore must ignore *.secret secrets");
assert.ok(gitignore.includes("id_rsa*"), ".gitignore must ignore id_rsa* SSH keys");
assert.ok(gitignore.includes("id_ed25519*"), ".gitignore must ignore id_ed25519* SSH keys");
assert.ok(gitignore.includes("CONFLICT_REVIEW_LOG*"), ".gitignore must ignore CONFLICT_REVIEW_LOG* host logs");
assert.ok(gitignore.includes("*-WORKSTATION*"), ".gitignore must ignore *-WORKSTATION* sync conflicts");
assert.ok(gitignore.includes("*-WORKSTATION-LG*"), ".gitignore must ignore *-WORKSTATION-LG* sync conflicts");
assert.ok(gitignore.includes("*-LAPTOP*"), ".gitignore must ignore *-LAPTOP* sync conflicts");
assert.ok(gitignore.includes("*-ASUS*"), ".gitignore must ignore *-ASUS* sync conflicts");
assert.ok(gitignore.includes("*-ASUS-GEI*"), ".gitignore must ignore *-ASUS-GEI* sync conflicts");
assert.ok(gitignore.includes("*.sync-conflict-*"), ".gitignore must ignore *.sync-conflict-*");
assert.ok(gitignore.includes("*-CONFLIT-*"), ".gitignore must ignore *-CONFLIT-*");
assert.ok(gitignore.includes("*.conflict"), ".gitignore must ignore *.conflict");
assert.ok(gitignore.includes("LOCK*.txt"), ".gitignore must ignore LOCK*.txt");
assert.ok(gitignore.includes("LOCK.user.*"), ".gitignore must ignore LOCK.user.* canonical lock defense");
assert.ok(gitignore.includes(".automation-lock"), ".gitignore must ignore .automation-lock");
assert.ok(gitignore.includes("*conflicted copy*"), ".gitignore must ignore *conflicted copy* conflict copies");
assert.ok(gitignore.includes("* (Kopie)*"), ".gitignore must ignore * (Kopie)* conflict copies");
assert.ok(gitignore.includes("* (kopie)*"), ".gitignore must ignore * (kopie)* conflict copies");
assert.ok(gitignore.includes("*.orig"), ".gitignore must ignore *.orig merge leftovers");
assert.ok(gitignore.includes("*.rej"), ".gitignore must ignore *.rej patch rejects");
assert.ok(gitignore.includes(".nyc_output/"), ".gitignore must ignore .nyc_output/ coverage artifacts");
assert.ok(gitignore.includes(".hypothesis/"), ".gitignore must ignore .hypothesis/ test artifacts");

// 14. Marketing ledger, runtime invariants & discoverability parity
const marketingLogPath = path.join(root, "MARKETING-LOG.txt");
assert.ok(existsSync(marketingLogPath), "MARKETING-LOG.txt must exist");
const marketingLog = readFileSync(marketingLogPath, "utf8");
assert.ok(marketingLog.includes("0.1.0-alpha.10"), "MARKETING-LOG.txt missing version 0.1.0-alpha.10");
assert.ok(marketingLog.includes("2026-09-22"), "MARKETING-LOG.txt missing 2026-09-22 audit date");

const invariants = [
  "INV-LOCAL-01", "INV-HEADLESS-02", "INV-SEC-03", "INV-BOUND-04", "INV-INTEG-05",
  "INV-VISUAL-06", "INV-CLEAN-07", "INV-CROSS-08", "INV-SYNC-09", "INV-SLA-10"
];

for (const inv of invariants) {
  assert.ok(marketingLog.includes(inv), `MARKETING-LOG.txt missing invariant ${inv}`);
  assert.ok(readmeEn.includes(inv), `README.md missing invariant ${inv}`);
  assert.ok(readmeDe.includes(inv), `README_de.md missing invariant ${inv}`);
  assert.ok(llmsTxt.includes(inv), `llms.txt missing invariant ${inv}`);
  assert.ok(thirdPartyLicenses.includes(inv), `THIRD_PARTY_LICENSES.md missing invariant ${inv}`);
}

assert.ok(readmeEn.includes("Quick Navigation"), "README.md missing Quick Navigation section");
assert.ok(readmeDe.includes("Schnellnavigation"), "README_de.md missing Schnellnavigation section");

const changelog = readFileSync(path.join(root, "CHANGELOG.md"), "utf8");
assert.ok(changelog.includes("0.1.0-alpha.10"), "CHANGELOG.md missing 0.1.0-alpha.10 entry");
assert.ok(changelog.includes("2026-09-22"), "CHANGELOG.md missing 2026-09-22 timestamp");
assert.ok(changelog.includes("Pfad A"), "CHANGELOG.md missing Pfad A entry");
assert.ok(changelog.includes("Pfad B"), "CHANGELOG.md missing Pfad B entry");

console.log("All manifest-parity and metadata contract tests passed successfully.");
