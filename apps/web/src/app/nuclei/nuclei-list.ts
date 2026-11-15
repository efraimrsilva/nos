import { Component, computed, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PreviewProfile } from '../preview-profile';
import { findNucleusType, pageNumber, profileLetters } from './nucleus-model';
import { NucleiData } from './nuclei-data';
import { watchNucleusIdentity } from './nucleus-identity-sync';

@Component({
  imports:[RouterLink],
  templateUrl:'./nuclei-list.html',
})
export class NucleiList {
  private readonly profile = inject(PreviewProfile);
  private readonly data = inject(NucleiData);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly query = toSignal(this.route.queryParamMap,{initialValue:this.route.snapshot.queryParamMap});
  protected readonly page = computed(() => pageNumber(this.query().getAll('pagina')));
  protected readonly closed = computed(() => this.query().get('resultado') === 'encerrado' &&
    (this.router.currentNavigation()?.extras.state?.['confirmedClosure'] === true || history.state?.confirmedClosure === true));
  private lastView?: Awaited<ReturnType<NucleiData['list']>> & {owner:string;page:number;version:string|null};
  private stale = false;
  protected readonly state = resource({
    params:() => {
      const user = this.profile.user();
      return user ? {owner:user.id,page:this.page()} : undefined;
    },
    loader:async ({params,abortSignal}) => {
      const version = await this.data.identityVersion(params.owner,abortSignal).catch(() => null);
      try {
        const result = await this.data.list(params.owner,params.page,abortSignal);
        const snapshot = {...result,...params,version};
        if (!abortSignal.aborted) {
          this.lastView = snapshot;
          this.stale = false;
        }
        return snapshot;
      } catch (error) {
        const last = this.lastView;
        if (!abortSignal.aborted && last?.owner === params.owner && last.page === params.page) {
          this.stale = true;
          return last;
        }
        throw error;
      }
    },
  });
  constructor() {
    watchNucleusIdentity(() => this.state.hasValue() ? this.state.value()?.version : undefined,
      () => this.state.isLoading(), () => this.state.reload(), async () => this.stale);
  }
  protected readonly initials = profileLetters;
  protected typeLabel(value:string) { return findNucleusType(value)?.label ?? 'Núcleo'; }
}
