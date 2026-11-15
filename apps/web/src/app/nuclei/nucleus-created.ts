import { Component, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PreviewProfile } from '../preview-profile';
import { NucleiData } from './nuclei-data';

@Component({
  imports:[RouterLink],
  template:`
    @if (state.isLoading()) { <p role="status">Conferindo o Núcleo…</p> }
    @else if (state.error()) {
      <section class="surface">
        <h1 tabindex="-1">Não foi possível conferir o Núcleo</h1>
        <button type="button" class="button" (click)="state.reload()">Tentar novamente</button>
      </section>
    } @else if (state.value(); as view) {
      <section class="surface">
        <h1 tabindex="-1">Núcleo criado</h1>
        <p>{{ view.nucleus.name }} está pronto. Os convites entram na próxima etapa da prévia.</p>
        <a class="button" [routerLink]="['/nucleos',view.nucleus.id]">Abrir Núcleo</a>
      </section>
    } @else {
      <section class="surface">
        <h1 tabindex="-1">Núcleo indisponível</h1>
        <a class="button" routerLink="/nucleos">Ver Seus Núcleos</a>
      </section>
    }
  `,
})
export class NucleusCreated {
  private readonly profile = inject(PreviewProfile);
  private readonly route = inject(ActivatedRoute);
  private readonly data = inject(NucleiData);
  private readonly params = toSignal(this.route.paramMap,{initialValue:this.route.snapshot.paramMap});
  protected readonly state = resource({
    params:() => {
      const user = this.profile.user();
      const id = this.params().get('id');
      return user && id ? {owner:user.id,id} : undefined;
    },
    loader:async ({params,abortSignal}) => {
      const result = await this.data.selected(params.owner,params.id,abortSignal);
      return result?.role === 'admin' ? {nucleus:result.nucleus} : null;
    },
  });
}
