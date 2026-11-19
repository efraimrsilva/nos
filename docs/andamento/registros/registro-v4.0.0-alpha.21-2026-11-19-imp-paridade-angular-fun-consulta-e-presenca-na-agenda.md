# Registro — v4.0.0-alpha.21 — 2026-11-19 — Imp. da paridade Angular com Fun. de consulta e presença na Agenda

**Status:** concluída localmente. Branch `codex/migracao-angular`, base `13c0845`.

## Objetivo e decisões

Aproximar as Telas 14 e 15 da referência Next.js v3.11.1. O seletor mensal Angular já atende à navegação, aos marcadores e ao teclado. Cartões e controles nativos resolvem os ajustes de apresentação e acessibilidade com a estrutura existente.

## Arquivos e integrações

- `calendar-page.html`, `calendar-page.ts`, `calendar-page.css` e `calendar-month.css` reorganizam o mês e ano, reforçam a visão móvel e mostram data, fuso, quantidade de participantes e resposta própria no detalhe.
- Os botões de presença refletem o valor retornado pelo Supabase em `aria-pressed` e no estilo selecionado. O aviso de gravação não antecipa o valor da próxima leitura. Consulta e permissões de gravação permanecem no banco.
- O Atlas demonstra a seleção da resposta com dados de exemplo. As fichas apontam a validação, e a guia Migração avança para o passo 08.

## Validação e resultado

O teste inicialmente falhou por falta do estado acessível da resposta. Depois, em computador e celular, confirmou marcadores, navegação por teclado, carregamento, falha de leitura, recuperação, presença preservada ao reabrir e bloqueio para conta sem vínculo. Também passou pela regressão de remarcação e remoção. Build e tipos Angular, dois testes Playwright, 257 testes do banco local e verificadores do Atlas aprovados. [Antes, depois e Atlas](../../wireframes/comparacoes/v4.0.0-alpha.21-2026-11-19-paridade-agenda-tela-14-tela-15/index.html)

## Limites e próximo passo

Autorrevisão do diff. A versão permanece local. Recorrência e calendários externos seguem previstos. Retomar o passo 08, criação, edição e remoção.
