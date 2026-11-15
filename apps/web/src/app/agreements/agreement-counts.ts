import { effect, inject, signal, untracked } from '@angular/core';
import { AgreementsData } from './agreements-data';
import type { AgreementCount, AgreementScope } from './proposal-model';

type CountScope = AgreementScope & {ids:string[]};

export function watchAgreementCounts(selection:() => CountScope|undefined) {
  const data = inject(AgreementsData);
  const totals = signal(new Map<string,AgreementCount>());
  const failed = signal(false);
  const denied = signal(false);
  const received = signal(0);
  let current: (()=>Promise<void>) | undefined;
  effect(onCleanup => {
    const scope = selection();
    totals.set(new Map());
    failed.set(false);
    denied.set(false);
    if (!scope?.ids.length) return;
    const lifetime = new AbortController();
    let running = false;
    let again = false;
    async function refresh(force = false) {
      if (lifetime.signal.aborted || denied() || document.hidden || !navigator.onLine) return;
      if (running) { if (force) again = true; return; }
      running = true;
      try {
        const counts = await data.counts(scope!,scope!.ids,lifetime.signal);
        if (lifetime.signal.aborted) return;
        if (!counts) {
          totals.set(new Map());
          denied.set(true);
          return;
        }
        totals.set(new Map(counts.map(count=>[count.agreement_id,count])));
        failed.set(false);
        received.update(value=>value+1);
      } catch {
        // Falha transitória preserva os últimos totais válidos deste conjunto.
        if (!lifetime.signal.aborted) failed.set(true);
      } finally {
        running = false;
        if (again) { again = false; void refresh(); }
      }
    }
    const check = () => void refresh();
    current = () => refresh(true);
    const timer = window.setInterval(check,3000);
    window.addEventListener('online',check,{signal:lifetime.signal});
    document.addEventListener('visibilitychange',check,{signal:lifetime.signal});
    untracked(check);
    onCleanup(() => { lifetime.abort(); window.clearInterval(timer); current = undefined; });
  });
  return {totals,failed,denied,received,refresh:() => void current?.()};
}
