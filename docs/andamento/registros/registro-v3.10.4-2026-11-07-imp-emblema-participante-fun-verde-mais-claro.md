# Registro — v3.10.4 — 2026-11-07 — Imp. de emblema participante com Fun. de verde mais claro

- Versão/status:3.10.4 PATCH, concluído localmente.
- Objetivo/contexto/requisito: clarear um pouco a letra do participante, mantendo o mesmo tom nos9 temas, fundo compartilhado e ausência de escudo.
- Decisão/alteração: #16703A → #1B8044 no aplicativo e Atlas; teste existente atualizado para rgb(27,128,68). Sem outra mudança de comportamento ou integração.
- Arquivos: src/app/layout-system.css; Atlas product.css/product-ui.js/index.html; tests/authenticated/nuclei-summary.spec.ts; package.json/package-lock.json; contrato, estado e histórico.
- Validações/revisão: Chromium com CSS real do aplicativo em renderização isolada confirmou a cor no strong e fundo igual à classe-base nos9 temas do catálogo. Autorrevisão do diff e diff check. Build/suíte autenticada não repetidos por ajuste pontual de estilo, conforme AGENTS.md; teste alterado não reexecutado. Sem garantia nova de contraste em todos os temas.
- Resultado/limites: verde ligeiramente mais claro e uniforme. Sem novo modal, dependência ou gravação. Nenhuma galeria histórica alterada, sem novo Brag por ajuste pontual. Sem validação física ou nova sessão autenticada.
- Git/próximo passo: conjunto anterior confirmado no commit3b4dbff; esta correção é nova unidade pendente. Sugestão: style(nucleos): clarear texto do emblema participante. Sem commit/push/deploy nesta solicitação.
