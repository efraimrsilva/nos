# Registro — v3.9.0 — 2026-11-06 — Imp. de Google com Fun. ativação do login

## Resultado vigente — Google validado no desenvolvimento

**Status final:** concluído para o ambiente de desenvolvimento, com Supabase hospedado; publicação no site hospedado permanece pendente. Versão3.9.0 mantida: ativação operacional do fluxo já implementado nessa versão, sem nova mudança de código de autenticação ou dependência.

Usuário concluiu consentimento real com conta escolhida por ele. A inspeção confirmou retorno a http://127.0.0.1:3000/nucleos, título Seus Núcleos visível e formulário Google ausente. Após reload, a mesma rota protegida permaneceu acessível: sessão por cookies persistiu. Conta, tokens, cookies e nomes dos Núcleos não foram copiados para a documentação. A evidência de retorno é um recorte mínimo do cabeçalho, sem lista ou dados da conta.

**Validações desta ativação:** configuração pública Auth Google=true/Apple=false; dez callbacks conferidos (oito anteriores preservados), Site URL hospedada preservada; Google OAuth real com participação do usuário e reload do destino protegido; verificadores Atlas global/MVP e Google/Apple/complemento de nome aprovados em computador/celular, sem erros nem chamadas externas pelo Atlas; sintaxe JavaScript e diff conferidos. Testes68, quatro autenticados e build da preparação anterior continuam como evidência daquele código, sem alegar nova execução nesta etapa operacional. Não houve mudança de SQL, tipo, sessão ou regra de negócio que exigisse nova compilação.

**Arquivos desta etapa:** apenas flag GOOGLE_AUTH_ENABLED=true em .env.local ignorado pelo Git; contrato login-social, conta-entrada, README, plano MVP, guia/estado/histórico/Brag e representações Atlas (atlas.js/screens.js/index.html/mvp-plan.js). Novas evidências operacionais nesta pasta. Código/tests da preparação3.9.0, migrações e segredos preservados. Autorrevisão do delta operacional/documental, sem nova revisão independente nesta etapa.

**Segurança/revisão:** credencial criada e copiada diretamente pelo usuário entre Google e Supabase; nenhuma chave no chat, Git, logs/documentos ou variáveis públicas. Skip nonce checks e Allow users without an email permaneceram desativados ao salvar. Só identidade básica email/profile solicitada. Flags do aplicativo não concedem autorização a Núcleos. Não habilitados Apple, ligação manual de identidades, calendários, contatos ou outros serviços. Nenhum aceite de convite/participação executado.

**Limitações/próximos passos:** runtime Netlify não ativado, sem commit/push/deploy. Retornos de produção do novo callback não foram incluídos; dependem da publicação autorizada do aplicativo. Google Auth Platform permanece em testes; esta sessão prova uma conta autorizada, sem certificar disponibilidade geral. Sem Safari/dispositivo físico, cancelamento real, aceite de convite ou sessão de terceiros certificados por esta ativação. App local e autenticação remota são ambientes distintos; isso não altera a limitação histórica de migrações locais. Próximo passo operacional: conferir nova entrada local pelo usuário ou preparar publicação autorizada com flag e callbacks de produção; Apple continua etapa posterior.

**Evidências:** [retornos locais](evidencias-google-2026-11-06/retornos-locais-supabase.png), [retorno autenticado sem dados da conta](evidencias-google-2026-11-06/retorno-autenticado-local.png), [Atlas web](evidencias-google-2026-11-06/atlas-depois-desktop.png) e [Atlas celular](evidencias-google-2026-11-06/atlas-depois-mobile.png).

---


**Status inicial:** Em andamento durante os checkpoints abaixo; substituído pelo resultado vigente no início deste registro.

**Objetivo/contexto:** continuar a integração aprovada ativando primeiro Google, com orientação ao usuário. Código social já entregue localmente e ainda não commitado; alterações anteriores e diretrizes documentais concorrentes preservadas. Branch feat/modelo-habito/base2e0347b.

