import { Component, inject, input } from '@angular/core';
import { Appearance } from './appearance';
import { NavIcon } from './shared/nav-icon';

@Component({
  selector: 'app-appearance-picker',
  imports: [NavIcon],
  templateUrl: './appearance-picker.html',
  styleUrl: './account-preferences.css',
})
export class AppearancePicker {
  readonly prefix = input.required<string>();
  readonly label = input('Aparência');
  readonly embedded = input(false);
  protected readonly appearance = inject(Appearance);
}
