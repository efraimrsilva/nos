import { Component, input } from '@angular/core';

@Component({
  selector:'app-nucleus-steps',
  template:`
    <ol aria-label="Etapas da criação do Núcleo">
      @for (label of labels; track label; let index = $index) {
        <li [attr.aria-current]="current() === index + 1 ? 'step' : null"><span>{{ index + 1 }}</span>{{ label }}</li>
      }
    </ol>
  `,
  styles:`
    :host { display:block; }
    ol { display:flex; list-style:none; margin:4px 0 30px; padding:0; }
    li { display:flex; align-items:center; gap:9px; flex:1; min-width:0; color:var(--muted); font-size:12px; }
    li::after { content:""; height:1px; flex:1; margin-inline:4px 16px; background:var(--line); }
    li:last-child::after { display:none; }
    li span { display:grid; place-items:center; width:28px; height:28px; flex:none; border:1px solid var(--line); border-radius:50%; }
    li[aria-current="step"] { color:var(--leaf); font-weight:600; }
    li[aria-current="step"] span { color:var(--on-leaf,#fff); background:var(--leaf); border-color:var(--leaf); }
    @media (max-width:680px) {
      li { font-size:11px; gap:6px; }
      li::after { margin-inline:2px 7px; }
      li span { width:23px; height:23px; }
    }
  `,
})
export class NucleusSteps {
  readonly current = input.required<1|2|3>();
  protected readonly labels = ['Escolher relação','Definir propósito','Convidar pessoas'];
}
