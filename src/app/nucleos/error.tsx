"use client";
import { RouteState } from "@/shared/components/route-state";
export default function ErrorPage({reset}:{reset:()=>void}) { return <RouteState title="Não conseguimos carregar seus Núcleos agora." description="Tente novamente em instantes." retry={reset}/>; }
