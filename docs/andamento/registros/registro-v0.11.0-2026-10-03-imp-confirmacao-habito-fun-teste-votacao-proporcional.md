# Registro — v0.11.0 — 2026-10-03 — Imp. de confirmação do Hábito com Fun. de teste e votação proporcional

**Versão:** 0.11.0. **Status:** concluído, revisado e validado; commit conferido; publicação Git autorizada em 2026-10-03. **Impacto:** MINOR pela nova rota e ciclo de vida compatível.

## Objetivo, contexto e requisitos

Completar a sequência de Hábito em teste para ativo, antes sem prazo persistido. O usuário autorizou implementação e substituiu unanimidade da confirmação pós-teste para evitar gargalo por respostas esquecidas; pediu um terço acima de 150 pessoas e orientações na interface. Duração explícita de 7 a 30 dias, início no último aceite inicial, legado sem retroatividade, privacidade, histórico e confirmação transacional.

## Decisões técnicas

N é a fotografia dos participantes originais da proposta: floor(N/2)+1 até 150, ceil(N/3) acima de 150. Campo gerado no banco guarda o limiar de cada ciclo. A entrada inicial no teste, configuração do legado, ajustes e encerramentos mantêm unanimidade. A ausência de resposta não é Sim; o voto que alcança o limiar ativa, depois do prazo. Participante posterior consulta sem votar. Saída de participante original bloqueia, sem diminuir N.

Ciclos e respostas preservam datas e versões do combinado. Funções autenticadas validam associação e bloqueiam primeiro o Hábito para serializar confirmação/revisão. RLS (segurança por linha) limita ciclos ao Núcleo e votos à própria pessoa; prontidão expõe apenas agregados. Escrita direta e helper privado não são acessíveis a authenticated. Revisão pendente impede confirmação. Ajustar testing/active abre novo teste da mesma duração sem reutilizar votos; encerramento preserva histórico e impede momentos.

Legado não usa created_at como início: duração proposta explicitamente e aceita por todos abre ciclo novo. Não há migração retroativa de datas. Histórico paginado por created_at e id, com cursor validado como unknown. A interface usa o estado calculado pelo banco; o relógio sozinho não ativa nada.

## Arquivos e integrações

- Banco: supabase/migrations/20261003120000_create_nucleus_habit_trials.sql; testes nucleus_habit_trials.sql, nucleus_habit_trial_thresholds.sql e fixtures anteriores.
- Regras/ações: src/features/agreements/habit-trial-input.ts, habit-trial-actions.ts; integração em actions.ts, habit-access.ts e ações de momentos/revisões.
- Interface: /nucleos/[id]/acordos/[agreementId]/confirmar/page.tsx; habit-trial-form.tsx e habit-consent-guidance.tsx; proposta, hub, detalhe, registrar e revisar.
- Verificação: tests/habit-trial.spec.ts; scripts/verify-habit-trial-local.mjs; script de revisão atualizado; next.config.ts isola .next-verify do servidor do usuário.
- Documentação: fontes afetadas v1.1/v1.2/v1.3 e v2.0 a v2.8, README, andamento, frontend, Brag e manifestos. Fontes v1.4 a v1.10 sem regra afetada permanecem preservadas.

## Validações e revisão

TDD (desenvolvimento orientado por testes): validação de duração/rota falhou antes da implementação e passou depois; limiar antigo de 151 falhou antes do ajuste para um terço. Banco: cinco arquivos aprovados com asserções de prazo, escrita direta, isolamento, respostas próprias, legado, saída/entrada, revisão, histórico, metade insuficiente e ativação. Fixtures de 150/151 exigiram respectivamente 76/51, sem ativação no voto anterior.

84/84 testes Playwright desktop/mobile; npm.cmd run typecheck e npm.cmd run build aprovados. Jornada local com cinco contas verificou criação pela interface, aceite, prazo, concorrência, maioria 3/4, visitante, entrada posterior, active, momentos, ajuste e legado; layout móvel sem overflow. Dados temporários removidos e servidor de validação encerrado.

Autorrevisão do diff e revisão independente: corrigidos aviso de reinício do teste após ajuste, âncora da regra canônica e limpeza que poderia deixar servidor de teste ativo em falhas. Nenhuma revisão independente alegada além do agente efetivamente utilizado.

Migração aplicada localmente e no nos-dev pelo editor SQL, em transação com histórico. A CLI remota ficou em Initialising login role; processo específico encerrado e alternativa executada. Comparação das 13 assinaturas/corpos normalizados locais e remotos sem diferenças; duas políticas e ausência de privilégio direto no helper conferidas. Interface autenticada não foi repetida remotamente.

## Resultado, limitações e próximo passo

Hábito pode ficar ativo com concordâncias suficientes após prazo real; orientações explicam quantidade, pendências e exceção. O benefício de evitar espera por todos decorre da regra; não houve medição de tempo de aprovação em uso real. Fixtures numerosas não são ensaio de desempenho.

Commit e push autorizados posteriormente em 2026-10-03 e tratados no registro de publicação; deploy continua fora da autorização. Publicação pública, promoção para Essência, pontuação, reflexões e conversas de cuidado exigem escopos próprios. Próximo passo executável: definir contrato de dados da Tela 07 — Nossa Árvore com catálogo v2.1, impacto v1.4 e marcos v1.6 antes de desenhar indicadores como integração real.

**Conferência final da v0.11.0:** tipos e build repetidos após manifestos; git diff --check aprovado na configuração real do repositório; 491 links locais e suas âncoras sem alvo ausente. Revisão independente de confirmação aprovou as correções e indicou cabeçalho documental P3, corrigido e conferido. Sem achados materiais remanescentes.
