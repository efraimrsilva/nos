# Estado do Projeto Nós

**Versão vigente do projeto:** 0.5.0

**DOCS_DIR:** `Documentacao_Projeto_Nos`

**Atualizado:** 2026-09-27

**Git:** `main`; base da entrega v0.5.0 `c528a93`, alinhada a `origin/main` antes do envio. A Home foi conferida dentro de commit atômico; `origin/main` é o destino autorizado. Consultar o Git para o hash e a situação remota finais.

## Objetivo e situação

O onboarding web contempla **Escolher caminho** (`/comecar`), **Tipo** (`/comecar/tipo`), **Propósito** (`/comecar/proposito`), **Conta** (`/conta`), **Convite inicial** (`/comecar/convite-inicial/[id]`), **Entrada por convite** (`/comecar/convite`) e a primeira Home protegida (`/nucleos/[id]`). A integração Supabase v0.4.0 foi validada no projeto de desenvolvimento `nos-dev`; a Home v0.5.0 foi validada localmente. O app ainda não foi publicado.

**Critérios de aceite da entrega v0.5.0:** exibir nome, tipo, propósito e vínculo reais para participante autorizado; oferecer convite apenas ao criador; manter autenticação e RLS; distinguir ausência de acesso de falha de consulta; informar carregamento, erro e alcance inicial sem simular árvore, agenda ou gratidão. Os fluxos de conta e associação foram testados com contas distintas na v0.4.0.

**Arquivos principais:** `src/app/nucleos/[id]/`, `src/features/nuclei/nucleus-access.ts`, `src/features/nuclei/nucleus-home-details.ts`, `tests/nucleus-home.spec.ts`; base de conta e dados em `src/lib/supabase/`, `src/proxy.ts` e `supabase/migrations/`.

## Decisões vigentes

- TypeScript, React, Next.js e Tailwind para a web; Supabase para autenticação e banco. Capacitor será avaliado depois da web, Android antes de iOS.
- Todos os tipos de Núcleo usam o catálogo existente. Só o identificador validado do tipo viaja na URL; nome e propósito não são colocados na URL nem persistidos antes da criação explícita.
- O servidor valida a sessão com `auth.getUser()`. Funções SQL usam `auth.uid()`, associam o criador na mesma transação e limitam leitura por RLS. O convite exige código completo, expira em sete dias e só entra em vigor com aceite explícito. A interface oculta uma prévia quando o código digitado deixa de corresponder ao código conferido.
- O primeiro convite real teve código exposto em captura/chat e foi revogado no painel. O substituto foi gerado e usado sem reproduzir seu código em documentação ou respostas. Não registrar e-mails, senhas, tokens, códigos ou conteúdo afetivo nos documentos de andamento.
- A v0.4.0 é MINOR pelas novas rotas e integração. A v0.3.0 de Propósito e as versões anteriores permanecem registradas historicamente. A edição v2.8 da especificação de segurança é versão documental, independente da versão do aplicativo.
- A v0.5.0 é MINOR pela primeira Home do Núcleo. A página consulta apenas o vínculo próprio e o Núcleo sob RLS; tipo, nome e propósito vêm do banco. A ação de convite deriva do papel `creator`. Árvore, agenda e gratidão aguardam tabelas, contratos de dados e políticas próprias antes de aparecer.
- Cada mudança tem registro datado em `registros/`, com versão, Imp. e Fun. no título e arquivo. O monitoramento automático continua cancelado.

## Evidências e limites

- Supabase `nos-dev`: migração remota `20260927173656_create_nuclei_and_invitations`, três tabelas, quatro funções e RLS verificados no painel. O SQL local tem o mesmo número de versão.
- Fluxo real: uma conta confirmada criou Núcleo e vínculo `creator`; outro convite ativo substituiu o revogado; conta diferente conferiu e aceitou. Consulta agregada no banco confirmou **um `creator` e um `member`**. Antes do aceite efetivo, o navegador convidado recebeu página não encontrada após F5; depois, ambos os navegadores mantiveram o resumo visível após F5. Isso valida o acesso positivo e a negativa anterior para a conta ainda não associada.
- Houve uma primeira tentativa que redirecionou para o resumo sem criar `member`; a recarga da conta convidada mostrou página não encontrada. A segunda tentativa, com sessão convidada confirmada, criou o vínculo. A causa exata da primeira tentativa não foi reproduzida; a função de aceite já tratava de forma idempotente quem pertencia ao Núcleo. O registro conserva a investigação sem atribuir causa não demonstrada.
- Verificações locais após os ajustes finais: `npm.cmd run typecheck`, 46 testes Playwright desktop/mobile, `npm.cmd run build` e `git diff --check` passaram. Foram conferidos 71 links locais sem alvo ausente; `package.json` e lockfile coincidem na v0.4.0.
- A revisão independente estática apontou uma prévia que permanecia visível após editar o código e documentação defasada. A prévia foi vinculada ao código exibido, os registros foram atualizados e a revisão de confirmação não encontrou achados remanescentes. A autorrevisão do diff não encontrou outro problema no escopo.
- Na v0.5.0, 52 testes Playwright desktop/mobile, `npm.cmd run typecheck` e `npm.cmd run build` passaram. Os testes novos cobrem tipo, papel, convite e distinção entre sessão ausente/expirada e falha do Auth; a suíte confirma que a rota continua exigindo conta. O novo layout não foi revalidado com sessão real do Supabase nesta interação. A revisão independente apontou a classificação de erro do Auth, corrigida com teste de regressão. Revisão do diff e `git diff --check` constam no [registro](registros/registro-v0.5.0-2026-09-27-imp-home-nucleo-fun-resumo-protegido.md).
- A CLI Supabase 2.118.0 falhou no transporte à Management API; a migração foi aplicada pela API autenticada com intervenção do usuário e conferida no painel. Docker inativo impediu teste local do SQL. Expiração real de sete dias, limites de envio de e-mail, SMTP próprio, rate limiting operacional, recuperação de senha, Home completa e empacotamento nativo permanecem fora desta entrega. Não tratar o app como pronto para publicação pública.

