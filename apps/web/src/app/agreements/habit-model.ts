import { parseAgreementProposal } from '../../../../../src/features/agreements/proposal-input';
import { accepted, type Agreement } from './proposal-model';

export { habitMoodLabels,parseHabitMoment,parseHabitMomentCursor } from '../../../../../src/features/agreements/habit-moment-input';

export type CycleAction = 'start_test'|'activate'|'end';
export const cycleLabels:Record<CycleAction,string> = {
  start_test:'Iniciar teste',activate:'Ativar acordo',end:'Encerrar acordo',
};
export const cycleDescriptions:Record<CycleAction,string> = {
  start_test:'Iniciar o teste. Cada pessoa continua decidindo se participa.',
  activate:'Concluir o teste e manter o acordo ativo com participação individual.',
  end:'Encerrar o acordo e impedir novos momentos. O histórico permanecerá.',
};

export function cycleActions(status:string):CycleAction[] {
  if (status==='pending') return ['start_test','end'];
  if (status==='testing') return ['activate','end'];
  return status==='active' ? ['end'] : [];
}
export const canRecordMoment = (agreement:Agreement) =>
  ['testing','active'].includes(agreement.status) && accepted(agreement);

export function readNewTerms(form:FormData) {
  return parseAgreementProposal({
    category:'habit',title:String(form.get('title') ?? ''),description:String(form.get('description') ?? ''),
    timing:String(form.get('timing') ?? ''),frequency:String(form.get('frequency') ?? ''),
  });
}

const utc = new Intl.DateTimeFormat('pt-BR',{dateStyle:'medium',timeStyle:'short',timeZone:'UTC'});
export const habitDate = (value:string) => utc.format(new Date(value))+' UTC';
