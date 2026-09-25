import { redirect } from "next/navigation";
import { routes } from "@/shared/routes";

// Mantém a URL raiz curta e direciona a entrada para o primeiro passo do fluxo.
export default function Page() { redirect(routes.start); }
