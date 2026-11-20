# Registro — v4.0.0-alpha.23 — 2026-11-20 — Imp. da paridade Angular com Fun. de Acordos e participação

**Status:** concluída localmente na branch `codex/migracao-angular`, base `aaa6d0d`. Paridade visual 09, Telas 18, 22 e 23. Sem commit, push ou publicação nesta solicitação.

## Objetivo, contexto e requisitos

Continuar a sequência aprovada após gestão de eventos. Comparar a lista, a proposta, a conferência e a participação com o código Next.js `604a142` e o Atlas vivo. Preservar busca na página, permissões, consentimento individual, contagens e compatibilidade histórica. As Telas 19–21 e a evolução para Essência continuam planejadas.

## Decisões técnicas

- Reutilizar Angular 22.2, CSS e diálogos nativos compartilhados. A comparação rápida de soluções não indicou benefício concreto em adicionar biblioteca de formulários, quadros ou modais: os controles e estados necessários já existem. Nenhuma dependência nova.
- Portar descrição, estado e rodapé dos cartões, contagem por coluna, tons de Proposta e Hábito e contexto da própria participação em Painéis. No celular, manter a lista e os termos completos no diálogo. Descrição resumida permanece no cartão de computador.
- Agrupar momento e frequência no formulário, adaptar a conferência para uma coluna no celular e incluir a orientação de administração/consentimento nos dois estados. Conferir e editar continuam locais; somente o envio explícito grava. Os serviços e contratos de dados não foram alterados.
- Incrementar o identificador de prévia de alpha.22 para alpha.23 como ajuste compatível da paridade, seguindo a linha de versões da migração. Manifestos da raiz e de `apps/web`, lockfiles e Atlas sincronizados; README sem versão do aplicativo.

## Arquivos e integrações

- `apps/web/src/app/agreements/agreements-page.html`, `agreements.css` e `proposal-editor.html`: composição, contexto e orientação. Comentário registra a relação entre os estados do mesmo formulário.
- `tests/angular/nuclei.spec.mjs`: extensão do percurso técnico existente para descrição do cartão, orientação de consentimento, fechamento pelo fundo com retorno de foco, busca sem resultado e Painéis.
- `docs/wireframes/atlas/{product-ui.js,product.css,screens.js,index.html}` e verificador da guia Migração: representação e continuidade. Os percursos e a cobertura preservam os mesmos IDs e estados planejados.
- Manifestos, planos, contrato de proposta, guia, cobertura, comparações, estado, histórico e brag: rastreabilidade da mesma entrega.

## Diálogos e permissões

**Nova proposta**, acionado por integrante atual do Núcleo na Tela 18, reúne edição e conferência da Tela 22. **Termos do acordo**, aberto pelo cartão, mostra a participação da Tela 23. **Recusar participação?**, aberto dentro dos termos, exige confirmação explícita; cancelar preserva a resposta. **Enviar convite** continua restrito à administração e **Nossa Essência** continua esboço. São diálogos existentes; mantêm X, Escape e gesto iniciado/terminado fora, sem confirmar ações ao fechar. Foco retorna ao acionador. Atlas usa dados ilustrativos e não grava.

## Validações e evidências

- Antes das alterações: percurso autenticado existente aprovado em computador e celular; capturas anteriores preservadas. A tentativa inicial não iniciou testes porque o Docker estava parado. Docker Desktop foi iniciado, banco local ficou saudável e o percurso foi executado.
- Desenvolvimento orientado por teste: a nova expectativa de orientação de consentimento falhou no estado anterior e passou após a alteração.
- `npm run typecheck` e `npm run build`: aprovados na alpha.23.
- Playwright: quatro testes aprovados, proposta e ciclo de Hábito em computador (1440 × 960) e celular (390 × 844), com duas contas descartáveis locais. Confere ausência de aceite implícito, revisão sem escrita, preservação de rascunho, sincronização de contagens/termos, recusa individual, versão nova, resposta perdida sem reenvio duplicado e isolamento por Núcleo. O ciclo protege os estilos compartilhados de termos e histórico.
- `npm run test:db`: 13 arquivos, 257 verificações aprovadas no Supabase local. Sem migração ou operação remota.
- Verificadores do Atlas: percurso de proposta, modelo Hábito, fechamento dos diálogos e guia Migração aprovados. Conferência adicional da proposta offline em 1440 e 390 pixels verificou edição, conferência, foco, rascunho e Escape; sem erros JavaScript. Verificador de modelo também usa movimento reduzido.
- Inspeção visual do aplicativo e do Atlas; [galeria antes/depois](../../wireframes/comparacoes/v4.0.0-alpha.23-2026-11-20-paridade-acordos-tela-18-tela-22-tela-23/index.html). Não se afirma equivalência pixel a pixel entre os ambientes.
- Autorrevisão e revisão independente estática: sem achados materiais. Observação de precedência de CSS no tracejado de Essência corrigida. `git diff --check` conferido. Um verificador legado regenerou quatro imagens históricas; essas saídas foram restauradas ao conteúdo original do Git, preservando a galeria histórica.

## Resultado, limites e próximo passo

Paridade 09 concluída localmente. Contagens e consentimento permanecem sob os serviços e permissões existentes; não houve alteração no banco ou nova regra de domínio. Testes técnicos não equivalem à aprovação manual do usuário. Não foram criados roteiros de caixa preta. Octocode MCP não está exposto; não foi necessária pesquisa avançada entre repositórios/pacotes. As referências conhecidas foram lidas com Git e buscas locais delimitadas. Context7 consultado para a linha Angular 22.0.x; a revisão exata 22.2 não está indexada e foi complementada pelos tipos e compilador instalados.

Próximo passo: paridade visual 10, detalhe, momento e gestão do ciclo de Hábitos, considerando as fontes Next.js e as Telas 24–29. Publicação depende de solicitação de commit/push ou outra autorização explícita.
