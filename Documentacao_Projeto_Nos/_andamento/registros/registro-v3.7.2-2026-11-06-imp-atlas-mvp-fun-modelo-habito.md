# Registro — v3.7.2 — 2026-11-06 — Imp. de adequação do Atlas e MVP com Fun. de modelo Hábito

**Status:** concluído no planejamento e no Atlas offline; implementação funcional do aplicativo e legado pendentes. **Versão do aplicativo:**3.7.2 preservada. **DOCS_DIR:** Documentacao_Projeto_Nos. **Base Git:** main/e500061, sem alterações locais preexistentes.

## Objetivo, contexto e requisitos

Usuário ampliou o escopo para aplicar a consolidação de Experiência em Hábito no Atlas vivo, MVP e todo planejamento dependente. Atualizar desenhos, fichas, ações, percursos, Visão global, cobertura, contratos e próximos passos; preservar história, participação individual e situações reais de implementação.

## Decisões

- Proposta → Hábito → Essência é o modelo-alvo. Hábito reúne prática, registro, revisão e amadurecimento; eventos organizam ocorrências e momentos guardam o vivido.
- Quadro de Acordos com três colunas e aviso explícito de planejamento: aplicativo ainda conserva categoria legada experience. A revisão não comprova migração, passagem individual ou nova integração.
- IDs34/35 são mantidos como refinamentos planejados de Hábito/Agenda; detalhe24, histórico25 e registro27 são reutilizados. Saídas24→34 e15→35 identificadas como planejadas. Ficha37 oferece Manter como Hábito→24.
- Preservados73 IDs, situações e atribuição única em13 etapas do MVP. Etapa03 recebe requisito/gate de adequação do legado;06 integra agenda/prática;07 trata Hábito→Essência com critérios a definir. Módulos posteriores usam fontes de Hábitos/eventos/momentos.
- Novo contrato operacional central e plano de adequação. Contrato de quatro etapas sinalizado como substituído; protótipo importado, galerias, planos concluídos, resultados e registros históricos preservados.
- A administração/participação atual prevalece sobre votações históricas. Sem novos critérios, prazos, promoção automática ou conversão de dados por inferência.
- Versão mantida: alteração de especificação/ferramenta offline de planejamento, sem entrega funcional do aplicativo, mudança em manifestos, banco ou produção.

## Arquivos e integrações

Atlas: screens.js, product-ui.js, product.css, mvp-plan.js, global-view.js e index.html; verificador verify-habit-model.mjs. As três visões compartilham desenhos/fichas, sem duplicação visual por área.

Documentos: GUIA.md/COBERTURA.md, comparacoes/README.md e galeria com22 imagens; contrato fluxo-proposta-habito-essencia.md e plano modelo-habito.md; MVP, contratos de proposta/administração/agenda/Árvore/modais e notas de precedência em planos históricos relacionados. README do projeto e do andamento, v1.1 conceitual, roteiro manual, estado/histórico/Brag atualizados. [Plano](../planos/modelo-habito.md) · [contrato](../funcionalidades/fluxo-proposta-habito-essencia.md).

## Validações e revisão

- Atlas vivo inspecionado antes da edição, com10 capturas anteriores. Inspeção posterior em computador1440×1000 e celular390×1000,12 capturas posteriores; galeria distingue ausência de nova implementação do aplicativo. Não há capturas do app rotuladas como fluxo novo.
- verify-habit-model.mjs falhou inicialmente pelas quatro colunas, depois passou com73 fichas, três colunas, atribuição única, reuso do registro, saídas24→34/15→35, gate do legado na etapa03, busca, Painéis e cinco estados. Nenhum erro JavaScript ou pedido externo.
- verify-mvp-view.mjs aprovado: cobertura73, fonte compartilhada, navegação, filtros, teclado, hash, impressão e celular.
- verify-global-view.mjs aprovado:73 composições compartilhadas, ações/saídas, atualização dinâmica, teclado, filtros, hash, impressão e celular.
- Autorrevisão e revisão independente review_atlas_habito: dois P2 sobre gate do legado na03 e navegação do roteiro identificados e corrigidos, com regressão específica. Não alegar que revisão offline certifica a aplicação.
- 94 links novos e referências locais da galeria conferidos, sem destino ausente;22 imagens presentes. Comparação com HEAD confirmou73 fichas,39 recortes existentes e34 planejadas, sem mudança de situação. Diff conferido. Build, tipos, suítes do aplicativo e banco não executados: código funcional e dados não alterados. Verificação concentrada em três scripts offline, sem rodada autenticada.
- Oito casos manuais E06-HAB-001–007/E07-HAB-001 criados como Não executados pelo usuário; casos de aplicação dependem da implementação futura. Resultados históricos preservados.

## Resultado, limites e próximo passo

Atlas e planejamento adequados ao modelo de três etapas; passagens, legado, vínculos com agenda e Essência permanecem explicitamente pendentes de implementação. A contagem de fichas não representa contagem de rotas novas nem conclusão do MVP/piloto.

Próximo passo funcional: adequar o MVP03 conforme o plano, começando pelo inventário do legado e definição do mapeamento/recuperação, preservando pendências operacionais do roteiro geral. Critérios das duas transições exigem decisões específicas antes de implementar; nenhuma migração remota autorizada por esta entrega.

## Ferramentas e publicação

Superpowers de entendimento, planejamento, regressão, revisão e verificação. Context7 consultado para Playwright1.63.0 (captura, locators e execução de navegador). Octocode não exposto; buscas estruturadas locais por arquivos/termos foram suficientes, sem pesquisa avançada de dependências ou instalação. Node.js e Playwright locais. Nenhum commit/push/deploy nesta entrega.

Uma unidade pronta para commit: adequação do Atlas/MVP/planejamento ao modelo Hábito com contratos, testes e evidências. Sugestão: docs(atlas): alinhar MVP e planejamento ao modelo Habito.

[Galeria de antes/depois](../../wireframes/comparacoes/v3.7.2-2026-11-06-modelo-habito-tela_18-tela_34-tela_35-tela_37/index.html) · [casos manuais](../testes-caixa-preta/modelo-habito.md).
