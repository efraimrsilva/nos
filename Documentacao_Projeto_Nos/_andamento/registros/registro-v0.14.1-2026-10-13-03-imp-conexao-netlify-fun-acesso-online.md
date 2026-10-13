# Registro — v0.14.1 — 2026-10-13 — Imp. de conexão Netlify com Fun. de acesso online

**Status:** Em andamento. Conexão e login online validados; cadastro com confirmação externa bloqueado por SMTP. Versão preservada até concluir a solicitação completa.

## Objetivo, contexto e requisitos

Conectar https://noslife.netlify.app ao Supabase existente nos-dev para criar contas e entrar. Git inicialmente limpo, main em a219fb4c49accb59bb0870b8a75e7678ddaf7e63. Aplicativo publicado pelo usuário, com Next.js 16.3.6 e adaptador Netlify v5.16.2. Os fluxos de autenticação já existem; o formulário online retornava “A autenticação ainda não está configurada neste ambiente.” O painel autenticado confirmou ausência de variáveis de ambiente.

Critérios: ambiente online conectado, cadastro/retorno de confirmação pelo domínio HTTPS, entrada com conta confirmada, sessão reconhecida nas rotas privadas e saída efetiva. Cadastro para endereços externos depende de envio SMTP funcional.

## Decisões e alterações remotas

- Supabase nos-dev, referência pyvohqgcwkcfzbtkmbvx: Site URL passou de http://127.0.0.1:3000 para https://noslife.netlify.app.
- Preservados quatro retornos locais existentes e adicionados quatro online: /auth/confirm e /auth/recovery, com e sem ?next=**. Não foi acrescentado domínio genérico nem wildcard de domínio.
- Operação isolada via Supabase CLI 2.118.0: diff conferido, campos declarados limitados a auth.site_url e auth.additional_redirect_urls; push parcial e diff posterior sem divergência nos campos declarados. Sem migração ou mudança nas tabelas/regras de acesso.
- Netlify noslife, equipe Efrals: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY e APP_ORIGIN configuradas exclusivamente no contexto Production. Plano permite All scopes, incluindo builds e functions. Utilizada a publishable key existente, sem chave administrativa no aplicativo.
- Deploy sem cache iniciado e confirmado como Published: 6ace48f47aa1bb0b8a70bc68, main em a219fb4. Build e pós-processamento completos. Publicação de configuração autorizada pelo pedido de funcionamento online; não houve commit/push nesta interação.
- Configuração local e código de autenticação preservados. AUTH_RECOVERY_SECRET não foi configurado no Netlify nesta entrega; recuperação completa permanece pendência adicional da etapa 01.

## Arquivos e integrações

- supabase/operacao/netlify/supabase/config.toml: referência parcial dos endereços efetivamente aplicados.
- README.md, _andamento/estado.md, _andamento/historico.md, funcionalidades/conta-entrada.md e brag/BRAG.md: situação operacional e evidências.
- Aplicativo integra Server Actions existentes → cliente Supabase por requisição → Auth → cookies de sessão → proxy/rotas protegidas. APP_ORIGIN determina o retorno dos links solicitados pelo aplicativo; Site URL e allow list determinam os retornos permitidos pelo Auth.
- Nenhum segredo, senha, token de sessão ou chave administrativa foi incluído nos documentos/configuração versionados. Sem mudanças visuais ou de navegação; desenhos/percursos do Atlas permanecem iguais. A pendência de SMTP do Atlas continua válida.

## Validação e revisão

1. Reproduzido login no navegador online antes da configuração com dados fictícios: mensagem de ambiente não configurado.
2. API pública /auth/v1/settings confirmou e-mail habilitado, cadastro permitido e confirmação obrigatória. Consulta de configuração confirmou SMTP próprio desabilitado.
3. Diff remoto posterior confirmou Site URL/retornos aplicados. Netlify confirmou três variáveis e publicação concluída.
4. Jornada por HTTP do formulário real publicado, incluindo Server Actions, executada com conta temporária isolada e previamente confirmada pela API administrativa: login 303 para /nucleos; página Seus Núcleos 200 com cookies; saída 303 para /conta; /nucleos voltou a exigir login. Não foi teste visual autenticado nem prova de e-mail/cadastro público. A API administrativa foi usada apenas na preparação/limpeza da fixture, nunca pelo aplicativo.
5. Conta temporária removida no finally; consulta posterior retornou 404. Nenhum Núcleo criado. Script temporário fora do repositório; senhas/chaves administrativas somente em memória.
6. Primeira execução Node falhou por cadeia de certificados do ambiente; segunda usou --use-system-ca e passou, preservando validação TLS. Sem desabilitar verificação de certificados.
7. Autorrevisão de configuração e diff documental. Sem segunda revisão independente. Build executado pelo Netlify; suíte/tipos locais não repetidos, pois não houve alteração em código/manifestos.
8. git diff --check aprovado; destinos dos links locais dos oito documentos afetados conferidos sem alvo ausente. Configuração parcial versionada reconferida contra o remoto, sem divergência nos campos declarados. Captura do painel Published inspecionada; script temporário de teste removido após a limpeza da conta.

## Resultado, limites e próximo passo

Login online validado com conta confirmada. Em 13/10/2026, usuário reconfirmou que Google ainda não liberou a senha de aplicativo do Gmail. SMTP próprio permanece desabilitado; não foi comprovado cadastro, entrega externa ou confirmação pelo e-mail. O SMTP padrão do Supabase restringe destinatários aos membros da organização; não garante cadastro público.

Assim que a senha for liberada, executar scripts/configure-gmail-smtp.ps1 com entrada oculta e validar uma conta autorizada: criar pelo site, receber confirmação, abrir link no navegador solicitante, entrar, recarregar área privada e sair. Não enviar a senha pelo chat. Recuperação requer também AUTH_RECOVERY_SECRET gerado e armazenado somente no ambiente servidor, com nova publicação.

Referências: [SMTP Supabase](https://supabase.com/docs/guides/auth/auth-smtp), [variáveis Netlify](https://docs.netlify.com/build/configure-builds/environment-variables/), [deploy publicado](https://app.netlify.com/projects/noslife/deploys/6ace48f47aa1bb0b8a70bc68), [preparação Gmail](../funcionalidades/recuperacao-smtp-gmail.md).
