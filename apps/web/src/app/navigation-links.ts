import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavIcon, type NavIconName } from './shared/nav-icon';
import type { NavigationCounts } from '../domain/navigation/counts';

export type NavigationItem = {label: string; mobileLabel?:string; url: string; count?: keyof NavigationCounts; icon: NavIconName; tone?: string; planned?: boolean};

export function navAreaMatches(url: string, path: string) {
  const target = url.slice(1);
  const parent = {memorias:'arvore',perfis:'conexoes',cuidado:'manifesto'} as Record<string,string>;
  const [area,id,section] = path.split('/');
  if (target === 'nucleos' && (path === 'comecar' || path.startsWith('comecar/'))) return true;
  return (target.endsWith('/acordos') && path.startsWith(target + '/')) ||
    (area === 'nucleos' && Boolean(parent[section]) && target === [area,id,parent[section]].join('/'));
}

@Component({
  selector: 'app-navigation-links',
  imports: [RouterLink, NavIcon],
  template: `
    @for (item of items(); track item.url) {
      @let active = item.url === '/' + path();
      <a [routerLink]="item.url" [class.active]="active"
        [attr.aria-current]="active ? 'page' : null" [attr.aria-label]="item.url === '/nucleos' || (compact() && item.mobileLabel) ? item.label : null"
        [attr.aria-description]="item.count && showCounts() ? description(counts()?.[item.count]) : null"
        (click)="followed.emit()" [class.in-area]="inArea(item.url)">
        <app-nav-icon [name]="item.icon" [attr.data-tone]="item.tone ?? null" />
        <span class="link-label">@if (item.url === "/nucleos" && !compact()) { Seus<span class="nucleus-second-word">Núcleos</span> } @else { {{ compact() ? item.mobileLabel ?? item.label : item.label }} }
          @if (item.icon === 'home' && nucleusName()) { <small class="nucleus-name" [attr.title]="nucleusName()">{{ nucleusName() }}</small> }
        </span>
        @if (item.planned) { <span title="Esboço de funcionalidade" aria-hidden="true">○</span> }
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
    a:hover, a.active { background:var(--nav-active-background,var(--accent-soft)); color:var(--leaf); }
    a.active, a.in-area { font-weight:700; background:var(--nav-active-background,var(--accent-soft)); color:var(--leaf); box-shadow:var(--nav-active-shadow,inset 3px 0 var(--leaf)); }
    [data-tone="blue"] { --icon-tone:light-dark(#006eb0,#72caff); }
    [data-tone="amber"] { --icon-tone:light-dark(#a94e00,#ffc673); }
    [data-tone="rose"] { --icon-tone:light-dark(#b82c62,#ff9ac1); }
    [data-tone="violet"] { --icon-tone:light-dark(#7942b8,#d0aeff); }
    .link-label { min-width:0; }
    .nucleus-name { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:.7rem; }
    .count { margin-inline-start:auto; font-size:.8em; font-variant-numeric:tabular-nums; }
    .nucleus-second-word { margin-inline-start:.22em; }
    @media(min-width:701px) { .nucleus-second-word { display:block; margin-inline-start:0; } }
    @media(max-width:700px) {
      /* Reservar as linhas impede que o nome e os totais redimensionem a barra. */
      :host(.compact) a { display:grid; grid-template:20px 24px 10px / minmax(0,1fr); justify-items:center; align-content:center; align-items:start; gap:0; height:60px; min-width:0; text-align:center; padding:.15rem 0; font-size:clamp(.56rem,2.65vw,.68rem); line-height:1.18; }
      :host(.compact) .link-label { max-width:100%; }
      :host(.compact) .nucleus-name { font-size:9px; font-weight:400; }
      :host(.compact) a:is(.active,.in-area) { box-shadow:var(--nav-active-shadow,inset 0 3px var(--leaf)); }
      :host(.compact) .count { font-variant-numeric:tabular-nums; }
      :host(.compact) .count { margin-inline-start:0; }
    }
  `,
})
export class NavigationLinks {
  readonly items = input.required<NavigationItem[]>();
  readonly counts = input<NavigationCounts | null>(null);
  readonly showCounts = input(false);
  readonly compact = input(false);
  readonly path = input('');

  readonly nucleusName = input('');
  protected inArea(url: string) { return navAreaMatches(url,this.path()); }
  readonly followed = output<void>();
  protected readonly format = new Intl.NumberFormat('pt-BR', {notation:'compact'});

  protected description(value: number | undefined) {
    return value === undefined ? 'Total geral indisponível' : 'Total geral da sua conta: ' + value;
  }
}
