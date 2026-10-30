# Registro — v3.3.2 — 2026-10-30 — Imp. de Núcleos com Fun. remoção do painel lateral

Status: concluído localmente. Objetivo: remover o bloco “CADA LAÇO TEM SEU TEMPO” de /nucleos, solicitado pelo usuário.

## Contexto, requisitos e decisões
Removido o painel lateral inteiro, incluindo aviso de privacidade e atalhos nele contidos. Navegação compartilhada de conta preservada. Grade passa a ocupar a largura disponível; duas colunas de cartões no desktop e uma no celular. Sem alteração de acesso, consultas, paginação ou banco. Atlas vivo da tela 12 sincronizado; nenhum modal alterado. Versão PATCH 3.3.2.

## Arquivos e integrações
src/app/nucleos/page.tsx; src/app/layout-system.css; wireframes/atlas/product-ui.js e product.css; versão em package.json, package-lock.json, README e Atlas; teste autenticado tests/authenticated/nuclei-layout.spec.ts; acompanhamento e galeria.

## Validações e limites
npm run typecheck e npm run build aprovados. npm run test:authenticated -- nuclei-layout.spec.ts: 2 testes aprovados (desktop/mobile), com estado vazio, convite visível, modal de criação abre/fecha e ausência de overflow. node Documentacao_Projeto_Nos/wireframes/tools/verify-global-view.mjs: 73 telas, sem erros. Capturas desktop/mobile inspecionadas visualmente. git diff --check aprovado. Autorrevisão do diff: remoção localizada e import/estilos exclusivos retirados. Sem revisão independente. Consulta tecnológica e pesquisa avançada não necessárias para remoção de marcação/estilos; Context7 disponível, Octocode não exposto nesta sessão. Superpowers de entendimento, revisão e verificação consultadas.

## Resultado e próximo passo
[Galeria](../../wireframes/comparacoes/v3.3.2-2026-10-30-nucleos-tela_12/index.html): antes somente Atlas; captura anterior do aplicativo não realizada. Dados de exemplo e conta descartável local. Teste manual do usuário não executado. Próximo passo: usuário abrir /nucleos no computador e celular, conferir distribuição e criação/convite. Sem commit, push ou deploy.
