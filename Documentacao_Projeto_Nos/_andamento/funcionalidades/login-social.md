> **v3.9.1 — 07/11/2026:** somente Google como botão social na Conta; e-mail/senha preservados. Microsoft descartado; Apple sem botão e desativado. Google já confirmado em produção3.9.0; retirada do botão publicada e conferida em produção. Trechos datados abaixo são históricos.

# Login social Google e Apple — v3.9.0 — 2026-11-06

**Situação vigente:** Google configurado no projeto Cloud nos-sintagma-login e habilitado no Supabase hospedado nos-dev. Aplicativo de desenvolvimento http://127.0.0.1:3000 ativado por variável local; login real e sessão após recarregar confirmados em06/11/2026. Credenciais transferidas pelo usuário diretamente entre painéis, sem chat/Git. Apple permanece desativada. O Google ainda não foi ativado no runtime do site publicado. Esta ativação conclui a preparação operacional Google da v3.9.0, sem nova alteração de código de autenticação.

## Contrato do aplicativo

Conta (`/conta`, Telas01/02) oferece Continuar com Google e Continuar com Apple, nessa ordem, tanto em Criar conta como em Já tenho conta. O serviço externo pode criar a conta no primeiro acesso. O formulário de e-mail e senha continua disponível. Enquanto o provedor estiver desativado no aplicativo, clicar informa sua indisponibilidade, sem simular autenticação.

A ação no servidor aceita somente os dois provedores. Supabase Auth inicia OAuth (autorização delegada ao provedor) com PKCE (prova de posse de chave temporária); o cliente SSR (renderização no servidor) existente grava o verificador em cookie httpOnly. O retorno técnico `/auth/callback` troca um código único por sessão. O aplicativo valida APP_ORIGIN, aceita somente destinos internos já permitidos e preserva convites sem aceitá-los ou criar participação automaticamente. Cancelamento retorna ao login; falhas apresentam mensagem local, sem refletir detalhes externos. Callback sem cache e sem Referer; logs de requisições do desenvolvimento ignoram a rota. Na hospedagem, conferir também a política de logs do provedor.

Um nome válido já escolhido pela pessoa permanece. `full_name`, quando fornecido e válido, é salvo em `name` para compatibilidade com perfil/listas. Sem nome válido, o callback abre `/conta?completar=nome`, preservando `next`. A pessoa informa de 1 a 80 caracteres; a ação autenticada existente confirma sua conta antes de salvar. O nome é apresentação, nunca autorização. Endereços de retransmissão da opção Ocultar meu e-mail da Apple não devem ser usados para tentar unir contas por nome.

