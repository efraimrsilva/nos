# Conta e entrada — v0.13.3

## v0.13.3 — Percurso 04 Entrar por convite — 2026-10-10

Chegada direta exige conta e retorna a Inserir convite, sem impor a lista antes da prévia. Cadastro/confirmação/recuperação preservam o destino; código fica fora das URLs atuais e precisa ser colado depois da autenticação. Prévia mostra tipo; Agora não retorna à lista sem vínculo. [Contrato](entrada-convite.md) e [registro](../registros/registro-v0.13.3-2026-10-10-imp-entrada-convite-fun-percurso-04.md). Sem alteração no contrato de autenticação ou aplicação SMTP remota.

## v0.13.2 — Percurso 03 Recuperar acesso — 2026-10-09

Sequência vigente: Conta (Já tenho conta) → Recuperar acesso → callback `/auth/recovery` validado, sem tela própria → Redefinir senha → Conta (novo login) → Seus Núcleos. Retorno interno específico é preservado e substitui a lista, sem aceitar convite automaticamente. Voltar para Conta nas telas 03–05 abre login. Callback rejeita parâmetros repetidos/misturados, inclusive vazios, antes de consultar Auth; JWT de PKCE ainda exige método recovery.

Validação desta versão: 92 testes desktop/celular; tipos e build; recuperação real com e-mails locais, PKCE e token direto, senha antiga recusada, nova aceita, revogação de refresh token de outra sessão, link reutilizado/prova adulterada negados, link não consumido por entradas ambíguas, retorno específico e padrão; Atlas/Visão global e revisão independente sem P1–P3. Primeiras execuções tiveram espera insuficiente de compilação inicial; integrador passou após margem explícita e suíte completa passou na repetição. Não houve mudança em Boas-vindas.

Remetente escolhido pelo usuário: `sintagmasoftware@gmail.com`. Conta criada em 2026-10-09; Google bloqueou geração de senha de app até confirmação com fator registrado por pelo menos sete dias. Configuração SMTP e comando de aplicação com prompt oculto preparados e conferidos em modo somente leitura. Falta a credencial após liberação, recebimento externo e ambiente HTTPS de publicação. [Roteiro](recuperacao-smtp-gmail.md), [registro](../registros/registro-v0.13.2-2026-10-09-imp-recuperacao-acesso-fun-percurso-03.md) e [comparação](../../wireframes/comparacoes/2026-10-09-recuperar-acesso/index.html). A versão PATCH conclui as correções locais e preparação, sem afirmar conclusão da operação pública.

Na v0.13.1, cadastro e login mantêm a largura e a posição da árvore/frases. Link inferior Conheça o Nós removido; Voltar às boas-vindas permanece. Respiro inferior preserva a composição do login. Alinhamento especial exige painel de autenticação; Conta autenticada mantém centralização. [Registro](../registros/registro-v0.13.1-2026-10-07-imp-conta-fun-alinhamento-visual.md) e [comparação](../../wireframes/comparacoes/2026-10-07-conta-alinhamento/index.html).

Atualizado em 2026-10-07. Escopo: telas 01–05 e 72 do Atlas vivo, funcionais e integradas ao Supabase Auth.

## Fluxos entregues

- `/boas-vindas` entrega a Entrada afetiva opcional 72: árvore, marca, acolhimento e botões diretos de cadastro/login, sem espera. Conta mantém Voltar às boas-vindas no link superior; Conheça o Nós foi removido na v0.13.1. Elementos históricos de login social/aceite jurídico não são integrações existentes.

- `/` abre `/conta` sem sessão e `/nucleos` autenticada. Login sem destino específico abre Seus Núcleos. Cadastro e login compartilham as abas existentes; sessão validada oferece continuar e sair.
- Cadastro valida nome, e-mail e senha no servidor e segue para `/conta/confirmar-email`. Criar conta não cria Núcleo.
- Confirmação aceita código PKCE (Proof Key for Code Exchange) no navegador de origem ou template direto `token_hash&type=email`. Rejeita parâmetros repetidos/misturados. `/auth/confirm` preserva retorno interno seguro. Link inválido oferece reenvio.
- `/conta/confirmar-email` reenvia confirmação; `/conta/recuperar` solicita recuperação. Ambas usam mensagem neutra, inclusive quando SMTP (Simple Mail Transfer Protocol) falha somente para conta existente. Diagnóstico operacional não inclui e-mail, URL ou token.
- `/auth/recovery` verifica token direto com `type=recovery` ou código PKCE com método `recovery` no JWT (JSON Web Token) validado pelo Auth. Retira credenciais da URL antes da página.
- `/conta/nova-senha` exige sessão validada e prova HMAC (Hash-based Message Authentication Code) assinada, vinculada a pessoa/sessão e com prazo de 15 minutos após validar o link. Login comum, cookie adulterado e prova vencida não autorizam o formulário nem a ação de escrita.
- Senha e confirmação são validadas no servidor. Sucesso revoga globalmente refresh tokens, elimina a prova e orienta novo login. Falha de revogação exige entrar novamente, voltar a Conta e sair para tentar outra vez. JWT já emitido continua sujeito à expiração; não prometemos encerramento instantâneo de todo acesso.
- Retorno de convite atravessa cadastro, confirmação, login e recuperação. Conferir convite continua separado do aceite explícito.

