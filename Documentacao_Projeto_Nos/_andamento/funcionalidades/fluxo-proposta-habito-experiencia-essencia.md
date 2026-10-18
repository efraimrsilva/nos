# Fluxo de evolução — Proposta → Hábito → Experiência → Essência — v1.1.0

**Decisão aprovada:** 2026-10-18. **Status:** direção de produto aprovada e documentada; adequação funcional, migração e validação pendentes. **Versão do aplicativo:** 1.1.0, preservada por se tratar de entrega documental.

## Regra central e alcance

**Proposta → Hábito → Experiência → Essência é o fluxo obrigatório de evolução dos combinados.** Não apresentar Hábito e Experiência como categorias independentes de entrada nem permitir, no novo desenho, saltar diretamente para Experiência ou Essência.

O Núcleo apoia uma pessoa a desenvolver uma prática. Os degraus de evolução indicam o avanço dessa pessoa na prática combinada. O acordo e seus termos oferecem contexto compartilhado, mas o avanço de uma pessoa não comprova o avanço de todas as demais.

A ordem das etapas está aprovada. Os critérios, permissões e registros de cada passagem ainda precisam ser detalhados antes de implementar; a sequência, por si, não autoriza mecanismos automáticos ou a reintrodução de votação coletiva.

## Etapas do percurso

| Etapa | Significado aprovado | Limites e condição para avançar |
|---|---|---|
| Proposta | Apresentação inicial da prática que o Núcleo deseja ajudar a pessoa a desenvolver, com intenção e termos compreensíveis. É o ponto de entrada do percurso. | Propor não aceita por outra pessoa nem comprova prática. Deve haver escolha individual de participação; critérios para iniciar Hábito e relação com o teste precisam de definição explícita. |
| Hábito | Primeiro degrau de prática a desenvolver com apoio do Núcleo, depois da Proposta. | A continuidade e o costume com a prática orientam a evolução. Não inferir prazo, frequência mínima, pontuação, sucesso ou avanço automático. A passagem para Experiência precisa de critérios e confirmação a contratar. |
| Experiência | Degrau posterior do mesmo percurso, indicando que a pessoa avançou na prática do Hábito. | Não possui cadastro inicial independente nem pode resultar apenas da troca de categoria global do acordo. A consolidação da prática prepara a possível passagem para Essência, com critérios próprios ainda pendentes. |
| Essência | Etapa de consolidação da prática, que passa a expressar um modo de ser e de cuidar. Vem depois de Experiência no fluxo aprovado. | Não é adquirida automaticamente por tempo, costume, nível ou pontuação. Requer reconhecimento e consentimento explícitos, com elegibilidade, participantes e procedimento ainda a compatibilizar e contratar. |

Os exemplos anteriores de viagens, passeios e momentos especiais podem ajudar a expressar a intenção de uma prática, mas não autorizam entrada direta em Experiência no novo modelo.

## Pessoa, Núcleo e acordo

- O Núcleo é o espaço de apoio compartilhado. O acordo descreve o que será praticado e seus termos.
- A evolução deve corresponder à pessoa participante e à prática certas. Pessoas do mesmo acordo podem exigir representações distintas; o modo de agregação e exibição ainda precisa ser definido.
- Não converter a etapa de uma pessoa em avanço de todo o Núcleo. Não usar uma categoria única no acordo como prova do desenvolvimento de todos.
- Obrigatória é a ordem do percurso. A participação continua individual e voluntária conforme o [contrato administrativo](administracao-participacao.md): esta decisão não obriga alguém a aceitar, praticar ou continuar um acordo.
- Apoiar não significa controlar. Preservar privacidade e autonomia, sem ranking, comparação entre pessoas, diagnóstico ou pontuação presumida.
- A relação entre consolidação individual e reconhecimento de identidade coletiva em Essência ainda deve ser contratada. Não inventar que o avanço de uma pessoa promove todas as demais.

## Relação com o ciclo operacional

As quatro etapas são a direção de evolução do produto. Situações como proposta pendente, teste, ativo e encerrado descrevem o ciclo operacional do acordo; não são equivalentes a Hábito, Experiência ou Essência.

Proposta é a entrada do fluxo, mas publicar, aceitar participar, iniciar um teste e ativar são ações distintas no modelo atualmente implementado. Ainda é necessário definir como essas ações se posicionam na nova passagem Proposta → Hábito. Não deslocar testes nem declarar uma passagem concluída apenas para encaixar o quadro visual.

