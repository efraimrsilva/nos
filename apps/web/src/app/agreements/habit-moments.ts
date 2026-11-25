import { Component,computed,inject,input,resource,signal } from '@angular/core';
import { HabitData,type HabitContext } from './habit-data';
import { habitDate,habitMoodLabels,parseHabitMomentCursor } from './habit-model';

@Component({
  selector:'app-habit-moments',
  template:`
    <section class="agreement-detail" aria-label="Momentos registrados">
      @if (state.error()) {
        <p role="alert">Não foi possível consultar o histórico.</p>
        <button class="button secondary" type="button" (click)="state.reload()">Tentar novamente</button>
      } @else if (state.isLoading() && !state.hasValue()) {
        <p class="loading-state" role="status">Carregando o histórico…</p>
      } @else if (state.value(); as history) {
        @if (history.rows.length) {
          <ol class="habit-records habit-timeline">
            @for (item of history.rows; track item.id) {
              <li><p><strong>{{ item.authorship_hidden?'Autoria oculta':!item.author_id?'Conta excluída':item.author_id===context().scope.owner?'Seu registro':'Registro de outra pessoa' }}</strong>
                <time [attr.datetime]="item.created_at">{{ date(item.created_at) }}</time></p>
                <h3>{{ moods[item.mood] ?? 'Humor indisponível' }}</h3>
                @if (item.note) { <p class="agreement-description">{{ item.note }}</p> }
              </li>
            }
          </ol>
        } @else { <p>{{ cursor()?'Não há registros mais antigos.':'Ainda não há momentos registrados.' }}</p> }
        @if (cursor() || history.next) {
          <nav class="agreement-actions" aria-label="Páginas dos momentos">
            @if (cursor()) { <button type="button" class="button secondary" (click)="dialogCursor.set(null)">Momentos recentes</button> }
            @if (history.next) { <button type="button" class="button secondary" (click)="dialogCursor.set(history.next)">Momentos anteriores</button> }
          </nav>
        }
      } @else { <p>Histórico indisponível.</p> }
    </section>
  `,
})
export class HabitMoments {
  readonly context = input.required<HabitContext>();
  // No modal, a paginação do histórico é independente da lista de acordos.
  protected readonly dialogCursor = signal<string|null>(null);
  private readonly data = inject(HabitData);
  protected readonly cursor = computed(() => parseHabitMomentCursor(this.dialogCursor()));
  protected readonly date = habitDate;
  protected readonly moods = habitMoodLabels;
  private readonly selection = computed(() => this.context(),{
    equal:(a,b)=>a.scope.id===b.scope.id && a.scope.owner===b.scope.owner && a.agreement.id===b.agreement.id,
  });
  protected readonly state = resource({
    params:()=>({context:this.selection(),cursor:this.cursor()}),
    loader:({params,abortSignal})=>this.data.moments(params.context,params.cursor,abortSignal),
  });
}
