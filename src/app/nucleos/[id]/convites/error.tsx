"use client";
import { RouteState } from "@/shared/components/route-state";
export default function ErrorPage({reset}:{reset:()=>void}) { return <RouteState title="Não conseguimos consultar os convites agora." description="A falha não confirma nenhuma revogação. Confira novamente antes de compartilhar um código." retry={reset}/>; }
