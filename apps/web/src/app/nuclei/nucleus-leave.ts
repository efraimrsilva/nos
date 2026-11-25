import { Component, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PreviewProfile } from '../preview-profile';
import { NavIcon } from '../shared/nav-icon';
import { NucleiData } from './nuclei-data';
import { NucleusAction } from './nucleus-action';
import { NucleusManagementData, type ManagementScope } from './nucleus-management-data';
import { Notice } from '../shared/notice';

@Component({
  imports:[RouterLink,NucleusAction,NavIcon],
  template:`
    @if (state.isLoading()) { <p class="loading-state route-loading" role="status">Conferindo sua participação…</p> }
    @else if (state.error()) {
      <section class="surface">
        <h1 tabindex="-1">Sair de um Núcleo</h1><p role="alert">Não foi possível conferir sua participação e sua preferência.</p>
        <button class="button" type="button" (click)="state.reload()">Tentar novamente</button>
      </section>
    } @else if (state.value(); as view) {
      @for (item of [view]; track item.scope.id) {
        <header class="nucleus-header"><div><p class="kicker">{{ item.name }}</p>
          <h1 tabindex="-1">Sair de um Núcleo</h1><p>Você pode sair a qualquer momento.</p></div>
          <a class="back-button" [routerLink]="['/nucleos',item.scope.id]"><app-nav-icon name="left" />Voltar ao Núcleo</a>
        </header>
        <div class="overview-grid">
          <section class="surface"><h2 class="nucleus-panel-heading">Antes de sair <app-nav-icon name="logout" /></h2>
            <p>Você perderá acesso ao Núcleo. O histórico compartilhado permanecerá para quem continuar, incluindo os momentos, o humor e as notas já registrados. A saída não cancela acordos.</p>
          </section>
          <section class="surface"><h2 class="nucleus-panel-heading">Autoria dos registros <app-nav-icon name="lock" /></h2>
            <p>{{ item.hidden ? 'Sua preferência está ativada: a autoria de suas interações será ocultada após esta saída; o conteúdo permanecerá.' : 'Sua preferência está desativada: a autoria dos registros será preservada.' }} O texto ainda pode identificar você.</p>
            <p><a class="text-link" routerLink="/conta" fragment="privacidade">Conferir minha preferência</a></p>
          </section>
        </div>
        <section class="surface nucleus-leave-review" aria-labelledby="leave-review">
          <h2 id="leave-review">Confirmar saída</h2>
          <p>Confira as consequências antes de confirmar sua decisão.</p>
          <button type="button" class="button secondary" (click)="confirmation.showModal()" aria-haspopup="dialog">Revisar minha saída</button>
        </section>
        <dialog #confirmation class="shared-dialog" aria-labelledby="leave-title" (close)="leaveForm.reset()">
          <header class="dialog-heading"><h2 id="leave-title">Sair deste Núcleo?</h2>
            <form method="dialog"><button class="dialog-close" aria-label="Fechar confirmação de saída" autofocus></button></form>
          </header>
          <p class="nucleus-consequence">Você perderá o acesso. O histórico compartilhado permanecerá para quem continuar.</p>
          <app-nucleus-action #leaveForm [scope]="item.scope" operation="leave" label="Sair deste Núcleo" [danger]="true"
            confirmation="Entendi que perderei acesso e que o histórico compartilhado permanecerá."
            (completed)="finish(item.scope)" />
        </dialog>
      }
    } @else {
      <section class="surface"><h1 tabindex="-1">Núcleo indisponível</h1>
        <p>Confira os espaços dos quais você faz parte.</p><a class="button" routerLink="/nucleos">Ver Seus Núcleos</a>
      </section>
    }
  `,
})
export class NucleusLeave {
  private readonly notices = inject(Notice);
  private readonly profile = inject(PreviewProfile);
  private readonly management = inject(NucleusManagementData);
  private readonly data = inject(NucleiData);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap,{initialValue:this.route.snapshot.paramMap});
  protected readonly state = resource({
    params:() => {
      const owner = this.profile.user()?.id;
      const id = this.params().get('id');
      return owner && id ? {owner,id} : undefined;
    },
    loader:({params,abortSignal}) => this.management.leaveContext(params,abortSignal),
  });

  protected finish(scope: ManagementScope) {
    this.data.forget(scope.owner,scope.id);
    this.notices.show('Você saiu do Núcleo.');
    void this.router.navigate(['/nucleos'],{replaceUrl:true});
  }
}
