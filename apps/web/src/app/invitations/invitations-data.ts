import { Injectable, inject } from '@angular/core';
import type { SupabaseClient } from '@supabase/supabase-js';
import { NucleiData } from '../nuclei/nuclei-data';
import { isNucleusId } from '../nuclei/nucleus-model';

export type InviteFilter = 'ativos' | 'expirados' | 'revogados';
export type InvitePreview = {id:string; name:string; type:string; purpose:string};
export type InviteCode = {code:string; expires_at:string};
export type InviteSummary = {id:string; created_at:string; expires_at:string; revoked_at:string|null};
export type InviteScope = {owner:string; id:string};

export const normalizeInviteCode = (value: string) => value.trim().toLowerCase();
export const validInviteCode = (value: string) => /^[0-9a-f]{32}$/.test(value);
const utc = new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short',timeZone:'UTC'});
export const inviteDate = (value: string) => utc.format(new Date(value)) + ' UTC';

@Injectable({providedIn:'root'})
export class InvitationsData {
  private readonly nuclei = inject(NucleiData);

  async inspect(owner: string, code: string, signal: AbortSignal): Promise<InvitePreview|null> {
    if (!validInviteCode(code)) return null;
    const client = await this.nuclei.clientForAccount(owner);
    // O código fica no corpo do POST. A RPC retorna somente o contexto público do convite.
    const result = await client.rpc('inspect_invitation',{invitation_code:code}).abortSignal(signal);
    if (result.error) throw new Error('Não foi possível conferir o convite.');
    const row = Array.isArray(result.data) ? result.data[0] : null;
    return row && isNucleusId(row.nucleus_id)
      ? {id:row.nucleus_id,name:row.nucleus_name,type:row.nucleus_type,purpose:row.nucleus_purpose} : null;
  }

  async accept(owner: string, code: string) {
    if (!validInviteCode(code)) return null;
    const client = await this.nuclei.clientForAccount(owner,true);
    // O banco reconfere validade e revogação e resolve a repetição do aceite.
    const result = await client.rpc('accept_invitation',{invitation_code:code}).retry(false);
    if (result.error?.code === 'P0002') return null;
    if (result.error || !isNucleusId(result.data)) throw new Error('Aceite não confirmado.');
    return result.data;
  }

  async initial(scope: InviteScope, signal: AbortSignal) {
    const selected = await this.nuclei.selected(scope.owner,scope.id,signal);
    if (selected?.role !== 'admin') return null;
    return {name:selected.nucleus.name, active:await this.activeCode(selected.client,scope.id,signal)};
  }

  async list(scope: InviteScope, filter: InviteFilter, page: number, signal: AbortSignal) {
    const selected = await this.nuclei.selected(scope.owner,scope.id,signal);
    if (selected?.role !== 'admin') return null;
    // O histórico de gestão não traz códigos, apenas datas e identificadores da listagem.
    let query = selected.client.from('nucleus_invitations')
      .select('id,created_at,expires_at,revoked_at').eq('nucleus_id',scope.id);
    const now = new Date().toISOString();
    if (filter === 'revogados') query = query.not('revoked_at','is',null);
    else {
      query = query.is('revoked_at',null);
      query = filter === 'ativos' ? query.gt('expires_at',now) : query.lte('expires_at',now);
    }
    const start = (page-1)*20;
    const result = await query.order('created_at',{ascending:false}).order('id',{ascending:false})
      .range(start,start+20).abortSignal(signal);
    if (result.error) throw new Error('Não foi possível consultar os convites.');
    const rows = (result.data ?? []) as InviteSummary[];
    return {name:selected.nucleus.name,rows:rows.slice(0,20),hasNext:rows.length>20 && page<9999};
  }

  async generate(scope: InviteScope, signal: AbortSignal) {
    const client = await this.nuclei.clientForAccount(scope.owner,true);
    if (signal.aborted || !isNucleusId(scope.id)) throw new Error('Núcleo indisponível.');
    // A RPC revalida administração e reutiliza o código ativo. A leitura seguinte confirma a data real.
    const result = await client.rpc('create_initial_invitation',{target_nucleus:scope.id}).retry(false);
    if (signal.aborted || result.error || typeof result.data !== 'string') throw new Error('Convite indisponível.');
    const active = await this.activeCode(client,scope.id,signal);
    if (!active || active.code !== result.data) throw new Error('Convite indisponível.');
    return active;
  }

  async revoke(scope: InviteScope, invitation: string) {
    if (!isNucleusId(scope.id) || !isNucleusId(invitation)) throw new Error('Convite indisponível.');
    const client = await this.nuclei.clientForAccount(scope.owner,true);
    const result = await client.rpc('revoke_nucleus_invitation',{target_nucleus:scope.id,target_invitation:invitation}).retry(false);
    if (result.error) throw new Error('Convite indisponível.');
  }

  private async activeCode(client: SupabaseClient, id: string, signal: AbortSignal): Promise<InviteCode|null> {
    const result = await client.from('nucleus_invitations').select('code,expires_at')
      .eq('nucleus_id',id).is('revoked_at',null).gt('expires_at',new Date().toISOString())
      .order('created_at',{ascending:false}).order('id',{ascending:false}).limit(1).abortSignal(signal).maybeSingle();
    if (result.error) throw new Error('Não foi possível consultar o código ativo.');
    return result.data;
  }
}
