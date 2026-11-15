import { inject, Injectable } from '@angular/core';
import { parseCalendarEvent } from '../../../../../src/features/calendar/event-input';
import { NucleiData } from '../nuclei/nuclei-data';
import { isNucleusId } from '../nuclei/nucleus-model';
import type { CalendarEvent,CalendarScope } from './calendar-model';

export type CalendarChange =
  | {kind:'save';event?:CalendarEvent;fields:NonNullable<ReturnType<typeof parseCalendarEvent>>}
  | {kind:'respond';event:CalendarEvent;response:'accepted'|'declined'}
  | {kind:'remove';event:CalendarEvent;confirmed:true};
export const calendarPageSize = 50;

@Injectable({providedIn:'root'})
export class CalendarData {
  private readonly nuclei=inject(NucleiData);
  async read(scope:CalendarScope,page:number,signal:AbortSignal) {
    const selected=await this.nuclei.selected(scope.owner,scope.id,signal);
    if (!selected) return null;
    // A leitura do banco mascara autoria e calcula participação própria e gestão.
    const result=await selected.client.rpc('get_nucleus_calendar',{
      target_nucleus:scope.id,from_ends_at:new Date().toISOString(),
      page_offset:(page-1)*calendarPageSize,page_size:calendarPageSize+1,
    }).abortSignal(signal);
    if (result.error?.code==='42501') return null;
    if (result.error) throw new Error('Não foi possível consultar a agenda.');
    const events=(result.data ?? []) as CalendarEvent[];
    return {scope,name:selected.nucleus.name,events:events.slice(0,calendarPageSize),hasNext:events.length>calendarPageSize};
  }

  async change(scope:CalendarScope,change:CalendarChange) {
    if (!isNucleusId(scope.id) || (change.event && !isNucleusId(change.event.id))) return {status:'error'} as const;
    const client=await this.nuclei.clientForAccount(scope.owner,true);
    // O banco autoriza e serializa as operações; não repetir uma gravação de resultado incerto.
    let request;
    if (change.kind==='save') {
      const parsed=parseCalendarEvent(change.fields);
      if (!parsed || Date.parse(parsed.endsAt)<=Date.now()) return {status:'error'} as const;
      const fields={event_title:parsed.title,event_intention:parsed.intention,
        event_starts_at:parsed.startsAt,event_ends_at:parsed.endsAt,event_time_zone:parsed.timeZone};
      request=change.event
        ? client.rpc('update_nucleus_event',{target_event:change.event.id,...fields})
        : client.rpc('create_nucleus_event',{target_nucleus:scope.id,...fields});
    } else if (change.kind==='respond') {
      request=client.rpc('respond_nucleus_event',{target_event:change.event.id,event_response:change.response});
    } else {
      request=client.rpc('delete_nucleus_event',{target_event:change.event.id});
    }
    const result=await request.retry(false);
    if (result.error) return {status:result.status===0 || result.status>=500 ? 'unknown' : 'error'} as const;
    return {status:'saved',id:change.event?.id ?? (isNucleusId(result.data) ? result.data : undefined)} as const;
  }
}
