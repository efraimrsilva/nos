# Registro — v4.0.1 — 2026-11-26 — Imp. de configuração Netlify com Fun. de variáveis Angular

**Status** Concluído no Netlify. Compilação e publicação validadas, nomes legados removidos.

## Objetivo e decisão

Retirar os nomes públicos legados do Next.js do Netlify sem alterar o projeto Supabase, rotacionar segredos ou misturar ensaio com produção. O painel recebeu SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY somente no contexto Production. As credenciais SUPABASE_SERVICE_ROLE_KEY e ACCOUNT_NOTIFICATION_SECRET permaneceram no escopo de servidor preexistente. A versão 4.0.1 foi preservada para o ajuste de hospedagem.

## Arquivos, integração e evidências

- netlify.toml e painel Netlify. Runtime Next.js removido e flag de supressão removida da configuração.
- apps/web/netlify/preview-mail.mjs e scripts/build-angular-preview.mjs. O build e as funções resolvem o mesmo par público. Uma configuração Angular explícita de outro projeto continua exigindo as próprias credenciais.
- scripts/test-angular-preview.mjs. Cobertura para produção sem variáveis antigas, bloqueio de configuração incompleta e isolamento do ensaio.
- O novo cenário falhou antes da alteração. Depois, 21 testes de integração e o comando de build de produção com valores fictícios passaram. O build reteve avisos de tamanho de CSS preexistentes.

## Resultado e limites

O [deploy 4d9d8bf](https://app.netlify.com/projects/noslife/deploys/6b089789ebfa3bad67664391) foi publicado. Conta abriu e o arquivo público conferiu com o par Supabase configurado em Production. As duas funções constam no painel; a sondagem HTTP direta foi inconclusiva e entrega de e-mail real não foi testada. Após confirmação, as duas variáveis NEXT_PUBLIC foram excluídas e a Conta continuou abrindo com a opção Google. Retomar a fase 2 conforme o plano de migração.
