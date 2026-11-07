# Registro — v3.10.0 — 2026-11-07 — Imp. de ativação com Fun. de notificação de contas

**Status:** Ativação concluída; envio hospedado aceito pelo SMTP na primeira tentativa. Recebimento na caixa de entrada ainda não confirmado pelo destinatário. Sem mudança funcional ou incremento de versão.

## Objetivo, contexto e requisitos

Concluir ativação já autorizada pelo usuário. Ele confirmou a importação de `SUPABASE_SERVICE_ROLE_KEY` e `ACCOUNT_NOTIFICATION_SECRET` no Netlify; painel confirmou ambas secretas e exclusivamente Production, sem valores em outros contextos. Não revelar ou registrar valores. Base Git `6636506`, `main`, inicialmente limpo. Mantida a regra de não registrar versões do aplicativo no README raiz.

## Decisões, alterações e integrações

- Destino remoto confirmado pela Management API: `nos-dev`, `pyvohqgcwkcfzbtkmbvx`, ativo e saudável. Antes:17 migrações, fila e schema `private` ausentes, nenhuma configuração Vault da integração.
- Aplicada somente a migração versionada `20261107045500_account_signup_notifications.sql` via endpoint oficial de migrações; histórico gerado pela API alinhado à referência do arquivo no mesmo nome, sem alterar migrações anteriores. Fila, gatilho e extensões criados, sem reset/backfill de contas.
- Privilégios conferidos: `anon` e `authenticated` sem execução da RPC administrativa; job `account-notifications` ativo a cada minuto.
- `account_notification_url` configurada no Vault com a URL pública do receptor. O segredo de assinatura precisa ser exatamente o mesmo do Netlify; o serviço não permite lê-lo após salvo. Formulário de novo segredo aberto com nome `account_notification_secret` e descrição, sem preencher valor. Usuário solicitado a colar/salvar diretamente, sem compartilhar pelo chat.
- Novo deploy Netlify `6aeeb99d54c9a4402b3b5a1d` disparado para incorporar as variáveis; painel confirmou Published. Receptor hospedado sem assinatura retornou401, demonstrando que runtime está configurado e bloqueia chamadas não autenticadas.
- Usuário confirmou salvar o mesmo segredo no Vault; interface e consulta administrativa confirmaram os dois nomes, sem revelar valores. Encerrado o handoff. Fluxo autenticado demonstrou que segredo, chave administrativa, RPCs e transporte SMTP funcionam em conjunto.

## Validações e limites

Reutilizados testes/revisão/build da implementação; não repetidas suítes locais. Build da hospedagem necessário para incorporar os segredos concluído. SQL administrativo conferiu histórico/permissões/agendamento; consulta HTTP única conferiu receptor. Nenhum segredo impresso.

Uma única conta descartável, sem senha ou dados reais, gerou evento no gatilho hospedado; despachante autenticou pelo Vault, receptor reservou via chave administrativa e registrou `sent_at`, com `attempts=1`. Assunto `Nós — Nova conta criada`, nome de teste `Teste de notificação` e e-mail sintético; destinatário fixo conforme código. Isso comprova aceite SMTP pelo fluxo real, sem comprovar entrega na caixa. Conta/evento de teste removidos por UUID/e-mail específicos; consulta posterior confirmou fila vazia e dois nomes no Vault. Nenhuma conta real removida ou alterada.

O auxiliar operacional retornou erro depois de confirmar o aceite e executar a limpeza, por importação ausente da função que grava o resultado local. Corrigida a gravação do registro com a evidência já observada, sem repetir o envio nem apresentar a primeira execução do auxiliar como exit0. Auxiliar sem credenciais e resultado local ficam em `artifacts/` ignorado; auxiliar removido ao encerrar. Limites inerentes de duplicidade SMTP e tentativas esgotadas permanecem documentados no contrato.

## Arquivos e próximo passo

Registro operacional, estado/histórico, contrato, Brag e indicação operacional do Atlas atualizados. Sem alteração em código, manifesto ou telas; versão preservada. Encerramento documental integra publicação já autorizada, com `[skip netlify]` para evitar outro build. Próximo passo: destinatário conferir recebimento na entrada/spam e relatar o resultado; acompanhar novos cadastros e consulta agregada de tentativas conforme contrato. Não disparar outro teste automaticamente apenas para obter confirmação de caixa.
