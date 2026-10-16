import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";

export function LoadingIndicator({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center gap-2">
      {/* O texto comunica o estado; o ícone respeita a preferência de movimento reduzido. */}
      <LoaderCircle size={18} aria-hidden="true" className="shrink-0 animate-spin motion-reduce:animate-none" />
      <span>{children}</span>
    </span>
  );
}
