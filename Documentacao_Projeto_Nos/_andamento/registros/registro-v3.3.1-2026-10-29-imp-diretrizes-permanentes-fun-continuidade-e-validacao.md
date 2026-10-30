# Registro — v3.3.1 — 2026-10-29 — Imp. de diretrizes permanentes com Fun. continuidade e validação

**Versão do código:** 3.3.1, conforme package.json no início da tarefa. Sem incremento por mudança exclusivamente documental.
**Status:** diretrizes atualizadas localmente; sem commit, push, deploy ou operação de banco.

## Objetivo, contexto e requisitos

Reunir no AGENTS.md o essencial para desenvolver, validar, documentar e manter o projeto atualizado. O usuário reforçou a consulta à documentação antes da conclusão. A primeira edição foi ampliada após revisão cruzada dos procedimentos, contratos e registros do projeto.

## Fontes e decisões

- Protocolo de `_andamento/README.md`, estado canônico, histórico, planos e registros: rastreabilidade por entrega, fontes por tema, preservação dos marcos e distinção entre aprovação, implementação e evidência.
- Documentos conceituais 1.x/2.x e contratos: princípios de cuidado, consentimento, privacidade, ausência de ranking/chat e precedência da administração/participação individual sobre votações históricas. Evolução individual permanece sujeita ao contrato e às adequações pendentes.
- GUIA, FIDELIDADE, COBERTURA, comparações e contrato de modais: referência visual viva, sincronização das visões, IDs, estados, evidência antes/depois e padrão de galerias.
- Processo e resultados dos testes de caixa preta: casos estáveis por MVP/Expansão, preservação de falhas e retestes, sem aprovação manual derivada de automação.
- README, frontend, scripts de package.json e documentação de e-mails/testes legados: ambiente reproduzível, verificações proporcionais, separação local/remoto e limites de publicação.

As regras anteriores de versionamento e Atlas foram mantidas. Não foi adotada infraestrutura nova nem presumida disponibilidade de ferramentas citadas no histórico. O AGENTS.md aponta os procedimentos responsáveis por detalhes operacionais, evitando copiar contratos completos.

## Arquivos alterados e integrações

AGENTS.md, `_andamento/estado.md`, `_andamento/historico.md` e este registro. Sem alteração de implementação, representação do Atlas, manifestos ou integrações externas nesta tarefa. Mudanças locais preexistentes nesses outros arquivos foram preservadas.

## Validações, resultado e limites

Revisão textual das diretrizes, conferência dos caminhos citados, comparação com o protocolo documental e `git diff --check` no conjunto documental. Build, tipos, testes do aplicativo, verificação interativa do Atlas e testes de caixa preta não se aplicam a esta mudança textual e não foram executados.

Não foi feita auditoria integral da implementação nem certificação de produção. Divergências históricas de versões e situações em outros documentos não foram reclassificadas como verificações atuais. As fontes antigas continuam preservadas.

## Próximos passos

Aplicar o AGENTS.md nas próximas entregas. Manter esta unidade documental pendente de commit até autorização de publicação e comprovação de sua inclusão no objeto Git.
