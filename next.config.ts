import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Isola o servidor de testes do servidor de desenvolvimento para evitar disputa pelo lock de build.
  distDir: process.env.NOS_AUTH_TEST === "1" ? ".next-authenticated" : process.env.PLAYWRIGHT_TEST === "1" ? ".next-playwright" : process.env.NOS_LOCAL_VERIFY === "1" ? ".next-verify" : ".next",
  poweredByHeader: false,
  logging: {
    // Os callbacks recebem credenciais temporárias na URL; não registrá-las no terminal de desenvolvimento.
    incomingRequests: { ignore: [/\/auth\/(?:confirm|recovery)(?:\?|$)/] },
  },
  async headers() {
    // Aplica proteções comuns a todas as rotas antes de adicionar regras específicas por tela.
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ] }];
  },
};

export default nextConfig;
