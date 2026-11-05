"use client";

import { useEffect, useState } from "react";

const delay = 60_000;
const duration = 10_000;
const storageKey = "nos-problem-report-reminder";
type Reminder = { accountId: string; startsAt: number; endsAt?: number; dismissed: boolean };
let inMemory: Reminder | undefined;

function saveReminder(reminder: Reminder) {
  inMemory = reminder;
  try { sessionStorage.setItem(storageKey, JSON.stringify(reminder)); }
  catch { /* Navegadores que bloqueiam armazenamento ainda preservam a navegação no documento. */ }
}

export function resetProblemReportReminder() {
  inMemory = undefined;
  try { sessionStorage.removeItem(storageKey); }
  catch { /* Sem armazenamento, limpar o estado em memória já é suficiente. */ }
}

function getReminder(accountId: string): Reminder {
  let saved = inMemory;
  try { saved = JSON.parse(sessionStorage.getItem(storageKey) ?? "null") ?? saved; }
  catch { /* O estado em memória cobre indisponibilidade do armazenamento. */ }
  if (saved?.accountId === accountId && Number.isFinite(saved.startsAt)) return saved;
  const next = { accountId, startsAt: Date.now() + delay, dismissed: false };
  saveReminder(next);
  return next;
}

export function useProblemReportReminder(accountId?: string) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!accountId) return;
    const account = accountId;
    const reminder = getReminder(account);
    if (reminder.dismissed) return;
    let timer: number | undefined;

    // O prazo de espera atravessa rotas. Os dez segundos começam na primeira exibição em uma aba visível.
    function update() {
      window.clearTimeout(timer);
      const current = getReminder(account);
      if (current.dismissed) { setVisible(false); return; }
      const now = Date.now();
      if (now < current.startsAt) {
        timer = window.setTimeout(update, current.startsAt - now);
        return;
      }
      if (current.endsAt === undefined) {
        if (document.visibilityState !== "visible") return;
        current.endsAt = now + duration;
        saveReminder(current);
      }
      if (now >= current.endsAt) {
        setVisible(false);
        return;
      }
      setVisible(true);
      timer = window.setTimeout(update, current.endsAt - now);
    }

    update();
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, [accountId]);

  function dismiss() {
    if (!visible || !accountId) return;
    saveReminder({ ...getReminder(accountId), dismissed: true });
    setVisible(false);
  }

  return { visible, dismiss };
}
