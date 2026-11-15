import { DestroyRef, inject } from '@angular/core';
import { NucleiData } from './nuclei-data';
import { PreviewProfile } from '../preview-profile';

export function watchNucleusIdentity(
  getVersion: () => string | null | undefined,
  isLoading: () => boolean,
  reload: () => void,
  hasManagementChanged?: (signal: AbortSignal) => Promise<boolean>,
) {
  const data = inject(NucleiData);
  const profile = inject(PreviewProfile);
  const lifetime = new AbortController();
  let checking = false;

  async function check() {
    const owner = profile.user()?.id;
    const current = getVersion();
    if (!owner || current === undefined || checking || isLoading() || document.hidden || !navigator.onLine) return;
    checking = true;
    try {
      const next = await data.identityVersion(owner, lifetime.signal);
      // Nomeações e papéis só precisam de uma leitura adicional enquanto a gestão está aberta.
      const changed = Boolean(next && next !== current) || await hasManagementChanged?.(lifetime.signal);
      // Callbacks antigos não atualizam outra conta ou uma tela que já carregou outra versão.
      if (!lifetime.signal.aborted && owner === profile.user()?.id && current === getVersion() && !isLoading() && changed) {
        reload();
      }
    } catch {
      // A próxima consulta pode recuperar uma falha de conexão sem apagar a tela ou o formulário aberto.
    } finally { checking = false; }
  }

  const timer = window.setInterval(check, 3000);
  document.addEventListener('visibilitychange',check,{signal:lifetime.signal});
  window.addEventListener('online',check,{signal:lifetime.signal});
  inject(DestroyRef).onDestroy(() => { lifetime.abort(); window.clearInterval(timer); });
}
