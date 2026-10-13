# Plano — v0.15.2 — MVP 04: agenda interna

**Status:** concluído localmente; publicação/prova online pendentes. **Data:** 2026-10-13. **Base:** main, 06edf58; Git inicialmente limpo.

**Objetivo autorizado:** auditar as Telas 14, 16, 15 e 17, concluir pendências viáveis, ordenar navegação e reservar ampliações. Usar as skills Superpowers de entendimento, planejamento, TDD, revisão e verificação proporcionalmente ao fluxo existente. Sem commit, push, deploy ou banco remoto.

**Solução:** manter os quatro estados em `/nucleos/[id]/agenda`. Criação, leitura, resposta, edição e remoção usam as funções já existentes. Acrescentar confirmação contextual de remoção, cancelamento sem gravação, feedback de processamento e aviso de remarcação. Preservar participantes originais, visibilidade pelo Núcleo e regra de nova resposta após mudança de horário. Não adicionar tabela, rota ou dependência.

**Aceite:** Agenda14 → Novo16 → Evento15 → Editar17 opcional → Agenda14. Abrir/cancelar remoção conserva evento/respostas; confirmar remove ambos. Alterar texto conserva respostas; remarcação pede nova resposta aos demais. Pessoa sem autoria/papel não gerencia; pessoa externa não consulta/responde. Datas absolutas, fuso visível e validações permanecem.

- [x] Teste autenticado desktop/mobile em `tests/authenticated/calendar.spec.ts`: criar com validação, responder, editar texto/horário, abrir/cancelar/confirmar remoção, verificar SQL e isolamento. Executar antes da implementação para provar falha pela confirmação ausente.
- [x] Componentes em `src/features/calendar/components/` e página agenda: confirmação com título/consequência, checkbox explícito validado na Server Action, botões com estado pending, reserva de futuro e âncoras de navegação. Reexecutar teste.
- [x] Sincronizar `screens.js`, `product-ui.js`, `mvp-plan.js`, `global-view.js`, fichas/cobertura/MVP: duas escolhas de resposta e estado pendente, campos atuais, remarcação e quatro estados da mesma rota. Percurso de agenda sem alterar numeração histórica dos percursos existentes. Capturas antes reais de06edf58 e depois em duas larguras; imagens reais do app autenticado.
- [x] Validar suíte geral, tipos, build, verificadores Atlas, diff e revisão independente. Usar cópia C: para build conforme evidência de limitações do volume G:, comprovando identidade de fontes por SHA-256. Supabase exclusivamente local; limpar fixtures e encerrar ambiente iniciado para testes.
- [x] Após aceite, concluir PATCH0.15.2 nos manifestos, registro versionado, contrato/manual, histórico, brag e estado. Contador104, último marco100. Registrar única unidade pendente de commit.

**Reservas:** visão mensal/dia, recorrência, local estruturado, resposta Ainda não sei, sugestão de horário, seleção individual/visibilidade restrita, notificações, vínculos com acordo/Experiência/conversa, memória e calendário externo. Exigem contratos próprios; não usar botões que simulem persistência.

**Ferramentas:** Superpowers instalado; Context7 Next16.2.9 compatível com padrão de formulários, sem cobertura específica16.3.6 nem atualização de dependência; OctocodeCLI19.1.0 disponível, grafo sintático parcial complementado por leitura local. Primeiro CLI usado com caminho inexistente corrigido pela leitura do manifesto; limite de diretório corrigido com ALLOWED_PATHS do projeto, sem alterar configuração persistente.
