# Registro — v0.10.0 — 2026-10-02 — Imp. de revisão do hábito com Fun. consentimento e reflexão

**Versão:** 0.10.0. **Status na entrega de 2026-10-02:** recorte de revisão do Hábito em teste concluído, então sem commit ou publicação. Commit e push autorizados em 2026-10-03, conforme registro de publicação.

## Objetivo e contexto
Ativar Revisar no detalhe, conforme continuidade da v0.9.0 e recorte aprovado pelo usuário em 2026-10-02. O produto ainda distingue proposta em teste de acordo ativo. Não há promoção para Essência, pontuação ou conversa simulada.

## Requisitos e decisões técnicas
- Ajustar título, descrição, momento e frequência, ou solicitar encerramento. Ajuste sem alteração é rejeitado.
- Prazo de sete dias desde a criação, gerado e conferido pelo banco; unanimidade sozinha não antecipa aplicação. Após ambos, participante confirma explicitamente. Sem tarefa agendada.
- Autor aceita ao enviar; demais envolvidos originais respondem individualmente. Entrada posterior no Núcleo não dá voto nessa revisão. Participante que saiu impede criação/aplicação, sem aceite implícito.
- Uma revisão pendente por Hábito. Travas na ordem Hábito/revisão e índice parcial protegem contra concorrência. As funções revalidam sessão, participação, estado e resposta.
- Recusa conserva o combinado; encerramento muda estado para ended sem apagar histórico. Detalhe e hub mantêm consulta; Registrar momento continua exigindo testing.
- Leitura das solicitações sob RLS (segurança por linha); votos expõem apenas resposta própria. RPC (chamada de função remota) de prontidão retorna booleano agregado, sem expor identidades ou votos de terceiros.
- Histórico de revisão mostra as vinte solicitações mais recentes e informa o limite; dados permanecem no banco. Datas identificadas como UTC. Ajustes mantêm o Hábito em teste, sem confirmação automática como ativo.

## Arquivos e integrações
- supabase/migrations/20261002230000_create_nucleus_habit_revisions.sql: tabelas, índices, políticas, estados e quatro funções autenticadas.
- supabase/tests/nucleus_habit_revisions.sql: autorização, duplicidade, prazo, consenso, recusa, encerramento e preservação de momento.
- src/features/agreements/habit-revision-actions.ts e components/habit-revision-form.tsx: escrita autenticada, entrada, mensagens e estados de envio.
- src/app/nucleos/[id]/acordos/[agreementId]/revisar/page.tsx: combinado atual, proposta, respostas próprias, prontidão e histórico.
- habit-access.ts, detalhe e hub: leitura de encerrados, navegação e restrição de novas gravações.
- tests/habit-revision.spec.ts e scripts/verify-habit-revision-local.mjs: acesso sem sessão e fluxo autenticado local reproduzível.
- README, package.json, package-lock.json, continuidade, plano e Brag: versão, evidências e próximo passo.

## Validações realizadas
- Rota sem sessão falhou antes da implementação em desktop/mobile e passou depois. Contrato SQL falhou antes da função existir e passou depois. Consulta agregada também teve falha anterior à implementação.
- supabase test db: três arquivos aprovados, com uma asserção pgTAP por bloco de verificações; não confundir esse total com número de cenários internos.
- Script autenticado com três contas locais: ajuste pela interface, segunda resposta em celular, recusa, encerramento, histórico preservado, negativa de acesso externo e ausência de transbordamento. Duas criações e duas aplicações simultâneas aceitam exatamente uma operação. Prazo vencido sem consenso não oferece ação e não aplica pela API.
- Nos testes locais, reflect_until foi antecipado administrativamente em dados temporários para verificar o limite; não se esperou sete dias reais. Dados temporários removidos. Captura móvel inspecionada.
- 80/80 testes Playwright completos aprovados após correção; tipos e build de produção aprovados. Conferência final da versão e diff registrada no estado.
- Migração aplicada localmente. No nos-dev, a CLI identificou projeto vinculado, mas duas tentativas de simulação ficaram em Initialising login role; interrompidas sem aplicação pela CLI. Painel autenticado confirmou tabela ausente. Migração e registro 20261002230000 foram executados juntos em transação pelo editor SQL. Histórico remoto usa statements vazio; arquivo versionado é a fonte do SQL. Corpos das quatro funções, normalizados sem espaços/comentários, coincidiram com os locais. Interface autenticada não foi repetida no remoto.
- Revisão independente estática encontrou confirmação oferecida antes de unanimidade. Corrigido com consulta agregada; segunda revisão não encontrou novos achados. Autorrevisão do diff complementar. Revisor não executou testes independentemente.

## Resultado, limitações e próximos passos
Recorte concluído, incremento MINOR 0.9.0 → 0.10.0 pela nova rota e contrato persistente. Sem dependências novas, commit, push ou deploy. A configuração normal usa nos-dev, agora com a migração. Próximo passo: definir confirmação pós-teste e acordo ativo conforme jornada v1.2/modelo v2.4; promoção, progresso, conversa de cuidado e publicação têm critérios próprios.

Conferência após versionamento: tipos/build aprovados na v0.10.0; manifestos alinhados, 90 links locais conferidos e diff sem erro de formatação. Zero Núcleos temporários do verificador local.

[Preparação de publicação Git e continuidade](registro-v0.10.0-2026-10-03-imp-publicacao-git-fun-continuidade-confirmacao.md).
