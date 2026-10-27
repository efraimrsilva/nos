# Comparações de telas — procedimento permanente

**Entrega local — v3.1.2 — 27/10/2026:** [Confirmação de e-mail](2026-10-27-confirmacao-email/index.html): 14 capturas de modais do aplicativo com transporte simulado e quatro do Atlas, desktop/celular. Confirmado, pendente, ausência e falhas; comparação pública histórica preservada. Publicação e migração remota pendentes.

**Galeria vigente — v3.0.1:** [árvore da Conta](v3.0.1-2026-10-20-conta-arvore/index.html), nove prints com antes/depois em1440/390px, depois em640px e Atlas01/02. Somente telas; nenhum modal criado ou alterado.

**Entrega vigente — v3.0.0:** [Layout novo integral](v3.0.0-2026-10-18-layout-novo-integral/index.html). 170 capturas do aplicativo (85 modais, 27 rotas autenticadas, sete páginas públicas e larguras de 390/640/768/1024/1440 px), 176 do Atlas (86 telas/contextos e 90 modais), 40 da referência e 20 anteriores: 406 imagens e 20 comparações por área/dispositivo. Modais têm título, gatilho e origem no manifesto; a captura é recortada no diálogo. Cada modal identifica título, gatilho e origem; filtre **Modal** para consultar também os diálogos do Atlas e da referência. Preservar versões anteriores sem substituir seus arquivos. [Contrato permanente](../../_andamento/funcionalidades/modais-interface.md).

**Galeria histórica: v1.1.0.** [Encerramento administrativo — 15/10/2026](v1.1.0-2026-10-15-encerramento/index.html): Atlas73 e MVP05 antes/depois, aplicativo autenticado em desktop/celular. Exemplos temporários locais; sem dados reais de produção.

**Galeria histórica: v1.0.1.** [Árvore opcional — 15/10/2026](v1.0.1-2026-10-15-arvore/index.html): 20 capturas Atlas antes/depois e 12 imagens reais de acesso em três larguras.

- [v0.16.0 — MVP05 controles e orientação](v0.16.0-2026-10-13-mvp-05-tela_66-tela_67-tela_69-tela_70-tela_71/index.html): cinco telas novas e entradas12/13; antes/depois Atlas desktop/mobile, app autenticado com exemplos locais. Sem app anterior às novas rotas. Saída efetiva permanece planejada.

**v0.15.2 — MVP04 — 2026-10-13:** [galeria](v0.15.2-2026-10-13-mvp-04-tela_14-tela_16-tela_15-tela_17/index.html):26 capturas, Atlas14/16/15/17 antes/depois e MVP desktop/mobile, app real edição/confirmação/vazio com reservas. Antes06edf58; fixtures locais limpas. Script `scripts/capture-mvp-agenda-atlas.mjs` e testes autenticados de agenda.
Referência funcional histórica desse marco: **v0.16.0**. Procedimento definido em 2026-10-07.

Toda criação ou alteração de tela, navegação, dados, regra ou estado deve acrescentar evidências nesta pasta no mesmo conjunto lógico da entrega. Preservar galerias anteriores; não sobrescrever suas imagens para simular continuidade. Consultar o [procedimento completo](../GUIA.md#visão-global-sincronização-e-comparações--procedimento-permanente).

## Galerias

- [2026-10-12 — MVP aprovado — v0.14.0](v0.14.0-2026-10-12-mvp-atlas-tela_01-a-tela_72/index.html): antes real da ferramenta sem MVP e depois do roteiro aprovado, com seis amostras em computador/celular. A dispensa de comparação valia apenas para a criação inicial; aprovação e documentação retomam o procedimento permanente. Não existe rota MVP equivalente no aplicativo.

- [2026-10-10 — Percurso 05 Uma proposta de Hábito — v0.14.0](v0.14.0-2026-10-10-proposta-habito-tela_18-tela_19-tela_20-tela_21-tela_22-tela_23-tela_24/index.html): caminho disponível/futuro, conferência real no hub, respostas, detalhe e reservas em computador/celular.
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


- [v0.14.1 — 2026-10-13 — sessão indisponível, Tela 01](v0.14.1-2026-10-13-acesso-indisponivel-tela_01/index.html): mesma URL antes/Atlas/depois em computador e celular; mostra apresentação do aviso, sem representar falha real de rede.

- [v0.15.0 — 2026-10-13 — MVP 02, Telas 09/13/58/59](v0.15.0-2026-10-13-mvp-02-tela_09-tela_13-tela_58-tela_59/index.html): antes real do Atlas desktop; depois Atlas/app desktop e celular, convite mascarado, gestão/revogados/Início. Rota de gestão nova, sem aplicativo anterior.

- [v2.0.0 — 2026-10-18 — Layout atual, fichas01 a73](v2.0.0-2026-10-18-layout-atual-tela_01-a-tela_73/index.html):83 capturas do aplicativo,76 doAtlas,4 anteriores e2 da referência; rotas reais e esboços distinguidos, fonte/viewport/limites documentados.
