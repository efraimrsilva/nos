# E-mails do Nós

Catálogo de 13 mensagens, com assuntos e textos próprios: seis modelos de autenticação e sete avisos de segurança. Todos usam a identidade do aplicativo (verde, creme, lilás, marca tipográfica e assinatura Equipe Nós), HTML com tabelas e estilos inline, sem fontes, imagens ou rastreadores externos.

## Situações

| Modelo | Situação | Uso no aplicativo |
|---|---|---|
| confirmation.html | Confirmação de cadastro e reenvio | Fluxo existente |
| recovery.html | Recuperação de senha | Fluxo existente |
| invite.html | Convite administrativo para criar acesso | Preparado; não equivale a convite de Núcleo |
| magic_link.html | Link de entrada sem senha | Preparado; aplicativo não oferece este fluxo |
| email_change.html | Confirmação de troca de e-mail | Preparado; aplicativo não oferece este fluxo |
| reauthentication.html | Código para confirmar ação sensível | Preparado; aplicativo não oferece este fluxo |
| password_changed.html | Senha alterada | Modelo pronto; envio depende da ativação já existente no servidor |
| email_changed.html | E-mail alterado | Modelo pronto; envio depende da ativação já existente no servidor |
| phone_changed.html | Telefone alterado | Modelo pronto; envio depende da ativação já existente no servidor |
| identity_linked.html | Forma de acesso vinculada | Modelo pronto; envio depende da ativação já existente no servidor |
| identity_unlinked.html | Forma de acesso desvinculada | Modelo pronto; envio depende da ativação já existente no servidor |
| mfa_factor_enrolled.html | Verificação adicional adicionada | Modelo pronto; envio depende da ativação já existente no servidor |
| mfa_factor_unenrolled.html | Verificação adicional removida | Modelo pronto; envio depende da ativação já existente no servidor |

## Edição e conferência

Edite os textos em `catalog.json` e o layout em `scripts/generate-auth-emails.mjs`. Execute, na raiz do repositório:

```powershell
node scripts/generate-auth-emails.mjs
node scripts/verify-auth-emails.mjs
```

O primeiro comando gera os 13 arquivos HTML e as configurações. O segundo verifica correspondência dos arquivos com o catálogo, variáveis permitidas, ausência de scripts e recursos externos, links de ação/fallback, botões e largura em computador/celular; gera [galeria com exemplos fictícios](../../Documentacao_Projeto_Nos/wireframes/comparacoes/2026-10-27-emails-personalizados/index.html). Não envia e-mails e não comprova compatibilidade real com todas as versões do Outlook/Gmail.

## Aplicação no Supabase hospedado

Os modelos locais em `supabase/config.toml` só valem para o ambiente local. Hospedagem do site ou push no GitHub não atualizam os e-mails do Supabase.

A publicação usa a Management API oficial do Supabase, com payload restrito aos13 assuntos e13 HTMLs. O script compara o estado antes/depois e exige igualdade remota dos modelos; não envia SMTP, senha, origem, retornos, recursos de login ou ativação de avisos. A CLI2.118.0 é usada somente para login. `config diff` não compara HTML e `config push` ignora conteúdos de notificações desativadas; por isso não são usados para publicar estes13 modelos. Nunca publicar a configuração local completa.

```powershell
# Caso a CLI não esteja instalada, prepara a versão testada no cache do npm.
npx supabase@2.118.0 --help
# Login interativo, sem enviar credenciais pelo chat.
node scripts/configure-auth-emails.mjs --login
# Somente leitura; saída remota e segredos nunca são impressos.
node scripts/configure-auth-emails.mjs --check
# Publica e exige comparação sem diferenças após a aplicação.
node scripts/configure-auth-emails.mjs --apply
```

O projeto está fixado em `pyvohqgcwkcfzbtkmbvx` (nos-dev). O script reutiliza a credencial da CLI no chaveiro do sistema, com o mesmo serviço/alvos documentados no código oficial e leitura direcionada por `@napi-rs/keyring`2.1.2, dependência de desenvolvimento fixada. Também aceita `SUPABASE_ACCESS_TOKEN` no ambiente e o arquivo alternativo documentado pela CLI. O token fica somente em memória e é enviado apenas a `https://api.supabase.com`; saídas administrativas não são impressas nem gravadas. O conector disponível não oferece edição de configuração Auth. Os13 modelos foram aplicados e conferidos em27/10/2026; os sete avisos continuaram desativados. Confira os limites da validação no [registro da entrega](../../Documentacao_Projeto_Nos/_andamento/registros/registro-v3.1.3-2026-10-27-imp-emails-fun-modelos-personalizados.md).

## Links e variáveis

Confirmação, recuperação, convite, link de entrada e troca de e-mail preservam exatamente `{{ .ConfirmationURL }}` tanto no botão quanto no fallback. Não reconstruir o token, não fixar uma origem de produção no HTML e não modificar os callbacks do aplicativo como parte de uma troca visual. A validade real pertence ao Auth; o texto não inventa prazo. Reautenticação usa `{{ .Token }}` no corpo, sem código no assunto ou prévia. Avisos usam somente variáveis próprias de cada evento. Marca e links comuns usam `{{ .SiteURL }}`.

Alterar um modelo não ativa fluxos ou avisos. Não simular disparos de recursos ainda ausentes no aplicativo. Desabilitar rastreamento de links no provedor continua necessário se estiver configurado, pois reescrita de links pode prejudicar autenticação.

[Documentação oficial dos modelos](https://supabase.com/docs/guides/auth/auth-email-templates) · [configuração local](https://supabase.com/docs/guides/local-development/customizing-email-templates).
