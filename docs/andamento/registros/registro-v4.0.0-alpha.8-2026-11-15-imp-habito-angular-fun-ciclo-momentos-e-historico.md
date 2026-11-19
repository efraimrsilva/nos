# Registro — v4.0.0-alpha.8 — 2026-11-15 — Imp. de Hábito no Angular com Fun. de ciclo, momentos e histórico

**Status.** A08 na prévia local da branch `codex/migracao-angular`. A07 confirmada remotamente em `60222f2`. Next.js v3.11.1.

**Objetivo e requisitos.** Completar o detalhe e portar `/confirmar`, `/registrar` e `/revisar`. Preservar o aceite individual, a administração explícita, a categoria de armazenamento antiga e o histórico após revisão e encerramento.

**Decisões e integração.** Angular 22.2.6 com TypeScript 6.0.3, componentes standalone e Signals. Reutiliza os validadores e o cliente do projeto. Formulários de administração e revisão congelam a versão exibida. A sobrecarga de `record_nucleus_habit_moment` compara a versão sob a trava e delega a conferência de estado, aceite, vínculo e conteúdo à função existente. A assinatura anterior atende o Next.js. Nenhuma biblioteca adicional.

**Arquivos e telas.** `apps/web/src/app/agreements/` e rotas Angular. Detalhe e momentos nas Telas 24, 25 e 27, período nas Telas 28 e 29, termos e histórico nas Telas 30, 31 e 33 e encerramento na Tela 32. O histórico atual usa paginação. Períodos e revisões do modelo anterior são somente consulta. Autoria oculta e conta excluída continuam distintas. Essência continua esboço.

**Modais.** Registrar momento no detalhe, Administrar o ciclo ao iniciar/ativar/encerrar e Alterar termos na rota de histórico. Cada diálogo oferece X, Escape e gesto externo. Abrir e cancelar conservam a decisão sem gravar. [Galeria](../../wireframes/comparacoes/v4.0.0-alpha.8-2026-11-15-angular-habito-tela-24-tela-25-tela-27-tela-28-tela-30-tela-31-tela-32-tela-33/index.html).

**Banco local.** A migração `20261115182000_habit_moment_terms_guard.sql` adiciona a verificação sob trava. A migração `20261115182500_habit_moment_version_conflict.sql` devolve conflito HTTP 409. Uma chamada isolada confirmou que o erro SQL de serialização da primeira definição ficava sem resposta na interface HTTP local, apesar da recusa verificada no PostgreSQL. O comando em lote encontrou a divergência preexistente `20261112025922`. Cada arquivo foi aplicado em transação no contêiner `supabase_db_nos` e registrado via `migration repair --local --status applied` preservando a divergência. Nenhuma operação em banco hospedado.

**Validações.** Banco local com 95 verificações em três arquivos. A regressão geral Playwright aprovou 28 testes, ignorou no computador um caso exclusivo de celular e registrou um timeout no cancelamento do acesso móvel. O caso de acesso passou no reteste direcionado nos dois perfis, junto com os dois casos de ciclo. O teste de ciclo usa duas contas e cobre leitura dos dados antigos, novo aceite, conflito HTTP 409, acesso ao formulário, encerramento e histórico. Tipos e builds foram conferidos em Angular e Next.js. O Atlas teve percurso, modelo de Hábito, MVP de Hábito, Migração, MVP geral e Visão global verificados. A galeria reúne 34 capturas em duas larguras.

**Revisão.** A revisão independente orientou a verificação atômica da versão e a atualização de termos da rota sem sobrescrever rascunho. A inspeção visual corrigiu a largura da caixa de confirmação em Alterar termos e distinguiu a confirmação de encerramento.

**Limites.** Em caso de resposta de gravação perdida, o formulário orienta a conferir o histórico antes de repetir. Requisições independentes continuam distintas. Uma prévia hospedada do Angular precisa das duas migrações antes de registrar momentos. Nenhum roteiro de caixa preta preparado.

**Próximo passo.** A09, Agenda. [Plano](../planos/migracao-angular.md).
