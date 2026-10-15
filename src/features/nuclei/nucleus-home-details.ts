import { findNucleusType } from "./nucleus-types";
import { routes } from "@/shared/routes";

export function getNucleusHomeDetails(type: string, role: string, id: string) {
  return {
    typeLabel: findNucleusType(type)?.label ?? "Núcleo",
    participation: role === "admin" ? "Você administra este Núcleo" : "Você faz parte deste Núcleo",
    invitationHref: role === "admin" ? `${routes.initialInvitation}/${encodeURIComponent(id)}` : null,
  };
}
