import { Component, inject, input } from '@angular/core';
import { Appearance } from './appearance';

@Component({
  selector: 'app-appearance-picker',
  templateUrl: './appearance-picker.html',
  styleUrl: './account-preferences.css',
})
export class AppearancePicker {
  readonly prefix = input.required<string>();
  readonly label = input('Aparência');
  protected readonly appearance = inject(Appearance);
}
