import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, Bell, CalendarDays, Handshake, LockKeyhole, Sprout, UsersRound } from "lucide-react";
import { formatCalendarEventDate } from "@/features/calendar/event-input";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { getNucleusHomeDetails } from "@/features/nuclei/nucleus-home-details";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Início do Núcleo" };

export default async function NucleusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) notFound();
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect(routes.account);
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  // Sessão ausente pede entrada; falha operacional do Auth oferece nova tentativa na própria Home.
  if (isNucleusAuthUnavailable(authError)) throw new Error("Não foi possível conferir a sessão agora.");
  if (!user) redirect(routes.account);
  // A participação é lida com a sessão da requisição; a política RLS expõe só o vínculo da própria pessoa.
  const { data: membership, error: membershipError } = await supabase.from("nucleus_members")
    .select("role").eq("nucleus_id", id).eq("user_id", user.id).maybeSingle();
  if (membershipError) throw new Error("Não foi possível consultar a participação no Núcleo.");
  if (!membership) notFound();
  const { data: nucleus, error: nucleusError } = await supabase.from("nuclei")
    .select("id,name,type,purpose").eq("id", id).maybeSingle();
  if (nucleusError) throw new Error("Não foi possível consultar o Núcleo.");
  if (!nucleus) notFound();
  const details = getNucleusHomeDetails(nucleus.type, membership.role, id);
  // As prévias usam a mesma sessão e as políticas de acesso das páginas completas.
  const [{ data: calendar, error: calendarError }, { data: agreements, error: agreementsError }, { data: myNuclei, error: myNucleiError }, { data: people, error: peopleError }] = await Promise.all([
    supabase.rpc("get_nucleus_calendar", { target_nucleus: id, from_ends_at: new Date().toISOString(), page_offset: 0, page_size: 3 }),
    supabase.from("nucleus_agreements").select("id,title,category,status").eq("nucleus_id", id).order("created_at", { ascending: false }).order("id").limit(3),
    supabase.from("nuclei").select("id,name,type").order("name").order("id").limit(4),
    supabase.rpc("get_nucleus_management", { target_nucleus: id }),
  ]);
  if (calendarError || agreementsError || myNucleiError || peopleError) throw new Error("Não foi possível consultar os próximos momentos e acordos do Núcleo.");
  const homeNuclei = [nucleus, ...(myNuclei ?? []).filter(space => space.id !== id)].slice(0, 4);
  const upcoming = (calendar ?? []) as { id: string; title: string; starts_at: string; time_zone: string }[];
  // A RPC agrupa os participantes em members; não retorna uma lista na raiz.
  const members = (people?.members ?? []) as { user_id: string; display_name: string | null }[];
  const statusLabels: Record<string, string> = { pending: "Proposta enviada", testing: "Em teste", active: "Acordo ativo", declined: "Proposta recusada", ended: "Encerrado" };

  return <OnboardingShell nucleusName={nucleus.name}>
    <header className="ui-page-header"><div><p className="ui-kicker">{details.typeLabel} · INÍCIO DO NÚCLEO</p><h1 className="ui-title">{nucleus.name}</h1><p className="ui-copy"><strong>Nosso propósito:</strong> {nucleus.purpose}</p>{/* O papel vem do vínculo da própria pessoa, consultado com a sessão atual. */}<p className="ui-copy">{details.participation}.</p></div><span className="ui-badge"><LockKeyhole size={13} aria-hidden="true" />Espaço privado</span></header>
    <div className="home-overview-grid">
      <section className="ui-panel"><div className="ui-panel-heading"><h2>Na agenda</h2><CalendarDays size={20} className="tone-blue" aria-hidden="true" /></div>{upcoming.length ? upcoming.map(event=><Link key={event.id} href={'/nucleos/'+id+'/agenda#evento-'+event.id} className="ui-row"><span className="home-date"><strong>{new Date(event.starts_at).getUTCDate()}</strong><small>{new Intl.DateTimeFormat('pt-BR',{month:'short',timeZone:'UTC'}).format(new Date(event.starts_at))}</small></span><span><strong>{event.title}</strong><small>{formatCalendarEventDate(event.starts_at,event.time_zone).text}</small></span><ArrowRight size={15} /></Link>):<div className="ui-empty"><CalendarDays size={27} className="tone-blue" />Nada marcado por enquanto. Um encontro pode começar quando fizer sentido.</div>}<Link href={'/nucleos/'+id+'/agenda'} className="ui-row">Abrir agenda<ArrowRight size={16} /></Link></section>
      <section className="ui-panel"><div className="ui-panel-heading"><h2>No seu tempo</h2><Bell size={20} className="tone-orange" aria-hidden="true" /></div><div className="home-notice-art"><span className="color-icon"><Bell size={24} /></span><p>Presença também<br />precisa de silêncio.</p></div><p>Um lugar para acompanhar o que pede sua atenção, sem pressa.</p><ActionDialog title="Notificações, no seu tempo" trigger={<>Conhecer esta área<ArrowRight size={16} /></>} variant="text"><p className="prototype-notice">Esboço de funcionalidade · ainda não desenvolvido</p><p className="ui-copy mt-5">A central de notificações ainda não consulta nem envia avisos. Convites e propostas reais continuam disponíveis em suas próprias áreas.</p><Link className="ui-button-secondary mt-6" href={'/nucleos/'+id+'/acordos'}>Consultar Acordos</Link></ActionDialog><p className="home-caption">Esboço · sem avisos ou atividades simuladas</p></section>
      <section className="ui-panel home-spaces"><div className="ui-panel-heading"><h2>Núcleos onde estou</h2><UsersRound size={20} className="tone-blue" aria-hidden="true" /></div>{homeNuclei.map(space=><details key={space.id} open={space.id===id} className="home-space"><summary><span className="color-icon tone-green"><UsersRound size={19} aria-hidden="true" /></span><span><strong>{space.name}</strong><small>{getNucleusHomeDetails(space.type,'member',space.id).typeLabel}</small></span></summary>{space.id===id && <ul className="home-member-list">{members.map(person=><li key={person.user_id}><span className="ui-avatar">{person.display_name?.trim().slice(0,2).toLocaleUpperCase('pt-BR')||'N'}</span>{person.display_name||'Participante'}</li>)}</ul>}<Link href={'/nucleos/'+space.id+(space.id===id?'/pessoas':'')} className="ui-row">{space.id===id?'Pessoas e administração':'Abrir Núcleo'}<ArrowRight size={16} /></Link></details>)}<Link href="/nucleos" className="ui-row">Ver Seus Núcleos<ArrowRight size={16} /></Link></section>
    </div>
    <section className="home-cultivation" aria-labelledby="agreements-heading"><div className="ui-panel-heading"><h2 id="agreements-heading">O que estamos cultivando</h2><Link href={'/nucleos/'+id+'/acordos'} className="ui-button-secondary">Abrir acordos<ArrowRight size={16} /></Link></div><div className="home-agreements-grid">{agreements?.length?agreements.map(agreement=><Link key={agreement.id} href={'/nucleos/'+id+'/acordos?categoria='+encodeURIComponent(agreement.category)} className="ui-panel home-agreement"><span className="ui-badge">{statusLabels[agreement.status]??agreement.status}</span><h3>{agreement.title}</h3><p>Uma prática compartilhada, com escolha individual.</p><span className="ui-row">Conferir na lista<ArrowRight size={16} /></span></Link>):<div className="ui-empty">Os primeiros acordos podem nascer de uma intenção simples. Abra os acordos para começar uma proposta.</div>}</div></section>
    <nav className="home-footer-links" aria-label="Autonomia e proteção"><Link href="/nucleos">Seus Núcleos</Link><Link href="/conta">Minha conta e sair</Link><Link href="/configuracoes">Configurações, privacidade e ajuda</Link><Link href={'/nucleos/'+id+'/sair'}>Sair deste Núcleo</Link></nav>
  </OnboardingShell>;
}
