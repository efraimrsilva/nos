# Registro — v3.4.2 — 2026-10-30 — Imp. de barra lateral com Fun. remoção do cartão do Núcleo

Status: concluído localmente. Versão: 3.4.2 (PATCH).

## Objetivo, contexto e requisitos
Remover da barra lateral o pequeno cartão com nome do Núcleo e “Seu espaço compartilhado”, que navegava para /nucleos. Pedido restrito à apresentação; manter o nome no cabeçalho, contexto atual e acesso à lista por Seus Núcleos.

## Decisões e integrações
Remoção em ApplicationShell, componente compartilhado das páginas internas, e na composição compartilhada do Atlas. Nenhuma mudança em autorização, cookie do último Núcleo, totais, consultas, ações ou preferências. Menu móvel preservado. Nenhum modal afetado. Removidos imports/estilos exclusivos do cartão. Teste de contexto agora verifica ausência do nome anterior no cabeçalho em vez do cartão removido; teste de ícones deixa de montar o ícone que não existe mais.

## Arquivos
src/shared/components/application-shell.tsx; src/app/layout-system.css; Atlas product-ui.js/product.css; tests/themes.spec.ts; tests/authenticated/account-menu.spec.ts e sidebar-card.spec.ts; scripts/verify-sidebar-card-atlas.mjs; manifestos, README, contrato/manual e acompanhamento.

## Validações
npm run typecheck e npm run build aprovados. npm test -- tests/themes.spec.ts:16 aprovados. Atlas específico desktop/mobile aprovado, sem erro e com link Seus Núcleos preservado. Captura anterior do aplicativo:2 cenários locais aprovados. npm run test:authenticated -- sidebar-card.spec.ts account-menu.spec.ts: quatro aprovados, com conta/contexto, navegação móvel e controle da barra lateral. Visão global73 sem erros. Capturas antes/depois inspecionadas, git diff --check aprovado. Autorrevisão: remoção localizada, links e contexto preservados; sem revisão independente nesta tarefa. Superpowers entendimento/revisão/verificação aplicadas; consulta tecnológica/Context7 não necessária para remoção de marcação; Octocode não exposto e pesquisa avançada desnecessária.

## Resultado, limites e próximo passo
[Galeria](../../wireframes/comparacoes/v3.4.2-2026-10-30-barra-lateral-tela_13/index.html): aplicativo/Atlas antes/depois desktop/mobile. Tela13 representa o componente global da barra lateral, removido de todas as rotas internas. Contas e Núcleos descartáveis locais; sem dados reais. Manual do usuário não executado. Sem commit, push ou deploy. Próximo passo: conferir a barra lateral no Núcleo e na conta e usar Seus Núcleos para trocar de espaço.

Ajuste da evidência: account-menu.spec.ts apontava para galeria histórica3.3.1. Destino corrigido para3.4.2; seis capturas produzidas no destino antigo foram copiadas para a galeria atual (prefixo reteste-) e os seis arquivos históricos restaurados ao objeto Git original, sem pendência de diff nessa galeria.
