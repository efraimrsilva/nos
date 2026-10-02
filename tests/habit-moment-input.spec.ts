import { expect, test } from "@playwright/test";
import { parseHabitMoment, parseHabitMomentCursor } from "@/features/agreements/habit-moment-input";

test("registro de momento aceita humor e nota opcional sem pontuação", () => {
  expect(parseHabitMoment({ mood: "good", note: "  Foi leve.  " })).toEqual({ mood: "good", note: "Foi leve." });
  expect(parseHabitMoment({ mood: "difficult", note: "" })).toEqual({ mood: "difficult", note: "" });
});

test("registro de momento recusa humor desconhecido e nota longa", () => {
  expect(parseHabitMoment({ mood: "perfect", note: "" })).toBeNull();
  expect(parseHabitMoment({ mood: "neutral", note: "a".repeat(501) })).toBeNull();
});

test("cursor do histórico aceita somente data e identificador válidos", () => {
  const id = "22222222-2222-4222-8222-222222222222";
  expect(parseHabitMomentCursor(`2026-09-29T22:00:00.123456+00:00|${id}`))
    .toEqual({ createdAt: "2026-09-29T22:00:00.123456+00:00", id });
  expect(parseHabitMomentCursor(`2026-09-29T22:00:00+00:00|${id}|extra`)).toBeNull();
  expect(parseHabitMomentCursor("created_at.lt.2026,all")).toBeNull();
  expect(parseHabitMomentCursor(["primeiro", "segundo"])).toBeNull();
});
