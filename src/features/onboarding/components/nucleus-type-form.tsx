import Form from "next/form";
import { ArrowRight, Heart, House, UsersRound, HandHeart, Smile, BriefcaseBusiness, Network, Sprout, Church, type LucideIcon } from "lucide-react";
import { nucleusTypes, type NucleusTypeId } from "@/features/nuclei/nucleus-types";
import { routes } from "@/shared/routes";

const typeIcons: Record<NucleusTypeId, LucideIcon> = {
  casal: Heart, familia: House, irmaos: UsersRound, pais: HandHeart, amigos: Smile,
  equipes: BriefcaseBusiness, comunidades: Network, mentorias: Sprout, "grupos-religiosos": Church,
};

export function NucleusTypeForm({ selectedType }: { selectedType?: NucleusTypeId }) {
  // Só o identificador do catálogo segue na URL; nome e propósito ficam no formulário seguinte.
  return <Form action={routes.nucleusPurpose} className="ui-panel wizard-panel" key={selectedType ?? "unselected"}>
    <fieldset aria-describedby="type-help"><legend className="sr-only">Tipo de Núcleo</legend><div className="wizard-types">
      {nucleusTypes.map(type => {
        const Icon = typeIcons[type.id];
        return <label key={type.id} className="wizard-type"><Icon size={19} aria-hidden="true" /><span><strong id={`label-${type.id}`}>{type.label}</strong><small id={`description-${type.id}`}>{type.description}</small></span>
          {/* Radios nativos mantêm seleção única e navegação por setas. */}
          <input type="radio" name="tipo" value={type.id} defaultChecked={selectedType === type.id} required aria-labelledby={`label-${type.id}`} aria-describedby={`description-${type.id}`} />
        </label>;
      })}
    </div></fieldset>
    <div className="wizard-actions"><p id="type-help">Escolha o tipo que melhor representa este vínculo para continuar. O tipo não altera permissões ou o acesso ao Núcleo.</p><button type="submit" className="ui-button">Continuar<ArrowRight size={16} aria-hidden="true" /></button></div>
  </Form>;
}
