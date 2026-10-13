# Registro — v0.15.0 — 2026-10-13 — Imp. de Núcleo compartilhado com Fun. MVP 02 e gestão de convites

**Status:** recorte funcional local concluído; publicação/aplicação remota pendentes. **Impacto:** MINOR 0.14.1 → 0.15.0, nova rota e função compatível. Sem commit, push, deploy ou migração remota autorizados nesta solicitação.

## Objetivo, contexto e requisitos

Conferir as dez telas/estados do MVP 02 no Atlas vivo, concluir pendências possíveis e reservar superfícies futuras. Base Git main 5819a52; durante investigação a documentação de acesso online anteriormente local foi publicada pelo usuário/outra sessão nesse commit, preservada. Plano e teste criados antes da interrupção do usuário; continuidade retomou os mesmos arquivos. DOCS_DIR: Documentacao_Projeto_Nos.

Lista/Tipo/Propósito/conferência/criação/convite/prévia/aceite/Início já existiam. Tela 59 era planejada e faltava RPC de revogação; geração não serializava chamadas concorrentes. Conferir não pode criar vínculo, revogar não remove participante, criador e membro têm permissões distintas e código é reutilizável.

## Decisões e implementação

- Nova `/nucleos/[id]/convites`: filtros ativos/expirados/revogados, paginação 20 +1, datas UTC, sem selecionar códigos. Vínculo creator conferido antes da consulta, RLS existente preservada.
- Confirmação/cancelamento e Server Action/RPC autorizados; revogação idempotente preserva data/membros. Bloqueio do convite ordena aceite/revogação; geração bloqueia Núcleo e reutiliza ativo. Sem nova tabela/papel/dependência.
- Convite inicial com cópia explícita, expiração real, compartilhamento cancelável e acesso à gestão; Home liga gestão só ao criador. Consulta com erro não simula vazio. Limites de erro/carregamento próprios.
- Rascunho explica a criação e próximo convite no contexto autenticado; removido convite redundante para abrir conta. Regra de rascunho não persistido preservada.
- Retorno Auth reconhece a nova rota com somente status/página, rejeitando código/parâmetros repetidos. Regressão encontrada pela suíte sem backend e corrigida.
- Ordem MVP 12 → 06 → 07 → 08 → 09 → 58 → 59 → 10 → 11 → 13 organiza criador antes do convidado. Navegação não obriga pessoa a passar por todas: escolha/compartilhamento/gestão são opcionais. Percurso 02 criador: 01 → 12 → 06 → 07 → 08 → 09 → 58 → 59 → 13; Percurso 04 convidado preservado.
- Telas 09/58 representam a mesma rota; 13 e 59 passam a composição viva do aplicativo. Referências históricas preservadas. Inventário: 72 telas, 14 percursos, 33 recortes existentes, 39 planejadas, 186 ações. Renderização atual: 15 composições de entrada/Início/gestão, 26 do documento, 31 extensões.

## Arquivos e integrações

`src/features/invitations/actions.ts`, `components/initial-invitation.tsx`, `components/revoke-invitation.tsx`; `src/app/nucleos/[id]/convites/` (page/error/loading), `src/app/nucleos/[id]/page.tsx`, `src/app/comecar/convite-inicial/[id]/` (page/error); propósito; `src/features/auth/input.ts`. Migração `20261013150000_manage_nucleus_invitations.sql`, pgTap `nucleus_invitations.sql`, testes autenticados/retorno/proteção. Atlas screens/product-ui/mvp-plan/atlas/index e novo verify-mvp-nucleus, cobertura/fidelidade/galeria. Manifestos, plano/contrato/registros/estado/histórico/Brag/README sincronizados.

## Validações e revisão

