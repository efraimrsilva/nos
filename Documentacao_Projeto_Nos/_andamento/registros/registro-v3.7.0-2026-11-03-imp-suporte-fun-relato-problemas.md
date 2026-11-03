# Registro — v3.7.0 — 2026-11-03 — Imp. de suporte com Fun. relato de problemas

Status: concluído localmente — autenticação SMTP externa validada. DOCS_DIR: Documentacao_Projeto_Nos. Branch main, base a17052c. Versão3.7.0 MINOR por nova funcionalidade compatível. Publicação e recebimento externo permanecem sem certificação.

## Objetivo, contexto e requisitos

Usuário solicitou relato de problemas em modal objetivo, em Ajuda e suporte e locais estratégicos, enviado por e-mail à equipe sem expor destinatário. Antes, HelpContent mostrava endereço/mailto diretamente, sem formulário.

Campos: O que aconteceu? obrigatório10–2000 caracteres; Como repetir o problema? opcional até1000. Sem anexos. Rota é reduzida a segmentos estáticos conhecidos e posições dinâmicas substituídas; query/hash/códigos não saem. Versão e contato da conta validada são incluídos. O texto não é persistido em tabelas do aplicativo, mas é enviado ao serviço de e-mail.

## Decisões e integrações

Modal único reutilizado via ActionDialog em Conta, perfil desktop, Mais mobile, conteúdo de orientação e cabeçalho autenticado. X/Escape/clique externo preservam regra global; cancelar não envia, fecha só camada superior e volta ao gatilho. Campos controlados preservam texto em falha; fechar descarta rascunho. Sucesso exibido somente após destinatário aceito pelo SMTP. Pendente bloqueia submissão repetida.

Ação do servidor revalida sessão e e-mail confirmado. Contato para resposta vem de user.email; destinatário, remetente e assunto não são controlados pelo formulário. Destinatário fixo em módulo server-only, sem endereço ou senha SMTP nos assets públicos. Conteúdo como texto simples; acesso a arquivo/URL pelo transporte bloqueado. Nodemailer10.3.1 fixado, com tipos próprios, TLS e limites de tempo. Uma dependência nova justificada pelo transporte SMTP.

Reserva de uma tentativa por minuto/conta no banco por INSERT ON CONFLICT DO UPDATE WHERE. Tabela guarda somente usuário/tentativa; RLS ativa, sem leitura/escrita direta por clientes. Função SECURITY DEFINER obtém somente auth.uid(), search_path vazio e execução restrita; necessária para impedir alteração do relógio pelo cliente. Tentativas com falha também consomem intervalo, inclusive quando o aceite SMTP é incerto. Exclusão de conta remove marcador por cascata.

## Arquivos principais

- src/features/support/input.ts: validação e contexto reduzido.
- src/features/support/mail.ts: transporte e destinatário servidor.
- src/features/support/actions.ts: sessão, reserva e envio.
- src/features/support/components/problem-report.tsx: modal/formulário compartilhado.
- src/features/controls/components/account-preferences.tsx e settings-content.tsx, src/shared/components/application-shell.tsx, src/app/layout-system.css: acessos e apresentação.
- supabase/migrations/20261103191242_problem_report_rate_limit.sql e supabase/tests/problem_report.sql.
- scripts/test-problem-reports.mjs e verify-support-smtp.mjs; comandos npm test:problem-reports e verify:support-mail; .env.example.
- tests/problem-report.spec.ts, tests/authenticated/problem-report.spec.ts e expectativa de suporte em tests/authenticated/controls.spec.ts.
- Atlas product-ui.js/product.css/screens.js e verificador verify-problem-report.mjs; documentação e evidências.

Alterações anteriores3.6.2/3.6.3 preservadas. .env.local ignorado pelo Git; somente nomes de variáveis registrados, sem valores de credenciais.

## Validações realizadas

- TDD: teste desktop falhou antes da implementação por ausência de Relatar um problema; captura anterior real de Ajuda preservada. Não há captura anterior do aplicativo mobile; não fabricada.
- Primeira rodada autenticada:6 aprovados desktop/mobile, recebimento SMTP em Mailpit isolado, destinatário fixo e replyTo da sessão conferidos.
- Rodada ampliada:10 aprovados, incluindo falha SMTP real por pausa controlada da caixa local, texto preservado, estado pendente, perfil/Mais, modal aninhado e viewport320px.
- Rodada com regressões de administração/suporte:16 aprovados desktop/mobile, somente Supabase local e SMTP descartável.
- Testes unitários:5 aprovados; sessão/configuração/entrada inválida, quota, contato não falsificável, falha e sucesso. Melhoria final aceita ausência do campo opcional;5 unitários repetidos e aprovados, tipos/build finais aprovados.
- Banco:11 asserções pgTAP aprovadas (quota, contas independentes, proteção da tabela, expiração e cascata). Migração aplicada e histórico registrado SOMENTE localmente. db advisors --local: sem achados.
- npm run typecheck e npm run build aprovados;35 assets públicos examinados sem destinatário/configuração SMTP.
- Atlas: formulário/atalhos em desktop/mobile, dois campos, confirmação explícita de que demonstração não envia; verificador próprio aprovado após corrigir seletores ambíguos do teste. Visão global/MVP aprovados,73 telas, sem erros.
- Autorrevisão e revisão independente somente leitura: sem achados críticos/importantes. Sanitização de códigos minúsculos identificada durante desenvolvimento e corrigida; SMTP com aceite incerto informa Não foi possível confirmar o envio.

