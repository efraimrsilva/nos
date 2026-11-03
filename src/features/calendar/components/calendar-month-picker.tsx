"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import "react-day-picker/style.css";

export function CalendarMonthPicker({ weekStart, onChooseDate, eventRanges }: { weekStart: number; onChooseDate: (date: Date) => void; eventRanges: { starts_at: string; ends_at: string }[] }) {
  const [month, setMonth] = useState(new Date(weekStart + 3 * 86_400_000));
  const [selectedDay, setSelectedDay] = useState(new Date(weekStart));
  // A janela acompanha a navegação: não há corte em 2030 nem milhares de opções no seletor.
  const year = month.getUTCFullYear();
  const startMonth = new Date(`${String(Math.max(1, year - 100)).padStart(4, "0")}-01-01T12:00:00Z`);
  const endMonth = new Date(`${String(Math.min(9999, year + 100)).padStart(4, "0")}-12-01T12:00:00Z`);
  useEffect(() => {
    setMonth(current => {
      const startDate = new Date(current);
      startDate.setUTCDate(1);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setUTCMonth(endDate.getUTCMonth() + 1);
      // Preserva o mês escolhido quando a semana atravessa dois meses.
      return weekStart < endDate.getTime() && weekStart + 7 * 86_400_000 > startDate.getTime() ? current : new Date(weekStart + 3 * 86_400_000);
    });
    setSelectedDay(current => current.getTime() >= weekStart && current.getTime() < weekStart + 7 * 86_400_000 ? current : new Date(weekStart));
  }, [weekStart]);
  return <section className="calendar-month-picker" aria-label="Calendário mensal">
    {/* O mesmo fuso da grade mantém o dia escolhido estável em celulares de qualquer região. */}
    <DayPicker mode="single" timeZone="UTC" locale={ptBR} weekStartsOn={1}
      month={month} onMonthChange={setMonth} selected={selectedDay}
      onSelect={date => { if (date) { setMonth(date); setSelectedDay(date); onChooseDate(new Date(date)); } }}
      startMonth={startMonth} endMonth={endMonth} fixedWeeks showOutsideDays
      captionLayout="dropdown" navLayout="after"
      labels={{ labelMonthDropdown: () => "Mês", labelYearDropdown: () => "Ano", labelNext: () => "Próximo mês", labelPrevious: () => "Mês anterior" }}
      modifiers={{ hasEvent: date => {
        const start = new Date(date); start.setUTCHours(0, 0, 0, 0);
        return eventRanges.some(event => Date.parse(event.starts_at) < start.getTime() + 86_400_000 && Date.parse(event.ends_at) > start.getTime());
      } }} modifiersClassNames={{ hasEvent: "calendar-date-has-event" }} />
    <p className="calendar-month-help">Escolha um dia para abrir sua semana. Os dias sublinhados indicam eventos desta página.</p>
  </section>;
}
