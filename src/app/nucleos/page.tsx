import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, LockKeyhole, Plus, UsersRound } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isNucleusAuthUnavailable } from "@/features/nuclei/nucleus-access";
import { findNucleusType } from "@/features/nuclei/nucleus-types";
import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import { PathCard } from "@/features/onboarding/components/path-card";
import { routes } from "@/shared/routes";

export const metadata: Metadata = { title: "Seus Núcleos" };

export default async function NucleiPage({ searchParams }: { searchParams: Promise<{ pagina?: string | string[] }> }) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect(routes.account);
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (isNucleusAuthUnavailable(authError)) throw new Error("Não foi possível conferir a sessão agora.");
  if (!user) redirect(routes.account);
  const { pagina } = await searchParams;
  const page = typeof pagina === "string" && /^[1-9]\d{0,3}$/.test(pagina) ? Number(pagina) : 1;
  const start = (page - 1) * 20;
  // A RLS retorna somente Núcleos com associação própria; ordenação estável evita misturar contextos.
  const { data, error } = await supabase.from("nuclei").select("id,name,type,purpose").order("name").order("id").range(start, start + 20);
  if (error) throw new Error("Não foi possível consultar seus Núcleos.");
  const nuclei = (data ?? []).slice(0, 20);
  return <OnboardingShell>
    <p className="step-label mb-3 text-lilac">Seus vínculos</p>
    <h1 className="font-display text-[30px] font-medium leading-tight md:text-[38px]">Seus Núcleos</h1>
    <p className="mt-3 text-sm leading-7 text-muted">Cada jardim tem sua própria história. Escolha o espaço que quer cuidar agora.</p>
    <p className="mt-3 flex items-center gap-2 text-xs text-muted"><LockKeyhole size={15} aria-hidden="true" />Apenas os Núcleos dos quais você participa aparecem aqui.</p>
    {nuclei.length ? <nav aria-label="Seus Núcleos" className="mt-6 flex flex-col gap-3">
      {nuclei.map(nucleus => <Link key={nucleus.id} href={`${routes.nucleus}/${nucleus.id}`} className="nucleus-card rounded-[22px] border border-line bg-white p-5">
        <span className="text-xs font-semibold text-leaf">{findNucleusType(nucleus.type)?.label ?? "Núcleo"}</span>
        <h2 className="mt-2 break-words font-display text-xl">{nucleus.name}</h2>
        <p className="mt-2 break-words text-sm leading-6 text-muted">{nucleus.purpose}</p>
        <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-leaf">Abrir Núcleo<ArrowRight size={17} aria-hidden="true" /></span>
      </Link>)}
    </nav> : <p role="status" className="mt-6 rounded-[22px] border border-line bg-white p-6 text-sm leading-7 text-muted">{page === 1 ? "Você ainda não participa de um Núcleo. Crie um espaço ou entre com um convite quando fizer sentido." : "Não há Núcleos nesta página. Volte à página anterior."}</p>}
    {(page > 1 || (data ?? []).length > 20) && <nav aria-label="Páginas de Núcleos" className="mt-4 flex justify-between text-sm font-semibold text-leaf">
      {page > 1 && <Link href={`/nucleos?pagina=${page - 1}`} className="inline-flex min-h-11 items-center underline">Página anterior</Link>}
      {(data ?? []).length > 20 && <Link href={`/nucleos?pagina=${page + 1}`} className="inline-flex min-h-11 items-center underline">Próxima página</Link>}
    </nav>}
    <nav aria-label="Criar ou entrar em outro Núcleo" className="mt-6 flex flex-col gap-3">
      <PathCard href={routes.nucleusType} title="Criar um núcleo" description="Comece um novo jardim com quem você ama." icon={Plus} />
      <PathCard href={routes.invitation} title="Entrar com um convite" description="Recebeu um código de alguém? Junte-se a eles." icon={UsersRound} variant="invite" />
    </nav>
    <Link href={routes.account} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-leaf underline">Minha conta e sair</Link>
    <Link href={routes.settings} className="mt-3 block min-h-11 text-sm font-semibold leading-[44px] text-leaf underline">Configurações, privacidade e ajuda</Link>
  </OnboardingShell>;
}
