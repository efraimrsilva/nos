# Registro — v3.3.3 — 2026-10-30 — Imp. de Conta com Fun. atalhos de convite

Status: concluído localmente. Versão: 3.3.3.

## Objetivo, contexto e requisitos
Pedido complementar à entrega de convite no cabeçalho: incluir Entrar com convite em Conta e Núcleos nas opções do perfil e na página Conta, Preferências e Ajuda.

## Decisões, arquivos e integrações
AccountPreferences é compartilhado: um Link para routes.invitation atende ao painel desktop e à página completa. Arquivo src/features/controls/components/account-preferences.tsx; mesma composição em wireframes/atlas/product-ui.js; tests/authenticated/nuclei-layout.spec.ts; contrato navegacao-sessao.md e teste de caixa preta M05-PER-009. Sem dependências, banco, novos modais ou associação automática. Validações de acesso e aceite existentes preservadas.

## Validação e resultado
Tipos e build aprovados após alteração. Quatro testes autenticados aprovados, cobrindo cabeçalho, /conta em desktop/celular e painel desktop; navegação real para /comecar/convite e fechamento do painel aprovados. Capturas inspecionadas. Autorrevisão do componente compartilhado e destinos. Sem revisão independente. Antes atual de conta/perfil não capturado; galeria indica essa limitação, sem fabricar evidência. Teste de caixa preta do usuário Não executado.

## Limites e próximo passo
Sem commit, push ou deploy. Conferir os atalhos com a própria conta; manter a mudança no conjunto v3.3.3 de convite no cabeçalho.

[Galeria das telas 12/13/66](../../wireframes/comparacoes/v3.3.3-2026-10-30-convites-tela_12-tela_13-tela_66/index.html).

Verificação final: Visão global aprovada (73 telas, composições compartilhadas, teclado/mobile/hash/impressão, zero erros); git diff --check aprovado. Versão 3.3.3 sincronizada nos manifestos, README, estado e identificação do Atlas.
