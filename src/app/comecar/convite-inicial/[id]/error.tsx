"use client";
import { RouteState } from "@/shared/components/route-state";
export default function ErrorPage({reset}:{reset:()=>void}) { return <RouteState title="Não conseguimos consultar o convite agora." description="Tente novamente. Esta falha não significa que seu Núcleo foi removido." retry={reset} embedded/>; }
