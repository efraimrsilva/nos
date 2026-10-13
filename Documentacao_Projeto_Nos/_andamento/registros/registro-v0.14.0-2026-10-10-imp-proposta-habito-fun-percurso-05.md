# Registro — v0.14.0 — 2026-10-10 — Imp. de proposta de Hábito com Fun. Percurso 05

**Status:** recorte disponível concluído, revisado e validado localmente; fluxo guiado planejado. **Versão:** MINOR 0.13.3 → 0.14.0; conferência é nova funcionalidade compatível. **Base Git:** main, 56089a5; inicialmente limpo. **DOCS_DIR:** Documentacao_Projeto_Nos.

## Objetivo, contexto e requisitos

Conferir telas 18–24 do Atlas, ordenar páginas e concluir o máximo possível com contratos existentes, reservando futuras etapas. O desenho colocava quatro telas guiadas como passagem obrigatória, enquanto aplicativo criava/respondia no hub. Necessidade/compreensão e seleção de participantes não possuem contrato implementado; não apresentá-las como funcionais.

## Decisões e integrações

Conferência no formulário atual, sem nova rota/migração. Primeiro envio interceptado localmente; envio explícito usa a Server Action/RPC existentes. Campos controlados preservam termos quando a ação retorna erro; foco na conferência/edição. Bloqueio durante envio é proteção de interface, sem garantia de idempotência entre requisições independentes. Aplicativo e banco continuam validando sessão, associação, termos e unanimidade. Categoria Experiência não herda prazo de Hábito.

Caminho real 18 → 22 → 23 → 24; 18/22/23 compartilham rota. Autor aceita ao enviar; membros atuais incluídos; aceites parciais aguardam, último aceite inicia testing e prazo; recusa encerra. Não equivale a active nem à confirmação pós-teste. Reservas 19–21 e rota /novo explícitas no percurso, miniaturas e inspeção. Desenhos históricos preservados; 18/22/23 identificadas como representação do recorte atual. 72 telas/14 percursos/32 recortes/40 planejadas.

## Arquivos alterados

- src/features/agreements/components/proposal-form.tsx: conferência/edição/foco/preservação.
- tests/authenticated/habit-proposal.spec.ts: jornada com duas identidades locais, criação/respostas pela interface, erro/categorias e capturas.
- scripts/verify-habit-trial-local.mjs: conferência no verificador existente.
- wireframes/atlas: screens.js, atlas.js, global-view.js, product-ui.js, atlas.css e index.html.
- wireframes/tools: verify-habit-proposal-journey.mjs e verify-fidelity.mjs.
- wireframes/COBERTURA.md, FIDELIDADE.md, GUIA.md e comparacoes/v0.14.0-2026-10-10-proposta-habito-tela_18-tela_19-tela_20-tela_21-tela_22-tela_23-tela_24/.
- package.json/package-lock.json; andamento/estado, historico, contrato e este registro; brag/BRAG.md.

## Validações realizadas

- TDD: novo verificador falhou pela sequência antiga; primeiro teste autenticado falhou pela ausência de Conferir proposta na base. Implementação passou após mudanças.
- npm.cmd test -- --workers=1: 92/92 aprovados, sem backend.
- node scripts/test-authenticated-local.mjs habit-proposal.spec.ts: 4 casos funcionais desktop/celular + 1 comparador completo aprovados; repetição mobile do comparador dispensada pois ele já cobre ambas as larguras.
- supabase test db: 5 arquivos/6 testes aprovados; nenhuma migração aplicada.
- npm.cmd run typecheck e npm.cmd run build: aprovados.
- Percurso 05: disponível/futuro, navegação de todas as saídas 18–24 em duas larguras; Visão global sincronizada/teclado/mobile/hash/impressão aprovados.
- Fidelidade autenticada: 72 prévias/184 saídas/360 estados/41 referências/52 layouts; zero erros/chamadas externas no Atlas. Comparações reais e Atlas inspecionados; rolagem resetada antes de capturar. Antes do aplicativo não foi capturado; galeria não fabrica essa evidência.
- Autorrevisão e revisão independente; dois P2 de categorias/origem e um P3 de aviso web no Atlas corrigidos. A extensão do teste de Experiência falhou por seletor textual exato, corrigido para combobox acessível; repetição focal desktop/celular aprovada. Diferenças/links/sintaxe conferidos no encerramento.
- Conferência final: tipos/build na v0.14.0, 510 links documentais locais, 16 seleções/40 carregamentos de imagens da galeria, sintaxe e diff aprovados. Reconferência independente sem achados materiais restantes. Zero contas temporárias pendentes; Supabase local encerrado com backup, sem reset; prévia documental somente local na porta 3435.

## Resultado, limites e próximos passos

Recorte disponível concluído e verificável localmente; etapas guiadas não concluídas. [Contrato e roteiro manual](../funcionalidades/proposta-habito.md), [galeria](../../wireframes/comparacoes/v0.14.0-2026-10-10-proposta-habito-tela_18-tela_19-tela_20-tela_21-tela_22-tela_23-tela_24/index.html).

Conferência depende de JavaScript; autorização/validação no servidor preservadas. Necessidade, compreensão, seleção, idempotência persistente, central unificada, notificações e conversa ficam reservadas. Reflexões/impacto/evento do detalhe permanecem fora deste escopo. Sem validação remota, commit, push ou deploy.

Próximo passo executável: definir dados, privacidade, destinatários e retenção de 19/21 para integrar fluxo guiado. Unidade incorporada ao commit autorizado em 2026-10-12, com objeto inspecionado. Mensagem: feat(agreements): conferir propostas e sincronizar percurso de Hábito.


## 2026-10-12 — Reconferência para publicação autorizada

Usuário autorizou publicar esta entrega de Hábito e o MVP em commits separados. Reconferência: 92 testes gerais, tipos e build aprovados em cópia temporária no disco local, com fontes/configuração/testes idênticos por SHA-256 e sem .env.local; volume G apresentou timeout na compilação de desenvolvimento. Build webpack conforme procedimento local existente. Cinco testes autenticados aprovados (quatro casos funcionais e comparador completo; uma repetição mobile intencionalmente dispensada). Banco local: cinco arquivos/seis casos aprovados. Fidelidade: 72 prévias, 184 saídas, 360 estados, 41 referências, 52 layouts/28 fontes; zero erro/chamada externa no Atlas.

Revisão de publicação encontrou quatro capturas prematuras: respostas em carregamento e detalhe ainda no hub. Esperas agora verificam proposta/botão, URL do acordo e marcador exclusivo do detalhe. As quatro imagens foram refeitas antes da primeira publicação da galeria; não foram alteradas galerias históricas já commitadas. Correção protege a evidência visual, sem alterar o comportamento do aplicativo. Revalidada a jornada em computador/celular e a preservação de campos/contratos.

Controle de inclusão: objeto inicial com 57 arquivos e árvore ce5387d26f208b02d7730605bc2d4ed9d23fbe24 igual ao índice preparado. Todos os arquivos conferidos no objeto Git; este controle integra o mesmo commit lógico. Envio dos dois commits autorizado; igualdade remota será conferida no encerramento. Sem deploy.
