import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireControlsSession } from "@/features/controls/access";

export const metadata: Metadata = { title: "Entrar e recuperar" };

export default async function AccountSectionPage() {
  await requireControlsSession("/configuracoes/conta");
  redirect("/conta#entrar-e-recuperar");
}