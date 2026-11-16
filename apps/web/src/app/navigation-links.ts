import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive, type IsActiveMatchOptions } from '@angular/router';
import type { NavigationCounts } from '../../../../src/features/navigation/counts';

export type NavigationItem = {label: string; url: string; count?: keyof NavigationCounts};

@Component({
  selector: 'app-navigation-links',
  imports: [RouterLink, RouterLinkActive],
  template: `
    @for (item of items(); track item.url) {
      <a [routerLink]="item.url" routerLinkActive="active" [routerLinkActiveOptions]="activeMatch"
        ariaCurrentWhenActive="page" [attr.aria-description]="item.count && showCounts() ? description(counts()?.[item.count]) : null"
        (click)="followed.emit()">{{ item.label }}
        @if (item.count; as key) {
          @if (showCounts()) {
            @let value = counts()?.[key];
            <span class="count" [attr.title]="description(value)" aria-hidden="true">
              {{ value === undefined ? '—' : compact() ? format.format(value) : value }}
            </span>
          }
        }
      </a>
    }
  `,
  styles: `
    :host { display: contents; }
    a { display:flex; align-items:center; gap:.25rem; min-height:2.75rem; padding:.5rem .7rem; border-radius:.45rem; color:var(--muted); text-decoration:none; }
    a:hover, a.active { background:var(--accent-soft); color:var(--leaf); }
    a.active { font-weight:700; }
    .count { margin-inline-start:auto; font-size:.8em; }
    @media(max-width:700px) {
      :host(.compact) a { justify-content:center; text-align:center; padding-inline:.13rem; font-size:.78rem; line-height:1.3; }
      :host(.compact) .count { margin-inline-start:0; }
    }
  `,
})
export class NavigationLinks {
  readonly items = input.required<NavigationItem[]>();
  readonly counts = input<NavigationCounts | null>(null);
  readonly showCounts = input(false);
  readonly compact = input(false);
  readonly followed = output<void>();
  protected readonly activeMatch: IsActiveMatchOptions = {
    paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored',
  };
  protected readonly format = new Intl.NumberFormat('pt-BR', {notation:'compact'});

  protected description(value: number | undefined) {
    return value === undefined ? 'Total geral indisponível' : 'Total geral da sua conta: ' + value;
  }
}
