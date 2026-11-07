import { ShieldCheck } from "lucide-react";

export function NucleusRoleBadge({ isAdmin }: { isAdmin: boolean }) {
  return <span className={"ui-badge nucleus-role-badge" + (isAdmin ? "" : " nucleus-role-badge-member")}>
    {isAdmin && <ShieldCheck size={16} aria-hidden="true" />}
    <strong>{isAdmin ? "Você administra este Núcleo." : "Você faz parte deste Núcleo."}</strong>
  </span>;
}
