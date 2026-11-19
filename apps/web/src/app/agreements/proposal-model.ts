import { parseAgreementProposal } from '../../domain/agreements/proposal-input';
import { parseTrialDays } from '../../domain/agreements/habit-trial-input';
export { agreementColumn, filterAgreementCards } from '../../domain/agreements/components/agreement-presentation';

export type AgreementScope = {owner:string; id:string};
export type Response = 'accepted' | 'declined';
export type Agreement = {
  id:string; category:string; title:string; description:string; timing:string; frequency:string;
  created_at:string; status:string; trial_days:number|null; terms_version:number; test_started_at:string|null;
  nucleus_agreement_participants:{response:string;accepted_version:number|null}[];
};
export type AgreementCount = {agreement_id:string;accepted:number;declined:number;pending:number};

export function proposalTerms(form:FormData) {
  const read = (name:string) => String(form.get(name) ?? '');
  const input = parseAgreementProposal({
    category:'habit', title:read('title'), description:read('description'), timing:read('timing'), frequency:read('frequency'),
  });
  const trialDays = parseTrialDays(form.get('trialDays'));
  return input && trialDays !== null ? {...input,trialDays} : null;
}

const statuses:Record<string,string> = {
  pending:'Proposta enviada',testing:'Em teste',active:'Acordo ativo',declined:'Proposta recusada',ended:'Encerrado pela administração',
};
export const statusLabel = (status:string) => statuses[status] ?? 'Estado indisponível';
export const canRespond = (agreement:Agreement) => ['pending','testing','active'].includes(agreement.status);
export const accepted = (agreement:Agreement) => {
  const own = agreement.nucleus_agreement_participants[0];
  return own?.response === 'accepted' && own.accepted_version === agreement.terms_version;
};
export function participationLabel(agreement:Agreement) {
  const own = agreement.nucleus_agreement_participants[0];
  if (accepted(agreement)) return 'Participação aceita · v' + agreement.terms_version;
  if (own?.response === 'declined') return 'Participação recusada';
  return own?.response === 'accepted' ? 'Novo aceite necessário' : 'Participação a decidir';
}
