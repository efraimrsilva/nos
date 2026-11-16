import { Component, DestroyRef, effect, inject, resource, signal, viewChild, type ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ACCOUNT_DELETION_PHRASE, isAccountDeletionConfirmed } from '../../../../src/features/controls/account-deletion-input';
import { AppearancePicker } from './appearance-picker';
import { NucleiData } from './nuclei/nuclei-data';
import { ProblemReport } from './problem-report';
import { PreviewProfile } from './preview-profile';

@Component({
  selector: 'app-account-preferences',
  imports: [RouterLink, ProblemReport, AppearancePicker],
  templateUrl: './account-preferences.html',
  styleUrl: './account-preferences.css',
})
export class AccountPreferences {
  private readonly profile = inject(PreviewProfile);
  private readonly data = inject(NucleiData);
  private readonly router = inject(Router);
  private readonly destroy = inject(DestroyRef);
  private readonly privacyDialog = viewChild.required<ElementRef<HTMLDialogElement>>('privacyDialog');
  private readonly removalDialog = viewChild.required<ElementRef<HTMLDialogElement>>('removalDialog');
  protected readonly privacy = resource({
    params: () => this.profile.user()?.id,
    loader: async ({params, abortSignal}) => {
      const client = await this.data.clientForAccount(params);
      const {data, error} = await client.rpc('get_my_privacy_preference').abortSignal(abortSignal);
      if (error || typeof data !== 'boolean') throw new Error('Preferência indisponível.');
      return data;
    },
  });
  protected readonly hide = signal(false);
  protected readonly saving = signal(false);
  protected readonly privacyMessage = signal('');
  protected readonly privacyError = signal('');
  protected readonly confirmation = signal('');
  protected readonly removing = signal(false);
  protected readonly removalError = signal('');
  protected readonly phrase = ACCOUNT_DELETION_PHRASE;
  private privacyOwner: string | undefined;
  private removalOwner: string | undefined;

  constructor() {
    effect(() => {
      const owner = this.profile.user()?.id;
      if (this.privacyOwner && this.privacyOwner !== owner) this.privacyDialog().nativeElement.close();
      if (this.removalOwner && this.removalOwner !== owner) this.removalDialog().nativeElement.close();
      if (this.privacy.hasValue()) this.hide.set(this.privacy.value());
    });
    this.destroy.onDestroy(() => {
      this.privacyOwner = undefined;
      this.removalOwner = undefined;
    });
  }

  protected openPrivacy() {
    this.privacyOwner = this.profile.user()?.id;
    if (this.privacyOwner) this.privacyDialog().nativeElement.showModal();
  }

  protected resetPrivacy() {
    this.privacyOwner = undefined;
    this.privacyMessage.set('');
    this.privacyError.set('');
    if (this.privacy.hasValue()) this.hide.set(this.privacy.value());
  }

  protected async savePrivacy(event: SubmitEvent) {
    event.preventDefault();
    const owner = this.privacyOwner;
    const hide = this.hide();
    if (!owner || this.saving() || !this.privacy.hasValue()) return;
    this.saving.set(true);
    this.privacyMessage.set('');
    this.privacyError.set('');
    try {
      const client = await this.data.clientForAccount(owner, true);
      const {error} = await client.rpc('set_my_privacy_preference', {hide_authorship: hide});
      if (error) throw error;
      if (this.profile.user()?.id === owner && !this.destroy.destroyed) {
        this.privacy.set(hide);
        if (this.privacyOwner === owner) this.privacyMessage.set('Preferência salva.');
      }
    } catch {
      if (this.privacyOwner === owner) this.privacyError.set('Não foi possível salvar. Confira sua sessão e tente novamente.');
    } finally {
      this.saving.set(false);
    }
  }

  protected openRemoval() {
    this.removalOwner = this.profile.user()?.id;
    if (this.removalOwner) this.removalDialog().nativeElement.showModal();
  }

  protected resetRemoval() {
    this.removalOwner = undefined;
    this.confirmation.set('');
    this.removalError.set('');
  }

  protected async removeAccount(event: SubmitEvent) {
    event.preventDefault();
    const owner = this.removalOwner;
    const confirmation = this.confirmation();
    if (!owner || this.removing() || !isAccountDeletionConfirmed(confirmation)) return;
    this.removing.set(true);
    this.removalError.set('');
    try {
      const client = await this.data.clientForAccount(owner, true);
      if (this.removalOwner !== owner || !this.removalDialog().nativeElement.open) return;
      // O banco deriva o alvo do token validado e preserva o histórico compartilhado.
      const {error} = await client.rpc('delete_my_account', {confirmation_phrase: confirmation});
      if (error) {
        if (this.removalOwner === owner) this.removalError.set(error.code === '55000'
          ? 'Há arquivos vinculados à sua conta. Consulte a ajuda antes de apagar a conta.'
          : 'Não foi possível confirmar a exclusão. Confira sua sessão antes de tentar novamente.');
        return;
      }
      const cleared = this.profile.clearDeletedAccount(owner);
      if (cleared && !this.destroy.destroyed) await this.router.navigateByUrl('/conta?resultado=conta-excluida', {replaceUrl: true});
    } catch {
      if (this.removalOwner === owner) this.removalError.set('Não foi possível confirmar a exclusão. Confira sua sessão antes de tentar novamente.');
    } finally {
      this.removing.set(false);
    }
  }
}
