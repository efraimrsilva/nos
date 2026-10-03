# Registro — v0.10.0 — 2026-10-03 — Imp. de retomada da confirmação com Fun. proposta de contrato

**Versão:** 0.10.0. **Status:** levantamento concluído; proposta funcional aguardando aprovação.

## Objetivo, contexto e requisitos

Retomar o próximo passo documentado após a revisão consensual da v0.10.0. Conferir continuidade, Git e implementação real antes de propor confirmação após teste. Manter consentimento individual, prazo real, isolamento entre Núcleos e histórico. Nenhuma confirmação ativa implementada nesta etapa.

## Proposta e decisões

O [documento funcional](../funcionalidades/confirmacao-habito.md#proposta-de-recorte--retomada-em-2026-10-03) contém as escolhas propostas e alternativas: duração de 7 a 30 dias, início pelo último aceite, legado com novo ciclo consensual, ativação pelo último Sim após prazo, revisão existente e contratos para active. Essas escolhas aguardam aprovação. Sete dias de reflexão da revisão continuam independentes da duração do teste. Não alterar versão por preparação documental.

## Arquivos e integrações

Alterados estado.md, historico.md e funcionalidades/confirmacao-habito.md; criado este registro. Lidas as fontes v1.2/v2.4, migrações de Acordos/Revisão, habit-access.ts, habit-moment-actions.ts e rotas afetadas. Octocode CLI 19.1.0 consultou dependentes; evidência sintática parcial complementada por buscas e leitura local. Context7 disponível; consulta tecnológica fica para implementação. Superpowers aplicado ao entendimento e verificação. Instruções da conversa substituem o AGENTS.md removido anteriormente no Git.

## Validação, resultado e limitações

HEAD e refs/heads/main consultados e iguais em e315b12f37b6c94718c1d56d4b73c7d4b722b14a. Git inicialmente limpo. Código confirma ausência de active e datas de teste; created_at não evidencia início. Autorrevisão documental, conferência de links locais dos quatro documentos afetados e git diff --check realizados nesta retomada. Não houve revisão independente nem repetição de testes funcionais, pois só há alteração documental. Evidências de 80 testes, banco, tipos e build são da entrega anterior.

## Próximo passo e publicação

Obter aprovação do contrato proposto, planejar persistência e interface, implementar e validar. Preparação documental local deve acompanhar a próxima unidade funcional; sem commit, push ou deploy nesta retomada. Brag sem novo registro, pois a etapa não entrega melhoria de produto ou resultado medido.
