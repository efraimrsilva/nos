import { existsSync, readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { getDevEnvironment } from "./dev-network.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));

function run(args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, {
      cwd: root, env, stdio: "inherit", windowsHide: true,
    });
    child.on("error", (error) => {
      console.error(`Não foi possível iniciar o comando: ${error.message}`);
      resolve(1);
    });
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

const [nodeMajor, nodeMinor] = process.versions.node.split(".").map(Number);
if (nodeMajor < 24 || (nodeMajor === 24 && nodeMinor < 15)) {
  console.error("Use Node.js 24 LTS (24.15.0 ou superior) neste computador. Depois, execute npm run dev novamente.");
  process.exit(1);
}

const env = getDevEnvironment();
if (env.NODE_USE_ENV_PROXY === "1") {
  console.log("Usando o proxy da rede para acessar o npm e o Supabase; localhost permanece direto.");
}

const dependencies = Object.keys({ ...manifest.dependencies, ...manifest.devDependencies });
const missing = dependencies.some((name) => !existsSync(path.join(root, "node_modules", name, "package.json")))
  || !existsSync(path.join(root, "node_modules/next/dist/bin/next"));

if (missing) {
  console.log("Preparando as dependências deste computador. Na primeira execução é necessário acesso ao registro do npm.");
  const npm = process.env.npm_execpath;
  if (!npm || !existsSync(npm)) {
    console.error("Inicie o projeto com npm run dev na pasta que contém package.json.");
    process.exit(1);
  }
  const result = await run([npm, "ci", "--include=dev", "--no-audit", "--no-fund", "--prefer-offline", "--fetch-retries=2", "--fetch-timeout=60000"]);
  if (result !== 0) {
    console.error("Não foi possível instalar as dependências. Confira o acesso ao registro do npm e o proxy exigido pela sua rede. Depois, execute apenas npm run dev novamente.");
    process.exit(result);
  }
}

if (!existsSync(path.join(root, ".env.local")) && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn("Este computador ainda não tem .env.local. A interface pode abrir, mas login e dados precisam da configuração local do Supabase, conforme .env.example.");
}

process.exitCode = await run([
  "--use-system-ca", path.join(root, "node_modules/next/dist/bin/next"),
  "dev", "--hostname", "127.0.0.1", ...process.argv.slice(2),
]);
