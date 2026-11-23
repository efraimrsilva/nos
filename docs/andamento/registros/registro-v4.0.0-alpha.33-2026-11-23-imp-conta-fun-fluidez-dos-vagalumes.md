# Registro — v4.0.0-alpha.33 — 2026-11-23 — Imp. da Conta com Fun. de fluidez dos vagalumes

**Objetivo e escopo.** Reduzir as travadas da subida dos vagalumes em telas pequenas.

**Decisões, arquivos e integração.** `account-story.css` e `product.css` passam a animar a transformação e a opacidade. O deslocamento proporcional usa uma faixa da altura da árvore. O sorteio dos trajetos, a pausa e o movimento reduzido foram preservados.

**Validação, resultado e limites.** Diff conferido na entrega original. Testes dispensados a pedido do usuário. Benefício esperado: evitar recálculo de posição a cada quadro. Fluidez em dispositivo real não medida. Mudança contida em `c0f1e7d6`.
