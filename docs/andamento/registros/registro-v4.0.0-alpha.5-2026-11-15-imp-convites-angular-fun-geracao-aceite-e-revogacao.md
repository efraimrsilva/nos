# Registro — v4.0.0-alpha.5 — 2026-11-15 — Imp. de Convites no Angular com Fun. de geração, aceite e revogação

**Status:** A05 validada localmente em `codex/migracao-angular`. A04 confirmada no GitHub em `4ff4013`. Next.js v3.11.1.

**Objetivo e requisitos:** portar convite inicial e compartilhamento por código, entrada, prévia e aceite, além de filtros e revogação. Preservar permissões, o destino após entrar e a decisão individual de participar.

**Decisões e integração:** reutilizar Angular Router, cliente Supabase existente e funções `create_initial_invitation`, `inspect_invitation`, `accept_invitation` e `revoke_nucleus_invitation`. Não foi necessário acrescentar biblioteca ou alterar o banco. O código viaja apenas no corpo das chamadas de conferência e aceite. A lista de gestão lê datas e identificadores. O banco confere administração, validade e revogação. A prévia é mantida quando a resposta do aceite é incerta. Abrir após entrar preserva o caminho, sem carregar o código no retorno de autenticação.

**Arquivos e telas:** `apps/web/src/app/invitations/`, rotas e atalhos de Início. A05 substitui a confirmação provisória da A04. Telas 09, 10, 11, 58 e 59. Atlas, contratos, galeria, configuração de porta de teste e Playwright.

**Modais:** Preparar convite abre pela gestão para administração e mostra o código após uma ação explícita. Fechar esconde a informação e a lista recebe a atualização da operação já iniciada. Revogar convite abre a partir do detalhe de um convite ativo. Confirmar bloqueia novos aceites, preservando os integrantes. X, Escape e gesto externo fecham, assim como Cancelar no diálogo de revogação.

**Validações:** duas contas locais em computador e celular emulado. Geração, reapresentação de código ativo, cópia com área de transferência simulada, prévia, adiamento, formato inválido, revogação entre prévia e aceite, repetição após falha de resposta, vínculo preservado, filtros e bloqueio de gestão para participante. Testes de banco cobriram convites, administração e encerramento. Revisão independente orientou tratamento de falhas, fechamento durante geração, colagem normalizada e proteção de artefatos de teste. [Galeria com códigos mascarados](../../wireframes/comparacoes/v4.0.0-alpha.5-2026-11-15-angular-convites-tela-09-tela-10-tela-11-tela-58-tela-59/index.html).

**Verificações técnicas:** `npm run test:angular` na porta 3000 aprovou 23 testes e ignorou no desktop um caso exclusivo de celular. O pgTAP (suíte de testes do PostgreSQL) aprovou 105 verificações nos arquivos de convites, administração e encerramento. `npm run typecheck` e `npm run build` passaram na raiz e em `apps/web`. Passaram também os verificadores `verify-invitation-journey`, `verify-migration-view`, `verify-global-view` e `verify-mvp-view` do Atlas. A inspeção passou a selecionar os estados específicos de convites disponíveis no Atlas.

**Resultado e limites:** a A05 valida o fluxo local por código. A cópia tem alternativa manual. O compartilhamento pelo sistema operacional depende do dispositivo e ficou pendente de teste físico. QR, câmera, entrada por link, destinatários individuais e histórico de uso permanecem planejados. Nenhum roteiro de caixa preta foi criado. Nenhuma mudança de esquema nesta etapa.

**Próximo passo:** A06, portar identidade, administração, lista de integrantes, saída e encerramento. [Plano](../planos/migracao-angular.md).
