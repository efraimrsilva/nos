// Caixa SMTP descartável: recebe mensagens localmente, sem encaminhar e-mail real.
import { execFileSync, spawn } from "node:child_process";
const container = `nos-support-test-${process.pid}`;
const image = "public.ecr.aws/supabase/mailpit:v1.30.2";
execFileSync("docker", ["image", "inspect", image], { stdio: "ignore", windowsHide: true });
execFileSync("docker", ["run", "--rm", "-d", "--name", container, "-p", "127.0.0.1:3025:1025", "-p", "127.0.0.1:8026:8025", image], { stdio: "ignore", windowsHide: true });
try {
  const child = spawn(process.execPath, ["scripts/test-authenticated-local.mjs", "problem-report", "--reporter=list", ...process.argv.slice(2)], {
    env: { ...process.env, SUPPORT_SMTP_HOST: "127.0.0.1", SUPPORT_SMTP_PORT: "3025", SUPPORT_SMTP_USER: "", SUPPORT_SMTP_PASSWORD: "", SUPPORT_MAIL_FROM: "support@example.test", NOS_SUPPORT_TEST_CONTAINER: container },
    stdio: "inherit", windowsHide: true,
  });
  const code = await new Promise((resolve, reject) => { child.on("exit", resolve); child.on("error", reject); });
  process.exitCode = code ?? 1;
} finally {
  // Somente o contêiner com nome desta execução é encerrado; Supabase é preservado.
  try { execFileSync("docker", ["unpause", container], { stdio: "ignore", windowsHide: true }); } catch { /* Pode não estar pausado. */ }
  execFileSync("docker", ["stop", container], { stdio: "ignore", windowsHide: true });
}
