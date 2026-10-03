# Planejamento — 2026-10-03 — Wireframe completo do Projeto Nós

**Status:** material visual produzido e verificado; decisões futuras de produto continuam sujeitas à revisão. **Referência funcional:** v0.11.0, sem nova versão de desenvolvimento por solicitação expressa do usuário. Registro de planejamento, não entrega funcional.

## Objetivo, contexto e requisitos

Antes de Nossa Árvore, criar um guia visual para todo o desenvolvimento, começando em Conta e sinalizando telas pendentes. Base: catálogo com 37 interfaces, fluxo original, documentação v1.x/v2.x e implementação atual. Diretório Git inicialmente limpo em `main`, HEAD `e3643b6`.

## Escopo e decisões

- Atlas offline com 72 desenhos de telas/estados, oito áreas e 12 percursos. As 37 origens estão mapeadas; abas, continuações e formulários não exigem rotas individuais.
- Conta é Tela 01 do material. Entrada afetiva é opção 72. Aplicativo atual continua com `/` → `/comecar`; não houve mudança de rota nesta tarefa.
- 45 telas planejadas; 27 recortes existentes com limites individuais. Propostas de composição não são alegadas como implementação concluída.
- Contratos da v0.11.0 prevalecem sobre números antigos do protótipo. Sem crescimento fictício, promoção automática, votos alheios ou chat livre.
- Arquivos independentes de React/Next.js, sem acesso a serviços, nova dependência ou instalação. Fontes e árvore locais; licenças preservadas.

## Arquivos e integrações

Página, estilos, interações, inventário e recursos em [atlas](../../wireframes/atlas/index.html). [Guia](../../wireframes/GUIA.md) explica uso, contratos, decisões e próximos passos. [Cobertura](../../wireframes/COBERTURA.md) contém inventário integral, mapa de origem e pendências. README, estado, histórico e Brag recebem referências. Código do aplicativo, migrações e manifestos não são alterados.

## Validação e revisão

Verificação com Playwright do artefato: IDs/destinos íntegros; todas as 37 origens cobertas; 72 prévias e suas saídas; 360 estados visuais; busca, filtros, teclado, 12 percursos, modo web e impressão CSS; ausência de transbordamento horizontal a 375 px; nenhum erro JavaScript. Inspeção de capturas do atlas, Conta e celular. Sintaxe dos scripts conferida com `node --check`. Inventário gerado somente após verificação aprovada. Diff e links locais conferidos ao encerrar.

Revisão independente por subagente leu o artefato e confrontou contratos: navegação principal em telas focadas e caminho de desejos alheios para formulário próprio foram apontados e corrigidos; revisor reconferiu ambos sem achado remanescente nesses ajustes. A edição de evento permite autoria ou papel criador conforme banco atual; catálogo de tipos alinhado aos nove tipos reais. Conferência final: 92 links locais válidos; whitespace dos quatro arquivos novos do atlas e diff rastreado aprovados. Manifestos sem diff. Prévia local respondeu HTTP 200; abertura no painel do Codex solicitada.

## Limitações e ferramentas

É um wireframe navegável, não um app integrado. Exemplos não enviam e-mails, salvam dados, votam ou removem associações. Estados são padrões para revisão, não todas as combinações de negócio. Modo web é uma proposta de distribuição, não especificação final de cada tela. Nenhum PDF foi exportado; impressão foi verificada por CSS.

Superpowers: entendimento/brainstorming, revisão e verificação aplicados proporcionalmente. A própria tarefa é a produção de material para revisão, sem implementação de novo módulo do produto. Context7 disponível, sem necessidade de consulta: não houve geração dependente de biblioteca/framework nem mudança de configuração. Octocode MCP não está exposto; tarefa não exigiu pesquisa avançada entre repositórios/dependências. Buscas locais delimitadas confrontaram catálogo, rotas e regras; nenhuma instalação necessária.

## Resultado e próximo passo

Guia completo disponível para revisão; pendências visíveis por tela e no inventário. Versão funcional preservada. Próximo passo: revisar wireframe com o usuário, ajustar decisões e depois fechar contrato da Árvore antes de implementar. Unidade documental local pronta para commit, sem autorização de commit/push/deploy nesta tarefa.
