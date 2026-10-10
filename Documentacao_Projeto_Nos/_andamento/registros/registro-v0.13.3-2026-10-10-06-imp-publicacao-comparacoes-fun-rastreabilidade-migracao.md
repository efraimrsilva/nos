# Registro — v0.13.3 — 2026-10-10 — Imp. de publicação de comparações com Fun. de rastreabilidade da migração

**Status:** conjunto validado, commitado e inspecionado; push normal autorizado, com verificação remota no encerramento. Versão funcional 0.13.3 preservada.

## Objetivo, contexto e escopo

Publicar em main um único commit abrangendo diretrizes de nomes, migração das seis galerias históricas e atualização dos caminhos. Autorização explícita do usuário nesta interação. Fetch confirmou main/origin/main iguais sobre dbefcd3. Registros de sequência 03/04/05 fazem parte da mesma unidade; não há nova funcionalidade do aplicativo.

## Conteúdo e decisões

Padrão v<versão>-AAAA-MM-DD-assunto-tela_<número>, IDs estáveis do atlas, múltiplas telas identificadas no final, faixa contínua completa para Visão global e revisão no assunto em caso de colisão. Galerias históricas conservam a versão de sua entrega, datas e evidências; versões v0.12.0 a v0.13.3 não são reclassificadas. Renomeadas seis pastas/77 arquivos.

Atualizados índice, guia, cobertura, procedência, README, contratos, estado, histórico, Brag, registros anteriores, link entre galerias e caminhos de capturas em dois testes autenticados. Auxiliares locais também ajustados, mas artifacts permanece ignorado e fora do commit. Credenciais, caches, dependências, builds e resultados de execução excluídos. Código do app, banco e manifestos preservados.

## Validação e revisão

Verificação repetida nesta publicação: 76 arquivos migrados com hash idêntico, incluindo todas as 71 imagens; único HTML modificado corrige link entre galerias. Seis galerias carregadas, oito opções de seletores e 18 links HTML locais conferidos; zero erros JavaScript/rede externa. Busca de referências ativas antigas sem ocorrência nos arquivos pesquisados, excluindo caches e manifesto temporário de auditoria. Links documentais e git diff --check aprovados.

Playwright --list com configuração autenticada carregou 60 testes em seis arquivos, sem executar casos ou gerar capturas. Suíte funcional/tipos/build não repetidos: somente caminhos de captura e documentação mudaram. Autorrevisão do diff e do conjunto preparado; nenhuma nova revisão independente alegada.

## Controle Git e resultado

Objeto inicial inspecionado: 101 arquivos incluídos, com 76 renomes idênticos e um HTML com link ajustado. Árvore 4973af998eaf908dcad8d664e40e32473e746a40 coincide com o índice preparado. Pendência removida após essa prova, com controle incorporado ao mesmo commit lógico. 917 alvos de links locais e diff conferidos. Enviar com push normal, verificar main remoto igual a HEAD e reportar hash final. Mensagem: docs(atlas): padronizar galerias com versão e tela e migrar referências. Não há autorização de force-push, merge ou deploy.

## Continuidade e limites

Aplicar o padrão nas próximas comparações e sincronizar todos os caminhos na mesma entrega. Próxima implementação permanece conforme estado vigente. Publicação no GitHub não comprova deploy nem integrações futuras. Versão funcional continua 0.13.3.
