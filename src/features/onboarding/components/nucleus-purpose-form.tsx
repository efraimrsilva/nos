"use client";

import { useActionState, useState, type FormEvent } from "react";
import { ArrowRight, Lightbulb } from "lucide-react";
import { createNucleus } from "@/features/nuclei/actions";

export function NucleusPurposeForm({ suggestion, type }: { suggestion: string; type: string }) {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [creation, createAction, creating] = useActionState(createNucleus, { error: "" });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !purpose.trim()) { setError("Informe o nome e o propósito para conferir o rascunho."); return; }
    setName(name.trim()); setPurpose(purpose.trim()); setError(""); setPreview(true);
  }

  if (preview) return <section className="ui-panel wizard-panel" aria-label="Rascunho do Núcleo">
    <p className="ui-kicker">Antes de criar</p><h2 className="mt-3 text-2xl">Confira seu rascunho</h2>
    <dl className="wizard-summary"><div><dt>Nome do Núcleo</dt><dd>{name}</dd></div><div><dt>Nosso propósito</dt><dd>{purpose}</dd></div></dl>
    <p className="ui-feedback">Nenhum Núcleo foi criado. Este rascunho não é salvo e será perdido ao recarregar ou sair desta página. Ao confirmar, criaremos o Núcleo e sua participação como administrador. Convidar outra pessoa será o próximo passo opcional.</p>
    {/* A confirmação usa a mesma ação protegida; os textos não passam pela URL. */}
    <form action={createAction} className="mt-5" aria-busy={creating}><input type="hidden" name="type" value={type} /><input type="hidden" name="name" value={name} /><input type="hidden" name="purpose" value={purpose} />
      {creation.error && <p role="alert" className="ui-feedback mb-4">{creation.error}</p>}
      <div className="wizard-actions"><button type="button" disabled={creating} onClick={() => setPreview(false)} className="ui-button-secondary">Editar</button><button type="submit" disabled={creating} className="ui-button">{creating ? "Criando…" : "Criar Núcleo"}</button></div>
    </form>
  </section>;

  // A revisão local evita incluir nome e propósito em parâmetros ou logs de navegação.
  return <form onSubmit={submit} className="ui-panel wizard-panel" noValidate>
    <div className="wizard-fields">
      <div className="wizard-field"><label htmlFor="nucleus-name">Nome do Núcleo</label><input id="nucleus-name" type="text" autoComplete="off" maxLength={80} value={name} onChange={event => { setName(event.target.value); setError(""); }} placeholder="Ex.: Nós dois" className="ui-field" aria-invalid={!!error && !name.trim()} aria-describedby={error ? "purpose-error" : undefined} /></div>
      <div className="wizard-field"><label htmlFor="nucleus-purpose">Nosso propósito</label><textarea id="nucleus-purpose" rows={4} maxLength={500} value={purpose} onChange={event => { setPurpose(event.target.value); setError(""); }} placeholder="O que vocês querem cultivar juntos?" className="ui-field" aria-invalid={!!error && !purpose.trim()} aria-describedby={error ? "purpose-error" : undefined} /></div>
    </div>
    <div className="wizard-suggestion"><p><Lightbulb size={16} aria-hidden="true" /><span>Sugestão para este tipo de Núcleo: {suggestion}</span></p><button type="button" onClick={() => { setPurpose(suggestion); setError(""); }} className="ui-text-link">Usar sugestão</button></div>
    {error && <p id="purpose-error" role="alert" className="ui-feedback mt-4">{error}</p>}
    <div className="wizard-actions"><p>Esta etapa é uma prévia. Seus textos ainda não serão salvos.</p><button type="submit" className="ui-button">Continuar<ArrowRight size={16} aria-hidden="true" /></button></div>
  </form>;
}
