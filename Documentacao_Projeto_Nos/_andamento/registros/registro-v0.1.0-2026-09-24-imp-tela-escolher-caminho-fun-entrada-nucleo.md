# Registro — v0.1.0 — 2026-09-24 — Imp. de tela Escolher caminho com Fun. entrada no Núcleo

**Versão histórica do aplicativo:** 0.1.0, confirmada no `package.json` do commit `32f208c` da primeira entrega. A versão vigente está em [`estado.md`](../estado.md).
**Status:** concluído e validado na entrega original; registro histórico reformatado posteriormente, sem alterar o produto.

## Objetivo, contexto e requisitos

Este diário reúne as decisões de fundação tomadas em 2026-09-24 e a implementação da primeira tela. O projeto partiu de documentação conceitual e protótipo de 28 telas. A primeira entrega precisava tornar navegável a escolha entre criar um Núcleo e entrar por convite, preservar acessibilidade e responsividade, e deixar claro que autenticação, convites e persistência ainda não existiam. As orientações posteriores sobre distribuição e Context7 permanecem abaixo em ordem cronológica; não representam novas funcionalidades da v0.1.0.

## Decisões técnicas, integrações e limites

- Frontend Next.js/React/TypeScript/Tailwind com layout de onboarding compartilhado, fontes e imagem local.
- `/` redireciona para `/comecar`; cartões levam aos destinos preparatórios `/comecar/tipo` e `/comecar/convite` e oferecem retorno. Essas rotas eram preparatórias nesta versão histórica; Tipo de Núcleo foi implementada na v0.2.0.
- Sem criação de Núcleo, aceite de convite, autenticação simulada ou persistência. Backend Supabase, RLS e fluxos completos permaneciam planejados.

## Arquivos alterados na entrega original

`src/app/comecar/page.tsx`, `src/app/comecar/layout.tsx`, `src/features/onboarding/`, `src/shared/routes.ts`, `src/app/globals.css`, `public/brand/nos-tree.png`, `tests/onboarding.spec.ts`, `README.md` e documentação de acompanhamento. A instalação global do Context7 e o lançador na pasta principal do workspace ficaram fora deste repositório.

## Validações, resultado e próximos passos históricos

O registro original informa oito testes Playwright aprovados em desktop/mobile, build e checagem de tipos aprovados e inspeção visual. O commit `32f208c` contém a aplicação inicial; não há reexecução dessas verificações nesta revisão documental. A tela Escolher caminho ficou navegável. O próximo passo então registrado era Tipo de Núcleo, concluído na v0.2.0. O próximo passo vigente é a tela Propósito, conforme [`estado.md`](../estado.md).

## Cronologia original preservada

## Decisões confirmadas

- O produto suportará todos os tipos de Núcleo desde a primeira versão.
- A arquitetura será única e orientada a configuração, preservando `nucleoId` como limite de privacidade.
- O fluxo inicial priorizado é autenticação, escolha de entrada, criação/aceite de Núcleo e somente então a Home.
- O arquivo `Documentacao_Projeto_Nos/Telas/Nós App.dc.html` será usado como referência de design e fluxo, não como base de código de produção.

## Stack aprovada

- Frontend web: TypeScript, React, Next.js, Tailwind CSS e shadcn/ui ou componentes próprios fiéis ao design system do Nós.
- Backend e dados: Supabase com Postgres, Auth, RLS, Storage e Realtime apenas quando necessário; API Routes do Next.js para regras específicas, integrações e tarefas sensíveis.
- Mobile: Capacitor sobre o mesmo aplicativo web, com Android antes de iOS.
- Deploy: Vercel, Supabase Cloud, Google Play Console e posteriormente Apple Developer, TestFlight e App Store Connect.
- Princípios complementares: Clean Code, DDD, Day.js e remoção de comentários apenas no bundle de produção.

## Ordem de distribuição confirmada

1. Aplicação web na Vercel.
2. Aplicativo Android via Capacitor e Google Play Console.
3. Aplicativo iOS, somente depois da validação e disponibilização das etapas anteriores.

## Diagnóstico preservado

- O repositório contém 28 telas mobile exportadas e documentação de visão, interface, dados, permissões, notificações e segurança.
- O repositório estava limpo no commit `2b17d18` no momento do diagnóstico.
- Não há projeto executável ainda; a próxima etapa é a especificação técnica da fundação, não a conversão direta das telas em componentes.

## Registro criado

- Criado `Documentacao_Projeto_Nos/_andamento/` com este diário, um índice e o estado atual do projeto.
- Atualizado o README para indexar a versão v2.8 e os documentos de andamento.

