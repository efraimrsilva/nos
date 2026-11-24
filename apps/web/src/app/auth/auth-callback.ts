import { Component, DestroyRef, inject, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessAuth } from './access-auth';
import { RecoveryAuth } from './recovery-auth';
import { accessLink, safeAuthNext, single } from './auth-flow';

@Component({
  template: '<p class="loading-state" role="status">Conferindo o link…</p>',
})
export class AuthCallback implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroy = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly access = inject(AccessAuth);
  private readonly recovery = inject(RecoveryAuth);

  async ngOnInit() {
    const params = new URLSearchParams(location.search);
    const next = safeAuthNext(single(params, 'next'));
    const path = location.pathname;
    // Remove credenciais antes das requisições do Auth e preserva a etapa registrada no histórico Angular.
    history.replaceState(history.state, '', path);
    const kind = this.route.snapshot.data['kind'] as 'recovery' | 'confirm' | 'callback';
    if (kind === 'recovery') {
      const accepted = await this.recovery.accept(params).catch(() => false);
      if (this.destroy.destroyed) { this.recovery.clear(); return; }
      await this.router.navigateByUrl(accessLink(accepted ? '/conta/nova-senha' : '/conta/nova-senha?erro=link', next), {replaceUrl: true});
    } else {
      const destination = await this.access.finishCallback(kind, params, next);
      if (this.destroy.destroyed) return;
      await this.router.navigateByUrl(destination, {replaceUrl: true});
    }
  }
}