## Continuidade e commit

- **Próximo passo executável:** especificar a agenda interna por Núcleo antes de implementá-la. Usar a [Tela 03 do catálogo](../Projeto_Nos_v2.1_Catalogo_Completo_das_Interfaces.md), a [regra do calendário](../Projeto_Nos_v1.9_Calendario_do_Nucleo_e_Sincronizacao_Segura.md), o [modelo de Evento](../Projeto_Nos_v2.4_Modelo_Funcional_Dados_Estados_e_Regras.md), a [matriz de permissões](../Projeto_Nos_v2.5_Matriz_de_Permissoes_Privacidade_Visibilidade.md) e os [estados vazios](../Projeto_Nos_v2.6_Estados_Vazios_Erros_e_Carregamento.md). Delimitar primeiro evento interno, participante, autor, horários/fuso, operações, visibilidade, RLS e testes com contas distintas; não incluir sincronização Google/Apple nesta fatia. Criar registro `Em andamento` na versão vigente quando iniciar. Árvore e gratidão requerem contratos próprios antes de aparecer. Publicação pública continua condicionada a SMTP, limites operacionais e privacidade.
- **Bloqueio da entrega atual:** nenhum para a implementação local; validação visual com conta real da nova Home ainda não executada. Não publicar o aplicativo sem as decisões operacionais pendentes.
- **Unidades prontas para commit:** nenhuma pendência conhecida. Home protegida v0.5.0, testes, versão e documentação foram conferidos no conteúdo do commit; push para `origin/main` autorizado.
- **Contador de interações:** começou em 2026-09-25, sem histórico anterior verificável; 38 interações concluídas com esta entrega e sua publicação Git. Próxima auditoria de over-engineering: interação 100. Último marco auditado: nenhum (0).

## Estado das ferramentas

Superpowers disponível e aplicado. Context7 ativo, consultado para Next.js/Supabase nesta entrega; a versão exata Next.js 16.3.6 foi conferida nos guias locais. Octocode MCP continua não exposto nesta sessão; a tentativa de CLI 19.1.0 encontrou cache `npx` incompleto, portanto foram usadas buscas locais precisas. Playwright disponível. Docker daemon inativo na validação anterior do banco.

## Índice

- [Histórico](historico.md): eventos relevantes em ordem cronológica.
- [Brag document](../brag/BRAG.md): contribuições verificáveis.
- [Primeira tela](funcionalidades/escolher-caminho.md): escopo e continuidade.
- [v0.1.0 — Escolher caminho](registros/registro-v0.1.0-2026-09-24-imp-tela-escolher-caminho-fun-entrada-nucleo.md).
- [v0.2.0 — Tipo de Núcleo](registros/registro-v0.2.0-2026-09-25-01-imp-tela-tipo-nucleo-fun-selecao-vinculo.md).
- [v0.2.0 — Versionamento e rastreabilidade](registros/registro-v0.2.0-2026-09-25-02-imp-documentacao-versionada-fun-rastreabilidade.md).
- [v0.2.0 — Registro histórico](registros/registro-v0.2.0-2026-09-25-03-imp-padronizacao-registro-historico-fun-rastreabilidade.md).
- [v0.3.0 — Propósito do Núcleo](registros/registro-v0.3.0-2026-09-27-imp-tela-proposito-nucleo-fun-rascunho-local.md).
- [v0.4.0 — Autenticação, criação e convite](registros/registro-v0.4.0-2026-09-27-imp-integracao-supabase-fun-criacao-convite.md).
- [v0.5.0 — Home do Núcleo](registros/registro-v0.5.0-2026-09-27-imp-home-nucleo-fun-resumo-protegido.md).
- [Frontend web](tecnologias/frontend.md): stack, segurança e próximos passos.
- [Estado anterior](estado-atual.md): referência histórica.
- `README.md`: protocolo do andamento.
