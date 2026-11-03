"use client";

import { useEffect } from "react";

// Uma única inscrição cobre ActionDialog, navegação e diálogos criados depois da hidratação.
export function DialogBackdropDismiss() {
  useEffect(() => {
    let pressedOutside: HTMLDialogElement | null = null;
    const outside = (dialog: HTMLDialogElement, event: MouseEvent) => {
      const box = dialog.getBoundingClientRect();
      return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
    };
    const start = (event: PointerEvent) => {
      pressedOutside = event.isPrimary && event.button === 0 && event.target instanceof HTMLDialogElement && event.target.open && outside(event.target, event) ? event.target : null;
    };
    const cancel = () => { pressedOutside = null; };
    const finish = (event: MouseEvent) => {
      const dialog = pressedOutside;
      pressedOutside = null;
      // O navegador direciona o backdrop ao diálogo superior. Padding e arraste interno não fecham.
      if (dialog?.open && event.target === dialog && event.detail > 0 && outside(dialog, event)) dialog.close();
    };
    document.addEventListener("pointerdown", start, true);
    document.addEventListener("pointercancel", cancel, true);
    document.addEventListener("click", finish, true);
    return () => {
      document.removeEventListener("pointerdown", start, true);
      document.removeEventListener("pointercancel", cancel, true);
      document.removeEventListener("click", finish, true);
    };
  }, []);
  return null;
}
