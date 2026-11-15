import { Component, computed, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PreviewProfile } from '../preview-profile';
import { findNucleusType, pageNumber, profileLetters } from './nucleus-model';
import { NucleiData } from './nuclei-data';

@Component({
  imports:[RouterLink],
  templateUrl:'./nuclei-list.html',
})
export class NucleiList {
  private readonly profile = inject(PreviewProfile);
  private readonly data = inject(NucleiData);
  private readonly route = inject(ActivatedRoute);
  private readonly query = toSignal(this.route.queryParamMap,{initialValue:this.route.snapshot.queryParamMap});
  protected readonly page = computed(() => pageNumber(this.query().getAll('pagina')));
  protected readonly state = resource({
    params:() => {
      const user = this.profile.user();
      return user ? {owner:user.id,page:this.page()} : undefined;
    },
    loader:({params,abortSignal}) => this.data.list(params.owner,params.page,abortSignal),
  });
  protected readonly initials = profileLetters;
  protected typeLabel(value:string) { return findNucleusType(value)?.label ?? 'Núcleo'; }
}
