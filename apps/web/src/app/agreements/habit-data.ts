import { Injectable, inject } from '@angular/core';
import { NucleiData } from '../nuclei/nuclei-data';
import { isNucleusId } from '../nuclei/nucleus-model';
import { AgreementsData } from './agreements-data';
import { accepted,canRespond,type Agreement,type AgreementScope } from './proposal-model';
import { type CycleAction,parseHabitMomentCursor,type readNewTerms } from './habit-model';

export type HabitContext = {scope:AgreementScope;agreement:Agreement};
type Moment = {id:string;author_id:string|null;mood:string;note:string|null;created_at:string;authorship_hidden:boolean};

@Injectable({providedIn:'root'})
export class HabitData {
  private readonly nuclei = inject(NucleiData);
  private readonly agreements = inject(AgreementsData);

  async moments(context:HabitContext,cursor:ReturnType<typeof parseHabitMomentCursor>,signal:AbortSignal) {
    const client = await this.nuclei.clientForAccount(context.scope.owner);
    // A leitura usa a função que já remove a autoria oculta antes de entregar os registros.
    const result = await client.rpc('get_nucleus_habit_moments',{
      target_agreement:context.agreement.id,before_created_at:cursor?.createdAt ?? null,
      before_id:cursor?.id ?? null,page_size:21,
    }).abortSignal(signal);
    if (result.error?.code === '42501') return null;
    if (result.error) throw new Error('Não foi possível consultar o histórico.');
    const rows = (result.data ?? []) as Moment[];
    const last = rows[19];
    return {rows:rows.slice(0,20),next:rows.length>20 ? last.created_at+'|'+last.id : null};
  }

  async apply(context:HabitContext,operation:CycleAction,terms?:never):Promise<string>;
  async apply(context:HabitContext,operation:'terms',terms:NonNullable<ReturnType<typeof readNewTerms>>):Promise<string>;
  async apply(context:HabitContext,operation:CycleAction|'terms',terms?:NonNullable<ReturnType<typeof readNewTerms>>) {
    const current = await this.writeContext(context);
    if (!current) {
      this.agreements.announceChange(context.scope);
      return 'O acordo mudou. Confira os termos e as permissões atuais antes de confirmar.';
    }
    const args = {target_agreement:context.agreement.id,expected_terms_version:context.agreement.terms_version};
    const timeout = AbortSignal.timeout(15000);
    // A função existente revalida papel e versão sob trava e só permite transições do estado vigente.
    const result = operation==='terms' && terms
      ? await current.client.rpc('update_nucleus_agreement_terms',{...args,agreement_title:terms.title,
        agreement_description:terms.description,agreement_timing:terms.timing,agreement_frequency:terms.frequency}).abortSignal(timeout).retry(false)
      : await current.client.rpc('manage_nucleus_agreement',{...args,agreement_action:operation}).abortSignal(timeout).retry(false);
    this.agreements.announceChange(context.scope);
    if (result.error?.message==='agreement terms unchanged') return 'Os termos não mudaram. Altere pelo menos um campo.';
    if (result.error?.code==='40001') return 'Os termos mudaram. Confira a versão atual antes de confirmar.';
    return result.error ? 'Não foi possível confirmar a operação. Confira o acordo atualizado antes de tentar novamente.' : '';
  }

  async record(context:HabitContext,moment:{mood:string;note:string}) {
    const current = await this.writeContext(context);
    if (!current) {
      this.agreements.announceChange(context.scope);
      return {kind:'changed'} as const;
    }
    if (!['active','testing'].includes(current.row.status) || !accepted({
      ...context.agreement,nucleus_agreement_participants:current.row.nucleus_agreement_participants,
    })) return {kind:'blocked'} as const;

    const result = await current.client.rpc('record_nucleus_habit_moment',{
      target_nucleus:context.scope.id,target_agreement:context.agreement.id,moment_mood:moment.mood,moment_note:moment.note,
      expected_terms_version:context.agreement.terms_version,
    }).abortSignal(AbortSignal.timeout(15000)).retry(false);
    if (result.error?.code==='PT409') {
      this.agreements.announceChange(context.scope);
      return {kind:'changed'} as const;
    }
    if (!result.error && isNucleusId(result.data)) return {kind:'saved'} as const;
    if (result.status===0 || result.status>=500 || !result.error) return {kind:'unknown'} as const;
    return {kind:'blocked'} as const;
  }

  private async writeContext({scope,agreement}:HabitContext) {
    if (!isNucleusId(scope.id) || !isNucleusId(agreement.id) || !canRespond(agreement)) return null;
    const client = await this.nuclei.clientForAccount(scope.owner,true);
    // O filtro de rota vincula o acordo ao Núcleo. A função no banco continua autorizando a gravação.
    const result = await client.from('nucleus_agreements')
      .select('status,terms_version,nucleus_agreement_participants(response,accepted_version)')
      .eq('id',agreement.id).eq('nucleus_id',scope.id)
      .eq('nucleus_agreement_participants.user_id',scope.owner).maybeSingle();
    if (result.error || !result.data || result.data.terms_version!==agreement.terms_version) return null;
    return {client,row:result.data};
  }
}
