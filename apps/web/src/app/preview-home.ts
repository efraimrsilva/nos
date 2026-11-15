import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  template: `
    <section class="surface welcome">
      <h1 tabindex="-1">Cultive seus vínculos</h1>
      <p>Um espaço para construir acordos e crescer juntos.</p>
      <a class="button" routerLink="/configuracoes/conta">Minha conta</a>
    </section>
  `,
  styles: `
    .welcome { background: var(--hero); padding: clamp(1.25rem, 6vw, 4rem); }
    h1 { font: 500 clamp(2rem, 5vw, 3.3rem)/1.1 Georgia, serif; }
  `,
})
export class PreviewHome {}
