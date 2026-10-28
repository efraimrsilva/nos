export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.NODE_ENV === "development"
    && (process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy)) {
    // Inicializa o transporte antes do fetch do Next, que pode criar um Agent sem proxy.
    const { setGlobalProxyFromEnv } = await import("node:http");
    setGlobalProxyFromEnv();
  }
}
