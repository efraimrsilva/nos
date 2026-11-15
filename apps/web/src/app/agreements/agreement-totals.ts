import { Component, input } from '@angular/core';
import type { AgreementCount } from './proposal-model';

@Component({
  selector:'app-agreement-totals',
  template:`
    <span class="agreement-totals" aria-label="Participações no Núcleo">
      @if (value(); as total) {
        <span>{{ total.accepted }} {{ total.accepted === 1 ? 'aceite' : 'aceites' }}</span>
        <span>{{ total.declined }} {{ total.declined === 1 ? 'recusa' : 'recusas' }}</span>
        <span>{{ total.pending }} a decidir</span>
      } @else {
        <span>{{ failed() ? 'Participações indisponíveis' : 'Conferindo participações…' }}</span>
      }
    </span>
  `,
})
export class AgreementTotals {
  readonly value = input<AgreementCount>();
  readonly failed = input(false);
}
