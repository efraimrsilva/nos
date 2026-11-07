# Registro — v3.10.0 — 2026-11-07 — Imp. de notificação de cadastro com Fun. de aviso por e-mail

**Status:** Concluído e validado localmente. MINOR 3.10.0 pela nova funcionalidade administrativa compatível. Publicação/ativação hospedada e recebimento externo pendentes. Desenho aprovado pelo usuário após investigação na v3.9.2; ajuste de segurança descrito abaixo.

## Objetivo, contexto e requisitos

Avisar a equipe a cada conta nova no Supabase, incluindo cadastro por e-mail e criação pela primeira entrada com Google. O destinatário é a caixa de suporte já fixa no servidor em `src/features/support/mail.ts`. Por determinação explícita do usuário, o relatório contém somente nome e e-mail, sem senha. Não transmitir registro completo de `auth.users`, hashes, tokens ou metadados de autenticação ao receptor. Não avisar em login/confirmacão/atualização nem preencher contas anteriores à migração.

## Decisões e implementação

Gatilho de inserção em `auth.users` grava fila privada. `pg_cron` despacha até dez eventos/minuto por `pg_net`, com cinco tentativas separadas por cinco minutos. Receptor `/api/account-notifications`, Node.js, valida HMAC SHA-256 e validade, reserva via RPC administrativa e reutiliza Nodemailer/SMTP existentes. Nome ausente vira `Não informado`, com normalização de controles e limite coerente de pontos Unicode. Não depende da sessão do visitante; segredo e chave administrativa somente servidor/Vault. Falha do transporte não bloqueia cadastro; falha excepcional na própria fila preserva cadastro e gera warning operacional sem identificação.

**Correção de segurança durante revisão:** a fila da extensão `pg_net` pode ter privilégios públicos por padrão e pertencer a `supabase_admin`, sem permitir revogação efetiva por `postgres`. O desenho inicial com nome/e-mail no corpo e Bearer reutilizável foi substituído por corpo `{}` e cabeçalhos de referência, timestamp e assinatura temporária, sem nome/e-mail/segredo na fila HTTP. Os dados vêm da fila privada por RPC restrita à chave administrativa. Não ampliar exposição da API nem alterar privilégios de extensões de terceiros para contornar o limite. `net` não está exposto pelo Data API neste ambiente; não houve exploração pública demonstrada.

Reserva de dez minutos impede envios simultâneos normais; evento já concluído retorna sucesso sem repetir mensagem. Após aceite SMTP, nome/e-mail são removidos da fila. Limpeza da fila operacional após 30 dias; exclusão da conta elimina sua referência por chave estrangeira. Erros de banco/SMTP não são expostos ao chamador. [Contrato e operação](../funcionalidades/notificacao-novas-contas.md).

Alternativas avaliadas: aviso apenas na ação de cadastro não cobre Google; webhook padrão envia a linha inteira; novo provedor de e-mail ou framework não apresenta benefício demonstrado sobre o transporte existente. Nenhuma dependência nova. Avisos de cadastro auxiliam acompanhamento, mas não medem consumo ou capacidade do banco. Sem alteração visual/de navegação do produto, MVP ou novos roteiros de caixa preta; Atlas recebe identificação 3.10.0 e status operacional, preservando telas.

## Arquivos e integrações

- `supabase/migrations/20261107045500_account_signup_notifications.sql`: fila/RLS/gatilho/RPCs/despachante/job; arquivo criado pela CLI, aplicado e registrado somente no banco local.
- `src/features/account-notifications/handler.ts` e `src/app/api/account-notifications/route.ts`: autenticação, validação, reserva, envio e confirmação.
- `src/features/support/mail.ts` e `src/proxy.ts`: transporte compartilhado e isolamento da autenticação entre serviços.
- `.env.example`: nomes das variáveis, sem valores secretos; `package.json`/lockfile: versão 3.10.0, scripts, sem nova dependência.
- `scripts/test-account-notifications.mjs`, `scripts/test-account-notifications-local.mjs`, `supabase/tests/account_notifications.sql`: testes técnicos unitários, integração SMTP local e banco.
- README, Atlas, estado/histórico, Brag e contrato operacional: versão, evidências e próximo passo.

