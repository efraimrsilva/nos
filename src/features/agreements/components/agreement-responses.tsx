"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getAgreementResponseCounts, type AgreementResponseCount } from "../response-counts";

const Responses = createContext<{ counts: AgreementResponseCount[]; error?: string }>({ counts: [] });
export function AgreementResponsesProvider({ nucleusId, agreementIds, children }: { nucleusId: string; agreementIds: string[]; children: ReactNode }) {
  const [state, setState] = useState<{ counts: AgreementResponseCount[]; error?: string }>({ counts: [] });
  const idsKey = agreementIds.join(",");
  useEffect(() => {
    let disposed = false, inFlight = false;
    setState({ counts: [] });
    const ids = idsKey ? idsKey.split(",") : [];
    if (!ids.length) return;
    async function update() {
      if (disposed || inFlight || document.hidden) return;
      inFlight = true;
      try {
        const result = await getAgreementResponseCounts(nucleusId, ids);
        if (!disposed) setState(previous => ({ counts: result.counts ?? previous.counts, error: result.error }));
      } catch {
        if (!disposed) setState(previous => ({ ...previous, error: "Não foi possível atualizar as participações. Tentaremos novamente." }));
      } finally { inFlight = false; }
    }
    // Uma consulta por página a cada três segundos; sem sobreposição e sem remontar formulários.
    void update();
    const timer = window.setInterval(() => { void update(); }, 3000);
    document.addEventListener("visibilitychange", update);
    return () => { disposed = true; window.clearInterval(timer); document.removeEventListener("visibilitychange", update); };
  }, [nucleusId, idsKey]);
  return <Responses.Provider value={state}>{children}</Responses.Provider>;
}
export function AgreementResponses({ agreementId }: { agreementId: string }) {
  const { counts, error } = useContext(Responses);
  const count = counts.find(item => item.agreement_id === agreementId);
  return <span className="agreement-responses" aria-live="polite" aria-atomic="true">
    {count ? `${count.accepted} ${count.accepted === 1 ? "pessoa aceitou" : "pessoas aceitaram"} participar · ${count.pending} a decidir · ${count.declined} ${count.declined === 1 ? "recusa" : "recusas"}` : error ? "Participações indisponíveis no momento." : "Consultando participações…"}
    {error && count && <small>Não foi possível atualizar agora.</small>}
  </span>;
}
