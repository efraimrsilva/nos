# Navegação e sessão — v3.10.3

## Resumo de Núcleos — 07/11/2026 — v3.10.1

Em Seus Núcleos, cada cartão informa o papel da pessoa autenticada e a contagem exata de acordos com status active naquele Núcleo, incluindo zero e concordância singular/plural. Propostas, testes, recusados e encerrados não entram; aceite individual não altera esse total. A consulta lê apenas id, respeitando concessões por coluna e segurança por linha. Falhas seguem o erro da rota, sem inventar zero. A Home e os cartões reutilizam o emblema: administração com escudo; participação com o texto “Você faz parte deste Núcleo.”, somente texto verde fixo #16703A em todos os9 temas, inclusive escuros (esclarecimento3.10.3) e sem escudo; o fundo é o mesmo do emblema administrativo (esclarecimento3.10.2). Nenhuma permissão ou gravação mudou.

## Atualização vigente — 03/11/2026

Os destinos da barra lateral são acessíveis no celular pela barra inferior e pelo menu Mais. O rótulo Início acrescenta o nome do Núcleo atual, abreviado visualmente a 18 caracteres no computador e 12 no celular, com reticências quando necessário; o nome completo permanece no título e no nome acessível. A versão visível é importada de `package.json`, exibida ao final de Sua conta na barra lateral e no Mais, sem linha inferior sobrando.

**Obrigação permanente de release:** atualizar a versão central, manifestos/lockfile, indicação do Atlas e documentação vigente no mesmo conjunto. Conferir também a versão efetivamente exibida no aplicativo em computador e no menu Mais do celular. Editar somente a documentação ou o número no Atlas não comprova a versão servida; build e implantação precisam de evidência própria.

O Início removeu a exposição visual de propósito acima dos blocos, os links secundários de rodapé da página e separadores finais dos cartões. Propósito continua armazenado e disponível em seu fluxo de gestão; remoção visual não apaga dados. O cartão Um lugar à mesa foi removido da lista de Núcleos e de Pessoas; os caminhos de convite permanecem nos controles apropriados.

A auditoria de paridade identifica apresentações diferentes com ações/destinos equivalentes: Acordos usa Kanban/Painéis no computador e lista no celular; Agenda usa o mesmo calendário mensal e adapta grade/lista; perfil do computador abre painel menor, enquanto `/conta` oferece a página completa nos dois tamanhos. Não interpretar ausência intencional do painel desktop no celular como perda de acesso à conta.

Sessão: os testes locais de renovação exercitam o proxy e a biblioteca SSR (renderização no servidor) com transporte Auth simulado. Não houve correção de código de sessão neste conjunto; a causa de eventual desconexão hospedada não foi comprovada. O novo inicializador `scripts/dev.mjs` carrega `.env.local` antes de iniciar o Next.js com certificados/proxy do ambiente; não demonstra mudança em cookies, expiração ou revogação no serviço remoto. [Registro de paridade e limites](../registros/registro-v3.5.0-2026-11-03-05-imp-validacao-fun-paridade-e-rastreabilidade.md). [Casos NAV-AJU-001–004 e M01-AJU-002](../testes-caixa-preta/ajustes-v3-5.md), Não executados pelo usuário.

Atualização v3.3.3 — 30/10/2026: Entrar com convite disponível à esquerda da criação no cabeçalho de /nucleos e em Conta e Núcleos do painel de perfil desktop e da página /conta. Todos navegam para /comecar/convite, sem associação automática; conferir convite e consentir continuam necessários.

Atualização v3.3.1 — 29/10/2026: conta preserva o último Núcleo por pessoa neste navegador, por cookie de contexto revalidado no servidor; vínculo removido não restaura nome nem atalhos. Perfil desktop abre painel nativo com seis seções e ações em modais; no mobile abre /conta. Busca do topo removida. Destinos continuam protegidos no servidor; a lembrança local não concede acesso. [Registro](../registros/registro-v3.3.1-2026-10-29-imp-conta-perfil-fun-navegacao-contextual.md).

O usuário aprovou em 2026-10-07 retirar o acesso pré-login às etapas de criação e convite e usar a Tela 12 — Seus Núcleos como entrada padrão. [Registro](../registros/registro-v0.13.0-2026-10-07-05-imp-navegacao-protegida-fun-sessao-seus-nucleos.md).

## Entrada e caminhos

