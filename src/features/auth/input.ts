import { routes } from "@/shared/routes";

export const passwordHelp = "Pelo menos 8 caracteres, com letra, número e símbolo.";
export function isValidPassword(password: string) {
  return password.length >= 8 && password.length <= 128 && /[A-Za-z]/.test(password) && /\d/.test(password) && /[^A-Za-z\d]/.test(password);
}
export function isValidEmail(email: string) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
// Só destinos do fluxo existente podem atravessar o Auth; URLs externas nunca são retornos.
export function safeAuthNext(value: unknown): string {
  const fallback = routes.nucleus;
  if (typeof value !== "string" || value.length > 500 || /[\\\r\n#%]/.test(value.split("?")[0]) || !value.startsWith("/") || value.startsWith("//")) return fallback;
  const [path, query = "", extra] = value.split("?");
  if (extra !== undefined || /[\\\r\n#]/.test(value)) return fallback;
  const uuid = "[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";
  const onboarding = /^\/comecar(?:\/(?:convite|tipo|proposito))?$/.test(path);
  const invitation = new RegExp(`^/comecar/convite-inicial/${uuid}$`, "i").test(path);
  const nucleus = new RegExp(`^/nucleos(?:/${uuid}(?:/(?:sair|agenda|convites|acordos(?:/${uuid}(?:/(?:registrar|confirmar|revisar))?)?))?)?$`, "i").test(path);
  const controls = /^\/(?:configuracoes(?:\/(?:privacidade|conta))?|ajuda)$/.test(path);
  if (!onboarding && !invitation && !nucleus && !controls) return fallback;
  // Cada rota conserva apenas parâmetros de navegação, sem tokens, URLs ou valores repetidos.
  const allowed = path === routes.nucleus ? ["pagina"] : /\/(?:tipo|proposito)$/.test(path) ? ["tipo"] : path.endsWith("/agenda") ? ["pagina"] : path.endsWith("/convites") ? ["status", "pagina"] : path.endsWith("/acordos") ? ["categoria", "filtro", "pagina"] : /\/acordos\//.test(path) ? ["antes"] : [];
  const params = new URLSearchParams(query);
  for (const [key, item] of params) {
    if (!allowed.includes(key) || params.getAll(key).length !== 1 || !/^[a-zA-Z0-9_.:|+-]{1,160}$/.test(item)) return fallback;
  }
  return value;
}
export function withAuthNext(path: string, next: string) {
  return next === routes.nucleus ? path : `${path}${path.includes("?") ? "&" : "?"}next=${encodeURIComponent(next)}`;
}
