import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, DestroyRef, inject, Injector, signal, viewChild, type ElementRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, NavigationError, NavigationSkipped, NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet, type IsActiveMatchOptions } from '@angular/router';
import { installDialogBackdropDismiss } from './shared/dialog-backdrop-dismiss';
import { RouteState } from './shared/route-state';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet, RouteState],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly areas = [
    { label: 'Início', url: '/boas-vindas' },
    { label: 'Minha conta', url: '/configuracoes/conta' },
  ];
  protected readonly activeMatch: IsActiveMatchOptions = {
    paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored',
  };
  protected readonly router = inject(Router);
  protected readonly sidebarHidden = signal(false);
  protected readonly failedUrl = signal('');
  protected readonly activeLabel = signal('');
  private readonly injector = inject(Injector);
  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');
  private readonly more = viewChild<ElementRef<HTMLDialogElement>>('more');
  private initialNavigation = true;

  constructor() {
    inject(DestroyRef).onDestroy(installDialogBackdropDismiss(inject(DOCUMENT)));
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationStart || event instanceof NavigationSkipped) this.failedUrl.set('');
      if (event instanceof NavigationError) this.failedUrl.set(event.url);
      if (event instanceof NavigationEnd) {
        const path = this.router.parseUrl(event.urlAfterRedirects).root.children['primary']
          ?.segments.map(segment => segment.path).join('/') ?? '';
        const account = path === 'conta' || path.startsWith('conta/');
        const title = this.router.routerState.snapshot.root.firstChild?.title?.split(' · ')[0];
        this.activeLabel.set(this.areas.find(item => item.url === '/' + path)?.label ?? (account ? 'Sua conta' : title ?? ''));
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
