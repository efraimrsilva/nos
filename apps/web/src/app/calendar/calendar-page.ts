import { afterNextRender,Component,computed,effect,inject,Injector,resource,signal,untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute,RouterLink } from '@angular/router';
import { formatCalendarEventDate,parseCalendarEvent,parseCalendarPage } from '../../../../../src/features/calendar/event-input';
import { PreviewProfile } from '../preview-profile';
import { RouteState } from '../shared/route-state';
import { CalendarData,type CalendarChange } from './calendar-data';
import { CalendarMonth } from './calendar-month';
import { attendance,clampDay,clock,dayMs,formInstant,localDateTime,maxDay,minDay,monthAndYear,overlaps,shortDay,shortMonth,weekLayout,weekMs,weekOf,type CalendarEvent } from './calendar-model';

@Component({
  imports:[RouterLink,RouteState,CalendarMonth],
  templateUrl:'./calendar-page.html',
  styleUrls:['./calendar-page.css','./calendar-dialog.css'],
})
export class CalendarPage {
  private readonly profile=inject(PreviewProfile);
  private readonly data=inject(CalendarData);
  private readonly route=inject(ActivatedRoute);
  private readonly injector=inject(Injector);
  private readonly params=toSignal(this.route.paramMap,{initialValue:this.route.snapshot.paramMap});
  private readonly query=toSignal(this.route.queryParamMap,{initialValue:this.route.snapshot.queryParamMap});
  private readonly fragment=toSignal(this.route.fragment,{initialValue:this.route.snapshot.fragment});
  private readonly scope=computed(()=>{
    const owner=this.profile.user()?.id,id=this.params().get('id');
    return owner && id ? {owner,id} : undefined;
  },{equal:(a,b)=>a?.owner===b?.owner && a?.id===b?.id});
  protected readonly page=computed(()=>{
    const values=this.query().getAll('pagina'), page=parseCalendarPage(values.length===1 ? values[0] : undefined);
    return page<=42_949_673 ? page : 1; // O deslocamento precisa caber no integer da função do banco.
  });
  protected readonly state=resource({
    params:()=>{const scope=this.scope(); return scope ? {scope,page:this.page()} : undefined;},
    loader:({params,abortSignal})=>this.data.read(params.scope,params.page,abortSignal),
  });
  protected readonly view=computed(()=>this.state.hasValue() ? this.state.value() : null);
  protected readonly today=Date.parse(new Date().toISOString().slice(0,10));
  private readonly dateChoice=signal<number|null>(null);
  private readonly eventChoice=signal<string|null>(null);
  private seenFragment='';
  protected readonly chosen=computed(()=>this.dateChoice() ?? this.eventDay(this.view()?.events[0]));
  protected readonly week=computed(()=>weekOf(this.chosen()));
  protected readonly events=computed(()=>this.view()?.events ?? []);
  protected readonly weekEvents=computed(()=>this.events().filter(event=>overlaps(event,this.week(),this.week()+weekMs)));
  protected readonly layout=computed(()=>weekLayout(this.week(),this.weekEvents()));
  protected readonly selected=computed(()=>this.weekEvents().find(event=>event.id===this.eventChoice()) ?? this.weekEvents()[0]);
  protected readonly presence=computed(()=>{const event=this.selected(); return event ? attendance(event) : null;});
  protected readonly range=computed(()=>{
    const begin=new Intl.DateTimeFormat('pt-BR',{day:'numeric',month:'long',timeZone:'UTC'}).format(this.week());
    const end=new Intl.DateTimeFormat('pt-BR',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(this.week()+6*dayMs);
    return begin+' — '+end;
  });
  protected readonly weekTitle=computed(()=>monthAndYear.format(clampDay(this.week()+3*dayMs)));
  protected readonly day=shortDay;
  protected readonly shortMonth=shortMonth;
  protected readonly clock=clock;
  protected readonly date=formatCalendarEventDate;
  protected readonly attendance=attendance;
  protected readonly dateNumber=(date:string)=>new Date(date).getUTCDate();
  protected readonly dateMillis=Date.parse;
  protected readonly minDay=minDay;
  protected readonly maxDay=maxDay;
  protected readonly latestPage=42_949_673;

  protected readonly notice=signal('');
  protected readonly error=signal('');
  protected readonly dialogError=signal('');
  protected readonly busy=signal(false);
  protected readonly uncertainCreate=signal(false);
  protected readonly editing=signal<CalendarEvent|undefined>(undefined);
  protected readonly removing=signal<CalendarEvent|undefined>(undefined);
  protected readonly confirmed=signal(false);
  protected readonly deviceZone=Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  constructor() {
    effect(()=>{
      this.scope();
      this.page();
      this.dateChoice.set(null);
      this.eventChoice.set(null);
      this.notice.set('');
      this.error.set('');
      this.dialogError.set('');
      this.uncertainCreate.set(false);
      this.seenFragment='';
    });
    effect(()=>{
      const fragment=this.fragment(), view=this.view();
      const key=view && fragment ? view.scope.id+'/'+fragment : '';
      if (!fragment) this.seenFragment='';
      if (!key || key===this.seenFragment) return;
      const event=view?.events.find(row=>fragment==='evento-'+row.id);
      if (event) {
        this.seenFragment=key;
        untracked(()=>this.chooseEvent(event,true));
      }
    });
  }

  private eventDay(event?:CalendarEvent) {
    const date=new Date(event?.starts_at ?? this.today);
    date.setUTCHours(0,0,0,0);
    return clampDay(date.getTime());
  }

  protected chooseDay(value:number) {
    this.dateChoice.set(clampDay(value));
    this.eventChoice.set(null);
  }

  protected moveWeek(offset:number) {
    this.chooseDay(this.chosen()+offset*weekMs);
  }

  protected chooseEvent(event:CalendarEvent,all=false,keyboard=false) {
    if(all) this.dateChoice.set(this.eventDay(event));
    this.eventChoice.set(event.id);
    afterNextRender(()=>{
      const heading=document.getElementById('calendar-detail-heading');
      if (heading && (keyboard || matchMedia('(max-width: 900px)').matches || all)) {
        heading.scrollIntoView({block:'nearest'});
        if(keyboard) heading.focus({preventScroll:true});
      }
    },{injector:this.injector});
  }

  protected openEditor(dialog:HTMLDialogElement,form:HTMLFormElement,event?:CalendarEvent) {
    if(this.busy() || this.state.isLoading()) return;
    this.editing.set(event);
    this.dialogError.set('');
    // Reabrir o mesmo evento parte dos dados confirmados, inclusive após cancelar um rascunho.
    const title=form.elements.namedItem('title') as HTMLInputElement;
    title.value=event?.title ?? '';
    (form.elements.namedItem('intention') as HTMLTextAreaElement).value=event?.intention ?? '';
    (form.elements.namedItem('start') as HTMLInputElement).value=event ? localDateTime(event.starts_at) : '';
    (form.elements.namedItem('end') as HTMLInputElement).value=event ? localDateTime(event.ends_at) : '';
    dialog.showModal();
    title.focus();
  }

  protected openRemoval(dialog:HTMLDialogElement,event:CalendarEvent) {
    if(this.busy() || this.state.isLoading()) return;
    this.removing.set(event);
    this.confirmed.set(false);
    this.dialogError.set('');
    dialog.showModal();
  }

  protected save(e:SubmitEvent,form:HTMLFormElement,dialog:HTMLDialogElement) {
    e.preventDefault();
    const fields=new FormData(form), event=this.editing();
    const startsAt=formInstant(String(fields.get('start') ?? ''),event?.starts_at);
    const endsAt=formInstant(String(fields.get('end') ?? ''),event?.ends_at);
    if(!startsAt || !endsAt || Date.parse(endsAt)<=Date.parse(startsAt)) {
      this.dialogError.set('O término precisa ser posterior ao início e os horários precisam existir neste fuso.');
      return;
    }
    if(Date.parse(endsAt)<=Date.now()) {
      this.dialogError.set('Escolha um evento que termine no futuro.');
      return;
    }
    const input={title:String(fields.get('title') ?? ''),intention:String(fields.get('intention') ?? ''),
      startsAt,endsAt,timeZone:this.deviceZone};
    // Preserve o fuso em alterações textuais, com o fuso do dispositivo para legados que o Intl não reconhece.
    const sameTime=event && startsAt===new Date(event.starts_at).toISOString() && endsAt===new Date(event.ends_at).toISOString();
    const parsed=(sameTime ? parseCalendarEvent({...input,timeZone:event.time_zone}) : null) ?? parseCalendarEvent(input);
    if(!parsed) { this.dialogError.set('Confira o título, a intenção, os horários e o fuso.'); return; }
    void this.apply({kind:'save',event,fields:parsed},dialog);
  }

  protected respond(event:CalendarEvent,response:'accepted'|'declined') {
    void this.apply({kind:'respond',event,response});
  }

  protected remove(event:SubmitEvent,dialog:HTMLDialogElement) {
    event.preventDefault();
    const target=this.removing();
    if(target && this.confirmed()) void this.apply({kind:'remove',event:target,confirmed:true},dialog);
  }

  private async apply(change:CalendarChange,dialog?:HTMLDialogElement) {
    const view=this.view(), scope=this.scope(), page=this.page();
    const creating=change.kind==='save' && !change.event;
    if(!view || !scope || view.scope!==scope || this.busy() || this.state.isLoading() || (creating && this.uncertainCreate())) return;
    if(change.event && !view.events.some(event=>event.id===change.event?.id)) return;
    const showError=(message:string)=>(dialog?.open ? this.dialogError : this.error).set(message);
    this.busy.set(true);
    this.notice.set('');
    this.error.set('');
    this.dialogError.set('');
    try {
      const result=await this.data.change(scope,change);
      if(this.scope()!==scope || this.page()!==page) return;
      if(result.status==='unknown') {
        if(creating) this.uncertainCreate.set(true);
        dialog?.close();
        this.error.set('A operação não foi confirmada. Confira a agenda atualizada antes de repetir.');
        this.state.reload();
        return;
      }
      if(result.status==='error') {
        showError('Não foi possível concluir a ação. Confira o acesso e tente novamente.');
        return;
      }
      dialog?.close();
      if(change.kind==='save') {
        const day=new Date(change.fields.startsAt);
        day.setUTCHours(0,0,0,0);
        this.chooseDay(day.getTime());
        if(result.id) this.eventChoice.set(result.id);
        this.notice.set('Evento salvo.');
      } else if(change.kind==='respond') {
        this.notice.set('Sua resposta foi registrada.');
      } else {
        this.eventChoice.set(null);
        this.notice.set('Evento removido.');
      }
      this.state.reload();
    } catch {
      if(this.scope()===scope && this.page()===page) showError('Não foi possível conferir sua sessão. Entre novamente ou tente mais tarde.');
    } finally { this.busy.set(false); }
  }
}
