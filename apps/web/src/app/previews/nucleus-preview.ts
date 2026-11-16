import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, resource, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NucleiData } from '../nuclei/nuclei-data';
import { PreviewProfile } from '../preview-profile';
import { memories, people, principles, roots, sections, topics, type PreviewKind } from './examples';

@Component({
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './nucleus-preview.html',
  styleUrl: './nucleus-preview.css',
})
export class NucleusPreview {
  private readonly route = inject(ActivatedRoute);
  private readonly profile = inject(PreviewProfile);
  private readonly data = inject(NucleiData);
  private readonly params = toSignal(this.route.paramMap, {initialValue: this.route.snapshot.paramMap});
  protected readonly id = computed(() => this.params().get('id') ?? '');
  protected readonly kind = this.route.snapshot.data['preview'] as PreviewKind;
  protected readonly section = sections[this.kind];
  protected readonly destinations = Object.entries(sections);
  protected readonly state = resource({
    params: () => {
      const owner = this.profile.user()?.id;
      return owner ? {owner, id: this.id()} : undefined;
    },
    // Reutiliza a política do banco que protege o Início do Núcleo, inclusive por endereço direto.
    loader: ({params, abortSignal}) => this.data.selected(params.owner, params.id, abortSignal),
  });

  protected readonly roots = roots;
  protected readonly root = signal(roots[0]);
  protected readonly filters = ['Todas', 'Encontros', 'Pequenos gestos'];
  protected readonly filter = signal('Todas');
  protected readonly memory = signal(memories[0]);
  protected readonly visibleMemories = computed(() =>
    this.filter() === 'Todas' ? memories : memories.filter(item => item.type === this.filter()));
  protected readonly people = people;
  protected readonly person = signal(people[0]);
  protected readonly topics = topics;
  protected readonly topic = signal<(typeof topics)[number]['key']>('care');
  protected readonly principles = principles;
  protected readonly preparation = ['Intenção', 'Escuta', 'Pausa'];
  protected readonly step = signal('Intenção');
  protected readonly prepared = signal(false);
  protected readonly draft = signal('');

  constructor() {
    // A mesma instância de rota pode receber outro Núcleo. Descarte o rascunho entre contextos.
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(() => this.setDraft(''));
  }

  protected filterMemories(filter: string) {
    this.filter.set(filter);
    if (!this.visibleMemories().includes(this.memory())) this.memory.set(this.visibleMemories()[0]);
  }

  protected togglePreparation() { this.prepared.update(value => !value); }

  protected setDraft(value: string) {
    this.draft.set(value);
    this.prepared.set(false);
    this.step.set('Intenção');
  }
}
