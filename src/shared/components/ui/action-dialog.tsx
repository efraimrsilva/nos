"use client";

import { Suspense, useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

type Props = {
  trigger: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "text" | "card" | "navigation";
  size?: "default" | "wide";
  className?: string;
  defaultOpen?: boolean;
};

function CloseAfterNavigation({ dialog }: { dialog: RefObject<HTMLDialogElement | null> }) {
  const pathname = usePathname();
  const query = useSearchParams().toString();
  const previous = useRef(`${pathname}?${query}`);
  // Revalidar dados sem mudar a URL preserva códigos/feedback devolvidos por useActionState.
  // Uma navegação ou redirect para outro resultado encerra somente o diálogo anterior.
  useEffect(() => {
    const current = `${pathname}?${query}`;
    if (previous.current !== current) dialog.current?.close();
    previous.current = current;
  }, [pathname, query, dialog]);
  return null;
}

// O diálogo só gerencia apresentação/foco. Formulários filhos mantêm suas ações e permissões de servidor.
export function ActionDialog({ trigger, title, description, children, variant = "secondary", size = "default", className = "", defaultOpen = false }: Props) {
  const [ready, setReady] = useState(false);
  // O HTML chega antes do JavaScript; não aceitar um clique que ainda não pode abrir o diálogo.
  useEffect(() => { setReady(true); }, []);
  const dialog = useRef<HTMLDialogElement>(null);
  const origin = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    if (defaultOpen && !dialog.current?.open) dialog.current?.showModal();
  }, [defaultOpen]);
  return <>
    {/* Na navegação, o gatilho usa somente o estilo dos demais itens, sem herdar o botão de ação. */}
    <button ref={origin} type="button" disabled={!ready} className={variant === "navigation" ? className : `ui-dialog-trigger ui-trigger-${variant} ${className}`} aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>{trigger}</button>
    <dialog ref={dialog} className={`ui-dialog ui-dialog-${size}`} aria-labelledby={`${id}-title`} aria-describedby={description ? `${id}-description` : undefined} onClose={() => origin.current?.focus()} onClick={event => { if (event.target instanceof Element && event.target.closest('a[href^="/conta#"]')) dialog.current?.close(); }}>
      <header className="ui-dialog-header"><div><h2 id={`${id}-title`}>{title}</h2></div><button type="button" className="ui-icon-button" aria-label={`Fechar ${title}`} onClick={() => dialog.current?.close()} autoFocus><X size={21} aria-hidden="true" /></button></header>
      {description && <p id={`${id}-description`} className="ui-dialog-description">{description}</p>}
      <div className="ui-dialog-body">{children}</div>
    </dialog>
    <Suspense fallback={null}><CloseAfterNavigation dialog={dialog} /></Suspense>
  </>;
}
