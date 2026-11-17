import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountStory } from './auth/account-story';

@Component({
  imports: [RouterLink, AccountStory],
  template: `
    <div class="welcome">
      <app-account-story [welcome]="true" />
      <section class="welcome-copy">
        <p class="welcome-kicker">Bem-vindo ao Nós</p>
        <h1 tabindex="-1">Fortalecendo os laços que unem quem você ama.</h1>
        <p>Um espaço privado para cultivar presença, respeito e pequenos cuidados no tempo de vocês.</p>
        <blockquote>Toda relação pode encontrar um jeito próprio de florescer.</blockquote>
        <div class="welcome-actions">
          <a class="button" routerLink="/conta">Começar agora</a>
          <a class="icon-button" routerLink="/conta" [queryParams]="{modo:'login'}">Entrar na minha conta <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </div>
  `,
  styles: `
    .welcome { display:grid; gap:clamp(1rem,4vw,3rem); align-items:start; }
    .welcome-copy { display:grid; gap:1rem; padding-block:clamp(.3rem,2vw,1.5rem); }
    .welcome-kicker { color:var(--leaf); font-size:.75rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; }
    h1 { font:500 clamp(2rem,4vw,3rem)/1.13 Georgia,serif; }
    blockquote { margin:.25rem 0; padding-inline-start:1rem; border-inline-start:2px solid var(--line); color:var(--leaf); font:1.3rem/1.45 Georgia,serif; }
    .welcome-actions { display:flex; flex-wrap:wrap; gap:.65rem; }
    .welcome-actions .icon-button { display:inline-flex; gap:.55rem; }
    @media (min-width:960px) { .welcome { grid-template-columns:minmax(0,1fr) minmax(0,1.1fr); } }
  `,
})
export class PreviewHome {}
