# Registro — v4.0.0-alpha.16 — 2026-11-17 — Imp. da estrutura Angular com Fun. de perfil, Mais e suporte

**Versão.** Angular v4.0.0-alpha.16. Referência funcional e de estilo em Next.js v3.11.1, commit `604a142`.

**Status.** Entrega local implementada, autorrevisada e validada.

**Objetivo e requisitos.** Completar o recorte local do passo 03 da guia Migração, nas Telas 66, 67 e 70. Recuperar a composição dos menus de conta, manter o contexto da rota ao abrir um modal e portar a expansão temporária do botão de relato em desktop e celular.

**Decisões.** Reusar o mesmo componente Angular de Conta, aberto sob demanda, e os estilos da base Tailwind. Manter as composições de duas colunas no perfil e coluna única no Mais. Os controles incorporados usam identificadores diferentes dos da página completa para que rótulos e foco apontem ao diálogo correto. Angular 22, Tailwind 4 e a camada nativa de popover/dialog já cobrem os requisitos. Uma biblioteca adicional de componentes duplicaria o fechamento e o gerenciamento de foco existentes. Context7 Angular 22 foi consultado para sinais e carregamento sob demanda. A inspeção do código conhecido usou Git e rg.

**Arquivos e integrações.** `app.{ts,html,css}` e `shell-navigation.css` cuidam do cabeçalho e fechamento dos menus. `account`, `account-preferences`, `appearance-picker`, `account-menu.css` e `shared/nav-icon.ts` apresentam as seis seções e reutilizam os controles existentes. `problem-report` e `problem-report-reminder.ts` integram o mesmo formulário de suporte do aplicativo ao lembrete. As rotas, as permissões e o serviço de suporte do Supabase permanecem os do projeto. O lembrete usa o armazenamento temporário da aba com alternativa em memória. Ao abrir o relato durante a expansão, o botão se recolhe. Sair e entrar inicia outro prazo.

**Modais e resultado.** No perfil desktop e no Mais móvel, quem tem sessão pode consultar Dados da conta, escolher tema, conferir privacidade, abrir orientações, iniciar relato e confirmar a saída. Fechar o modal interno por X, Escape ou gesto externo retorna à opção de origem e mantém o menu. A confirmação de saída encerra a sessão. As demais ações continuam seguindo seu contrato de conta autenticada. [Inventário e permissões](../funcionalidades/modais-interface.md) · [Comparação visual](../../wireframes/comparacoes/v4.0.0-alpha.16-2026-11-17-perfil-lembrete-tela-66-tela-67-tela-70/index.html).

**Validações.** Tipos e compilação de produção do Angular passaram. A suíte Playwright de acesso, navegação e perfil teve 31 aprovações e uma omissão desktop para gesto exclusivo do Mais móvel. Os dois casos de envio falharam nesse ambiente porque o banco local de desenvolvimento não contém a função `reserve_problem_report`. O reteste isolado com as migrações do repositório e uma caixa Mailpit em loopback confirmou os dois casos. Um teste móvel de edição havia perdido a página durante atividades concorrentes. Na repetição com fontes estáveis, passou. Os verificadores de Migração, Relato e Fechamento de modais do Atlas passaram. A coluna única do Mais no Atlas foi conferida em 390 px. Foram verificadas 46 referências locais da galeria e 22 imagens. Foi feita autorrevisão do diff final.

**Limites.** Recuperação e confirmação usam as rotas de assistência do Angular. As ações de participação ficam nas telas do Núcleo. O Atlas demonstra dados ilustrativos e permite antecipar o lembrete. A verificação foi no Chromium desktop e emulação móvel, com Supabase local. Produção e aparelho físico ficam fora desta entrega.

**Como conferir.** Iniciar a prévia com `npm --prefix apps/web start`, entrar com uma conta local e abrir o avatar em uma janela larga. Em 390 px, abrir Mais. Selecionar Escolher tema e fechar o modal. No cabeçalho, aguardar 60 segundos em uma sessão nova e observar a expansão por 10 segundos. Clicar no aviso abre o formulário e recolhe a expansão.

**Próximo passo.** Portar o passo 04 a partir das rotas Next.js de Começar. Incluir escolha, tipo, propósito e conferência das Telas 06–09. Validar retorno e preservação do rascunho antes da próxima gravação.

**Git.** Entrega local na branch `codex/migracao-angular` a partir de `6c036a3`, sobre a unidade Tailwind/entrada anterior ainda pendente de commit. Comparações históricas preservadas.
