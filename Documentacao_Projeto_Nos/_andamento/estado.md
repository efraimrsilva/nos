# Estado do Projeto Nós

**Versão vigente do projeto:** 0.8.0

**DOCS_DIR:** `Documentacao_Projeto_Nos`

**Atualizado:** 2026-09-29

**Git:** `main`; o recorte inicial da Tela 05 v0.8.0 integra o commit atual. Confirmar a situação remota comparando `HEAD` e `origin/main`; a referência anterior é `5c375b3` (Acordos v0.7.0).

## Recorte concluído — Tela 05 Detalhe do Hábito

O recorte inicial da Tela 05 está concluído na v0.8.0: a rota `/nucleos/[id]/acordos/[agreementId]` lê apenas propostas de Hábito em `testing` pertencentes ao Núcleo autenticado. O hub liga esses itens ao detalhe, que apresenta descrição, momento, frequência, data UTC e resposta própria. Abas de histórico e reflexões, calendário de prática, progresso, próxima revisão, impacto esperado, linguagem de cuidado e próximo evento associado ainda não possuem dados reais nem interface operacional; a tela comunica o limite sem simular conteúdo. [Registro v0.8.0](registros/registro-v0.8.0-2026-09-29-imp-detalhe-habito-fun-consulta-proposta-teste.md).

**Validação:** teste da rota sem sessão passou em desktop e móvel após falhar antes da implementação; 70 testes Playwright, tipos e build passaram. Revisão independente apontou indicação do fuso, corrigida. Supabase local e três contas temporárias verificaram acesso autorizado, link do hub, isolamento entre Núcleos, categoria/estado e leitura apenas da resposta própria. Dados temporários removidos. A nova tela não foi testada no `nos-dev`.

**Próximo passo executável:** especificar a Tela 06 — ações de **Registrar momento** e **Revisar** no Detalhe do Hábito. Para registrar, definir dado persistido, autoria, visibilidade no Núcleo e retorno ao histórico da Tela 05; para revisar, definir estados, mudanças permitidas e novo consentimento quando o compromisso mudar. Conferir permissões da matriz v2.5, regras dos fluxos v2.2 e contratos v2.4 antes de expor botões ativos. Validar o percurso com duas contas e isolamento entre Núcleos. Completar os itens restantes da Tela 05 conforme os dados correspondentes existirem; progresso, árvore e evento associado dependem de contratos próprios. A publicação pública permanece fora de escopo.

## Entrega concluída — Tela 04 Acordos

O hub privado em `/nucleos/[id]/acordos` está concluído na v0.7.0. O recorte inclui propostas de Hábitos e Experiências com descrição, momento e frequência, respostas individuais, aceite unânime para entrada em teste, recusa explícita, filtros e estado vazio de Essência. Nenhum progresso ou acordo exemplar é simulado. Há link na Home. A migração `supabase/migrations/20260928120000_create_nucleus_agreements.sql` foi aplicada e conferida no `nos-dev`.

**Critérios de conclusão:** revisar o SQL/RLS e o diff, aprovar testes/tipos/build, aplicar a migração em ambiente de desenvolvimento identificado, verificar o fluxo com duas contas e isolamento entre Núcleos, atualizar a versão e os registros após essas evidências.

**Arquivos principais:** `src/app/nucleos/[id]/acordos/`, `src/features/agreements/`, migração acima, `supabase/tests/nucleus_agreements.sql` e `tests/agreement-input.spec.ts`. [Registro da entrega](registros/registro-v0.7.0-2026-09-28-imp-hub-acordos-fun-propostas-consentimento.md).

**Validações recentes:** 68 testes Playwright desktop/mobile, `npm.cmd run typecheck` e `npm.cmd run build` passaram na v0.7.0 em 2026-09-29; o build reconheceu a rota dinâmica de Acordos. Na preparação do envio, uma execução adicional perdeu o servidor após o primeiro teste; a página e o caso isolados funcionaram, e uma nova execução completa aprovou 68/68 testes, seguida de tipos e build aprovados. Docker 29.8.1 iniciou o Supabase local; as três migrações foram aplicadas e `supabase test db` aprovou o teste pgTAP de RLS/consentimento. A aplicação local confirmou criação, aceite, recusa e página 404 para outra conta; respostas simultâneas levaram a proposta ao estado de teste. No `nos-dev`, `db push --dry-run` indicou só a nova migração, `migration list` confirmou as três versões e nova simulação confirmou banco atualizado. Três contas temporárias validaram criação do Núcleo, aceite unânime, recusa e isolamento; a limpeza terminou com zero Núcleos, propostas e contas de teste. A revisão independente final não encontrou defeito material de código e apontou documentação defasada, corrigida nesta entrega. A primeira tentativa de Playwright não iniciou o servidor em 120 segundos; a inicialização isolada respondeu HTTP 200 e a repetição completa passou.

