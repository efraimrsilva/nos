"use client";

import { useId, type CSSProperties } from "react";
import { Check, Palette } from "lucide-react";
import { themes } from "./themes";
import { useTheme } from "./theme-provider";
import { ActionDialog } from "@/shared/components/ui/action-dialog";
import { AccountRow } from "@/features/controls/components/account-row";

export function ThemePicker() {
  const { theme, select, saving, message, error } = useTheme();
  const id = useId();
  return <div className="theme-picker">

    <fieldset className="theme-options"><legend className="sr-only">Escolher tema</legend>
      {themes.map(item => <label key={item.id} className="theme-option" style={{ "--preview-canvas": item.canvas, "--preview-surface": item.surface, "--preview-accent": item.accent, "--preview-ink": item.ink } as CSSProperties}>
        <input type="radio" name={`${id}-theme`} value={item.id} checked={theme === item.id} onChange={() => select(item.id)} aria-label={item.name} />
        <span className="theme-preview" aria-hidden="true"><span className="theme-preview-nav" /><span className="theme-preview-content"><span /><span /><i /></span></span>
        <span className="theme-option-title">{item.name}<Check size={16} aria-hidden="true" /></span><small>{item.description}</small>
      </label>)}
    </fieldset>
    {(message || error) && <div className="theme-save-feedback" aria-busy={saving}>
      <p role={error ? "alert" : "status"}>{message}</p>
      {error && !saving && <button type="button" className="ui-button-secondary" onClick={() => select(theme)}>Tentar salvar novamente</button>}
    </div>}
  </div>;
}

export function AppearanceOption({ className = "navigation-link" }: { className?: string }) {
  const { available } = useTheme();
  if (!available) return null;
  // Reutiliza o diálogo nativo para conter foco, fechar com Escape e devolver foco ao gatilho.
  return <span className="appearance-option"><ActionDialog title="Aparência" size="wide" variant={className === "navigation-link" ? "navigation" : "text"} className={className} trigger={className === "account-dialog-trigger" ? <AccountRow icon={Palette} title="Aparência" description="Escolher as cores do seu espaço" /> : <><Palette className="nav-icon tone-purple" size={20} aria-hidden="true" /><span>Aparência</span></>}><ThemePicker /></ActionDialog></span>;
}
