# Registro — v0.16.0 — 2026-10-13 — Imp. de controles de autonomia com Fun. MVP 05

Status: recorte de orientação concluído localmente; MVP05 parcial. Versão MINOR pelas cinco novas rotas compatíveis. Base main c40594f, Git inicialmente limpo; sem commit/push/deploy nesta entrega.

Objetivo/contexto: conferir Telas66/67/69/70/71 do Atlas, concluir pendências viáveis e reservar próximas funções. Antes eram planejadas; recuperação/logout já existiam. O Atlas proíbe remover associação sem contrato de retenção/dependências.

Requisitos/decisões: navegação e orientação real, sessão por página, vínculo próprio na saída; informação de criador por papel. Reutilização do shell e Auth; sem dados simulados, toggles, novas dependências/tabelas/migrações. Saída efetiva e direitos permanecem reservados. Páginas estáticas de orientação não equivalem a operação concluída.

Arquivos: src/app/configuracoes e subrotas, ajuda, nucleos/[id]/sair; src/features/controls; links da lista/Início, proxy, auth/input e routes; testes controls gerais/autenticados; scripts/capture-mvp-controls-atlas; Atlas screens/product-ui/mvp-plan/global-view; verificador MVP05; cobertura/guia/comparações e registros/manifestos.

Integrações: auth.getUser, Auth logout/recuperação existentes e consulta autenticada nucleus_members sob RLS. Página da saída sem consulta de conteúdo íntimo nem mutação. Estados de carregamento/erro, links com alvos mínimos, feedback de processamento e movimento reduzido existente preservados.

Validações: teste de retorno inicialmente falhou para /configuracoes e passou após mudança; oito testes focados proteção/retorno. Suíte geral dev teve100/106 e seis timeouts de navegação, com erros internos do servidor dev; produção local passou106/106. Autenticados finais quatro aprovados, criador/participante/conta externa e conservação de vínculo. Primeiro teste de isolamento esperava404 HTTP; corrigido para not-found/noindex conforme streaming, sem afrouxar negativa de conteúdo. Tipos e build webpack aprovados em cópia C; fonts/dependências reutilizadas, fontes conferidas por SHA-256 no encerramento. Falha de worker isolada não reproduzida na rodada final. Capturas corrigidas para aguardar título específico, evitando registrar loading como página pronta.

Revisão: autorrevisão completa e independente funcional. P2 de pontos de entrada12/13 no Atlas corrigido; verificador clica12→66 e13→71→13. Sem achado funcional remanescente. MVP geral, Visão global, MVP05 e sintaxe aprovados; links/imagens/diff reconferidos no encerramento.

Resultado:72 telas/16 percursos/38 recortes existentes/34 planejadas. Cinco páginas acessíveis; configurações são ramificações, saída é contextual. Galeria antes/depois de Atlas e app autenticado desktop/mobile; sem aplicativo antes das novas rotas. [Contrato/testes de caixa preta](../funcionalidades/autonomia-protecao.md), [plano](../planos/mvp-05-controles.md), [galeria](../../wireframes/comparacoes/v0.16.0-2026-10-13-mvp-05-tela_66-tela_67-tela_69-tela_70-tela_71/index.html).

Limitações/próximo passo: aprovar contrato de saída/transferência/retenção/direitos, definir suporte/termos e certificar operação externa. SMTP/segredo e demais condições são pendências registradas, sem nova inspeção remota. Preferências/dispositivos/exportação/exclusão reservados. Nenhum encerramento do MVP global alegado. Unidade pronta para commit: controles e orientação MVP05; título sugerido feat(controls): implementar orientação e proteção do MVP 05.

Conferência final: build e tipos v0.16.0 aprovados novamente; quatro autenticados finais passaram e46 imagens concluídas (Atlas antes/depois, app12/13/66/67/69/70/71 e MVP em duas larguras).125 arquivos comparados por SHA-256,584 links locais/recursos conferidos. P3 de referência histórica/capturas corrigidos. Duas contas locais deixadas por falha de worker limpas por IDs exatos; consulta final zero fixtures routing/controls. Supabase local encerrado com backup, sem reset.