**Continuidade:** a Tela 05 foi entregue na v0.8.0; o próximo recorte é a Tela 06. Consulte o registro atual acima. Publicação pública continua fora de escopo.

## Entrega concluída — agenda interna

Agenda por Núcleo concluída na **v0.6.0**: eventos pontuais com título, intenção opcional, início/fim e fuso; convite aos integrantes atuais; resposta individual; edição/remoção pelo autor ou criador; leitura isolada por RLS. A tela fica em `/nucleos/[id]/agenda`, ligada à Home. O recorte exclui sincronização externa, recorrência e vínculo com outros módulos.

**Arquivos da entrega:** `src/app/nucleos/[id]/agenda/`, `src/features/calendar/`, `supabase/migrations/20260927221149_create_nucleus_calendar.sql`, `tests/calendar-event.spec.ts`, `tests/nucleus-calendar.spec.ts` e [registro da agenda](registros/registro-v0.6.0-2026-09-27-01-imp-agenda-interna-fun-eventos-nucleo.md).

**Decisão:** eventos e respostas são visíveis apenas aos integrantes; operações de escrita passam por RPCs que conferem `auth.uid()` e associação no banco. O calendário interno é a fonte oficial. Integrantes que entrarem depois da criação poderão ler o evento, mas não recebem convite retroativo nesta fatia.

**Validação da entrega v0.6.0:** migração SQL aplicada ao `nos-dev` e confirmada no painel como `20260927221149_create_nucleus_calendar`. Em sessão real, a conta criadora criou, respondeu, editou e removeu um evento; a participante viu o convite sem controles de edição, respondeu e recebeu confirmação. Um segundo Núcleo temporário sem convite foi criado; a participante abriu a agenda original e recebeu 404 na agenda temporária. O segundo Núcleo foi excluído por identificador e nome; o banco retornou exatamente um registro removido e voltou a contar um Núcleo. Revisão independente encontrou dois casos de borda, corrigidos com fallback de fuso e paginação. Na conferência de entrega, a primeira execução paralela teve nove timeouts ao encerrar contextos mobile em disco lento; `npm.cmd test -- --workers=1` aprovou os 64 testes desktop/mobile. `npm.cmd run typecheck` e build de produção passaram. Sem sessão, a rota redireciona para `/conta`.