Sem sessão, Conta oferece cadastro/login, confirmação e recuperação; Boas-vindas continua opcional. Após login ou confirmação, o retorno específico permitido tem prioridade. Sem retorno, abrir /nucleos. Selecionar um cartão abre /nucleos/[id]. Quem não tem associação recebe lista vazia e opções de criar Núcleo ou conferir convite. Escolher caminho permanece em /comecar como alternativa protegida.

Criar segue Tipo → Propósito → conferir rascunho → criação explícita → convite inicial opcional → Início. Entrar segue inserir código → conferir prévia → aceite explícito → Início. Nenhuma navegação aceita convite ou cria associação automaticamente. Início oferece retornar à lista e acessar agenda/acordos no contexto escolhido.

## Limites da autenticação

Todo /comecar e /nucleos requer identidade validada pelo Auth antes de renderizar, inclusive rascunho, convite e subseções de Hábitos. Cookie sozinho não autoriza. Ausente, adulterado ou não renovável redireciona ao login. JWT (JSON Web Token) expirado com refresh token válido renova a sessão; impedir renovação normal faria a pessoa entrar novamente a cada vencimento do token.

Falha de transporte/serviço bloqueia conteúdo privado com 503 sem afirmar que a sessão acabou. Cookies alterados pelo SSR (Server-Side Rendering) devem ser copiados também para a resposta de bloqueio. Respostas privadas são private, no-store. RLS (Row-Level Security) e autenticação/autorização nas Server Actions permanecem obrigatórias, independentemente do proxy.

Revogação global de refresh tokens impede novas renovações. Não prometer revogação instantânea de todo JWT já emitido nem apagar conteúdo já visto da memória do navegador. Recuperação de senha mantém sua prova assinada e critérios próprios.

## Dados e apresentação

Tela 12 usa SELECT em nuclei com a sessão da requisição; a política existente permite somente associações próprias em nucleus_members. Sem nova migração ou chave administrativa. Lista ordenada por nome e identificador, 20 cartões por página; registro adicional indica continuação. Carregamento, vazio, erro e paginação têm estados próprios. Nomes e propósitos são escapados pelo React. Seleção troca o contexto pelo ID, sem misturar dados entre Núcleos.

Atlas mantém 72 IDs, 41 telas planejadas, 31 recortes existentes e 14 percursos. Tela 12 ganha composição implementada; exemplos continuam identificados. [Comparações](../../wireframes/comparacoes/v0.13.0-2026-10-07-sessao-navegacao-tela_01-tela_06-tela_12-tela_13/index.html).

## Verificação reproduzível

Suíte sem backend: npm.cmd test -- --workers=1. Formulários antes públicos foram movidos para tests/authenticated e usam contas reais temporárias no Supabase local. Definir SUPABASE_CLI_PATH e executar node scripts/test-authenticated-local.mjs. A suíte recusa backend remoto; credenciais de teste ficam no ambiente do processo, sem arquivo .env novo. Cria/remove contas e Núcleos temporários.

Servidor autenticado compila uma cópia dos fontes/recursos no diretório temporário do sistema para separar limitações do disco G:. Dependências existentes são reutilizadas por junction; Next e fontes são copiados para resolver caminhos entre volumes. Sem novo download ou dependência. O servidor de produção local na porta3200 certifica o mesmo código copiado, sem deploy. Cache e resultados são separados do aplicativo e da suíte sem backend. Comparação do Atlas usa sessão temporária em memória.

No ambiente desta entrega, Windows reservou as portas padrão54321–54324; as portas55321–55327 foram usadas temporariamente. Config original restaurado após encerrar o ambiente temporário; dados locais preservados. 132 testes aprovados (88 sem backend e 44 autenticados), tipos/build e verificações visuais. Status final e limitações operacionais ficam no registro; este contrato não transforma testes em confirmação de deploy remoto.


Envio de formulário com sessão expirada é bloqueado antes da ação. POST convencional recebe 303; Server Actions por fetch recebem 303 com x-action-redirect, sem Location, para abrir login por navegação e preservar next. O teste confere também que nenhum Núcleo foi criado.

## v3.4.2 — barra lateral — 30/10/2026
Cartão de contexto com nome/Seu espaço compartilhado removido da barra lateral global. Cabeçalho mantém nome/contexto e Seus Núcleos continua abrindo /nucleos. Cookie por conta e revalidação de vínculo preservados.

## Identificação histórica v3.4.3 — espera ao selecionar Núcleo
/nucleos e /nucleos/[id] mantêm indicadores e textos de carregamento sem os dois atalhos dos informes. Erros mantêm tentativa/saídas; navegação global e autenticação permanecem iguais.
