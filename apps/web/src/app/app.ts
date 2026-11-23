import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, computed, DestroyRef, effect, inject, Injector, resource, signal, viewChild, type ElementRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationError, NavigationSkipped, NavigationStart, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Account } from './account';
import { Appearance } from './appearance';
import { AppearancePicker } from './appearance-picker';
import { displayName, PreviewProfile } from './preview-profile';
import { ProblemReport } from './problem-report';
import { clearProblemReportReminder } from './problem-report-reminder';
import { installDialogBackdropDismiss } from './shared/dialog-backdrop-dismiss';
import { RouteState } from './shared/route-state';
import { isNucleusId, profileLetters } from './nuclei/nucleus-model';
import { watchNucleusIdentity } from './nuclei/nucleus-identity-sync';
import { NucleiData } from './nuclei/nuclei-data';
import { NavigationLinks, navAreaMatches, type NavigationItem } from './navigation-links';
import { readNavigationCounts } from '../domain/navigation/counts';
import { NavIcon } from './shared/nav-icon';
import manifest from '../../package.json';

@Component({
  imports: [RouterLink, RouterOutlet, RouteState, Account, ProblemReport, AppearancePicker, NavigationLinks, NavIcon],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css', './shell-navigation.css'],
})
export class App {
  protected readonly router = inject(Router);
  protected readonly profile = inject(PreviewProfile);
  private readonly data = inject(NucleiData);
  protected readonly nucleusId = signal<string | null>(null);
  protected readonly currentPath = signal('');
  protected readonly publicLayout = computed(() => {
    const path = this.currentPath();
    // Antes do primeiro NavigationEnd, o layout público evita exibir a navegação interna.
    return !path || path === 'boas-vindas' || path === 'conta/nova-senha' ||
      (!this.profile.user() && (path === 'conta' || path.startsWith('conta/'))) ||
      path.startsWith('auth/');
  });
  private readonly nucleusList: NavigationItem = {label: 'Seus Núcleos', url: '/nucleos', count: 'nuclei', icon:'users', tone:'blue'};
  private readonly account: NavigationItem = {label: 'Minha conta', url: '/configuracoes/conta', icon:'lock', tone:'violet'};
  protected readonly countVisible = computed(() => {
    const path = this.currentPath();
    return Boolean(this.profile.user()) && path !== 'boas-vindas' && !path.startsWith('auth/') && !path.startsWith('conta/');
  });
  protected readonly groups = computed(() => {
    const id = this.contextId();
    const base = '/nucleos/' + id;
    const history: NavigationItem[] = [
      {label:'Árvore e memórias',url:base + '/arvore',icon:'tree',planned:true},
      {label:'Conexões e perfis',url:base + '/conexoes',icon:'links',tone:'violet',planned:true},
      {label:'Manifesto e cuidado',url:base + '/manifesto',icon:'heart',tone:'amber',planned:true},
    ];
    return [
      {label:'Meu espaço',items:[
        ...(id ? [{label:'Início',url:base,icon:'home'} as const] :
          !this.profile.user() ? [{label:'Início',url:'/boas-vindas',icon:'home'} as const] : []),
        this.nucleusList,
      ]},
      ...(id ? [
        {label:'Cultivar juntos',items:[
          {label:'Acordos',url:base + '/acordos', count:'agreements',icon:'heart',tone:'rose'},
          {label:'Agenda',url:base + '/agenda', count:'events',icon:'calendar',tone:'amber'},
        ] satisfies NavigationItem[]},
        {label:'História e vínculos',items:history},
      ] : []),
      {label:'Sua conta',items:[this.account]},
    ];
  });
  protected readonly mobileAreas = computed(() => this.contextId()
    ? this.groups().slice(0,2).flatMap(group => group.items)
    : this.profile.user() ? [this.nucleusList] : this.groups().flatMap(group => group.items));
  protected readonly menuGroups = computed(() => {
    if (!this.contextId()) return this.groups();
    const primary = this.mobileAreas();
    return this.groups().map(group => ({...group,items:group.items.filter(item => !primary.includes(item))}))
      .filter(group => group.items.length > 0);
  });
  protected readonly mobileAreaActive = computed(() => this.mobileAreas().some(item =>
    item.url === '/' + this.currentPath() || navAreaMatches(item.url,this.currentPath())));
  protected readonly version = manifest.version;
  protected readonly initials = computed(() => profileLetters(displayName(this.profile.user())));
  protected readonly selected = resource({
    params: () => {
      const owner = this.profile.user()?.id;
      const id = this.nucleusId();
      return owner && !this.publicLayout() ? {owner,id} : undefined;
    },
    loader: async ({params,abortSignal}) => {
      const [nucleus,version] = await Promise.all([
        params.id ? this.data.selected(params.owner,params.id,abortSignal).then(result => result?.nucleus)
          : this.data.last(params.owner,abortSignal),
        this.data.identityVersion(params.owner,abortSignal),
      ]);
      // Como no Next.js, a lembrança depende de vínculo conferido e pertence à conta atual.
      if (!abortSignal.aborted && params.id && nucleus) this.data.remember(params.owner,nucleus.id);
      return nucleus ? {nucleus,version} : null;
    },
  });
  protected readonly currentNucleus = computed(() => this.selected.hasValue() && !this.selected.isLoading() ? this.selected.value()?.nucleus ?? null : null);
  protected readonly contextId = computed(() => this.nucleusId() ?? this.currentNucleus()?.id ?? null);
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
  protected readonly profileMenuOpen = signal(false);
  protected readonly moreOpen = signal(false);
  protected readonly failedUrl = signal('');
  protected readonly activeLabel = signal('');
  private readonly injector = inject(Injector);
  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');
  private readonly more = viewChild<ElementRef<HTMLDialogElement>>('more');
  private readonly notifications = viewChild<ElementRef<HTMLElement>>('notifications');
  private readonly accountMenu = viewChild<ElementRef<HTMLElement>>('accountMenu');
  private initialNavigation = true;

