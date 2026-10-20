"use client";
import Link from "next/link";
import { Compass, RefreshCw, ShieldCheck } from "lucide-react";
import { ApplicationShell } from "./application-shell";
import { LoadingIndicator } from "./loading-indicator";

// As rotas compartilham a apresentação; cada fronteira mantém sua própria mensagem e tentativa.
export function RouteState({ title, description, loading = false, retry, embedded = false }: { title:string; description?:string; loading?:boolean; retry?:()=>void; embedded?:boolean }) {
  const content = <section className="ui-panel route-state" aria-busy={loading}><span className="color-icon tone-blue">{loading?<ShieldCheck size={24} aria-hidden="true" />:<Compass size={24} aria-hidden="true" />}</span><p className="ui-kicker">SEU ESPAÇO CONTINUA AQUI</p><h1 className="ui-title">{title}</h1>{description && <p className="ui-copy" role={loading?undefined:"alert"}>{description}</p>}{loading && <p role="status"><LoadingIndicator>Conferindo as informações…</LoadingIndicator></p>}<div className="route-state-actions">{retry && <button className="ui-button" onClick={retry}><RefreshCw size={17} aria-hidden="true" />Tentar novamente</button>}<Link className="ui-button-secondary" href="/nucleos">Seus Núcleos</Link><Link className="ui-button-secondary" href="/conta">Minha conta</Link></div></section>;
  return embedded ? content : <ApplicationShell>{content}</ApplicationShell>;
}
