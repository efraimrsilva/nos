"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export function AgreementsHowItWorks({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  const contentId = useId();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manuallyToggled = useRef(false);

  useEffect(() => {
    // A visualização desktop pode mudar sem reiniciar os cinco segundos desta entrada na área.
    if (!manuallyToggled.current) timer.current = setTimeout(() => setExpanded(false), 5000);
    return () => { if (timer.current !== null) clearTimeout(timer.current); };
  }, []);

  return <div className="agreements-how">
    <button type="button" className="agreements-how-toggle" aria-expanded={expanded} aria-controls={contentId} onClick={() => {
      manuallyToggled.current = true;
      if (timer.current !== null) clearTimeout(timer.current);
      setExpanded(current => !current);
    }}>Como funciona<ChevronRight size={16} aria-hidden="true" /></button>
    <div id={contentId} className={`agreements-how-content${expanded ? "" : " is-collapsed"}`} aria-hidden={!expanded} inert={!expanded}>
      <div>{children}</div>
    </div>
  </div>;
}
