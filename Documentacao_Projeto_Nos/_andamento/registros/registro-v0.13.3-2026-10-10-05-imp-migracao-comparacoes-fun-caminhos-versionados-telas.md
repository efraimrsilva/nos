# Registro — v0.13.3 — 2026-10-10 — Imp. de migração de comparações com Fun. de caminhos versionados e telas

**Status:** concluído e validado; inclusão no commit autorizado comprovada por inspeção do objeto na interação de publicação. Versão funcional preservada; controle no registro de sequência 06.

## Objetivo, contexto e requisitos

Usuário autorizou renomear as pastas existentes de comparações para o padrão com versão/data/assunto/tela e atualizar todas as referências aos caminhos. Git main em dbefcd3; alterações documentais das diretrizes anteriores preservadas. A autorização substitui a decisão anterior de manter os nomes históricos; evidências e versões das entregas continuam históricas.

## Decisões e nomes finais

Versão de cada pasta obtida na galeria/registro da entrega correspondente; não marcar evidência antiga com a versão atual. Identificadores correspondem às telas efetivamente comparadas. Visão global cobre as 72 telas e usa uma faixa contínua para evitar nome excessivamente longo e não atribuir à ferramenta um ID fictício do produto.

- v0.13.1-2026-10-07-conta-alinhamento-tela_01-tela_02
- v0.12.0-2026-10-07-conta-entrada-tela_01-tela_02-tela_03-tela_04-tela_05-tela_72
- v0.13.0-2026-10-07-sessao-navegacao-tela_01-tela_06-tela_12-tela_13
- v0.12.0-2026-10-07-visao-global-tela_01-a-tela_72
- v0.13.2-2026-10-09-recuperar-acesso-tela_04-tela_05
- v0.13.3-2026-10-10-entrar-convite-tela_10-tela_11

## Arquivos, integrações e revisão

Renomeadas seis pastas com 77 arquivos. Atualizadas referências em README, guia, cobertura, procedência, índice das galerias, página de Visão global, estado/histórico/Brag, contratos e registros anteriores. Caminhos de captura corrigidos em tests/authenticated/invitation-flow.spec.ts e session-navigation.spec.ts. Auxiliares locais ignorados em artifacts também atualizados; permanecem fora do conjunto versionável.

Conteúdo das imagens preservado. Uma página HTML tem ajuste de link entre galerias; nenhuma composição do aplicativo foi alterada. Segurança de renomeação: caminhos absolutos validados dentro de comparacoes/, origem presente e destino inexistente, operação por Rename-Item -LiteralPath. Autorrevisão dos caminhos e do diff; nenhuma revisão independente nova alegada.

## Validação, resultado e limites

Verificação executada: seis pastas, 77 arquivos, 76 arquivos com hash SHA-256 idêntico e uma página HTML com o link entre galerias atualizado. Todas as 71 imagens mantêm hash idêntico. Navegador carregou as seis galerias, decodificou suas imagens, percorreu oito opções de seletores e conferiu 18 links HTML locais; zero erros JavaScript ou requisições externas. Busca nos arquivos versionáveis e auxiliares ignorados, excluindo caches, confirmou ausência de referências ativas antigas; manifestos temporários de migração mantêm apenas o mapeamento de auditoria.

Alvos de links documentais e git diff --check aprovados. Playwright --list na configuração autenticada carregou 60 testes em seis arquivos, incluindo os dois arquivos com destinos atualizados; isso é conferência de carregamento, não execução dos testes. Suíte funcional, tipos e build não repetidos: esta migração preserva código do app, banco, manifestos e versão 0.13.3. Não foram geradas novas capturas para evitar sobrescrever a evidência histórica.

## Próximo passo

Aplicar o padrão na próxima galeria e manter caminhos de captura sincronizados. Diretrizes, migração e registros compõem a mesma unidade para commit quando autorizado. Próxima funcionalidade continua conforme estado vigente; sem commit, push ou deploy nesta tarefa.
