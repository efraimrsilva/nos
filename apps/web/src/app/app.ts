import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import { afterNextRender, Component, computed, DestroyRef, effect, inject, Injector, resource, signal, viewChild, type ElementRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationError, NavigationSkipped, NavigationStart, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Account } from './account';
import { Appearance } from './appearance';
import { displayName, PreviewProfile } from './preview-profile';
import { ProblemReport } from './problem-report';
import { clearProblemReportReminder } from './problem-report-reminder';
import { installDialogBackdropDismiss } from './shared/dialog-backdrop-dismiss';
import { RouteState } from './shared/route-state';
import { isNucleusId, profileLetters } from './nuclei/nucleus-model';
import { watchNucleusIdentity } from './nuclei/nucleus-identity-sync';
import { NucleiData } from './nuclei/nuclei-data';
import { NavigationLinks, navAreaMatches, type NavigationItem } from './navigation-links';
import { readNavigationCounts, type NavigationCounts } from '../domain/navigation/counts';
import { NavIcon } from './shared/nav-icon';
import { HeaderActions } from './shared/header-actions';
import { NoticeView } from './shared/notice';
import manifest from '../../package.json';

@Component({
  imports: [RouterLink, RouterOutlet, RouteState, Account, ProblemReport, NavigationLinks, NavIcon, NgTemplateOutlet, NoticeView],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css', './shell-navigation.css'],
})
export class App {
  protected readonly headerActions = inject(HeaderActions).template;
  protected readonly router = inject(Router);
  protected readonly profile = inject(PreviewProfile);
  private readonly data = inject(NucleiData);
  protected readonly nucleusId = signal<string | null>(null);
  protected readonly currentPath = signal('');
  private navigationOrigins: {nav:HTMLElement; rect:DOMRect}[] = [];
  private readonly navigationHighlights = new Map<HTMLElement,HTMLElement>();
  protected readonly publicLayout = computed(() => {
    const path = this.currentPath();
    // Antes do primeiro NavigationEnd, o layout público evita exibir a navegação interna.
    return !path || path === 'boas-vindas' || path === 'conta/nova-senha' ||
      (!this.profile.user() && (path === 'conta' || path.startsWith('conta/'))) ||
      path.startsWith('auth/');
  });
  private readonly nucleusList: NavigationItem = {label: 'Seus Núcleos', url: '/nucleos', count: 'nuclei', icon:'users', tone:'blue'};
  private readonly account: NavigationItem = {label: 'Conta, Preferências e Ajuda', url: '/configuracoes/conta', icon:'lock', tone:'violet'};
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
      {label:'Manifesto e cuidado',url:base + '/manifesto',icon:'scroll',tone:'amber',planned:true},
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
  private readonly lastNucleus = signal<{owner: string; nucleus: Awaited<ReturnType<NucleiData['last']>>} | null>(null);
  private readonly lastCounts = signal<{owner: string; counts: NavigationCounts} | null>(null);
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
      return {owner: params.owner, nucleus: nucleus ?? null, version};
    },
  });
  protected readonly currentNucleus = computed(() => {
    const owner = this.profile.user()?.id;
    if (!owner || this.publicLayout()) return null;
    const current = !this.selected.isLoading() && this.selected.hasValue() ? this.selected.value() : this.lastNucleus();
    const id = this.nucleusId();
    return current?.owner === owner && (!id || current.nucleus?.id === id) ? current.nucleus : null;
  });
  protected readonly contextId = computed(() => this.nucleusId() ?? this.currentNucleus()?.id ?? null);
  protected readonly totals = resource({
    params: () => {
      const owner = this.profile.user()?.id;
      return owner && this.countVisible() ? {owner, path:this.currentPath()} : undefined;
    },
    // Um resultado pertence à conta que iniciou a consulta, mesmo após trocar de rota.
    loader: async ({params}) => ({
      owner: params.owner,
      counts: await readNavigationCounts(await this.data.clientForAccount(params.owner)),
    }),
  });
  protected readonly counts = computed(() => {
    const owner = this.profile.user()?.id;
    const latest = this.totals.hasValue() ? this.totals.value() : null;
    if (latest?.owner === owner && latest?.counts) return latest.counts;
    const previous = this.lastCounts();
    return previous && previous.owner === owner ? previous.counts : null;
  });
  protected readonly sidebarHidden = signal(false);
  protected readonly profileMenuOpen = signal(false);
  protected readonly moreOpen = signal(false);
  protected readonly failedUrl = signal('');
  protected readonly activeLabel = signal('');
  private readonly injector = inject(Injector);
  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');
  private readonly more = viewChild<ElementRef<HTMLDialogElement>>('more');
  private readonly notifications = viewChild<ElementRef<HTMLDialogElement>>('notifications');
  private readonly accountMenu = viewChild<ElementRef<HTMLDialogElement>>('accountMenu');
  private initialNavigation = true;

  constructor() {
    inject(Appearance);
    const mobile = matchMedia('(max-width:700px)');
    const closeMenuOnResize = () => {
      if (mobile.matches) this.accountMenu()?.nativeElement.close();
      else this.more()?.nativeElement.close();
    };
    mobile.addEventListener('change', closeMenuOnResize);
    inject(DestroyRef).onDestroy(() => mobile.removeEventListener('change', closeMenuOnResize));
    watchNucleusIdentity(
      () => this.selected.hasValue() ? this.selected.value()?.version : undefined,
      () => this.selected.isLoading(),
      () => this.selected.reload(),
    );
    effect(() => {
      const owner = this.profile.user()?.id;
      const current = this.selected.hasValue() && !this.selected.isLoading() ? this.selected.value() : null;
      const totals = this.totals.hasValue() ? this.totals.value() : null;
      // Mantém a lateral durante a atualização, limitando os valores à conta atual.
      if (current && current.owner === owner) this.lastNucleus.set(current);
      if (totals?.counts && totals.owner === owner) this.lastCounts.set({owner, counts: totals.counts});
    });
    let previousAccount: string | undefined;
    effect(() => {
      const account = this.profile.user()?.id;
      if (previousAccount && previousAccount !== account) {
        this.lastCounts.set(null);
        this.lastNucleus.set(null);
        clearProblemReportReminder(previousAccount);
        this.accountMenu()?.nativeElement.close();
        this.more()?.nativeElement.close();
        this.notifications()?.nativeElement.close();
      }
      previousAccount = account;
    });
    inject(DestroyRef).onDestroy(installDialogBackdropDismiss(inject(DOCUMENT)));
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationStart || event instanceof NavigationSkipped) this.failedUrl.set('');
      if (event instanceof NavigationStart) this.rememberNavigationHighlight();
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
        this.notifications()?.nativeElement.close();
        this.accountMenu()?.nativeElement.close();
        // Depois de Voltar, Avançar ou seguir um link interno, o foco acompanha o novo conteúdo.
        if (!this.initialNavigation && pathChanged) this.focusPage();
        if (pathChanged && this.navigationOrigins.length) {
          const origins = this.navigationOrigins;
          afterNextRender(() => {
            if (this.currentPath() === path) this.moveNavigationHighlight(origins);
          },{injector:this.injector});
        }
        this.initialNavigation = false;
      }
    });
  }

  private rememberNavigationHighlight() {
    this.navigationOrigins = [];
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (const nav of document.querySelectorAll<HTMLElement>('#desktop-navigation > nav, .mobile-nav')) {
      const active = this.navigationHighlights.get(nav) ?? nav.querySelector('a.active, a.in-area, button.active');
      if (active?.getClientRects().length) this.navigationOrigins.push({nav,rect:active.getBoundingClientRect()});
    }
  }

  private moveNavigationHighlight(origins: {nav:HTMLElement; rect:DOMRect}[]) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (const {nav,rect:from} of origins) {
      const active = nav.querySelector('a.active, a.in-area, button.active');
      if (!active?.getClientRects().length) continue;
      const to = active.getBoundingClientRect();
      if (from.x === to.x && from.y === to.y) continue;
      const frame = nav.getBoundingClientRect();
      this.navigationHighlights.get(nav)?.remove();
      const highlight = document.createElement('span');
      highlight.setAttribute('aria-hidden','true');
      // Só a sobreposição percorre a distância entre os itens; layout e alvos ficam imóveis.
      Object.assign(highlight.style,{
        position:'absolute', pointerEvents:'none', zIndex:'-1', borderRadius:'.45rem',
        background:'var(--accent-soft)', boxShadow:'var(--nav-moving-shadow,inset 3px 0 var(--leaf))',
        left:to.x-frame.x-nav.clientLeft+nav.scrollLeft+'px', top:to.y-frame.y-nav.clientTop+nav.scrollTop+'px',
        width:to.width+'px', height:to.height+'px', transformOrigin:'top left',
      });
      this.navigationHighlights.set(nav,highlight);
      nav.style.setProperty('--nav-active-background','transparent');
      nav.style.setProperty('--nav-active-shadow','none');
      nav.append(highlight);
      const animation = highlight.animate([
        {transform:`translate(${from.x-to.x}px,${from.y-to.y}px) scale(${from.width/to.width},${from.height/to.height})`},
        {transform:'none'},
      ],{duration:300,easing:'cubic-bezier(.22,1,.36,1)'});
      animation.onfinish = () => {
        if (this.navigationHighlights.get(nav) !== highlight) return;
        this.navigationHighlights.delete(nav);
        highlight.remove();
        nav.style.removeProperty('--nav-active-background');
        nav.style.removeProperty('--nav-active-shadow');
      };
    }
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

  protected openProfile(panel: HTMLDialogElement) {
    panel.showModal();
    this.profileMenuOpen.set(true);
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
