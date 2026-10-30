# Continuidade — confirmação do Hábito após teste — v1.0.0

**Modelo implementado localmente — v1.0.0 — 14/10/2026:** [administração e participação](administracao-participacao.md) é o contrato vigente. Administração compartilhada, escolha individual, novo aceite por versão, saída com história preservada e preferência de autoria estão implementados. Sem votação coletiva ou cancelamento de acordo por saída. [Roteiro de testes de caixa preta](administracao-caixa-preta.md). Publicação, migração remota e operação do piloto permanecem pendentes.

## Histórico do modelo anterior — até v0.16.0

Os contratos e marcos abaixo são preservados para rastreabilidade; não representam as regras atuais dos Núcleos/acordos.

**Conferência vigente v0.15.1 — 2026-10-13:** confirmação/legado/maioria/isolamento reconferidos localmente no MVP 03. [Ciclo completo e teste de caixa preta](ciclo-habito.md). Nenhuma regra de voto alterada; operação online exige evidência própria.

**Versão vigente:** 0.15.1. **Atualizado:** 2026-10-13. Implementação inicial v0.11.0, preservada nos marcos históricos abaixo.
**Status:** implementação concluída e validada; contrato aprovado em 2026-10-03 com limiar proporcional para confirmação pós-teste.

## Objetivo e fontes

Completar a passagem de Hábito em teste para acordo ativo mediante confirmação explícita dos envolvidos. A [v1.2, etapas 5 e 6](../../Projeto_Nos_v1.2_Sistema_de_Aprovacao_e_Construcao_de_Acordos.md) define teste entre 7 e 30 dias e a pergunta “Este acordo funcionou para nós?”, com respostas Sim, Ajustar e Encerrar. A [v2.4, entidade Acordo](../../Projeto_Nos_v2.4_Modelo_Funcional_Dados_Estados_e_Regras.md) prevê periodoTesteAte e distingue emTeste de ativo. A [matriz v2.5](../../Projeto_Nos_v2.5_Matriz_de_Permissoes_Privacidade_Visibilidade.md) exige nova aprovação para mudanças e consenso para encerramento.

## Base histórica na retomada da v0.10.0

- nucleus_agreements usa pending, testing, declined e ended; não existe active nem prazo de teste persistido.
- O aceite inicial põe a proposta em testing, sem registrar início ou fim específico do teste. created_at é a criação da proposta, não evidência do início do teste.
- Revisar na v0.10.0 permite ajustes e encerramento, com respostas próprias, unanimidade e sete dias de reflexão desde a solicitação. Ajustar mantém testing; aplicar revisão não confirma como ativo.
- Momentos e histórico estão persistidos. Registrar momento e as escritas de revisão exigem testing; detalhe e página de revisões permitem também ended para consulta.

## Decisões originalmente abertas — resolvidas no contrato aprovado abaixo

1. Como escolher a duração entre 7 e 30 dias, quem a propõe e qual evento inicia o teste. Não confundir esse prazo com reflect_until da revisão.
2. Como tratar Hábitos já em testing sem datas: não inferir término a partir de created_at nem ativar retroativamente sem confirmação.
3. Quem confirma e como lidar com saída de envolvido ou entrada de membro posterior, preservando consentimento individual.
4. Como Ajustar/Encerrar da confirmação reutiliza a revisão existente, sem duas solicitações concorrentes ou alterações silenciosas. Decidir se um ajuste reinicia o teste e como guardar as datas anteriores.
5. Quando active pode ser atribuído, quais participantes precisam responder Sim e como registrar autoria/data da confirmação. Consenso de revisão não equivale a confirmação pós-teste.
6. Compatibilidade das rotas, registro de momentos, filtros e revisões quando active existir; hoje os contratos dessas operações se restringem a testing.

## Critérios de aceitação atendidos

- Datas reais e consentimento verificáveis no banco; sem contagem simulada ou ativação automática pelo decurso do prazo.
- Fluxo explícito de confirmação e suas alternativas, com estados vazio, carregamento, erro, pendência e sucesso acessíveis em desktop/celular.
- Aplicação transacional, proteção contra respostas simultâneas, escrita direta e acesso entre Núcleos.
- Preservação dos momentos, revisões e contratos já entregues; compatibilidade testada para testing, ended e futuro active.
- Migração versionada, testes de banco, fluxo autenticado com contas distintas, testes/tipos/build, revisão e documentação antes de incrementar a versão.

## Primeiro passo da retomada — histórico

Na próxima implementação, ler estas fontes e o contrato atual em supabase/migrations/20260928120000_create_nucleus_agreements.sql e 20261002230000_create_nucleus_habit_revisions.sql, habit-access.ts e habit-moment-actions.ts. Definir e aprovar duração, início do teste e tratamento dos Hábitos existentes; então planejar migração e tela de confirmação. A preparação original não autorizava implementação. Em 2026-10-03, o usuário autorizou implementar e alterou expressamente o limiar de confirmação conforme seção abaixo.

Promoção para Essência, progresso, conversa de cuidado e publicação pública continuam fora deste recorte.

## Proposta de recorte — retomada em 2026-10-03