**Continuidade após a agenda:** a Tela 04 — Acordos foi concluída na v0.7.0; evidência e limites constam em [Entrega concluída — Tela 04 Acordos](#entrega-concluída--tela-04-acordos). A credencial de acesso permanece fora do repositório. Publicação pública exige revisão própria de privacidade e operação.

**Unidades pendentes de commit:** nenhuma; o recorte inicial da Tela 05 v0.8.0, com rota, link, teste, versão e documentação, foi conferido no commit desta entrega. **Contador de interações:** 61 respostas concluídas incluindo esta interação; começou em 2026-09-25 sem histórico anterior verificável. Último marco de over-engineering: nenhum (0); próxima auditoria: 100.

## Objetivo e situação

O onboarding web contempla **Escolher caminho** (`/comecar`), **Tipo** (`/comecar/tipo`), **Propósito** (`/comecar/proposito`), **Conta** (`/conta`), **Convite inicial** (`/comecar/convite-inicial/[id]`) e **Entrada por convite** (`/comecar/convite`). A área protegida inclui Home (`/nucleos/[id]`), agenda (`/nucleos/[id]/agenda`), Acordos (`/nucleos/[id]/acordos`) e Detalhe do Hábito (`/nucleos/[id]/acordos/[agreementId]`). A integração Supabase das telas anteriores foi validada no projeto de desenvolvimento `nos-dev`; a Tela 05 foi validada no Supabase local. O app ainda não foi publicado.

**Critérios de aceite da entrega v0.5.0:** exibir nome, tipo, propósito e vínculo reais para participante autorizado; oferecer convite apenas ao criador; manter autenticação e RLS; distinguir ausência de acesso de falha de consulta; informar carregamento, erro e alcance inicial sem simular árvore, agenda ou gratidão. Os fluxos de conta e associação foram testados com contas distintas na v0.4.0.

**Arquivos principais:** `src/app/nucleos/[id]/`, `src/features/nuclei/nucleus-access.ts`, `src/features/nuclei/nucleus-home-details.ts`, `tests/nucleus-home.spec.ts`; base de conta e dados em `src/lib/supabase/`, `src/proxy.ts` e `supabase/migrations/`.

## Decisões vigentes

- TypeScript, React, Next.js e Tailwind para a web; Supabase para autenticação e banco. Capacitor será avaliado depois da web, Android antes de iOS.
- Todos os tipos de Núcleo usam o catálogo existente. Só o identificador validado do tipo viaja na URL; nome e propósito não são colocados na URL nem persistidos antes da criação explícita.
- O servidor valida a sessão com `auth.getUser()`. Funções SQL usam `auth.uid()`, associam o criador na mesma transação e limitam leitura por RLS. O convite exige código completo, expira em sete dias e só entra em vigor com aceite explícito. A interface oculta uma prévia quando o código digitado deixa de corresponder ao código conferido.
- O primeiro convite real teve código exposto em captura/chat e foi revogado no painel. O substituto foi gerado e usado sem reproduzir seu código em documentação ou respostas. Não registrar e-mails, senhas, tokens, códigos ou conteúdo afetivo nos documentos de andamento.
- A v0.4.0 é MINOR pelas novas rotas e integração. A v0.3.0 de Propósito e as versões anteriores permanecem registradas historicamente. A edição v2.8 da especificação de segurança é versão documental, independente da versão do aplicativo.
- A v0.5.0 é MINOR pela primeira Home do Núcleo. A página consulta apenas o vínculo próprio e o Núcleo sob RLS; tipo, nome e propósito vêm do banco. A ação de convite deriva do papel `creator`.
- A v0.6.0 é MINOR pela agenda interna. Eventos e respostas pertencem ao Núcleo; leitura exige vínculo sob RLS e alterações passam por RPCs autenticadas. Árvore e gratidão ainda exigem contratos e permissões próprios.
- A v0.7.0 é MINOR pela Tela 04 Acordos. Propostas pertencem ao Núcleo, respostas são individuais e a unanimidade é necessária para iniciar teste; uma proposta não equivale a acordo ativo. Essência e progresso não são simulados.
- A v0.8.0 é MINOR pelo recorte inicial da Tela 05 e sua nova rota. O detalhe lê exclusivamente Hábito em teste e a resposta própria; dados de acompanhamento ainda indisponíveis são explicados sem simulação.
- Cada mudança tem registro datado em `registros/`, com versão, Imp. e Fun. no título e arquivo. O monitoramento automático continua cancelado.

## Evidências e limites

- Supabase `nos-dev`: migração remota `20260927173656_create_nuclei_and_invitations`, três tabelas, quatro funções e RLS verificados no painel. O SQL local tem o mesmo número de versão.
- Fluxo real: uma conta confirmada criou Núcleo e vínculo `creator`; outro convite ativo substituiu o revogado; conta diferente conferiu e aceitou. Consulta agregada no banco confirmou **um `creator` e um `member`**. Antes do aceite efetivo, o navegador convidado recebeu página não encontrada após F5; depois, ambos os navegadores mantiveram o resumo visível após F5. Isso valida o acesso positivo e a negativa anterior para a conta ainda não associada.
- Houve uma primeira tentativa que redirecionou para o resumo sem criar `member`; a recarga da conta convidada mostrou página não encontrada. A segunda tentativa, com sessão convidada confirmada, criou o vínculo. A causa exata da primeira tentativa não foi reproduzida; a função de aceite já tratava de forma idempotente quem pertencia ao Núcleo. O registro conserva a investigação sem atribuir causa não demonstrada.
- Verificações locais após os ajustes finais: `npm.cmd run typecheck`, 46 testes Playwright desktop/mobile, `npm.cmd run build` e `git diff --check` passaram. Foram conferidos 71 links locais sem alvo ausente; `package.json` e lockfile coincidem na v0.4.0.
- A revisão independente estática apontou uma prévia que permanecia visível após editar o código e documentação defasada. A prévia foi vinculada ao código exibido, os registros foram atualizados e a revisão de confirmação não encontrou achados remanescentes. A autorrevisão do diff não encontrou outro problema no escopo.
- Na v0.5.0, 52 testes Playwright desktop/mobile, `npm.cmd run typecheck` e `npm.cmd run build` passaram. Os testes novos cobrem tipo, papel, convite e distinção entre sessão ausente/expirada e falha do Auth; a suíte confirma que a rota continua exigindo conta. O novo layout não foi revalidado com sessão real do Supabase nesta interação. A revisão independente apontou a classificação de erro do Auth, corrigida com teste de regressão. Revisão do diff e `git diff --check` constam no [registro](registros/registro-v0.5.0-2026-09-27-imp-home-nucleo-fun-resumo-protegido.md).
- Na entrega v0.4.0, a CLI falhou no transporte à Management API e a migração foi aplicada pela API autenticada; naquela etapa, Docker inativo impediu teste local do SQL. Esses impedimentos de ambiente foram resolvidos para a v0.7.0. Expiração real de sete dias, limites de envio de e-mail, SMTP próprio, rate limiting operacional, recuperação de senha, Home completa e empacotamento nativo permanecem fora das entregas atuais. Não tratar o app como pronto para publicação pública.

## Continuidade e commit

- A Home v0.5.0, a agenda v0.6.0 e a Tela 04 v0.7.0 estão registradas no Git. A Tela 05 v0.8.0 usa o contrato existente de Acordos e foi validada com contas no Supabase local. Publicação pública segue condicionada a SMTP, limites operacionais e privacidade.

## Estado das ferramentas

Superpowers disponível e aplicado. Context7 ativo, consultado para Next.js/Supabase; a versão instalada Next.js 16.3.6 foi conferida nos guias locais. Octocode MCP não está exposto; a CLI 19.1.0 em cache foi executada com `ALLOWED_PATHS` limitado ao repositório e validou busca local. Playwright disponível. Docker 29.8.1 funcional; Supabase local foi encerrado com backup após os testes. CLI Supabase 2.118.0 autenticada e vinculada ao `nos-dev`; a exceção específica para `api.supabase.com` no Avast eliminou a interceptação HTTPS. Não guardar token no repositório.

Pesquisa externa de ferramentas em 2026-09-29 consultou projetos e documentação oficiais. Candidatos priorizados: Supabase CLI + pgTAP para contratos/RLS; Renovate ou Dependabot para atualizações controladas; Sentry para observabilidade após lançamento; axe-core integrado ao Playwright para acessibilidade. Lighthouse CI, Gitleaks e CodeQL são opções condicionais de CI/segurança; nenhum foi instalado ou configurado. Não adicionar essas ferramentas até a etapa funcional apropriada.

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
- [v0.6.0 — Agenda interna do Núcleo](registros/registro-v0.6.0-2026-09-27-01-imp-agenda-interna-fun-eventos-nucleo.md).
- [v0.7.0 — Tela 04 Acordos](registros/registro-v0.7.0-2026-09-28-imp-hub-acordos-fun-propostas-consentimento.md).
- [v0.8.0 — Tela 05 Detalhe do Hábito](registros/registro-v0.8.0-2026-09-29-imp-detalhe-habito-fun-consulta-proposta-teste.md).
- [v0.6.0 — Análise de Genkit, AI SDK e Mastra](registros/registro-v0.6.0-2026-09-29-imp-analise-frameworks-ia-fun-apoio-conversas.md).
- [v0.6.0 — Pesquisa de ferramentas para a stack](registros/registro-v0.6.0-2026-09-29-imp-pesquisa-ferramentas-stack-fun-qualidade-operacao.md).
- [Frontend web](tecnologias/frontend.md): stack, segurança e próximos passos.
- [Estado anterior](estado-atual.md): referência histórica.
- `README.md`: protocolo do andamento.
