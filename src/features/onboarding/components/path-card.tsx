import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

type PathCardProps = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  variant?: "create" | "invite";
};

export function PathCard({ href, title, description, icon: Icon, variant = "create" }: PathCardProps) {
  return (
    // Link nativo mantém navegação por teclado e histórico do navegador sem estado paralelo.
    <Link href={href} className={`path-card ${variant}`}>
      <span className="path-icon"><Icon size={25} strokeWidth={1.8} aria-hidden="true" /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold sm:text-base">{title}</span>
        <span className="mt-1.5 block text-xs leading-[1.7] text-muted sm:text-[13px]">{description}</span>
      </span>
      <ChevronRight size={18} strokeWidth={1.8} aria-hidden="true" className="shrink-0 text-muted" />
    </Link>
  );
}
