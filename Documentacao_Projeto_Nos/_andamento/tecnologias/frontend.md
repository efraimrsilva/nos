# Frontend web

**v3.0.1:** somente a ilustração original da Conta foi restaurada com Next Image e preload; sessão e estrutura novas preservadas. [Registro](../registros/registro-v3.0.1-2026-10-20-imp-conta-fun-restauracao-arvore.md).

## v3.0.0 — sistema visual único e diálogos

globals/layout-system e interiores reconstruídos. ActionDialog usa diálogo nativo/useId; páginas recebem conteúdo do servidor e preservam autorização nas ações. Chaves persistidas renovam formulários concluídos sem apagar feedback de revalidação. Agenda semanal, lista móvel de Acordos e estados seguem a referência; esboços não persistem. [Registro](../registros/registro-v3.0.0-2026-10-18-imp-reconstrucao-layout-novo-fun-interface-e-modais.md) · [contrato de modais](../funcionalidades/modais-interface.md).

**Versão vigente do projeto:**3.0.3

**MVP 04:** agenda mantém Server Actions/RPCs existentes. Confirmação contextual com ciência no servidor, foco ao abrir/retornar, botões de presença compartilham useFormStatus; feedback bloqueia envio durante processamento. Reservas futuras sem ação fictícia. [Contrato](../funcionalidades/agenda-interna.md).

**Prioridade vigente — MVP aprovado em 2026-10-12:** seguir o [roteiro](../planos/mvp.md), começando pela etapa 01 de acesso e dependências operacionais. Antes de cada implementação, conferir etapa/dependências e aspecto/ficha no Atlas vivo com prioridade alta. Sincronizar também a guia MVP em cada mudança. Recomendações anteriores de iniciar pela Árvore ou proposta guiada são históricas; esses módulos seguem nas etapas 07/06. A aprovação do planejamento não conclui funcionalidades futuras.

Marco histórico v0.13.1: a Conta calculava a referência vertical do login com useLayoutEffect/ResizeObserver. A migração de 18/10/2026 substitui esse cálculo por grade CSS com posição estável. [Registro visual](../registros/registro-v0.13.1-2026-10-07-imp-conta-fun-alinhamento-visual.md).

**MVP 02 local concluído:** gestão autorizada de convites, bloqueios para geração/aceite/revogação, retorno Auth, estados e navegação. Migração/publicação online pendentes. [Contrato](../funcionalidades/nucleo-compartilhado.md).

**Layout vigente v2.0.0:** ApplicationShell centraliza menus, identidade e acessibilidade; conteúdo e ações permanecem no servidor. OnboardingShell conserva a interface dos consumidores. Ícones Lucide fortes e coloridos, animações com movimento reduzido, fontes de sistema, sem nova dependência. Seis esboços privados sem persistência. [Registro e validações](../registros/registro-v2.0.0-2026-10-18-imp-layout-atual-fun-migracao-integral.md).

## Decisões implementadas nesta fatia

