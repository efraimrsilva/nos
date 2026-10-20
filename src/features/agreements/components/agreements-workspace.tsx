"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { ArrowRight, BookOpen, Columns3, Search, Settings2 } from "lucide-react";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { agreementColumn, filterAgreementCards, type AgreementSummary } from "./agreement-presentation";
import "../agreements-layout.css";

type Card = AgreementSummary & { revision?: string; content: ReactNode; detail: ReactNode; context: ReactNode; statusLabel: string; participationLabel: string };

// Uma única apresentação monta os formulários: evita IDs repetidos e ações duplicadas.
function subscribeViewport(onChange: () => void) {
  const media = window.matchMedia("(min-width: 701px)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
const desktopViewport = () => window.matchMedia("(min-width: 701px)").matches;
const serverViewport = () => false;
const columns = [
  { key: "proposal", label: "Propostas", description: "Apresente a prática e seus termos. Cada pessoa escolhe se deseja participar." },
  { key: "habit", label: "Hábitos", description: "Práticas do Núcleo, com teste e participação nos termos combinados." },
  { key: "experience", label: "Experiências", description: "Acordos desta categoria. A passagem individual a partir do Hábito ainda é planejada." },
  { key: "essence", label: "Essência", description: "Reconhecimento de uma prática consolidada. Critérios e consentimentos ainda a definir." },
] as const;

export function AgreementsWorkspace({ cards, header, categories, filters, initialStatus = "all", essenceOnly = false }: {
  cards: Card[]; header: ReactNode; categories: ReactNode; filters: ReactNode; initialStatus?: string; essenceOnly?: boolean;
}) {
  const [view, setView] = useState<"kanban" | "panels">("kanban");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>();
  const isDesktop = useSyncExternalStore(subscribeViewport, desktopViewport, serverViewport);
  const visible = filterAgreementCards(cards, search, initialStatus);
  const selected = visible.find(card => card.id === selectedId) ?? visible[0];

  return <section className="agreements-workspace" aria-label="Acordos do Núcleo">
    <div className="agreements-view-switch" role="group" aria-label="Visualização de Acordos">
      <span>Visualização</span>
      <button type="button" onClick={() => setView("kanban")} aria-pressed={view === "kanban"}><Columns3 size={17} aria-hidden="true" />Kanban · Fluxo</button>
      <button type="button" onClick={() => setView("panels")} aria-pressed={view === "panels"}><BookOpen size={17} aria-hidden="true" />Painéis · Lado a lado</button>
    </div>
    {header}
    <div className="agreements-toolbar">
      <label className="agreements-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Buscar nos acordos desta página</span><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar no Núcleo" /></label>
      {categories}
      <ActionDialog variant="secondary" title="Filtrar acordos" trigger={<><Settings2 size={16} aria-hidden="true" /><span className="sr-only">Opções de visualização</span></>} className="agreements-filter-trigger" description="O filtro de situação consulta os registros do Núcleo. A busca se aplica à página carregada.">{filters}</ActionDialog>
    </div>
    <p className="agreements-result-count" role="status">{visible.length} {visible.length === 1 ? "acordo nesta página" : "acordos nesta página"} · a busca considera os registros carregados.</p>
    {!visible.length && !essenceOnly && <p className="ui-empty">{cards.length ? "Nenhuma correspondência. Tente outra palavra ou limpe a busca." : "Nenhum acordo nesta página. Uma conversa pode começar uma nova proposta."}</p>}
    {!isDesktop && !essenceOnly && visible.length > 0 && <ol className="agreements-mobile-list" aria-label="Lista de acordos">
      {visible.map(card => <li key={card.revision ?? card.id}><ActionDialog title={card.title} description="Confira os termos e sua participação neste combinado." variant="card" size="wide" className={`agreement-mobile-row agreements-tone-${agreementColumn(card)}`} trigger={<>
        <span className="agreement-mobile-title"><b>{card.title}</b><small>{card.timing} · {card.frequency}</small></span>
        <span className="agreement-mobile-category">{card.status === "pending" ? "Proposta" : card.category === "habit" ? "Hábito" : "Experiência"}</span>
        <span className="agreement-mobile-status"><span className="agreement-category-badge">{card.statusLabel}</span></span>
        <span className="agreement-mobile-participation">{card.participationLabel}</span>
        <span className="agreement-mobile-arrow"><ArrowRight size={16} aria-hidden="true" /></span>
      </>}>{card.detail}</ActionDialog></li>)}
    </ol>}
    {!isDesktop && essenceOnly && <section className="agreements-mobile-future" aria-labelledby="mobile-essence-title"><span className="ui-badge">Esboço · em planejamento</span><h2 id="mobile-essence-title">Essência</h2><p>O reconhecimento de uma prática consolidada ainda depende de critérios e consentimentos. Esta etapa não está disponível e ninguém avança automaticamente.</p></section>}
    {isDesktop && (view === "kanban" || essenceOnly) && <div className="agreements-board" aria-label="Propostas e categorias atuais dos acordos">
      {columns.filter(column => !essenceOnly || column.key === "essence").map((column, index) => {
        const items = visible.filter(card => agreementColumn(card) === column.key);
        return <section key={column.key} className={`agreements-column agreements-tone-${column.key}`} aria-labelledby={`column-${column.key}`}>
          <header><span className="agreements-status-dot" aria-hidden="true" /><h2 id={`column-${column.key}`}>{column.label}</h2><span className="agreements-column-count">{column.key === "essence" ? "Planejado" : items.length}</span></header>
          <p className="agreements-column-description">{column.description}</p>
          {column.key === "essence" ? <div className="agreements-future"><span className="ui-badge">Esboço · em planejamento</span><h3>Cada prática tem seu tempo.</h3><p>Esta etapa ainda não está disponível. Nenhuma pessoa avança automaticamente.</p></div> : items.length ? <ol>{items.map(card => <li key={card.id}>{card.content}</li>)}</ol> : <p className="agreements-column-empty">Sem acordos nesta coluna.</p>}
          {/* As setas decorativas acompanham a altura da coluna, sem ocupar espaço na grade. */}
          {index < columns.length - 1 && !essenceOnly && (["top", "middle", "bottom"] as const).map(position => <ArrowRight key={position} className={`agreements-flow-arrow agreements-flow-arrow-${position}`} size={20} aria-hidden="true" />)}
        </section>;
      })}
    </div>}
    {isDesktop && view === "panels" && !essenceOnly && <div className="agreements-panels">
      <nav aria-label="Selecionar acordo" className="agreements-selection"><p className="ui-kicker">Seus combinados <span>{visible.length}</span></p>{visible.map(card => <button key={card.id} type="button" onClick={() => setSelectedId(card.id)} aria-pressed={selected?.id === card.id} aria-controls="selected-agreement"><span>{card.title}</span><small>{card.status === "pending" ? "Proposta" : card.category === "habit" ? "Hábito" : "Experiência"}</small></button>)}</nav>
      <section key={selected?.id ?? "empty"} id="selected-agreement" className="agreements-selected" aria-label="Acordo selecionado">{selected ? <><p className="ui-kicker">O combinado</p><h2>{selected.title}</h2>{selected.detail}</> : <p className="ui-empty">Ajuste os filtros para consultar um combinado.</p>}</section>
      <aside className="agreements-panel-context"><p className="ui-kicker">Seu lugar aqui</p>{selected?.context}<p className="agreements-private-note">Somente as pessoas deste Núcleo têm acesso.</p></aside>
    </div>}
  </section>;
}
