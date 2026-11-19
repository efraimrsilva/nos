# Registro — v1.1.0 — 2026-10-15 — Imp. de administração do Núcleo com Fun. de encerramento coletivo

Status: concluído localmente, revisado e validado. Versão1.1.0, incremento MINOR pela nova função administrativa compatível; versão de partida1.0.1.

## Objetivo, contexto e requisitos

Permitir que qualquer administrador encerre o Núcleo para todas as pessoas. O usuário escolheu expressamente revogar convites e preservar o histórico armazenado. A interface utiliza “Encerrar Núcleo”, evitando sugerir exclusão física. Todos perdem acesso, inclusive administradores; contas permanecem. Não existe reabertura pelo aplicativo. A saída individual continua disponível e mantém sua regra anterior.

## Decisões técnicas e integrações

- Opção exclusiva de administradores na tela73, `/nucleos/[id]/pessoas`, com aviso, painel de confirmação inicialmente fechado, nome digitado e ciência explícita. Fechar o painel ou navegar não grava.
- Ação de servidor exige sessão válida e ciência; a função `close_nucleus(uuid,text)` exige administração sob `lock_nucleus_member(id,true)` e compara o nome atual após obter a trava. Compartilha serialização com convites, saídas e mutações existentes.
- Uma transação grava `closed_at`, revoga convites sem substituir datas anteriores, remove nomeações e vínculos de participação. Não remove contas, acordos, versões, momentos, agenda ou respostas históricas. Encerramento não executa saída individual nem sorteio de sucessor, e não reescreve autoria ou consentimentos históricos.
- Remover vínculos faz as políticas existentes de leitura e funções de consulta negarem acesso a todos. Aceite de convite exige Núcleo aberto e código não revogado. Não é exclusão física nem definição de política de retenção.
- Sucesso invalida o layout de Núcleos e retorna à lista com mensagem. Durante envio, campo e botão ficam bloqueados; falhas mantêm o contexto. Erro de nome é específico.
- Reutilizado `ControlActionForm`, com opções de cor e texto de processamento preservando os padrões anteriores. Sem biblioteca ou infraestrutura nova. Checklist React aplicada; efeitos e estado global adicionais desnecessários.

## Arquivos envolvidos

`src/app/nucleos/[id]/pessoas/page.tsx`, `src/app/nucleos/page.tsx`, `src/features/controls/actions.ts`, `src/features/controls/components/action-form.tsx`; migração `supabase/migrations/20261015120000_close_nucleus.sql`; testes `supabase/tests/nucleus_closure.sql` e `tests/authenticated/nucleus-closure.spec.ts`. Ajuste delimitado de seletor em `tests/authenticated/controls.spec.ts`: texto do suporte passou a existir também nos rodapés preexistentes.

Atlas: `screens.js`, `product-ui.js`, `atlas.js`, `mvp-plan.js`, fichas/percursos/visão global derivados, cobertura, guia, fidelidade e galeria. Capturas reproduzíveis em `scripts/capture-nucleus-closure-atlas.mjs`; imagens somente de exemplos e contas locais temporárias. Manifestos e registros serão atualizados ao concluir. Alterações locais anteriores de árvore opcional e implantação foram preservadas.

## Validações realizadas e em curso

- TDD (desenvolvimento orientado por testes): teste `has_function` falhou antes da migração, confirmando ausência da operação; teste aprovado após implementação.
- Supabase local:24 verificações novas de autorização, nome, preservação, isolamento, revogação e bloqueio de leitura. Suíte SQL completa:105 testes, três arquivos, aprovada.
- Tipos: `npm.cmd run typecheck` aprovado.
- Fechamento: tipos reconferidos na versão1.1.0; `git diff --check` aprovado, manifestos e11 referências da galeria conferidos. Verificadores `verify-mvp-controls.mjs`, `verify-global-view.mjs` e `verify-mvp-view.mjs` aprovados. Zero contas temporárias das suítes routing/administration; Supabase local encerrado com backup confirmado. Conferência independente final dos testes e Atlas sem achados adicionais.
- Navegador:10 testes autenticados aprovados (desktop/celular), cobrindo o fluxo novo e regressões de administração/saída. Build de produção webpack aprovado na cópia temporária, com fontes/recursos conferidos por SHA-256. Falhas iniciais de seletores ambíguos foram corrigidas; a tentativa após nome incorreto exige remarcar ciência porque o formulário React é reiniciado. Nenhuma mudança de produção foi necessária por essas falhas.
- Revisão independente estática dos sete arquivos de implementação/teste sem achados acionáveis. Não incluiu execução de testes pelo revisor. Autorrevisão do diff desta entrega concluída; Atlas73/MVP05 em duas larguras e visão global aprovados, sem erros ou overflow. Capturas antes/depois e confirmação ilustrativa com nome incorreto/correto verificadas.
- Context7 Supabase consultado sobre funções seguras e permissões. Octocode CLI19.1.0 executado para dependências de `controls/actions.ts`: grafo sintático parcial, complementado pela leitura local. Ferramentas já instaladas; nenhuma dependência adicionada.

## Resultado, limitações e próximos passos

Implementação local concluída. Migração aplicada apenas no contêiner local; nenhuma operação remota ou encerramento de Núcleo real. Publicação, aplicação remota da nova migração e comprovação online permanecem fora desta entrega. Histórico armazenado não possui tela de arquivo/reabertura; direitos e retenção continuam sujeitos ao suporte e contratos operacionais existentes, sem prazo inventado.

Próximo passo: publicar código e aplicar a migração no ambiente de uso somente mediante autorização, depois comprovar a função online com dados de teste. Pendências anteriores de commit preservadas. O verificador histórico verify-fidelity.mjs foi tentado sem cookies de sessão e parou no título de /comecar, redirecionado corretamente a Conta; não é evidência de divergência desta tela e não foi declarado aprovado. Os testes autenticados e as capturas desta entrega verificam o fluxo solicitado.
