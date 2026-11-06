# Registro — v3.8.0 — 2026-11-06 — Imp. de Acordos com Fun. de modelo Hábito

**Status:** concluído localmente no recorte autorizado; limitação preexistente da suíte ampla de banco registrada abaixo. **Versão:**3.8.0, incremento MINOR pela adequação funcional compatível. **DOCS_DIR:** Documentacao_Projeto_Nos. **Git:** feat/modelo-habito, base main/331d224, início limpo. Sem commit, push, migração remota ou deploy.

## Objetivo, contexto e requisitos

Aplicar ao sistema a consolidação documental de Experiência em Hábito. Releitura das19 edições conceituais,23 contratos,16 planos,136 registros históricos,16 documentos de caixa preta, guias do Atlas, README, Brag e continuidade; protótipos/galerias antigos preservados. Atlas vivo inspecionado antes da alteração. As diretrizes atuais prevalecem sobre históricos de quatro etapas e votação.

O usuário esclareceu que Essência e passagens devem continuar somente como esboços, com o mesmo informe de Manifesto. Essa orientação substituiu a necessidade de fechar critérios de evolução nesta entrega; não foram inventados prazo, limiar, elegibilidade ou promoção.

Aceite: Propostas/Hábitos/Essência planejada no quadro, mesmos registros em Painéis/lista móvel, nenhuma categoria pública de Experiência, leitura e momentos do legado no Hábito comum, preservação de termos/aceites/histórico, aviso explícito e prévia sem escrita, Atlas coerente.

## Decisões técnicas e integrações

- Compatibilidade aditiva, sem conversão física dos acordos: registros antigos conservam `experience` no armazenamento; sua apresentação e acesso usam Hábito. Não alterar categoria, IDs, termos, versões, datas, autoria ou participações evita redefinir consentimentos e mantém versões anteriores legíveis. Não inferir estágio individual de uma categoria global.
- `agreementColumn` reúne todo acordo não pendente em Hábito; pendentes seguem Proposta. Grid tem três colunas, setas decorativas preservadas. Lista móvel e Painéis usam o mesmo contrato; busca continua limitada aos registros carregados.
- `loadHabitContext` permite os dois valores técnicos, mantendo consulta por acordo/Núcleo, vínculo, sessão e estados permitidos. Links de detalhe/momentos não excluem mais o legado. Redirecionamentos atuais usam categoria habit; URLs antigas continuam aceitas.
- Parser público aceita somente habit. Criação do formulário continua habit/pending e exige teste inteiro de7–30dias. A RPC conserva as assinaturas antigas, mas normaliza argumento experience para habit; clientes antigos sem prazo conservam duração nula, sem fabricar datas. Publicar não aceita por ninguém.
- A função de momentos inclui o legado na mesma tabela e mantém bloqueio transacional, Núcleo aberto, vínculo atual, mesmo acordo/Núcleo, testing/active e aceite próprio da versão vigente. Uma recusa/saída não encerra o acordo; termos novos continuam exigindo aceite novo.
- `EssenceSketch` reutiliza `FeatureSketchNotice`, com título e texto exatos de Manifesto. Coluna, lista móvel e Painéis abrem modal “Nossa Essência” pelo gatilho “Ver esboço de Essência”. Frase ilustrativa, sem formulário de promoção ou escrita. `ActionDialog` mantém X, Escape, clique/toque fora e retorno de foco. Nenhuma rota nova.
- Atlas usa as mesmas três colunas, informe e modal; ficha36 identifica a prévia real, sem promover funcionalidades futuras. Mesmos73 IDs,39 recortes existentes/34 planejados e13 etapas. Fichas34/35 continuam planejamento de integração Hábito/Agenda, reutilizando24/25/27.
- Categoria técnica, situação operacional e evolução individual permanecem separadas. Eventos, recorrência, fotos, reflexões, memórias e promoção funcional não foram implementados por consequência da troca de nomenclatura.

## Arquivos alterados

