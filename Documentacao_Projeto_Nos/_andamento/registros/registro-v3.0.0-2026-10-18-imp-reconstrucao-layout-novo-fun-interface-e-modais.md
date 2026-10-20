# Registro — v3.0.0 — 2026-10-18 — Imp. de reconstrução do Layout novo com Fun. de interface e modais

Status: Concluído, revisado e validado localmente. Versão 3.0.0 (MAJOR, reconstrução estrutural da apresentação). DOCS_DIR: Documentacao_Projeto_Nos. Branch codex/novo-layout; referência de44ca8. Sem commit, push ou deploy.

## Objetivo e contexto

O usuário rejeitou a mistura entre o primeiro layout e a primeira tentativa de migração v2.0.0. A orientação vigente é remover integralmente a apresentação antiga do aplicativo e reconstruir também os interiores e diálogos conforme `Telas/Layout novo`. Não reintroduzir o layout anterior; eventual retorno depende de nova solicitação. Fontes e galerias históricas continuam arquivadas para rastreabilidade, sem governar a composição viva.

Requisitos: preservar funções reais, sessões, permissões, links e dados; apresentar as partes futuras como **Esboço de funcionalidade · ainda não desenvolvido**; incorporar modais onde previstos; usar ícones coloridos fortes e microinterações com movimento reduzido; fornecer capturas novas comparáveis. A duração de 10 segundos das frases da Conta e a correção TLS (segurança da camada de transporte) local permanecem.

Nova decisão permanente do usuário: Atlas e documentação devem identificar quais partes são modais. O [contrato e inventário de modais](../funcionalidades/modais-interface.md) registra origem, título/gatilho, finalidade, tipo, autorização, integração real/esboço, resultado, fechamento e evidência. Links entre rotas não são modais. README, guia e fichas do Atlas apontam essa regra.

## Decisões e implementação

- Substituídos `globals.css` e `layout-system.css`; os seletores do primeiro layout não são a base do aplicativo. Removidas dependências de Fredoka e Plus Jakarta Sans. A referência usa Arial, títulos de página sem serifa, citações Georgia, fundo `#f5f7f1`, superfície `#fffefa`, texto `#293e35`, verde `#345d44`, linha `#dce3d6`, cantos discretos e lateral de 206 px.
- `ApplicationShell` fornece navegação lateral/inferior e entrada pública; `ActionDialog` oferece diálogo nativo com título acessível, foco contido, Escape e retorno ao gatilho. `RouteState` reconstrói carregamentos, erros e 404 sem duplicar a navegação.
- Conteúdo e permissões continuam no servidor. O componente cliente recebe a apresentação e controla interação; não concede autorização. Ações existentes e RLS (segurança por linha) permanecem nas fronteiras de dados.
- Sucesso que altera dados renova o formulário pela identidade persistida: IDs das propostas, versão dos termos, participação/situação do cartão e ID do último momento. Revalidar a mesma página não reinicia indiscriminadamente o shell nem apaga códigos/feedback de `useActionState`.
- A Agenda usa grade semanal e painel selecionado no computador, lista no celular, seleção por endereço e recorte correto de encontros que atravessam meia-noite. Mês, dia, recorrência e calendários externos continuam esboços.
- Pessoas apresenta cartões individuais e contexto de propósito/administração. Acordos apresenta Kanban/Painéis no computador e lista compacta no celular, com uma única árvore de formulários. A explicação recolhe após cinco segundos e respeita a intervenção manual.
- O Atlas conserva 73 IDs, 39 recortes existentes e 34 planejados. Atlas, Visão global, MVP e inspeção compartilham o novo renderizador. A identificação Modal deriva de gatilhos reais; seleção inline e navegação para rotas recebem tratamento distinto. As fontes importadas antigas ficam apenas no modo histórico explícito.

## Cobertura por rota e modalidade

