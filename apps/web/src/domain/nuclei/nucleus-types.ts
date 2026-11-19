// Catálogo único para a escolha e as próximas etapas; o tipo não define permissões.
export const nucleusTypes = [
  { id: "casal", label: "Casal", description: "Construir um relacionamento presente e carinhoso." },
  { id: "familia", label: "Família", description: "União, respeito e apoio mútuo no dia a dia." },
  { id: "irmaos", label: "Irmãos", description: "Fortalecer os laços ao longo da vida." },
  { id: "pais", label: "Pais e Filhos", description: "Convivência saudável e diálogo aberto." },
  { id: "amigos", label: "Amigos", description: "Manter a amizade sempre viva e presente." },
  { id: "equipes", label: "Equipes", description: "Cultivar cooperação e cuidado no trabalho." },
  { id: "comunidades", label: "Comunidades", description: "Construir pertencimento e apoio coletivo." },
  { id: "mentorias", label: "Mentorias", description: "Aprender e crescer com escuta e orientação." },
  { id: "grupos-religiosos", label: "Grupos Religiosos", description: "Fortalecer a convivência e o cuidado na comunidade." },
] as const;

export type NucleusTypeId = (typeof nucleusTypes)[number]["id"];

export function findNucleusType(value: string | string[] | undefined) {
  // Parâmetros da URL são entrada externa; valores repetidos ou desconhecidos não avançam.
  return typeof value === "string" ? nucleusTypes.find(type => type.id === value) : undefined;
}
