"use client";
import { RouteState } from "@/shared/components/route-state";
export default function ErrorPage({reset}:{reset:()=>void}) { return <RouteState title="Não foi possível abrir esta página" description="Tente novamente em instantes. Nenhuma configuração foi alterada." retry={reset}/>; }
