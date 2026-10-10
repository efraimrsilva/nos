# Recuperação de acesso e SMTP Gmail — v0.13.2

Atualizado em 2026-10-10. **Status: preparação concluída; ativação externa bloqueada pela verificação do Google.** O usuário escolheu Gmail e indicou `sintagmasoftware@gmail.com` como remetente. Criou a conta em 2026-10-09 e informou que o Google exige dispositivo/chave registrado há pelo menos sete dias para confirmar a identidade e liberar a ação. A espera depende do registro do fator de verificação, não apenas da idade da conta. Nenhuma credencial deve ser adicionada ao Git, ao Atlas ou a este documento.

## Preparação entregue e retomada com a senha

- Configuração isolada e preenchida: `supabase/operacao/gmail/supabase/config.toml`. Todos os parâmetros não secretos já estão definidos; a senha vem exclusivamente da variável de processo `NOS_GMAIL_SMTP_PASSWORD` durante a execução.
- Comando: `scripts/configure-gmail-smtp.ps1`. Reutiliza Supabase CLI 2.118.0 autenticada, confere o vínculo com nos-dev, lê diff remoto sem exibir credenciais e impede campos declarados fora de SMTP. Configuração principal do ambiente local/Mailpit preservada.
- `-Check` foi executado e aprovado em 2026-10-09: TOML e acesso remoto conferidos com valor fictício, somente leitura. Nenhum campo remoto foi alterado e nenhuma mensagem externa foi enviada.
- O caminho de aplicação com senha real ainda não foi executado. A preparação não equivale a SMTP autenticado nem entrega comprovada.

Após o Google liberar a senha de app, na raiz `nos`, executar:

```powershell
.\scripts\configure-gmail-smtp.ps1
```

O comando pede a senha de forma oculta e aplica somente os campos SMTP ao nos-dev. Não passa senha na linha de comando, não salva em `.env.local` e restaura a variável de processo ao terminar. Não usar `-Check` nessa etapa de aplicação. Para reconferir somente a preparação, usar `-Check`. A alternativa manual no painel permanece abaixo.

Depois de aplicar, seguir os critérios de recebimento/recuperação externa. Se o login da CLI tiver expirado nesse intervalo, reautenticar a CLI; a conferência atual não garante que a sessão continuará válida. Não enviar a senha pelo chat.

O prompt oculto do PowerShell permite fornecer a credencial sem publicá-la no chat ou no Git. Esse mecanismo protege a entrada, mas não altera as exigências de autenticação do Google: usar a senha de aplicativo, quando liberada. Criptografar a senha comum não a torna uma credencial SMTP válida. Usuário solicitou retomar a ativação neste mesmo chat posteriormente.

## Configuração no Supabase

O Supabase Auth envia os e-mails de recuperação; o aplicativo solicita esse envio. Não adicionar Nodemailer, senha Gmail no aplicativo ou outro serviço duplicado.

1. Acessar a conta Google do remetente, ativar verificação em duas etapas e criar uma senha de app identificada como Projeto Nós. Essa etapa exige autenticação do titular. Se a opção não estiver disponível por política da conta, resolver essa restrição com o Google antes de configurar o SMTP.
2. No projeto Supabase usado pelo aplicativo, abrir Authentication → Email → SMTP Settings e habilitar Custom SMTP somente com os campos completos.

| Campo | Valor |
|---|---|
| Sender email / remetente | sintagmasoftware@gmail.com |
| Sender name / nome | Nós |
| Host | smtp.gmail.com |
| Port / porta | 587, com STARTTLS (início de conexão criptografada) |
| Username / usuário | sintagmasoftware@gmail.com |
| Password / senha | senha de app criada no Google; cadastrar diretamente no painel |

3. Salvar e revisar os limites de envio do Auth e do Gmail conforme o uso esperado. Não reduzir o intervalo de segurança de um minuto somente para acelerar testes.
4. Manter confirmação de cadastro habilitada e conferir URLs de retorno do ambiente, incluindo `/auth/recovery` com os destinos internos permitidos. `APP_ORIGIN` precisa corresponder ao endereço real do aplicativo; `AUTH_RECOVERY_SECRET` precisa existir apenas no servidor, com ao menos 32 caracteres aleatórios e igual entre instâncias.

O segredo de recuperação da aplicação e a senha SMTP são credenciais distintas. A senha SMTP fica no Supabase. O segredo da aplicação fica no ambiente do servidor. A configuração local de teste usa Mailpit; não ligar os testes automatizados ao Gmail.

## Critérios para certificar envio externo

- Configuração SMTP salva e autenticada, com remetente indicado.
- Conta de teste autorizada existente no Supabase correto solicita recuperação pela interface real.
- Mensagem recebida com remetente e link corretos; verificar caixa de entrada e spam.
- Link aberto no navegador de origem quando usado PKCE (Proof Key for Code Exchange); template direto com `token_hash&type=recovery` é alternativa já suportada, exigindo configuração própria e preservação do retorno interno.
- URL (endereço) sem código/token após a validação, nova senha salva, login antigo recusado, login novo permitido e destino interno retomado.
- Reutilização do link negada e configuração de publicação com HTTPS (protocolo HTTP criptografado), segredo do servidor e redirecionamentos autorizados conferidos.

Enquanto esses critérios externos não forem verificados, a jornada pode estar validada localmente, mas sua operação pública continua pendente. Não concluir entrega externa pela mensagem neutra da solicitação: ela também aparece para conta inexistente ou falha de envio, para impedir descoberta de cadastros.

## Referências oficiais consultadas em 2026-10-09

- [Google: criar e usar senhas de app](https://support.google.com/accounts/answer/185833?hl=pt-BR).
- [Google: parâmetros SMTP do Gmail](https://support.google.com/mail/answer/7104828?hl=en).
- [Google: confirmação de identidade para ações sensíveis e espera de sete dias](https://support.google.com/accounts/answer/7162782?hl=pt-BR).
- [Supabase: SMTP próprio](https://supabase.com/docs/guides/auth/auth-smtp).
- [Contrato da área Conta e entrada](conta-entrada.md).

**Próximo passo executável:** manter o dispositivo/fator de verificação registrado e aguardar a liberação do Google; gerar senha de app e executar o comando preparado, informando a senha somente no prompt oculto (ou cadastrá-la diretamente no painel). Depois executar o teste externo com conta autorizada e registrar evidência sem tokens nem senhas. Não há data garantida de liberação; se o fator foi registrado em 09/10/2026, sete dias se completam em 16/10/2026, no horário correspondente, conforme as condições do Google.
