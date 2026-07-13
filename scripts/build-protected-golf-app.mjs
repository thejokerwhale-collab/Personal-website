import { createCipheriv, pbkdf2Sync, randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectory = resolve(repositoryRoot, ".private/golf-draft-app-source");
const outputDirectory = resolve(repositoryRoot, "projects/golf-draft-app");
const username = process.env.GOLF_APP_USERNAME;
const password = process.env.GOLF_APP_PASSWORD;

if (!username || !password) {
  throw new Error("GOLF_APP_USERNAME and GOLF_APP_PASSWORD are required.");
}

const moduleDefinitions = [
  { file: "open-board.js", exports: ["PLAYER_BOARD", "PLAYER_BOARD_META"] },
  { file: "data.js", exports: ["LEGACY_US_OPEN_PLAYER_BOARD", "TEAMS", "WORKBOOK_PICKS"] },
  { file: "pga-stats.js", exports: ["DEFAULT_PGA_STATS", "PGA_STATS_META"] },
  { file: "liv-stats.js", exports: ["DEFAULT_LIV_STATS", "LIV_STATS_META"] },
  { file: "player-results.js", exports: ["PLAYER_RESULTS", "PLAYER_RESULTS_META"] },
  { file: "contest-history.js", exports: ["CONTEST_HISTORY", "CONTEST_HISTORY_META"] },
  { file: "model-calibration.js", exports: ["MODEL_CALIBRATION"] },
  {
    file: "draft-engine.js",
    exports: [
      "POOL_PAYOUTS",
      "createDraftOrder",
      "teamForPick",
      "pickNumberForSlotRound",
      "pickSequenceForTeam",
      "nextPickForTeam",
      "evaluateDraftCandidates",
      "simulateDraftToPick"
    ]
  }
];

function removeModuleSyntax(source) {
  return source
    .replace(/^\s*import\s+[\s\S]*?\s+from\s+["'][^"']+["'];\s*$/gm, "")
    .replace(/^\s*export\s+\{[^}]*\}\s+from\s+["'][^"']+["'];\s*$/gm, "")
    .replace(/\bexport\s+(?=(?:const|let|var|function|class)\b)/g, "");
}

async function buildScriptBundle() {
  const chunks = [];

  for (const [index, definition] of moduleDefinitions.entries()) {
    const source = removeModuleSyntax(
      await readFile(resolve(sourceDirectory, definition.file), "utf8")
    );
    const moduleName = `__golfModule${index}`;
    const exportList = definition.exports.join(", ");

    chunks.push(
      `const ${moduleName} = (() => {\n${source}\nreturn { ${exportList} };\n})();`,
      `const { ${exportList} } = ${moduleName};`
    );
  }

  const appSource = removeModuleSyntax(
    await readFile(resolve(sourceDirectory, "app.js"), "utf8")
  );
  chunks.push(`(() => {\n${appSource}\n})();`);

  return chunks.join("\n\n").replace(/<\/script/gi, "<\\/script");
}

async function buildApplicationDocument() {
  const [sourceHtml, sourceCss, scriptBundle] = await Promise.all([
    readFile(resolve(sourceDirectory, "index.html"), "utf8"),
    readFile(resolve(sourceDirectory, "styles.css"), "utf8"),
    buildScriptBundle()
  ]);

  return sourceHtml
    .replace(/\s*<link rel="stylesheet"[^>]*>\s*/i, "\n")
    .replace("<head>", '<head>\n    <base href="/projects/golf-draft-app/" />')
    .replace("</head>", `    <style>\n${sourceCss}\n    </style>\n  </head>`)
    .replace(
      /\s*<script type="module" src="[^"]+"><\/script>\s*/i,
      `\n    <script>\n${scriptBundle}\n    </script>\n`
    );
}

function encryptDocument(documentHtml) {
  const iterations = 310_000;
  const salt = randomBytes(16);
  const initializationVector = randomBytes(12);
  const additionalData = Buffer.from("golf-major-intelligence-v1", "utf8");
  const credential = Buffer.from(`${username}\0${password}`, "utf8");
  const key = pbkdf2Sync(credential, salt, iterations, 32, "sha256");
  const cipher = createCipheriv("aes-256-gcm", key, initializationVector);
  const compressedDocument = gzipSync(Buffer.from(documentHtml, "utf8"), { level: 9 });

  cipher.setAAD(additionalData);
  const ciphertext = Buffer.concat([
    cipher.update(compressedDocument),
    cipher.final()
  ]);

  return JSON.stringify({
    version: 1,
    compression: "gzip",
    iterations,
    salt: salt.toString("base64"),
    initializationVector: initializationVector.toString("base64"),
    authenticationTag: cipher.getAuthTag().toString("base64"),
    ciphertext: ciphertext.toString("base64")
  });
}

const applicationDocument = await buildApplicationDocument();
const encryptedVault = encryptDocument(applicationDocument);
await writeFile(resolve(outputDirectory, "vault.bin"), encryptedVault);

console.log(`Protected golf app built (${Buffer.byteLength(encryptedVault)} bytes).`);
