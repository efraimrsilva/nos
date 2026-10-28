"use client";

import { useId, type CSSProperties } from "react";
import { Check, Palette } from "lucide-react";
import { themes } from "./themes";
import { useTheme } from "./theme-provider";
import { ActionDialog } from "@/shared/components/ui/action-dialog";

export function ThemePicker() {
  const { theme, select, saving, message, error } = useTheme();
  const id = useId();
  return <div className="theme-picker">
    <p className="ui-copy" id={`${id}-help`}>Escolha o que combina com você. O tema muda na hora e é salvo automaticamente na sua conta. Boas-vindas e login mantêm a aparência original.</p>
    <fieldset className="theme-options" aria-describedby={`${id}-help`}><legend className="sr-only">Escolher tema</legend>
      {themes.map(item => <label key={item.id} className="theme-option" style={{ "--preview-canvas": item.canvas, "--preview-surface": item.surface, "--preview-accent": item.accent, "--preview-ink": item.ink } as CSSProperties}>
        <input type="radio" name={`${id}-theme`} value={item.id} checked={theme === item.id} onChange={() => select(item.id)} aria-label={item.name} />
        <span className="theme-preview" aria-hidden="true"><span className="theme-preview-nav" /><span className="theme-preview-content"><span /><span /><i /></span></span>
        <span className="theme-option-title">{item.name}<Check size={16} aria-hidden="true" /></span><small>{item.description}</small>
      </label>)}
    </fieldset>
    <div className="theme-save-feedback" aria-busy={saving}>
      <p role={error ? "alert" : "status"}>{message || "Sua escolha vale para todos os seus Núcleos."}</p>
      {error && !saving && <button type="button" className="ui-button-secondary" onClick={() => select(theme)}>Tentar salvar novamente</button>}
    </div>
  </div>;
}

export function AppearanceOption({ className = "navigation-link" }: { className?: string }) {
  const { available } = useTheme();
  if (!available) return null;
  // Reutiliza o diálogo nativo para conter foco, fechar com Escape e devolver foco ao gatilho.
  return <span className="appearance-option"><ActionDialog title="Aparência" description="Seu espaço, com as suas cores." size="wide" variant={className === "navigation-link" ? "navigation" : "text"} className={className} trigger={<><Palette className="nav-icon tone-purple" size={20} aria-hidden="true" /><span>Aparência</span></>}><ThemePicker /></ActionDialog></span>;
}
