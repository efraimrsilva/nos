export type CalendarEventInput = {
  title: string;
  intention: string;
  startsAt: string;
  endsAt: string;
  timeZone: string;
};

export function parseCalendarEvent(input: CalendarEventInput): CalendarEventInput | null {
  const title = input.title.trim();
  const intention = input.intention.trim();
  if (!title || title.length > 100 || intention.length > 500) return null;
  const isoUtc = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  if (!isoUtc.test(input.startsAt) || !isoUtc.test(input.endsAt)) return null;
  const start = Date.parse(input.startsAt);
  const end = Date.parse(input.endsAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
  if (new Date(start).toISOString() !== input.startsAt || new Date(end).toISOString() !== input.endsAt) return null;
  try {
    new Intl.DateTimeFormat("pt-BR", { timeZone: input.timeZone });
  } catch {
    return null;
  }
  return { ...input, title, intention };
}

export function parseCalendarPage(value?: string): number {
  if (!value || !/^[1-9]\d*$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) && page <= Math.floor(Number.MAX_SAFE_INTEGER / 50) ? page : 1;
}

export function formatCalendarEventDate(instant: string, timeZone: string) {
  const date = new Date(instant);
  const options: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short", timeZone };
  try {
    return { text: new Intl.DateTimeFormat("pt-BR", options).format(date), zoneLabel: timeZone };
  } catch (error) {
    if (!(error instanceof RangeError)) throw error;
    // O banco pode aceitar nomes tzdb que o Intl do servidor não reconhece; UTC mantém a agenda legível.
    return {
      text: new Intl.DateTimeFormat("pt-BR", { ...options, timeZone: "UTC" }).format(date),
      zoneLabel: "UTC; fuso original indisponível",
    };
  }
}
