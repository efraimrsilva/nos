import { expect, test } from "@playwright/test";
import { calendarEventLanes } from "@/features/calendar/calendar-lanes";

test("eventos longos e curtos visualmente sobrepostos ocupam faixas distintas", () => {
  const lanes = calendarEventLanes([{id:"long",start:0,end:160},{id:"late",start:128,end:228}]);
  expect(lanes.get("long")).toEqual({lane:0,total:2});
  expect(lanes.get("late")).toEqual({lane:1,total:2});
});

test("grupos transitivos mantêm largura uniforme e reutilizam faixas livres", () => {
  const input=[{id:"a",start:0,end:100},{id:"b",start:80,end:180},{id:"c",start:150,end:250},{id:"d",start:300,end:400}];
  const lanes=calendarEventLanes(input);
  expect(lanes.get("a")).toEqual({lane:0,total:2});
  expect(lanes.get("b")).toEqual({lane:1,total:2});
  expect(lanes.get("c")).toEqual({lane:0,total:2});
  expect(lanes.get("d")).toEqual({lane:0,total:1});
  expect(calendarEventLanes([...input].reverse())).toEqual(lanes);
});

test("eventos adjacentes não colidem e empates têm ordem estável", () => {
  expect(calendarEventLanes([{id:"a",start:0,end:100},{id:"b",start:100,end:200}]).get("b")).toEqual({lane:0,total:1});
  const lanes=calendarEventLanes([{id:"b",start:0,end:100},{id:"a",start:0,end:100},{id:"c",start:0,end:100}]);
  expect(lanes.get("a")).toEqual({lane:0,total:3});
  expect(lanes.get("c")).toEqual({lane:2,total:3});
  expect(calendarEventLanes([]).size).toBe(0);
});
