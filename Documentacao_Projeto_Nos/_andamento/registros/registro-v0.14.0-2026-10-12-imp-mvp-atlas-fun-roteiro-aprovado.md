# Registro — v0.14.0 — 2026-10-12 — Imp. de MVP no Atlas com Fun. de roteiro aprovado

**Versão:** v0.14.0, preservada para esta entrega de planejamento/documentação. **Status:** roteiro aprovado, artefato validado e inclusão no commit comprovada; envio remoto autorizado. **DOCS_DIR:** Documentacao_Projeto_Nos. **Git:** main; base inicial 56089a5.

## Objetivo e contexto

Usuário pediu um MVP (Minimum Viable Product, Produto Mínimo Viável) e caminho até todo o projeto, começando pelo login existente, com uma guia acima de Visão global. Na criação, dispensou explicitamente documentação e comparações. Nesta interação aprovou o resultado e autorizou documentação e commit/push. Confirmou publicar Hábito e MVP em dois commits separados; a entrega funcional v0.14.0 anterior é a base considerada pelo roteiro.

## Requisitos e resultado

Guia MVP prioriza 13 etapas: cinco para o primeiro marco (37 telas/estados), sete de expansão e uma de integrações/plataformas. Todas as 72 telas atuais têm uma etapa principal, sem omissões/duplicações. As 184 ações das fichas estão acessíveis. Funções sem tela própria incluem QR/link/câmera, administração do Núcleo, revisão anual consensual do propósito, agenda mensal/recorrência, login social, calendários externos, Android/iOS, biometria, IA opcional e operação/retenção de dados.

MVP propõe ciclo compartilhado de Hábito, agenda interna e controles essenciais de privacidade/conta/saída. Funcionalidades futuras não foram implementadas nesta tarefa. Aprovação do roteiro não muda a classificação das fichas (32 recortes existentes/40 planejadas) nem fecha contratos abertos. [Plano aprovado](../planos/mvp.md), [guia viva](../../wireframes/atlas/index.html#mvp) e [comparação](../../wireframes/comparacoes/v0.14.0-2026-10-12-mvp-atlas-tela_01-a-tela_72/index.html).

## Decisões técnicas e integrações

mvp-plan.js define objetivos, IDs, dependências, funcionalidades e critérios de avanço; títulos/situações/rotas/regras/ações vêm de screens.js. Miniaturas usam tileHtml/productPhoneHtml do atlas; nenhuma segunda coleção de desenhos. Filtros seguem a mesma fonte e persistem ao alternar visões. Inspeção volta ao MVP preservando etapas/prévias abertas. IDs de miniaturas são separados por contexto. Acesso direto #mvp, teclado e impressão com restauração das etapas são suportados.

Novas telas/IDs sem etapa, ausentes ou duplicados geram aviso de cobertura. Revisar a ordem e dependências em cada mudança, além da sincronização funcional/visual obrigatória. Aprovação vira rótulo explícito no atlas; avisos continuam distinguindo recorte existente de conclusão. Documentação isolada não altera manifestos. O incremento MINOR para v0.14.0 pertence exclusivamente à entrega de conferência do Hábito.

## Arquivos alterados

- wireframes/atlas/mvp-plan.js, mvp.css, index.html e atlas.js.
- wireframes/tools/verify-mvp-view.mjs e verify-global-view.mjs.
- _andamento/planos/mvp.md, estado.md, historico.md, README.md, tecnologias/frontend.md e este registro.
- README.md raiz, wireframes/GUIA.md, COBERTURA.md, FIDELIDADE.md, comparacoes/README.md e brag/BRAG.md.
- Comparação documental nova, v0.14.0-2026-10-12-mvp-atlas-tela_01-a-tela_72: index e seis imagens amostrais. Antes real do atlas sem MVP, obtido de snapshots anteriores à criação, já com Hábito v0.14.0; depois com roteiro aprovado. Não há rota equivalente no aplicativo.

## Validações

- verify-mvp-view.mjs: cobertura única de 72 IDs/184 ações, login Entrar primeiro, composição compartilhada, propagação de alteração da fonte e aviso para tela nova; filtros, teclado, retorno/contexto, celular 375px, hash e impressão. Zero erro/rede externa.
- verify-global-view.mjs e verify-habit-proposal-journey.mjs: visões e percurso existente/futuro preservados.
- Sintaxe JavaScript e diff aprovados; 992 links locais conferidos. Galeria: seis imagens, quatro seleções e 16 carregamentos, três links locais, sem erro ou transbordamento em 1440/375px. Capturas principais inspecionadas visualmente em computador/celular.
- Revisão independente do MVP: QR/link, administração/revisão do propósito e agenda mensal passaram a ter etapas explícitas; achados corrigidos e reconferidos.
- Revisão independente final somente leitura: contagens, documentação, integração e seis amostras inspecionadas, sem achados concretos pendentes. Autorrevisão do diff também concluída; testes executados pela raiz constituem evidência separada da revisão.
- Para a publicação funcional anterior: tipos/build e 92 testes gerais em cópia local verificada por SHA-256 (G teve timeout de compilação), banco 5 arquivos/6 casos e cinco testes autenticados aprovados (um comparador redundante mobile dispensado). Quatro capturas prematuras corrigidas/repetidas antes da primeira publicação de Hábito. Evidência separada no [registro da entrega](registro-v0.14.0-2026-10-10-imp-proposta-habito-fun-percurso-05.md).
- Zero contas temporárias proposal/routing restantes; Supabase local encerrado com backup padrão, sem reset. Cópia temporária geral removida após validar o destino e retirar junções de dependências.

## Limitações e próximo passo

Roteiro e atlas são planejamento sem gravação, mensagens ou votos. A fonte de IDs/telas é reaproveitada; priorização e sincronização com o aplicativo exigem revisão humana em cada entrega. Testes locais não certificam SMTP/recebimento externo, HTTPS/origens, plataformas nativas ou operação pública.

Retomar etapa 01: reconferir login, confirmação, recuperação/revogação, retorno de convite e dependências operacionais. Contratos 19–21 e Árvore seguem previstos em 06/07; direções anteriores de começar por esses módulos são substituídas como prioridade geral, preservando seus registros históricos. Não iniciar nova funcionalidade nesta publicação.

## Controle de publicação

Usuário autorizou commit e push em main, sem merge ou deploy. Inspecionar inclusão no objeto de cada commit antes de retirar pendências; comparar árvore preparada e árvore commitada, depois HEAD com origin/main e hash remoto após push. Incorporar este controle à mesma unidade lógica, sem commits separados só para o registro.

Objeto inicial do segundo commit inspecionado: 25 arquivos presentes e árvore 76fafd7569d2f39e604d64c74fc16a8fdeeb597e igual à preparada. Pendência retirada por prova de inclusão; esta anotação integra o mesmo commit lógico. Título: docs(atlas): aprovar MVP e registrar roteiro completo de implementação. Hábito está no commit anterior e32ea5013a81de6e2bb76afb0f9122e3dd0b9307. Hash final e igualdade remota devem ser conferidos após enviar os dois commits; GitHub não comprova deploy.