## Evidências e validação

Git inicialmente limpo, branch `main`, base `22e2304`. Conferidos AGENTS.md, README, estado, planejamento MVP, fluxo `supabase.auth.signUp`, configuração Supabase e contrato/transporte de suporte. Nodemailer 10.3.1, clientes Supabase 2.117.2 e SSR 0.12.7 existentes. Superpowers de entendimento, desenvolvimento orientado a testes, depuração, revisão e verificação; skill Supabase. Context7 consultado para webhooks/pg_net/Cron/Vault; guia de rotas da versão Next.js 16.3.6 instalado também lido. Changelog consultado, sem migrar CLI v2 para v3. Octocode não exposto como ferramenta; nenhuma pesquisa avançada de dependências necessária, buscas locais delimitadas suficientes.

- Ciclo de testes: receptor inicialmente ausente e teste SQL inicialmente sem tabela falharam; implementação passou em seguida. O teste de corpo SQL precisou decodificar `bytea`; comparação SMTP precisou normalizar CRLF. Ambas as correções foram nos testes, não no conteúdo enviado.
- Oito testes do receptor aprovados: assinatura/chave incorreta, expiração/adulteração, rejeição de dados fornecidos pelo chamador, limite de corpo, Unicode, estados de deduplicação e falhas de banco/SMTP.
- 25 verificações pgTAP novas aprovadas por `psql` no contêiner local, com reversão das transações; 38 de exclusão de conta e 11 de suporte também aprovadas. Teste legado de confirmação de e-mail bloqueado por `get_email_confirmation_status(text)` ausente no banco local. A nova migração não remove/altera essa função; a migração histórica que a cria permanece no repositório. Não corrigir essa divergência alheia silenciosamente.
- Integração real local aprovada em desenvolvimento e depois no build de produção: INSERT → fila → pg_net → receptor → RPC → SMTP/Mailpit. Destinatário, assunto, corpo somente nome/e-mail e reentrega sem segunda mensagem conferidos. Conta/segredos/caixa descartáveis removidos; nenhum envio externo.
- Geração de tipos Next, `tsc --noEmit --incremental false` e build `next build --webpack` aprovados em cópia temporária dos fontes/configuração/recursos, sem `.env`, no disco local. Comando de tipos no diretório original ficou sem resposta e somente os processos iniciados pela tarefa foram encerrados; servidor do usuário preservado.
- Revisão independente encontrou privilégios da fila HTTP e divergência Unicode; ambos resolvidos e rechecados, sem novos achados. Autorrevisão do conjunto e `git diff --check` aprovados.

CLI de advisors local tentou conexão TCP e falhou por timeout. `pg_prove` não está instalado no contêiner; testes executados via `psql`, com inspeção explícita de `not ok`/falhas, sem declarar advisors ou suíte inteira aprovados. Histórico da migração local registrado pelo acesso administrativo dentro do contêiner após validação, evitando reaplicação; nenhum banco remoto alterado.

## Resultado e limitações

Funcionalidade pronta localmente, sem commit/push/deploy/ativação hospedada. Recebimento externo e Google real não reexecutados nesta entrega. SMTP pode repetir aviso se houver aceite seguido de falha de confirmação no banco; limite documentado, sem promessa de entrega exatamente uma vez. Após cinco tentativas, a fila exige investigação/reabertura manual; não há novo painel de monitoramento. Operação requer segredos, remetente válido e extensões no destino. Cópia de validação sem arquivos de ambiente permanece no diretório temporário para inspeção.

## Próximo passo

Publicar e provisionar a integração quando autorizado: runtime com chave administrativa/segredo, migração específica, deploy e por último Vault, seguindo o contrato operacional. Criar conta controlada e confirmar recebimento externo, distinguindo aceite SMTP de chegada à caixa. Sugestões de caixa preta ficam a critério do usuário; nenhum roteiro adicional criado.