- Aplicativo: páginas de Acordos e detalhe; `agreement-presentation.ts`, `agreements-workspace.tsx`, novo `essence-sketch.tsx`, `habit-access.ts`, `proposal-input.ts`, `actions.ts`, `administration-actions.ts`, estilos de Acordos/temas.
- Banco: `supabase/migrations/20261106123120_consolidate_habit_compatibility.sql`, recuperação correspondente em `supabase/rollback/` e14 casos em `supabase/tests/habit_model_compatibility.sql`.
- Testes: `layout-agreements.spec.ts`, `agreement-input.spec.ts`, novo `authenticated/habit-model.spec.ts`; regressões existentes reutilizadas.
- Atlas: `product-ui.js`, `screens.js`, `mvp-plan.js`, `index.html`, `tools/verify-habit-model.mjs`; guias/cobertura/galeria.
- Manifestos3.8.0, README, contrato vigente, planos, modais, administração/propostas, roteiro/resultados manuais, estado/histórico e Brag. Edições conceituais e registros históricos não reescritos.

## Migração, ambiente e recuperação

Inventário inicial local: zero acordos. Cenários criados somente como fixtures descartáveis. Nenhuma consulta a dados remotos. Docker inicialmente desligado, aberto para testes; executores encerram seus servidores e limpam contas/Núcleos temporários.

`supabase migration up --local` identificou divergência anterior: arquivos20261024120000,20261027173526 e20261028175254 ausentes no histórico local. Não usar include-all, reset ou reparo presumido. Somente a nova migração foi aplicada por psql em transação, junto do registro20261106123120 em schema_migrations; nenhuma entrada histórica antiga foi modificada. Conteúdo real das funções conferido por execução.

As duas definições anteriores foram salvas em `supabase/rollback/20261106123120_consolidate_habit_compatibility.sql`. Recuperação ensaiada em transação descartada: funções anteriores restauradas, definição conferida e rollback realizado; comparação confirmou definições novas intactas no final. O arquivo não modifica dados nem histórico de migrações. Recuperação operacional exige ambiente confirmado e aplicativo compatível; após publicação, preferir migração corretiva versionada, sem executar migração histórica inteira ou marcar migração como desfeita por inferência.

Ordem de futura publicação: revisar/aplicar a migração de funções no ambiente confirmado antes de disponibilizar o aplicativo novo. A migração é compatível com clientes antigos; publicar só o código deixaria momentos legados sujeitos à negativa da função antiga. Essa etapa remota não foi executada nem está implicitamente autorizada por esta implementação.

## Validações e revisão

