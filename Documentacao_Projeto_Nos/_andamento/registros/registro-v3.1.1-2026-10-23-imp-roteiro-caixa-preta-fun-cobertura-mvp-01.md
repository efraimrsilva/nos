# Registro — v3.1.1 — 2026-10-23 — Imp. de roteiro de testes de caixa preta com Fun. de cobertura do MVP 01

**Status:** documentação concluída e revisada; execução manual pendente.

**Objetivo/contexto/requisitos:** iniciar testes de todo o sistema em partes pelo Atlas, começando com MVP 01 solicitado; formato [] com uma linha por teste, etapa, caminho, ação e esperado. Preservar resultados e incorporar testes de caixa preta a cada funcionalidade futura.

**Decisões:** 62 IDs estáveis M01-001–062; seis telas da etapa access. Separar expectativas de execução. Falhas controladas sem ambiente adequado ficam Bloqueado. Usar contas próprias de teste, sem senhas/tokens em relatos. Dados de execução por ambiente/dispositivo. MVP02–05 e expansões serão detalhados posteriormente. Atualização exclusivamente documental mantém versão funcional 3.1.1, conforme convenção do projeto, sem alterar manifestos.

**Arquivos/integrações:** testes-caixa-preta/README.md, mvp-01.md e resultados.md; estado.md/historico.md; Brag; guia wireframes/GUIA.md; mvp-plan.js e fichas03/04 em screens.js. Atlas atualizado pontualmente para a evidência Brevo/segredo de20/10, que substitui espera pelo Gmail na etapa01. Sem mudar aplicação, banco ou configuração externa.

**Validações:** conferência contra Atlas e fontes de autenticação; contagem/IDs, campos obrigatórios e links locais; sintaxe dos dois scripts do Atlas e git diff --check. Autorrevisão documental; sem revisão independente e sem execução manual/automatizada da aplicação nesta entrega.

**Resultado/limitações:** roteiro e registro preparados; zero testes de caixa preta aprovados. Evidência antiga de e-mail não prova ambiente atual. Entrega não certifica MVP01 nem piloto completo; tratamento de expiração/renovação requer ambiente e espera adequados.

**Próximo passo:** usuário executar entrada/cadastro e enviar IDs/resultados; registrar cada execução, investigar falhas e preservar retestes. [Processo](../testes-caixa-preta/README.md) · [Roteiro](../testes-caixa-preta/mvp-01.md) · [Resultados](../testes-caixa-preta/resultados.md).

## Publicação GitHub — autorização de 2026-10-23

Usuário autorizou commit e push de todas as alterações, com descrição abrangente. Dez arquivos da mesma unidade documental; versão3.1.1 preservada. Conferir conteúdo do objeto criado, igualdade com origin/main e árvore limpa após push. Nenhuma nova aprovação manual ou comprovação de deploy nesta publicação.
