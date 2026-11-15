import { afterNextRender, Component, computed, DestroyRef, effect, inject, Injector, input, signal, viewChild, type ElementRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PreviewProfile } from '../preview-profile';
import { NucleiData } from './nuclei-data';
import { findNucleusType, nucleusTypes, type NucleusTypeId } from './nucleus-model';

@Component({
  imports:[RouterLink],
  template:`
    <a class="text-link" routerLink="/nucleos">Voltar a Seus Núcleos</a>
    <header class="nucleus-header">
      <div><p class="kicker">Seu primeiro passo</p><h1 tabindex="-1">Como você quer começar?</h1>
        <p>Crie um espaço novo ou junte-se a quem te convidou.</p></div>
    </header>
    <nav class="overview-grid dialog-links" aria-label="Escolha como começar">
      <a class="surface" routerLink="/comecar/tipo"><strong>Criar um núcleo</strong><span>Escolha o vínculo, o nome e o propósito de vocês.</span></a>
      <a class="surface" routerLink="/comecar/convite"><strong>Entrar com um convite</strong><span>Recebeu um código de alguém? Confira o Núcleo antes de decidir.</span></a>
    </nav>
  `,
})
export class ChoosePath {}

@Component({
  selector:'app-nucleus-steps',
  template:`
    <ol class="steps" aria-label="Etapas da criação do Núcleo">
      @for (label of labels; track label; let idx = $index) {
        <li [attr.aria-current]="current() === idx+1 ? 'step' : null">{{ idx+1 }}. {{ label }}</li>
      }
    </ol>
  `,
})
class NucleusSteps {
  readonly current = input.required<number>();
  protected readonly labels = ['Escolher relação','Definir propósito','Convidar pessoas'];
}

@Component({
  imports:[RouterLink,NucleusSteps],
  template:`
    <a class="text-link" routerLink="/comecar">Voltar</a>
    <app-nucleus-steps [current]="1" />
    <header class="nucleus-header"><div><p class="kicker">Um espaço com o jeito de vocês</p>
      <h1 tabindex="-1">Que relação vocês têm?</h1><p>Cada tipo de Núcleo cresce com objetivos diferentes.</p></div></header>
    <form class="surface wizard" (submit)="choose($event)">
      <fieldset aria-describedby="type-help">
        <legend>Tipo de Núcleo</legend>
        <div class="type-grid">
          @for (item of types; track item.id) {
            <label class="type-option">
              <input type="radio" name="tipo" [value]="item.id" [checked]="selected() === item.id" (change)="selected.set(item.id)"
                required [attr.aria-labelledby]="'label-'+item.id" [attr.aria-describedby]="'desc-'+item.id">
              <span><strong [id]="'label-'+item.id">{{ item.label }}</strong><small [id]="'desc-'+item.id">{{ item.description }}</small></span>
            </label>
          }
        </div>
      </fieldset>
      <div class="wizard-actions">
        <p id="type-help">O tipo não altera as permissões do Núcleo.</p>
        <button class="button" type="submit">Continuar</button>
      </div>
    </form>
  `,
})
export class ChooseType {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly types = nucleusTypes;
  protected readonly selected = signal<NucleusTypeId | undefined>(findNucleusType(this.route.snapshot.queryParams['tipo'])?.id);

  protected choose(event: Event) {
    event.preventDefault();
    const tipo = this.selected();
    if (tipo) void this.router.navigate(['/comecar/proposito'],{queryParams:{tipo}});
  }
}

@Component({
  imports:[RouterLink,NucleusSteps],
  templateUrl:'./nucleus-purpose.html',
})
export class NucleusPurpose {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly profile = inject(PreviewProfile);
  private readonly data = inject(NucleiData);
  private readonly destroy = inject(DestroyRef);
  private readonly query = toSignal(this.route.queryParams,{initialValue:this.route.snapshot.queryParams});
  protected readonly type = computed(() => findNucleusType(this.query()['tipo']));
  protected readonly name = signal('');
  protected readonly purpose = signal('');
  protected readonly preview = signal(false);
  protected readonly pending = signal(false);
  protected readonly error = signal('');
  protected readonly attempted = signal(false);
  private readonly injector = inject(Injector);
  private readonly reviewHeading = viewChild<ElementRef<HTMLElement>>('reviewHeading');
  private readonly nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');
  private draftType = this.type()?.id;
  private request?: {id:string; owner:string; type:NucleusTypeId; name:string; purpose:string};

  constructor() {
    effect(() => {
      const currentType = this.type()?.id;
      if (!currentType) {
        void this.router.navigateByUrl('/comecar/tipo',{replaceUrl:true});
        return;
      }
      if (this.draftType === currentType) return;
      // Só a escolha do tipo está na URL. Outro tipo inicia um novo rascunho.
      this.draftType = currentType;
      this.request = undefined;
      this.name.set('');
      this.purpose.set('');
      this.preview.set(false);
      this.attempted.set(false);
      this.pending.set(false);
      this.error.set('');
    });
  }

  protected review(event: Event) {
    event.preventDefault();
    const name = this.name().trim();
    const purpose = this.purpose().trim();
    if (!name || !purpose || name.length > 80 || purpose.length > 500) {
      this.error.set('Informe um nome de até 80 caracteres e um propósito de até 500 caracteres.');
      return;
    }
    this.name.set(name);
    this.purpose.set(purpose);
    this.error.set('');
    this.preview.set(true);
    afterNextRender(() => this.reviewHeading()?.nativeElement.focus(),{injector:this.injector});
  }

  protected edit() {
    this.preview.set(false);
    afterNextRender(() => this.nameInput()?.nativeElement.focus(),{injector:this.injector});
  }

  protected async confirm(event: Event) {
    event.preventDefault();
    const user = this.profile.user();
    const type = this.type();
    if (!user || !type || this.pending() || !this.preview()) return;
    this.request ??= {id:crypto.randomUUID(),owner:user.id,type:type.id,name:this.name(),purpose:this.purpose()};
    const request = this.request;
    if (request.owner !== user.id) return;
    this.pending.set(true);
    this.attempted.set(true);
    this.error.set('');
    try {
      const id = await this.data.create(request.owner,request.id,request.type,request.name,request.purpose);
      if (this.destroy.destroyed || this.request !== request || this.profile.user()?.id !== request.owner) return;
      await this.router.navigate(['/comecar/convite-inicial',id],{replaceUrl:true});
    } catch {
      if (this.request === request) this.error.set('Não foi possível confirmar a criação. Tente novamente para verificar o mesmo Núcleo.');
    } finally { if (this.request === request) this.pending.set(false); }
  }
}
