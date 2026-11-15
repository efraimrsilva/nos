import { Injectable, inject, signal } from '@angular/core';
import { NucleiData } from '../nuclei/nuclei-data';
import { isNucleusId } from '../nuclei/nucleus-model';
import { canRespond, type Agreement, type AgreementCount, type AgreementScope, type Response, type proposalTerms } from './proposal-model';

const fields = 'id,category,title,description,timing,frequency,created_at,status,trial_days,terms_version,nucleus_agreement_participants(response,accepted_version)';
export const agreementsPageSize = 50;

@Injectable({providedIn:'root'})
export class AgreementsData {
  private readonly nuclei = inject(NucleiData);
  private readonly responseEvent = signal<AgreementScope|null>(null);
  readonly responsesChanged = this.responseEvent.asReadonly();

  async list(scope:AgreementScope,page:number,signal:AbortSignal) {
    const selected = await this.nuclei.selected(scope.owner,scope.id,signal);
    if (!selected) return null;
    const start = (page-1)*agreementsPageSize;
    const result = await selected.client.from('nucleus_agreements').select(fields).eq('nucleus_id',scope.id)
      .eq('nucleus_agreement_participants.user_id',scope.owner)
      .order('created_at',{ascending:false}).order('id').range(start,start+agreementsPageSize).abortSignal(signal);
    if (result.error?.code === '42501') return null;
    if (result.error) throw new Error('Não foi possível consultar os acordos.');
    const rows = (result.data ?? []) as Agreement[];
    return {scope,name:selected.nucleus.name,role:selected.role,rows:rows.slice(0,agreementsPageSize),
      hasNext:rows.length>agreementsPageSize && page<1000};
  }

  async detail(scope:AgreementScope,id:string,signal:AbortSignal) {
    if (!isNucleusId(id)) return null;
    const selected = await this.nuclei.selected(scope.owner,scope.id,signal);
    if (!selected) return null;
    const result = await selected.client.from('nucleus_agreements').select(fields).eq('nucleus_id',scope.id)
      .eq('id',id).eq('nucleus_agreement_participants.user_id',scope.owner).abortSignal(signal).maybeSingle();
    if (result.error?.code === '42501') return null;
    if (result.error) throw new Error('Não foi possível consultar o acordo.');
    return result.data ? {scope,name:selected.nucleus.name,agreement:result.data as Agreement} : null;
  }

  async counts(scope:AgreementScope,ids:string[],signal:AbortSignal) {
    const client = await this.nuclei.clientForAccount(scope.owner);
    // A função retorna somente totais do Núcleo para integrantes atuais.
    const result = await client.rpc('get_nucleus_agreement_response_counts',{target_nucleus:scope.id,agreement_ids:ids}).abortSignal(signal);
    if (result.error?.code === '42501') return null;
    if (result.error) throw new Error('Não foi possível conferir as participações.');
    return (result.data ?? []) as AgreementCount[];
  }

  async termsChanged(scope:AgreementScope,agreement:Agreement,signal:AbortSignal) {
    const client = await this.nuclei.clientForAccount(scope.owner);
    const result = await client.from('nucleus_agreements')
      .select('status,terms_version,nucleus_agreement_participants(response,accepted_version)')
      .eq('nucleus_id',scope.id).eq('id',agreement.id).eq('nucleus_agreement_participants.user_id',scope.owner)
      .abortSignal(signal).maybeSingle();
    if (result.error) return result.error.code === '42501';
    const next = result.data, before = agreement.nucleus_agreement_participants[0];
    const own = next?.nucleus_agreement_participants[0];
    return !next || next.terms_version !== agreement.terms_version || next.status !== agreement.status ||
      before?.response !== own?.response || before?.accepted_version !== own?.accepted_version;
  }

  async create(scope:AgreementScope,terms:NonNullable<ReturnType<typeof proposalTerms>>) {
    if (!isNucleusId(scope.id)) return {kind:'error'} as const;
    const client = await this.nuclei.clientForAccount(scope.owner,true);
    // Criar não registra aceite. Uma resposta de rede perdida não deve reenviar a inserção.
    const result = await client.rpc('create_nucleus_agreement',{
      target_nucleus:scope.id, agreement_category:terms.category, agreement_title:terms.title,
      agreement_description:terms.description, agreement_timing:terms.timing,
      agreement_frequency:terms.frequency, agreement_trial_days:terms.trialDays,
    }).retry(false);
    if (isNucleusId(result.data) && !result.error) return {kind:'created'} as const;
    if (result.status === 0 || result.status >= 500 || !result.error) return {kind:'unknown'} as const;
    return {kind:'error'} as const;
  }

  async respond(scope:AgreementScope,agreement:Agreement,response:Response) {
    if (!isNucleusId(scope.id) || !isNucleusId(agreement.id) || !canRespond(agreement)) return 'unavailable';
    const client = await this.nuclei.clientForAccount(scope.owner,true);
    // O banco usa a conta autenticada e rejeita a gravação se a versão mostrada já mudou.
    const result = await client.rpc('respond_nucleus_agreement',{
      target_agreement:agreement.id, agreement_response:response, expected_terms_version:agreement.terms_version,
    }).retry(false);
    // A mudança pertence ao Núcleo mesmo se o cartão ativo mudou enquanto a resposta viajava.
    this.responseEvent.set({...scope});
    if (result.error?.code === '40001') return 'changed';
    if (result.error?.code === '42501' || result.error?.code === 'P0002') return 'unavailable';
    return result.error ? 'unknown' : 'saved';
  }
}