- Teste de banco falhou antes da implementação pela ausência da RPC; depois 13/13 do arquivo, conjunto Supabase local seis arquivos/19 verificações aprovado. Preservação de data usa valor conhecido de 2000 para detectar sobrescrita por now() constante na transação.
- 102/102 testes gerais desktop/mobile aprovados após corrigir retorno da gestão. Primeira rodada sofreu timeout na compilação inicial em G; cache preparado resolveu. Dois seletores antigos de Voltar nos testes autenticados eram ambíguos; corrigidos para nome exato.
- Rodadas locais autenticadas: 28 casos de criação/tipo/propósito/entrada; 44 de convites/navegação/sessão; seis finais da gestão, com duas contas, F5, cancelamento, revogação/novo código, geração paralela, filtro Expirados/paginação e 320px/movimento reduzido. Rodadas se sobrepõem; não são 78 casos únicos. Comparadores antigos que sobrescrevem galerias históricas foram excluídos. Outros casos de sessão ainda geraram quatro capturas históricas incidentalmente; restauradas ao HEAD após confirmar que estavam intactas no início. Nova galeria usa capturas atuais.
- Concorrência comprovada em ambas as ordens: primeira transação identificada em PgSleep e segunda RPC observada esperando Lock em outra conexão. Primeiro marcador stdout foi rejeitado pela revisão por buffering; substituído pela observação do banco.
- Tipos e builds de produção locais aprovados durante suíte autenticada; reconferência dos manifestos v0.15.0 registrada no estado final. Atlas MVP/Visão global/convite/MVP02 e sintaxe aprovados; 586 referências locais sem destino ausente e git diff --check aprovado. Manifestos v0.15.0, tipos e build Turbopack direto aprovados; rota de gestão presente no resultado.
- Autorrevisão + revisão independente: corrigidas frase de gestão futura no Atlas e duas provas fracas de teste (stdout e now constante). Reconferência independente sem novo bloqueio.
- Capturas de gestão corrigidas após identificar loading; aguardam título/botão real. Código mascarado. Antes real do Atlas somente desktop para 09/58/59; depois desktop/mobile, Home e revogados. Capturas Atlas expandem altura para mostrar todo conteúdo, sem alterar fonte/layout; não afirmar igualdade de pixels com app.

## Resultado, limitações e próximos passos

Recorte funcional da etapa 02 validado localmente, com gestão real. QR/câmera/link, destinatários individuais, administradores e histórico por aceite permanecem reservados; status Aceitos não é simulado. Operação completa exige publicar aplicação e aplicar migração em ambiente autorizado; nenhuma alteração remota nesta entrega. SMTP/recebimento externo e recuperação online continuam pendentes da etapa 01. Falha real de banco/clipboard e entrega nativa do dispositivo não foram provocadas; tratamento revisado por leitura/Atlas.

Próximo passo executável: autorizar publicação/aplicação remota e validar duas contas nesse ambiente; em paralelo, seguir roteiro existente para MVP 03 sem ampliar contratos futuros por inferência. Banco local com histórico de migração alinhado após aplicação SQL; fixtures removidas e ambiente encerrado com backup no término.

## Auditoria de over-engineering — marco 100

**Baixo.** Inspeção da estrutura src/app, src/features, src/lib e src/shared e do manifesto manteve separação por funcionalidade, rotas e integração Supabase, sem framework/provedor adicional. As dependências atuais atendem interface, autenticação, build e testes já utilizados. Os registros de estado conservam muitos marcos históricos: manter o resumo vigente no topo e avaliar arquivamento do histórico em manutenção documental própria, sem refatorar áreas não relacionadas nesta entrega. Entrega reutiliza Supabase, Server Actions, shell/CSS, políticas existentes e uma migração compatível. Sem novo pacote, camada genérica, provedor, tabela de rastreabilidade ou papel administrativo. Abstrações limitadas ao formulário de confirmação e aos limites de rota. Regex de IDs e mensagens repetidas são pequenas e explícitas; não justificar biblioteca genérica por esta entrega. Próxima ação: manter evolução por contrato real, criar histórico individual somente quando houver requisito e validar futuras abstrações com evidência. Contagem 99 → 100 nesta solicitação contínua, não por ferramentas/interrupção. Próxima auditoria em 200.

[Contrato e teste manual](../funcionalidades/nucleo-compartilhado.md) · [Plano](../planos/mvp-02-nucleo.md) · [Comparação](../../wireframes/comparacoes/v0.15.0-2026-10-13-mvp-02-tela_09-tela_13-tela_58-tela_59/index.html).
