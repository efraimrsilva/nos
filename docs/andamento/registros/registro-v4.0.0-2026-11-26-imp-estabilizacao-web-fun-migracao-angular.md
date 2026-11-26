# Registro — v4.0.0 — 2026-11-26 — Imp. de estabilização web com Fun. de migração Angular

**Versão** 4.0.0

**Status** Concluído e validado por aceite do usuário.

## Objetivo e contexto

Encerrar a migração Angular, a paridade de interface com a referência do Atlas v3.11.1 e a Fase 1 · Estabilização da web Angular. O usuário confirmou a conclusão e a validação dos três itens em 26/11/2026.

## Requisitos e decisão

Sinalizar o aceite na guia Migração, preservar as evidências por passo e sincronizar a versão. O plano prevê 4.0.0 para o marco estável. A versão anterior nos manifestos era 4.0.0-alpha.34.

## Arquivos e integrações

Manifestos e arquivos de trava de dependências na raiz e em apps/web, guia Migração e seu verificador, guia geral do Atlas, plano de migração, plano do MVP, mapa da stack, README e registros de continuidade. A entrega altera status e metadados de versão e preserva os contratos de integração.

## Validações, resultado e limites

A confirmação do usuário é a evidência do aceite da fase. As evidências anteriores permanecem vinculadas aos respectivos passos no [Atlas](../../wireframes/atlas/index.html#migracao). A nova versão foi preparada no código local, com publicação pendente.

- Verificadores `verify-migration-view.mjs` e `verify-mvp-view.mjs` aprovados com Playwright e Chrome instalado. A guia Migração foi conferida a 1440 e 390 px. O verificador do MVP confirmou 73 fichas e ausência de erros. O download do Chromium padrão foi recusado pela rede.
- Autorrevisão do diff, `git diff --check`, seis campos de versão nos quatro manifestos e arquivos de trava, versão no Atlas e estado, e dez novos links locais conferidos.

## Próximo passo

Preparar o inventário dos comandos e do artefato Angular para a [Fase 2 · Nx e automação](../planos/migracao-angular.md#fase-2--introduzir-nx).
