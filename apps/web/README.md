# Nós · prévia Angular

Uma aplicação Angular para os navegadores de computador e celular. A interface móvel no navegador espelha a experiência que será empacotada com Capacitor após a estabilização web. Durante a migração, a prévia é executada separadamente do site Next.js. A prévia inclui entrada, criação de conta, confirmação de e-mail, recuperação de senha, criação de Núcleos, convites por código, integrantes e administração. Em `/configuracoes/conta`, leia e edite o próprio nome. No Início do Núcleo, abra **Ver integrantes** ou **Minha participação** para conferir as ações da conta conectada.

No Início, **Ver acordos** abre a lista daquele Núcleo. É possível enviar propostas, responder pela conta conectada e consultar termos, momentos e versões anteriores. A administração controla teste, ativação, revisão e encerramento. O registro de momentos exige aceite dos termos vigentes.

No Início do Núcleo, **Abrir agenda** e os links dos eventos levam à Agenda. O calendário mensal abre a semana escolhida; telas estreitas mostram a lista da semana. É possível criar, responder, editar e remover conforme o vínculo e as permissões já existentes no Supabase.

Da raiz, com Node.js 24.15 ou superior da série 24 e Docker Desktop:

```powershell
npm ci
npm ci --prefix apps/web
npm run supabase:start
npm --prefix apps/web start
```

Abra [Conta](http://127.0.0.1:4200/conta) com dados descartáveis. Os e-mails vão para a [caixa do Supabase local](http://127.0.0.1:54324). Abra a confirmação e a recuperação no mesmo navegador que iniciou o pedido, inclusive em outra aba. O formulário de nova senha exige um link válido e volta a exigir outro link se for recarregado.

A criação de Núcleos usa as migrações locais `20261115162000` e `20261115162100`. Em um Supabase local já iniciado com histórico sincronizado, aplique-as com o comando de migração local antes de testar a criação.

O registro de momentos no Angular também exige as migrações `20261115182000` e `20261115182500`. Elas comparam a versão do formulário dentro da transação e devolvem conflito quando ela mudou. A assinatura anterior permanece disponível para o Next.js. Em um Supabase com histórico sincronizado, use `npm exec supabase -- migration up --local`.

A configuração local autoriza as portas 4200 e 3200 para os retornos. Se o Supabase já estava iniciado quando `supabase/config.toml` mudou, a opção que usa a configuração anterior é `npm --prefix apps/web start -- 3200`. Para carregar a nova lista quando puder interromper o ambiente local, use `npm run supabase:stop` seguido de `npm run supabase:start`. Esses comandos preservam os volumes.

Google depende de configuração no Supabase e no provedor. O botão aparece quando `NOS_ANGULAR_GOOGLE=1` é definido antes de iniciar a prévia. A sessão comum pertence ao navegador da prévia e a sessão de recuperação fica em memória.

```powershell
npm --prefix apps/web run typecheck
npm --prefix apps/web run build
npm run test:angular
```

O Playwright usa a porta 3200 por padrão. Se estiver em uso, defina `NOS_ANGULAR_TEST_PORT` com uma porta livre. Para rodar os testes de e-mail, use uma porta autorizada na lista de retorno do Supabase local. Os testes criam e removem contas e mensagens descartáveis. A configuração pública local fica fora do build de produção. Conexão hospedada e regras de publicação serão ensaiadas nas etapas do [plano](../../Documentacao_Projeto_Nos/_andamento/planos/migracao-angular.md).
