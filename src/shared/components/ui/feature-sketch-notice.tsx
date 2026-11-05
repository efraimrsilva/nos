import type { ReactNode } from "react";
import { FlaskConical } from "lucide-react";
import "./feature-sketch-notice.css";

// Agenda e áreas de prévia compartilham o visual, com mensagens próprias sobre o que já funciona.
export function FeatureSketchNotice({ title, children }: { title: string; children: ReactNode }) {
  return <div className="prototype-notice preview-notice" role="note">
    <FlaskConical size={23} aria-hidden="true" />
    <div><strong>{title}</strong><p>{children}</p></div>
  </div>;
}
