import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { themes, resolveTheme, type ThemeId } from '../../../../src/features/appearance/themes';
import { PreviewProfile } from './preview-profile';

@Injectable({providedIn: 'root'})
export class Appearance {
  readonly themes = themes;
  private readonly document = inject(DOCUMENT);
  private readonly profile = inject(PreviewProfile);
  private readonly router = inject(Router);
  private readonly path = signal(this.router.url);
  private readonly state = signal<{owner: string; theme: ThemeId; saving: boolean; error: string} | null>(null);
  private queued: {owner: string; theme: ThemeId} | null = null;
  private running = false;

  readonly feedback = computed(() => {
    const state = this.state();
    return state?.owner === this.profile.user()?.id ? state : null;
  });
  readonly saving = computed(() => this.feedback()?.saving ?? false);
  readonly selected = computed(() => this.feedback()?.theme ?? resolveTheme(this.profile.user()?.user_metadata['appearance_theme']));

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
      const id = publicEntry ? 'light' : this.selected();
      const theme = themes.find(item => item.id === id)!;
      const root = this.document.documentElement;
      const dark = id === 'dark' || id === 'black' || id === 'neon';
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
    });
  }

  async select(theme: ThemeId) {
    const owner = this.profile.user()?.id;
    if (!owner) return;
    this.state.set({owner, theme, saving: true, error: ''});
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
