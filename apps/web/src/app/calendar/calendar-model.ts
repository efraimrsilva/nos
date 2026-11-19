import { calendarEventLanes } from '../../domain/calendar/calendar-lanes';

type CalendarParticipant = { response:string; is_own:boolean; account_deleted?:boolean };
export type CalendarEvent = {
  id:string; title:string; intention:string; starts_at:string; ends_at:string; time_zone:string;
  can_manage:boolean; creator_deleted?:boolean; nucleus_event_participants:CalendarParticipant[];
};
export type CalendarScope = {owner:string;id:string};
export const dayMs = 86_400_000;
export const weekMs = 7*dayMs;
const hourMs = 3_600_000;
const utc = (options:Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('pt-BR',{...options,timeZone:'UTC'});
export const monthName = utc({month:'long'});
export const monthAndYear = utc({month:'long',year:'numeric'});
export const fullDate = utc({dateStyle:'full'});
export const shortDay = utc({weekday:'short',day:'numeric'});
export const shortMonth = utc({month:'short'});
export const clock = utc({hour:'2-digit',minute:'2-digit'});
export const minDay = utcDate(1,0,1);
export const maxDay = utcDate(9999,11,31);

export function utcDate(year:number,month:number,day:number) {
  const date=new Date(0);
  date.setUTCFullYear(year,month,day);
  return date.getTime();
}
export const clampDay = (date:number) => Math.max(minDay,Math.min(maxDay,date));
export function weekOf(time:number) {
  const day=new Date(time);
  day.setUTCHours(0,0,0,0);
  return day.getTime() - ((day.getUTCDay()+6)%7)*dayMs;
}
export const overlaps = (event:CalendarEvent,start:number,end:number) =>
  Date.parse(event.starts_at)<end && Date.parse(event.ends_at)>start;

export function attendance(event:CalendarEvent) {
  const participants = event.nucleus_event_participants ?? [];
  const current = participants.filter(person=>!person.account_deleted);
  const accepted = current.filter(person=>person.response==='accepted').length;
  const own = current.find(person=>person.is_own);
  return {current:current.length,accepted,deleted:participants.length-current.length,own,
    label:current.some(person=>person.response==='declined') ? 'Precisa de novo horário' :
      current.length && accepted===current.length ? 'Confirmado' : 'Aguardando respostas'};
}

export function weekLayout(start:number,events:CalendarEvent[]) {
  const days = Array.from({length:7},(_,i)=>{
    const date=start+i*dayMs;
    const segments=events.filter(event=>overlaps(event,date,date+dayMs)).map(event=>({
      event,start:Math.max(date,Date.parse(event.starts_at)),end:Math.min(date+dayMs,Date.parse(event.ends_at)),
    }));
    return {date,segments};
  });
  const earliest = Math.floor(Math.min(9,...days.flatMap(day=>day.segments.map(item=>(item.start-day.date)/hourMs))));
  const latest = Math.ceil(Math.max(21,...days.flatMap(day=>day.segments.map(item=>(item.end-day.date)/hourMs))));
  const y = (hour:number) => 8+(hour-earliest)*385/(latest-earliest);
  const hours = [0,3,6,9,12,15,18,21].filter(hour=>hour>=earliest && hour<latest)
    .map(hour=>({label:String(hour).padStart(2,'0')+':00',top:y(hour)}));
  return days.map(day=>{
    const cards=day.segments.map(segment=>({...segment,
      top:y((segment.start-day.date)/hourMs),height:Math.max(100,(segment.end-segment.start)*385/((latest-earliest)*hourMs)),
    }));
    // Usa a altura real, inclusive nos eventos curtos, para evitar cartões sobrepostos.
    const lanes=calendarEventLanes(cards.map(card=>({id:card.event.id,start:card.top,end:card.top+card.height})));
    return {date:day.date,hours,cards:cards.map(card=>{
      const lane=lanes.get(card.event.id)!;
      return {...card,left:lane.lane/lane.total*100,width:100/lane.total};
    })};
  });
}
export function localDateTime(instant:string) {
  const date=new Date(instant);
  return new Date(date.getTime()-date.getTimezoneOffset()*60_000).toISOString().slice(0,16);
}
export function formInstant(value:string,original?:string) {
  // Um editor com precisão de minutos não deve alterar segundos nem desambiguar novamente
  // um horário repetido na mudança de fuso quando o campo permaneceu igual.
  if(original && localDateTime(original)===value) return new Date(original).toISOString();
  const time=Date.parse(value);
  if (!Number.isFinite(time)) return '';
  const instant=new Date(time).toISOString();
  return localDateTime(instant)===value ? instant : '';
}
