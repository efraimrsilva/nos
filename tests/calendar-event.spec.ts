import { expect, test } from "@playwright/test";
import { formatCalendarEventDate, parseCalendarEvent, parseCalendarPage } from "../src/features/calendar/event-input";

const valid = {
  title: " Encontro em família ",
  intention: " Conversar e estar juntos ",
  startsAt: "2026-10-03T21:00:00.000Z",
  endsAt: "2026-10-03T22:00:00.000Z",
  timeZone: "America/Sao_Paulo",
};

test("aceita evento com horário absoluto, fuso e texto limpo", () => {
  expect(parseCalendarEvent(valid)).toEqual({ ...valid, title: "Encontro em família", intention: "Conversar e estar juntos" });
});

test("rejeita fim anterior, horário sem fuso e fuso inválido", () => {
  expect(parseCalendarEvent({ ...valid, endsAt: valid.startsAt })).toBeNull();
  expect(parseCalendarEvent({ ...valid, startsAt: "2026-10-03T18:00" })).toBeNull();
  expect(parseCalendarEvent({ ...valid, timeZone: "Fuso/Inexistente" })).toBeNull();
  expect(parseCalendarEvent({ ...valid, startsAt: "2026-02-30T21:00:00.000Z" })).toBeNull();
});

test("rejeita campos vazios e extensos antes de enviar ao banco", () => {
  expect(parseCalendarEvent({ ...valid, title: "  " })).toBeNull();
  expect(parseCalendarEvent({ ...valid, title: "x".repeat(101) })).toBeNull();
  expect(parseCalendarEvent({ ...valid, intention: "x".repeat(501) })).toBeNull();
});

test("um fuso aceito pelo banco mas desconhecido pelo navegador mantém a data legível em UTC", () => {
  expect(formatCalendarEventDate("2026-10-02T13:00:00.000Z", "Factory")).toEqual({
    text: expect.stringContaining("13:00"),
    zoneLabel: "UTC; fuso original indisponível",
  });
  expect(formatCalendarEventDate("2026-10-02T13:00:00.000Z", "America/Sao_Paulo")).toEqual({
    text: expect.stringContaining("10:00"),
    zoneLabel: "America/Sao_Paulo",
  });
});

test("a paginação aceita páginas válidas e rejeita entradas arbitrárias", () => {
  expect(parseCalendarPage("2")).toBe(2);
  expect(parseCalendarPage(undefined)).toBe(1);
  expect(parseCalendarPage("0")).toBe(1);
  expect(parseCalendarPage("1e3")).toBe(1);
  expect(parseCalendarPage("99999999999999999999")).toBe(1);
});
