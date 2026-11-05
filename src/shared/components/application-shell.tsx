"use client";

// A versão exibida acompanha o manifesto também nas telas de carregamento e erro.
import projectManifest from "../../../package.json";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BookHeart, CalendarDays, Heart, House, Leaf, LockKeyhole, Menu, PanelLeftClose, PanelLeftOpen, ShieldCheck, Sparkles, Trees, UsersRound, X, type LucideIcon } from "lucide-react";
import { AccountReflections } from "@/features/onboarding/components/account-reflections";
import { AccountTreeLights } from "@/features/onboarding/components/account-tree-lights";

import { NotificationsPopover } from "@/shared/components/notifications-popover";
import { AccountPopover } from "@/features/controls/components/account-popover";
import type { NavigationCounts } from "@/features/navigation/counts";
import { ProblemReport } from "@/features/support/components/problem-report";

const buildVersion = projectManifest.version;

type NavItem = { label: string; href: string; icon: LucideIcon; tone: string; planned?: boolean };
type ShellProps = { children: ReactNode; accountMenuContent?: ReactNode; mobileAccountMenuContent?: ReactNode; lastNucleus?: { id: string; name: string } | null; showTree?: boolean; nucleusName?: string; userId?: string; counts?: NavigationCounts | null; profileLabel?: string };
const countKeys: Record<string, keyof NavigationCounts> = { "Seus Núcleos": "nuclei", "Núcleos": "nuclei", Acordos: "agreements", Agenda: "events", Pessoas: "people" };
const countDescriptions = { nuclei: "Núcleos dos quais você participa atualmente", agreements: "Acordos não encerrados com seu aceite dos termos atuais, em todos os seus Núcleos", events: "Compromissos ainda não terminados em que você está incluído, sem recusados, em todos os seus Núcleos", people: "Outras pessoas nos seus Núcleos atuais, sem contar a mesma pessoa duas vezes" };
const footer = <p className="site-footer-copy"><span>© 2026 Nós - Pequenos gestos. Vínculos reais.</span>{" "}<span className="site-footer-credits">Desenvolvido com 💖 por <a href="https://sintagmasoftware.netlify.app/">Sintagma Software</a>. Todos os direitos reservados.</span></p>;

