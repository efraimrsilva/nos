// Escuta no documento para cobrir diálogos criados depois do carregamento, inclusive os aninhados.
export function installDialogBackdropDismiss(document: Document) {
  let started: { dialog: HTMLDialogElement; pointerId: number } | null = null;
  let endingOutside: HTMLDialogElement | null = null;
  const outside = (dialog: HTMLDialogElement, event: MouseEvent) => {
    const { left, right, top, bottom } = dialog.getBoundingClientRect();
    const { clientX: x, clientY: y } = event;
    return x < left || x >= right || y < top || y >= bottom;
  };
  const onPointerDown = (event: PointerEvent) => {
    if (!event.isPrimary) return;
    endingOutside = null;
    const dialog = event.target;
    started = event.button === 0 && dialog instanceof HTMLDialogElement &&
      dialog.open && outside(dialog, event) ? { dialog, pointerId: event.pointerId } : null;
  };
  const onPointerUp = (event: PointerEvent) => {
    if (!started || started.pointerId !== event.pointerId) return;
    const { dialog } = started;
    started = null;
    // O navegador entrega o backdrop ao modal superior. As coordenadas distinguem backdrop de padding,
    // inclusive quando o toque mantém o alvo original por captura implícita do ponteiro.
    if (event.target === dialog && dialog.open && outside(dialog, event)) endingOutside = dialog;
  };
  const onClick = (event: MouseEvent) => {
    const dialog = endingOutside;
    endingOutside = null;
    if (!dialog?.open || event.target !== dialog || event.detail === 0 || !outside(dialog, event)) return;
    // Fecha no clique para que o toque não seja redirecionado a um controle atrás do modal.
    event.preventDefault();
    event.stopPropagation();
    dialog.close();
  };
  const onPointerCancel = (event: PointerEvent) => {
    if (started?.pointerId === event.pointerId) started = null;
  };

  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('pointerup', onPointerUp, true);
  document.addEventListener('pointercancel', onPointerCancel, true);
  document.addEventListener('click', onClick, true);
  return () => {
    document.removeEventListener('pointerdown', onPointerDown, true);
    document.removeEventListener('pointerup', onPointerUp, true);
    document.removeEventListener('pointercancel', onPointerCancel, true);
    document.removeEventListener('click', onClick, true);
  };
}
