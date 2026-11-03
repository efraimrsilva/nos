# Registro — v3.6.3 — 2026-11-03 — Imp. de identidade com Fun. sincronização

Versão3.6.3, PATCH. Status: concluído localmente. DOCS_DIR: Documentacao_Projeto_Nos. Base main/a17052c; alterações anteriores3.6.2 preservadas.

## Objetivo, contexto e requisitos

Retomar pedido antes adiado: todos os integrantes recebem mudanças administrativas de nome/propósito sem recarregar documento, em desktop/celular. Cobrir Início, listas, contexto e seletores; preservar modais/rascunhos, autorização e tratamento de falha.

## Causa e decisões técnicas

A gravação/revalidatePath atualizava somente o cliente responsável pela ação. Outras sessões não consultavam identidade novamente. Reutilizado padrão periódico já adotado nas participações: uma consulta por ciclo3s em página visível/conectada, sem sobreposição dentro do efeito. O leitor de sessão usa RLS, ordena/pagina200 registros e devolve somente hash SHA-256. router.refresh atualiza conteúdo de servidor preservando documento e componentes clientes. Nenhuma nova dependência/migração/configuração remota.

Primeira conferência após cada nova versão/rota força reconciliação adicional, evitando perder edição ocorrida entre leitura da página e do hash. Retorno de visibilidade/conexão inicia conferência. Falha de rede preserva dados e próximo ciclo retenta. Não se promete latência instantânea ou funcionamento sem rede; custo esperado é uma consulta autenticada por página visível a cada3s (mais lotes para contas com200+ Núcleos), e renderização somente na reconciliação inicial/mudança.

## Arquivos alterados e integrações

- src/features/nuclei/identity-version.ts: leitor paginado sob cliente de sessão.
- src/features/nuclei/identity-actions.ts: fronteira autenticada, getUser, retorno nulo em indisponibilidade.
- src/features/nuclei/components/nucleus-identity-sync.tsx: ciclo/limpeza/reconciliação.
- src/features/onboarding/components/onboarding-shell.tsx: versão inicial e observador compartilhados; nenhuma alteração visual.
- tests/authenticated/nucleus-identity-sync.spec.ts: três cenários em dois viewports.
- Manifestos/README/Atlas, contrato de organização, plano MVP, caixa preta, galeria e continuidade sincronizados.

## Validações e revisão

- TDD:2 testes desktop falharam antes da correção pelo nome antigo no Início/lista após15s; gravação estava confirmada.
- Primeira rodada:8 testes autenticados aprovados (sincronização e regressões de organização, desktop/mobile).
- Rodada final: npm run test:authenticated -- nucleus-identity-sync people-merge --reporter=list,10 aprovados. Inclui edição por interface, membro comum, lista, contexto de Acordos, rascunho/checkbox/modal preservados, seletor aberto da Conta, falha transitória e reconexão. performance.timeOrigin inalterado. Abort de rede proposital gerou destination stream closed early no servidor; recuperação comprovada e testes aprovados.
- npm run typecheck e npm run build aprovados após correção de concorrência e novamente com manifestos3.6.3.
- npx --offline supabase test db --local supabase/tests/nucleus_identity.sql supabase/tests/nucleus_administration.sql:81 asserções aprovadas, somente banco local.
- Verificadores Atlas verify-global-view.mjs e verify-mvp-view.mjs aprovados,73 telas, sem erros; links locais, manifestos e seis capturas conferidos; git diff --check aprovado.
- Autorrevisão e revisão independente estática dos cinco arquivos de código/teste. Race de página/hash encontrada e corrigida; revisor confirmou solução, sem achados pendentes. Checklist React aplicado: efeitos com cleanup, dependências explícitas, consultas independentes em paralelo, código criptográfico somente servidor, estado de formulário preservado.
- Capturas app/Atlas desktop/mobile inspecionadas; [galeria](../../wireframes/comparacoes/v3.6.3-2026-11-03-identidade-tela_13-tela_12-tela_66/index.html). “Anterior” é estado antes da edição, não captura de build sem correção.

## Ferramentas e limites

Superpowers depuração/entendimento/TDD/revisão/verificação e Supabase usados. Context7 supabase-js2.117.1 (próximo indexado do2.117.2 declarado) e Next16.2.9, complementado por docs locais16.3.6. Changelog Supabase consultado. Octocode MCP19.1.0 já configurado, não exposto na sessão; CLI via npx validada. Grafo local funcionou após ALLOWED_PATHS para workspace; cobertura sintática incompleta por imports não resolvidos, complementada por buscas locais e leitura de chamadores; nenhuma economia de tokens presumida. Sem nova instalação de dependências do aplicativo.

Todos os testes usaram Supabase local e contas descartáveis. Sem migração, escrita remota, commit, push ou deploy. Não certificados Safari, aparelho físico, nem versão hospedada. Testes manuais M02-SYNC-001–006 continuam Não executados pelo usuário. Nenhuma garantia de sincronização de builds antigos já abertos; precisam carregar a versão contendo esta correção.

## Resultado e próximo passo

Sincronização validada localmente nas interfaces atuais desktop/mobile. Usuário executar roteiro em duas sessões e registrar resultados. Publicar somente quando autorizado; versão local3.6.3 pronta para commit, separada da unidade anterior de integrantes3.6.2.

## Revisão antes da publicação — 03/11/2026

Achado P2 independente: a versão observada era marcada localmente antes da confirmação por renderização; falha do refresh podia impedir nova tentativa. Regressão isolada reproduziu Expected3/Received2. Correção compara a resposta à prop version efetivamente renderizada;2 projetos unitários aprovados e revisor confirmou solução. Integra a unidade ainda não publicada3.6.3 na consolidação3.7.0; sem novo fluxo ou migração.

Capturas de regressão de identidade também passam a usar artifacts/regression-captures/identity-sync por padrão; destino histórico só é usado quando explicitamente configurado.
