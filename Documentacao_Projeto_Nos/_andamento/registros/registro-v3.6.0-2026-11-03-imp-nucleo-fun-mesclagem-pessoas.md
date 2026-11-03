# Registro — v3.6.0 — 2026-11-03 — Imp. de Núcleo com Fun. mesclagem de Pessoas

**Status:** Concluído e validado localmente. **Versão atual:**3.6.0. **DOCS_DIR:** Documentacao_Projeto_Nos.

## Objetivo, contexto e requisitos

Redistribuir as funções existentes para eliminar Pessoas da navegação, preservando participação voluntária, administração equivalente, consentimentos e histórico. Aprovação do desenho e da mesclagem recebida; saída na Conta, popover e Mais confirmada. Preservar UX (experiência do usuário), padrões visuais, animações e prefers-reduced-motion.

## Decisões e integrações

- Início: propósito entre nome e papel; lápis administrativos separados e modal para cada campo. Gravação sem redirect, com feedback local e revalidação dos dados.
- Integrantes: lista completa autorizada pela RPC get_nucleus_management, com todos os comandos administrativos anteriores. Rota /pessoas mantida apenas como compatibilidade para abrir o modal no Início.
- Conta/popover/Mais: Gerenciar convites abaixo Seus Núcleos; saída com ciência e preferência de autoria; encerramento abaixo saída, mesma classe vermelha de Apagar minha conta, mantendo confirmação por nome no banco. Se houver mais de um vínculo, seleção explícita com reset da confirmação.
- Entrada por convite continua necessária para aceitar códigos. Retirado somente o atalho da Conta; /nucleos e /comecar/convite preservados.
- Sem novas dependências. Nova RPC update_nucleus_identity reusa lock_nucleus_member e altera apenas o campo editado, evitando sobrescrita de outro campo por administrador com tela antiga. Migração exclusivamente local nesta entrega; aplicar no destino antes de publicar o código.
- Estado de gestão mantido no componente da lista para sobreviver à remoção do formulário após nomeação/aceite. Menus se fecham ao navegar; revalidação sem navegação preserva modais.

## Arquivos principais

Páginas Início/Pessoas, application-shell.tsx, onboarding-shell.tsx, account-preferences.tsx, actions.ts; account-nuclei.ts, nucleus-identity.tsx, nucleus-members.tsx e nucleus-account-options.tsx; layout-system.css; migração20261103160000 e nucleus_identity.sql; testes autenticados; Atlas product-ui.js/product.css/screens.js e verificadores; registros, contratos, roteiro e galeria.

## Validações e resultado

Tipos e build webpack final aprovados na versão3.6.0;30 cenários autenticados em desktop/mobile,20 testes públicos e118 testes SQL pertinentes aprovados. Verificadores Atlas de organização, controles, paridade, MVP e Visão global aprovados. Revisão independente estática e autorrevisão concluídas sem bloqueios de código. Reteste adicional final de capturas/animações registrado no fechamento. Antes do aplicativo e Atlas capturados; galeria alvo v3.6.0-2026-11-03-nucleo-tela_13-tela_66-tela_71-tela_73. Testes automatizados não aprovam testes de caixa preta do usuário.

## Ferramentas e limitações

Superpowers entendimento, TDD (desenvolvimento guiado por testes), revisão e verificação; skill Supabase e checklist React. Context7 consultado para Next16.2.9, versão indexada mais próxima da16.3.6 instalada; APIs existentes e tipos locais conferidos. Octocode não exposto, sem pesquisa avançada entre repositórios/pacotes necessária. Consulta ao changelog Supabase.md recusada pelo leitor web por tipo de conteúdo; sem dependência de API nova do SDK. Banco local existente apresenta lacunas de histórico e função de confirmação de e-mail ausente; sem reset/reaplicação de migrações antigas.

## Próximo passo

Executar os14 casos de caixa preta do usuário. Quando houver autorização de publicação, aplicar a migração de identidade no destino antes do código; preservar a pendência de commit deste conjunto. Nenhum commit, push, deploy ou banco remoto autorizado nesta entrega.

## Falhas intermediárias preservadas

TDD inicial:2 falhas esperadas por controles ausentes. Primeiro reteste:2 falhas na associação implícita do textarea, corrigida com rótulo explícito. Rodada22:14 aprovados/8 falhas; feedback de gestão precisava sobreviver ao desaparecimento do formulário e foi mantido no componente da lista; seletores antigos da Conta foram delimitados aos diálogos ativos. Rodada24:22 aprovados/2 falhas de seletor do aviso de saída, corrigidas. Uma seleção posterior não iniciou por erro de sintaxe introduzido na edição do teste, corrigido e lista de testes conferida. Rodada final ampla:30 aprovados. Traces do volume apresentaram erros de gravação; retestes sem trace. Uma tentativa extra concorrente ao build encerrou antes dos testes, sem diagnóstico suficiente e com cópia temporária pendente de limpeza; reteste serial registrado no fechamento. Nenhuma dessas tentativas é contada como aprovação.

Suíte SQL total:173 asserções executadas, mas falha no arquivo email_confirmation.sql por get_email_confirmation_status ausente no banco local. Esta lacuna é anterior e externa ao escopo; quatro arquivos pertinentes isolados passaram118 asserções, incluindo13 novos casos de identidade. Histórico local de migrações apresenta divergência; somente nova função/migração aplicada, sem reset ou reaplicação de antigas. Primeiro SQL de CASE corrigido antes de confirmar função existente.

## Fechamento — v3.6.0

Reteste serial final:11 aprovados/1 ignorado intencionalmente por ser popover exclusivo do desktop. Galeria46 imagens incluindo todos os novos modais e controles da Conta/Mais. Cinco verificadores Atlas aprovados; inventário73 IDs/39 existentes/34 planejados. Build e tipos finais3.6.0 aprovados. Duas leituras de revisão independente estática, sem bloqueios concretos.14 casos de caixa preta Não executados pelo usuário. Unidade pronta para commit pendente, sem publicação; contador adicional11, histórico165/marco100 preservados. Limpeza da cópia temporária nos-auth-3VgTQD recusada automaticamente por política; pasta preservada. [Galeria](../../wireframes/comparacoes/v3.6.0-2026-11-03-nucleo-tela_13-tela_66-tela_71-tela_73/index.html).
