# Aviso de novas contas — v3.10.0

**Ativação e recebimento — 07/11/2026:** migração remota aplicada, segredos Netlify/Vault configurados e runtime publicado no deploy `6aeeb99d54c9a4402b3b5a1d`. Mensagem de teste aceita pelo SMTP na primeira tentativa; conta descartável/evento removidos. Destinatário confirmou recebimento com somente nome/e-mail e relatou sucesso em outro teste, sem detalhar o método de cadastro. [Ativação e evidências](../registros/registro-v3.10.0-2026-11-07-imp-ativacao-fun-notificacao-contas.md). [Publicação inicial e interrupção anterior](../registros/registro-v3.10.0-2026-11-07-imp-publicacao-fun-notificacao-contas.md).

## Contrato

A criação de uma linha em `auth.users` com e-mail gera um aviso administrativo para o destinatário fixo já utilizado em `src/features/support/mail.ts`. Abrange cadastro com e-mail e criação pelo Google; login posterior, confirmação, edição e associação de identidade à mesma conta não inserem outra linha e não geram aviso. Sem preenchimento retroativo de contas anteriores à migração. Uma exclusão seguida de nova criação representa outra conta.

Assunto fixo: `Nós — Nova conta criada`. Corpo em texto simples, exclusivamente:

```text
Nome: <nome da nova conta>
E-mail: <e-mail da nova conta>
```

Não incluir senha, hash, token, identificador, data, contagens ou metadados no relatório. Nome inicial vem de `name`, depois `full_name`; controles são removidos, limite de 200 pontos Unicode. Ausência de nome resulta em `Não informado`; o aviso não espera eventual complemento posterior do perfil. Contas sem e-mail não geram aviso, coerentemente com os dois métodos de acesso atuais. O aviso acompanha cadastros; não mede espaço, processamento ou conexões do Supabase.

## Fluxo e proteção

1. Gatilho grava nome/e-mail e referência da conta em `private.account_notifications`, com segurança por linha (RLS) e sem acesso de visitantes ou contas comuns. Não serializa `auth.users`.
2. `pg_cron` executa `private.dispatch_account_notifications()` a cada minuto; até dez eventos por execução, intervalo mínimo de cinco minutos e máximo de cinco tentativas por evento. Sem configuração no Vault, não consome tentativas.
3. `pg_net` envia `{}` para `/api/account-notifications`, com referência do evento, timestamp e assinatura HMAC (código de autenticação de mensagem baseado em hash) SHA-256. Nome, e-mail e segredo reutilizável não entram na fila HTTP. Isso evita depender dos privilégios amplos que algumas instalações de `pg_net` atribuem à própria fila.
4. Receptor compara a assinatura em tempo constante, aceita até cinco minutos de idade e no máximo 30 segundos no futuro. Rejeita corpo que contenha quaisquer campos. Segredo válido e identificador assinado são necessários antes de consultar o banco.
5. Somente a chave administrativa do servidor pode executar `claim_account_notification(uuid)`. A função reserva atomicamente por dez minutos e retorna estado operacional, nome e e-mail. Reentrega de evento concluído não envia novamente; reserva ocupada impede envio concorrente.
6. O transporte SMTP (protocolo de envio de e-mail) existente envia a mensagem. Aceite confirmado remove nome/e-mail da fila; falha libera a reserva para nova tentativa. Respostas HTTP não revelam os dados nem detalhes de erros.

A fila operacional é eliminada após 30 dias, inclusive eventos sem entrega. Essa limpeza é restrita aos avisos, sem alterar as contas. A referência possui exclusão em cascata quando a própria conta é removida. Falha ao inserir na fila não bloqueia cadastro e emite aviso fixo `account_notification_enqueue_failed` com código SQL, sem dados pessoais; nesse caso pode haver perda do aviso e é necessária investigação operacional.

## Configuração e ativação hospedada — procedimento aplicado

Configuração aplicada no destino autorizado; passos abaixo documentam operação e eventual recuperação, sem instruir reaplicação de migração ou substituição de segredos existentes. Não há ativação remota implícita ao editar arquivos. Conferir explicitamente destino/branch e autorização de publicação antes de aplicar em outro ambiente:

1. No ambiente do servidor, preservar `SUPPORT_SMTP_HOST`, `SUPPORT_SMTP_PORT`, `SUPPORT_SMTP_USER`, `SUPPORT_SMTP_PASSWORD`, `SUPPORT_MAIL_FROM`; adicionar `SUPABASE_SERVICE_ROLE_KEY` do mesmo projeto Supabase e `ACCOUNT_NOTIFICATION_SECRET` aleatório de pelo menos 32 caracteres. Segredos somente no runtime, nunca com prefixo `NEXT_PUBLIC_`, no repositório, em logs ou capturas.
2. Revisar/aplicar somente a migração `supabase/migrations/20261107045500_account_signup_notifications.sql` no destino autorizado. Habilita `pg_net` e `pg_cron`; requer disponibilidade dessas extensões. Confirmar RPCs restritas ao `service_role`, fila privada, gatilho e job. Não aplicar outras migrações pendentes por engano.
3. Publicar o código e confirmar disponibilidade da rota. Sem configuração, ela retorna 503; com configuração e sem assinatura, retorna 401.
4. No Vault do mesmo banco, cadastrar `account_notification_url` com `https://noslife.netlify.app/api/account-notifications` e `account_notification_secret` com exatamente o mesmo segredo do runtime. Não usar chave administrativa como segredo de assinatura. Configurar o Vault por interface segura, sem expor o valor em histórico de comandos.
5. Validar nova conta controlada e conferir recebimento na caixa real. Aceite SMTP, chegada à caixa de entrada e ausência de spam são evidências distintas. Google real não foi reexecutado nesta entrega; o gatilho sobre a criação da conta foi testado com dados representativos.

Limite inicial esperado: processamento no próximo minuto quando não houver fila; não é garantia de prazo de recebimento. No limite de dez eventos/minuto, avaliar volume real antes de aumentar lote ou contratar serviços. Nenhuma nova dependência ou contratação foi adicionada.

## Operação, recuperação e limites

Consulta agregada no SQL administrativo, sem listar nomes/e-mails:

```sql
select
  count(*) filter (where sent_at is null and attempts < 5) as pendentes,
  count(*) filter (where sent_at is null and attempts >= 5) as tentativas_esgotadas,
  count(*) filter (where sent_at is not null) as aceitos_pelo_smtp
from private.account_notifications;
```

Após corrigir configuração/serviço, reabrir somente evento conhecido e não concluído:

```sql
update private.account_notifications
set attempts = 0, next_attempt_at = now(), reserved_until = null
where id = '<id-do-evento>'::uuid and sent_at is null;
```

Pausar envio preservando pendências: `select cron.unschedule('account-notifications');`. Retomar: `select cron.schedule('account-notifications', '* * * * *', 'select private.dispatch_account_notifications()');`. Não remover extensões compartilhadas nem dados de autenticação. Não reiniciar tentativas automaticamente em loop.

SMTP não garante entrega única: se o provedor aceitar e a confirmação no banco falhar, uma tentativa posterior poderá repetir o aviso. Mensagens rejeitadas/falhas não produzem sucesso; reentregas já confirmadas e chamadas concorrentes são controladas pelo banco. Não há painel nem alerta adicional para tentativas esgotadas; acompanhar consulta agregada e falhas do job. Serviço de e-mail e caixa do destinatário mantêm as mensagens conforme sua própria operação; limpar a fila do aplicativo não remove mensagens externas.

## Validação reproduzível

- `npm run test:account-notifications`: autenticação/expiração/adulteração, corpo mínimo, estados de deduplicação, validação Unicode, falhas de banco e SMTP.
- `supabase/tests/account_notifications.sql`: pgTAP local com reversão da transação; permissões, criação por e-mail/Google, ausência de dados na fila HTTP, assinatura e tentativas.
- `npm run test:account-notifications:local`: requer migração local aplicada, Docker/Supabase local e imagem Mailpit existente. Usa somente serviços locais, portas 3198/3026/8027 livres, fila sem pendências e sem Vault previamente configurado para esta integração. Cria conta/segredos/caixa descartáveis e remove esses dados ao encerrar; não altera configuração operacional existente. Mantém cópia de fontes sem `.env` no diretório temporário para inspeção. `-- --build` também executa geração de tipos, TypeScript e build Webpack nessa cópia, preservando o servidor do usuário.

[Registro da entrega](../registros/registro-v3.10.0-2026-11-07-imp-notificacao-cadastro-fun-aviso-email.md).
