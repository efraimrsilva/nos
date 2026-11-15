# Nós · prévia Angular

Aplicação Angular separada do Next.js durante a migração. A prévia inclui a entrada, criação de conta, confirmação de e-mail, recuperação de senha e criação de Núcleos. Em `/configuracoes/conta`, leia e edite o próprio nome.

Da raiz, com Node.js 24.15 ou superior da série 24 e Docker Desktop:

```powershell
npm ci
npm ci --prefix apps/web
npm run supabase:start
npm --prefix apps/web start
```

Abra [Conta](http://127.0.0.1:4200/conta) com dados descartáveis. Os e-mails vão para a [caixa do Supabase local](http://127.0.0.1:54324). Abra a confirmação e a recuperação no mesmo navegador que iniciou o pedido, inclusive em outra aba. O formulário de nova senha exige um link válido e volta a exigir outro link se for recarregado.

A criação de Núcleos usa as migrações locais `20261115162000` e `20261115162100`. Em um Supabase local já iniciado com histórico sincronizado, aplique-as com o comando de migração local antes de testar a criação.

A configuração local autoriza as portas 4200 e 3200 para os retornos. Se o Supabase já estava iniciado quando `supabase/config.toml` mudou, a opção que usa a configuração anterior é `npm --prefix apps/web start -- 3200`. Para carregar a nova lista quando puder interromper o ambiente local, use `npm run supabase:stop` seguido de `npm run supabase:start`. Esses comandos preservam os volumes.

Google depende de configuração no Supabase e no provedor. O botão aparece quando `NOS_ANGULAR_GOOGLE=1` é definido antes de iniciar a prévia. A sessão comum pertence ao navegador da prévia e a sessão de recuperação fica em memória.

```powershell
npm --prefix apps/web run typecheck
npm --prefix apps/web run build
npm run test:angular
```

O Playwright usa a porta 3200, já autorizada no Supabase local. Deixe-a livre ao rodar a suíte. Os testes criam e removem contas e mensagens descartáveis. A configuração pública local fica fora do build de produção. Conexão hospedada e regras de publicação serão ensaiadas nas etapas do [plano](../../Documentacao_Projeto_Nos/_andamento/planos/migracao-angular.md).
