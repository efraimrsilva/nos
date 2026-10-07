import { createHmac, timingSafeEqual } from "node:crypto";

export const recoveryCookie = "nos-recovery";
export const recoveryLifetime = 15 * 60;
type Proof = { user: string; session: string; expires: number };
export function recoverySecret() {
  const key = process.env.AUTH_RECOVERY_SECRET;
  return key && key.length >= 32 ? key : null;
}
export function signRecoveryProof(user: string, session: string, key: string, now = Date.now()) {
  const body = Buffer.from(JSON.stringify({ user, session, expires: now + recoveryLifetime * 1000 })).toString("base64url");
  return `${body}.${createHmac("sha256", key).update(body).digest("base64url")}`;
}
// A assinatura impede transformar um cookie comum de login em autorização de recuperação.
export function verifyRecoveryProof(value: string | undefined, user: string, session: string, key: string, now = Date.now()) {
  if (!value || value.length > 1000) return false;
  const [body, signature, extra] = value.split(".");
  if (!body || !signature || extra) return false;
  const expected = createHmac("sha256", key).update(body).digest();
  const actual = Buffer.from(signature, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return false;
  try {
    const proof: Proof = JSON.parse(Buffer.from(body, "base64url").toString());
    return proof.user === user && proof.session === session && typeof proof.expires === "number" && proof.expires > now && proof.expires <= now + recoveryLifetime * 1000;
  } catch { return false; }
}
