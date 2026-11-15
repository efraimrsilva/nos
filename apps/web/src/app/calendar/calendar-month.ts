import { afterNextRender, Component, computed, effect, ElementRef, inject, Injector, input, output, signal } from '@angular/core';
import { clampDay, dayMs, fullDate, maxDay,minDay,monthAndYear,monthName,overlaps,utcDate,weekOf,type CalendarEvent } from './calendar-model';

@Component({
  selector:'app-calendar-month',
  templateUrl:'./calendar-month.html',
  styleUrl:'./calendar-month.css',
})
export class CalendarMonth {
  readonly selected=input.required<number>();
  readonly today=input.required<number>();
  readonly events=input.required<CalendarEvent[]>();
  readonly chosen=output<number>();
  private readonly host=inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector=inject(Injector);
  protected readonly cursor=signal(Date.now());
  protected readonly weekdays=['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
  protected readonly months=Array.from({length:12},(_,month)=>monthName.format(utcDate(2026,month,1)));
  protected readonly year=computed(()=>new Date(this.cursor()).getUTCFullYear());
  protected readonly month=computed(()=>new Date(this.cursor()).getUTCMonth());
  protected readonly caption=computed(()=>monthAndYear.format(this.cursor()));
  protected readonly years=computed(()=>{
    const first=Math.max(1,this.year()-100), last=Math.min(9999,this.year()+100);
    return Array.from({length:last-first+1},(_,i)=>first+i);
  });
  protected readonly first=computed(()=>utcDate(this.year(),this.month(),1));
  protected readonly rows=computed(()=>{
    const start=weekOf(this.first());
    return Array.from({length:6},(_,row)=>Array.from({length:7},(_,col)=>{
      const value=start+(row*7+col)*dayMs;
      const marked=this.events().some(event=>overlaps(event,value,value+dayMs));
      return {value,day:new Date(value).getUTCDate(),outside:new Date(value).getUTCMonth()!==this.month(),
        valid:value>=minDay && value<=maxDay,marked,label:fullDate.format(value)+(marked?' · com evento':'')};
    }));
  });

  constructor() { effect(()=>this.cursor.set(clampDay(this.selected()))); }

  protected moveMonth(month:number,year=this.year(),day=1) {
    const first=utcDate(year,month,1);
    const end=utcDate(year,month+1,0);
    this.cursor.set(clampDay(Math.min(first+(day-1)*dayMs,end)));
  }

  protected changeMonth(offset:number) {
    return offset<0 ? this.first()>minDay : this.first()<utcDate(9999,11,1);
  }

  protected choose(value:number) {
    this.cursor.set(value);
    this.chosen.emit(value);
  }

  protected moveFocus(event:KeyboardEvent,value:number) {
    const offsets:Record<string,number>={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7,
      Home:(weekOf(value)-value)/dayMs,End:(weekOf(value)-value)/dayMs+6};
    if(Object.hasOwn(offsets,event.key)) {
      this.cursor.set(clampDay(value+offsets[event.key]*dayMs));
    } else if(event.key==='PageUp' || event.key==='PageDown') {
      this.moveMonth(this.month()+(event.shiftKey?12:1)*(event.key==='PageUp'?-1:1),this.year(),new Date(value).getUTCDate());
    } else return;
    event.preventDefault();
    // O mês pode trocar de conjunto de botões; devolve o foco depois que a grade é renderizada.
    afterNextRender(()=>this.host.nativeElement.querySelector<HTMLButtonElement>('button[data-day][tabindex="0"]')?.focus(),{injector:this.injector});
  }
}
