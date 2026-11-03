# Registro — v3.5.0 — 2026-11-03 — Imp. de Acordos com Fun. propostas e respostas

- **Versão:** 3.5.0, consolidação MINOR (nova funcionalidade compatível de totais compartilhados e evolução da interface).
- **Status:** Concluído e validado localmente — publicação Git sob controle do estado canônico; sem certificação de deploy ou migração remota.
- **Objetivo/contexto:** consolidar os ajustes locais de Acordos solicitados pelo usuário, alinhando entrada das propostas e feedback de participação sem alterar autonomia individual.
- **Requisitos:** nova proposta sem categoria escolhida, início como Hábito pendente; totais de participação sem recarregar; preservação de rascunhos; convite administrativo; equivalência das ações em computador/celular.

## Decisões e integrações

O servidor força `habit` em novas propostas e redireciona para `categoria=all&filtro=pending`; um campo de categoria enviado manualmente não permite pular esse início. O formulário preserva conferência, edição e prazo de 7–30 dias. O seletor de categoria e o diálogo de filtro foram retirados; busca continua limitada à página carregada. Kanban/Painéis no computador e lista móvel reutilizam os detalhes/ações existentes. Essência é planejada e não há progressão automática.

Um provedor de página consulta totais a cada três segundos, sem sobreposição, pausa em aba oculta e atualiza ao retornar. Evita remontar formulários; mantém valores anteriores com aviso em falha. A Server Action (ação de servidor) valida UUIDs, sessão e limite de 50 acordos, e chama `get_nucleus_agreement_response_counts`. A RPC (chamada de função no banco) restringe vínculo atual, Núcleo aberto e acordos do mesmo espaço, retornando somente agregados. Contabiliza integrantes atuais e exige versão vigente para aceite; silêncio/aceite antigo ficam pendentes. Não afrouxa leitura de respostas individuais.

Enviar convite abre a geração existente somente para administradores; autorização permanece no servidor/banco. Não há envio de mensagem externa implementado por essa ação.

## Arquivos e documentação

- `src/features/agreements/actions.ts`, `components/proposal-form.tsx`, `components/agreements-workspace.tsx`, `agreements-layout.css`, `components/agreement-responses.tsx` e `response-counts.ts`.
- `src/app/nucleos/[id]/acordos/page.tsx` e `acordos/[agreementId]/page.tsx`.
- `supabase/migrations/20261103122309_agreement_response_counts.sql` e `supabase/tests/agreement_response_counts.sql`.
- Testes de proposta, ajustes móveis e convites afetados; [contrato](../funcionalidades/proposta-habito.md), [administração](../funcionalidades/administracao-participacao.md), [fluxo](../funcionalidades/fluxo-proposta-habito-experiencia-essencia.md) e [inventário de modais](../funcionalidades/modais-interface.md).

## Validação, resultado e limites

Evidência local anterior informada na sessão: sete verificações pgTAP da RPC aprovadas; dezesseis cenários autenticados de ajustes móveis/calendário aprovados em rodada anterior. A seleção atual está sendo reexecutada pelo agente principal; não confundir essa rodada anterior com aprovação do diff final. Testes de caixa preta M03-AJU-001–005 estão [Não executados pelo usuário](../testes-caixa-preta/ajustes-v3-5.md).

A migração foi exercitada somente localmente. Commit/push não aplicam a função ao banco remoto. Antes de afirmar operação hospedada dos totais, é necessário comprovar a migração no ambiente de destino e a jornada hospedada. Nenhum aceite coletivo, progressão individual completa ou migração de acordos legados foi introduzido. Próximo passo: concluir os verificadores finais, Atlas e [registro transversal](registro-v3.5.0-2026-11-03-05-imp-validacao-fun-paridade-e-rastreabilidade.md), revisar o diff e registrar publicação somente após evidência.

### Verificação final da v3.5.0

Tipos e build finais aprovados: `npm run typecheck` e `NOS_LOCAL_VERIFY=1 npm run build -- --webpack`. Nova execução dos sete testes pgTAP da RPC aprovada. Rodada autenticada atual: 23 aprovados, duas falhas de expectativas antigas sobre rotas consolidadas da Conta e um ignorado, em 2,3 minutos; os quatro cenários de paridade passaram, incluindo destinos e ações equivalentes. As duas falhas foram tratadas no roteiro de navegação, com assertivas de URL/hash canônicos; reteste específico em execução. Cinco verificadores do Atlas passaram; revisão P3 (baixa gravidade) restaurou a busca local do Atlas. Resultado/publicação e evidências visuais finais são centralizados no [registro transversal](registro-v3.5.0-2026-11-03-05-imp-validacao-fun-paridade-e-rastreabilidade.md). Não converter automação em aprovação dos casos manuais.

### Fechamento local confirmado

Reteste específico dos dois cenários de navegação aprovado: computador em 23,4 segundos e celular em 17,3 segundos (rodada de aproximadamente 1,2 minuto). O conjunto de 26 casos únicos fecha com **25 aprovados e um ignorado intencional**, consolidando 23 aprovações da rodada anterior e as duas falhas de aliases corrigidas/retestadas. Não houve uma única rodada com 26 aprovações; falhas e retestes permanecem preservados neste registro e no histórico de resultados. O ignorado corresponde ao painel de perfil desktop, intencionalmente ausente no celular.

Tipos finais v3.5.0, build final webpack, vinte testes públicos e sete testes pgTAP locais aprovados; cinco verificadores do Atlas aprovados. [Galeria v3.5.0 com aplicativo real](../../wireframes/comparacoes/v3.5.0-2026-11-03-paridade-tela_01-tela_05-tela_12-tela_13-tela_14-tela_18-tela_66-tela_73/index.html#aplicativo-real): dezoito capturas reais (duas anteriores e dezesseis posteriores) e 36 capturas do Atlas, totalizando 54 imagens. A galeria distingue antes/depois, aplicativo/Atlas e seus limites; não certifica aparelho físico ou Safari. Publicação Git será registrada pelo agente principal no estado canônico. Deploy e aplicação remota da migração continuam sem comprovação; os 24 casos novos de caixa preta permanecem Não executados pelo usuário.
