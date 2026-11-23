# Registro — v4.0.0-alpha.25 — 2026-11-20 — Imp. da paridade Angular com Fun. de termos e versões de Hábitos

**Status:** concluída localmente. Branch codex/migracao-angular, base 78ee422.

**Objetivo e escopo.** Paridade 11, Telas 30–37. Usar o Next.js 604a142 e o Atlas como referências para revisão e histórico. Preservar autorização, consentimento por versão, rotas, dados e limites das funcionalidades planejadas.

**Arquivos e decisões.** Habit-terms-history.html mostra a versão vigente, agrupa momento e frequência na edição e diferencia versões no histórico. Agreements.css aplica a hierarquia em computador e celular. Agreement-detail.ts explicita que registrar momentos não promove o Hábito. Reutilizados o formulário, diálogo nativo e serviços Angular existentes. Avaliadas as opções de componentes prontos para formulário e histórico. As primitivas existentes já atendem ao recorte e evitam novos custos de manutenção. Nenhuma dependência nova. A consulta Context7 da linha Angular 22 permanece aplicável, pois não foi adotada API nova.

**Integrações e diálogos.** Alterar termos é administrativo, exige ciência e parte da versão aberta. Cancelar, X, Escape e clique/toque fora fecham a edição. Publicar preserva versões e momentos e pede novo aceite individual. Encerrar acordo mantém a confirmação administrativa existente. Nossa Essência abre por Ver esboço de Essência e só explica os limites da prévia. Atlas demonstra edição e cancelamento localmente. Sem mudança de contrato nem migração de banco.

**Validação.** Tipos e build da alpha.25, Playwright em computador e celular com duas contas locais, 257 verificações em 13 arquivos do Supabase local, verificadores do MVP de Hábitos e guia Migração. Conferência anterior capturada com a versão de base. O teste autenticado cobre cancelamento, retorno de foco, descarte do rascunho, versão vigente e anterior, novo aceite, bloqueio de versão antiga e histórico após encerrar. Conferência visual e autorrevisão do diff. [Galeria](../../wireframes/comparacoes/v4.0.0-alpha.25-2026-11-20-paridade-termos-tela-30-tela-31-tela-32-tela-33-tela-34-tela-35-tela-36-tela-37/index.html).

**Limites e próximo passo.** Telas 34, 35 e 37 planejadas. A Tela 36 tem diálogo informativo, sem persistência ou promoção. Sem publicação ou roteiro de caixa preta novo. Paridade 12 começa na Árvore e Memórias, Telas 38–43.

**Reteste.** A primeira execução após a alteração passou nas duas jornadas de proposta e falhou nas duas de ciclo porque uma asserção ainda buscava o rótulo antigo. O teste passou a consultar a região Termos vigentes e a versão esperada.