## Próxima ação aguardando instrução

Elaborar a especificação revisável da fundação multi-Núcleo antes de criar qualquer código ou infraestrutura.

## Rotina de continuidade confirmada

- Pedido do usuário: manter os Markdown de `_andamento` organizados, compreensíveis e atualizados durante as interações; dividir por tecnologia ou funcionalidade quando necessário.
- Atualizado `README.md` deste diretório com protocolo de retomada, índice e critérios para documentos temáticos.
- Atualizado `estado-atual.md` para distinguir direção aprovada de arquitetura ainda pendente e refletir as alterações locais não commitadas.
- Preservado o cancelamento do monitor automático; não há varredura recorrente autorizada.
- Verificação: leitura dos três documentos e conferência do estado do Git. Próxima ação: elaborar a especificação da fundação multi-Núcleo já prevista.

## Primeira tela implementada por autorização do usuário

- A instrução mais recente autorizou iniciar a implementação e dispensou indicadores de contexto; substitui a espera anterior por especificação completa.
- Criados aplicativo Next.js/TypeScript/React/Tailwind, layout compartilhado, componentes de escolha e rotas centralizadas. Fontes locais, árvore original preservada em `public/brand/nos-tree.png`.
- `/` redireciona para `/comecar`. Os dois cartões abrem `/comecar/tipo` e `/comecar/convite`, com explicação de etapa em preparação e retorno funcional. Não há criação de Núcleo, autenticação simulada, aceite nem persistência.
- UI adaptada ao desktop e mobile, teclado, foco visível, salto para conteúdo e redução de movimento. Nenhum tipo de Núcleo está codificado como regra exclusiva; catálogo completo será a próxima entrega.
- Segurança inicial: cabeçalhos defensivos, sem segredos, sem coleta de dados e exclusão de `.env` do Git. Autenticação/RLS/CSP e segurança de convites seguem pendentes; não afirmar prontidão para produção.
- Diagnóstico de ambiente: certificados npm resolvidos usando a cadeia confiável do Windows (`NODE_USE_SYSTEM_CA=1`), sem desativar TLS nem mudar configuração global.
- TDD: teste inicial falhou pela ausência do título da tela; após implementação, os quatro testes iniciais passaram. Suíte ampliada para oito casos executados (quatro comportamentos em dois perfis).
- Verificações finais: `npm.cmd test` = **8 passaram**; `npm.cmd run typecheck` = passou; `npm.cmd run build` = passou. Inspeção visual de desktop/mobile com agent-browser e ausência de erros reportados pelo navegador.
- A execução com oito navegadores simultâneos excedeu o tempo limite no ambiente; limite de dois workers resultou na suíte completa em 7,1 segundos. Não foi necessário ampliar timeout ou relaxar asserts.
- Checagem TypeScript inicialmente atingiu cache incremental inconsistente após geração de rotas; checagem sem cache passou. Script agora gera tipos e executa `tsc --noEmit --incremental false` para validação reproduzível.
- README e arquivos temáticos de frontend/Escolher caminho documentam execução, escopo e continuidade. Mudanças preservadas localmente, sem commit, push ou deploy.
- Próxima entrega: Tipo de Núcleo, catálogo completo e transição para Propósito. Android depois da web; iOS por último. Monitor automático continua cancelado.

## Context7 instalado e preferência registrada

- Pedido explícito: instalar Context7, utilizá-lo sempre para buscar documentação atualizada e aguardar novo comando após instalação.
- Executado `codex.exe mcp add context7 --url https://mcp.context7.com/mcp`. Configuração global confirmada com `codex.exe mcp get context7` (habilitado, transporte Streamable HTTP). Nenhuma dependência adicionada ao app.
- Verificação direta do endpoint MCP: inicialização HTTP 200, servidor Context7 4.1.1, ferramentas `resolve-library-id` e `query-docs` listadas; busca de Next.js retornou a biblioteca oficial `/vercel/next.js`.
- Preferência persistida em `AGENTS.md` e no estado atual. A lista de ferramentas desta sessão ainda não inclui a nova integração; uma nova sessão/reabertura poderá ser necessária para carregá-la nativamente. Teste direto do endpoint não equivale a afirmar que as ferramentas foram recarregadas nesta sessão.
- Fontes da instalação: https://context7.com/docs/resources/all-clients e https://developers.openai.com/codex/mcp.
- Próxima ação: aguardar comando do usuário, sem avançar implementação.
