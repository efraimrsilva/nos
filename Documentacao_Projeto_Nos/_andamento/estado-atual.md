# Estado Atual - Projeto Nós

> Este é um registro histórico da primeira sessão. Para situação e retomada atuais, consulte o [estado canônico](estado.md).

**Atualizado em:** 2026-09-24

**Status:** primeira tela Escolher caminho implementada e verificada; destinos seguintes preparados; backend e arquitetura detalhada de dados ainda pendentes.

## Direção confirmada

- O lançamento já suportará todos os tipos de Núcleo desde o início.
- A modelagem será genérica: tipo do Núcleo configura linguagem, sugestões e regras aplicáveis, sem criar bancos, permissões ou fluxos paralelos por tipo.
- A stack aprovada é TypeScript, React, Next.js, Tailwind CSS e componentes próprios/shadcn-ui no frontend; Supabase (Postgres, Auth, RLS, Storage e Realtime quando justificado) no backend; API Routes do Next.js para operações sensíveis; e Capacitor como empacotamento nativo após a experiência web.
- O protótipo em `Telas/Nós App.dc.html` é a referência visual e de navegação; os documentos 1.x e 2.x são a fonte de regras de domínio, privacidade e segurança.
- A primeira fatia visível é: autenticação -> escolher criar Núcleo ou entrar por convite -> tipo -> propósito -> convite/aceite -> Home.
- A primeira tela implementada é **Escolher caminho**. Nesta fatia visual, é pública e não opera dados; a autenticação deve protegê-la antes de habilitar criação ou aceite reais.

## Invariantes de produto

- Todo dado afetivo pertence a um `nucleoId`, `usuarioId` ou relação explicitamente definida.
- Núcleos são privados, acessíveis por convite válido e aceite explícito.
- Consentimento é regra de domínio: proposta não é acordo e recusar ou adiar é sempre válido.
- Não haverá ranking afetivo, streak punitivo, chat livre ou exposição de conteúdo íntimo em notificações.
- A árvore representa evolução coletiva, nunca desempenho individual.

## Estado técnico verificado

- Base do diagnóstico: commit `2b17d18`. Há alterações locais de documentação no README e neste diretório, ainda sem commit.
- Existe aplicação Next.js/React/TypeScript/Tailwind executável, layout compartilhado, rotas de continuidade e oito testes Playwright passando em desktop/mobile. Build e checagem independente de tipos passaram. Ainda não existem migrations, banco, autenticação ou pipeline.
- A entrega seguirá a ordem web-first: Vercel e Supabase Cloud primeiro; Android via Google Play Console depois; iOS via Apple Developer, TestFlight e App Store Connect estritamente por último.
- Clean Code e DDD orientarão os limites conforme o domínio ganhar operações reais. Day.js permanece opcional quando houver datas. O bundler padrão do Next.js foi mantido; nenhuma configuração de Webpack foi adicionada apenas para remover comentários. Minificação não é proteção de segredos.
- O README passou a listar a documentação v2.8 e este diretório de andamento.

## Próximo marco

Implementar **Tipo de Núcleo** em `/comecar/tipo`, com catálogo extensível de todos os tipos documentados, seleção acessível e encaminhamento para Propósito. Evoluir em paralelo a especificação de autenticação, modelo relacional e RLS antes de habilitar dados reais. Consultar [primeira tela](funcionalidades/escolher-caminho.md) e [frontend](tecnologias/frontend.md).

## Continuidade

- Context7 configurado globalmente no Codex via MCP remoto; conexão e busca de biblioteca verificadas. Usar sempre nas consultas de documentação técnica, respeitando versão instalada e sem enviar dados privados.
- Instrução mais recente: após instalar Context7, aguardar o próximo comando. Não iniciar a tela seguinte nesta interação.

- Manter os documentos de andamento atualizados em cada interação de trabalho conforme o [protocolo](README.md).
- Separar tecnologias e funcionalidades em arquivos próprios quando houver conteúdo suficiente, mantendo este resumo curto e o índice navegável.
- Monitoramento automático cancelado; o usuário avisará sobre alterações externas.
- O usuário dispensou informes de contexto. Não voltar a incluí-los nas respostas.
