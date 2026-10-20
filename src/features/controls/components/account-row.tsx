import { ChevronRight, type LucideIcon } from "lucide-react";

// Conteúdo compartilhado por links e gatilhos de diálogo; a navegação permanece no elemento externo.
export function AccountRow({ title, description, icon: Icon }: { title: string; description: string; icon: LucideIcon }) {
  return <span className="account-row"><span className="account-row-icon"><Icon size={18} strokeWidth={1.5} aria-hidden="true" /></span><span><strong>{title}</strong><small>{description}</small></span><ChevronRight size={15} aria-hidden="true" /></span>;
}
