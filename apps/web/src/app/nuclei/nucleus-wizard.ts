import { afterNextRender, Component, computed, DestroyRef, effect, inject, Injector, signal, viewChild, type ElementRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PreviewProfile } from '../preview-profile';
import { NavIcon, type NavIconName } from '../shared/nav-icon';
import { NucleiData } from './nuclei-data';
import { findNucleusType, nucleusTypes, type NucleusTypeId } from './nucleus-model';
import { NucleusSteps } from './nucleus-steps';

@Component({
  imports:[RouterLink,NavIcon],
  styleUrl:'./nucleus-wizard.css',
  template:`
    <a class="back-button" routerLink="/nucleos"><app-nav-icon name="left" />Voltar a Seus Núcleos</a>
    <header class="nucleus-header">
      <div><p class="kicker">Seu primeiro passo</p><h1 tabindex="-1">Como você quer começar?</h1>
        <p>Crie um espaço novo ou junte-se a quem te convidou.</p></div>
    </header>
    <nav class="wizard-paths" aria-label="Escolha como começar">
      <a class="surface wizard-path" routerLink="/comecar/tipo">
        <span class="wizard-path-icon"><app-nav-icon name="plus" /></span>
        <span><strong>Criar um núcleo</strong><small>Dê um nome ao vínculo, escolha o propósito de vocês e convide quem faz parte.</small></span>
        <app-nav-icon class="wizard-path-arrow" name="diagonal" />
      </a>
      <a class="surface wizard-path" routerLink="/comecar/convite">
        <span class="wizard-path-icon"><app-nav-icon name="users" /></span>
        <span><strong>Entrar com um convite</strong><small>Recebeu um código de alguém? Confira o Núcleo e decida se quer participar.</small></span>
        <app-nav-icon class="wizard-path-arrow" name="diagonal" />
      </a>
    </nav>
    <p class="wizard-note">Um Núcleo é um espaço privado de cuidado para as relações da sua vida. Cada vínculo tem seu jeito de florescer.</p>
  `,
})
export class ChoosePath {}

@Component({
  imports:[NucleusSteps,NavIcon],
  styleUrl:'./nucleus-wizard.css',
  template:`
    <app-nucleus-steps [current]="1" />
    <header class="nucleus-header"><div><p class="kicker">Um espaço com o jeito de vocês</p>
      <h1 tabindex="-1">Que relação vocês têm?</h1><p>Cada tipo de Núcleo cresce com objetivos diferentes.</p></div></header>
    <form class="surface wizard-panel" (submit)="choose($event)">
      <fieldset aria-describedby="type-help">
        <legend class="wizard-screen-reader">Tipo de Núcleo</legend>
        <div class="wizard-types">
          @for (item of types; track item.id) {
            <label class="wizard-type">
              <app-nav-icon [name]="typeIcons[item.id]" />
              <span><strong [id]="'label-'+item.id">{{ item.label }}</strong><small [id]="'desc-'+item.id">{{ item.description }}</small></span>
              <input type="radio" name="tipo" [value]="item.id" [checked]="selected() === item.id" (change)="selected.set(item.id)"
                required [attr.aria-labelledby]="'label-'+item.id" [attr.aria-describedby]="'desc-'+item.id">
            </label>
          }
        </div>
      </fieldset>
      <div class="wizard-panel-actions">
        <p id="type-help">Escolha o tipo que melhor representa este vínculo para continuar. O tipo não altera permissões ou o acesso ao Núcleo.</p>
        <button class="button wizard-continue" type="submit">Continuar <app-nav-icon name="right" /></button>
      </div>
    </form>
  `,
})
export class ChooseType {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly types = nucleusTypes;
  protected readonly typeIcons: Record<NucleusTypeId,NavIconName> = {
    casal:'heart', familia:'home', irmaos:'users', pais:'handHeart', amigos:'smile',
    equipes:'briefcase', comunidades:'links', mentorias:'sprout', 'grupos-religiosos':'church',
  };
  protected readonly selected = signal<NucleusTypeId | undefined>(findNucleusType(this.route.snapshot.queryParams['tipo'])?.id);

  protected choose(event: Event) {
    event.preventDefault();
    const tipo = this.selected();
    if (tipo) void this.router.navigate(['/comecar/proposito'],{queryParams:{tipo}});
  }
}

@Component({
  imports:[RouterLink,NucleusSteps,NavIcon],
  templateUrl:'./nucleus-purpose.html',
  styleUrl:'./nucleus-wizard.css',
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
  protected readonly nameInvalid = computed(() => !this.name().trim() || this.name().trim().length > 80);
  protected readonly purposeInvalid = computed(() => !this.purpose().trim() || this.purpose().trim().length > 500);
  protected readonly preview = signal(false);
  protected readonly pending = signal(false);
  protected readonly error = signal('');
  protected readonly attempted = signal(false);
  private readonly injector = inject(Injector);
  private readonly reviewHeading = viewChild<ElementRef<HTMLElement>>('reviewHeading');
  private readonly nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');
  private readonly purposeInput = viewChild<ElementRef<HTMLTextAreaElement>>('purposeInput');
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
    if (this.nameInvalid() || this.purposeInvalid()) {
      this.error.set('Informe um nome de até 80 caracteres e um propósito de até 500 caracteres.');
      // O foco segue após a renderização para incluir a mensagem ligada ao campo.
      afterNextRender(() => {
        (this.nameInvalid() ? this.nameInput() : this.purposeInput())?.nativeElement.focus();
      },{injector:this.injector});
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
