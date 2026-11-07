# Registro — v3.8.0 — 2026-11-06 — Imp. de diretrizes com Fun. de sugestão de testes de caixa preta

- **Versão:** 3.8.0; sem incremento por alteração exclusivamente documental.
- **Status:** Concluído documentalmente; incluído na unidade de publicação autorizada desta diretriz. O objeto Git é conferido no registro de publicação consolidada.
- **Objetivo/contexto:** atender ao pedido de substituir geração automática de testes de caixa preta por sugestões breves ao concluir cada entrega, deixando a decisão ao usuário.
- **Requisitos:** descrição curta semelhante à descrição de commit/push; não criar nem ampliar roteiros antes da decisão; preservar casos e resultados existentes.
- **Decisões:** substituída explicitamente a exigência de ao menos um caso por funcionalidade. Autorizações explícitas já dadas para o escopo continuam válidas. Ausência de autorização para roteiro não bloqueia entrega tecnicamente validada. Verificações técnicas aplicáveis continuam exigidas. Sugestões apenas quando pertinentes.
- **Arquivos alterados:** [AGENTS.md](../../../AGENTS.md), [protocolo](../testes-caixa-preta/README.md), [estado](../estado.md), [histórico](../historico.md) e este registro.
- **Integrações:** instruções permanentes, manutenção de roteiros e comunicação final alinhadas; nenhum código, caso de teste ou resultado alterado.
- **Validações:** autorrevisão das alterações documentais, conferência dos links locais e git diff --check; sem testes ou build do aplicativo por ausência de mudança de produto. Sem revisão independente.
- **Resultado:** regra vigente documentada e indexada; histórico da regra substituída explicitado no protocolo. Benefício esperado: controle do usuário sobre elaboração e realização dos testes, sem impacto medido.
- **Limitações:** nenhum roteiro novo preparado; não houve pesquisa técnica ou uso de Context7/Octocode, pois a entrega é documental. Superpowers de orientação e verificação aplicados. Alterações preexistentes de frameworks e preparação do login social preservadas.
- **Próximo passo:** nas próximas entregas funcionais, sugerir em uma frase os testes pertinentes e aguardar decisão antes de criar ou ampliar o roteiro.