O vínculo de identidades com e-mail coincidente segue as regras do Supabase Auth. Esta entrega não implementa ligação/desligamento manual de provedores, fusão de contas com e-mails diferentes ou importação de contatos. [Contrato oficial de identidades](https://supabase.com/docs/guides/auth/auth-identity-linking).

## Avaliação breve de frameworks

**Opção escolhida:** Supabase Auth com `@supabase/ssr`0.12.7 e `@supabase/supabase-js`2.117.2 já instalados. Suporta Google/Apple e PKCE com a sessão usada pelo proxy e pelas regras de banco. Benefício esperado: reaproveitar a integração existente e reduzir configuração e manutenção; sem medição de custo/desempenho em produção.

**Alternativas consideradas:** adicionar outra camada de autenticação ou usar os SDKs próprios dos dois provedores. Nenhuma necessidade do escopo justifica um segundo gerenciamento de sessão ou fluxos específicos de navegador. Preservadas versões, arquitetura e dependências. Context7 consultado na versão SSR utilizada; documentação oficial dos provedores complementa os requisitos operacionais.

## Ativação — primeiro Google

1. Conferir o projeto Supabase de destino e a URL real do aplicativo. Não aplicar a configuração local completa no projeto hospedado.
2. No Google Auth Platform, preparar a tela de consentimento e criar um cliente OAuth do tipo Aplicativo da Web. Configurar origens autorizadas para os ambientes usados. Se o aplicativo estiver em teste, incluir as contas de teste permitidas pelo Google.
3. Copiar do painel Supabase → Authentication → Sign In / Providers → Google o endereço de retorno do Auth. Cadastrar esse endereço no cliente Google, normalmente `https://<project-ref>.supabase.co/auth/v1/callback`. Para Auth estritamente local, usar o retorno indicado no painel/CLI local, normalmente `http://127.0.0.1:54321/auth/v1/callback`.
4. Salvar Client ID e Client Secret no provedor Google do Supabase e habilitá-lo. O segredo não pertence ao frontend, a variáveis NEXT_PUBLIC, ao Git ou ao chat.
5. No Supabase → URL Configuration, configurar Site URL e permitir o retorno **do aplicativo**: `<APP_ORIGIN>/auth/callback` e a variante que conserva `next`. O retorno do Google para o Supabase e o retorno do Supabase para o Nós são endereços diferentes. Para produção, limitar o padrão à rota necessária, por exemplo `https://<dominio>/auth/callback?next=**`, sem liberar todas as origens.
6. No servidor do Nós, configurar APP_ORIGIN com a origem completa, sem caminho, e `GOOGLE_AUTH_ENABLED=true`. Reiniciar o processo local ou publicar a configuração no runtime autorizado. A variável é uma chave de ativação do aplicativo; ela não configura o provedor por si só.
7. Conferir o fluxo real com uma conta autorizada antes de disponibilizar o acesso. Em caso de falha, voltar `GOOGLE_AUTH_ENABLED=false`; login por e-mail continua disponível.

## Em seguida Apple

1. Preparar a configuração necessária no Apple Developer: App ID com Sign in with Apple, Services ID para web e chave de assinatura. Confirmar os requisitos da conta no painel Apple antes de contratar serviços.
2. Registrar no Services ID o domínio e o retorno HTTPS informados pelo Supabase, normalmente `https://<project-ref>.supabase.co/auth/v1/callback`. Para o teste web da Apple, preferir um Auth de desenvolvimento com domínio HTTPS registrado; não presumir que o callback HTTP local é aceito pela Apple.
3. Gerar o segredo do cliente com a chave de assinatura, guardar o arquivo `.p8` com segurança e registrar validade/responsável pela renovação. O segredo do fluxo web tem validade máxima de seis meses; renová-lo antes do vencimento. Não foi criada automação de renovação nesta entrega.
4. Configurar o provedor Apple no Supabase com o Services ID como identificador do fluxo web e o segredo gerado. Conferir o retorno do aplicativo na URL Configuration, conforme o Google.
5. Ativar `APPLE_AUTH_ENABLED=true` no servidor do Nós e verificar entrada, cancelamento, nome ausente e Ocultar meu e-mail. Havendo falha, voltar a variável para `false`.

## Ambiente local e limites

`.env.example` documenta as duas variáveis, ambas falsas por padrão. O arquivo `supabase/config.toml` inclui o callback do aplicativo local, preservando as URLs anteriores; isso não altera um Supabase já em execução nem o ambiente remoto. Para habilitar provedores no Auth local, seguir a documentação oficial e referências a segredos por variável de ambiente, sem versionar valores. Não reiniciar serviços do usuário sem necessidade operacional concreta.

As verificações automatizadas isolam respostas de provedores e usam conta descartável somente no Supabase local para gravar o nome. Elas não comprovam consentimento real Google/Apple, validade de credenciais, cookies após troca OAuth externa, Safari ou dispositivo físico. Não há migração de dados nesta entrega. Roteiros de caixa preta existentes preservados; sugestões de novos testes são submetidas ao usuário.

**Referências:** [Google](https://supabase.com/docs/guides/auth/social-sign-in/auth-google), [Apple](https://supabase.com/docs/guides/auth/social-sign-in/auth-apple), [SSR0.12.7](https://github.com/supabase/ssr/blob/v0.12.7/docs/design.md).
