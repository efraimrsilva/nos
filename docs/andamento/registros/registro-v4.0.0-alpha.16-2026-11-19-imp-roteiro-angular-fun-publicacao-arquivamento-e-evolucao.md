# Registro — v4.0.0-alpha.16 — 2026-11-19 — Imp. do roteiro Angular com Fun. de publicação, arquivamento e evolução

**Status:** roteiro documentado e validado no Atlas. Next.js v3.11.1 e prévia Angular v4.0.0-alpha.16 preservados.

**Objetivo e requisitos.** Reaproveitar a migração existente. Completar a paridade, publicar e verificar o Angular e arquivar o Next.js em uma pasta própria antes de avançar com as outras fases. Colocar as entregas 13 e 14 juntas na fase web e denominar a 14 Arquivamento do Next.js.

**Decisões.** Preservar os identificadores A01–A14 e os 16 passos visuais. O destino planejado é `arquivo/nextjs/`. A cópia fica disponível para consulta com commit e deploy de referência. Os utilitários ativos serão separados antes da mudança. Depois da fase 1, organizar com Nx e portar um fluxo com NestJS mantendo Supabase Auth. Fechar a decisão sobre JWT próprio em fase separada. A fase 4 valida WebSocket e depois Capacitor em Android e iOS. Vitest ou Jest será escolhido no primeiro recorte da fase 2.

**Arquivos e integrações.** A [guia Migração](../../wireframes/atlas/index.html#migracao) apresenta as fases e seus critérios. O [plano detalhado](../planos/migracao-angular.md#ordem-de-implementação) reúne os passos para cada fase. O mapa de fontes e o roteiro do Netlify preservam a dependência entre paridade, ensaio, publicação, retorno e arquivo. O guia, o estado e o histórico apontam para a decisão vigente.

**Validação e resultado.** O verificador Playwright da guia passou em 1440 e 390 pixels. Conferiu a ordem das fases, 13 e 14 dentro da fase 1, os 16 passos e 73 fichas, teclado, navegação, reabertura por endereço direto, impressão e ausência de erros de execução. [Comparação antes/depois da guia](../../wireframes/comparacoes/v4.0.0-alpha.16-2026-11-19-guia-migracao/index.html).

**Limites e próximo passo.** Nenhuma virada, migração de banco ou movimentação do Next.js ocorreu nesta entrega de roteiro. Retomar as telas 06–09 do passo 04 e completar a paridade até o passo 16. Os envios hospedados, a renovação de sessão e o ensaio de retorno continuam pendentes para a virada.