export function ApplicationShell({ children, accountMenuContent, mobileAccountMenuContent, lastNucleus, showTree = false, nucleusName: routeNucleusName, userId, counts, profileLabel }: ShellProps) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  useEffect(() => { setReady(true); }, []);
  const menu = useRef<HTMLDialogElement>(null);

  const previousPath = useRef(pathname);
  // Links dos controles compartilhados também encerram a camada móvel ao mudar de rota.
  useEffect(() => {
    setSidebarHidden(false);
    // A hidratação inicial não deve fechar um diálogo que a pessoa acabou de abrir.
    if (previousPath.current !== pathname) { menu.current?.close(); }
    previousPath.current = pathname;
  }, [pathname]);
  // O endereço fornece apenas contexto visual; a sessão e o vínculo são validados em cada página/ação.
  const routeNucleusId = /^\/nucleos\/([0-9a-f-]{36})(?:\/|$)/i.exec(pathname)?.[1];
  useEffect(() => {
    if (!userId || showTree) return;
    const key = `nos-last-nucleus-${userId}`;
    const secure = location.protocol === "https:" ? "; Secure" : "";
    if (routeNucleusId && routeNucleusName) {
      // Cookie de contexto por pessoa; o servidor revalida o vínculo antes de restaurá-lo.
      document.cookie = `${key}=${routeNucleusId}; Path=/; SameSite=Lax; Max-Age=31536000${secure}`;
    } else if (lastNucleus === null) {
      document.cookie = `${key}=; Path=/; SameSite=Lax; Max-Age=0${secure}`;
    }
  }, [userId, showTree, routeNucleusId, routeNucleusName, lastNucleus]);
  const previousNucleus = userId && !showTree ? lastNucleus : null;
  const nucleusId = routeNucleusId ?? previousNucleus?.id;
  const nucleusName = routeNucleusName ?? previousNucleus?.name;
  const fullNucleusName = nucleusName?.replace(/\s+/g, " ").trim() ?? "";
  const shortNucleusName = (limit: number) => {
    const characters = Array.from(fullNucleusName);
    return characters.length > limit ? characters.slice(0, limit - 1).join("") + "…" : fullNucleusName;
  };
  const homeLabel = fullNucleusName ? "Início · " + fullNucleusName : "Início";
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
      { label: "Agenda", href: to("agenda"), icon: CalendarDays, tone: "orange", planned: true },

    ] }, { title: "História e vínculos", items: [
      { label: "Árvore e memórias", href: to("arvore"), icon: Trees, tone: "green", planned: true },
      { label: "Conexões e perfis", href: to("conexoes"), icon: Sparkles, tone: "purple", planned: true },
      { label: "Manifesto e cuidado", href: to("manifesto"), icon: BookHeart, tone: "orange", planned: true },
    ] }] : []),
    { title: "Sua conta", items: [
      { label: "Conta, Preferências e Ajuda", href: "/conta", icon: LockKeyhole, tone: "blue" },

    ] },
  ];
  const allItems = groups.flatMap(group => group.items);
  const isActive = (item: NavItem) => {
    // Subpáginas mantêm destacada a área de origem, mesmo sem um atalho próprio no menu.
    if (item.href === "/nucleos" && pathname.startsWith("/comecar")) return true;
    if (item.href === "/conta" && (/\/(convites|sair)$/.test(pathname) || pathname.startsWith("/configuracoes") || pathname === "/ajuda")) return true;
    if (nucleusId) {
      const section = pathname.slice(base.length + 1).split("/")[0];
      const parentArea = ({ pessoas: "", convites: "conta", sair: "conta", memorias: "arvore", perfis: "conexoes", cuidado: "manifesto" } as Record<string, string>)[section];
      if (parentArea && item.href === to(parentArea)) return true;
    }
    return [base, "/nucleos", "/conta"].includes(item.href) ? pathname === item.href : pathname.startsWith(item.href);
  };
  const active = allItems.find(isActive)?.label ?? (pathname.startsWith("/comecar") ? "Um novo vínculo" : pathname === "/ajuda" ? "Ajuda" : "Seu espaço");
  const mobileItems: NavItem[] = nucleusId ? [
    { label: "Início", href: base, icon: House, tone: "green" },
    { label: "Seus Núcleos", href: "/nucleos", icon: UsersRound, tone: "blue" },
    { label: "Acordos", href: to("acordos"), icon: Heart, tone: "rose" },
    { label: "Agenda", href: to("agenda"), icon: CalendarDays, tone: "orange", planned: true },  ] : [{ label: "Núcleos", href: "/nucleos", icon: UsersRound, tone: "blue" }];
  const moreActive = !mobileItems.some(isActive);
  const countDescriptionId = (label: string) => counts !== undefined && countKeys[label] ? `navigation-total-${countKeys[label]}` : undefined;
  const navigationDescriptionId = (item: NavItem) => [countDescriptionId(item.label), item.planned ? "navigation-planned-description" : undefined].filter(Boolean).join(" ") || undefined;
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
    .filter(group => group.items.length > 0) : groups).map(group => <section className="navigation-group" data-navigation-group={group.title === "Sua conta" ? "account" : undefined} key={group.title}>
    <h2>{group.title}</h2>{group.items.map(item => <Link key={item.label} href={item.href} prefetch={false} aria-label={item.label === "Início" ? homeLabel : undefined} aria-describedby={navigationDescriptionId(item)} aria-current={isActive(item) ? "page" : undefined} onClick={() => { if (inDialog) menu.current?.close(); }} className="navigation-link"><item.icon size={20} strokeWidth={2.5} aria-hidden="true" className={`nav-icon tone-${item.tone}`} /><span>{item.label}{item.label === "Início" && fullNucleusName && <small className="nav-nucleus-name" title={fullNucleusName}>{shortNucleusName(18)}</small>}</span>{count(item.label)}{item.planned && <span className="nav-planned" title="Esboço de funcionalidade" aria-hidden="true">○</span>}</Link>)}

    {group.title === "Sua conta" && <p className="navigation-build-version">Versão {buildVersion}</p>}
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

  return <div className={`current-shell${sidebarHidden ? " current-shell-sidebar-hidden" : ""}`} data-layout="current" data-layout-revision="3">
    {counts !== undefined && (Object.keys(countDescriptions) as (keyof NavigationCounts)[]).map(key => <p className="sr-only" id={`navigation-total-${key}`} key={key}>{counts ? `${counts[key].toLocaleString("pt-BR")} · ${countDescriptions[key]}.` : "Total indisponível. Tente atualizar a página."}</p>)}
    <p id="navigation-planned-description" className="sr-only">Esboço de funcionalidade</p>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <aside id="desktop-navigation" className="desktop-navigation" inert={sidebarHidden}>{brand}<p className="navigation-caption">CULTIVAR JUNTOS</p><nav aria-label="Áreas do Nós">{links()}</nav></aside>
    <div className="current-body"><header className="current-header"><div className="desktop-header-start"><button type="button" className="desktop-sidebar-toggle" aria-label={sidebarHidden ? "Mostrar barra lateral" : "Ocultar barra lateral"} title={sidebarHidden ? "Mostrar barra lateral" : "Ocultar barra lateral"} aria-controls="desktop-navigation" aria-expanded={!sidebarHidden} onClick={() => setSidebarHidden(hidden => !hidden)}>{sidebarHidden ? <PanelLeftOpen size={20} aria-hidden="true" /> : <PanelLeftClose size={20} aria-hidden="true" />}</button><div className="desktop-breadcrumb"><Link href={base}>{nucleusName ?? "Meu espaço"}</Link><span>/</span><span>{active}</span></div></div><div className="mobile-current-brand">{brand}<span>{nucleusName ?? "Seu espaço"}</span></div><div className="current-header-actions">{userId && <ProblemReport placement="header" />}<NotificationsPopover agreementsHref={nucleusId ? to("acordos") : undefined} />{accountMenuContent ? <AccountPopover profileLabel={profileLabel}>{accountMenuContent}</AccountPopover> : <Link href="/conta" aria-label="Minha conta"><span className="account-avatar">{profileLabel ?? <Heart size={17} aria-hidden="true" />}</span></Link>}</div></header>
      <main key={pathname} id="conteudo" tabIndex={-1} className={`current-content ${/^\/(?:comecar|configuracoes|ajuda|conta)(?:\/|$)/.test(pathname) || /\/(?:registrar|confirmar|revisar|sair)$/.test(pathname) ? "current-content-focused" : ""}`}>{children}</main>

    </div>
    <nav className="mobile-navigation" aria-label="Navegação móvel">{mobileItems.map(item => <Link key={item.label} href={item.href} prefetch={false} aria-label={item.label === "Início" ? homeLabel : undefined} aria-describedby={navigationDescriptionId(item)} aria-current={isActive(item) ? "page" : undefined}><item.icon size={22} strokeWidth={2.5} className={`tone-${item.tone}`} aria-hidden="true" /><span className="mobile-nav-label">{item.label}{item.label === "Início" && fullNucleusName && <small className="nav-nucleus-name" title={fullNucleusName}>{shortNucleusName(12)}</small>}{count(item.label, true)}{item.planned && <span className="nav-planned" title="Esboço de funcionalidade" aria-hidden="true"> ○</span>}</span></Link>)}<button type="button" disabled={!ready} aria-current={moreActive ? "page" : undefined} onClick={() => menu.current?.showModal()} aria-haspopup="dialog" aria-label="Mais áreas e preferências"><Menu size={23} className="tone-neutral" aria-hidden="true" /><span>Mais</span></button></nav>
    <dialog ref={menu} className="navigation-dialog" aria-labelledby="navigation-dialog-title"><div className="dialog-heading"><h2 id="navigation-dialog-title">Todos os seus caminhos</h2><button type="button" aria-label="Fechar menu" onClick={() => menu.current?.close()}><X aria-hidden="true" /></button></div><nav aria-label="Todas as áreas">{links(true)}</nav>{mobileAccountMenuContent && <div className="account-experience mobile-account-options" onClick={event => { if (event.target instanceof Element && event.target.closest("a[href]")) menu.current?.close(); }}>{mobileAccountMenuContent}</div>}</dialog>

  </div>;
}
