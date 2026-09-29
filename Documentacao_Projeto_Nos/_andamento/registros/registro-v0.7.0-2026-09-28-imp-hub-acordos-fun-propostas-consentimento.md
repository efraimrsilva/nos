# Registro — v0.7.0 — 2026-09-28 — Imp. de hub de Acordos com Fun. propostas e consentimento

**Versão vigente do projeto:** 0.7.0
**Status:** Concluído em 2026-09-29.

## Objetivo e contexto

Implementar a Tela 04 após a agenda v0.6.0, com dados reais do Núcleo, propostas de Hábitos e Experiências e consentimento explícito. A proposta não pode aparecer como compromisso confirmado.

## Requisitos e decisões técnicas

- Acesso apenas por sessão e vínculo com o Núcleo; RLS limita a leitura.
- Integrante pode propor um compromisso para os participantes atuais; o autor aceita a própria proposta. São necessários pelo menos dois integrantes.
- Cada outro participante responde por si. A proposta entra em teste apenas quando todos aceitam; recusa encerra a proposta. A resposta é serializada com a transição de estado.
- Essência, progresso, recorrência, alterações estruturais e aprovação de acordos revisados ficam para fatias posteriores, sem métricas ou itens simulados.

## Arquivos alterados e integrações

- `supabase/migrations/20260928120000_create_nucleus_agreements.sql`: propostas, respostas, RLS de leitura, RPCs autenticadas, validação no banco e bloqueio da proposta para serializar respostas.
- `src/features/agreements/`: validação das entradas, ações de servidor, formulário e confirmação de recusa.
- `src/app/nucleos/[id]/acordos/page.tsx`: hub protegido, categorias, filtros, paginação, estados e respostas próprias.
- `src/app/nucleos/[id]/page.tsx`: link da Home. `tests/agreement-input.spec.ts`: entrada e proteção da rota.
- `supabase/tests/nucleus_agreements.sql`: teste pgTAP local da RLS, dos votos individuais, da unanimidade e da recusa.
- README e acompanhamento: situação real da entrega.

## Validações realizadas e resultado

TDD: os quatro casos desktop/mobile falharam antes da implementação, dois pela validação e dois pela rota sem proteção; passaram depois. A suíte completa aprovou 68 testes com um worker. `npm.cmd run typecheck` e `npm.cmd run build` passaram após os ajustes; o build reconheceu `/nucleos/[id]/acordos` como rota dinâmica. A primeira checagem de tipos foi executada em paralelo ao servidor Playwright e falhou em artefatos temporários de geração de rotas; a repetição sequencial passou. A revisão independente encontrou três problemas de fluxo: formulário na Essência, perda da categoria após uma ação e recusa sem confirmação; os três foram corrigidos antes da validação final.

Em 2026-09-29, Docker 29.8.1 permitiu iniciar o Supabase local; a CLI 2.118.0 aplicou as três migrações, incluindo a de Acordos. `supabase test db` aprovou o teste pgTAP de RLS e de consentimento. Na aplicação apontada somente para o banco local, uma conta criou uma proposta, a segunda aceitou e ela entrou em teste; outra proposta foi recusada. Uma terceira conta de outro Núcleo recebeu a página 404, sem conteúdo de Acordos. No Next.js de desenvolvimento, a resposta HTTP dessa página renderizada foi 200, por isso a verificação de interface usou o conteúdo 404 e a RLS foi testada diretamente. Com três integrantes, duas respostas enviadas simultaneamente concluíram em estado `testing`. As contas, os Núcleos e as propostas temporários foram removidos; as contagens finais foram zero.

## Validação remota e resultado

Em 2026-09-29, a CLI autenticada identificou `nos-dev`; `db push --dry-run` indicou somente `20260928120000_create_nucleus_agreements.sql`. O envio com `--skip-vault` aplicou a migração. `migration list` mostrou as três versões iguais local/remoto, e uma nova simulação confirmou `Remote database is up to date`.

Três contas temporárias no `nos-dev` verificaram o fluxo com identidades reais: a criadora criou o Núcleo e convidou a segunda pessoa; uma proposta iniciou pendente e entrou em `testing` após aceite unânime; outra terminou em `declined` após recusa. A terceira conta, fora do Núcleo, recebeu lista vazia e teve sua tentativa de resposta negada. A limpeza pela API administrativa encontrou a restrição de `DELETE` das tabelas; o Núcleo e a conta restantes foram excluídos por consulta administrativa identificada, com contagem final **zero** para Núcleo, propostas e contas temporárias. A revisão independente final não encontrou defeito material de código; apontou documentação desatualizada, corrigida na entrega. A repetição completa de Playwright aprovou 68 testes desktop/mobile; `npm.cmd run typecheck`, `npm.cmd run build` e `git diff --check` passaram na v0.7.0. Manifestos e links do registro renomeado foram conferidos. A primeira tentativa de iniciar o servidor de testes atingiu o limite de 120 segundos; a inicialização isolada respondeu HTTP 200 e a repetição passou.

## Limitações e próximos passos

Os testes automatizados de interface com sessão cobrem o fluxo local; no remoto, o contrato de Auth, funções e RLS foi verificado pelas APIs com três contas. Uma inspeção visual autenticada no remoto em telas móvel e desktop ainda pode ampliar a evidência visual, sem impedir esta entrega. Essência, medição de progresso, edição de propostas e aprovação final de acordos continuam fora do recorte. A próxima tela deve consumir propostas em teste somente após definir seu próprio contrato; proposta não equivale a acordo ativo. O aplicativo não foi publicado publicamente.
