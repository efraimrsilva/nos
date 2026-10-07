"use client";

import { useActionState, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { passwordHelp, withAuthNext } from "@/features/auth/input";
import { submitAuth, type AuthFormState } from "@/features/auth/actions";

const initialState: AuthFormState = { message: "", success: false, revision: 0 };

export function AuthForm({ next = "/nucleos", initialMode = "signup" }: { next?: string; initialMode?: "signup" | "login" }) {
  const [mode, setMode] = useState<"signup" | "login">(initialMode);
  const panelRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const grid = panel?.closest<HTMLElement>(".welcome-grid");
    const main = panel?.closest("main");
    const brand = grid?.querySelector<HTMLElement>("aside");
    if (!panel || !grid || !main || !brand) return;

    // A coluna da marca usa a altura do login como referência, mesmo com os
    // campos extras do cadastro ou com a barra de rolagem em telas menores.
    const alignBrand = () => {
      const extras = [...panel.querySelectorAll<HTMLElement>("[data-signup-extra]")]
        .reduce((height, element) => height + element.getBoundingClientRect().height, 0);
      const shell = grid.closest<HTMLElement>(".app-shell")!;
      const gridStyle = getComputedStyle(grid);
      const bottomSpace = parseFloat(gridStyle.paddingBottom)
        + shell.querySelector("footer")!.getBoundingClientRect().height
        + parseFloat(getComputedStyle(shell).paddingBottom);
      const viewportSpace = document.documentElement.clientHeight
        - grid.offsetTop - parseFloat(gridStyle.paddingTop) - bottomSpace;
      const referenceHeight = Math.max(viewportSpace, main.getBoundingClientRect().height - extras, brand.getBoundingClientRect().height);
      grid.style.setProperty("--account-brand-offset", `${Math.max(0, (referenceHeight - brand.getBoundingClientRect().height) / 2)}px`);
    };
    const observer = new ResizeObserver(alignBrand);
    observer.observe(main);
    observer.observe(brand);
    window.addEventListener("resize", alignBrand);
    alignBrand();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", alignBrand);
      grid.style.removeProperty("--account-brand-offset");
    };
  }, [mode]);

  return (
    <section ref={panelRef} data-auth-panel className="mt-6 rounded-[22px] border border-line bg-white p-5 sm:p-7">
      <div className="flex gap-2" aria-label="Modo de acesso">
        <button type="button" onClick={() => setMode("signup")} aria-pressed={mode === "signup"} className="min-h-11 flex-1 rounded-xl border border-line px-3 text-sm font-semibold aria-pressed:bg-[#eff3e6]">Criar conta</button>
        <button type="button" onClick={() => setMode("login")} aria-pressed={mode === "login"} className="min-h-11 flex-1 rounded-xl border border-line px-3 text-sm font-semibold aria-pressed:bg-[#eff3e6]">Já tenho conta</button>
      </div>
      <CredentialsForm key={mode} mode={mode} next={next} />
      <Link href={withAuthNext("/conta/recuperar", next)} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-leaf underline">Esqueci minha senha</Link>
      <Link href={withAuthNext("/conta/confirmar-email", next)} className="flex min-h-11 items-center text-xs font-semibold text-leaf underline">Preciso confirmar meu e-mail</Link>
    </section>
  );
}

function CredentialsForm({ mode, next }: { mode: "signup" | "login"; next: string }) {
  const [state, action, pending] = useActionState(submitAuth, initialState);
  return (
      <form action={action} noValidate className="mt-6">
        <input type="hidden" name="mode" value={mode} />
        <input type="hidden" name="next" value={next} />
        {mode === "signup" && <div data-signup-extra className="flow-root"><label htmlFor="account-name" className="block text-xs font-bold text-muted">Nome</label><input id="account-name" name="name" autoComplete="name" maxLength={80} className="mt-2 mb-5 w-full rounded-[14px] border border-line px-4 py-3.5 text-sm" /></div>}
        <label htmlFor="account-email" className="block text-xs font-bold text-muted">E-mail</label>
        <input id="account-email" name="email" type="email" autoComplete="email" className="mt-2 mb-5 w-full rounded-[14px] border border-line px-4 py-3.5 text-sm" />
        <label htmlFor="account-password" className="block text-xs font-bold text-muted">Senha</label>
        <input key={state.revision} id="account-password" name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} className="mt-2 w-full rounded-[14px] border border-line px-4 py-3.5 text-sm" />
        {mode === "signup" && <div data-signup-extra className="flow-root"><p className="mt-2 text-xs leading-5 text-muted">{passwordHelp}</p></div>}
        {state.message && <p role={state.success ? "status" : "alert"} className={`mt-4 rounded-xl p-3 text-sm ${state.success ? "bg-[#eff3e6]" : "bg-[#fce9f1] text-[#9a3153]"}`}>{state.message}</p>}
        <button disabled={pending} type="submit" className="continue-button mt-6 min-h-12 w-full rounded-2xl bg-forest px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Aguarde…" : mode === "signup" ? "Criar conta" : "Entrar"}</button>
      </form>
  );
}