  constructor() {
    inject(Appearance);
    const mobile = matchMedia('(max-width:700px)');
    const closeMenuOnResize = () => {
      if (mobile.matches) this.accountMenu()?.nativeElement.hidePopover();
      else this.more()?.nativeElement.close();
    };
    mobile.addEventListener('change', closeMenuOnResize);
    inject(DestroyRef).onDestroy(() => mobile.removeEventListener('change', closeMenuOnResize));
    watchNucleusIdentity(
      () => this.selected.hasValue() ? this.selected.value()?.version : undefined,
      () => this.selected.isLoading(),
      () => this.selected.reload(),
    );
    let previousAccount: string | undefined;
    effect(() => {
      const account = this.profile.user()?.id;
      if (previousAccount && previousAccount !== account) {
        clearProblemReportReminder(previousAccount);
        this.accountMenu()?.nativeElement.hidePopover();
        this.more()?.nativeElement.close();
        this.notifications()?.nativeElement.hidePopover();
      }
      previousAccount = account;
    });
    inject(DestroyRef).onDestroy(installDialogBackdropDismiss(inject(DOCUMENT)));
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationStart || event instanceof NavigationSkipped) this.failedUrl.set('');
      if (event instanceof NavigationError) this.failedUrl.set(event.url);
      if (event instanceof NavigationEnd) {
        const path = this.router.parseUrl(event.urlAfterRedirects).root.children['primary']
          ?.segments.map(segment => segment.path).join('/') ?? '';
        const [area,id] = path.split('/');
        const pathChanged = path !== this.currentPath();
        this.currentPath.set(path);
        this.nucleusId.set(area === 'nucleos' && isNucleusId(id) ? id : null);
        const account = path === 'conta' || path.startsWith('conta/');
        let route = this.router.routerState.snapshot.root;
        while (route.firstChild) route = route.firstChild;
        const title = route.title?.split(' · ')[0];
        this.activeLabel.set(this.groups().flatMap(group => group.items).find(item => item.url === '/' + path || navAreaMatches(item.url,path))?.label ?? (account ? 'Sua conta' : title ?? ''));
        this.more()?.nativeElement.close();
        this.notifications()?.nativeElement.hidePopover();
        this.accountMenu()?.nativeElement.hidePopover();
        // Depois de Voltar, Avançar ou seguir um link interno, o foco acompanha o novo conteúdo.
        if (!this.initialNavigation && pathChanged) this.focusPage();
        this.initialNavigation = false;
      }
    });
  }

  protected skipToContent(event: Event) {
    event.preventDefault();
    this.content().nativeElement.focus();
  }

  protected openMore(dialog: HTMLDialogElement) {
    this.moreOpen.set(true);
    dialog.showModal();
  }

  protected closeMoreOnLink(event: MouseEvent, dialog: HTMLDialogElement) {
    if (this.isPlainLinkClick(event)) dialog.close();
  }

  protected closeProfileOnLink(event: MouseEvent, panel: HTMLElement) {
    if (this.isPlainLinkClick(event)) panel.hidePopover();
  }

  private isPlainLinkClick(event: MouseEvent) {
    return event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey &&
      event.target instanceof Element && Boolean(event.target.closest('a[href]'));
  }

  private focusPage() {
    afterNextRender(() => {
      const main = this.content().nativeElement;
      (main.querySelector<HTMLElement>('h1') ?? main).focus();
    }, { injector: this.injector });
  }
}
