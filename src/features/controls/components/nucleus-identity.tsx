import { Pencil } from "lucide-react";
import { updateNucleusIdentity } from "../actions";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { ControlActionForm } from "./action-form";

export function NucleusIdentity({ id, name, purpose, isAdmin }: { id: string; name: string; purpose: string; isAdmin: boolean }) {
  const edit = (field: "name" | "purpose", value: string) => {
    const label = field === "name" ? "nome" : "propósito";
    return <ActionDialog variant="text" className="nucleus-edit-trigger" title={`Editar ${label} do Núcleo`} trigger={<><Pencil size={17} aria-hidden="true" /><span className="sr-only">Editar {label} do Núcleo</span></>}>
      <ControlActionForm action={updateNucleusIdentity.bind(null, id, field)} label={`Salvar ${label}`} pendingLabel="Salvando…" confirmation={`Confirmo a alteração do ${label} compartilhado.`}>
        <div className="ui-field"><label htmlFor={`nucleus-${id}-${field}`}>{field === "name" ? "Nome" : "Propósito"} do Núcleo</label>{field === "name" ? <input id={`nucleus-${id}-${field}`} name="name" required maxLength={80} defaultValue={value} /> : <textarea id={`nucleus-${id}-${field}`} name="purpose" required maxLength={500} defaultValue={value} rows={4} />}</div>
      </ControlActionForm>
    </ActionDialog>;
  };
  return <><div className="nucleus-identity-line"><h1 className="ui-title">{name}</h1>{isAdmin && edit("name", name)}</div><div className="nucleus-identity-line nucleus-purpose-line"><p className="ui-copy">{purpose}</p>{isAdmin && edit("purpose", purpose)}</div></>;
}
