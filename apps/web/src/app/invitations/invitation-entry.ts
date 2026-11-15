import { afterNextRender, Component, DestroyRef, inject, Injector, signal, viewChild, type ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PreviewProfile } from '../preview-profile';
import { findNucleusType } from '../nuclei/nucleus-model';
import { InvitationsData, normalizeInviteCode, validInviteCode, type InvitePreview } from './invitations-data';

@Component({
  imports:[RouterLink],
  templateUrl:'./invitation-entry.html',
})
export class InvitationEntry {
  private readonly profile = inject(PreviewProfile);
  private readonly data = inject(InvitationsData);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly destroy = inject(DestroyRef);
  private readonly heading = viewChild<ElementRef<HTMLElement>>('previewTitle');
  private inspection?: AbortController;
  protected readonly code = signal('');
  protected readonly preview = signal<InvitePreview|null>(null);
  protected readonly inspecting = signal(false);
  protected readonly accepting = signal(false);
  protected readonly error = signal('');

  constructor() {
    this.destroy.onDestroy(() => this.inspection?.abort());
  }

  protected typeLabel(type: string) { return findNucleusType(type)?.label ?? 'Núcleo'; }

  protected edit(value: string) {
    this.inspection?.abort();
    this.code.set(value);
    this.preview.set(null);
    this.error.set('');
    this.inspecting.set(false);
  }

  protected async inspect(event: Event) {
    event.preventDefault();
    if (this.inspecting() || this.accepting()) return;
    this.preview.set(null);
    this.error.set('');
    const code = normalizeInviteCode(this.code());
    if (!validInviteCode(code)) {
      this.error.set(code ? 'Informe um código válido de 32 caracteres.' : 'Informe o código de convite.');
      return;
    }
    const owner = this.profile.user()?.id;
    if (!owner) return;
    const request = new AbortController();
    this.inspection = request;
    this.inspecting.set(true);
    try {
      const view = await this.data.inspect(owner,code,request.signal);
      if (request.signal.aborted || this.profile.user()?.id !== owner) return;
      if (!view) this.error.set('Convite não encontrado, expirado ou revogado.');
      else {
        this.preview.set(view);
        afterNextRender(() => this.heading()?.nativeElement.focus(),{injector:this.injector});
      }
    } catch {
      if (!request.signal.aborted) this.error.set('Não foi possível conferir o convite. Tente novamente.');
    } finally {
      if (this.inspection === request) this.inspecting.set(false);
    }
  }

  protected async accept(event: Event) {
    event.preventDefault();
    const view = this.preview();
    const owner = this.profile.user()?.id;
    if (!view || !owner || this.accepting()) return;
    this.accepting.set(true);
    this.error.set('');
    try {
      const id = await this.data.accept(owner,normalizeInviteCode(this.code()));
      if (this.destroy.destroyed || this.profile.user()?.id !== owner) return;
      if (id === view.id) {
        this.edit('');
        await this.router.navigate(['/nucleos',id],{replaceUrl:true});
      } else {
        this.preview.set(null);
        this.error.set('Este convite não está mais disponível.');
      }
    } catch {
      if (!this.destroy.destroyed) this.error.set('Não foi possível confirmar o aceite. Você pode tentar novamente ou conferir Seus Núcleos.');
    } finally {
      this.accepting.set(false);
    }
  }
}
