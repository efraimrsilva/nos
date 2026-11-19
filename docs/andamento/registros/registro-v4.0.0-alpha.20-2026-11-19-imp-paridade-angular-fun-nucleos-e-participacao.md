# Registro — v4.0.0-alpha.20 — 2026-11-19 — Imp. da paridade Angular com Fun. de Núcleos e participação

**Status:** concluída localmente. Branch `codex/migracao-angular`, base `24929b3`.

## Objetivo e decisões

Portar a apresentação das Telas 12, 13, 71 e 73 com base no código Next.js v3.11.1. Reutilizar o componente de ícones, os estilos existentes e os diálogos nativos. Uma biblioteca visual nova não era necessária para cartões, emblemas e confirmações.

## Arquivos e integrações

- `nuclei-list.html`, `nucleus-home.html` e `nuclei.css` recuperam capas com ícones, tipografia dos cartões, resumo e realces de participação. `nucleus-role-badge.ts` usa o papel já retornado pelo banco na lista e no Início.
- `nucleus-leave.ts` separa o aviso, a preferência de autoria e a confirmação. O atalho abre `/conta#privacidade`. Voltar permite continuar a revisão.
- O Atlas espelha a composição de saída e mantém diálogos e fichas. Criação, edição de identidade, detalhes de participação, saída e encerramento usam os diálogos existentes. Nomeação exige aceite da própria pessoa, e o banco revalida a permissão de operações administrativas.

## Validação e resultado

- O teste mostrou que o atalho de autoria faltava. Após a implementação, o percurso abriu Conta, voltou para a saída e concluiu com as permissões existentes. Foram verificados atualização entre sessões, rascunho de propósito mantido, nomeação, saída e encerramento em Chromium desktop e celular. Um teste de referência móvel falhou antes da mudança ao esperar a mensagem de nome atualizado. A execução do recorte atualizado passou.
- `npm run typecheck`, `npm run build` e `npm run test:db`. Seis testes Playwright e 257 verificações no banco local passaram. Os verificadores de integrantes, organização de Pessoas, MVP de Núcleos e guia Migração passaram no Atlas. A galeria tem 60 capturas em 1440 e 390 pixels. Alguns estados móveis anteriores usam a referência histórica A06 porque a captura da base não avançou até esses estados. [Galeria](../../wireframes/comparacoes/v4.0.0-alpha.20-2026-11-19-paridade-nucleos-tela-12-tela-13-tela-71-tela-73/index.html)

## Limites e próximo passo

Autorrevisão do diff, sem revisão independente. A versão permanece local. Retomar a paridade visual 07 em consulta e presença na Agenda.
