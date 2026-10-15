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
  }} className="mt-4 grid gap-4" aria-busy={pending}>
    <fieldset hidden={reviewing} className={reviewing ? "hidden" : "grid gap-4"}>
    <legend className="sr-only">Termos da proposta</legend>
    <label className="grid gap-1.5 text-sm font-semibold text-forest">Categoria
      <select name="category" required value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value as "habit" | "experience")} className="min-h-11 rounded-xl border border-line bg-white px-3 text-forest">
        <option value="habit">Hábito</option><option value="experience">Experiência</option>
      </select>
    </label>
    <label className="grid gap-1.5 text-sm font-semibold text-forest">O que vamos fazer?
      <input ref={titleInput} name="title" required maxLength={100} value={terms.title} onChange={(event) => setTerms({ ...terms, title: event.target.value })} className="min-h-11 rounded-xl border border-line px-3" />
    </label>
    <label className="grid gap-1.5 text-sm font-semibold text-forest">Como será?
      <textarea name="description" required maxLength={500} rows={3} value={terms.description} onChange={(event) => setTerms({ ...terms, description: event.target.value })} className="rounded-xl border border-line p-3" />
    </label>
    <label className="grid gap-1.5 text-sm font-semibold text-forest">Quando?
      <input name="timing" required maxLength={120} value={terms.timing} onChange={(event) => setTerms({ ...terms, timing: event.target.value })} placeholder="Ex.: depois do jantar" className="min-h-11 rounded-xl border border-line px-3" />
    </label>
    <label className="grid gap-1.5 text-sm font-semibold text-forest">Com que frequência?
      <input name="frequency" required maxLength={120} value={terms.frequency} onChange={(event) => setTerms({ ...terms, frequency: event.target.value })} placeholder="Ex.: uma vez por semana ou uma vez" className="min-h-11 rounded-xl border border-line px-3" />
    </label>
    {selectedCategory === "habit" && <>
      <label className="grid gap-1.5 text-sm font-semibold text-forest">Duração do teste (dias)
        <input name="trialDays" type="number" min={7} max={30} step={1} required value={terms.trialDays} onChange={(event) => setTerms({ ...terms, trialDays: event.target.value })} aria-describedby="trial-rule" className="min-h-11 rounded-xl border border-line px-3" />
      </label>
      <p id="trial-rule" className="text-sm leading-7 text-muted">Escolha de 7 a 30 dias. Um administrador inicia e conclui o teste. Cada pessoa decide se participa.</p>
      <HabitConsentGuidance />
    </>}
    </fieldset>
    {reviewing && <section aria-labelledby="proposal-review-heading" className="rounded-2xl border border-line bg-[#fbfaf7] p-4">
      <h3 ref={reviewHeading} id="proposal-review-heading" tabIndex={-1} className="font-display text-xl">Confira antes de propor</h3>
      <dl className="mt-3 grid gap-3 break-words text-sm text-muted">
        {[["Categoria", selectedCategory === "habit" ? "Hábito" : "Experiência"], ["O que vamos fazer?", terms.title], ["Como será?", terms.description], ["Quando?", terms.timing], ["Com que frequência?", terms.frequency], ...(selectedCategory === "habit" ? [["Duração do teste", `${terms.trialDays} dias`]] : [])].map(([label, value]) => <div key={label}><dt className="font-semibold text-forest">{label}</dt><dd className="mt-1 whitespace-pre-wrap">{value.trim()}</dd></div>)}
      </dl>
      <p className="mt-4 text-sm leading-7 text-muted">Ao enviar, você cria uma proposta. Depois, escolha explicitamente se aceita participar; nenhuma pessoa é incluída automaticamente.</p>
      <p className="mt-2 text-sm leading-7 text-muted">{selectedCategory === "habit" ? "Um administrador organiza o teste e a ativação. Recusar afeta somente a sua participação." : "Administradores organizam a proposta. Cada pessoa decide se participa."}</p>
      {selectedCategory === "habit" && <HabitConsentGuidance />}
      <button type="button" disabled={pending} onClick={() => {
        setReviewing(false);
        requestAnimationFrame(() => titleInput.current?.focus());
      }} className="mt-3 min-h-11 text-sm font-semibold text-leaf underline disabled:opacity-60">Editar proposta</button>
    </section>}
    {/* Campos controlados preservam os termos quando a ação retorna erro sem redirecionar. */}
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    <button disabled={pending} className="continue-button min-h-11 rounded-xl bg-forest px-5 text-sm font-semibold text-white disabled:opacity-60">
      {pending ? "Enviando proposta..." : reviewing ? "Enviar proposta" : "Conferir proposta"}
    </button>
  </form>;
}
