# Registro — v0.6.0 — 2026-09-27 — Imp. de agenda interna com Fun. eventos do Núcleo

**Versão vigente do projeto:** 0.6.0
**Status:** Concluído, revisado e validado no desenvolvimento.

## Objetivo e contexto

Implementar a primeira agenda interna após a Home v0.5.0, conforme a Tela 03 do catálogo v2.1 e as regras de calendário, modelo de Evento, permissões e estados vazios.

## Requisitos e decisões técnicas

- Todo evento pertence a um Núcleo e é visível somente aos seus integrantes, sob RLS.
- Qualquer integrante pode criar. Autor e criador do Núcleo podem alterar ou remover. Participantes respondem apenas pela própria presença.
- A primeira fatia inclui eventos pontuais com título, intenção opcional, início, fim e fuso IANA. Os integrantes atuais do Núcleo participam do evento; novos integrantes posteriores não recebem convite retroativo.
- O calendário interno é a fonte oficial. Não importar agenda pessoal, sincronizar externamente, criar recorrência ou associar a módulos ainda inexistentes.
- Interface com estado vazio, erro, carregamento e feedback acessível; testar isolamento entre contas/Núcleos antes de considerar a entrega concluída.

## Arquivos alterados e integrações

- `supabase/migrations/20260927221149_create_nucleus_calendar.sql`: eventos, respostas, índices, RLS de leitura e RPCs de escrita autenticada. O nome local foi alinhado ao número registrado no `nos-dev`.
- `src/features/calendar/`: validação de entrada, ações de servidor e formulário no fuso local do dispositivo.
- `src/app/nucleos/[id]/agenda/page.tsx`: rota protegida, lista de eventos futuros, resposta individual, edição/remoção e estado vazio.
- Paginação de 50 eventos por vez com navegação para os demais; fallback de data em UTC caso o banco contenha um nome de fuso não reconhecido pelo `Intl` do servidor.
- `src/app/nucleos/[id]/page.tsx` e `src/shared/routes.ts`: acesso à agenda a partir da Home.
- `tests/calendar-event.spec.ts` e `tests/nucleus-calendar.spec.ts`: validação de fronteira e proteção da rota.
- README e documentos de andamento: status real da integração.

## Validações realizadas e resultado

TDD da validação de campos: teste de aceitação falhou com retorno nulo antes da implementação; outro teste revelou uma data ISO inexistente que era aceita e foi corrigida. A proteção da rota falhou antes da implementação. Revisão própria do diff e do SQL corrigiu o predicado de RLS que precisava qualificar o Núcleo do evento, rejeitou eventos já terminados e serializou respostas com remarcações. A revisão independente posterior apontou fuso válido no banco mas inválido no `Intl`, e limite de 50 sem navegação; foram adicionados fallback e paginação com testes que falharam antes da correção e passaram depois. Na conferência de entrega, a primeira execução paralela teve nove timeouts ao encerrar contextos mobile; o servidor de testes sinalizou lentidão do disco. `npm.cmd test -- --workers=1` aprovou **64 testes em desktop/mobile**; `npm.cmd run typecheck`, build de produção e `git diff --check` passaram. A autorrevisão final não encontrou outro problema no escopo. O build incluiu `/nucleos/[id]/agenda` como rota dinâmica. Docker local está inativo. A Management API aplicou a migração no `nos-dev`, confirmada no painel como `20260927221149_create_nucleus_calendar`. Na aplicação, a conta criadora leu o estado vazio, criou, respondeu, editou e removeu um evento temporário. A conta participante viu o mesmo convite sem opção de edição, respondeu e recebeu confirmação. O evento temporário foi removido. Para validar isolamento, um segundo Núcleo sem convite foi criado pela conta criadora; a conta participante abriu normalmente a agenda original e recebeu 404 na agenda desse segundo Núcleo. O banco confirmou a remoção de exatamente um registro, o Núcleo temporário, por identificador e nome; a contagem final voltou a um Núcleo. O esquema prevê exclusão em cascata do único vínculo desse Núcleo.

## Limitações e próximos passos

A versão avançou de 0.5.0 para 0.6.0 (MINOR) pela nova rota e funcionalidade. A primeira fatia não traz seleção individual de participantes, navegação mensal, recorrência, sincronização externa ou integração com acordos/experiências. A próxima tela do catálogo v2.1 é a Tela 04 — Acordos; o [estado canônico](../estado.md) indica fontes, contrato, consentimento e recorte a definir antes da implementação. Publicação pública permanece fora de escopo.
