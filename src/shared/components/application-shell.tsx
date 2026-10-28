"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Bell, BookHeart, CalendarDays, ChevronDown, Heart, House, Leaf, LockKeyhole, Menu, Search, Settings2, ShieldCheck, Sparkles, Sprout, Trees, UsersRound, X, type LucideIcon } from "lucide-react";
import { AccountReflections } from "@/features/onboarding/components/account-reflections";
import { AccountTreeLights } from "@/features/onboarding/components/account-tree-lights";
import { AppearanceOption } from "@/features/appearance/theme-picker";
import type { NavigationCounts } from "@/features/navigation/counts";

type NavItem = { label: string; href: string; icon: LucideIcon; tone: string; planned?: boolean };
type ShellProps = { children: ReactNode; showTree?: boolean; nucleusName?: string; counts?: NavigationCounts | null };
const countKeys: Record<string, keyof NavigationCounts> = { "Seus Núcleos": "nuclei", "Núcleos": "nuclei", Acordos: "agreements", Agenda: "events", Pessoas: "people" };
const countDescriptions = { nuclei: "Núcleos dos quais você participa atualmente", agreements: "Acordos não encerrados com seu aceite dos termos atuais, em todos os seus Núcleos", events: "Compromissos ainda não terminados em que você está incluído, sem recusados, em todos os seus Núcleos", people: "Outras pessoas nos seus Núcleos atuais, sem contar a mesma pessoa duas vezes" };
const footer = <p className="site-footer-copy"><span>© 2026 Nós - Pequenos gestos. Vínculos reais.</span>{" "}<span className="site-footer-credits">Desenvolvido com 💖 por <a href="https://sintagmasoftware.netlify.app/">Sintagma Software</a>. Todos os direitos reservados.</span></p>;

