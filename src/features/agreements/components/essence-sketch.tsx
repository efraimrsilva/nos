import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { FeatureSketchNotice } from "@/shared/components/ui/feature-sketch-notice";

function SketchNotice() {
  // O mesmo componente e informe de Manifesto identificam toda a prévia como ilustrativa.
  return <FeatureSketchNotice title="Esboço de funcionalidade · ainda não desenvolvido">Exemplos ilustrativos. As interações só mudam esta prévia; nada é salvo, enviado ou publicado.</FeatureSketchNotice>;
}

export function EssenceSketch() {
  return <div className="agreements-essence-sketch">
    <SketchNotice />
    <h3>Cada prática tem seu tempo.</h3>
    <p>A passagem de Hábito para Essência ainda é um esboço. Critérios e consentimentos serão definidos antes da implementação.</p>
    <ActionDialog title="Nossa Essência" trigger="Ver esboço de Essência" variant="secondary">
      <SketchNotice />
      <h3 className="ui-subtitle">O cuidado que virou jeito de ser.</h3>
      <p className="ui-copy">Uma ideia de espaço para reconhecer práticas amadurecidas, com escolha e consentimento de cada pessoa.</p>
      <blockquote className="agreement-description">“Conversamos com presença.” · frase ilustrativa</blockquote>
      <p className="ui-copy">Proposta → Hábito → Essência. As passagens individuais estão em planejamento. Nenhuma pessoa é promovida por tempo, registros ou resposta de terceiros.</p>
    </ActionDialog>
  </div>;
}
