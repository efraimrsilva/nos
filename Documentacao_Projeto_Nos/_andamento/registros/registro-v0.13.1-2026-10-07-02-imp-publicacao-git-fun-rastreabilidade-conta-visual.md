# Registro — v0.13.1 — 2026-10-07 — Imp. de publicação Git com Fun. de rastreabilidade de Conta visual

**Status:** conjunto commitado e inspecionado; envio autorizado para conferência remota no encerramento. Publicação explicitamente autorizada pelo usuário. Versão funcional preservada em 0.13.1.

## Objetivo e escopo

Publicar no GitHub um único commit que abranja toda a entrega visual de Conta: estabilidade horizontal entre as abas, árvore/frases na altura do login, remoção do link inferior duplicado, preservação do link superior e do respiro inferior, teste atualizado, Atlas vivo/fichas, galeria antes/depois, versão e registros de continuidade.

## Contexto e decisões

Branch main; base cfcd57f02af87540b746bf3b0bfce87caf165d53. Fetch confirmou main e origin/main sem divergência (0/0). Sem alterações preexistentes independentes identificadas no conjunto desta entrega. Histórico de implementação e capturas preservados.

Título do commit: `fix(conta): estabilizar abas e remover link duplicado`.

Descrição detalhada inclui diagnóstico da centralização e barra de rolagem, medição com referência do login, restrição à Conta com formulário, manutenção de Boas-vindas pelo link superior, atualização de teste/Atlas/galeria/documentação, versão 0.13.1 e validações. Não inclui credenciais, arquivos de ambiente, dependências instaladas nem resultados temporários.

## Validações e controles

`npm.cmd test -- --workers=1`: 88/88 aprovados em desktop/celular nesta publicação. Tipos/build e medidas visuais aprovados na implementação imediatamente anterior, sem novas alterações funcionais. Diff completo e índice conferidos, sem erro em git diff --cached --check. Objeto Git inspecionado: 33 arquivos, incluindo oito capturas, e árvore inicial fe98a545957ca6bd6e51d47380bce4e52ccd5e46 igual ao conjunto preparado. Pendência retirada após essa prova; controle incorporado ao mesmo commit lógico. Comparar HEAD com refs/heads/main no GitHub após push. A publicação Git não comprova deploy.

Limitação preservada: verify-fidelity.mjs espera /comecar público, incompatível com a proteção implantada na v0.13.0. Verificações específicas de Conta e Visão global aprovadas na implementação.

## Arquivos e retomada

[Registro da implementação](registro-v0.13.1-2026-10-07-imp-conta-fun-alinhamento-visual.md), [estado](../estado.md), [galeria](../../wireframes/comparacoes/v0.13.1-2026-10-07-conta-alinhamento-tela_01-tela_02/index.html), aplicativo/teste/Atlas/manifestos e referências documentais da mesma entrega.

Próximo passo operacional desta publicação: enviar main e conferir igualdade entre HEAD e refs/heads/main remoto no encerramento. Após publicação, retomar a conferência manual de Conta; evolução funcional planejada continua o contrato de Nossa Árvore. Nenhum deploy solicitado.
