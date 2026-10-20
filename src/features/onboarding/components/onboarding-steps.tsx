export function OnboardingSteps({ current }: { current: 1 | 2 | 3 }) {
  return <ol className="onboarding-steps" aria-label="Etapas da criação do Núcleo">{["Escolher relação", "Definir propósito", "Convidar pessoas"].map((label, index) => <li key={label} aria-current={current === index + 1 ? "step" : undefined}><span>{index + 1}</span>{label}</li>)}</ol>;
}
