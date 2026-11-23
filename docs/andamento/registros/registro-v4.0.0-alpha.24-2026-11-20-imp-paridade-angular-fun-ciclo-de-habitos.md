# Registro — v4.0.0-alpha.24 — 2026-11-20 — Imp. da paridade Angular com Fun. de ciclo de Hábitos

**Status:** concluída localmente. Branch codex/migracao-angular, base 51284a0.

**Objetivo e requisitos.** Paridade visual 10, Telas 24–29. Comparar código Next.js 604a142, Angular e Atlas. Preservar permissões, termos por versão, autoria, histórico e rotas. Tela 26 permanece planejada, e a Tela 29 é o contexto de dados legados no mesmo período.

**Decisões técnicas e arquivos.** Em apps/web/src/app/agreements, agreement-detail.ts separa termos, ações e histórico. Habit-moments.ts apresenta a linha do tempo. Habit-moment-editor.ts usa rádios nativos em cartões e associa a visibilidade da nota ao campo. Habit-workspace.ts indica ausência de data sem inferir início. Habit-administration.ts oferece cancelamento com retorno ao acionador. Agreements.css concentra os estilos. Nenhuma biblioteca nova: formulários e diálogos nativos já atendem teclado, toque e acessibilidade sem duplicar a infraestrutura. Reutilizada a consulta Context7 do Angular 22 da paridade anterior, pois não há uso de API nova.

**Integrações e diálogos.** Registrar momento parte da Tela 24 ou da rota direta da Tela 27 e exige aceite vigente. A nota é opcional e compartilhada no Núcleo. Administrar o ciclo parte da Tela 28 e exige administrador e confirmação explícita para iniciar, ativar ou encerrar. Cancelar devolve o foco e conserva o estado. X, Escape e gesto fora seguem o diálogo compartilhado. Nenhuma migração e nenhuma alteração nos serviços de gravação. Atlas atualizado com exemplos locais.

**Validação.** Docker Desktop iniciado para restaurar o Supabase local. Antes: dois testes de ciclo aprovados em computador e celular, com capturas preservadas. Depois: quatro testes Playwright de ciclo e proposta aprovados, incluindo cancelamento, foco, nova versão, legado, concorrência de versão e isolamento. Tipos e build aprovados na alpha.24. Banco: 257 verificações em 13 arquivos. Atlas: verificadores de MVP de Hábitos e Migração, mais demonstração de seleção, aviso de visibilidade e fechamento em 1440 e 390 pixels. Autorrevisão do diff. [Galeria antes e depois](../../wireframes/comparacoes/v4.0.0-alpha.24-2026-11-20-paridade-habitos-tela-24-tela-25-tela-26-tela-27-tela-28-tela-29/index.html).

**Limites e próximo passo.** Parte das telas do Atlas é ilustrativa e não grava dados. O histórico de versões e os demais esboços entram na paridade 11. Não houve publicação nem roteiro de caixa preta novo.