## Política e configuração

Senha atual: mínimo oito e máximo 128 caracteres, letra, número e símbolo. Validação comum em `src/features/auth/input.ts`; proposta documental de 15 caracteres permanece futura. Permite colar e usar gerenciador.

`APP_ORIGIN` deve ser a origem externa exata do aplicativo. `AUTH_RECOVERY_SECRET` deve ser segredo de servidor aleatório com pelo menos 32 caracteres, igual entre instâncias; nunca usar prefixo `NEXT_PUBLIC_`. Chave local gerada em `.env.local` ignorado pelo Git. Rotacionar a chave invalida provas de recuperação em andamento, sem alterar senhas.

No Auth autorizar `/auth/confirm` e `/auth/recovery`, incluindo os retornos com `?next=...` controlados pela aplicação. No `nos-dev`, foram preservados os retornos anteriores e acrescentados os necessários em `http://127.0.0.1:3000`; mínimo do Auth ajustado de seis para oito. Configuração temporária declarou apenas essas duas propriedades; os outros 11 campos remotos foram preservados e a comparação posterior encontrou zero divergências nas duas propriedades. Não enviar a URL de validação 3200 ao remoto.

No Supabase local, os callbacks 3200 permitem a jornada isolada. Serviço de e-mail é Mailpit, com caixa local acessível pela URL da CLI (Command Line Interface). Link de e-mail local configurado com uma hora de validade; prova da aplicação limita a tela a 15 minutos após a verificação. PKCE depende do navegador que solicitou o link. Template direto pode apontar para `/auth/recovery?token_hash={{ .TokenHash }}&type=recovery` para outro navegador; template/remetente de produção exigem operação própria.

Intervalo de 60 segundos por navegador e bloqueio de submissão pendente complementam os limites autoritativos do Supabase. Cookie local não é limite global contra abuso. Serviço remoto mantém seu intervalo de um minuto. SMTP próprio, domínio, entrega de mensagens e limites de lançamento público não foram certificados por esta entrega.

## Visual e diferenças

Paleta, tipografia, árvore, formulário em cartão, hierarquia e ações seguem a identidade existente. Telas 03–05 deixam a composição genérica de extensão e passam a usar OnboardingShell, com desenho atualizado no atlas. Conta ganha dois links. Conteúdo e origem das demais áreas permanecem fora do recorte.

[Comparação visual antes/atlas/aplicação](../../wireframes/comparacoes/2026-10-07-conta-entrada/index.html). Conforme decisão do usuário, qualquer mudança futura de um lado exige atualizar o outro e apresentar a diferença, incluindo capturas quando houver mudança visual.

## Validação histórica da v0.12.0 e retomada

108 testes Playwright desktop/mobile aprovados, análise de tipos e build. Jornada real local reproduzível em `scripts/verify-account-local.mjs`: cadastro, reenvio, confirmação, retorno de convite, recuperação PKCE/direta, validação, revogação de outra sessão, rejeição da senha antiga, novo login, link usado, prova adulterada e resposta neutra para e-mail inexistente. Contas/e-mails temporários removidos.

Atlas: 72 prévias, 178 saídas, 360 estados, 13 percursos, 41 referências; sem erro JavaScript ou rede externa. Seis telas comparadas em duas larguras; títulos/subtítulos/rótulos/cor/fonte iguais. Código revisado independentemente; três achados P2 corrigidos. Configuração remota conferida, sem jornada autenticada remota nesta entrega.

Próximo passo desta área: verificar entrega de e-mail com remetente aprovado no ambiente de publicação, configurar segredo de servidor nesse ambiente e conferir URLs HTTPS (Hypertext Transfer Protocol Secure). Próximo módulo do produto permanece Nossa Árvore, com contrato próprio antes de implementar indicadores.


O Next.js omite os callbacks de confirmação/recuperação dos logs de requisição em desenvolvimento para não registrar credenciais da URL. Em publicação, o provedor/proxy deve redigir esses parâmetros nos próprios logs de acesso; a configuração local não controla logs externos.

## v0.13.0 — Navegação e sessão

Raiz sem sessão abre Conta; autenticada abre Seus Núcleos. Login/confirmação sem retorno específico segue para /nucleos. Todo /comecar e /nucleos exige sessão validada, inclusive rascunho e convite. Lista real sob RLS, seleção explícita e retorno do Início à lista. Token expirado com renovação válida mantém acesso; sessão não renovável pede login preservando destino. Esta decisão substitui o retorno padrão ao onboarding e o rascunho pré-login dos marcos anteriores. [Contrato vigente](navegacao-sessao.md).