O [contrato administrativo vigente](administracao-participacao.md) mantém os administradores na gestão e cada pessoa responsável por aceitar ou recusar sua participação. A nova sequência **não reintroduz votação coletiva**. O trecho de votação presente no laboratório não aprova uma regra de negócio nova.

Mudanças de termos continuam exigindo novo aceite individual. Silêncio, tempo de uso, participação em outro acordo ou resposta de outra pessoa não comprovam a passagem de etapa.

## Substituições e histórico

Fica substituída, para o desenho futuro, a interpretação de Hábito e Experiência como categorias independentes com início direto em qualquer uma delas. O novo início é Proposta; a evolução segue Hábito, Experiência e Essência, nessa ordem.

Os documentos conceituais antigos descrevem elegibilidade para Essência após pelo menos seis meses, revisões positivas e consenso; também mencionam promoção direta de Hábito para Essência. A nova ordem elimina o salto de Hábito para Essência. **O prazo e o mecanismo antigos não são revalidados nem revogados por inferência:** sua compatibilidade, contagem e consentimentos deverão ser resolvidos no contrato de transição Experiência → Essência antes de implementá-la. O que está aprovado nesta entrega é a sequência completa e o caráter individual da evolução.

Registros, migrações, testes e capturas de entregas anteriores permanecem históricos. Não reescrevê-los como se a progressão individual já existisse.

## Situação verificada do aplicativo e do laboratório

Em 18/10/2026, o formulário do aplicativo ainda permite propor diretamente habit ou experience. A listagem agrupa pela categoria global do acordo e lê a participação individual. Esse comportamento corresponde ao modelo anterior e ainda precisa ser adequado à direção aprovada.

Não há entrega comprovada das quatro etapas por pessoa nem das passagens entre elas. A aba vazia de Essência não conclui promoção, persistência ou critérios de elegibilidade.

Fontes conferidas: src/features/agreements/components/proposal-form.tsx, src/app/nucleos/[id]/acordos/page.tsx e [Atlas vivo](../../wireframes/atlas/index.html).

O laboratório de layouts é um estudo visual independente. O preset 27 mostra as quatro colunas, mas não comprova transições reais, evolução individual, votação aprovada ou implantação dessa regra. Não alinhar automaticamente aplicativo e banco a partir de exemplos visuais.

## Definições pendentes antes de implementar

1. **Proposta → Hábito:** termos, participação, início da prática e posição do período de teste no percurso; quem solicita e confirma a passagem.
2. **Hábito → Experiência:** critérios observáveis, evidências da continuidade/costume e permissões, sem presumir um número de dias ou práticas.
3. **Experiência → Essência:** critérios de consolidação, elegibilidade, consentimentos e relação com os critérios conceituais anteriores.
4. **Histórico individual:** dados e evidências de cada passagem, vínculo com a prática/termos e proteção contra inferência do progresso de terceiros.
5. **Interface e agrupamento:** o que cada cartão representa, pessoas em etapas diferentes e significado de contagens coletivas.
6. **Exceções e legado:** revisões de termos, encerramento, novas adesões, saídas/reentradas, correção de registros, dados anteriores e recuperação da migração.

Não tratar essas pendências como regras já aprovadas. Não criar tabelas, campos, prazos, poderes administrativos, regressões de etapa ou conversões de registros apenas por inferência.

## Critérios para a próxima entrega funcional

- O percurso começa em Proposta e exige Hábito antes de Experiência, e Experiência antes de Essência.
- A etapa exibida corresponde à pessoa e à prática certas, sem avanço automático de outros membros.
- Cada passagem cumpre os critérios e as permissões que forem aprovados e possui histórico verificável.
- A implementação distingue evolução individual de situação operacional e conserva aceites por versão, isolamento e história.
- A interface prevê carregamento, vazio, erro e diferentes etapas individuais no mesmo contexto compartilhado.
- Migração e recuperação do legado precisam ser tratadas explicitamente. Não declarar conformidade funcional antes de implementar e validar.

## Continuidade

Próximo passo: fechar os critérios das três passagens e as demais pendências com o usuário, antes de desenhar o modelo de dados e implementar. [Registro da decisão](../registros/registro-v1.1.0-2026-10-18-imp-documentacao-acordos-fun-fluxo-proposta-habito-experiencia-essencia.md).
