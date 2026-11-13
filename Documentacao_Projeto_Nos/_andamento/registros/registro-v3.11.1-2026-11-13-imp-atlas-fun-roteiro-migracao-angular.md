# Registro — v3.11.1 — 2026-11-13 — Imp. de guia no Atlas com Fun. de roteiro de migração

**Status:** guia implementada localmente. Migração planejada.

**Objetivo e requisitos:** mostrar as 14 entregas em guia própria no Atlas vivo, registrar a comparação de estratégias e planejar navegação interna Angular sem recarregar o documento nem substituir toda a tela por um indicador de espera.

**Decisões e integrações:** usar Angular com Supabase, validar em prévia isolada e fazer uma virada após a paridade. O plano compara Module Federation, single-spa e Web Components. A guia apresenta resumos expansíveis e um link para a fonte detalhada. A tela atual do aplicativo serve de referência para a implementação futura.

**Arquivos:** Atlas `index.html`, `atlas.js`, `atlas.css`; verificador da guia, guia do Atlas, plano, registros de continuidade e manifestos de versão.

**Validação:** `verify-migration-view.mjs` passou em Chromium, com larguras de 1440 e 390 px. Conferiu teclado, 14 etapas, expansão, abertura direta, recarga, alternância de guia, impressão e ausência de erros. `verify-global-view.mjs` passou. `verify-mvp-view.mjs` falhou na mesma expectativa sobre Google e Apple no Atlas atual e no Git anterior (`c46ad54`).

**Limites e próximo passo:** a entrega é local e restrita ao Atlas e à documentação. A01 começa pela Tela 66 e pelo fluxo de perfil com Angular e Supabase local. [Plano](../planos/migracao-angular.md)
