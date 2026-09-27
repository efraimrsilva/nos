# Estado do Projeto Nós

**Versão vigente do projeto:** 0.4.0

**DOCS_DIR:** `Documentacao_Projeto_Nos`

**Atualizado:** 2026-09-27

**Git:** `main`; entrega v0.4.0 registrada em commit atômico, com `origin/main` como destino autorizado. Consultar o Git para o hash e a situação remota atuais.

## Objetivo e situação

O onboarding web contempla **Escolher caminho** (`/comecar`), **Tipo** (`/comecar/tipo`), **Propósito** (`/comecar/proposito`), **Conta** (`/conta`), **Convite inicial** (`/comecar/convite-inicial/[id]`), **Entrada por convite** (`/comecar/convite`) e resumo protegido (`/nucleos/[id]`). A integração Supabase v0.4.0 está implementada e validada no projeto de desenvolvimento `nos-dev`. O app ainda não foi publicado.

**Critérios de aceite da entrega:** cadastro e entrada reais, confirmação de e-mail, criação atômica de Núcleo com criador associado, convite opcional, prévia antes do aceite, associação explícita de membro e leitura protegida por RLS. Esses fluxos foram testados com contas distintas. O rascunho de nome e propósito permanece só na memória da página até a ação **Criar Núcleo**.

**Arquivos principais:** `src/app/conta/`, `src/app/auth/confirm/`, `src/app/comecar/convite/`, `src/app/comecar/convite-inicial/[id]/`, `src/app/nucleos/[id]/`, `src/features/auth/`, `src/features/invitations/`, `src/features/nuclei/actions.ts`, `src/lib/supabase/`, `src/proxy.ts`, `supabase/migrations/`, `tests/`.

## Decisões vigentes

- TypeScript, React, Next.js e Tailwind para a web; Supabase para autenticação e banco. Capacitor será avaliado depois da web, Android antes de iOS.
- Todos os tipos de Núcleo usam o catálogo existente. Só o identificador validado do tipo viaja na URL; nome e propósito não são colocados na URL nem persistidos antes da criação explícita.
- O servidor valida a sessão com `auth.getUser()`. Funções SQL usam `auth.uid()`, associam o criador na mesma transação e limitam leitura por RLS. O convite exige código completo, expira em sete dias e só entra em vigor com aceite explícito. A interface oculta uma prévia quando o código digitado deixa de corresponder ao código conferido.
- O primeiro convite real teve código exposto em captura/chat e foi revogado no painel. O substituto foi gerado e usado sem reproduzir seu código em documentação ou respostas. Não registrar e-mails, senhas, tokens, códigos ou conteúdo afetivo nos documentos de andamento.
- A v0.4.0 é MINOR pelas novas rotas e integração. A v0.3.0 de Propósito e as versões anteriores permanecem registradas historicamente. A edição v2.8 da especificação de segurança é versão documental, independente da versão do aplicativo.
- Cada mudança tem registro datado em `registros/`, com versão, Imp. e Fun. no título e arquivo. O monitoramento automático continua cancelado.

## Evidências e limites

- Supabase `nos-dev`: migração remota `20260927173656_create_nuclei_and_invitations`, três tabelas, quatro funções e RLS verificados no painel. O SQL local tem o mesmo número de versão.
- Fluxo real: uma conta confirmada criou Núcleo e vínculo `creator`; outro convite ativo substituiu o revogado; conta diferente conferiu e aceitou. Consulta agregada no banco confirmou **um `creator` e um `member`**. Antes do aceite efetivo, o navegador convidado recebeu página não encontrada após F5; depois, ambos os navegadores mantiveram o resumo visível após F5. Isso valida o acesso positivo e a negativa anterior para a conta ainda não associada.
- Houve uma primeira tentativa que redirecionou para o resumo sem criar `member`; a recarga da conta convidada mostrou página não encontrada. A segunda tentativa, com sessão convidada confirmada, criou o vínculo. A causa exata da primeira tentativa não foi reproduzida; a função de aceite já tratava de forma idempotente quem pertencia ao Núcleo. O registro conserva a investigação sem atribuir causa não demonstrada.
- Verificações locais após os ajustes finais: `npm.cmd run typecheck`, 46 testes Playwright desktop/mobile, `npm.cmd run build` e `git diff --check` passaram. Foram conferidos 71 links locais sem alvo ausente; `package.json` e lockfile coincidem na v0.4.0.
- A revisão independente estática apontou uma prévia que permanecia visível após editar o código e documentação defasada. A prévia foi vinculada ao código exibido, os registros foram atualizados e a revisão de confirmação não encontrou achados remanescentes. A autorrevisão do diff não encontrou outro problema no escopo.
- A CLI Supabase 2.118.0 falhou no transporte à Management API; a migração foi aplicada pela API autenticada com intervenção do usuário e conferida no painel. Docker inativo impediu teste local do SQL. Expiração real de sete dias, limites de envio de e-mail, SMTP próprio, rate limiting operacional, recuperação de senha, Home completa e empacotamento nativo permanecem fora desta entrega. Não tratar o app como pronto para publicação pública.

## Continuidade e commit

- **Próximo passo executável:** evoluir `/nucleos/[id]` para a primeira etapa da Home do Núcleo: manter nome e propósito reais, consultar apenas dados já existentes para o participante e oferecer estados vazios honestos. Planejar árvore, agenda e gratidão com seus próprios contratos e permissões antes de exibi-los; preservar RLS, acessibilidade e estados de acesso.
- **Bloqueio da entrega atual:** nenhum para o fluxo de desenvolvimento validado. Publicação requer decisões operacionais sobre SMTP, limites e privacidade; não está autorizada nesta tarefa.
- **Unidades prontas para commit:** nenhuma pendência conhecida após o commit atômico da integração Supabase v0.4.0 (conta, criação protegida, convite, aceite, RLS, testes e documentação). O push para `origin/main` foi autorizado; deploy não autorizado.
- **Contador de interações:** começou em 2026-09-25, sem histórico anterior verificável; 36 interações concluídas até esta atualização. Próxima auditoria de over-engineering: interação 100. Último marco auditado: nenhum (0).

## Estado das ferramentas

Superpowers disponível e aplicado. Context7 ativo, consultado para Next.js/Supabase nesta integração; a versão exata Next.js 16.3.6 foi complementada pelos guias locais. Octocode CLI 19.1.0 disponível, mas MCP não exposto nesta sessão; buscas locais precisas foram usadas. Supabase CLI 2.118.0 inicializada; falha de transporte investigada. Playwright disponível. Docker daemon inativo.

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
- [Frontend web](tecnologias/frontend.md): stack, segurança e próximos passos.
- [Estado anterior](estado-atual.md): referência histórica.
- `README.md`: protocolo do andamento.
