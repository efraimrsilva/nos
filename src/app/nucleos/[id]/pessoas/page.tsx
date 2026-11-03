import { notFound, redirect } from "next/navigation";
import { uuid } from "@/features/agreements/habit-access";
// Compatibilidade com favoritos antigos; o destino revalida sessão e participação.
export default async function PeoplePage({ params }: { params: Promise<{ id: string }> }) {
const { id } = await params;
if (!uuid.test(id)) notFound();
redirect(`/nucleos/${id}?integrantes=1`);
}
