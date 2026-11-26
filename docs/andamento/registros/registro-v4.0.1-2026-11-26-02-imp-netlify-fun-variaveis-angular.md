# Registro — v4.0.1 — 2026-11-26 — Imp. de configuração Netlify com Fun. de variáveis Angular

**Status** Configuração e código validados localmente. Verificação da publicação e remoção das duas variáveis antigas registradas no estado do projeto.

## Objetivo e decisão

Retirar os nomes públicos legados do Next.js do Netlify sem alterar o projeto Supabase, rotacionar segredos ou misturar ensaio com produção. O painel recebeu SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY somente no contexto Production. As credenciais SUPABASE_SERVICE_ROLE_KEY e ACCOUNT_NOTIFICATION_SECRET permaneceram no escopo de servidor preexistente. A versão 4.0.1 foi preservada para o ajuste de hospedagem.

## Arquivos, integração e evidências

- netlify.toml e painel Netlify. Runtime Next.js removido e flag de supressão removida da configuração.
- apps/web/netlify/preview-mail.mjs e scripts/build-angular-preview.mjs. O build e as funções resolvem o mesmo par público. Uma configuração Angular explícita de outro projeto continua exigindo as próprias credenciais.
- scripts/test-angular-preview.mjs. Cobertura para produção sem variáveis antigas, bloqueio de configuração incompleta e isolamento do ensaio.
- O novo cenário falhou antes da alteração. Depois, 21 testes de integração e o comando de build de produção com valores fictícios passaram. O build reteve avisos de tamanho de CSS preexistentes.

## Próximo passo

Validar a publicação, a página Conta, a configuração pública e o roteamento das duas funções sem enviar mensagens reais. Retirar os dois nomes legados do painel após esse aceite.
