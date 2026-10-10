# Comparações de telas — procedimento permanente

Referência funcional atual: **v0.13.3**. Procedimento definido em 2026-10-07.

Toda criação ou alteração de tela, navegação, dados, regra ou estado deve acrescentar evidências nesta pasta no mesmo conjunto lógico da entrega. Preservar galerias anteriores; não sobrescrever suas imagens para simular continuidade. Consultar o [procedimento completo](../GUIA.md#visão-global-sincronização-e-comparações--procedimento-permanente).

## Galerias

- [2026-10-10 — Percurso 04 Entrar por convite — v0.13.3](v0.13.3-2026-10-10-entrar-convite-tela_10-tela_11/index.html): tipo, adiamento e retorno sem associação, composição real desktop/celular, sequência e reservas futuras; códigos mascarados.

- [2026-10-09 — Percurso 03 Recuperar acesso — v0.13.2](v0.13.2-2026-10-09-recuperar-acesso-tela_04-tela_05/index.html): etapas de login, retorno ao estado correto de Conta, callback validado, telas reais e dependência Gmail SMTP explícita.

- [2026-10-07 — Alinhamento visual de Conta — v0.13.1](v0.13.1-2026-10-07-conta-alinhamento-tela_01-tela_02/index.html): antes/depois das abas, árvore/frases estáveis, link inferior removido e Atlas sincronizado.

- [2026-10-07 — Sessão e sequência](v0.13.0-2026-10-07-sessao-navegacao-tela_01-tela_06-tela_12-tela_13/index.html): bloqueio antes/depois, Tela12 planejada/viva/real, Conta autenticada, Escolher caminho e retorno do Início.

- [2026-10-07 — Conta e entrada](v0.12.0-2026-10-07-conta-entrada-tela_01-tela_02-tela_03-tela_04-tela_05-tela_72/index.html): composição anterior, Atlas vivo e aplicativo das telas 01–05 e 72.
- [2026-10-07 — Visão global](v0.12.0-2026-10-07-visao-global-tela_01-a-tela_72/index.html): navegação antes/depois e nova visão em web/celular. Alteração exclusiva da ferramenta de documentação; não existe uma rota equivalente no produto.

## Evidência mínima de cada entrega

**Nome obrigatório das novas pastas:** `v<versão>-AAAA-MM-DD-assunto-tela_<número>`, na ordem **versão-data-assunto-tela**. O identificador deve ser escrito literalmente com o prefixo `tela_`, seguido do número da tela no atlas com pelo menos dois dígitos. Usar a versão vigente do projeto registrada em `Documentacao_Projeto_Nos/_andamento/estado.md`, com os três números e o prefixo `v`. Exemplo: `v0.13.3-2026-10-10-entrada-convite-tela_10`.

A data identifica a entrega/comparação; o assunto deve ser curto, em minúsculas, sem espaços ou acentos, com palavras separadas por hífens. Para uma galeria que abranja várias telas, identificar cada uma no final, em ordem numérica: `v0.13.3-2026-10-10-entrada-convite-tela_10-tela_11`. Usar os IDs reais do atlas, sem criar outra numeração.

Quando a galeria cobrir uma faixa completa e contínua, pode compactar os identificadores como `tela_01-a-tela_72`, declarando a cobertura no index.html. Essa forma é usada pela comparação da ferramenta Visão global, que reúne todas as 72 telas, sem atribuir à ferramenta um ID fictício de tela do aplicativo. Não usar faixa para incluir telas que não pertençam à comparação.

Se já existir uma pasta com a mesma versão, data, assunto e telas, acrescentar `revisao-02`, `revisao-03` e assim por diante ao assunto, antes dos identificadores das telas; exemplo: `v0.13.3-2026-10-10-entrada-convite-revisao-02-tela_10`. Não sobrescrever a anterior. Se a entrega incrementar a versão funcional ao ser concluída, ajustar o nome da pasta para a versão final da entrega e atualizar todos os links, scripts e registros que a referenciam antes de concluir.

Esta diretriz foi acrescentada e ampliada em 2026-10-10. Por autorização posterior do usuário na mesma data, as seis galerias existentes também foram renomeadas e suas referências atualizadas; imagens e conteúdo histórico foram preservados. Cada pasta histórica usa a versão da entrega que documenta, sem reclassificar capturas antigas como atuais. Para novas galerias, usar a versão da respectiva entrega. Criar ou editar documentação/comparações, por si só, não incrementa a versão do projeto.

Incluir index.html navegável, imagens locais legíveis, versão vigente, IDs/rotas afetados, diferença descrita, estados/larguras conferidos e limitações. Relacionar a galeria ao registro de andamento e a este índice.

- **Tela alterada:** capturar a composição anterior antes de editar; apresentar depois, Atlas vivo e aplicativo real, quando a rota existir.
- **Tela criada:** declarar que não havia composição/rota anterior. Comparar referência aprovada, nova composição viva e aplicativo real, quando implementado.
- **Tela planejada:** identificar a ausência de integração/rota; nunca substituir captura do aplicativo por imagem do protótipo com rótulo de produto implementado.
- **Mudança de comportamento:** evidenciar o estado atingido e explicar a diferença, mesmo se a aparência dos elementos principais permanecer igual.
- **Ferramenta do atlas:** comparar a ferramenta antes/depois e demonstrar que as prévias compartilhadas continuam iguais às outras visões. Não fabricar uma tela correspondente do app.

Capturas devem usar exemplos sem informações privadas, tokens ou códigos reais. Fluxos autenticados precisam de ambiente/fixtures autorizados e limpeza conforme o contrato. Verificação sem autenticação não comprova integrações protegidas.
