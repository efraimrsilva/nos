import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  template: `
    <section class="surface welcome">
      <img src="/brand/nos-tree.png" width="877" height="875" alt="Árvore com troncos entrelaçados">
      <h1 tabindex="-1">Fortalecendo os laços que unem quem você ama.</h1>
      <p>Um espaço privado para cultivar suas relações com pequenos cuidados, conversas e acordos no tempo de vocês.</p>
      <div class="welcome-actions">
        <a class="button" routerLink="/conta">Começar agora</a>
        <a routerLink="/conta" [queryParams]="{modo:'login'}">Entrar na minha conta</a>
      </div>
    </section>
  `,
  styles: `
    .welcome { background: var(--hero); padding: clamp(1.25rem, 5vw, 3rem); }
    h1 { font: 500 clamp(1.8rem, 4vw, 3rem)/1.1 Georgia, serif; }
    img { display:block; width:min(32%, 13rem); height:auto; margin-block-end:1rem; }
    .welcome-actions { display:flex; flex-wrap:wrap; align-items:center; gap:.75rem; margin-block-start:1rem; }
    a:not(.button) { color:var(--leaf); }
  `,
})
export class PreviewHome {}
