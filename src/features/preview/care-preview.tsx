"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookHeart, HandHeart, Heart, Leaf, MessageCircle, Pause, ShieldCheck, Users } from "lucide-react";

const principles = [
  { title: "Escutar com respeito", icon: MessageCircle, text: "Criar espaço para ouvir até o fim, sem transformar uma diferença em disputa. A escuta pode começar por uma pergunta simples: como isso foi para você?", tone: "blue" },
  { title: "Fazer espaço para cada pessoa", icon: Users, text: "Reconhecer jeitos, limites e tempos diferentes. Participar de um Núcleo não significa abrir mão das próprias escolhas.", tone: "purple" },
  { title: "Cultivar pequenos cuidados", icon: Heart, text: "Valorizar gestos possíveis na vida real. Um cuidado faz sentido quando respeita quem oferece e quem recebe.", tone: "rose" },
  { title: "Permitir que os combinados amadureçam", icon: Leaf, text: "Revisitar o que foi escolhido, conversar sobre o que mudou e dar espaço para rever uma participação com liberdade.", tone: "green" },
];

export function CarePreview({ kind, nucleusId }: { kind: "manifesto" | "cuidado"; nucleusId: string }) {
  const [draft, setDraft] = useState("");
  const [prepared, setPrepared] = useState(false);
  const [step, setStep] = useState("intencao");

  if (kind === "manifesto") return <div className="preview-manifesto-layout">
    <section className="preview-manifesto-cover"><span className="color-icon preview-icon amber"><BookHeart aria-hidden="true" /></span><p className="eyebrow">EXEMPLO ILUSTRATIVO · MANIFESTO</p><h2>Mais presença.<br />Mais espaço<br />para nós.</h2><p>Queremos um lugar onde cada pessoa possa ser quem é. Onde o cuidado seja uma escolha e as conversas tenham tempo para acontecer.</p><div className="preview-cover-footer"><Leaf size={22} aria-hidden="true" /><span>Um texto editorial para imaginar possibilidades.<br />Não representa um manifesto aprovado pelo Núcleo.</span></div></section>
    <section className="preview-manifesto-principles" aria-labelledby="principles-heading"><p className="eyebrow">PALAVRAS PARA CULTIVAR</p><h2 id="principles-heading">Uma intenção, muitos gestos.</h2><p>Explore os princípios deste exemplo. O processo de escrita e decisão conjunta ainda não foi desenvolvido.</p>
      {principles.map((principle, index) => <details className="ui-panel preview-principle" key={principle.title}><summary><span className={`color-icon preview-icon ${principle.tone}`}><principle.icon aria-hidden="true" /></span><span><small>0{index + 1}</small><strong>{principle.title}</strong></span><span className="preview-expand" aria-hidden="true">+</span></summary><p>{principle.text}</p></details>)}
      <p className="preview-fine-print">Exemplo ilustrativo. Sem edição compartilhada, aceite, versão ou publicação de manifesto.</p>
    </section>
  </div>;

  // O rascunho existe somente no estado deste componente: não há armazenamento, envio ou ação de servidor.
  return <div className="preview-conversation-layout">
    <aside className="preview-side-stack"><section className="preview-purpose"><span className="color-icon preview-icon rose"><HandHeart aria-hidden="true" /></span><p className="eyebrow">EXEMPLO ILUSTRATIVO</p><h2>Uma conversa com intenção.</h2><p>Um espaço para organizar o que você gostaria de dizer, sem tentar resolver tudo de uma vez.</p><div className="preview-soft-line"><Users size={20} aria-hidden="true" /><p>Quem participa escolhe estar presente. Não há convite ou envio nesta prévia.</p></div></section><div className="preview-privacy"><ShieldCheck size={21} aria-hidden="true" /><p>Seu texto fica apenas nesta tela. Ao sair ou recarregar, o rascunho é perdido.</p></div></aside>
    <section className="preview-conversation-paper"><p className="eyebrow">CARTÃO DE INTENÇÃO · CONCEITO</p><h2>Eu gostaria que a gente tivesse um tempo para se escutar.</h2><div className="preview-conversation-bubble">Quero conversar sobre como podemos estar mais presentes durante a semana.<small>Exemplo ilustrativo</small></div><div className="preview-conversation-bubble answer">Um espaço com respeito e liberdade para fazer uma pausa.<small>Exemplo ilustrativo</small></div>
      <label className="preview-draft-label" htmlFor="preview-care-draft">O que você quer expressar?<textarea id="preview-care-draft" maxLength={1200} rows={4} value={draft} onChange={(event) => { setDraft(event.target.value); setPrepared(false); }} placeholder="Uma intenção, com suas palavras…" aria-describedby="preview-care-note" /></label>
      <p id="preview-care-note" className="preview-fine-print">Rascunho temporário · {draft.length}/1200 caracteres · sem gravação.</p>
      <div className="preview-draft-actions"><button className="primary-action" type="button" onClick={() => setPrepared(!prepared)} aria-expanded={prepared} aria-controls="preview-preparation">{prepared ? "Fechar preparação" : "Explorar preparação"}<ArrowUpRight size={17} aria-hidden="true" /></button>{draft && <button className="secondary-action" type="button" onClick={() => { setDraft(""); setPrepared(false); }}>Limpar rascunho</button>}</div>
      {prepared && <section id="preview-preparation" className="preview-preparation" aria-label="Preparação ilustrativa"><p className="preview-example">Exemplo ilustrativo · nada foi enviado</p><div className="preview-topic-picker" aria-label="Etapas da preparação">{[{ key: "intencao", label: "Intenção" }, { key: "escuta", label: "Escuta" }, { key: "pausa", label: "Pausa" }].map((item) => <button type="button" key={item.key} onClick={() => setStep(item.key)} aria-pressed={step === item.key}>{item.label}</button>)}</div><div aria-live="polite">{step === "intencao" ? <><h3>Comece pelo que você sente.</h3><p className="preview-draft-text">{draft.trim() || "Eu gostaria de encontrar um tempo tranquilo para conversar."}</p></> : step === "escuta" ? <><h3>Uma pergunta para abrir espaço.</h3><p>Como você tem vivido isso? O que gostaria que eu entendesse melhor?</p></> : <><h3>Há liberdade para pausar.</h3><p>Podemos retomar em outro momento, quando houver disponibilidade de ambos.</p></>}</div></section>}
    </section>
    <aside className="preview-side-stack"><section className="ui-panel preview-panel"><span className="color-icon preview-icon blue"><MessageCircle aria-hidden="true" /></span><h2>Um tempo ao vivo</h2><p>A ideia é preparar uma conversa presencial. Chat, envio do cartão e acompanhamento não estão disponíveis.</p><Link href={`/nucleos/${nucleusId}/agenda`} className="preview-real-link">Abrir agenda existente <ArrowUpRight size={16} aria-hidden="true" /></Link></section><section className="ui-panel preview-panel"><span className="color-icon preview-icon purple"><Pause aria-hidden="true" /></span><h2>Depois da conversa</h2><p>Os próximos passos precisam ser escolhidos com liberdade pelas pessoas envolvidas. O cartão não cria um acordo.</p></section></aside>
  </div>;
}
