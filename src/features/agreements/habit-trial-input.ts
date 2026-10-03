export function parseTrialDays(value: unknown): number | null {
  if (typeof value !== "string" || !/^(?:[7-9]|[12]\d|30)$/.test(value)) return null;
  return Number(value);
}
