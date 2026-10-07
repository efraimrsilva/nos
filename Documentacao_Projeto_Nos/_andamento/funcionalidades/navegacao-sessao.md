# Navegação e sessão — v0.13.0

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

Atlas mantém 72 IDs, 41 telas planejadas, 31 recortes existentes e 14 percursos. Tela 12 ganha composição implementada; exemplos continuam identificados. [Comparações](../../wireframes/comparacoes/2026-10-07-sessao-navegacao/index.html).

## Verificação reproduzível

Suíte sem backend: npm.cmd test -- --workers=1. Formulários antes públicos foram movidos para tests/authenticated e usam contas reais temporárias no Supabase local. Definir SUPABASE_CLI_PATH e executar node scripts/test-authenticated-local.mjs. A suíte recusa backend remoto; credenciais de teste ficam no ambiente do processo, sem arquivo .env novo. Cria/remove contas e Núcleos temporários.

Servidor autenticado compila uma cópia dos fontes/recursos no diretório temporário do sistema para separar limitações do disco G:. Dependências existentes são reutilizadas por junction; Next e fontes são copiados para resolver caminhos entre volumes. Sem novo download ou dependência. O servidor de produção local na porta3200 certifica o mesmo código copiado, sem deploy. Cache e resultados são separados do aplicativo e da suíte sem backend. Comparação do Atlas usa sessão temporária em memória.

No ambiente desta entrega, Windows reservou as portas padrão54321–54324; as portas55321–55327 foram usadas temporariamente. Config original restaurado após encerrar o ambiente temporário; dados locais preservados. 132 testes aprovados (88 sem backend e 44 autenticados), tipos/build e verificações visuais. Status final e limitações operacionais ficam no registro; este contrato não transforma testes em confirmação de deploy remoto.


Envio de formulário com sessão expirada é bloqueado antes da ação. POST convencional recebe 303; Server Actions por fetch recebem 303 com x-action-redirect, sem Location, para abrir login por navegação e preservar next. O teste confere também que nenhum Núcleo foi criado.
