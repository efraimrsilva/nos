import { Component, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PreviewProfile } from '../preview-profile';
import { findNucleusType, formatCalendarEventDate } from './nucleus-model';
import { NucleiData } from './nuclei-data';

@Component({
  imports:[RouterLink],
  templateUrl:'./nucleus-home.html',
})
export class NucleusHome {
  private readonly profile = inject(PreviewProfile);
  private readonly data = inject(NucleiData);
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap,{initialValue:this.route.snapshot.paramMap});
  protected readonly state = resource({
    params:() => {
      const user = this.profile.user();
      const id = this.params().get('id');
      return user && id ? {owner:user.id,id} : undefined;
    },
    loader:async ({params,abortSignal}) => {
      const view = await this.data.home(params.owner,params.id,abortSignal);
      // Uma resposta atrasada de outra rota ou sessão não muda a seleção desta conta.
      if (view && !abortSignal.aborted && this.profile.user()?.id === params.owner) {
        this.data.remember(params.owner,view.nucleus.id);
      }
      return view;
    },
  });
  protected readonly date = formatCalendarEventDate;
  protected typeLabel(value:string) { return findNucleusType(value)?.label ?? 'Núcleo'; }

  protected status(value:string) {
    const labels: Record<string,string> = {
      pending:'Proposta enviada',testing:'Em teste',active:'Acordo ativo',declined:'Proposta recusada',ended:'Encerrado',
    };
    return labels[value] ?? 'Acordo';
  }

}
