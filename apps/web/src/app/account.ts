import { afterNextRender, Component, DestroyRef, computed, effect, inject, Injector, input, resource, signal, viewChild, ElementRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountPreferences } from './account-preferences';
import { NucleiData } from './nuclei/nuclei-data';
import { profileLetters } from './nuclei/nucleus-model';
import { displayName, PreviewProfile } from './preview-profile';
import { NavIcon } from './shared/nav-icon';

@Component({
  selector: 'app-account',
  imports: [RouterLink, AccountPreferences, NavIcon],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
  readonly prefix = input('account');
  protected readonly embedded = computed(() => this.prefix() !== 'account');
  protected readonly profile = inject(PreviewProfile);
  private readonly destroy = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly fragment = toSignal(inject(ActivatedRoute).fragment);
  private readonly preferences = viewChild<AccountPreferences, ElementRef<HTMLElement>>('preferences', {read: ElementRef});
  protected readonly name = computed(() => displayName(this.profile.user()));
  protected readonly initials = computed(() => profileLetters(this.name()));
  private readonly nuclei = inject(NucleiData);
  protected readonly last = resource({
    params:() => this.embedded() ? undefined : this.profile.user()?.id,
    loader:({params,abortSignal}) => this.nuclei.last(params,abortSignal),
  });
  protected readonly busy = signal(false);
  protected readonly authError = signal('');
  protected readonly editing = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly saved = signal(false);
  protected draft = '';
  private readonly dataDialog = viewChild.required<ElementRef<HTMLDialogElement>>('dataDialog');
  private openedFor: string | null = null;

  constructor() {
    void this.profile.connect();
    effect(() => {
      const fragment = this.fragment();
      const host = this.preferences()?.nativeElement;
      if (this.embedded() || !host || !fragment || !['aparencia', 'privacidade', 'ajuda-e-suporte', 'apagar-minha-conta'].includes(fragment)) return;
      afterNextRender(() => {
        if (host.isConnected && this.fragment() === fragment) host.querySelector<HTMLElement>('#' + fragment)?.focus();
      }, {injector: this.injector});
    });
    effect(() => {
      const user = this.profile.user();
      if (this.openedFor && user?.id !== this.openedFor) {
        this.dialog().close();
        this.resetDialog();
      }
    });
  }

  protected async signOut() {
    if (this.busy()) return;
    this.busy.set(true);
    try {
      const error = await this.profile.signOut();
      this.authError.set(error);
      // A saída ainda leva ao acesso se o menu for fechado durante a revogação.
      if (!error && !this.profile.user()) await this.router.navigateByUrl('/conta?modo=login');
    }
    finally { this.busy.set(false); }
  }

  protected openDialog() {
    this.openedFor = this.profile.user()?.id ?? null;
    if (this.openedFor) this.dialog().showModal();
  }

  protected resetDialog() {
    this.openedFor = null;
    this.resetEditor();
  }

  protected edit() {
    this.draft = this.name();
    this.saved.set(false);
    this.error.set('');
    this.editing.set(true);
    this.focus('profile-name');
  }

  protected cancel() {
    this.resetEditor();
    this.focus('edit-name');
  }

  protected async save(event: SubmitEvent, value: string) {
    event.preventDefault();
    const account = this.openedFor;
    if (!account || this.saving()) return;
    this.saving.set(true);
    this.error.set('');
    try {
      const error = await this.profile.rename(value, account);
      if (this.openedFor !== account || !this.dialog().open) return;
      this.error.set(error);
      if (!error) {
        this.resetEditor();
        this.saved.set(true);
        this.focus('edit-name');
      }
    } finally {
      this.saving.set(false);
    }
  }

  private dialog() { return this.dataDialog().nativeElement; }

  private resetEditor() {
    this.draft = '';
    this.editing.set(false);
    this.error.set('');
    this.saved.set(false);
  }

  private focus(id: string) {
    afterNextRender(() => {
      if (!this.destroy.destroyed && this.dialog().open) this.dialog().querySelector<HTMLElement>('#' + this.prefix() + '-' + id)?.focus();
    }, { injector: this.injector });
  }
}
