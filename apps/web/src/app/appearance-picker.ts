import { Component, DestroyRef, inject, input } from '@angular/core';
import type { ThemeId } from '../domain/appearance/themes';
import { Appearance } from './appearance';
import { NavIcon } from './shared/nav-icon';

@Component({
  selector: 'app-appearance-picker',
  imports: [NavIcon],
  templateUrl: './appearance-picker.html',
  styleUrl: './appearance-picker.css',
})
export class AppearancePicker {
  readonly prefix = input.required<string>();
  readonly label = input('Aparência');
  readonly row = input(false);
  protected readonly appearance = inject(Appearance);
  private readonly destroy = inject(DestroyRef);
  private leaving = false;

  protected async choose(dialog: HTMLDialogElement, theme: ThemeId) {
    if (this.leaving) return;
    this.leaving = true;
    const menu = dialog.closest<HTMLDialogElement>('.account-shortcuts, .more-dialog');
    try {
      if (menu?.open &&
          matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        // O menu conserva o desfoque. O seletor e sua camada de escurecimento saem juntos.
        const frames = [{opacity: 1}, {opacity: 0}];
        const timing = {duration: 260, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' as const};
        const panel = dialog.animate(frames, timing);
        const backdrop = dialog.animate(frames, {...timing, pseudoElement: '::backdrop'});
        await Promise.allSettled([panel.finished, backdrop.finished]);
        dialog.close();
        panel.cancel();
        backdrop.cancel();
      } else {
        dialog.close();
      }
      if (!this.destroy.destroyed) await this.appearance.select(theme, menu);
    } finally {
      this.leaving = false;
    }
  }
}
