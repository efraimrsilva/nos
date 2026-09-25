import Form from "next/form";
import { ArrowRight, Heart, House, UsersRound, HandHeart, Smile, BriefcaseBusiness, Network, Sprout, Church, type LucideIcon } from "lucide-react";
import { nucleusTypes, type NucleusTypeId } from "@/features/nuclei/nucleus-types";
import { routes } from "@/shared/routes";

const typeIcons: Record<NucleusTypeId, LucideIcon> = {
  casal: Heart, familia: House, irmaos: UsersRound, pais: HandHeart, amigos: Smile,
  equipes: BriefcaseBusiness, comunidades: Network, mentorias: Sprout, "grupos-religiosos": Church,
};

export function NucleusTypeForm({ selectedType }: { selectedType?: NucleusTypeId }) {
  return (
    // Apenas o identificador do catálogo segue na URL; nome e propósito futuros exigem outro contrato.
    <Form action={routes.nucleusPurpose} className="mt-6" key={selectedType ?? "unselected"}>
      <fieldset aria-describedby="type-help">
        <legend className="sr-only">Tipo de Núcleo</legend>
        <div className="grid gap-3">
          {nucleusTypes.map(type => {
            const Icon = typeIcons[type.id];
            return (
              <label key={type.id} className={`type-option type-${type.id}`}>
                <span className="type-icon"><Icon size={23} strokeWidth={1.8} aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">
                  <span id={`label-${type.id}`} className="block font-display text-lg font-medium">{type.label}</span>
                  <span id={`description-${type.id}`} className="mt-1 block text-xs leading-5 text-muted">{type.description}</span>
                </span>
                {/* Radios nativos oferecem seleção única e navegação por setas sem estado duplicado. */}
                <input type="radio" name="tipo" value={type.id} defaultChecked={selectedType === type.id} required aria-labelledby={`label-${type.id}`} aria-describedby={`description-${type.id}`} className="h-5 w-5 shrink-0 accent-leaf" />
              </label>
            );
          })}
        </div>
      </fieldset>
      <p id="type-help" className="mt-4 text-xs leading-6 text-muted">Escolha o tipo que melhor representa este vínculo para continuar.</p>
      <button type="submit" className="continue-button mt-4 flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl bg-forest px-5 py-3 text-sm font-semibold text-white">Continuar<ArrowRight size={18} aria-hidden="true" /></button>
    </Form>
  );
}
