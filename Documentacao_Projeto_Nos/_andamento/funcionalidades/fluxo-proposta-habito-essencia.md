# Fluxo vigente — Proposta → Hábito → Essência — v3.8.0

**Direção aprovada:** 06/11/2026. **Status local:** apresentação e compatibilidade do legado implementadas; Essência e transições individuais somente esboços, conforme orientação explícita do usuário, com o mesmo informe de Manifesto. Sem publicação/migração remota nesta entrega.

## Regra central

O percurso é **Proposta → Hábito → Essência**. Experiência deixa de existir como etapa, categoria de acordo ou módulo independente. Hábito reúne prática, registros, revisões e amadurecimento. A [definição conceitual responsável](../../Projeto_Nos_v1.1_Visao_e_Regras_de_Negocio.md#fluxo-vigente-dos-acordos) orienta este contrato operacional de planejamento.

| Conceito | Responsabilidade | Limite |
|---|---|---|
| Proposta | Intenção e termos compartilhados para decisão individual | Publicar não aceita por ninguém nem comprova prática |
| Hábito | Prática, momentos, revisões e amadurecimento da pessoa no combinado | Situação em teste/ativo não comprova etapa individual ou frequência cumprida |
| Essência | Possível consolidação de uma prática como valor identitário | Critérios, consentimento e relação individual/coletivo precisam de definição; sem promoção automática |
| Evento | Data, horário, recorrência quando implementada, participantes e presença | Aceitar presença não aceita os termos de um acordo nem cria momento |
| Momento | Registro voluntário do que foi vivido | Reutilizar registro/histórico do Hábito; foto e Memórias dependem de contratos próprios |

Um jantar mensal pode ser Hábito, cada jantar marcado pode ser um evento associado e seu registro compõe o mesmo histórico. Evento livre não exige Hábito. Sem acordo associado, não usar a gravação de Hábito para simular memória de um evento.

## Autonomia e transições

Permanece o [contrato administrativo](administracao-participacao.md): administradores equivalentes gerenciam o ciclo; cada pessoa aceita, recusa ou deixa sua participação. Mudança dos termos requer novo aceite individual. Saída ou recusa individual não encerra o acordo coletivo. Não restaurar quórum ou votação do modelo histórico.

As duas passagens ainda exigem decisões antes da entrega funcional:

1. **Proposta → Hábito:** relação entre aceite da pessoa, início da prática, período de teste e ações administrativas; ator e evidência da passagem.
2. **Hábito → Essência:** evidências de amadurecimento, elegibilidade, atores e consentimentos, relação entre evolução da pessoa e reconhecimento coletivo, revisão e manutenção.

Não definir dias, quantidade de registros, pontuação, regressão de etapa ou promoção por inferência. Os seis meses e percentuais de documentos históricos não são revalidados pela simplificação. Categorias globais e estados operacionais não autorizam inferir avanço de todos.

## Implementação local — v3.8.0 — 06/11/2026

O quadro apresenta Propostas, Hábitos e Essência planejada; Painéis e lista móvel seguem o mesmo contrato. Nova proposta continua sem categoria pública e força `habit`. O parser público rejeita `experience`; a RPC (chamada de procedimento remoto) normaliza esse argumento de clientes antigos para `habit`, sem fabricar prazo ou aceite. O formulário atual mantém teste inteiro de 7–30 dias.

Registros existentes `experience` conservam categoria técnica, IDs, termos, versões, datas, participações e histórico; detalhe, histórico e momentos reutilizam o Hábito. A função de momentos exige vínculo atual, mesmo Núcleo, estado testing/active e aceite da versão vigente. Isso é compatibilidade, sem conversão em massa ou criação de estágio individual. O inventário local inicial tinha zero acordos; cenários foram exercitados com dados descartáveis e limpos. Nenhum inventário remoto realizado.

Essência oferece apenas a prévia “Nossa Essência”, sem formulário de promoção nem persistência, usando `FeatureSketchNotice` com título e texto de Manifesto. Acesso pelo quadro, lista móvel e Painéis. Modais preservam X/Escape/fora e retorno do foco. IDs34/35 continuam refinamentos planejados de Hábito/Agenda; IDs e situações das73 fichas preservados.

Migração `20261106123120_consolidate_habit_compatibility.sql` substitui somente criação/registro. Recuperação em `supabase/rollback/20261106123120_consolidate_habit_compatibility.sql`; restaurar funções anteriores em transação e voltar ao aplicativo compatível, sem apagar dados ou reescrever histórico. Recuperação ensaiada em transação descartada; definições novas permaneceram intactas.

## Conversão física futura do legado — requisitos antes de migrar dados

- Inventariar no ambiente autorizado acordos `experience`, estados, versões, participações, momentos e eventos relacionados; registrar somente totais não identificáveis.
- Definir e revisar o mapeamento para Hábito, sem atribuir estágio individual fictício. Preservar IDs e referências, autoria conforme política vigente, momentos, versões dos termos e suas evidências de aceite.
- Distinguir mudança técnica de categoria de alteração dos termos. Se os termos mudarem, exigir novo aceite conforme contrato vigente; não fabricar consentimentos nem reutilizar respostas para novos termos.
- Preparar migração versionada, recuperação e validação de leitura/escrita. Conferir ordenação de implantação e compatibilidade com versões do aplicativo ainda em uso antes de restringir enums ou validações.
- Retirar a categoria pública da apresentação e dos contratos atuais apenas com a compatibilidade coberta. Não apagar dados ou reescrever migrações já aplicadas.

Nesta entrega não há conversão física, execução remota ou remoção de dados. A categoria técnica pode permanecer enquanto houver necessidade de compatibilidade; eliminá-la fisicamente exige o procedimento acima. [Plano de adequação](../planos/adequacao-aplicativo-habito.md).

## Atlas, MVP e dependências

- **Etapa 03:** adequação do fluxo já existente e compatibilidade do legado; manter consentimento e gestão atuais. Não declarar encerrada a pendência apenas por atualizar o desenho.
- **Etapa 04:** agenda interna permanece; associação a acordo e recorrência dependem da etapa 06. Evento livre continua disponível.
- **Etapa 06:** proposta guiada, reflexões, impacto, cuidado e integração Hábito/evento/momento. Fichas 34/35 reutilizam 24/25/27.
- **Etapa 07:** possível passagem Hábito → Essência, Árvore e marcos, depois de fechar critérios e fontes.
- **Etapas 08–12:** consumir acordos, eventos e momentos reais, sem nova entidade Experiência, respeitando visibilidade, preferências e consentimento.

## Aceite e histórico

Desenhos, fichas, percursos, MVP, Visão global e cobertura devem usar a sequência de três etapas. Não oferecer rota `/experiencias`, registro paralelo ou ação “Manter como Experiência”. Preservar estados de carregamento, vazio, erro, permissão e sucesso; prévia offline não grava dados.

O [contrato de quatro etapas](fluxo-proposta-habito-experiencia-essencia.md), os protótipos importados, migrações e galerias datadas são históricos. Sua manutenção não restaura a etapa removida. Usos genéricos de experiência do usuário, presentes/vivências e experiência simbólica da árvore não representam categoria de acordo.
