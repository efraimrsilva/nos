import { execFileSync } from "node:child_process";

function readWindowsProxy() {
  const output = execFileSync("powershell.exe", [
    "-NoProfile", "-NonInteractive", "-Command",
    "Get-ItemProperty 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings' | Select-Object ProxyEnable,ProxyServer | ConvertTo-Json -Compress",
  ], { encoding: "utf8", windowsHide: true, timeout: 5000 });
  return JSON.parse(output.trim());
}

function proxyUrl(value) {
  if (!value) return undefined;
  return /^[a-z]+:\/\//i.test(value) ? value : `http://${value}`;
}

export function getDevEnvironment({
  environment = process.env,
  platform = process.platform,
  readWindowsSettings = readWindowsProxy,
} = {}) {
  const env = { ...environment, NODE_USE_SYSTEM_CA: "1" };
  const explicitProxy = env.HTTP_PROXY || env.http_proxy || env.HTTPS_PROXY || env.https_proxy;

  if (platform === "win32" && !explicitProxy) {
    try {
      const settings = readWindowsSettings();
      if (settings.ProxyEnable === 1 && settings.ProxyServer?.trim()) {
        const server = settings.ProxyServer.trim();
        if (/^\w+=/.test(server)) {
          const proxies = Object.fromEntries(server.split(";").filter(Boolean).map((entry) => {
            const separator = entry.indexOf("=");
            return [entry.slice(0, separator).trim().toLowerCase(), entry.slice(separator + 1).trim()];
          }));
          if (proxies.http) env.HTTP_PROXY = proxyUrl(proxies.http);
          if (proxies.https) env.HTTPS_PROXY = proxyUrl(proxies.https);
        } else {
          env.HTTP_PROXY = env.HTTPS_PROXY = proxyUrl(server);
        }
      }
    } catch {
      console.warn("Não foi possível consultar o proxy do Windows. Se a rede exigir proxy, configure HTTP_PROXY e HTTPS_PROXY no terminal.");
    }
  }

  if (env.HTTP_PROXY || env.http_proxy || env.HTTPS_PROXY || env.https_proxy) {
    // O Node lê esta opção ao iniciar: ela vale para o npm e para o Next.js filhos.
    env.NODE_USE_ENV_PROXY = "1";
    // O servidor e o Supabase locais precisam continuar acessíveis sem passar pelo proxy.
    const bypass = [env.no_proxy, env.NO_PROXY, "localhost", "127.0.0.1", "::1"].filter(Boolean).join(",");
    env.NO_PROXY = env.no_proxy = bypass;
  }

  return env;
}
