"use client";

import { useState, type InputHTMLAttributes } from "react";

export function PasswordInput({ id, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { id: string }) {
  const [visible, setVisible] = useState(false);
  return <div className="auth-password-control">
    <input {...props} id={id} type={visible ? "text" : "password"} />
    {/* O controle próprio funciona por toque e teclado sem depender do botão nativo do navegador. */}
    <button type="button" className="auth-password-toggle" aria-controls={id}
      aria-label={visible ? "Ocultar senha" : "Mostrar senha"} disabled={props.disabled}
      onClick={() => setVisible(value => !value)}>{visible ? "Ocultar" : "Mostrar"}</button>
  </div>;
}
