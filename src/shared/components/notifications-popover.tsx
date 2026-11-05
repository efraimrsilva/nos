"use client";

import { useEffect, useId, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Bell, X } from "lucide-react";

export function NotificationsPopover({ agreementsHref }: { agreementsHref?: string }) {
  const id = useId(), pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const previousPath = useRef(pathname);
  useEffect(() => {
    // A navegação encerra o painel; revalidar a mesma página preserva sua abertura.
    if (previousPath.current !== pathname) panel.current?.hidePopover();
    previousPath.current = pathname;
  }, [pathname]);

  return <>
    {/* O popover automático compartilha a camada do perfil e oferece Escape/clique fora nativos. */}
    <button type="button" className="notifications-trigger" popoverTarget={id} aria-haspopup="dialog" aria-label="Notificações — esboço"><Bell size={20} className="tone-orange" aria-hidden="true" /></button>
    <div ref={panel} id={id} popover="auto" role="dialog" aria-labelledby={`${id}-title`} className="notifications-popover">
      <div className="dialog-heading"><span className="color-icon tone-orange"><Bell aria-hidden="true" /></span><button type="button" className="ui-icon-button" popoverTarget={id} popoverTargetAction="hide" aria-label="Fechar notificações"><X aria-hidden="true" /></button></div>
      <p className="prototype-notice">Esboço de funcionalidade · ainda não desenvolvido</p>
      <h2 id={`${id}-title`}>Novidades, no seu tempo.</h2>
      <p>Este será o lugar para acompanhar convites, propostas e cuidados que pedem sua atenção. A central de notificações ainda não consulta nem envia avisos.</p>
      <Link href={agreementsHref ?? "/nucleos"} onClick={() => panel.current?.hidePopover()} className="secondary-action">{agreementsHref ? "Consultar Acordos" : "Abrir Seus Núcleos"}<ArrowRight size={17} aria-hidden="true" /></Link>
    </div>
  </>;
}
