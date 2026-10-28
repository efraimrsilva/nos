import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireControlsSession } from "@/features/controls/access";

export const metadata: Metadata = { title: "Conta, Preferências e Ajuda" };

export default async function AccountSectionPage() {
  await requireControlsSession("/configuracoes");
  redirect("/conta");
}