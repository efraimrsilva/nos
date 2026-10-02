# Registro — v0.9.0 — 2026-09-29 — Imp. de registro de momento do hábito com Fun. histórico real

**Versão vigente do projeto:** 0.9.0
**Status:** recorte de Registrar momento concluído em 2026-09-29; Revisar permanece pendente.

## Objetivo e contexto

Dar uma primeira ação real à faixa de ações da Tela 06: uma pessoa que aceitou participar de um Hábito em teste pode registrar como foi um momento. O detalhe da Tela 05 passa a mostrar esse histórico sem pontuação ou práticas simuladas. O catálogo prevê também Revisar, que depende de contrato próprio de mudança e consentimento.

## Requisitos e decisões técnicas

- A escrita exige sessão, vínculo atual ao Núcleo, aceite individual registrado na proposta e categoria Hábito no estado `testing`. A função SQL confere tudo novamente; a tela sozinha não é fronteira de autorização.
- O registro guarda autoria, humor (`great`, `good`, `neutral` ou `difficult`), nota opcional limitada a 500 caracteres e data gerada pelo banco. Não recebe foto, progresso, árvore ou impacto, pois esses contratos não existem.
- Integrantes atuais do Núcleo podem ler o histórico, inclusive registros de outras pessoas, sob RLS (Row Level Security, segurança por linha). A interface informa a visibilidade antes do envio. Não há edição ou exclusão nesta primeira fatia.
- O histórico apresenta até 20 registros por vez em ordem decrescente e usa cursor de data/identificador para não repetir ou omitir itens quando outra pessoa registra durante a navegação. Datas são identificadas como UTC (Tempo Universal Coordenado). O humor difícil não reduz pontuação.
- A ação Revisar permanece identificada como futura, sem botão ativo, até que estados, alterações permitidas e consenso estejam persistidos.

## Arquivos e integrações

- `supabase/migrations/20260929220000_create_nucleus_habit_moments.sql`: tabela, leitura protegida e função de escrita autenticada.
- `supabase/tests/nucleus_habit_moments.sql`: contrato de autorização, aceite, leitura e isolamento.
- `src/features/agreements/habit-access.ts`, `habit-moment-input.ts`, `habit-moment-actions.ts` e `components/habit-moment-form.tsx`: acesso compartilhado, entrada validada e gravação.
- `src/app/nucleos/[id]/acordos/[agreementId]/page.tsx` e `registrar/page.tsx`: histórico e formulário protegido.
- `tests/habit-moment-input.spec.ts` e `tests/habit-moment.spec.ts`: entrada e ausência de sessão.

## Validações e resultado

- O teste da rota sem sessão falhou antes da implementação e passou depois em desktop e celular. O teste da entrada falhou pela ausência da função; a regressão do cursor cobriu parâmetro repetido e o teste completo desses arquivos aprovou 8 casos. A suíte geral passou antes dos ajustes finais do cursor com 76 casos; repetição final após esses ajustes e versão consta no estado central.
- A migração `20260929220000` foi aplicada no Supabase local. `supabase test db` aprovou os contratos de Acordos e de momentos, incluindo escrita somente após aceite, leitura por integrante, bloqueio de inserção direta e isolamento entre Núcleos.
- Três sessões reais locais validaram criação/aceite da proposta, registro por autora, leitura por integrante e negativa de leitura/escrita por outra pessoa. A interface autenticada confirmou gravação, retorno ao histórico, leitura em viewport móvel e negativa do detalhe para outra conta. Uma inserção entre páginas confirmou o cursor estável. Dados temporários removidos, com contagem zero no teste da API.
- A simulação remota mostrou apenas esta migração; `db push --skip-vault` a aplicou ao projeto de desenvolvimento `nos-dev`, e `migration list` confirmou quatro versões locais/remotas alinhadas. O fluxo da interface autenticada foi verificado no Supabase local, não repetido no `nos-dev`.
- Revisão independente apontou paginação por posição e URL com parâmetro de cursor repetido; ambas corrigidas. A última conferência do diff não encontrou problemas materiais. A versão 0.8.0 → 0.9.0 é MINOR pela nova rota e ação persistente.

## Limitações e próximos passos

Não há fotos, edição, exclusão, porcentagem de progresso ou alimentação da árvore. O histórico usa registro no instante de gravação; a pessoa não informa data passada. Em entrega posterior, definir Revisar com consentimento, estados e critérios de mudança sem alterar silenciosamente o compromisso em teste. Antes de uso público, rever política de privacidade e operação já pendentes no projeto.
