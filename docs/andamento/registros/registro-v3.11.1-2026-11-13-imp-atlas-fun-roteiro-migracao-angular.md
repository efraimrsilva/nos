# Registro — v3.11.1 — 2026-11-13 — Imp. de guia no Atlas com Fun. de roteiro de migração

**Status:** guia implementada localmente. Migração planejada.

**Objetivo e requisitos:** mostrar as 14 entregas em guia própria no Atlas vivo, registrar a arquitetura web responsiva e a sequência até o aplicativo nativo e planejar navegação interna Angular sem recarregar o documento nem substituir toda a tela por um indicador de espera.

**Decisões e integrações:** usar Angular como único frontend web, com Supabase e uma interface responsiva para computador e celular. Validar em prévia isolada e fazer a virada após a paridade. Reutilizar a compilação no Capacitor após estabilizar a web, primeiro para Android e depois para iOS. A guia apresenta resumos expansíveis e um link para a fonte detalhada. A tela atual do aplicativo serve de referência para a implementação futura.

**Arquivos:** Atlas `index.html`, `atlas.js`, `atlas.css`; verificador da guia, guia do Atlas, plano, registros de continuidade e manifestos de versão.

**Validação:** `verify-migration-view.mjs` passou em Chromium, com larguras de 1440 e 390 px. Conferiu teclado, 14 etapas, expansão, abertura direta, recarga, alternância de guia, impressão e ausência de erros. `verify-global-view.mjs` passou. `verify-mvp-view.mjs` falhou na mesma expectativa sobre Google e Apple no Atlas atual e no Git anterior (`c46ad54`).

**Limites e próximo passo:** a entrega é local e restrita ao Atlas e à documentação. A01 começa pela Tela 66 e pelo fluxo de perfil com Angular e Supabase local. [Plano](../planos/migracao-angular.md)
