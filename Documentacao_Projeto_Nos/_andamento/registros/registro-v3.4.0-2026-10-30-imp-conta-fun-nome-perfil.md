# Registro — v3.4.0 — 2026-10-30 — Imp. de conta com Fun. nome do perfil

Versão:3.4.0. Status: concluído e validado localmente; sem publicação.

## Objetivo, contexto e requisitos

Permitir alteração do próprio nome por lápis ao lado do nome no modal Dados da conta. O componente é usado pela página /conta (Tela66) e painel desktop da navegação global (exemplo Tela13). Antes havia apenas consulta e orientação para suporte. Manter identidade visual, teclado, cancelamento, estados de erro/progresso/sucesso e persistência real. Não alterar o perfil afetivo planejado.

## Decisões e integrações

Edição no próprio modal, sem diálogo adicional. Campo obrigatório com limite de1–80 caracteres após trim, igual ao cadastro. Salvar nome e Cancelar; fechamento antes de enviar descarta rascunho. Depois do envio, fechar não desfaz uma gravação já iniciada. Enquanto grava, controles desabilitados; sucesso e foco no lápis após confirmação. Efeito de entrada curto, desativado por prefers-reduced-motion.

Ação no servidor consulta getUser e compara user.id à conta exibida originalmente, protegendo abas antigas após troca de sessão. updateUser envia somente data.name com a sessão própria; não usa chave administrativa, não permite escolher outro alvo e não usa metadados pessoais para autorização. Confere nome/identidade retornados antes de confirmar. Revalida layout para nome e iniciais compartilhados. Demais metadados preservados, comprovados por consulta local após gravação. Nenhuma migração, instalação ou publicação.

## Arquivos

- src/features/controls/profile-name-action.ts: validação e gravação autenticada.
- src/features/controls/components/account-data-dialog.tsx: formulário e estados; account-preferences.tsx reutiliza-o.
- src/app/conta/page.tsx e src/features/onboarding/components/onboarding-shell.tsx: fornecem userId original.
- src/shared/components/ui/action-dialog.tsx: callback opcional de fechamento descarta o rascunho.
- src/features/controls/accounts-layout.css: disposição de nome/lápis, botões e movimento reduzido.
- Atlas: product-ui.js/product.css/icons.js, screens.js/mvp-plan.js e index.html; composição compartilhada da Tela66 e perfil, edição somente ilustrativa.
- tests/profile-name.spec.ts, tests/authenticated/profile-name.spec.ts e scripts/verify-profile-name-atlas.mjs.
- Manifestos, README, contrato nome-perfil.md, inventário de modais, MVP, cobertura, testes de caixa preta, brag, continuidade e galeria vinculada abaixo.

Alterações locais anteriores de v3.3.2/v3.3.3, suas galerias e .vscode/ foram preservadas. Branch main, base07e4bbb. Sem commit nesta entrega. MINOR por nova funcionalidade compatível, após validação funcional.

## Validações e revisão

- Ciclo TDD: teste autenticado inicial falhou pela ausência do botão Editar nome do perfil, antes do código de produção; antes real capturado em desktop/celular.
- npm test -- profile-name.spec.ts --project=desktop:4 testes aprovados. Entradas inválidas, sessão ausente/erro/outra conta, trim, payload restrito, invalidação após confirmação, falha de transporte/resposta divergente sem sucesso falso.
- npm run test:authenticated -- profile-name.spec.ts:2 cenários aprovados, desktop e celular, em duas rodadas; última inclui falha de transporte, rascunho preservado, nova tentativa, cancelamento sem gravação, consulta de persistência e preservação de metadado, recarga e foco. Desktop cobre também gravação no painel global do perfil. Fixtures locais removidas pela suíte.
- node scripts/verify-profile-name-atlas.mjs: edição/resultado ilustrativos em desktop/celular, zero erros JavaScript; capturas antes/depois. Inspeção visual encontrou ícone ausente no mapa do Atlas; adicionado Pencil compatível com o aplicativo e recapturado. Campo real usa a classe ui-field existente.
- node Documentacao_Projeto_Nos/wireframes/tools/verify-global-view.mjs:73 telas, composições/sincronização/teclado/mobile/hash/impressão aprovados; sem erros ou recursos externos.
- npm run typecheck aprovado antes da rodada final. Build de produção webpack aprovado dentro de cada suíte autenticada, sobre cópia conferida por SHA-256. Conferência final após versionamento: npm run typecheck e npm run build (Turbopack) aprovados, usando NOS_LOCAL_VERIFY=1 para isolar saída e preservar o servidor do usuário.
- Autorrevisão dos arquivos novos e diff total, preservando alterações preexistentes. Revisão independente estática focal de ação, editor, propagação de identidade, revalidação, fechamento e Atlas: nenhum achado acionável. Revisor não executou testes nem inspeção visual.
- Testes de banco e calendar-locks não executados: sem mudança de esquema, políticas ou agenda; persistência Auth verificada na suíte local. Manual do usuário M05-PER-010 a013 permanece Não executado.

## Ferramentas, limites e próximo passo

Superpowers7.0.1 e checklist React aplicados proporcionalmente. Context7 consultado; versão próxima2.117.1 sem resposta, consulta geral supabase-js complementada pelos tipos/fontes instalados2.117.2. Guias locais Next16.3.6 confirmam revalidatePath. Changelog remoto não recuperado (ferramenta web não aceitou text/markdown; tentativa Node recusou conexão); nenhuma migração de versão efetuada. Octocode não exposto; pesquisa avançada de dependências não necessária, buscas locais delimitadas suficientes.

Nome de outras pessoas não é atualizado em tempo real em páginas já abertas; aparece nas próximas leituras. Reabrir Atlas restaura o exemplo, sem persistência real. Não houve alteração remota, commit, push ou deploy. Próximo passo: usuário executar os casos de caixa preta e autorizar commit quando desejar; pendências anteriores preservadas.

[Galeria — modal Dados da conta, origem e estados](../../wireframes/comparacoes/v3.4.0-2026-10-30-nome-perfil-tela_13-tela_66/index.html) · [Contrato](../funcionalidades/nome-perfil.md) · [Plano](../planos/nome-perfil.md).

Conferência final: manifestos, indicação vigente do README e Atlas em3.4.0;14 imagens locais presentes na galeria;3 links dos documentos novos sem alvo ausente; diff sem erros de whitespace após remover uma linha vazia final. Trabalho concorrente de temas apareceu durante o encerramento e foi preservado, fora do recorte e da revisão funcional desta entrega. Capturas de edição mostram também o rascunho mantido após falha provocada; as capturas de sucesso comprovam o estado confirmado.
