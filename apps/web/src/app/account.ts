import { afterNextRender, Component, computed, effect, inject, Injector, signal, viewChild, type ElementRef } from '@angular/core';
import { displayName, PreviewProfile } from './preview-profile';

@Component({
  selector: 'app-account',
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
  protected readonly profile = inject(PreviewProfile);
  private readonly injector = inject(Injector);
  protected readonly name = computed(() => displayName(this.profile.user()));
  protected readonly busy = signal(false);
  protected readonly authError = signal('');
  protected readonly editing = signal(false);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly saved = signal(false);
  protected draft = '';
  private readonly dataDialog = viewChild.required<ElementRef<HTMLDialogElement>>('dataDialog');
  private openedFor: string | null = null;
  private pointerOutside = false;

  constructor() {
    void this.profile.connect();
    effect(() => {
      const user = this.profile.user();
      if (this.openedFor && user?.id !== this.openedFor) {
        this.dialog().close();
        this.resetDialog();
      }
    });
  }

  protected async signIn(event: SubmitEvent, email: HTMLInputElement, password: HTMLInputElement) {
    event.preventDefault();
    if (this.busy()) return;
    this.busy.set(true);
    this.authError.set('');
    try {
      this.authError.set(await this.profile.signIn(email.value, password.value));
      password.value = '';
    } finally {
      this.busy.set(false);
    }
  }

  protected async signOut() {
    if (this.busy()) return;
    this.busy.set(true);
    try { this.authError.set(await this.profile.signOut()); }
    finally { this.busy.set(false); }
  }

  protected openDialog() {
    this.openedFor = this.profile.user()?.id ?? null;
    if (this.openedFor) this.dialog().showModal();
  }

  protected resetDialog() {
    this.openedFor = null;
    this.pointerOutside = false;
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

  protected backdropDown(event: PointerEvent) {
    this.pointerOutside = event.isPrimary && event.button === 0 && this.outside(event);
  }

  protected backdropUp(event: PointerEvent) {
    const close = this.pointerOutside && event.isPrimary && event.button === 0 && this.outside(event);
    this.pointerOutside = false;
    if (close) this.dialog().close();
  }

  protected backdropCancel() { this.pointerOutside = false; }

  private outside(event: PointerEvent) {
    const box = this.dialog().getBoundingClientRect();
    return event.clientX < box.left || event.clientX >= box.right ||
      event.clientY < box.top || event.clientY >= box.bottom;
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
      if (this.dialog().open) this.dialog().querySelector<HTMLElement>('#' + id)?.focus();
    }, { injector: this.injector });
  }
}
