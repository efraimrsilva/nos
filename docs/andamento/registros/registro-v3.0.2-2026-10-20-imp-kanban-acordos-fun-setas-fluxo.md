# Registro — v3.0.2 — 2026-10-20 — Imp. de Kanban de Acordos com Fun. setas de fluxo

**Status:** concluído localmente. **Objetivo:** exibir setas no topo, centro e base entre colunas do Kanban do aplicativo, sem aumentar o espaço existente.

## Contexto e decisões

O protótipo já continha as três posições, mas o aplicativo renderizava somente a superior. Cada uma das três primeiras colunas agora renderiza três ícones decorativos com aria-hidden. A última coluna e a visualização exclusiva de Essência não recebem setas. Posicionamento absoluto conserva o intervalo de 20px; centro acompanha 50% da altura e base mantém margem de 23px. pointer-events:none impede interferência em cliques. Preservada a ocultação nas larguras intermediárias, em que o quadro usa duas linhas, e a lista mobile existente.

## Arquivos e integrações

- src/features/agreements/components/agreements-workspace.tsx: nove setas entre quatro colunas; identidade React por posição.
- src/features/agreements/agreements-layout.css: dimensão de 20px e posicionamento relativo à altura da coluna.
- package.json/package-lock.json: PATCH 3.0.2, sem mudança de dependências.
- Registros de continuidade atualizados. Demais alterações preexistentes preservadas.

## Validação e resultado

- npm.cmd run typecheck aprovado.
- Ensaio de geometria no Chromium com o CSS real e estrutura representativa do quadro: dez cenários, larguras 1440/1200/1101/900/701px e colunas de 430/800px, posições e ocultação intermediária aprovadas.
- Autorrevisão dos dois trechos alterados e diff --check focal aprovados. Não houve revisão independente, nova jornada autenticada nem build de produção nesta alteração visual.

**Limites e próximo passo:** atualizar Acordos no aplicativo para revisão visual no contexto real. Sem commit, push, deploy ou operação de banco.
