export const themes = [
  { id: "light", name: "Claro — Jardim", description: "A leveza original do Nós.", canvas: "#f5f7f1", surface: "#fffefa", accent: "#345d44", ink: "#293e35", muted: "#657368", line: "#dce3d6", soft: "#e6eddf", hero: "#e9efdf", nav: "#fafbf6" },
  { id: "dark", name: "Escuro — Anoitecer", description: "Tons profundos e acolhedores.", canvas: "#111916", surface: "#1a2420", accent: "#a3d7b5", ink: "#e6eee8", muted: "#a5b7ac", line: "#40544a", soft: "#293d31", hero: "#25392d", nav: "#16201b" },
  { id: "black", name: "Preto — Meia-noite", description: "Preto de verdade, com detalhes sutis.", canvas: "#101312", surface: "#000000", accent: "#a8dfbc", ink: "#f1f3f2", muted: "#b2bab6", line: "#414a45", soft: "#1d3024", hero: "#16251c", nav: "#000000" },
  { id: "rose", name: "Rosé — Aurora", description: "Rosa suave e detalhes em vinho.", canvas: "#fff5f7", surface: "#fffafd", accent: "#9d365d", ink: "#492932", muted: "#785563", line: "#e8cbd5", soft: "#f8e4ec", hero: "#f6e0e8", nav: "#fff8fa" },
  { id: "lavender", name: "Lilás — Lavanda", description: "Delicadeza com toques de violeta.", canvas: "#f6f3ff", surface: "#fffcff", accent: "#705099", ink: "#342947", muted: "#6d5b80", line: "#ded2ec", soft: "#ece4f7", hero: "#e8def5", nav: "#faf7ff" },
  { id: "ocean", name: "Azul — Oceano", description: "Azul sereno para o seu espaço.", canvas: "#eef6fc", surface: "#fbfdff", accent: "#23658e", ink: "#213d52", muted: "#536d80", line: "#cadde9", soft: "#deedf7", hero: "#d9eaf5", nav: "#f5faff" },
  { id: "forest", name: "Verde — Floresta", description: "Natureza e detalhes em esmeralda.", canvas: "#edf5ee", surface: "#fcfefb", accent: "#2e6741", ink: "#243d2b", muted: "#546d5b", line: "#ccdfce", soft: "#dceede", hero: "#d5e9d9", nav: "#f3f9f2" },
  { id: "solar", name: "Solar — Âmbar", description: "Areia dourada e detalhes em cobre.", canvas: "#fff1d6", surface: "#fffaf0", accent: "#99501b", ink: "#4a2f1c", muted: "#795b3c", line: "#dfc18e", soft: "#f4dfb6", hero: "#f1d498", nav: "#f7e4bc" },
  { id: "neon", name: "Noturno — Neon", description: "Azul da noite com energia verde-lima.", canvas: "#080c20", surface: "#111831", accent: "#c4f34a", ink: "#e8efff", muted: "#b1badd", line: "#3e4b78", soft: "#222d4b", hero: "#1a2346", nav: "#0b1029" },
] as const;

export type ThemeId = typeof themes[number]["id"];
export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && themes.some(theme => theme.id === value);
}
export function resolveTheme(value: unknown): ThemeId {
  return isThemeId(value) ? value : "light";
}
