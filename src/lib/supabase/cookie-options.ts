// O fluxo de confirmação vem de um link externo; SameSite=Lax permite o retorno sem expor o token ao JavaScript.
export const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
