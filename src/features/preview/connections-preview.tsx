"use client";

import { useState } from "react";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { CalendarDays, Compass, Heart, ShieldCheck, Sparkles, Users } from "lucide-react";

const people = [
  { name: "Ana", initials: "AN", tone: "rose", about: "Gosto de dias tranquilos, de cozinhar com companhia e de conversas que não precisam ter uma conclusão.", care: "Uma mensagem no meio do dia. Companhia sem precisar preencher o silêncio.", likes: ["Café passado", "Caminhadas", "Cozinhar junto"], wish: "Aprender uma receita nova a quatro mãos.", date: "Um aniversário em novembro · data fictícia" },
  { name: "Lucas", initials: "LU", tone: "blue", about: "Me sinto perto quando encontro tempo para estar presente. Música e pequenos passeios costumam abrir boas conversas.", care: "Um convite com antecedência e liberdade para dizer como estou me sentindo.", likes: ["Música ao vivo", "Passeios", "Cinema em casa"], wish: "Conhecer um lugar novo, sem roteiro apertado.", date: "Um aniversário em março · data fictícia" },
  { name: "Bia", initials: "BI", tone: "green", about: "Guardo carinho por histórias, plantas e encontros ao redor da mesa. Gosto de escutar como foi o dia de quem está perto.", care: "Escuta com tempo. Lembrar de um detalhe que compartilhei.", likes: ["Livros", "Plantas", "Histórias de família"], wish: "Organizar uma tarde de histórias e fotografias.", date: "Um aniversário em agosto · data fictícia" },
];
const topics = [
  { key: "care", label: "Pistas de cuidado", icon: Heart },
  { key: "likes", label: "Gostos e afinidades", icon: Compass },
  { key: "wish", label: "Desejos", icon: Sparkles },
] as const;

export function ConnectionsPreview({ kind }: { kind: "conexoes" | "perfis" }) {
  const [personIndex, setPersonIndex] = useState(0);
  const [topic, setTopic] = useState<(typeof topics)[number]["key"]>("care");
  const person = people[personIndex];
  return <div className="preview-people-layout">
    <section className="preview-people-main">
      <div className="preview-people-heading"><h2>{kind === "perfis" ? "Escolha um perfil de exemplo" : "Encontros começam na curiosidade"}</h2><p className="preview-example">Exemplo ilustrativo · todas as pessoas e informações são fictícias</p></div>
      <div className="preview-person-picker" aria-label="Pessoas fictícias">{people.map((item, index) => <button type="button" className={`preview-person-choice ${item.tone}`} key={item.name} aria-pressed={personIndex === index} onClick={() => setPersonIndex(index)}><span className="preview-avatar">{item.initials}</span><strong>{item.name}</strong><small>Perfil de exemplo</small></button>)}</div>
      <section className="ui-panel preview-profile-sheet preview-panel" aria-live="polite">
        <div className="preview-profile-title"><span className={`preview-avatar ${person.tone}`}>{person.initials}</span><div><p className="eyebrow">EXEMPLO ILUSTRATIVO</p><h2>Um pouco sobre {person.name}</h2></div><span className="color-icon preview-icon rose"><Heart aria-hidden="true" /></span></div>
        <p className="preview-profile-about">{person.about}</p><ActionDialog title={"Perfil de exemplo · "+person.name} trigger="Explorar perfil em detalhe" variant="secondary"><p className="prototype-notice">Esboço de funcionalidade · ainda não desenvolvido</p><p className="ui-copy mt-5">{person.about}</p><div className="ui-info mt-5">{person.care}</div><h3 className="mt-6">Gostos e afinidades</h3><p className="ui-copy">{person.likes.join(" · ")}</p><p className="ui-copy mt-5">Pessoa fictícia. Não há edição, visibilidade ou compartilhamento de perfil real.</p></ActionDialog>
        <div className="preview-topic-picker" aria-label="Temas do perfil">{topics.map((item) => <button type="button" key={item.key} aria-pressed={topic === item.key} onClick={() => setTopic(item.key)}><item.icon size={16} aria-hidden="true" />{item.label}</button>)}</div>
        <div className="preview-topic-content" aria-live="polite">{topic === "care" ? <><h3>Eu me sinto cuidado quando…</h3><p>{person.care}</p></> : topic === "likes" ? <><h3>Coisas que me fazem bem</h3><ul className="preview-affinities">{person.likes.map((like) => <li key={like}>{like}</li>)}</ul></> : <><h3>Uma vontade para compartilhar</h3><p>{person.wish}</p><small>Uma ideia, sem obrigação de realizar.</small></>}</div>
      </section>
    </section>
    <aside className="preview-side-stack">
      <section className="preview-purpose"><span className="color-icon preview-icon purple"><Users aria-hidden="true" /></span><p className="eyebrow">CONEXÕES COM LIBERDADE</p><h2>Conhecer é um convite.</h2><p>O perfil afetivo é uma possibilidade futura. Cada pessoa precisará escolher quais informações deseja compartilhar e com quem.</p></section>
      <section className="ui-panel preview-panel"><span className="color-icon preview-icon amber"><CalendarDays aria-hidden="true" /></span><h2>Datas com significado</h2><p>{person.date}.</p><p className="preview-fine-print">Exemplo ilustrativo. Não há lembretes ou notificações configurados.</p></section>
      <section className="preview-privacy"><ShieldCheck size={20} aria-hidden="true" /><p>Visibilidade, consentimento e edição do perfil ainda serão desenvolvidos. Esta prévia não consulta dados de perfis reais.</p></section>
    </aside>
  </div>;
}