**Situação verificada:** .env.local aponta o aplicativo de desenvolvimento http://127.0.0.1:3000 ao Supabase hospedado pyvohqgcwkcfzbtkmbvx. Configuração pública /auth/v1/settings consultada com sucesso: Google e Apple desativados; GOOGLE_AUTH_ENABLED também falso no aplicativo. Valores de segredos não exibidos.

**Ações externas:** usuário trocou para a conta Sintagma Software e aceitou o cadastro inicial do Google Cloud. Projeto Projeto Nos criado, ID nos-sintagma-login. Google Auth Platform preparado com nome Nós, suporte/contato corporativo da conta e público Externo em testes. Usuário precisa aceitar a política de dados dos serviços de API para concluir o branding. Nenhum cliente OAuth ou segredo criado nesta etapa. Banner de teste gratuito não ativado; nenhuma configuração de faturamento feita.

**Dependências:** painel Supabase aberto no projeto correto, mas sessão precisa ser iniciada pelo usuário. Handoffs solicitados para login no Supabase e aceite específico da política Google. Nenhum segredo deve ser enviado pelo chat.

**Retorno preparado:** https://pyvohqgcwkcfzbtkmbvx.supabase.co/auth/v1/callback (Google → Supabase); retorno do Supabase ao aplicativo será http://127.0.0.1:3000/auth/callback, incluindo destino interno permitido quando necessário. Confirmar os campos no painel antes de salvar o cliente.

**Próximo passo:** observar conclusão do branding, preparar cliente OAuth web com origens/retornos exatos, obter a confirmação aplicável imediatamente antes de criar credencial persistente ou solicitar criação ao usuário. Configurar ID/segredo somente no Auth seguro, ativar Google e testar o acesso real com participação do usuário. Sem push/deploy ou ativação de Apple autorizados nesta etapa.

**Validações/limites:** somente leitura de configuração e confirmação visual do projeto/branding em preparação. Nenhum novo teste/build nesta configuração parcial. Navegação pela skill computer-use; integração Supabase existente e documentação técnica de login social da mesma sessão reutilizadas. Sem instalação ou pesquisa avançada de código.

## Avanço assistido — branding e cliente preparados

Usuário confirmou o login no Supabase e o aceite da política Google. Confirmação visual: branding OAuth criado para Projeto Nos; projeto Supabase nos-dev acessível. Cliente Aplicativo da Web preparado com nome Nós — Web desenvolvimento, origem http://127.0.0.1:3000 e retorno Google→Supabase confirmado no painel. Usuário orientado a executar a criação da credencial e transferir Client ID/Secret diretamente para o provedor Google no Supabase, sem chat; manter Skip nonce checks e Allow users without an email desativados. Aguardando confirmação da gravação. Site URL hospedada conferida como https://noslife.netlify.app; oito retornos prévios de confirmação/recuperação preservados. Dois retornos locais callback preparados para inclusão; resultado de salvamento será verificado antes de declarar concluído.

## Provedor Google habilitado — teste real iniciado

Usuário criou o cliente web e preencheu ID/segredo diretamente no Supabase. Formato do ID e presença dos campos verificados apenas por booleanos, sem ler/exibir valores. Enable Sign in with Google ativo; Skip nonce checks e Allow users without an email desativados antes de salvar. Usuário confirmou Save; GET público /auth/v1/settings confirmou Google=true e Apple=false. Os dois callbacks locais foram efetivamente salvos, total10 URLs; Site URL e oito retornos anteriores preservados. Evidência sem credenciais: evidencias-google-2026-11-06/retornos-locais-supabase.png.

GOOGLE_AUTH_ENABLED=true gravado somente em .env.local ignorado pelo Git; demais valores preservados. Aplicativo local iniciou OAuth com sucesso e chegou ao seletor oficial de contas Google, com retorno Supabase/aplicativo corretos e escopos básicos email/profile. Usuário precisa escolher a conta e autorizar o acesso; sessão e retorno final ainda não certificados. Não registrar URL de OAuth com parâmetros transitórios, credenciais ou dados pessoais em documentação/capturas versionadas.
