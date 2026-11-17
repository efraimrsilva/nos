import { Component, input } from '@angular/core';

export type NavIconName = keyof typeof paths;
const paths = {
  home:'M3 10l9-7 9 7v10H3z M9 20v-7h6v7',
  users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M22 21v-2a4 4 0 0 0-3-4 M13 4a4 4 0 0 1 0 8 M9 5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7',
  heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
  calendar:'M8 3v4m8-4v4 M4 10h16 M4 5h16v16H4z M8 14h2m4 0h2m-8 3h2',
  tree:'M9 21h6 M12 21v-4 M6 17a4 4 0 0 1-2-7 5 5 0 0 1 4-6 5 5 0 0 1 8 0 5 5 0 0 1 4 6 4 4 0 0 1-2 7z',
  links:'M10 3h4v4h-4z M4 17h4v4H4z M16 17h4v4h-4z M12 7v6 M6 17v-4h12v4',
  lock:'M5 10h14v11H5z M8 10V7a4 4 0 0 1 8 0v3 M12 14v3',
  more:'M4 12h.01m8 0h.01m8 0h.01',
  bug:'M6 9h12v6a6 6 0 0 1-12 0z M8 9V7a4 4 0 0 1 8 0v2 M8 4 6 2m10 2 2-2 M12 10v10 M3 10l3 2m-3 5 3-1m15-6-3 2m3 5-3-1',
  bell:'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
} as const;

@Component({
  selector:'app-nav-icon',
  template:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path [attr.d]="paths[name()]" /></svg>',
  styles:':host { display:inline-flex; flex:none; color:var(--icon-tone,var(--leaf)); }',
})
export class NavIcon {
  readonly name = input.required<NavIconName>();
  protected readonly paths = paths;
}
