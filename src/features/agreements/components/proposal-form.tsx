"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createAgreementProposal, type AgreementActionState } from "@/features/agreements/actions";
import { HabitConsentGuidance } from "./habit-consent-guidance";

const initialState: AgreementActionState = { error: "" };

export function ProposalForm({ nucleusId, category }: { nucleusId: string; category: "habit" | "experience" }) {
  const [state, action, pending] = useActionState(createAgreementProposal.bind(null, nucleusId), initialState);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [terms, setTerms] = useState({ title: "", description: "", timing: "", frequency: "", trialDays: "" });
  const [reviewing, setReviewing] = useState(false);
  const reviewHeading = useRef<HTMLHeadingElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (reviewing) reviewHeading.current?.focus();
  }, [reviewing]);
  return <form action={action} onSubmit={(event) => {
    // Conferir é local: a Server Action só recebe os termos após o envio explícito.
    if (!reviewing) { event.preventDefault(); setReviewing(true); }
  }} className="agreement-form" aria-busy={pending}>
    <fieldset hidden={reviewing} className="agreement-form-fields" disabled={pending}>
    <legend className="sr-only">Termos da proposta</legend>
    <label className="ui-field">Categoria
      <select name="category" required value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value as "habit" | "experience")} className="agreement-input">
        <option value="habit">Hábito</option><option value="experience">Experiência</option>
      </select>
    </label>
    <label className="ui-field">O que vamos fazer?
      <input ref={titleInput} name="title" required maxLength={100} value={terms.title} onChange={(event) => setTerms({ ...terms, title: event.target.value })} className="agreement-input" />
    </label>
    <label className="ui-field">Como será?
      <textarea name="description" required maxLength={500} rows={3} value={terms.description} onChange={(event) => setTerms({ ...terms, description: event.target.value })} className="agreement-input" />
    </label>
    <label className="ui-field">Quando?
      <input name="timing" required maxLength={120} value={terms.timing} onChange={(event) => setTerms({ ...terms, timing: event.target.value })} placeholder="Ex.: depois do jantar" className="agreement-input" />
    </label>
    <label className="ui-field">Com que frequência?
      <input name="frequency" required maxLength={120} value={terms.frequency} onChange={(event) => setTerms({ ...terms, frequency: event.target.value })} placeholder="Ex.: uma vez por semana ou uma vez" className="agreement-input" />
    </label>
    {selectedCategory === "habit" && <>
      <label className="ui-field">Duração do teste (dias)
        <input name="trialDays" type="number" min={7} max={30} step={1} required value={terms.trialDays} onChange={(event) => setTerms({ ...terms, trialDays: event.target.value })} aria-describedby="trial-rule" className="agreement-input" />
      </label>
      <p id="trial-rule" className="ui-copy">Escolha de 7 a 30 dias. Um administrador inicia e conclui o teste. Cada pessoa decide se participa.</p>
      <HabitConsentGuidance />
    </>}
    </fieldset>
    {reviewing && <section aria-labelledby="proposal-review-heading" className="agreement-review">
      <h3 ref={reviewHeading} id="proposal-review-heading" tabIndex={-1} className="agreement-section-title">Confira antes de propor</h3>
      <dl className="agreement-facts">
        {[["Categoria", selectedCategory === "habit" ? "Hábito" : "Experiência"], ["O que vamos fazer?", terms.title], ["Como será?", terms.description], ["Quando?", terms.timing], ["Com que frequência?", terms.frequency], ...(selectedCategory === "habit" ? [["Duração do teste", `${terms.trialDays} dias`]] : [])].map(([label, value]) => <div key={label}><dt className="agreement-fact-label">{label}</dt><dd className="agreement-description">{value.trim()}</dd></div>)}
      </dl>
      <p className="ui-copy">Ao enviar, você cria uma proposta. Depois, escolha explicitamente se aceita participar; nenhuma pessoa é incluída automaticamente.</p>
      <p className="ui-copy">{selectedCategory === "habit" ? "Um administrador organiza o teste e a ativação. Recusar afeta somente a sua participação." : "Administradores organizam a proposta. Cada pessoa decide se participa."}</p>
      {selectedCategory === "habit" && <HabitConsentGuidance />}
      <button type="button" disabled={pending} onClick={() => {
        setReviewing(false);
        requestAnimationFrame(() => titleInput.current?.focus());
      }} className="ui-button-secondary">Editar proposta</button>
    </section>}
    {/* Campos controlados preservam os termos quando a ação retorna erro sem redirecionar. */}
    {state.error && <p role="alert" className="agreement-error">{state.error}</p>}
    <button disabled={pending} className="ui-button">
      {pending ? "Enviando proposta..." : reviewing ? "Enviar proposta" : "Conferir proposta"}
    </button>
  </form>;
}
