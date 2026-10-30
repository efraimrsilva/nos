# Registro — v3.4.3 — 2026-10-30 — Imp. de carregamento com Fun. informe sem atalhos

Status: concluído localmente. Versão: 3.4.3 (PATCH).

## Objetivo, contexto e requisitos
Remover os dois botões que o usuário descreveu como “meus núcleos” e “sua conta” no informe exibido ao selecionar um Núcleo. Localizados como os links Seus Núcleos e Minha conta em RouteState, utilizados por /nucleos/[id]/loading.tsx.

## Decisões, arquivos e integrações
RouteState recebe showActions opcional, verdadeiro por padrão; os loadings da lista e do Núcleo passam falso. Não renderiza o contêiner vazio. Texto, aria-busy, role=status e indicador de espera preservados. Demais rotas, erros, Tentar novamente e links de saída mantêm o padrão. Nenhuma mudança de autenticação, dados, navegação do shell ou modal.

Arquivos: src/shared/components/route-state.tsx; src/app/nucleos/[id]/loading.tsx e src/app/nucleos/loading.tsx; tests/route-state.spec.ts; manifestos; README; identificação/nota vigente do Atlas e acompanhamento. Atlas12/13 já representava o carregamento sem ações; composição conferida em Web/Celular, sem necessidade de retirar controles do desenho.

## Validação
npm run typecheck e npm run build aprovados. npm test -- tests/route-state.spec.ts tests/session-routing.spec.ts tests/nucleus-home.spec.ts:16 aprovados (desktop/celular). Regressão verifica componente real de loading sem links/botões e erro com Tentar novamente/Seus Núcleos/Minha conta. O teste renderiza TSX real com o compilador já instalado do Next e renderToStaticMarkup, isolando apenas roteador/shell; não substitui uma jornada autenticada.

Capturas anteriores do componente realizadas antes da alteração. Configuração inicial do teste teve incompatibilidade import.meta em CommonJS e interop do substituto de next/link; ajustes de teste corrigidos antes das capturas, sem mudança no produto para contornar falhas. Context7 consultado para React19.3.0/renderização estática, complementado pelas interfaces instaladas do compilador. Superpowers entendimento e verificação aplicadas; autorrevisão do diff, sem revisão independente. Octocode não exposto; pesquisa avançada desnecessária. Sem dependências novas.

## Resultado, limites e próximo passo
[Galeria](../../wireframes/comparacoes/v3.4.3-2026-10-30-carregamento-tela_12-tela_13/index.html): antes/depois do componente real isolado em1440/390px e Atlas12/13. Não são capturas da rota autenticada completa; não foi certificado o tempo/transição real de rede. Teste de caixa preta M02-LAY-003 Não executado pelo usuário. Sem commit/push/deploy desta alteração. Próximo passo: selecionar um Núcleo na própria conta e conferir o informe sem atalhos.

## Complemento de escopo e verificação final
Usuário confirmou a remoção também ao clicar em Seus Núcleos e reforçou que somente os botões devem sair definitivamente. Ambos os componentes loading deixam de renderizar as ações; nenhuma ocultação temporária por CSS. Texto/indicador, erro e restante da interface preservados. Antes final recapturado a partir dos componentes da revisão publicada e77da4b, sem alterar o checkout; viewport móvel com meta viewport. Tipos/build v3.4.3 e16 testes focados aprovados. Atlas12/13 sem links/botões em desktop/celular. Diff e galeria conferidos; teste de caixa preta não executado.
