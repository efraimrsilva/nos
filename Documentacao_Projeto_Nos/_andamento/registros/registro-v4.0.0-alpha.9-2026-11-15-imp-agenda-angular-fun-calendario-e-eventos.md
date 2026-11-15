# Registro — v4.0.0-alpha.9 — 2026-11-15 — Imp. de Agenda Angular com Fun. de calendário e eventos

**Status:** validado na prévia local. Linha Next.js v3.11.1. Sem publicação ou nova migração de dados.

**Objetivo e escopo:** A09 do [plano](../planos/migracao-angular.md), telas 14–17 em `/nucleos/:id/agenda`. Mês e ano em português, seleção por teclado, grade semanal em Tempo Universal Coordenado (UTC), lista móvel, 50 eventos por página e acesso pelo Início e pela navegação contextual. Abrir, criar, responder, editar e remover eventos conforme a participação no Núcleo.

**Decisões:** manter Angular 22 e Supabase. O seletor do Angular Material oferece calendário e teclado, mas traz dependência e estilos para adaptar ao projeto. O seletor nativo de data não expõe a grade mensal e os marcadores exigidos. O componente local usa controles do navegador e reaproveita a validação e o cálculo de faixas do Next.js. Documentação do Angular 22 consultada no Context7, com compilador instalado na versão 22.2.6; Octocode 19.1.0 consta configurado, sem pesquisa avançada necessária.

**Integrações e limites:** o Supabase valida a sessão e o vínculo, mascara autoria e aplica permissões e travas nas rotinas existentes. A edição textual conserva respostas; trocar início ou término pede nova resposta aos demais. As funções atuais serializam gravações, mas não recebem uma versão do horário mostrado em outra aba; a Agenda reflete uma leitura que pode precisar de atualização. Recorrência, visão diária detalhada e calendários externos seguem planejados.

**Modais:** **Adicionar evento** (16) abre pelo botão Novo momento para integrantes; grava evento e participação inicial após validação. **Editar evento** (17) abre no detalhe para autor associado ou administração; salva as alterações e informa a regra de remarcação. **Remover evento** (17) exige a mesma permissão e ciência explícita; Manter cancela, confirmar remove o evento e suas respostas. X, Escape e gesto externo fecham os três diálogos. A Tela 15 mantém resposta em linha.

**Arquivos:** `apps/web/src/app/calendar/`, rota e navegação compartilhada, resumo do Início, manifestos da prévia, `tests/angular/calendar.spec.mjs`, modo vivo e guia Migração do Atlas, verificador da Agenda e contratos.

**Validação:** análise de tipos e compilação aprovadas no Angular e no Next.js. Playwright Angular: 9 aprovados e 1 teste exclusivo de celular omitido no projeto desktop. Foram incluídos Agenda e regressão da navegação. O teste confirmou a ausência da rota antes da implementação. Depois, Chromium em desktop e celular com contas descartáveis: mês/ano, teclado, atalho do Início, horários, resposta, remarcação, confirmação e isolamento. Banco local: 257 verificações e quatro rotinas submetidas a teste de travas. Atlas verificado com os três diálogos, guia Migração, plano do produto mínimo viável, Visão global e paridade. Links da galeria conferidos: 30 imagens. Revisão independente encontrou a largura da barra móvel e o suporte a fuso legado na edição; ambos tratados. [Galeria A09](../../wireframes/comparacoes/v4.0.0-alpha.9-2026-11-15-angular-agenda-tela_14-tela_15-tela_16-tela_17/index.html).

**Instrução para reteste:** inicie a [prévia](../../../apps/web/README.md), entre em um Núcleo de teste e abra **Abrir agenda**. Use duas contas associadas para observar a conservação da presença após edição textual e nova pendência após remarcação. As capturas são de Chromium simulado; não houve uso de aparelho físico nem validação da Agenda Angular em produção.

**Próximo passo:** A10. Inspecionar Conta, Preferências e Ajuda no Atlas e portar temas, privacidade, exclusão de conta e suporte.
