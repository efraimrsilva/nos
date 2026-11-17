const storageKey = 'nos-problem-report-reminder';
const wait = 60_000;
const duration = 10_000;

type Reminder = { accountId: string; startsAt: number; endsAt?: number; dismissed: boolean };
let inMemory: Reminder | undefined;

function read(): Reminder | undefined {
  try {
    return JSON.parse(sessionStorage.getItem(storageKey) ?? 'null') ?? inMemory;
  } catch {
    return inMemory;
  }
}

function save(reminder: Reminder) {
  inMemory = reminder;
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(reminder));
  } catch {
    // O prazo ainda acompanha a navegação no mesmo documento quando o armazenamento é bloqueado.
  }
}

export function clearProblemReportReminder(accountId: string) {
  if (read()?.accountId !== accountId) return;
  inMemory = undefined;
  try {
    sessionStorage.removeItem(storageKey);
  } catch {
    // A cópia em memória já foi descartada.
  }
}

export function watchProblemReportReminder(accountId: string, setVisible: (visible: boolean) => void) {
  const saved = read();
  const reminder = saved?.accountId === accountId && Number.isFinite(saved.startsAt) &&
    (saved.endsAt === undefined || Number.isFinite(saved.endsAt))
    ? saved : { accountId, startsAt: Date.now() + wait, dismissed: false };
  save(reminder);
  let timer: ReturnType<typeof setTimeout> | undefined;

  function update() {
    clearTimeout(timer);
    const now = Date.now();
    if (read()?.dismissed || (reminder.endsAt !== undefined && now >= reminder.endsAt)) {
      setVisible(false);
    } else if (now < reminder.startsAt) {
      timer = setTimeout(update, reminder.startsAt - now);
    } else if (reminder.endsAt !== undefined || document.visibilityState === 'visible') {
      // A janela de leitura começa na primeira exibição em uma aba visível.
      if (reminder.endsAt === undefined) {
        reminder.endsAt = now + duration;
        save(reminder);
      }
      setVisible(true);
      timer = setTimeout(update, reminder.endsAt - now);
    }
  }

  update();
  document.addEventListener('visibilitychange', update);
  return () => {
    clearTimeout(timer);
    document.removeEventListener('visibilitychange', update);
  };
}

export function dismissProblemReportReminder(accountId: string) {
  const reminder = read();
  if (reminder?.accountId === accountId) save({ ...reminder, dismissed: true });
}
