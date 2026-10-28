import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireControlsSession } from "@/features/controls/access";

export const metadata: Metadata = { title: "Ajuda e suporte" };

export default async function AccountSectionPage() {
  await requireControlsSession("/ajuda");
  redirect("/conta#ajuda-e-suporte");
}