**Sincronização em qualquer alteração:** conferir todas as telas/caminhos atingidos e atualizar aplicativo, Atlas vivo, Visão global, fichas e comparações no mesmo conjunto. Reusar os renderizadores e inventário do atlas, sem copiar composições para o mapa. Toda tela criada ou alterada acrescenta evidência em [comparacoes](../../wireframes/comparacoes/README.md); seguir o [procedimento](../../wireframes/GUIA.md#visão-global-sincronização-e-comparações--procedimento-permanente). O reuso automatiza as visões do atlas; a interface real e os contratos protegidos continuam exigindo conferência específica.

**Referência visual prioritária para todas as próximas telas:** consultar obrigatoriamente o modo Atlas vivo antes de implementar ou alterar interfaces. Seguir seu aspecto, hierarquia, paleta, fontes, ícones, abas e navegação; comparar a interface real antes da conclusão e atualizar desenho/ficha no mesmo recorte. O desenho histórico é comparação. Ver [procedimento de prioridade alta](../../wireframes/GUIA.md#prioridade-alta-do-atlas-vivo--decisão-de-2026-10-05); pendências e contratos precisam ser respeitados.

- Next.js App Router, TypeScript estrito, React e Tailwind CSS.
- Componentes próprios seguindo o Layout atual; Arial e Georgia usam fontes do sistema, sem requisição a serviços de fontes. A composição e as fontes anteriores pertencem ao histórico.
- `src/app`: rotas e metadados; `src/features/onboarding`: interface do fluxo inicial; `src/features/auth`, `src/features/invitations` e `src/lib/supabase`: conta e integração; `src/shared`: contratos compartilhados de navegação.
- Componentes de servidor por padrão. Nenhum estado global, sessão fictícia ou armazenamento local de dados pessoais; a sessão real usa cookies protegidos.
- Layout de onboarding compartilhado para incorporar as próximas telas sem duplicação de identidade visual.
- Dependências reproduzíveis pelo `package-lock.json`; usar `npm.cmd ci` no Windows.

## Segurança: implementado versus pendente

Implementado: sem chaves secretas no app ou Git, cabeçalhos `nosniff`, anti-iframe, política de referenciador e restrição de câmera/microfone/geolocalização. Esses recursos poderão exigir permissões específicas no futuro; não liberar indiscriminadamente.

Validado no desenvolvimento: Supabase Auth/SSR, confirmação e entrada, criação protegida, RPCs de convite/aceite e leitura por RLS. Um Núcleo teve um `creator` e um `member`; antes do aceite a conta convidada recebeu página não encontrada e, depois, ambos mantiveram o resumo após F5. A expiração natural de sete dias não foi observada. Recuperação de senha foi integrada na v0.12.0. Ainda faltam rate limiting operacional de convites, SMTP próprio, CSP compatível com Next, auditoria de privacidade e testes operacionais antes da publicação. Cabeçalhos não substituem essas proteções.

## Ambiente

Verificado Node 24.15.0 e npm 11.11.1. A instalação encontrou `UNABLE_TO_VERIFY_LEAF_SIGNATURE`; usar `$env:NODE_USE_SYSTEM_CA='1'` na sessão resolveu o acesso ao npm sem desabilitar TLS. Nenhuma configuração global alterada.

## Verificação

Testes Playwright cobrem a intenção do usuário (criar ou entrar por convite e voltar), navegação por teclado e largura da página em desktop/mobile. Build e TypeScript são verificações separadas. Resultados finais ficam no diário.

## Evolução e próxima ação

Catálogo extensível e tela Tipo de Núcleo implementados em 2026-09-25, em `src/features/nuclei` e `src/features/onboarding`, com formulário Next.js e validação do identificador nas páginas de servidor. Consulte o [registro próprio](<../registros/registro-v0.2.0-2026-09-25-01-imp-tela-tipo-nucleo-fun-selecao-vinculo.md>).

Propósito foi implementado em 2026-09-27 como [rascunho apenas em memória](../registros/registro-v0.3.0-2026-09-27-imp-tela-proposito-nucleo-fun-rascunho-local.md). A [entrega v0.4.0](../registros/registro-v0.4.0-2026-09-27-imp-integracao-supabase-fun-criacao-convite.md) acrescentou criação protegida, conta e convite real.

A [Home v0.5.0](../registros/registro-v0.5.0-2026-09-27-imp-home-nucleo-fun-resumo-protegido.md) usa `nuclei` e o vínculo próprio em `nucleus_members`, protegidos por RLS, com estados de carregamento e falha. A agenda ganhou contrato próprio na v0.6.0; árvore e gratidão ainda aguardam dados e permissões. Definir a fronteira web/Capacitor antes de empacotar Android: SSR/rotas de servidor não são executados dentro do pacote nativo. iOS permanece por último.

A [agenda interna v0.6.0](../registros/registro-v0.6.0-2026-09-27-01-imp-agenda-interna-fun-eventos-nucleo.md) tem contrato de evento e participante, autorização, RLS e interface. A migração foi aplicada ao `nos-dev` como `20260927221149_create_nucleus_calendar`; criação, resposta, edição, remoção e negativa de acesso a outro Núcleo foram testadas com duas contas. Sincronização com calendários externos fica para outra entrega. A [continuidade](../estado.md) traz o próximo passo executável.

A [Tela 04 Acordos v0.7.0](../registros/registro-v0.7.0-2026-09-28-imp-hub-acordos-fun-propostas-consentimento.md) apresenta propostas de Hábitos e Experiências, voto individual e transição para teste por unanimidade. A migração SQL, a RLS e o fluxo de consentimento foram validados no Supabase local e no `nos-dev` com contas temporárias; Essência e progresso permanecem sem dados simulados.

A [Tela 05 Detalhe do Hábito v0.8.0](../registros/registro-v0.8.0-2026-09-29-imp-detalhe-habito-fun-consulta-proposta-teste.md) usa a mesma sessão e RLS para mostrar apenas uma proposta de Hábito em teste. A [v0.9.0](../registros/registro-v0.9.0-2026-09-29-imp-registro-momento-habito-fun-historico-real.md) acrescentou registro e histórico reais de momentos, com escrita por função autenticada e leitura protegida. Revisão e métricas continuam sem contratos próprios.

## v0.11.0 — Teste e confirmação do Hábito

Rota /confirmar protegida por sessão, vínculo e relação Hábito/Núcleo. Duração inteira validada na fronteira; ações checam ciclo antes da RPC (chamada de procedimento remoto). Banco calcula prontidão e confirma sob bloqueio transacional. Votos próprios e agregados mantêm privacidade. Orientações compartilhadas explicam unanimidade inicial e limiar posterior; ajuste avisa reinício. Active habilita registro/revisão e filtro. Legado não recebe datas inventadas.

84 testes, tipos e build aprovados; cinco arquivos SQL e jornada autenticada local com cinco contas. Next usa .next-verify para scripts locais (NOS_LOCAL_VERIFY=1), separado de .next do usuário e .next-playwright dos testes. Migração e 13 funções conferidas no nos-dev; interface autenticada somente local. Próximo: contrato real da Tela 07 — Nossa Árvore.


## v0.12.0 — Conta e entrada

A raiz agora abre `/conta`; `/comecar` continua acessível após autenticação. Recuperação, confirmação com reenvio e apresentação opcional integradas. Consulte o [contrato vigente de Conta e entrada](../funcionalidades/conta-entrada.md).

## v0.13.0 — Navegação e sessão

Raiz sem sessão abre Conta; autenticada abre Seus Núcleos. Login/confirmação sem retorno específico segue para /nucleos. Todo /comecar e /nucleos exige sessão validada, inclusive rascunho e convite. Lista real sob RLS, seleção explícita e retorno do Início à lista. Token expirado com renovação válida mantém acesso; sessão não renovável pede login preservando destino. Esta decisão substitui o retorno padrão ao onboarding e o rascunho pré-login dos marcos anteriores. [Contrato vigente](../funcionalidades/navegacao-sessao.md).

## v2.0.2 — 2026-10-18 — certificados no servidor local

Scripts dev/start usam node --use-system-ca antes do CLI Next. A configuração precisa estar na inicialização do processo para alcançar suas requisições ao Supabase; não desabilita TLS. Validado com Node24.15.0, formulário real e dez testes de autenticação/rotas. [Evidências](../registros/registro-v2.0.2-2026-10-18-imp-conexao-supabase-fun-correcao-login-local.md).
