export type HabitMomentInput = { mood: string; note: string };

export function parseHabitMoment(input: HabitMomentInput): HabitMomentInput | null {
  const moment = { mood: input.mood, note: input.note.trim() };
  if (!["great", "good", "neutral", "difficult"].includes(moment.mood) || moment.note.length > 500) return null;
  return moment;
}

export const habitMoodLabels: Record<string, string> = {
  great: "Ótimo", good: "Bem", neutral: "Neutro", difficult: "Difícil",
};

export function parseHabitMomentCursor(value: unknown) {
  if (typeof value !== "string" || !value) return null;
  const parts = value.split("|");
  if (parts.length !== 2) return null;
  const [createdAt, id] = parts;
  if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,6})?(?:Z|\+00:00)$/.test(createdAt)
    || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
    || !Number.isFinite(Date.parse(createdAt))) return null;
  return { createdAt, id };
}