**Status: aprovado em 2026-10-03, com ressalvas de votação incorporadas. Implementação concluída na v0.11.0.** A confirmação unânime proposta originalmente foi substituída pelo usuário: até 150 participantes, floor(N/2)+1; acima de 150, ceil(N/3). N é a fotografia dos integrantes participantes no ciclo. As demais decisões mantêm unanimidade. Trata-se de evolução do ciclo de vida e do consentimento, com impacto no banco e nas rotas existentes.

1. **Novos Hábitos:** quem cria a proposta escolhe uma duração inteira de 7 a 30 dias, apresentada às demais pessoas antes do aceite. O último aceite inicia o teste; início e fim são gravados pelo banco na mesma transação. Não há duração implícita nem uso de created_at como início.
2. **Hábitos existentes sem datas:** manter estado e histórico. Uma pessoa participante propõe a duração de um novo ciclo; todos os envolvidos originais precisam aceitar e continuar no Núcleo. O último aceite inicia esse ciclo, sem retroatividade. Novos membros podem consultar, mas não são incluídos silenciosamente no consentimento. A saída de participante bloqueia a operação, sem reduzir automaticamente o grupo necessário.
3. **Após o prazo:** cada participante responde explicitamente à pergunta “Este acordo funcionou para nós?”. O Sim que completa o limiar ativa o Hábito em transação, somente após o prazo, se os participantes originais continuam no Núcleo e não existe revisão pendente. Ausência de resposta não equivale a Sim e não impede ativação quando o limiar já foi alcançado. Guardar resposta individual, data e autoria da ativação. Decurso do prazo sozinho não ativa nada.
4. **Ajustar/Encerrar:** direcionar para a revisão existente, preservando unanimidade, sete dias de reflexão e aplicação explícita. Abrir revisão impede a ativação concorrente. Ajuste aplicado durante testing encerra o ciclo anterior, invalida seus votos de confirmação e inicia outro teste com a mesma duração; datas e respostas anteriores ficam preservadas. Recusa da revisão mantém o combinado e o ciclo. Encerramento preserva o histórico e bloqueia novas gravações.
5. **Acordo ativo:** manter detalhe, registro de momentos e revisão com proteção equivalente à atual. Ajustar um ativo exige a mesma revisão consensual e abre novo ciclo em testing com a duração já acordada; não concede confirmação automática. O hub distingue Em teste, Ativos e Encerrados. Experiências e Essência continuam com seus contratos atuais.

### Alternativas e justificativa

A duração fixa de sete dias simplificaria o formulário, mas retiraria a escolha prevista entre 7 e 30 dias. Recuperar datas antigas de aceites seria uma alternativa de migração, porém não provaria consentimento para uma duração que nunca foi informada. Recomenda-se duração escolhida e início explícito para o legado, com histórico de ciclos. Uma ação extra de aplicação após votos suficientes acrescentaria uma etapa sem requisito identificado; o Sim que completa o limiar é a ação explícita de efetivação. A exigência unânime de confirmação foi rejeitada pelo usuário pelo risco de gargalo por respostas esquecidas.

### Pontos afetados e validação prevista

Nova migração, testes SQL e contratos de criação/resposta de propostas; histórico de ciclos e confirmação; habit-access.ts, habit-moment-actions.ts e habit-revision-actions.ts; formulário de proposta de Hábito; hub, detalhe, registro e revisão; nova rota protegida de confirmação. O esquema, as funções e as rotas foram implementados conforme o plano executado.

Validar limites de duração, bloqueio antes do prazo, unanimidade, legado sem retroatividade, saída/entrada de integrantes, revisão concorrente, respostas simultâneas, invalidação de votos após ajuste, acesso entre Núcleos e continuidade dos momentos em active. Executar testes de banco e jornada autenticada com contas distintas, Playwright desktop/mobile, tipos, build e revisão do diff. Somente após concluir e validar a funcionalidade será considerado incremento MINOR para 0.11.0. Orientações visíveis na proposta, detalhe e confirmação explicam os limiares, exemplos, contagem real, participantes fixos e unanimidade das demais ações. O formulário e as solicitações de ajuste explicam novo prazo e novas confirmações antes dos botões.

### Evidência inicial da retomada

Git limpo antes das alterações documentais; HEAD e refs/heads/main consultados diretamente e iguais em e315b12f37b6c94718c1d56d4b73c7d4b722b14a. Código confirma ausência de active e de prazo de teste. Octocode CLI 19.1.0 consultou dependentes de habit-access.ts; grafo sintático parcial, complementado por buscas locais e leitura das migrações e rotas. Context7 está disponível; esta etapa trata de regras de negócio locais, sem nova consulta de biblioteca. Consultar documentação da versão efetivamente instalada ao detalhar a implementação.

## Resultado vigente e continuidade

Contrato entregue na v0.11.0. Cinco arquivos de banco, 84 testes desktop/mobile, tipos, build e jornada autenticada com cinco contas locais aprovados. Limites 150/151 verificados por operações reais nas fixtures; isso valida regra, não mede capacidade de produção. Migração aplicada ao nos-dev; 13 funções equivalentes às locais, leitura isolada e helper restrito conferidos. Interface autenticada sem repetição remota. Orientações visíveis e achados independentes corrigidos. [Registro](../registros/registro-v0.11.0-2026-10-03-imp-confirmacao-habito-fun-teste-votacao-proporcional.md).

Próximo passo: contrato da Tela 07 — Nossa Árvore, com dados reais e regras de impacto/marcos antes da interface. Não simular pontuação, progresso ou reflexões.
