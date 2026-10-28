export function profileLetters(name: unknown): string {
  const firstName = typeof name === "string" ? name.trim().split(/\s+/)[0] : "";
  return firstName ? Array.from(firstName).slice(0, 3).join("") : "N";
}
