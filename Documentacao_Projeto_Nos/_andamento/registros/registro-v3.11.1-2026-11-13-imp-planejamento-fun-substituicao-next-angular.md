# Registro — v3.11.1 — 2026-11-13 — Imp. de planejamento com Fun. de substituição do Next.js

**Status:** plano concluído, migração ainda planejada.

**Objetivo e contexto:** decompor a troca completa do Next.js em entregas pequenas, a partir da avaliação anterior de Angular e NestJS. Preservar a navegação, as funcionalidades e as integrações atuais.

**Decisões e integrações:** Angular como interface, NestJS como API modular e Supabase para autenticação, banco e políticas existentes. Validar cada fluxo em prévia isolada, trocar a produção após paridade e retirar o Next.js em unidade própria. Preservar as URLs dos retornos de autenticação e do receptor de avisos de cadastro.

**Arquivos afetados:** plano de migração, estado, histórico e este registro. Aplicativo, Atlas e manifestos seguem na v3.11.1. A avaliação anterior continua como referência da decisão.

**Validação e resultado:** inventário do código comparado com as unidades do plano, consulta de documentação primária e Context7, revisão documental e conferência de links. O plano distribui as 32 páginas e as quatro rotas de servidor em entregas com dependências e aceites. A hospedagem e a sessão ainda precisam de ensaio técnico. Sem execução de build, testes do aplicativo ou publicação nesta etapa documental.

**Próximo passo registrado à época:** A01, edição do nome como primeira entrega completa em ambiente local. A arquitetura deste registro foi substituída na v3.11.2. [Plano vigente](../planos/migracao-angular.md) · [Avaliação anterior](registro-v3.11.1-2026-11-13-imp-avaliacao-fun-migracao-angular.md)
