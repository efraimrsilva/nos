export type ProblemReportInput = { description: string; steps: string; route: string };

// Contexto técnico é limitado às rotas conhecidas: nunca enviar query/hash,
// códigos de convite, nomes de Núcleos ou identificadores pessoais por engano.
export function reportRoute(value: unknown): string {
  if (typeof value !== "string" || value.length > 500) return "/";
  const path = value.split(/[?#]/, 1)[0];
  if (!/^\/(?:conta|nucleos|comecar|configuracoes|ajuda)(?:\/|$)/.test(path)) return "/";
  const known = new Set(["", "conta", "nucleos", "comecar", "configuracoes", "ajuda", "acordos", "agenda", "arvore", "conexoes", "manifesto", "memorias", "perfis", "cuidado", "convites", "pessoas", "sair", "novo", "registrar", "confirmar", "revisar", "proposito", "tipo", "convite", "convite-inicial", "privacidade", "nova-senha", "confirmar-email", "recuperar"]);
  return path.split("/").map((part, index, parts) => {
    if ((index === 2 && parts[1] === "nucleos") || (index === 4 && parts[3] === "acordos") || parts[index - 1] === "convite-inicial") return "[id]";
    return known.has(part) ? part : "[item]";
  }).join("/");
}

export function parseProblemReport(form: FormData): ProblemReportInput | null {
  const description = form.get("description"), steps = form.get("steps");
  if (typeof description !== "string" || (steps !== null && typeof steps !== "string")) return null;
  const text = description.trim(), reproduction = (steps ?? "").trim();
  if (text.length < 10 || text.length > 2000 || reproduction.length > 1000) return null;
  return { description: text, steps: reproduction, route: reportRoute(form.get("route")) };
}
