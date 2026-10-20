"use client";

import { useState } from "react";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { BookOpen, Camera, Heart, Leaf, Sprout, Sun, TreePine } from "lucide-react";

const roots = [
  { key: "proposito", label: "Propósito", icon: Sprout, title: "Mais presença. Mais espaço para nós.", text: "Uma intenção compartilhada poderia aparecer nas raízes desta árvore. Cada Núcleo teria suas próprias palavras." },
  { key: "gestos", label: "Pequenos gestos", icon: Heart, title: "Cada gesto encontra seu tempo.", text: "Uma forma de representar o cuidado cotidiano. Este desenho não mede atividade, evolução individual ou qualidade dos vínculos." },
  { key: "historias", label: "Histórias", icon: BookOpen, title: "O que vivemos também cria raízes.", text: "Memórias e marcos poderiam compor esta paisagem, sempre com regras de privacidade e escolhas de compartilhamento a definir." },
];
const memories = [
  { title: "O domingo no parque", type: "Encontros", icon: TreePine, tone: "green", date: "Um domingo de primavera", text: "A sombra de uma árvore, uma toalha na grama e tempo para conversar sem pressa. Às vezes, o simples fica.", caption: "Uma pausa no mundo. Um encontro entre nós." },
  { title: "Nossa primeira caminhada", type: "Pequenos gestos", icon: Sun, tone: "amber", date: "Uma manhã de descobertas", text: "Escolhemos um caminho diferente e encontramos uma conversa que ainda não tinha acontecido. Não havia destino urgente.", caption: "O caminho também pode ser um lugar de encontro." },
  { title: "Uma mesa e boas histórias", type: "Encontros", icon: Heart, tone: "rose", date: "Uma noite para lembrar", text: "Cada pessoa trouxe uma história. Entre pratos e risadas, descobrimos um pouco mais sobre quem estava à mesa.", caption: "Cabia mais do que o jantar naquela mesa." },
];

export function TreeMemoryPreview({ kind }: { kind: "arvore" | "memorias" }) {
  const [rootKey, setRootKey] = useState("proposito");
  const [filter, setFilter] = useState("Todas");
  const [selectedMemory, setSelectedMemory] = useState(0);
  const root = roots.find((item) => item.key === rootKey)!;
  const memory = memories[selectedMemory];

  if (kind === "arvore") return <div className="preview-garden-layout">
    <section className="preview-garden" aria-labelledby="tree-preview-heading">
      <p className="preview-example">Exemplo ilustrativo</p>
      <h2 id="tree-preview-heading" className="preview-sr-label">Uma árvore de possibilidades</h2>
      <div className="preview-tree-scene" role="img" aria-label="Árvore ilustrativa de copa verde e troncos entrelaçados; não indica progresso real">
        <svg viewBox="0 0 520 440" aria-hidden="true"><ellipse cx="260" cy="391" rx="185" ry="24" fill="#d8e5c8" />
          <path d="M224 390c23-56 39-99 25-166M276 390c-20-65-9-100 14-155" stroke="#9a7250" strokeWidth="24" fill="none" strokeLinecap="round" />
          <path d="M252 300c-43-35-72-61-83-99m97 82c38-28 61-50 69-84" stroke="#9a7250" strokeWidth="13" fill="none" strokeLinecap="round" />
          <ellipse cx="172" cy="190" rx="77" ry="82" fill="#6d944d" transform="rotate(-30 172 190)" />
          <ellipse cx="327" cy="181" rx="88" ry="83" fill="#86a95f" transform="rotate(24 327 181)" />
          <ellipse cx="243" cy="125" rx="87" ry="91" fill="#adc682" /><ellipse cx="271" cy="207" rx="79" ry="61" fill="#517844" />
          <path d="M212 135c12 7 24 19 29 35m94-29c-19 11-30 26-32 45m-133-7c13 4 25 12 33 22" fill="none" stroke="#dceac8" strokeWidth="3" strokeLinecap="round" opacity=".65" />
          <circle cx="202" cy="223" r="7" fill="#d8a356" /><circle cx="304" cy="105" r="6" fill="#e2c26d" /><circle cx="336" cy="215" r="6" fill="#d89885" />
          <path d="m84 340 7-17 7 17m315 8 7-20 7 20" fill="none" stroke="#8ba66d" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p>Cada gesto encontra seu tempo.</p>
      </div>
      <div className="preview-tree-legend" aria-label="Explorar os significados da árvore">{roots.map((item) => <button type="button" key={item.key} onClick={() => setRootKey(item.key)} aria-pressed={item.key === rootKey}><item.icon size={17} aria-hidden="true" />{item.label}</button>)}</div>
    </section>
    <aside className="preview-side-stack">
      <section className="preview-purpose" aria-live="polite"><span className="color-icon preview-icon green"><root.icon aria-hidden="true" /></span><p className="eyebrow">EXEMPLO ILUSTRATIVO · {root.label.toLocaleUpperCase("pt-BR")}</p><h2>{root.title}</h2><p>{root.text}</p></section>
      <section className="ui-panel preview-panel"><span className="color-icon preview-icon amber"><Leaf aria-hidden="true" /></span><h2>Sem pressa para florescer</h2><p>A árvore é uma metáfora visual. Os critérios de representação ainda serão definidos; não há pontuação nem crescimento calculado.</p></section>
    </aside>
  </div>;

  return <>
    <div className="preview-filter-bar" aria-label="Filtrar exemplos de memórias">{["Todas", "Encontros", "Pequenos gestos"].map((item) => <button type="button" key={item} aria-pressed={filter === item} onClick={() => {
      setFilter(item);
      // O detalhe acompanha o filtro para não manter selecionado um cartão que deixou de aparecer.
      if (item !== "Todas" && memories[selectedMemory].type !== item) setSelectedMemory(memories.findIndex((entry) => entry.type === item));
    }}>{item}</button>)}<span><Camera size={15} aria-hidden="true" /> Sem fotos ou memórias reais</span></div>
    <div className="preview-memory-layout"><div className="preview-memory-grid">
      {memories.map((item, index) => (filter === "Todas" || item.type === filter) && <button type="button" className={`preview-memory-card ${item.tone}`} key={item.title} aria-pressed={selectedMemory === index} onClick={() => setSelectedMemory(index)}>
        <div className="preview-memory-art"><item.icon size={52} strokeWidth={1.3} aria-hidden="true" /><span>Exemplo ilustrativo</span></div>
        <div className="preview-memory-copy"><p className="eyebrow">{item.type}</p><h2>{item.title}</h2><p>{item.date}</p><span>Explorar este exemplo →</span></div>
      </button>)}
    </div><section className="ui-panel preview-memory-detail preview-panel" aria-live="polite" aria-atomic="true"><span className={`color-icon preview-icon ${memory.tone}`}><memory.icon aria-hidden="true" /></span><p className="preview-example">Exemplo ilustrativo · texto editorial</p><h2>{memory.title}</h2><p>{memory.text}</p><blockquote>“{memory.caption}”</blockquote><ActionDialog title={memory.title} trigger="Abrir detalhe da memória" variant="secondary"><p className="prototype-notice">Esboço de funcionalidade · ainda não desenvolvido</p><p className="ui-copy mt-5">{memory.text}</p><blockquote className="ui-info mt-5">{memory.caption}</blockquote><p className="ui-copy mt-5">Exemplo editorial. Não há foto, memória real, upload ou compartilhamento.</p></ActionDialog><p className="preview-fine-print">Nenhuma memória foi criada. Upload, autoria, consentimento e visibilidade ainda precisam ser desenvolvidos.</p></section></div>
  </>;
}
