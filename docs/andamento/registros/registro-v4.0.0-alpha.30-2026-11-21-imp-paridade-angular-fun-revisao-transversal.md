# Registro — v4.0.0-alpha.30 — 2026-11-21 — Imp. de paridade Angular com Fun. de revisão transversal

**Status:** recortes selecionados concluídos e validados localmente. Sem publicação nesta entrega.

## Objetivo, contexto e requisitos

Executar o passo 16 no recorte definido pela fase 1: Início (13), resposta ao convite da Agenda (15) e Acordos no celular (18). Comparar a referência Next.js 604a142 com o Angular e o Atlas em 1440 × 960 e 390 × 844. Preservar permissões, dados, cancelamento, foco e caráter ilustrativo das áreas futuras.

## Decisões técnicas e integrações

Restaurados No seu tempo e seu diálogo informativo no Início, miniaturas de data em UTC e cartões dos acordos. O resumo continua protegido pelos serviços existentes; o link do evento mantém o título como nome acessível e a data como descrição. Conferir termos leva diretamente ao detalhe já disponível no Angular. Os atalhos administrativos e de participação anteriores foram preservados.

Responder convite abre Sua participação. A escrita continua em CalendarData e na função respond_nucleus_event, com a sessão e autorização anteriores. Fechar por X, Escape ou gesto externo não grava. Erro confirmado permanece no diálogo; confirmação fecha e recarrega; resultado incerto comunica a necessidade de conferir. O diálogo não cria aceite em nome de terceiros.

Acordos móvel usa uma linha compacta com título, ritmo, estado e contagens; no computador permanecem Kanban e Painéis. Atlas mantém dados ilustrativos e demonstra a resposta somente na memória da página.

**Avaliação rápida de frameworks:** Angular 22.2, estilos próprios, RouterLink e dialog nativo já atendem ao recorte. CDK/Material acrescentariam dependência e outra composição sem necessidade demonstrada. Nenhuma adoção. Context7 consultado na linha Angular 22.0.x; a revisão exata 22.2 não está indexada. Nenhuma API nova de Supabase, alteração de esquema ou pesquisa avançada de pacotes. Octocode não está exposto nesta sessão; buscas locais delimitadas foram suficientes, sem instalação de dependência para esta revisão.

## Arquivos

- apps/web/src/app/nuclei/nucleus-home.html, nucleus-home.ts e nuclei.css.
- apps/web/src/app/calendar/calendar-page.html, calendar-page.ts e calendar-dialog.css.
- apps/web/src/app/agreements/agreements.css.
- tests/angular/calendar.spec.mjs e nuclei.spec.mjs; verificador existente verify-mvp-agenda.mjs.
- Atlas: product-ui.js, product.css, screens.js e index.html; manifestos da raiz e apps/web.
- Estado, histórico, planos de migração/fontes, contratos afetados, guia, brag e galeria.

## Validações e revisão

- Referência inicial: seis cenários autenticados aprovados nas duas larguras.
- Teste da nova jornada falhou pela ausência de Responder convite antes da implementação.
- Tipos e build Angular aprovados; 257 verificações do banco local aprovadas. Sem migração remota.
- Atlas: Agenda, Núcleos, Hábitos, Migração e Visão global aprovados, sem erros de página nos verificadores.
- Rodada autenticada final: seis cenários aprovados em 1440 × 960 e 390 × 844. Resposta, falha de gravação, reabertura, persistência, cancelamento, teclado, toque externo, identidade e participação. Após ajuste final de alinhamento/contraste dos ícones dos botões, Agenda móvel e desktop passaram novamente. O processo desktop encerrou antes de executar (0 ms, código 3221226505); repetição direcionada aprovada. Não foi falha de asserção da aplicação.
- Conferência visual de aplicativo e Atlas e galeria com 32 capturas. Links locais novos, manifestos e diff conferidos. O verificador de fechamento externo aprovou computador/celular; quatro capturas históricas que ele recriou foram restauradas, preservando a galeria antiga.
- Autorrevisão e revisão independente estática. Dois achados P2 corrigidos: precedência da grade desktop e posicionamento do host de contagens no grid móvel. A revisão independente não executou navegador ou testes.
- Na rodada adicional de captura anterior à implementação, houve um timeout em Cancelar da recusa no computador; três outros cenários passaram. Na primeira rodada após mudanças, o nome acessível do link do evento causou duas falhas e foi corrigido. Uma edição de fontes durante a rodada coincidiu com perda da mensagem de nome atualizado no celular; a execução final usa fontes estáveis. Falhas e retestes são distintos, sem afirmar aprovação integral das rodadas intermediárias.

## Resultado, evidências e limites

[Galeria local](../../wireframes/comparacoes/v4.0.0-alpha.30-2026-11-21-paridade-transversal-tela-13-tela-15-tela-18/index.html) com antes, depois e Atlas. Capturas de contas descartáveis locais. Os dados e estados variam entre cenários; a referência Next.js foi lida no objeto Git, sem nova execução do frontend arquivado. Os modais novos não tinham composição anterior própria no Angular.

A seleção destas três áreas não equivale a uma nova revisão integral das 73 fichas. Não há envio de notificações pela área No seu tempo. Sessão hospedada, confirmação/recuperação, fila, recebimento de relato e ensaio de retorno continuam pendentes na fase 1. Nenhum commit, push ou deploy solicitado nesta interação.

## Próximo passo

Fechar A12/A13 com evidência hospedada e ensaio de retorno antes de liberar Nx. Não iniciar NestJS, WebSocket ou plataformas nesta entrega. Sugestões de caixa preta são apresentadas ao usuário; nenhum roteiro foi criado.
