# Ensaio Angular no Netlify

Use um site de ensaio e um projeto Supabase exclusivos para contas descartáveis. O site tem base na raiz do repositório, **Package directory** `apps/web` e a configuração desse pacote. Confirme que o build usa `apps/web/netlify.toml` e que a integração Next.js não está instalada no site de ensaio. A instalação da raiz fornece as bibliotecas das funções. O comando do site instala também as dependências do Angular e publica `apps/web/dist/nos-web/browser`. A configuração Netlify da raiz continua responsável pelo site atual. [Configuração para monorepos](https://docs.netlify.com/build/configure-builds/monorepos/)

## Ensaio no site existente

Para testar a entrega estática no site atual, publique um rascunho do Netlify com URL própria. Confira os links diretos, os cabeçalhos, o 404 da API e as funções sem credenciais de envio. Registre o deploy público antes e depois para confirmar que o rascunho não assume o domínio principal.

O teste completo da fila e do e-mail ainda requer um Supabase de ensaio e uma caixa descartável. O projeto do site atual já usa a fila de usuários reais. O rascunho pode testar o acesso público sem alterar as configurações globais do Auth ou do Vault.

Em 17/11/2026, o [rascunho Angular v4.0.0-alpha.10](https://6afbcf907b3227096c6e364b--noslife.netlify.app/conta) foi verificado inicialmente sem sessão. Depois, o usuário confirmou que conseguiu entrar no sistema. A [implantação de ensaio no Netlify](https://app.netlify.com/projects/noslife/deploys/6afbcf907b3227096c6e364b) deixou o domínio público no mesmo deploy Next.js. As páginas de retorno foram conferidas com `Referrer-Policy: no-referrer`, e as respostas das funções com `Cache-Control: no-store`.

Para refazer a prova local da fila, inicie um projeto Supabase descartável em outro diretório, com identificador e portas próprios, usando uma cópia das migrações versionadas. Configure somente o Vault descartável para um receptor local com caixa de captura. Confira falha e liberação da reserva, nova tentativa, confirmação no banco e reenvio do mesmo evento. A [evidência da rodada](../../../Documentacao_Projeto_Nos/_andamento/registros/registro-v4.0.0-alpha.10-2026-11-17-imp-ensaio-angular-fun-rascunho-netlify-e-fila.md) registra o que foi observado.

## Variáveis por escopo

| Escopo | Variáveis |
| --- | --- |
| Builds e Functions | `NOS_ANGULAR_SUPABASE_URL` (origem HTTPS do projeto isolado) e `NOS_ANGULAR_SUPABASE_PUBLIC_KEY` (publishable ou anon) |
| Builds | `NOS_ANGULAR_GOOGLE=1` opcional, depois de preparar o provedor no projeto isolado |
| Functions | `NOS_ANGULAR_SUPABASE_SERVICE_ROLE_KEY` e `NOS_ANGULAR_ACCOUNT_NOTIFICATION_SECRET` para o receptor assinado. Segredo de pelo menos 32 caracteres, independente do site atual |
| Functions | `NOS_ANGULAR_SANDBOX_MAIL_TO` (endereço em `example.test`) e `NOS_ANGULAR_SANDBOX_SMTP_HOST`, `NOS_ANGULAR_SANDBOX_SMTP_PORT`, `NOS_ANGULAR_SANDBOX_SMTP_USER`, `NOS_ANGULAR_SANDBOX_SMTP_PASSWORD` e `NOS_ANGULAR_SANDBOX_MAIL_FROM` para uma caixa SMTP (protocolo de transferência de correio simples) de captura, sem encaminhamento externo |

O build só grava URL, chave pública e opção Google no arquivo `supabase.json`. Credenciais administrativas, de transporte e de assinatura pertencem às funções. Configure as variáveis no painel e mantenha os valores secretos fora do Git, dos logs e de capturas. O envio fica indisponível na ausência de transporte de teste e de destinatário válido. O ensaio usa TLS (segurança da camada de transporte).

## Retornos do Auth e envio de teste

1. No projeto Supabase isolado, confira as migrações da branch e os modelos [de e-mail](../../../supabase/templates/README.md). Configure a origem HTTPS da prévia e os retornos `/auth/confirm`, `/auth/recovery` e `/auth/callback`, contemplando o parâmetro de retorno `next`. Use a mesma origem e o mesmo navegador para iniciar e concluir os fluxos com PKCE (prova de posse de chave temporária).
2. Com publicação de ensaio autorizada, confirme que uma rota interna aberta diretamente carrega o Angular, que os retornos preservam a consulta e que uma rota `/api/*` desconhecida devolve 404. As duas rotas de integração são encaminhadas às funções antes da regra geral. Confira `Cache-Control: no-store` e `Referrer-Policy: no-referrer`.
3. Cadastre uma conta de exemplo, teste confirmação, recuperação, recarga, renovação de sessão, saída e retorno de convite. Teste Google somente após configurar o provedor. O armazenamento Angular tem origem própria. Uma sessão da aplicação Next.js deve ser tratada como nova autenticação na virada, até haver evidência de continuidade.
4. Configure o Vault (cofre de segredos) **do Supabase isolado** com `account_notification_url` apontando para `https://<prévia>/api/account-notifications` e `account_notification_secret` igual ao segredo da função. Use apenas contas descartáveis. Confirme a fila, a reserva, o aceite da caixa de captura, a confirmação no banco e uma repetição sem novo envio para evento confirmado. Se o servidor de e-mail aceitar e a confirmação no banco falhar, a repetição poderá duplicar a mensagem.
5. Envie um relato pela conta descartável confirmada. Confira mensagem capturada, limite de um minuto e preservação do texto quando o serviço falha. Os relatos não usam a chave administrativa.
6. Registre o artefato e o identificador da implantação de ensaio. Ensaiar retorno significa religar somente o destino anterior do ambiente isolado e repetir os fluxos críticos. Na futura virada, registre o último deploy público e a ponte da fila separadamente. Este roteiro de prévia opera apenas com destinatários de teste. A13 precisa configurar e verificar a entrega de produção antes da virada.

[Retornos do Supabase Auth](https://supabase.com/docs/guides/auth/redirect-urls) · [Funções Netlify](https://docs.netlify.com/build/functions/configuration/)

## Verificação local da implementação

Da raiz, com as dependências instaladas:

```powershell
node --test scripts/test-angular-preview.mjs scripts/test-angular-support.mjs scripts/test-account-notifications.mjs
npm --prefix apps/web run typecheck
node scripts/build-angular-preview.mjs
```

O comando de build exige as variáveis públicas do ambiente de ensaio no processo. Os testes Node usam transporte e banco simulados. A verificação de roteiro e dos adaptadores não comprova a publicação Netlify, a fila ativa ou a entrega de e-mail.
