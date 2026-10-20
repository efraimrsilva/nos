"use client";

import Link from "next/link";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { FlaskConical } from "lucide-react";
import { TreeMemoryPreview } from "./tree-memory-preview";
import { ConnectionsPreview } from "./connections-preview";
import { CarePreview } from "./care-preview";
import "./preview.css";

export type PreviewKind = "arvore" | "memorias" | "conexoes" | "perfis" | "manifesto" | "cuidado";

const sections: Record<PreviewKind, { label: string; eyebrow: string; title: string; description: string }> = {
  arvore: { label: "Nossa árvore", eyebrow: "NOSSA ÁRVORE / EXPLORAÇÃO", title: "Raízes no que vivemos.", description: "Um estudo visual sobre os gestos e as histórias que aproximam." },
  memorias: { label: "Memórias", eyebrow: "MEMÓRIAS / EXPLORAÇÃO", title: "Há instantes que ficam.", description: "Uma ideia de espaço para reencontrar pequenas histórias, no tempo de vocês." },
  conexoes: { label: "Conexões", eyebrow: "CONEXÕES / EXPLORAÇÃO", title: "Conhecer para cuidar.", description: "Pequenas pistas sobre o que aproxima. Sem comparar ou pontuar pessoas." },
  perfis: { label: "Perfis afetivos", eyebrow: "PERFIS AFETIVOS / EXPLORAÇÃO", title: "Um jeito único de estar no Nós.", description: "Um conceito de perfil que respeita o que cada pessoa escolhe compartilhar." },
  manifesto: { label: "Nosso manifesto", eyebrow: "MANIFESTO / EXPLORAÇÃO", title: "O que escolhemos cultivar.", description: "Palavras que poderiam traduzir a intenção de um Núcleo." },
  cuidado: { label: "Ponte do Nós", eyebrow: "PONTE DO NÓS / EXPLORAÇÃO", title: "Conversar também é um cuidado.", description: "Uma proposta de preparação para conversas presenciais, com espaço para escutar." },
};

export function FuturePreview({ kind, nucleusId }: { kind: PreviewKind; nucleusId: string }) {
  const section = sections[kind];
  return <div className="future-preview">
    <div className="prototype-notice preview-notice" role="note">
      <FlaskConical size={23} aria-hidden="true" />
      <div><strong>Esboço de funcionalidade · ainda não desenvolvido</strong><p>Exemplos ilustrativos. As interações só mudam esta prévia; nada é salvo, enviado ou publicado.</p></div>
    </div>
    <header className="preview-page-heading"><p className="eyebrow">{section.eyebrow}</p><h1 className="ui-title">{section.title}</h1><p>{section.description}</p></header>
    <ActionDialog title={"Sobre "+section.label} trigger="O que está previsto nesta área?" variant="text"><p className="prototype-notice">Esboço de funcionalidade · ainda não desenvolvido</p><p className="ui-copy mt-5">{section.description}</p><p className="ui-copy mt-5">Os exemplos são ilustrativos. Regras de consentimento, privacidade e persistência ainda serão definidas. Nada é salvo, enviado ou publicado por esta prévia.</p></ActionDialog><nav className="preview-section-nav" aria-label="Explorações de funcionalidades futuras">
      {(Object.keys(sections) as PreviewKind[]).map((key) => <Link key={key} href={`/nucleos/${nucleusId}/${key}`} aria-current={key === kind ? "page" : undefined}>{sections[key].label}</Link>)}
    </nav>
    {(kind === "arvore" || kind === "memorias") && <TreeMemoryPreview key={kind} kind={kind} />}
    {(kind === "conexoes" || kind === "perfis") && <ConnectionsPreview key={kind} kind={kind} />}
    {(kind === "manifesto" || kind === "cuidado") && <CarePreview key={kind} kind={kind} nucleusId={nucleusId} />}
  </div>;
}
