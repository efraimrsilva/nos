import { OnboardingShell } from "@/features/onboarding/components/onboarding-shell";
import type { Metadata } from "next";
import { AccessHeading } from "@/features/auth/components/access-heading";
import { EmailActionForm } from "@/features/auth/components/access-forms";
import { safeAuthNext } from "@/features/auth/input";

export const metadata: Metadata = { title: "Confirmar e-mail" };
export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const next = safeAuthNext((await searchParams).next);
  return <OnboardingShell><AccessHeading title="Confirmar e-mail" subtitle="Um pequeno passo para proteger sua conta." next={next} /><EmailActionForm kind="confirmation" next={next} /></OnboardingShell>;
}
