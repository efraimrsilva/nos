# Registro — v3.10.3 — 2026-11-07 — Imp. de emblema participante com Fun. de verde fixo nos temas

- Versão/status:3.10.3 PATCH, concluído localmente.
- Objetivo/contexto: usuário pediu letra verde mais perceptível e garantiu como requisito o mesmo tom em todos os temas; complementa3.10.2.
- Requisitos/decisão: cor fixa #16703A no participante, incluindo temas escuros, sem alteração de fundo/escudo. Removida variação por tema inicialmente considerada. Administrativo preservado. O fundo continua herdado da classe-base.
- Arquivos: src/app/layout-system.css; Atlas product.css/product-ui.js/index.html; teste tests/authenticated/nuclei-summary.spec.ts; manifestos; contrato de navegação/estado/histórico.
- Integrações: apenas CSS do emblema compartilhado entre Home e cartões; sem consulta ou regra de negócio nova.
- Validação: Playwright/Chromium com CSS real do aplicativo em renderização isolada confirmou color rgb(22,112,58) no strong e fundos iguais ao emblema-base em todos os9 temas cadastrados: light,dark,black,rose,lavender,ocean,forest,solar,neon. Regra Atlas usa o mesmo hexadecimal. Teste autenticado existente atualizado para percorrer o catálogo de temas e conferir a mesma cor, mas não reexecutado nesta correção visual. Autorrevisão e diff check; sem novo build por exceção de estilo pontual do AGENTS.md.
- Resultado: texto verde uniforme em todos os temas, sem escudo e com fundo compartilhado. Cor fixa por solicitação explícita, sem ajuste automático de luminosidade/contraste nos temas escuros. Nenhuma alegação de aprovação de contraste uniforme.
- Limites/próximo passo: sem nova sessão autenticada ou validação física; estilos reais verificados isoladamente. Conferência manual quando desejado e commit do conjunto somente quando solicitado. Sem commit/push/deploy. Nenhuma galeria histórica alterada; sem novo Brag por ajuste pontual.
