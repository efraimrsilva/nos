import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireControlsSession } from "@/features/controls/access";

export const metadata: Metadata = { title: "Privacidade" };

export default async function AccountSectionPage() {
  await requireControlsSession("/configuracoes/privacidade");
  redirect("/conta#privacidade");
}