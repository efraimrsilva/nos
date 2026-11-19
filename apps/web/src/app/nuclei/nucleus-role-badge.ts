import { Component, input } from '@angular/core';
import { NavIcon } from '../shared/nav-icon';

@Component({
  selector:'app-nucleus-role-badge',
  imports:[NavIcon],
  template:`
    <span class="badge nucleus-role" [class.participant-badge]="!admin()">
      @if (admin()) { <app-nav-icon name="shield" /> }
      {{ admin() ? 'Você administra este Núcleo.' : 'Você faz parte deste Núcleo.' }}
    </span>
  `,
})
export class NucleusRoleBadge {
  readonly admin = input.required<boolean>();
}
