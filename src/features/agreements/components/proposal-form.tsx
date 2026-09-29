"use client";

import { useActionState } from "react";
import { createAgreementProposal, type AgreementActionState } from "@/features/agreements/actions";

const initialState: AgreementActionState = { error: "" };

export function ProposalForm({ nucleusId, category }: { nucleusId: string; category: "habit" | "experience" }) {
  const [state, action, pending] = useActionState(createAgreementProposal.bind(null, nucleusId), initialState);
  return <form action={action} className="mt-4 grid gap-4">
    <label className="grid gap-1.5 text-sm font-semibold text-forest">Categoria
      <select key={category} name="category" required defaultValue={category} className="min-h-11 rounded-xl border border-line bg-white px-3 text-forest">
        <option value="habit">Hábito</option><option value="experience">Experiência</option>
      </select>
    </label>
    <label className="grid gap-1.5 text-sm font-semibold text-forest">O que vamos fazer?
      <input name="title" required maxLength={100} className="min-h-11 rounded-xl border border-line px-3" />
    </label>
    <label className="grid gap-1.5 text-sm font-semibold text-forest">Como será?
      <textarea name="description" required maxLength={500} rows={3} className="rounded-xl border border-line p-3" />
    </label>
    <label className="grid gap-1.5 text-sm font-semibold text-forest">Quando?
      <input name="timing" required maxLength={120} placeholder="Ex.: depois do jantar" className="min-h-11 rounded-xl border border-line px-3" />
    </label>
    <label className="grid gap-1.5 text-sm font-semibold text-forest">Com que frequência?
      <input name="frequency" required maxLength={120} placeholder="Ex.: uma vez por semana ou uma vez" className="min-h-11 rounded-xl border border-line px-3" />
    </label>
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    <button disabled={pending} className="continue-button min-h-11 rounded-xl bg-forest px-5 text-sm font-semibold text-white disabled:opacity-60">
      {pending ? "Enviando proposta..." : "Enviar para aprovação"}
    </button>
  </form>;
}
