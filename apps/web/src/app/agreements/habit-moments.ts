import { Component,computed,inject,input,resource } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { HabitData,type HabitContext } from './habit-data';
import { habitDate,habitMoodLabels,parseHabitMomentCursor } from './habit-model';

@Component({
  selector:'app-habit-moments',
  imports:[RouterLink],
  template:`
    <section class="surface agreement-detail" aria-labelledby="habit-history-title">
      <p class="kicker">A história deste combinado</p>
      <h2 id="habit-history-title">Momentos registrados</h2>
      <p>Vivências compartilhadas com o Núcleo.</p>
      @if (state.error()) {
        <p role="alert">Não foi possível consultar o histórico.</p>
        <button class="button secondary" type="button" (click)="state.reload()">Tentar novamente</button>
      } @else if (state.isLoading() && !state.hasValue()) {
        <p role="status">Carregando o histórico…</p>
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
        } @else { <p>{{ cursor()?'Não há registros mais antigos.':'Ainda não há momentos registrados para este Hábito.' }}</p> }
        @if (cursor() || history.next) {
          <nav class="agreement-actions" aria-label="Páginas dos momentos">
            @if (cursor()) { <a class="button secondary" [routerLink]="[]" [queryParams]="{antes:null}" queryParamsHandling="merge">Momentos recentes</a> }
            @if (history.next) { <a class="button secondary" [routerLink]="[]" [queryParams]="{antes:history.next}" queryParamsHandling="merge">Momentos anteriores</a> }
          </nav>
        }
      } @else { <p>Histórico indisponível.</p> }
    </section>
  `,
})
export class HabitMoments {
  readonly context = input.required<HabitContext>();
  readonly refresh = input(0);
  private readonly data = inject(HabitData);
  private readonly route = inject(ActivatedRoute);
  private readonly query = toSignal(this.route.queryParamMap,{initialValue:this.route.snapshot.queryParamMap});
  private readonly before = computed(() => this.query().getAll('antes').length===1 ? this.query().get('antes') : null);
  protected readonly cursor = computed(() => parseHabitMomentCursor(this.before()));
  protected readonly date = habitDate;
  protected readonly moods = habitMoodLabels;
  private readonly selection = computed(() => this.context(),{
    equal:(a,b)=>a.scope.id===b.scope.id && a.scope.owner===b.scope.owner && a.agreement.id===b.agreement.id,
  });
  protected readonly state = resource({
    params:()=>({context:this.selection(),cursor:this.cursor(),refresh:this.refresh()}),
    loader:({params,abortSignal})=>this.data.moments(params.context,params.cursor,abortSignal),
  });
}
