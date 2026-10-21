# Registro — v3.0.3 — 2026-10-20 — Imp. de envio Brevo com Fun. de autenticação por e-mail

**Status:** configuração operacional ativa. Recebimento de confirmação e recuperação na caixa de entrada comprovado pelo responsável. Recuperação solicitada pelo site e registrada no Supabase; a Brevo também registrou uso da chave. A troca efetiva de senha pelo link não foi executada nesta operação.

## Objetivo, contexto e requisitos

Substituir a preparação de SMTP Gmail pela Brevo, pois o Google não liberou a senha de aplicativo. O responsável criou e autenticou a conta Brevo, confirmou e-mail/telefone e autorizou o prosseguimento. Escolheu manter `sintagmasoftware@gmail.com` e a chave sem data fixa de expiração. Não adicionar serviço de envio paralelo ao aplicativo nem incluir credenciais no Git/chat.

Operação de configuração externa, sem alteração de fontes, dependências ou esquema: versão 3.0.3 preservada. Os documentos anteriores conservam as evidências e pendências nas datas em que foram escritos.

## Configuração e integrações

- Brevo: remetente Gmail já verificado; fuso `(GMT-03:00) Sao Paulo`, salvo e reconferido. Chave exclusiva `Nós - Supabase Auth`, Standard, ativa, sem data fixa de expiração. A política da Brevo ainda prevê expiração após 90 dias consecutivos de inatividade.
- Supabase `nos-dev`: SMTP personalizado ativado com `smtp-relay.brevo.com`, porta 587, login técnico informado pelo painel Brevo, remetente `sintagmasoftware@gmail.com` e nome `Nós`. Credencial inserida no campo protegido, sem arquivo local. Confirmação de cadastro continua obrigatória. Limite do Auth passou de 2 para 30 e-mails/hora; franquia Brevo de 300/dia é um limite adicional.
- Netlify `noslife`: `APP_ORIGIN` já correto. Faltava `AUTH_RECOVERY_SECRET`, confirmado pela ausência no painel e pela mensagem do formulário publicado. Criado valor aleatório de 48 bytes exclusivamente no contexto de produção, marcado como secreto. O plano disponível aplica os escopos Builds, Functions e Runtime, sem Post processing; não foi contratado upgrade.
- Novo build/deploy necessário para aplicar a variável: `6ad820c79cbacbaabe97e70f`, commit `69c6eb87490f72fe69a8e30c34d142aaa6fd9a24`, publicado em 20/10/2026 às 23:18:19 (Brasília). Fontes/configurações funcionais idênticas à versão implantada anterior `8b529e8`. Nenhum commit/push nesta operação.

## Validações e diagnóstico

1. Conferência do remetente verificado, da chave ativa e da preferência sem expiração no painel Brevo.
2. Leitura da configuração efetiva pela API oficial Supabase, exibindo somente parâmetros públicos e presença da senha. Host, porta, login, remetente, nome, confirmação obrigatória e origem corretos.
3. Duas tentativas de teste SMTP direto com o valor retornado pela leitura da configuração falharam na autenticação e não comprovaram envio. Conexão TLS e capacidades do servidor verificadas. A configuração lida retorna um valor com formato de resumo hexadecimal; não usá-lo como credencial reutilizável. Essas tentativas não foram usadas como evidência de funcionamento.
4. Cadastro descartável pela API pública Auth, usando alias do Gmail do próprio responsável: HTTP 200, confirmação enviada, sem sessão imediata. O responsável confirmou recebimento na caixa de entrada. Não se trata de prova de cadastro integral por cliques.
5. Pedido de recuperação na página HTTPS real inicialmente interrompido por ausência do segredo. Após novo deploy, a mesma página aceitou a solicitação, preservou a mensagem genérica e o intervalo de segurança; `recovery_sent_at` registrado na conta temporária. Responsável confirmou recebimento do e-mail de recuperação na caixa de entrada. Alteração de senha pelo link ainda não certificada.
6. Netlify: build real Next.js 16.3.6/Turbopack, TypeScript, funções e verificação de segredos aprovados; estado ready/publicado. Nenhum segredo detectado no código ou resultado do build.
7. Conta temporária removida pela API administrativa Auth, com conferência prévia de identidade/e-mail/metadados e confirmação de zero contas correspondentes. Nenhuma conta ou vínculo real alterado.

O conector Netlify retornou sucesso nas tentativas de upsert sem que a variável aparecesse na leitura ou no painel; a gravação efetiva foi feita e conferida pelo painel. Não usar a resposta isolada do conector como prova. Credenciais somente em memória durante o preenchimento; valores protegidos não incorporados a registros. Autorrevisão operacional; sem revisão independente nova, testes locais ou alteração de código nesta rodada.

## Arquivos e evidências

Atualizados somente README, estado, histórico, Brag, aviso de substituição no guia Gmail e este registro. Capturas locais em `artifacts/email-brevo/`, ignoradas pelo Git: SMTP salvo no Supabase e solicitação real de recuperação. [Implantação](https://app.netlify.com/projects/noslife/deploys/6ad820c79cbacbaabe97e70f).

## Limitações e próximo passo

Gmail é domínio público e não pode ser autenticado pelo responsável. A Brevo alerta sobre Freemail e pode substituir o domínio do remetente por infraestrutura própria; domínio próprio continua recomendado. Não foram ativadas campanhas, importações de contatos, automações ou bloqueio por IP sem conhecer os IPs de saída do Supabase.

Validar os links com uma conta própria; ambos os e-mails foram recebidos na caixa de entrada. Os links da fixture removida não devem ser usados. Esta entrega não certifica recuperação completa com nova senha/login, backup/restauração ou liberação integral do piloto. A preparação Gmail anterior é histórica e não deve ser aplicada sobre o SMTP Brevo ativo.

**Publicação documental autorizada em21/10/2026:** este registro integra o commit de consolidação; consultar o [fechamento GitHub](registro-v3.0.3-2026-10-21-imp-publicacao-github-fun-consolidacao-entrega.md). As afirmações acima descrevem a operação de20/10, sem novos testes de envio.
