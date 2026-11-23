# Registro — v4.0.0-alpha.26 — 2026-11-20 — Imp. da paridade Angular com Fun. de prévia de Árvore e Memórias

**Status:** concluída localmente. Branch codex/migracao-angular, base d433b97.

**Objetivo e critérios.** Paridade visual 12 conforme Next.js 604a142 e Atlas. Portar jardim, cartões ilustrados, filtros e detalhe como prévias protegidas. Preservar Telas 39, 42 e 43 como planejamento, sem crescimento calculado, persistência, upload ou mensagens.

**Decisão e arquivos.** NucleusPreview reutiliza a ilustração existente, o componente de ícones, o filtro e o diálogo nativo. O Atlas separa jardim de memórias e permite interagir com os mesmos exemplos. Os dados editoriais ficam no arquivo de prévias e espelhados no Atlas offline. Uma biblioteca de galeria ou gráficos não agrega valor a cartões estáticos e poderia sugerir funcionalidade que ainda depende de contrato. Nenhuma dependência nova. A consulta Angular 22 anterior do Context7 cobre o padrão mantido. Manifestos, guia Migração, fichas e estilos sincronizados.

**Diálogos e integração.** O que está previsto nesta área? explica os limites da prévia. Abrir detalhe da memória, na Tela 40, abre a Tela 41 em diálogo com o exemplo selecionado. Ambos estão disponíveis a integrante com vínculo e fecham por X, Escape e gesto fora. O detalhe não salva ou compartilha a memória. O Atlas ilustra os controles e usa dados de exemplo. Permissões e rotas reaproveitam o serviço existente.

**Validação.** Tipos e build da alpha.26 aprovados. Duas execuções da jornada de prévias antes e duas depois, em computador e celular com Supabase local. Tema Histórias, filtro Pequenos gestos, detalhe correspondente, clique/toque fora e foco confirmados. A mesma jornada verificou acesso permitido e uma conta sem vínculo na rota de prévia. Atlas: Migração, Visão global e interação offline com movimento reduzido, Escape e foco em 1440 e 390 px. Autorrevisão, versões e diff conferidos. Suíte de banco dispensada neste recorte visual com autorização e consultas preservadas. [Galeria](../../wireframes/comparacoes/v4.0.0-alpha.26-2026-11-20-paridade-arvore-memorias-tela-38-tela-39-tela-40-tela-41-tela-42-tela-43/index.html).

**Limites e próximo passo.** Marcos, galeria e gratidão seguem com fichas no Atlas, sem telas Angular próprias. Paridade 13 abrange Conexões e perfis, Telas 44–54. Sem publicação. Sem novos roteiros de caixa preta.
