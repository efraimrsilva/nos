// Compila a cópia local e testa o servidor de produção, sem publicar o aplicativo.
import { spawn } from "node:child_process";
const cli = "node_modules/next/dist/bin/next";
const build = spawn(process.execPath, [cli, "build", "--webpack"], { stdio: "inherit", windowsHide: true });
build.on("exit", code => {
  if (code !== 0) { process.exitCode = code ?? 1; return; }
  const server = spawn(process.execPath, [cli, "start", "--hostname", "127.0.0.1", "--port", "3200"], { stdio: "inherit", windowsHide: true });
  server.on("exit", value => { process.exitCode = value ?? 1; });
  server.on("error", () => { process.exitCode = 1; });
});
build.on("error", () => { process.exitCode = 1; });
