# Estado do Projeto Nós

**Versão vigente do projeto:** 0.6.0

**DOCS_DIR:** `Documentacao_Projeto_Nos`

**Atualizado:** 2026-09-27

**Git:** `main`; base anterior `e83e81a`. A agenda v0.6.0 foi incluída em um commit atômico; usar `git log -1` para o hash final e `git status -sb` para verificar `origin/main` após o push autorizado.

## Entrega concluída — agenda interna

Agenda por Núcleo concluída na **v0.6.0**: eventos pontuais com título, intenção opcional, início/fim e fuso; convite aos integrantes atuais; resposta individual; edição/remoção pelo autor ou criador; leitura isolada por RLS. A tela fica em `/nucleos/[id]/agenda`, ligada à Home. O recorte exclui sincronização externa, recorrência e vínculo com outros módulos.

**Arquivos da entrega:** `src/app/nucleos/[id]/agenda/`, `src/features/calendar/`, `supabase/migrations/20260927221149_create_nucleus_calendar.sql`, `tests/calendar-event.spec.ts`, `tests/nucleus-calendar.spec.ts` e [registro da agenda](registros/registro-v0.6.0-2026-09-27-01-imp-agenda-interna-fun-eventos-nucleo.md).

**Decisão:** eventos e respostas são visíveis apenas aos integrantes; operações de escrita passam por RPCs que conferem `auth.uid()` e associação no banco. O calendário interno é a fonte oficial. Integrantes que entrarem depois da criação poderão ler o evento, mas não recebem convite retroativo nesta fatia.

**Validação nesta interação:** migração SQL aplicada ao `nos-dev` e confirmada no painel como `20260927221149_create_nucleus_calendar`. Em sessão real, a conta criadora criou, respondeu, editou e removeu um evento; a participante viu o convite sem controles de edição, respondeu e recebeu confirmação. Um segundo Núcleo temporário sem convite foi criado; a participante abriu a agenda original e recebeu 404 na agenda temporária. O segundo Núcleo foi excluído por identificador e nome; o banco retornou exatamente um registro removido e voltou a contar um Núcleo. Revisão independente encontrou dois casos de borda, corrigidos com fallback de fuso e paginação. Na conferência de entrega, a primeira execução paralela teve nove timeouts ao encerrar contextos mobile em disco lento; `npm.cmd test -- --workers=1` aprovou os 64 testes desktop/mobile. `npm.cmd run typecheck` e build de produção passaram. Sem sessão, a rota redireciona para `/conta`.

**Próximo passo executável:** iniciar a [Tela 04 — Acordos](../Projeto_Nos_v2.1_Catalogo_Completo_das_Interfaces.md) pelo hub de Hábitos, Experiências e Essência. Antes de implementar, confrontar [fluxo](../Projeto_Nos_v2.2_Fluxos_Navegacao_e_Interacoes.md), [modelo e estados](../Projeto_Nos_v2.4_Modelo_Funcional_Dados_Estados_e_Regras.md), [permissões](../Projeto_Nos_v2.5_Matriz_de_Permissoes_Privacidade_Visibilidade.md) e [estados vazios](../Projeto_Nos_v2.6_Estados_Vazios_Erros_e_Carregamento.md) com a regra de [aprovação](../Projeto_Nos_v1.2_Sistema_de_Aprovacao_e_Construcao_de_Acordos.md). Definir contrato, RLS e primeira fatia verificável: proposta não equivale a acordo ativo; aceite dos participantes é explícito; percentuais e itens exemplificativos do protótipo não são dados reais. Registrar o recorte da Tela 04 antes de criar a rota. A credencial de acesso permaneceu fora do repositório. Publicação pública exige revisão própria de privacidade e operação.

**Unidades pendentes de commit:** nenhuma; o commit da agenda v0.6.0 contém código, SQL, testes e documentação. **Contador de interações:** 48 respostas concluídas com esta entrega; começou em 2026-09-25 sem histórico anterior verificável. Último marco de over-engineering: nenhum (0); próxima auditoria: 100.

## Objetivo e situação

O onboarding web contempla **Escolher caminho** (`/comecar`), **Tipo** (`/comecar/tipo`), **Propósito** (`/comecar/proposito`), **Conta** (`/conta`), **Convite inicial** (`/comecar/convite-inicial/[id]`), **Entrada por convite** (`/comecar/convite`), Home protegida (`/nucleos/[id]`) e agenda interna (`/nucleos/[id]/agenda`). A integração Supabase foi validada no projeto de desenvolvimento `nos-dev`; o app ainda não foi publicado.

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

- A Home v0.5.0 e a agenda v0.6.0 estão registradas no Git. Conferir o envio da agenda em `origin/main` após o push autorizado. A Tela 04 está delimitada acima, sem implementação iniciada. Publicação pública segue condicionada a SMTP, limites operacionais e privacidade.

## Estado das ferramentas

Superpowers disponível e aplicado. Context7 ativo, consultado para Next.js/Supabase; a versão instalada Next.js 16.3.6 foi conferida nos guias locais. Octocode MCP não está exposto; a CLI via `npx` e a consulta ao registro npm não retornaram neste ambiente, então a ativação não foi confirmada e foram usadas buscas locais precisas. Playwright disponível. Docker daemon inativo.

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
- [Frontend web](tecnologias/frontend.md): stack, segurança e próximos passos.
- [Estado anterior](estado-atual.md): referência histórica.
- `README.md`: protocolo do andamento.
