import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, computed, DestroyRef, inject, Injector, resource, signal, viewChild, type ElementRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationError, NavigationSkipped, NavigationStart, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Appearance } from './appearance';
import { AppearancePicker } from './appearance-picker';
import { PreviewProfile } from './preview-profile';
import { ProblemReport } from './problem-report';
import { installDialogBackdropDismiss } from './shared/dialog-backdrop-dismiss';
import { RouteState } from './shared/route-state';
import { isNucleusId } from './nuclei/nucleus-model';
import { NucleiData } from './nuclei/nuclei-data';
import { NavigationLinks, type NavigationItem } from './navigation-links';
import { readNavigationCounts } from '../../../../src/features/navigation/counts';
import { sections } from './previews/examples';

@Component({
  imports: [RouterLink, RouterOutlet, RouteState, ProblemReport, AppearancePicker, NavigationLinks],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly router = inject(Router);
  protected readonly profile = inject(PreviewProfile);
  private readonly data = inject(NucleiData);
  protected readonly nucleusId = signal<string | null>(null);
  protected readonly currentPath = signal('');
  protected readonly publicLayout = computed(() => {
    const path = this.currentPath();
    return path === 'boas-vindas' || path === 'conta/nova-senha' ||
      (!this.profile.user() && (path === 'conta' || path.startsWith('conta/'))) ||
      path.startsWith('auth/');
  });
  private readonly nucleusList: NavigationItem = {label: 'Seus Núcleos', url: '/nucleos', count: 'nuclei'};
  private readonly account: NavigationItem = {label: 'Minha conta', url: '/configuracoes/conta'};
  protected readonly countVisible = computed(() => {
    const path = this.currentPath();
    return Boolean(this.profile.user()) && path !== 'boas-vindas' && !path.startsWith('auth/') && !path.startsWith('conta/');
  });
  protected readonly areas = computed<NavigationItem[]>(() => {
    const id = this.nucleusId();
    const root = id ? '/nucleos/' + id : '/boas-vindas';
    const items: NavigationItem[] = [{label: 'Início', url: root}, this.nucleusList];
    if (id) items.push({label:'Acordos', url:root + '/acordos', count:'agreements'}, {label:'Agenda', url:root + '/agenda', count:'events'});
    return [...items, this.account];
  });
  protected readonly mobileAreas = computed(() => this.nucleusId() ? this.areas().slice(0, -1) : this.areas());
  protected readonly moreAreas = computed<NavigationItem[]>(() => {
    const id = this.nucleusId();
    if (!id) return this.areas();
    const root = '/nucleos/' + id + '/';
    return [...this.areas(), {label:'Integrantes', url:root + 'pessoas', count:'people'},
      ...Object.entries(sections).map(([key, value]) => ({label:value.label, url:root + key}))];
  });
  protected readonly totals = resource({
    params: () => {
      const owner = this.profile.user()?.id;
      return owner && this.countVisible() ? {owner, path:this.currentPath()} : undefined;
    },
    // O contrato da função usa a própria sessão. Mudar de rota/conta invalida o resultado anterior.
    loader: async ({params}) => readNavigationCounts(await this.data.clientForAccount(params.owner)),
  });
  protected readonly counts = computed(() => this.totals.hasValue() && !this.totals.isLoading() ? this.totals.value() : null);
  protected readonly sidebarHidden = signal(false);
  protected readonly failedUrl = signal('');
  protected readonly activeLabel = signal('');
  private readonly injector = inject(Injector);
  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');
  private readonly more = viewChild<ElementRef<HTMLDialogElement>>('more');
  private readonly notifications = viewChild<ElementRef<HTMLDialogElement>>('notifications');
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
        this.currentPath.set(path);
        this.nucleusId.set(area === 'nucleos' && isNucleusId(id) ? id : null);
        const account = path === 'conta' || path.startsWith('conta/');
        let route = this.router.routerState.snapshot.root;
        while (route.firstChild) route = route.firstChild;
        const title = route.title?.split(' · ')[0];
        this.activeLabel.set(this.areas().find(item => item.url === '/' + path)?.label ?? (account ? 'Sua conta' : title ?? ''));
        this.more()?.nativeElement.close();
        this.notifications()?.nativeElement.close();
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
