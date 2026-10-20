export type AgreementSummary = {
  id: string; title: string; description: string; timing: string; frequency: string; category: string; status: string;
};
export function filterAgreementCards<T extends AgreementSummary>(cards: T[], search: string, status: string): T[] {
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
  const term = normalize(search);
  return cards.filter(card => (status === "all" || card.status === status) &&
    normalize(`${card.title} ${card.description} ${card.timing} ${card.frequency}`).includes(term));
}
export function agreementColumn(card: AgreementSummary): "proposal" | "habit" | "experience" {
  // O estado operacional organiza propostas; a categoria antiga não comprova evolução individual.
  if (card.status === "pending") return "proposal";
  return card.category === "experience" ? "experience" : "habit";
}
