import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

type PathCardProps = { href: string; title: string; description: string; icon: LucideIcon; variant?: "create" | "invite" };

export function PathCard({ href, title, description, icon: Icon }: PathCardProps) {
  // O link nativo preserva teclado, histórico e abertura em outra aba.
  return <Link href={href} className="ui-panel onboarding-path"><span className="account-row-icon"><Icon size={20} aria-hidden="true" /></span><span><strong>{title}</strong><small>{description}</small></span><ArrowUpRight size={17} aria-hidden="true" /></Link>;
}
