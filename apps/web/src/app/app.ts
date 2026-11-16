import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, DestroyRef, inject, Injector, signal, viewChild, type ElementRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationError, NavigationSkipped, NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet, type IsActiveMatchOptions } from '@angular/router';
import { Appearance } from './appearance';
import { AppearancePicker } from './appearance-picker';
import { PreviewProfile } from './preview-profile';
import { ProblemReport } from './problem-report';
import { installDialogBackdropDismiss } from './shared/dialog-backdrop-dismiss';
import { RouteState } from './shared/route-state';
import { isNucleusId } from './nuclei/nucleus-model';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet, RouteState, ProblemReport, AppearancePicker],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly baseAreas = [
    { label: 'Início', url: '/boas-vindas' },
    { label: 'Seus Núcleos', url: '/nucleos' },
    { label: 'Minha conta', url: '/configuracoes/conta' },
  ];
  protected readonly areas = signal(this.baseAreas);
  protected readonly activeMatch: IsActiveMatchOptions = {
    paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored',
  };
  protected readonly router = inject(Router);
  protected readonly profile = inject(PreviewProfile);
  protected readonly sidebarHidden = signal(false);
  protected readonly failedUrl = signal('');
  protected readonly activeLabel = signal('');
  private readonly injector = inject(Injector);
  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');
  private readonly more = viewChild<ElementRef<HTMLDialogElement>>('more');
  private initialNavigation = true;

  constructor() {
    inject(Appearance);
    inject(DestroyRef).onDestroy(installDialogBackdropDismiss(inject(DOCUMENT)));
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationStart || event instanceof NavigationSkipped) this.failedUrl.set('');
      if (event instanceof NavigationError) this.failedUrl.set(event.url);
      if (event instanceof NavigationEnd) {
        const path = this.router.parseUrl(event.urlAfterRedirects).root.children['primary']
          ?.segments.map(segment => segment.path).join('/') ?? '';
        const [area,id] = path.split('/');
        // A Agenda tem destino somente enquanto existe um Núcleo no caminho atual.
        this.areas.set(area==='nucleos' && isNucleusId(id) ? [...this.baseAreas,{label:'Agenda',url:'/nucleos/'+id+'/agenda'}] : this.baseAreas);
        const account = path === 'conta' || path.startsWith('conta/');
        let route = this.router.routerState.snapshot.root;
        while (route.firstChild) route = route.firstChild;
        const title = route.title?.split(' · ')[0];
        this.activeLabel.set(this.areas().find(item => item.url === '/' + path)?.label ?? (account ? 'Sua conta' : title ?? ''));
        this.more()?.nativeElement.close();
        // Depois de Voltar, Avançar ou seguir um link interno, o foco acompanha o novo conteúdo.
        if (!this.initialNavigation) this.focusPage();
        this.initialNavigation = false;
      }
    });
  }

  protected skipToContent(event: Event) {
    event.preventDefault();
    this.content().nativeElement.focus();
  }

  private focusPage() {
    afterNextRender(() => {
      const main = this.content().nativeElement;
      (main.querySelector<HTMLElement>('h1') ?? main).focus();
    }, { injector: this.injector });
  }
}
