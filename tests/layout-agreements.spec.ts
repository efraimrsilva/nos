import { expect, test } from "@playwright/test";
import { filterAgreementCards, agreementColumn } from "@/features/agreements/components/agreement-presentation";

const cards = [
  { id: "one", title: "Café em família", description: "Escutar com calma", timing: "Após o jantar", frequency: "Semanal", category: "habit", status: "pending" },
  { id: "two", title: "Passear", description: "Caminhar juntos", timing: "Domingo", frequency: "Uma vez", category: "experience", status: "active" },
  { id: "three", title: "Cuidar", description: "Pausa", timing: "À tarde", frequency: "Diária", category: "habit", status: "ended" },
];

test("busca nos acordos considera acentos, termos e estado na página recebida", () => {
  expect(filterAgreementCards(cards, "  cafe  ", "all").map(card => card.id)).toEqual(["one"]);
  expect(filterAgreementCards(cards, "jantar", "pending").map(card => card.id)).toEqual(["one"]);
  expect(filterAgreementCards(cards, "", "active").map(card => card.id)).toEqual(["two"]);
  expect(filterAgreementCards(cards, "inexistente", "all")).toEqual([]);
});

test("quadro distingue propostas pendentes de categorias atuais sem promover pessoas", () => {
  expect(agreementColumn(cards[0])).toBe("proposal");
  expect(agreementColumn({ ...cards[0], category: "experience" })).toBe("proposal");
  expect(agreementColumn(cards[1])).toBe("experience");
  expect(agreementColumn(cards[2])).toBe("habit");
});
