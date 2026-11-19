# Registro — v4.0.0-alpha.10 — 2026-11-17 — Imp. de ensaio Angular com Fun. de rascunho Netlify e fila

**Status:** rascunho hospedado pronto e verificado nas rotas públicas. Acesso autenticado no rascunho confirmado pelo usuário. Fila completa verificada no ambiente local isolado. A12 continua aberta para os demais fluxos hospedados e o ensaio de retorno. A13 ainda não começou.

**Objetivo e requisitos:** conferir o artefato Angular no mesmo projeto Netlify do site atual e testar o caminho completo do cadastro à caixa de ensaio, incluindo falha de envio, nova tentativa e repetição.

**Decisões:** o projeto `noslife` recebeu um rascunho com URL própria, conforme indicado pelo usuário. O artefato conserva a configuração pública do Supabase do site sem variáveis de envio e com Google desativado. O aceite da ferramenta de linha de comando (CLI) foi conferido pelo fluxo assistido do Netlify. A versão permanece `4.0.0-alpha.10`, pois a rodada verificou o código já entregue.

**Implantação:** [rascunho Angular v4.0.0-alpha.10](https://6afbcf907b3227096c6e364b--noslife.netlify.app/conta), deploy [`6afbcf907b3227096c6e364b`](https://app.netlify.com/projects/noslife/deploys/6afbcf907b3227096c6e364b), estado `ready`, contexto `deploy-preview`. O identificador publicado em `noslife.netlify.app` permaneceu `6af77e4a9a6348f87af8b9e1`. A rota pública `/conta` do domínio principal respondeu com os arquivos do Next.js antes e depois.

**Validação hospedada:** rotas diretas de Conta e os três caminhos de retorno abriram o artefato. Chromium em 1440 e 390 pixels confirmou a tela de Conta sem sessão e o retorno sem código com mensagem e destino preservados. As páginas responderam com `Cache-Control: no-store` e `Referrer-Policy: no-referrer`. As funções responderam com `no-store`, 405 para GET e recusaram chamadas POST incompletas: 503 no receptor sem configuração de envio e 401 no relato sem sessão. A rota de API inexistente respondeu 404.

**Confirmação manual em 17/11/2026:** o usuário relatou que a autenticação funcionou e que entrou no sistema, no contexto do rascunho acima. O relato não identifica navegador, dispositivo ou mecanismo de autenticação. A evidência confirma a entrada e não cobre renovação da sessão ou fluxos de e-mail.

**Integração local:** as 23 migrações versionadas foram aplicadas em um Supabase local novo com identificador `nos_a12_ensaio`. Um cadastro descartável acionou o gatilho e a fila. A extensão `pg_net` enviou a chamada assinada ao receptor Angular. Uma falha temporária liberou a reserva e deixou a linha pendente. A segunda tentativa, antecipada somente na linha descartável, chegou ao Mailpit por SMTP (protocolo de transferência de correio simples). O banco registrou o envio, limpou nome e e-mail da fila e a repetição retornou sucesso sem nova mensagem. Os 257 testes de banco e 15 testes de adaptadores passaram. Usuário, segredos, contêineres e volumes próprios do ensaio foram removidos. A instância local de desenvolvimento continuou ativa.

**Arquivos e limites:** atualização do Atlas vivo, roteiro Netlify e registros de continuidade. Nenhum código de produto foi reaplicado ou migrado em produção. Renovação da sessão, confirmação e recuperação com links válidos na URL hospedada, Google, fila no ambiente remoto e ensaio de retorno continuam pendentes. A configuração do Supabase de produção e seu Vault ficaram intactos.

**Próximo passo:** ligar uma prévia a um Supabase de ensaio e uma caixa descartável para conferir retornos autenticados, fila hospedada e retorno de implantação pelo [roteiro](../../../apps/web/netlify/README.md). Revisar os critérios de A13 após essa prova.
