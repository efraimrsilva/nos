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
  if (typeof value !== "string" || value.length > 500 || /[\\\r\n]/.test(value)) return routes.start;
  if (/^\/comecar(?:\/(?:convite|tipo|proposito)(?:\?tipo=[a-z-]+)?)?$/.test(value)) return value;
  if (/^\/nucleos\/[a-f0-9-]{36}(?:\/(?:agenda|acordos))?$/.test(value)) return value;
  return routes.start;
}
export function withAuthNext(path: string, next: string) {
  return next === routes.start ? path : `${path}${path.includes("?") ? "&" : "?"}next=${encodeURIComponent(next)}`;
}
