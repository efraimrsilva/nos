import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { themes, resolveTheme, type ThemeId } from '../domain/appearance/themes';
import { PreviewProfile } from './preview-profile';

const themeColors = [
  '--canvas', '--surface', '--ink', '--muted', '--leaf', '--line', '--accent-soft',
  '--nav-surface', '--hero', '--on-leaf', '--theme-error',
];
const themeTiming = {duration:840, easing:'cubic-bezier(.22,1,.36,1)', fill:'backwards' as const};

@Injectable({providedIn: 'root'})
export class Appearance {
  readonly themes = themes;
  private readonly document = inject(DOCUMENT);
  private readonly profile = inject(PreviewProfile);
  private readonly router = inject(Router);
  private readonly path = signal(this.document.location.pathname);
  private readonly startingTheme = this.readStartingTheme();
  private readonly state = signal<{owner: string; theme: ThemeId; saving: boolean; error: string} | null>(null);
  private queued: {owner: string; theme: ThemeId} | null = null;
  private running = false;
  private themeTransition?: ViewTransition;
  private menuAnimations: Animation[] = [];

  readonly feedback = computed(() => {
    const state = this.state();
    return state?.owner === this.profile.user()?.id ? state : null;
  });
  readonly saving = computed(() => this.feedback()?.saving ?? false);
  readonly selected = computed(() => this.feedback()?.theme ?? (this.profile.loading() && !this.profile.user()
    ? this.startingTheme : resolveTheme(this.profile.user()?.user_metadata['appearance_theme'])));

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationEnd) this.path.set(event.urlAfterRedirects);
    });
    effect(() => {
      const owner = this.profile.user()?.id;
      const state = untracked(this.state);
      if (state && state.owner !== owner) this.state.set(null);
    });
    effect(() => {
      const path = this.path().split(/[?#]/, 1)[0];
      const publicEntry = path === '/boas-vindas' || path.startsWith('/conta/') || path.startsWith('/auth/');
      const selected = this.selected();
      const id = publicEntry ? 'light' : selected;
      this.paint(id);
      // O cache só antecipa a aparência. A sessão verificada continua sendo a fonte da preferência.
      try {
        if (this.profile.user()) {
          const canvas = themes.find(item => item.id === selected)!.canvas;
          localStorage.setItem('nos-angular-theme', JSON.stringify({id: selected, canvas}));
        } else if (!this.profile.loading() && !this.profile.notice()) {
          localStorage.removeItem('nos-angular-theme');
        }
      } catch { /* O tema continua disponível quando o navegador bloqueia o armazenamento. */ }
    });
  }

  private paint(id: ThemeId) {
    const theme = themes.find(item => item.id === id)!;
    const root = this.document.documentElement;
    const dark = 'dark' in theme && theme.dark;
    root.dataset['theme'] = id;
    root.style.colorScheme = dark ? 'dark' : 'light';
    // O catálogo é compartilhado com a versão anterior. A interface Angular usa suas próprias variáveis.
    const variables = {
      canvas: theme.canvas, surface: theme.surface, ink: theme.ink, muted: theme.muted,
      leaf: theme.accent, line: theme.line, 'accent-soft': theme.soft,
      'nav-surface': theme.nav, hero: theme.hero, 'on-leaf': dark ? theme.surface : '#fff',
      'theme-error': dark ? '#ffc0c3' : '#9a232e',
    };
    for (const [key, value] of Object.entries(variables)) root.style.setProperty('--' + key, value);
    this.document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.canvas);
  }

  private async transitionTo(theme: ThemeId, owner: string, menu?: HTMLDialogElement | null) {
    if (this.themeTransition) {
      this.themeTransition.skipTransition();
      await this.themeTransition.finished;
    }
    if (this.profile.user()?.id !== owner) return;
    const apply = () => {
      if (this.profile.user()?.id !== owner) return;
      this.state.set({owner, theme, saving: true, error: ''});
      this.paint(theme);
    };
    const animate = this.selected() !== theme && matchMedia('(prefers-reduced-motion: no-preference)').matches;
    if (animate && menu?.open && typeof CSS.registerProperty === 'function') {
      this.transitionOpenMenu(menu, apply);
      return;
    }
    if (!animate || !this.document.startViewTransition) {
      apply();
      return;
    }

    // O navegador cruza as duas paletas por região, sem remontar componentes nem perder o foco.
    const root = this.document.documentElement;
    const candidates = [...this.document.querySelectorAll<HTMLElement>(
      '.shell .nav-group, .shell .header, #conteudo :is(header,section,.nucleus-card,.nucleus-home-agreement), dialog[open]'
    )].filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight;
    });
    const regions = candidates.filter(element => !candidates.some(child => child !== element && element.contains(child)));
    const named = regions.map((element, index) => ({element, name: 'theme-region-' + index}));
    for (const {element,name} of named) element.style.viewTransitionName = name;
    root.classList.add('theme-transition');
    const transition = this.document.startViewTransition(apply);
    this.themeTransition = transition;
    void transition.ready.then(() => {
      ['root', ...named.map(region => region.name)].forEach((name, index) => {
        root.animate([{opacity: 1}, {opacity: 0}], {
          pseudoElement: '::view-transition-old(' + name + ')',
          ...themeTiming, delay: index * 120, fill: 'both',
        });
      });
    }).catch(() => { /* Uma mudança de rota pode interromper a captura. A preferência já foi aplicada. */ });
    void transition.finished.finally(() => {
      for (const {element} of named) element.style.removeProperty('view-transition-name');
      root.classList.remove('theme-transition');
      if (this.themeTransition === transition) this.themeTransition = undefined;
    });
    await transition.updateCallbackDone;
  }

  private transitionOpenMenu(menu: HTMLDialogElement, apply: () => void) {
    const root = this.document.documentElement;
    const readPalette = () => {
      const computed = getComputedStyle(root);
      return Object.fromEntries(themeColors.map(key => [key, computed.getPropertyValue(key).trim()]));
    };
    const previous = readPalette();
    for (const animation of this.menuAnimations) animation.cancel();
    this.menuAnimations = [];
    apply();
    const next = readPalette();
    // Uma captura de página sobre o diálogo altera a composição do backdrop. Aqui a camada permanece nativa.
    const regions = [menu, ...menu.querySelectorAll<HTMLElement>(
      '.account-popover-heading, .account-page-link, .account-settings-grid > .card, app-account-preferences > .surface, .nav-group'
    )].filter(element => {
      const rect = element.getBoundingClientRect();
      const bounds = menu.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.bottom > bounds.top &&
        rect.top < Math.min(bounds.bottom, innerHeight);
    });
    const animations = [root, ...regions].map((region, index) => region.animate(
      [previous, next], {...themeTiming, delay:index * 120},
    ));
    this.menuAnimations = animations;
    void Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
      if (this.menuAnimations === animations) this.menuAnimations = [];
    });
  }

  private readStartingTheme(): ThemeId {
    try {
      return resolveTheme(JSON.parse(localStorage.getItem('nos-angular-theme') ?? 'null')?.id ?? this.profile.cachedTheme());
    } catch { return 'light'; }
  }

  async select(theme: ThemeId, menu?: HTMLDialogElement | null) {
    const owner = this.profile.user()?.id;
    if (!owner) return;
    await this.transitionTo(theme, owner, menu);
    if (this.profile.user()?.id !== owner) return;
    this.queued = {owner, theme};
    if (this.running) return;
    this.running = true;
    try {
      // Agrupa cliques rápidos e mantém a última escolha visível mesmo se a gravação falhar.
      while (this.queued) {
        const desired = this.queued;
        this.queued = null;
        const error = await this.profile.saveMetadata('appearance_theme', desired.theme, desired.owner,
          'O tema está aplicado, mas não foi possível salvá-lo na conta. Tente novamente.');
        if (!this.queued && this.state()?.owner === desired.owner &&
            this.profile.user()?.id === desired.owner) {
          this.state.set({...desired, saving: false, error});
        }
      }
    } finally {
      this.running = false;
    }
  }
}
