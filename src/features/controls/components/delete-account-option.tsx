import { TriangleAlert } from "lucide-react";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { AccountRow } from "./account-row";
import { DeleteAccountForm } from "./delete-account-form";

export function DeleteAccountOption() {
  return <ActionDialog variant="text" className="account-dialog-trigger account-deletion-trigger" title="Apagar minha conta" description="Ação definitiva. Confira as consequências antes de confirmar." size="wide" trigger={<AccountRow icon={TriangleAlert} title="Apagar minha conta" description="Ação definitiva · exige confirmação por escrito" />}><DeleteAccountForm /></ActionDialog>;
}