## Ferramentas, ambiente e limitações

Superpowers entendimento/plano/TDD/revisão/verificação e checklist React; skills Supabase/Postgres aplicadas. Context7 Nodemailer consultado e tipos instalados10.3.1 conferidos. Context7 PostgreSQL expirou após300s; documentação oficial de INSERT/ON CONFLICT consultada como alternativa. Octocode CLI disponível com ALLOWED_PATHS; grafo sintático incompleto por imports não resolvidos, complementado por busca/leitura local. Conector Netlify indisponível nesta sessão; nenhuma alteração remota inferida.

Leitura autenticada da configuração SMTP existente da Brevo não expôs credenciais. Os campos locais de suporte foram preparados em .env.local, mas autenticação externa retornou EAUTH. O usuário informou ter criado chave com permissões transacionais/campanhas: documentação Brevo confirmou serem permissões de API; integração atual requer chave SMTP. Orientado gerar chave na aba SMTP, substituir SUPPORT_SMTP_PASSWORD localmente, sem enviá-la ao chat. Não alterar SMTP do Auth nem revogar credenciais de outras integrações.

Não houve mensagem externa de teste, migração remota, commit, push ou deploy. Autenticação SMTP externa validada após atualização da chave; recebimento no Gmail ainda NÃO certificado. Build/interface funcionais não comprovam entrega externa. Safari/aparelho físico não certificados. [Galeria](../../wireframes/comparacoes/v3.7.0-2026-11-03-relatar-problema-tela_66-tela_70-tela_71/index.html).

## Resolução da credencial e fechamento — 03/11/2026

O usuário salvou duas chaves em paralelo com identificações entre parênteses no nome da variável. O aplicativo exigia o nome exato SUPPORT_SMTP_PASSWORD. A chave identificada como Nós - relatos de problemas foi reconhecida como SMTP sem exibir valor; seu nome foi normalizado para SUPPORT_SMTP_PASSWORD. A outra chave foi preservada separadamente como SUPABASE_AUTH_SMTP_PASSWORD, referência local sem uso no formulário. Identificações movidas para comentários. A configuração do Supabase Auth remoto não foi alterada.

npm run verify:support-mail aprovado: conexão TLS e autenticação SMTP reais validadas, sem enviar mensagem. O EAUTH anterior ficou resolvido com a nova chave de relatos. Versão final3.7.0, manifestos/Atlas/contratos sincronizados; verificações finais registradas no estado. Capturas funcionais iniciadas em3.6.3 foram preservadas; fechamento da versão ocorreu após autenticação real. Não confundir autenticação com recebimento de mensagem.

## Resultado e próximo passo

Funcionalidade concluída e validada localmente. Próximo passo: usuário executar casos manuais; publicação exige autorização, variáveis no runtime e migração remota específica. Confirmar recebimento externo em envio autorizado após implantação. Unidade de suporte confirmada no objeto do commit de suporte desta série; envio GitHub tratado no registro de publicação. Deploy/migração remota não executados nesta etapa.

Ambiente de desenvolvimento: scripts/dev.mjs carrega .env.local antes de iniciar o Next. Reiniciar npm run dev se o processo já estava aberto com a credencial anterior. O servidor habitual pode apontar para Supabase hospedado: nesse caso, aplicar/provisionar a migração de suporte e as variáveis no destino exige autorização específica; a migração executada nesta entrega está somente no Supabase local de testes.

## Verificação final da versão3.7.0

Tipos e build de produção aprovados. npm run test:problem-reports:10 testes autenticados finais desktop/mobile aprovados, com Mailpit local isolado e encerrado após a suíte. Verificadores Atlas próprio/Visão global/MVP aprovados,73 telas sem erros;368 links locais e35 assets públicos conferidos sem destinatário ou credenciais. git diff --check aprovado. SMTP real: autenticação/TLS aprovados, sem envio de mensagem externa.
