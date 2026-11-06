# Registro — v3.7.2 — 2026-11-06 — Imp. de revisão documental dos acordos com Fun. de consolidação em Hábito

**Versão do aplicativo:** 3.7.2, preservada. **Status:** concluído documentalmente; alterações locais, sem commit, push ou deploy. As edições conceituais v1.1–v2.8 mantêm seus identificadores.

## Objetivo, contexto e requisitos

Por decisão do usuário, este chat trata somente dos 19 documentos Projeto_Nos_v1.1 até Projeto_Nos_v2.8. Hábito e Experiência repetiam responsabilidades; remover Experiência como etapa/categoria e consolidar em Hábito em todos os pontos dependentes desse conjunto. Manter continuidade e evidências sem implementar alterações no produto.

## Decisões

- Percurso vigente: **Proposta → Hábito → Essência**, substituindo a direção de quatro etapas de 18/10/2026. A definição responsável fica na [v1.1](../../Projeto_Nos_v1.1_Visao_e_Regras_de_Negocio.md#fluxo-vigente-dos-acordos); os outros documentos apontam para ela.
- Hábito reúne prática, momentos, revisões e amadurecimento individual. Eventos organizam ocorrências; registros e memórias guardam o que foi vivido. Não criar entidade substituta para Experiência.
- Jantar romântico mensal passa a exemplificar Hábito com agendamento, reutilizando Telas 05/06. A referência 21 do catálogo é preservada para rastreabilidade, sem tela paralela de Experiência.
- Retirar aba/categoria, tipo de evento/memória/convite e campos conceituais exclusivos da etapa removida. Presença no evento não aceita nem promove um acordo.
- Critérios das duas passagens e compatibilidade com dados legados permanecem pendentes de definição. Não criar prazos, promoção automática ou novos limiares. O contrato administrativo e o consentimento individual permanecem; votações históricas não são restabelecidas.
- Preservar usos genéricos de experiência do usuário, vivência, ideias de presentes e experiência simbólica da árvore (exp), distinguindo-os explicitamente na v1.1.
- Mudança exclusivamente documental: manter versão 3.7.2 e manifestos intactos, conforme exceção do AGENTS.md e protocolo de andamento.

## Arquivos e integrações

Revisados e atualizados os 19 documentos conceituais v1.1–v1.10 e de interface v2.0–v2.8, incluindo síntese, catálogo, fluxos, componentes, modelo, permissões, estados, notificações e segurança. Nos quatro últimos, a alteração é a referência à direção documental vigente; não havia contrato próprio de Experiência a remover.

Atualizados também [estado](../estado.md), [histórico](../historico.md) e [Brag](../../brag/BRAG.md), além deste registro. DOCS_DIR: Documentacao_Projeto_Nos. Git inicial limpo; branch main; base b35e4a9.

## Validações e revisão

- Leitura dos 19 documentos, conferência dos contextos e busca residual das formas acentuadas/técnicas do termo.
- Conferência da sequência, duas transições, abas, exemplos, tipos de evento, associações e identificadores: sem categoria Experiência, experienciaId ou conviteExperiencia nas especificações vigentes do recorte. O tipo de desejo “experiência” permanece como ideia de presente.
- 366 links locais/âncoras conferidos nos 19 documentos: 365 válidos e um destino ausente preexistente na v2.8, descrito abaixo; nenhuma referência nova quebrada.
- Autorrevisão do diff e revisão independente do subagente revisao_documental. Sem achados de gravidade alta/média; ajustes editoriais P3 corrigidos e reconferidos (conjunções, concordância e repetição de “momentos”).
- git diff --check aprovado. Verificação final do escopo restrita a Markdown dentro de Documentacao_Projeto_Nos.
- Build, tipos e testes do aplicativo não executados: nenhuma alteração de código, banco ou Atlas, seguindo validação proporcional para documentação.

## Resultado e limitações

A especificação do conjunto usa Proposta → Hábito → Essência e concentra prática/amadurecimento em Hábito. A simplificação é documental; não certifica migração de dados, interface, Atlas ou comportamento em produção.

O link da v2.8 para _andamento/tecnologias/frontend.md já apontava para arquivo ausente no HEAD inicial e foi preservado por estar fora do tema. Demais defeitos históricos e contratos antigos de aprovação não foram reescritos.

O contrato operacional de quatro etapas em _andamento/funcionalidades/fluxo-proposta-habito-experiencia-essencia.md, os planos, testes e Atlas ficam fora do conjunto solicitado. A nova regra prevalece para esta revisão; a eventual adaptação desses materiais e do aplicativo deve partir da v1.1 e preservar o histórico.

## Ferramentas

Superpowers: entendimento, revisão e verificação. Node.js e buscas locais rg para leitura, edição e validação. Context7 disponível no ambiente, sem necessidade de consulta a bibliotecas/APIs nesta revisão textual. Octocode sem ferramenta exposta na sessão; pesquisa avançada de código/dependências não necessária, sem instalação ou configuração alterada.

## Próximos passos e commit

Aguardar a próxima alteração documental do usuário. Para revisão manual: abrir a v1.1, conferir a sequência e seguir para v2.1 (Telas 04/21/23), v2.2 (fluxos 5/6) e v2.4 (Acordo, Memória, Evento, Convite e Aprovação). Conferir que o evento organiza a prática e não cria nova etapa.

Uma unidade pronta para commit: consolidação documental de Experiência em Hábito, com seus registros. Sugestão: docs(acordos): consolidar Experiencia em Habito nas especificacoes. Publicação exige autorização específica.
