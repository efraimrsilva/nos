"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, X } from "lucide-react";

export function AccountPopover({ children, profileLabel }: { children: ReactNode; profileLabel?: string }) {
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => { panel.current?.hidePopover(); }, [pathname]);
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 700px)");
    const close = () => { if (mobile.matches) panel.current?.hidePopover(); };
    mobile.addEventListener("change", close);
    return () => mobile.removeEventListener("change", close);
  }, []);
  const avatar = <span className="account-avatar">{profileLabel ?? <Heart size={17} aria-hidden="true" />}</span>;
  return <>
    <Link href="/conta" className="account-mobile-link" aria-label="Minha conta">{avatar}</Link>
    <button type="button" className="account-desktop-trigger" popoverTarget={id} aria-haspopup="dialog" aria-label="Abrir Conta, Preferências e Ajuda" title="Conta, Preferências e Ajuda">{avatar}</button>
    <div ref={panel} id={id} popover="auto" role="dialog" aria-labelledby={`${id}-title`} className="account-popover">
      <header className="account-popover-heading"><div><p>SUA CONTA</p><h2 id={`${id}-title`}>Conta, Preferências e Ajuda</h2><span>Seu espaço, sem sair do Núcleo.</span></div><button type="button" className="ui-icon-button" popoverTarget={id} popoverTargetAction="hide" aria-label="Fechar opções da conta"><X size={21} aria-hidden="true" /></button></header>
      <div className="account-popover-content">{children}</div>
    </div>
  </>;
}
