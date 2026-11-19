# Registro — v0.8.0 — 2026-09-29 — Imp. de detalhe do hábito com Fun. consulta da proposta em teste

**Versão vigente do projeto:** 0.8.0
**Status:** recorte inicial concluído em 2026-09-29; demais elementos da Tela 05 pendentes.

## Objetivo e contexto

Abrir o recorte inicial da Tela 05 a partir de uma proposta real de Hábito em teste, preservando a diferença entre proposta consentida em teste e acordo ativo. A Tela 04 já armazena título, descrição, momento, frequência, data, estado e respostas individuais.

## Requisitos e decisões técnicas

- A rota `/nucleos/[id]/acordos/[agreementId]` exige sessão e vínculo ao Núcleo. A consulta filtra identificador, Núcleo, categoria `habit` e estado `testing`, além da RLS existente.
- Exibir apenas os dados existentes e a própria resposta. A data usa UTC identificado na interface.
- Retornar a Acordos e permitir abertura separada da agenda. Histórico, reflexões, progresso, revisão e evento associado não possuem contrato persistido; a tela informa a indisponibilidade sem números ou exemplos simulados.
- Não há migração nesta fatia: a leitura usa as tabelas e políticas da v0.7.0. A próxima tela de ações só será iniciada após definir dados, permissões e consentimento.

## Arquivos e integrações

- `src/app/nucleos/[id]/acordos/[agreementId]/page.tsx`: página de detalhe protegida e leitura da proposta.
- `src/app/nucleos/[id]/acordos/page.tsx`: link apenas nos Hábitos em teste.
- `tests/habit-detail.spec.ts`: regressão de rota sem sessão.

## Validações e resultado

O teste de ausência de sessão falhou antes da rota e passou depois em desktop e móvel. A suíte geral aprovou 70 testes; checagem de tipos e build aprovaram a rota dinâmica. Revisão independente encontrou data UTC sem indicação, corrigida. Com o Supabase local e três contas temporárias, a interface confirmou acesso de criador e integrante, navegação pelo link em Acordos, negativa para outra pessoa/Núcleo, rejeição de Hábito pendente e Experiência, e resposta própria. A consulta autenticada de participantes retornou somente a linha da pessoa. Dados temporários foram removidos. A versão 0.7.0 → 0.8.0 é MINOR pela nova rota e apresentação funcional.

## Limitações e próximos passos

Abas de histórico e reflexões, calendário de prática, progresso, próxima revisão, impacto esperado, linguagem de cuidado e evento associado continuam sem contrato ou interface operacional. A Tela 06 deve definir separadamente o registro de momento (autoria, visibilidade e histórico) e a revisão (estados e consentimento para alterações), com integração ao detalhe e validação entre Núcleos. Completar os demais itens da Tela 05 somente quando houver dados reais. O teste autenticado foi local; a nova rota não foi revalidada no `nos-dev`. O app não foi publicado.
