import { administerAgreement } from "../administration-actions";
import { AgreementActionForm } from "./agreement-action-form";

export function AgreementAdministration({ nucleusId, agreementId, status, termsVersion }: {
  nucleusId: string; agreementId: string; status: string; termsVersion: number;
}) {
  return <div className="agreement-administration">
    <p className="ui-copy">A administração organiza o ciclo. Cada pessoa continua decidindo sobre a própria participação.</p>
    {status === "pending" && <AgreementActionForm action={administerAgreement.bind(null, nucleusId, agreementId, "start_test", termsVersion)} label="Iniciar teste" confirmation="Iniciar o teste; cada pessoa decide se participa." />}
    {status === "testing" && <AgreementActionForm action={administerAgreement.bind(null, nucleusId, agreementId, "activate", termsVersion)} label="Ativar acordo" confirmation="Concluir o teste e manter o acordo ativo com participação individual." />}
    {["pending", "testing", "active"].includes(status) && <AgreementActionForm action={administerAgreement.bind(null, nucleusId, agreementId, "end", termsVersion)} label="Encerrar acordo" confirmation="Encerrar o acordo e impedir novos momentos; o histórico permanecerá." danger />}
  </div>;
}