| Família de rota | Composição e modais desta entrega | Integração e limites |
|---|---|---|
| `/boas-vindas`, `/conta`, `/conta/recuperar`, `/conta/confirmar-email`, `/conta/nova-senha` | Entrada editorial e novos formulários; Conta conectada tem Dados, Segurança e Sair em modais | Auth real; envio/recebimento externo não certificado nesta entrega |
| `/comecar`, `/comecar/tipo`, `/comecar/proposito`, `/comecar/convite`, `/comecar/convite-inicial/[id]` | Fluxo com etapas, escolhas e formulários novos; rotas diretas permanecem navegação | Criação e convite reais; rascunho não grava antes da confirmação; QR/link são futuros |
| `/nucleos` | Grade de espaços, convite e modal de escolha Criar um núcleo | Somente vínculos da sessão; paginação real |
| `/nucleos/[id]` | Agenda, notificações/esboço, próprios Núcleos e modal de propósito | Consultas reais; nenhum aviso fictício apresentado como atividade |
| `/nucleos/[id]/agenda` | Semana/detalhe/lista móvel; Novo momento, Responder, Editar e Remover em modais | Eventos/respostas reais, remarcação e remoção confirmada |
| `/nucleos/[id]/pessoas` | Cartões de pessoas e administração; convites, participação, identidade, orientação e encerramento em modais | Papéis/aceites/permissões reais; encerramento por nome e ciência preserva história |
| `/nucleos/[id]/convites` | Lista/detalhe; Preparar e Revogar em modais | Códigos somente no fluxo autorizado; lista sem códigos; filtros/paginação reais |
| `/nucleos/[id]/acordos` | Kanban/Painéis/lista móvel; Nova proposta, detalhes e filtro em modais | Categorias/situações atuais; publicar não aceita participação |
| `/nucleos/[id]/acordos/[agreementId]` e `/registrar`, `/revisar`, `/confirmar` | Detalhe/histórico/termos/período; Registrar momento, Alterar termos e Administrar em modais | Registro depende dos termos vigentes; nova versão exige novo aceite; histórico preservado |
| `/configuracoes`, `/configuracoes/privacidade`, `/configuracoes/conta`, `/ajuda` | Painéis agrupados e diálogos de privacidade, dados, notificações, ajuda, segurança e saída contextual | Preferência real; notificações/automação/exportação/dispositivos pendentes identificados |
| `/nucleos/[id]/sair` | Página de orientação; modal Revisar minha saída com confirmação | Saída individual real, sem confundir com encerramento para todos |
| `/nucleos/[id]/arvore`, `/memorias`, `/conexoes`, `/perfis`, `/manifesto`, `/cuidado` | Esboços protegidos, incluindo explicações e detalhes ilustrativos em modais | Sem persistência, mensagens, fotos, métricas ou perfis reais |
| Global, carregamento, erro e 404 | Busca de caminhos, notificações/esboço e menu móvel em diálogos; estados no mesmo sistema visual | Busca somente de rotas, sem pesquisa em dados privados |

O percurso individual Proposta → Hábito → Experiência → Essência continua dependente de critérios, consentimentos e modelo de dados. A apresentação das categorias atuais não comprova esse avanço.

## Arquivos e integrações

Principais grupos: `src/app/globals.css`, `src/app/layout-system.css`, páginas de `src/app`, `src/shared/components/application-shell.tsx`, `ui/action-dialog.tsx`, `route-state.tsx`; `src/features/agreements`, `calendar`, `controls`, `invitations`, `onboarding`, `auth` e `preview`. Não foram criadas migrações ou novas dependências.

Atlas: `wireframes/atlas/product-ui.js`, `product.css`, `atlas.js` e fichas/visões relacionadas. Evidências reproduzíveis: `scripts/capture-layout-public.mjs`, `capture-layout-atlas.mjs`, `create-layout-rebuild-gallery.mjs`, `tests/authenticated/layout-rebuild.spec.ts` e verificadores de `wireframes/tools`.

## Validação e revisão

122 testes gerais aprovados; 94 cenários autenticados consolidados (66 da rodada ampla, 24 corrigidos/reexecutados, dois de registros consecutivos e dois de fidelidade protegida; rodadas focais adicionais aprovadas). Tipos, build webpack dos fontes finais e análise de CSS aprovados. Atlas: 73 telas, 207 ações, 365 estados, 41 referências históricas, 20 contextos modais e três rotas protegidas comparadas, sem erros ou chamadas externas. Visão global, MVP e percurso da proposta aprovados.

170 capturas do aplicativo (85 capturas de modais, 27 rotas autenticadas, sete páginas públicas e larguras de 390/640/768/1024/1440 px), 176 do Atlas (86 telas/contextos e 90 capturas de modais), 40 da referência e 20 anteriores: 406 imagens e 20 comparações por área/dispositivo. Modais têm título, gatilho e origem no manifesto; a captura é recortada no diálogo. [Galeria v3.0.0](../../wireframes/comparacoes/v3.0.0-2026-10-18-layout-novo-integral/index.html).

Limitação do ambiente: gravação de traces de navegador travou no Windows. A suíte funcional usa `NOS_DISABLE_TRACE=1`; o padrão `retain-on-failure` permanece. O build autenticado usa cópia temporária no disco local para contornar a trava do volume G:, com conferência SHA-256 e backend exclusivamente Supabase local. Isso não equivale a build/deploy remoto.

A revisão independente encontrou e orientou correções de estado em revalidação, objeto de membros, composição móvel, recorte de eventos, reset de diálogos, identificação de links versus modais, menu móvel e texto da semana no Atlas. Autorrevisão do diff e validação funcional final complementam essa revisão.

## Resultado, limites e próximos passos

Reconstrução implementada, revisada e validada localmente. Galerias anteriores são históricas. Atlas e referência usam exemplos identificados; o aplicativo usa dados autorizados e as capturas autenticadas usam fixtures temporárias locais.

Sem nova comprovação de deploy, operação remota, SMTP (protocolo simples de transferência de correio), recebimento externo ou piloto completo. Login da conta pessoal permanece a ser confirmado pelo próprio usuário; credenciais pessoais não são solicitadas nem registradas.

Fechamento: manifestos package/lock/estado em3.0.0, tipos e build webpack3.0.0 aprovados; 406 PNGs válidos e únicos,20 comparações/filtros/busca/celular aprovados; 1.431 links locais conferidos sem destinos ausentes. Três contas temporárias remanescentes e três cópias de verificação removidas; zero fixtures de autenticação e zero Núcleos da galeria após a limpeza. Supabase local encerrado com backup. Aplicativo3000, documentação3400 e referência4177 mantidos. Próximo passo: o usuário revisar o aplicativo e as comparações. Commit e publicação Git dependem de autorização.
