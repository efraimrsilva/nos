import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { reflectionPhrases } from '../../domain/onboarding/reflection-phrases';

const interval = 10_000;

@Component({
  selector: 'app-account-story',
  templateUrl: './account-story.html',
  styleUrl: './account-story.css',
})
export class AccountStory {
  readonly welcome = input(false);
  protected readonly lights = Array.from({length:8}, (_, index) => index);
  protected readonly reduced = signal(false);
  protected readonly paused = signal(false);
  protected readonly phrase = signal('');
  protected readonly cycle = signal(0);
  private order: string[] = [];
  private index = 0;
  private timer?: ReturnType<typeof setTimeout>;
  private remaining = interval;
  private started = 0;

  constructor() {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      this.reduced.set(preference.matches);
      if (preference.matches) this.stop();
      else this.schedule();
    };
    this.shuffle();
    this.phrase.set(this.order[0]);
    sync();
    preference.addEventListener('change',sync);
    inject(DestroyRef).onDestroy(() => {
      this.stop();
      preference.removeEventListener('change',sync);
    });
  }

  protected toggle() {
    this.paused.update(value => !value);
    if (this.paused()) this.stop();
    else this.schedule();
  }

  private shuffle() {
    const previous = this.phrase();
    this.order = [...reflectionPhrases];
    for (let index = this.order.length - 1; index > 0; index--) {
      const target = Math.floor(Math.random() * (index + 1));
      [this.order[index],this.order[target]] = [this.order[target],this.order[index]];
    }
    if (this.order.length > 1 && this.order[0] === previous) {
      [this.order[0],this.order[1]] = [this.order[1],this.order[0]];
    }
    this.index = 0;
  }

  private schedule() {
    if (this.timer !== undefined || this.paused() || this.reduced()) return;
    this.started = performance.now();
    this.timer = setTimeout(() => {
      this.timer = undefined;
      this.remaining = interval;
      if (++this.index === this.order.length) this.shuffle();
      this.phrase.set(this.order[this.index]);
      // A frase conserva seu nó; somente a barra reinicia a animação a cada ciclo.
      this.cycle.update(value => value + 1);
      this.schedule();
    },this.remaining);
  }

  private stop() {
    // Pausa preserva o intervalo restante e encerra o relógio quando a rota desmonta.
    if (this.timer === undefined) return;
    clearTimeout(this.timer);
    this.timer = undefined;
    this.remaining = Math.max(0,this.remaining - (performance.now() - this.started));
  }
}
