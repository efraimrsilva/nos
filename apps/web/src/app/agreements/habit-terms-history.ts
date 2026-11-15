import { Component,computed,DestroyRef,inject,input,resource,signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute,Router,RouterLink } from '@angular/router';
import { HabitData,type HabitContext } from './habit-data';
import { canRespond } from './proposal-model';
import { habitDate,readNewTerms } from './habit-model';

@Component({
  selector:'app-habit-terms-history',
  imports:[RouterLink],
  templateUrl:'./habit-terms-history.html',
})
export class HabitTermsHistory {
  readonly context = input.required<HabitContext>();
  readonly admin = input(false);
  private readonly data = inject(HabitData);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy = inject(DestroyRef);
  private readonly query = toSignal(this.route.queryParamMap,{initialValue:this.route.snapshot.queryParamMap});
  private readonly selection = computed(()=>this.context(),{equal:(a,b)=>a.scope.id===b.scope.id &&
    a.scope.owner===b.scope.owner && a.agreement.id===b.agreement.id && a.agreement.terms_version===b.agreement.terms_version});
  private readonly refresh = signal(0);
  protected readonly before = computed(()=>this.queryNumber('versao',9));
  protected readonly page = computed(()=>this.queryNumber('legado',4) ?? 1);
  protected readonly state = resource({
    params:()=>({context:this.selection(),before:this.before(),page:this.page(),refresh:this.refresh()}),
    loader:({params,abortSignal})=>this.data.history(params.context,params.before,params.page,abortSignal),
  });
  protected readonly editable = computed(()=>this.admin() && canRespond(this.context().agreement));
  protected readonly draft = signal<HabitContext|null>(null);
  protected readonly pending = signal(false);
  protected readonly feedback = signal('');
  protected readonly error = signal('');
  protected readonly date = habitDate;
  protected readonly revisionStates:Record<string,string> = {
    pending:'Pendente no modelo descontinuado',applied:'Aplicado no modelo anterior',declined:'Recusado no modelo anterior',
  };
  protected readonly trialStates:Record<string,string> = {
    pending:'Pendente no modelo anterior',testing:'Em teste no modelo anterior',confirmed:'Confirmado no modelo anterior',
    declined:'Recusado no modelo anterior',ended:'Encerrado no modelo anterior',proposed:'Proposto no modelo anterior',
    active:'Ativo no modelo anterior',superseded:'Substituído no modelo anterior',
  };

  protected open(dialog:HTMLDialogElement) {
    if (this.pending()) return;
    this.feedback.set('');
    this.error.set('');
    this.draft.set(this.context());
    dialog.showModal();
  }

  protected cancel(dialog:HTMLDialogElement) {
    if (!dialog.open && !this.pending()) this.draft.set(null);
  }

  protected async submit(event:Event,dialog:HTMLDialogElement) {
    event.preventDefault();
    const draft = this.draft();
    if (!draft || this.pending() || !this.editable()) return;
    const form = new FormData(event.currentTarget as HTMLFormElement);
    if (!form.has('confirmed')) return;
    const terms = readNewTerms(form);
    if (!terms) {
      this.error.set('Preencha os termos dentro dos limites indicados.');
      return;
    }
    this.error.set('');
    this.pending.set(true);
    try {
      const error = await this.data.apply(draft,'terms',terms);
      if (this.destroy.destroyed || this.context().agreement.id!==draft.agreement.id) return;
      if (error) this.error.set(error);
      else {
        if (dialog.open) dialog.close();
        this.draft.set(null);
        this.feedback.set('Novos termos publicados. Cada pessoa pode decidir sobre a nova versão.');
        if (this.before()) void this.router.navigate([],{
          relativeTo:this.route,queryParams:{versao:null},queryParamsHandling:'merge',replaceUrl:true,
        });
      }
      this.refresh.update(value=>value+1);
    } catch {
      if (!this.destroy.destroyed) this.error.set('Não foi possível conferir a sessão.');
    } finally { this.pending.set(false); }
  }

  private queryNumber(name:string,digits:number) {
    const values = this.query().getAll(name);
    const value = values[0];
    return values.length===1 && value.length<=digits && /^[1-9]\d*$/.test(value) ? Number(value) : null;
  }
}