- Regressões antes da correção: agrupamento/parser falharam conforme esperado; teste SQL teve3 falhas de14, incluindo negativa de momento legado e criação antiga persistindo experience. Primeiro percurso autenticado falhou por quatro colunas/rótulo antigo; capturas anteriores preservadas.
- Quatro testes unitários aprovados: entrada, busca/agrupamento e ação de criação com categoria adulterada. Execução direcionada de Playwright sem servidor para esses casos puros.
- `npm run typecheck` aprovado na versão3.8.0.
- `npm run build -- --webpack` com NOS_LOCAL_VERIFY=1 aprovado na versão3.8.0, usando saída isolada .next-verify. Build de produção das cópias autenticadas também aprovado; fontes/recursos conferidos por SHA-256, backend somente local.
- `npm run test:authenticated -- habit-model.spec.ts habit-proposal.spec.ts`:8 testes finais aprovados, desktop/mobile. Cobrem quadro/lista/Painéis, busca/vazio/retorno, modal de Essência/Escape, registro legado pelo acesso direto, um momento no histórico, dados antigos preservados, criação sem categoria e registros consecutivos. Larguras320/390/768/1440 verificadas no novo percurso, sem overflow horizontal.
- `habit-cycle.spec.ts`:2 regressões aprovadas durante a implementação, com gestão, duas pessoas, novos termos/aceite e histórico preservado. Essas evidências são distintas da rodada final8 e não representam execução de toda suíte autenticada.
- Primeira rodada nova chegou à gravação/leitura, mas falhou por seletor de status ambíguo no teste. Delimitação corrigida;2 testes passaram e depois integraram a rodada final8. Falhas/retestes preservados na descrição, sem aprovação manual inferida.
- Checagem dirigida posterior do novo modal:2 testes desktop/mobile aprovados com fechamento por X, Escape e clique/toque fora. O comportamento usa o listener global existente. Capturas futuras do teste vão por padrão para artifacts/regression-captures/habit-model; NOS_HABIT_GALLERY permite escolher explicitamente uma galeria de entrega, sem sobrescrever históricos por padrão.
- Nova suíte SQL:14 verificações aprovadas;9 arquivos funcionais da suíte ampla somaram198 asserções aprovadas. O arquivo email_confirmation.sql abortou antes de seus casos por ausência preexistente de get_email_confirmation_status. Suíte completa de banco **não está integralmente aprovada**; não corrigir autenticação silenciosamente nesta entrega.
- Três verificadores offline aprovados: modelo Hábito, MVP e Visão global;73 composições/IDs íntegros, cobertura única, navegação, filtros, teclado, estados, celular e impressão; nenhum erro JavaScript ou pedido externo no Atlas.
- Autorrevisão do diff e revisão independente de código/migração/testes, sem achados acionáveis no recorte. Revisão independente não executou testes nem certificou aspectos operacionais. Conferência final de documentação/links e galeria realizada separadamente.
- Revisão final identificou dois P3 editoriais no Atlas (aviso geral e feature MVP03 ainda pendentes); corrigidos e três verificadores aprovados novamente. Apontamento inicial sobre fechar fora retirado após conferir a integração global. Conferência local:28 referências Markdown novas e23 imagens sem destino ausente, versões coerentes e filtros Antes/Depois da galeria aprovados, sem erro JavaScript. O índice de comparações acrescenta a referência desta galeria.
- Inspeção visual real em desktop/celular; novo modal sem composição anterior própria. [Galeria](../../wireframes/comparacoes/v3.8.0-2026-11-06-modelo-habito-tela_18-tela_24-tela_36/index.html). Atlas usa exemplos offline e difere em dados/quantidade de cartões; não é comparação pixel a pixel.
- Executores de teste emitiram avisos NO_COLOR/FORCE_COLOR e mensagens “destination stream closed early” ao encerrar algumas navegações; casos correspondentes concluíram com sucesso e nenhuma alteração fora do recorte foi feita para ocultar os logs.

## Resultado, limites e próximos passos

Aplicativo local consolidado em Hábito e Essência explicitamente esboçada, com dados legados preservados. Testes manuais continuam Não executados pelo usuário; resultados técnicos não os aprovam. Sem prova de produção/piloto completo ou novos critérios de evolução. Sem commit, push ou deploy.

Próximo passo: revisar galeria e executar E06-HAB-005/006 e E07-HAB-001 no ambiente desejado; registrar cada resultado. Para publicação futura, aplicar primeiro a migração de funções conforme autorização específica. A divergência histórica de migrações/consulta de e-mail local é uma pendência própria. Conversão física de experience, integração com eventos e evolução individual dependem de decisões futuras.

Uma unidade pronta para commit: adequação de Acordos em Hábito, esboço de Essência, compatibilidade/recuperação, testes, Atlas e documentação. Sugestão: `feat(acordos): consolidar Experiência em Hábito e sinalizar Essência como esboço`.

## Ferramentas e continuidade

Superpowers de entendimento, planejamento proporcional, TDD, depuração, revisão e verificação; agentes para releitura e revisão independente somente. Context7: Supabase CLI2.118.0 e React19.3.0, versões do projeto. Octocode19.1.0 configurado, mas sem ferramenta exposta na sessão; rg/Node usados em pesquisas locais precisas, sem instalação ou pesquisa avançada de dependências. Changelog Supabase tentou acesso, mas ferramenta web rejeitou content-type Markdown; documentação oficial versionada da CLI consultada via Context7, sem mudança de API dependente de changelog. Sem métricas de economia de tokens presumidas.

Contador adicional:28 conclusões desde29/10; lacuna histórica e último marco auditado100 preservados. [Estado](../estado.md) · [Plano](../planos/adequacao-aplicativo-habito.md) · [Contrato](../funcionalidades/fluxo-proposta-habito-essencia.md) · [Roteiro](../testes-caixa-preta/modelo-habito.md).
