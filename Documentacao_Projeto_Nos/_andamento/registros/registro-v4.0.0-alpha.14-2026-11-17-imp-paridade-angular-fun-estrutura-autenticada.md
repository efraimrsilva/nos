# Registro — v4.0.0-alpha.14 — 2026-11-17 — Imp. de paridade Angular com Fun. de estrutura autenticada

**Status:** estrutura do passo 03 validada localmente. Os controles incorporados ao painel de perfil e o lembrete de suporte seguem pendentes.

**Objetivo e referência:** portar cabeçalho, navegação e avisos a partir do Next.js v3.11.1 (`604a142`). O Atlas é a conferência visual das fichas 12, 13, 60 e 66. [Mapa de arquivos por passo](../planos/paridade-angular-fontes.md)

**Decisões e integração:** grupos, destinos, área pai, totais e último Núcleo seguem ApplicationShell e OnboardingShell. Revalidar o vínculo antes de restaurar o nome. O painel de perfil e as notificações usam popovers nativos com clique externo, Escape e X; o menu Mais continua diálogo nativo. No celular, o perfil leva à Conta. O acesso rápido de troca de Núcleo abre a lista e reaproveita a seleção existente. O Tailwind 4 usa o plugin PostCSS já instalado na raiz. Os utilitários da estrutura não ativam o reset global.

**Arquivos:** `apps/web/src/app/app.*`, `navigation-links.ts`, `shell-navigation.css`, ícones e atalho de suporte, entrada de estilos Angular e configuração PostCSS. Atlas e manifestos atualizados.

**Validação:** tipos e build Angular aprovados. Playwright de navegação e perfil com nove aprovações e uma dispensa no desktop por ser do menu móvel. A troca real entre dois Núcleos descartáveis foi conferida em desktop e celular, sem transbordamento. [Galeria com 17 imagens](../../wireframes/comparacoes/v4.0.0-alpha.14-2026-11-17-angular-estrutura-tela_12-tela_13-tela_60-tela_66/index.html)

**Limites e próximo passo:** o painel reúne atalhos para os controles existentes. Os formulários incorporados ao painel, o lembrete de suporte e a montagem equivalente do Mais ainda precisam ser comparados com AccountPreferences e ProblemReportReminder antes de encerrar todo o passo 03. Sem publicação ou mudança de esquema.
