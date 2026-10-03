# Continuidade — confirmação do Hábito após teste

**Versão vigente:** 0.10.0. **Atualizado:** 2026-10-03.
**Status:** próximo recorte a especificar; nenhuma confirmação como acordo ativo implementada.

## Objetivo e fontes

Completar a passagem de Hábito em teste para acordo ativo mediante confirmação explícita dos envolvidos. A [v1.2, etapas 5 e 6](../../Projeto_Nos_v1.2_Sistema_de_Aprovacao_e_Construcao_de_Acordos.md) define teste entre 7 e 30 dias e a pergunta “Este acordo funcionou para nós?”, com respostas Sim, Ajustar e Encerrar. A [v2.4, entidade Acordo](../../Projeto_Nos_v2.4_Modelo_Funcional_Dados_Estados_e_Regras.md) prevê periodoTesteAte e distingue emTeste de ativo. A [matriz v2.5](../../Projeto_Nos_v2.5_Matriz_de_Permissoes_Privacidade_Visibilidade.md) exige nova aprovação para mudanças e consenso para encerramento.

## Base real disponível

- nucleus_agreements usa pending, testing, declined e ended; não existe active nem prazo de teste persistido.
- O aceite inicial põe a proposta em testing, sem registrar início ou fim específico do teste. created_at é a criação da proposta, não evidência do início do teste.
- Revisar na v0.10.0 permite ajustes e encerramento, com respostas próprias, unanimidade e sete dias de reflexão desde a solicitação. Ajustar mantém testing; aplicar revisão não confirma como ativo.
- Momentos e histórico estão persistidos. Registrar momento e as escritas de revisão exigem testing; detalhe e página de revisões permitem também ended para consulta.

## Decisões a fechar antes de implementar

1. Como escolher a duração entre 7 e 30 dias, quem a propõe e qual evento inicia o teste. Não confundir esse prazo com reflect_until da revisão.
2. Como tratar Hábitos já em testing sem datas: não inferir término a partir de created_at nem ativar retroativamente sem confirmação.
3. Quem confirma e como lidar com saída de envolvido ou entrada de membro posterior, preservando consentimento individual.
4. Como Ajustar/Encerrar da confirmação reutiliza a revisão existente, sem duas solicitações concorrentes ou alterações silenciosas. Decidir se um ajuste reinicia o teste e como guardar as datas anteriores.
5. Quando active pode ser atribuído, quais participantes precisam responder Sim e como registrar autoria/data da confirmação. Consenso de revisão não equivale a confirmação pós-teste.
6. Compatibilidade das rotas, registro de momentos, filtros e revisões quando active existir; hoje os contratos dessas operações se restringem a testing.

## Critérios de aceitação da entrega futura

- Datas reais e consentimento verificáveis no banco; sem contagem simulada ou ativação automática pelo decurso do prazo.
- Fluxo explícito de confirmação e suas alternativas, com estados vazio, carregamento, erro, pendência e sucesso acessíveis em desktop/celular.
- Aplicação transacional, proteção contra respostas simultâneas, escrita direta e acesso entre Núcleos.
- Preservação dos momentos, revisões e contratos já entregues; compatibilidade testada para testing, ended e futuro active.
- Migração versionada, testes de banco, fluxo autenticado com contas distintas, testes/tipos/build, revisão e documentação antes de incrementar a versão.

## Primeiro passo executável

Na próxima implementação, ler estas fontes e o contrato atual em supabase/migrations/20260928120000_create_nucleus_agreements.sql e 20261002230000_create_nucleus_habit_revisions.sql, habit-access.ts e habit-moment-actions.ts. Definir e aprovar duração, início do teste e tratamento dos Hábitos existentes; então planejar migração e tela de confirmação. Esta preparação documental não autoriza implementar agora.

Promoção para Essência, progresso, conversa de cuidado e publicação pública continuam fora deste recorte.