export function ApplicationShell({ children, showTree = false, nucleusName, counts }: ShellProps) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  const menu = useRef<HTMLDialogElement>(null);
  const searchDialog = useRef<HTMLDialogElement>(null);
  const notices = useRef<HTMLDialogElement>(null);
  const [search, setSearch] = useState("");
  // O endereço fornece apenas contexto visual; a sessão e o vínculo são validados em cada página/ação.
  const nucleusId = /^\/nucleos\/([0-9a-f-]{36})(?:\/|$)/i.exec(pathname)?.[1];
  const base = nucleusId ? `/nucleos/${nucleusId}` : "/nucleos";
  const to = (area: string) => nucleusId ? `${base}/${area}` : "/nucleos";
  const publicEntry = (pathname === "/conta" && showTree) || pathname.startsWith("/conta/") || pathname === "/boas-vindas";
  const showFooter = pathname === "/conta" || pathname === "/boas-vindas";
  const groups: { title: string; items: NavItem[] }[] = [
    { title: "Meu espaço", items: [
      ...(nucleusId ? [{ label: "Início", href: base, icon: House, tone: "green" }] : []),
      { label: "Seus Núcleos", href: "/nucleos", icon: UsersRound, tone: "blue" },
    ] },
    ...(nucleusId ? [{ title: "Cultivar juntos", items: [
      { label: "Acordos", href: to("acordos"), icon: Heart, tone: "rose" },
      { label: "Agenda", href: to("agenda"), icon: CalendarDays, tone: "orange" },
      { label: "Pessoas", href: to("pessoas"), icon: UsersRound, tone: "blue" },
    ] }, { title: "História e vínculos", items: [
      { label: "Árvore e memórias", href: to("arvore"), icon: Trees, tone: "green", planned: true },
      { label: "Conexões e perfis", href: to("conexoes"), icon: Sparkles, tone: "purple", planned: true },
      { label: "Manifesto e cuidado", href: to("manifesto"), icon: BookHeart, tone: "orange", planned: true },
    ] }] : []),
    { title: "Conta e preferências", items: [
      { label: "Conta", href: "/conta", icon: LockKeyhole, tone: "blue" },
      { label: "Preferências e ajuda", href: "/configuracoes", icon: Settings2, tone: "purple" },
    ] },
  ];
  const allItems = groups.flatMap(group => group.items);
  const isActive = (item: NavItem) => {
    // Subpáginas mantêm destacada a área de origem, mesmo sem um atalho próprio no menu.
    if (item.href === "/nucleos" && pathname.startsWith("/comecar")) return true;
    if (item.href === "/configuracoes" && pathname === "/ajuda") return true;
    if (nucleusId) {
      const section = pathname.slice(base.length + 1).split("/")[0];
      const parentArea = ({ convites: "pessoas", sair: "pessoas", memorias: "arvore", perfis: "conexoes", cuidado: "manifesto" } as Record<string, string>)[section];
      if (parentArea && item.href === to(parentArea)) return true;
    }
    return [base, "/nucleos", "/conta"].includes(item.href) ? pathname === item.href : pathname.startsWith(item.href);
  };
  const active = allItems.find(isActive)?.label ?? (pathname.startsWith("/comecar") ? "Um novo vínculo" : pathname === "/ajuda" ? "Ajuda" : "Seu espaço");
  const mobileItems: NavItem[] = nucleusId ? [
    { label: "Início", href: base, icon: House, tone: "green" },
    { label: "Acordos", href: to("acordos"), icon: Heart, tone: "rose" },
    { label: "Agenda", href: to("agenda"), icon: CalendarDays, tone: "orange" },
    { label: "Pessoas", href: to("pessoas"), icon: UsersRound, tone: "blue" },
  ] : [{ label: "Núcleos", href: "/nucleos", icon: UsersRound, tone: "blue" }];
  const moreActive = !mobileItems.some(isActive);
  const countDescriptionId = (label: string) => counts !== undefined && countKeys[label] ? `navigation-total-${countKeys[label]}` : undefined;
  const count = (label: string, compact = false) => {
    const key = countKeys[label];
    if (!key || counts === undefined) return null;
    const value = counts?.[key];
    const description = value === undefined ? "Total indisponível. Tente atualizar a página." : `${value.toLocaleString("pt-BR")} · ${countDescriptions[key]}`;
    return <span className="nav-count" data-count={key} title={description} aria-hidden="true">{value === undefined ? "—" : new Intl.NumberFormat("pt-BR", compact && value >= 1000 ? { notation: "compact", maximumFractionDigits: 1 } : {}).format(value)}</span>;
  };
  // O menu Mais complementa a barra inferior; a navegação lateral mantém todas as áreas.
  const links = (inDialog = false) => (inDialog && nucleusId ? groups
    .map(group => ({ ...group, items: group.items.filter(item => !mobileItems.some(mobile => mobile.href === item.href)) }))
    .filter(group => group.items.length > 0) : groups).map(group => <section className="navigation-group" key={group.title}>
    <h2>{group.title}</h2>{group.items.map(item => <Link key={item.label} href={item.href} prefetch={false} aria-describedby={countDescriptionId(item.label)} aria-current={isActive(item) ? "page" : undefined} onClick={() => { if (inDialog) menu.current?.close(); }} className="navigation-link"><item.icon size={20} strokeWidth={2.5} aria-hidden="true" className={`nav-icon tone-${item.tone}`} /><span>{item.label}</span>{count(item.label)}{item.planned && <span className="nav-planned" aria-label="Esboço">○</span>}</Link>)}
    {group.title === "Conta e preferências" && <AppearanceOption />}
  </section>);
  const brand = <Link href={publicEntry ? "/boas-vindas" : base} className="current-brand" aria-label="Nós — início"><span><Leaf size={26} strokeWidth={2.3} aria-hidden="true" /></span>nós<span className="brand-period">.</span></Link>;

  if (publicEntry) return <div className="public-shell" data-layout="current" data-layout-revision="3">
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="public-header">{brand}{pathname !== "/conta" && <span><ShieldCheck size={17} aria-hidden="true" /> Um lugar seguro para seus vínculos</span>}</header>
    <div className={`public-grid ${showTree ? "public-grid-with-art" : "public-grid-form"}`}>
      {showTree && <aside className="public-story"><h2>Pequenos gestos.<br /><em>Vínculos reais.</em></h2>
        {/* A Conta fornece showTree a partir da sessão; a restauração fica restrita a esta rota. */}
        {pathname === "/conta" && <div className="account-tree">
          <Image src="/brand/nos-tree.png" alt="Árvore com troncos entrelaçados, símbolo dos vínculos que cultivamos" width={877} height={875} sizes="(max-width: 700px) 160px, 280px" preload />
          <AccountTreeLights />
        </div>}
        <AccountReflections /></aside>}
      <main id="conteudo" tabIndex={-1} className="public-content">{children}</main>
    </div>{showFooter && <footer className="public-footer">{footer}</footer>}
  </div>;

  const results = allItems.filter(item => item.label.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR")));
  return <div className="current-shell" data-layout="current" data-layout-revision="3">
    {counts !== undefined && (Object.keys(countDescriptions) as (keyof NavigationCounts)[]).map(key => <p className="sr-only" id={`navigation-total-${key}`} key={key}>{counts ? `${counts[key].toLocaleString("pt-BR")} · ${countDescriptions[key]}.` : "Total indisponível. Tente atualizar a página."}</p>)}
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <aside className="desktop-navigation">{brand}<Link href="/nucleos" className="current-nucleus-switch"><span className="nucleus-letter">{nucleusName?.slice(0, 1).toLocaleUpperCase("pt-BR") ?? <Sprout size={22} aria-hidden="true" />}</span><span><strong>{nucleusName ?? "Seus Núcleos"}</strong><small>{nucleusId ? "Seu espaço compartilhado" : "Escolha um espaço para cuidar"}</small></span><ChevronDown size={15} aria-hidden="true" /></Link><p className="navigation-caption">CULTIVAR JUNTOS</p><nav aria-label="Áreas do Nós">{links()}</nav><div className="navigation-bottom"><div className="navigation-purpose"><Sprout className="tone-green" size={23} aria-hidden="true" /><p>Pequenos gestos.<br />Vínculos reais.</p></div><Link href="/configuracoes/privacidade"><ShieldCheck size={17} aria-hidden="true" /> Sua privacidade importa</Link></div></aside>
    <div className="current-body"><header className="current-header"><div className="desktop-breadcrumb"><Link href="/nucleos">{nucleusName ?? "Meu espaço"}</Link><span>/</span><span>{active}</span></div><div className="mobile-current-brand">{brand}<span>{nucleusName ?? "Seu espaço"}</span></div><div className="current-header-actions"><button type="button" aria-haspopup="dialog" aria-label="Buscar uma área" onClick={() => searchDialog.current?.showModal()}><Search size={20} aria-hidden="true" /></button><button type="button" aria-haspopup="dialog" aria-label="Notificações — esboço" onClick={() => notices.current?.showModal()}><Bell size={20} className="tone-orange" aria-hidden="true" /><span className="notification-dot" /></button><Link href="/conta" aria-label="Minha conta"><span className="account-avatar"><Heart size={17} aria-hidden="true" /></span></Link></div></header>
      <main key={pathname} id="conteudo" tabIndex={-1} className={`current-content ${/^\/(?:comecar|configuracoes|ajuda|conta)(?:\/|$)/.test(pathname) || /\/(?:registrar|confirmar|revisar|sair)$/.test(pathname) ? "current-content-focused" : ""}`}>{children}</main>
      {showFooter && <footer className="current-footer">{footer}</footer>}
    </div>
    <nav className="mobile-navigation" aria-label="Navegação móvel">{mobileItems.map(item => <Link key={item.label} href={item.href} prefetch={false} aria-describedby={countDescriptionId(item.label)} aria-current={isActive(item) ? "page" : undefined}><item.icon size={22} strokeWidth={2.5} className={`tone-${item.tone}`} aria-hidden="true" /><span className="mobile-nav-label">{item.label}{count(item.label, true)}</span></Link>)}<button type="button" disabled={!ready} aria-current={moreActive ? "page" : undefined} onClick={() => menu.current?.showModal()} aria-haspopup="dialog" aria-label="Mais áreas e preferências"><Menu size={23} className="tone-neutral" aria-hidden="true" /><span>Mais</span></button></nav>
    <dialog ref={menu} className="navigation-dialog" aria-labelledby="navigation-dialog-title"><div className="dialog-heading"><h2 id="navigation-dialog-title">Todos os seus caminhos</h2><button type="button" aria-label="Fechar menu" onClick={() => menu.current?.close()}><X aria-hidden="true" /></button></div><nav aria-label="Todas as áreas">{links(true)}</nav></dialog>
    <dialog ref={searchDialog} className="current-dialog" aria-labelledby="search-dialog-title"><div className="dialog-heading"><h2 id="search-dialog-title">Encontre seu caminho</h2><button type="button" aria-label="Fechar busca" onClick={() => searchDialog.current?.close()}><X aria-hidden="true" /></button></div><label htmlFor="navigation-search">Buscar uma área do Nós</label><div className="navigation-search"><Search size={20} aria-hidden="true" /><input id="navigation-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Acordos, agenda, privacidade…" /></div><p className="text-sm text-muted">{nucleusId ? "Busque pelos caminhos deste espaço." : "Escolha um Núcleo para abrir suas áreas compartilhadas."}</p><div className="search-results">{results.map(item => <Link key={item.label} href={item.href} onClick={() => searchDialog.current?.close()}><item.icon className={`tone-${item.tone}`} size={21} aria-hidden="true" /><span>{item.label}{item.planned && <small>Esboço de funcionalidade</small>}</span><ArrowRight size={16} aria-hidden="true" /></Link>)}</div>{!results.length && <p role="status">Nenhuma área encontrada. Tente outro nome.</p>}</dialog>
    <dialog ref={notices} className="current-dialog" aria-labelledby="notice-dialog-title"><div className="dialog-heading"><span className="color-icon tone-orange"><Bell aria-hidden="true" /></span><button type="button" aria-label="Fechar notificações" onClick={() => notices.current?.close()}><X aria-hidden="true" /></button></div><p className="prototype-notice">Esboço de funcionalidade · ainda não desenvolvido</p><h2 id="notice-dialog-title">Novidades, no seu tempo.</h2><p>Este será o lugar para acompanhar convites, propostas e cuidados que pedem sua atenção. A central de notificações ainda não consulta nem envia avisos.</p><Link href={nucleusId ? to("acordos") : "/nucleos"} onClick={() => notices.current?.close()} className="secondary-action">{nucleusId ? "Consultar Acordos" : "Abrir Seus Núcleos"}<ArrowRight size={17} aria-hidden="true" /></Link></dialog>
  </div>;
}
