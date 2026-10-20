# Registro — v3.0.3 — 2026-10-20 — Imp. de publicação do layout com Fun. consolidação da interface e Agenda

**Status:** validado localmente e inclusão no commit comprovada; push autorizado. **Autorização:** commit e push abrangentes do trabalho desenvolvido, na branch codex/novo-layout; sem merge/deploy ou banco remoto. **Base:** de44ca8. **Versão:** 3.0.3, PATCH pela correção da colisão visual encontrada na revisão de publicação.

## Escopo consolidado

- Reconstrução integral da apresentação desktop/mobile: navegação, Conta/entrada, Núcleos/Início, Acordos/Kanban/Painéis/detalhes, Agenda, Pessoas/Convites e controles.
- Diálogos contextuais acessíveis, foco/retorno, confirmações existentes no servidor, carregamentos/erros e movimento reduzido; inventário de modais no Atlas.
- Árvore original restaurada somente na Conta sem sessão, frases de dez segundos com pausa/sorteio e três níveis de setas do Kanban.
- Esboços protegidos de Árvore/Memórias/Conexões/Perfis/Manifesto/Cuidado, sem persistência simulada. Evolução individual permanece planejada e não é comprovada por categoria global.
- Scripts locais de desenvolvimento/inicialização com autoridades de certificado do sistema, sem desativar validação TLS (Transport Layer Security).
- Atlas, comparações/capturas, documentação, manifestos e testes sincronizados; materiais históricos reorganizados sem apagar seu conteúdo.

## Correção na revisão final

A distribuição anterior de eventos considerava apenas a distância entre inícios. Eventos longos sobrepostos podiam ocupar a mesma faixa. calendar-lanes.ts agora agrupa interseções visuais, distribui faixas livres e mantém largura uniforme por grupo. A integração usa altura definida e overflow:hidden; o nome acessível inclui título/Núcleo/horários e o detalhe conserva o conteúdo completo. Três testes cobrem sobreposição longa, grupos transitivos, reutilização, adjacência, empates e ordem. A implementação ausente foi demonstrada por falha de importação antes da criação do módulo; não se declara teste de asserção vermelho da fórmula anterior.

## Arquivos e integrações

Fontes em src/app, src/shared/components e src/features; testes gerais/autenticados; scripts de validação/captura; package.json/package-lock.json; Atlas e documentação. Novos arquivos desta correção: src/features/calendar/calendar-lanes.ts e tests/layout-calendar-lanes.spec.ts; integração em calendar-workspace.tsx/calendar-workspace.css.

## Verificação e limites

Revisão estática independente da entrega e reconferência da correção concluídas, sem achados pendentes nesse escopo. Três testes unitários e tipos aprovados. Verificadores do Atlas MVP/Global/percurso05/fidelidade aprovados:73 telas,207 ações,365 estados,41 referências e20 contextos modais, sem erros/chamadas externas. Build webpack final 3.0.3 e 128 testes gerais aprovados no servidor de produção da cópia local; 128 arquivos de fontes/recursos e cinco configurações conferidos por SHA-256/conteúdo. Configuração temporária de testes removida após a execução. 905 referências locais de Markdown conferidas, sem destinos ausentes; diff --check aprovado. Os34 materiais históricos movidos foram comparados com HEAD:30 idênticos em bytes e quatro somente com normalização de fim de linha. Suíte autenticada anterior foi validada no Supabase local e consta do registro3.0.0; backend local está encerrado e não será reaberto nem se presume nova prova autenticada nesta publicação.

**Resultado/próximo passo:** conferir caminhos exatos e árvore Git, publicar a branch e confirmar hash remoto. Evidência definitiva de commit/igualdade será reportada ao usuário; registros anteriores de pendência ficam substituídos somente após prova de inclusão. Esta publicação não certifica deploy, migração remota, SMTP (Simple Mail Transfer Protocol) ou recebimento externo.

## Comprovação de inclusão

Os804 caminhos da unidade foram conferidos no commit inicial e41d2058f81e90781b2b9646ae1eded49a5009fe, árvore 4edb38434da2bef47a63c9eb30aef3cfabc06e2e, igual ao índice preparado. Registros de controle incorporados à mesma unidade antes do push. Pendências anteriores de commit desta entrega substituídas por essa prova. O hash definitivo e a igualdade com a branch remota serão informados no encerramento, sem tratar diretório limpo como prova isolada.
