# Registro — v3.10.5 — 2026-11-07 — Imp. de cartões de Núcleos com Fun. de contorno por papel

- Versão/status:3.10.5 PATCH, concluído localmente.
- Objetivo/contexto: usuário pediu contorno do bloco do Núcleo na mesma cor do papel exibido, para distinguir administração e participação.
- Requisitos/decisões: cartão administrativo usa color-leaf, a mesma cor do emblema administrativo no tema; participante usa #1B8044, a mesma cor fixa do seu emblema nos9 temas. Fundo e escudo preservados; texto/ícone continuam identificando o papel sem depender apenas de cor. Hover mantém contorno do participante.
- Implementação/integrações: CSS :has consulta o emblema já renderizado com o vínculo autenticado, evitando duplicar leitura/regra de autorização. Nenhuma consulta, permissão ou interação nova.
- Arquivos: src/app/layout-system.css; Atlas product.css/product-ui.js/index.html/screens.js; tests/authenticated/nuclei-summary.spec.ts; manifestos; contrato, estado e histórico.
- Validações: Chromium com CSS real em renderização isolada confirmou contorno igual ao texto para2 papéis ×9 temas ×2 larguras (1440/390), inclusive hover; Atlas desktop/mobile confirmado para ambos. Teste autenticado existente atualizado com asserções de contorno por tema/papel/hover, sem reexecução nesta alteração visual. Autorrevisão, sintaxe Atlas e diff check; build/suíte dispensados pela regra proporcional de estilo pontual de AGENTS.md.
- Resultado/limites: contorno comunica o papel acompanhando o emblema. Sem novo modal/dependência; sem nova sessão autenticada/aparelho físico ou garantia de contraste em todos os temas. Sem alteração de galerias históricas ou novo Brag por ajuste pontual.
- Próximo passo: conferência manual e commit das mudanças visuais pendentes quando solicitado. Ajuste de verde3.10.4 também continua sem commit; base3b4dbff preservada. Sem commit/push/deploy nesta solicitação.
