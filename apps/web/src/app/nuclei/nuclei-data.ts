import { inject, Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { PreviewProfile } from '../preview-profile';
import { isNucleusId, type NucleusTypeId } from './nucleus-model';

export type Nucleus = {id: string; name: string; purpose: string; type: string};
export type Member = {user_id: string; display_name: string; role: string};
export type EventPreview = {id: string; title: string; starts_at: string; time_zone: string};
export type AgreementPreview = {id: string; title: string; status: string};

@Injectable({providedIn: 'root'})
export class NucleiData {
  private readonly profile = inject(PreviewProfile);

  async clientForAccount(owner: string, verify = false) {
    const connection = await this.profile.connection();
    if (!connection || this.profile.user()?.id !== owner) throw new Error('Sessão indisponível.');
    const {data, error} = await connection.client.auth.getSession();
    const session = data.session;
    if (error || session?.user.id !== owner || this.profile.user()?.id !== owner) throw new Error('Sessão indisponível.');
    const token = session.access_token;
    if (verify) {
      const verified = await connection.client.auth.getUser(token);
      if (verified.error || verified.data.user?.id !== owner || this.profile.user()?.id !== owner) {
        throw new Error('Sessão indisponível.');
      }
    }
    // As operações usam sempre o token da conta que iniciou a leitura ou confirmação.
    // A aplicação não usa chaves administrativas e o Postgres verifica o vínculo.
    return createClient(connection.config.url, connection.config.publicKey, {accessToken: async () => token});
  }

  async list(owner: string, page: number, signal: AbortSignal) {
    const client = await this.clientForAccount(owner);
    const start = (page - 1) * 20;
    const result = await client.from('nuclei').select('id,name,type')
      .order('name').order('id').range(start, start + 20).abortSignal(signal);
    if (result.error) throw new Error('Não foi possível consultar seus Núcleos.');
    const rows = result.data ?? [];
    const cards = await Promise.all(rows.slice(0,20).map(async nucleus => {
      const [management, agreements] = await Promise.all([
        client.rpc('get_nucleus_management',{target_nucleus:nucleus.id}).abortSignal(signal),
        client.from('nucleus_agreements').select('id',{count:'exact',head:true})
          .eq('nucleus_id',nucleus.id).eq('status','active').abortSignal(signal),
      ]);
      if (management.error || agreements.error || agreements.count === null) throw new Error('Não foi possível consultar os dados dos Núcleos.');
      const members = (management.data?.members ?? []) as Member[];
      const me = members.find(member => member.user_id === owner);
      if (!me) throw new Error('Não foi possível confirmar seu vínculo.');
      return {...nucleus,members,activeAgreements:agreements.count,role:me.role};
    }));
    return {cards, hasNext:rows.length > 20 && page < 9999};
  }

  async selected(owner: string, id: string, signal: AbortSignal) {
    if (!isNucleusId(id)) return null;
    const client = await this.clientForAccount(owner);
    const membership = await client.from('nucleus_members').select('role')
      .eq('nucleus_id',id).eq('user_id',owner).abortSignal(signal).maybeSingle();
    if (membership.error) throw new Error('Não foi possível confirmar seu vínculo.');
    if (!membership.data) return null;
    const result = await client.from('nuclei').select('id,name,type,purpose').eq('id',id).abortSignal(signal).maybeSingle();
    if (result.error) throw new Error('Não foi possível consultar o Núcleo.');
    return result.data ? {nucleus:result.data as Nucleus,role:membership.data.role,client} : null;
  }

  async home(owner: string, id: string, signal: AbortSignal) {
    const selected = await this.selected(owner,id,signal);
    if (!selected) return null;
    const {client,nucleus,role} = selected;
    const [calendar,agreements,spaces,management] = await Promise.all([
      client.rpc('get_nucleus_calendar',{target_nucleus:id,from_ends_at:new Date().toISOString(),page_offset:0,page_size:3}).abortSignal(signal),
      client.from('nucleus_agreements').select('id,title,status').eq('nucleus_id',id)
        .order('created_at',{ascending:false}).order('id').limit(3).abortSignal(signal),
      client.from('nuclei').select('id,name,type').order('name').order('id').limit(4).abortSignal(signal),
      client.rpc('get_nucleus_management',{target_nucleus:id}).abortSignal(signal),
    ]);
    if (calendar.error || agreements.error || spaces.error || management.error) {
      throw new Error('Não foi possível consultar o resumo do Núcleo.');
    }
    return {
      nucleus,role,
      calendar:(calendar.data ?? []) as EventPreview[],
      agreements:(agreements.data ?? []) as AgreementPreview[],
      spaces:(spaces.data ?? []).filter(space => space.id !== id).slice(0,3),
      members:(management.data?.members ?? []) as Member[],
    };
  }

  async create(owner: string, requestId: string, type: NucleusTypeId, name: string, purpose: string) {
    const client = await this.clientForAccount(owner,true);
    const result = await client.rpc('create_nucleus_once',{
      request_id:requestId, nucleus_type:type, nucleus_name:name, nucleus_purpose:purpose,
    }).retry(false);
    if (result.error || result.data !== requestId) throw new Error('A criação não foi confirmada.');
    return requestId;
  }

  remember(owner: string, id: string) {
    try { localStorage.setItem(this.key(owner),id); } catch { /* A navegação continua sem armazenamento. */ }
  }

  async last(owner: string, signal: AbortSignal) {
    try {
      const id = localStorage.getItem(this.key(owner));
      if (!isNucleusId(id)) return null;
      const result = await this.selected(owner,id,signal);
      if (!result && !signal.aborted && localStorage.getItem(this.key(owner)) === id) {
        localStorage.removeItem(this.key(owner));
      }
      return result?.nucleus ?? null;
    } catch { return null; }
  }

  private key(owner: string) { return 'nos-angular-last-nucleus-' + owner; }
}
