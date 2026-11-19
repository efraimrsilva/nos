# Registro — v3.8.0 — 2026-11-06 — Imp. de diretrizes com Fun. de avaliação de frameworks

- **Versão:** 3.8.0, preservada por ser mudança exclusivamente documental.
- **Status:** Concluído documentalmente; incluído na unidade de publicação autorizada desta diretriz. O objeto Git é conferido no registro de publicação consolidada.
- **Objetivo/contexto:** atender à orientação do usuário de verificar, de forma bem rápida e criteriosa, se algum framework facilita o desenvolvimento e agrega valor a cada nova funcionalidade ou evolução de impacto médio ou grande.
- **Requisitos:** avaliação antes da implementação; comparação com soluções existentes; decisão breve e rastreável, inclusive quando nenhum framework for adotado.
- **Decisões técnicas:** considerar compatibilidade, manutenção, maturidade, segurança, desempenho, custo e complexidade; consultar Context7/fontes oficiais para documentação técnica e Octocode em pesquisas avançadas quando aplicáveis. Evitar pesquisa extensa e dependências sem benefício demonstrável. Avaliar é obrigatório; adotar depende da justificativa.
- **Arquivos alterados:** [AGENTS.md](../../../AGENTS.md), [estado.md](../estado.md), [historico.md](../historico.md) e este registro.
- **Integrações:** diretriz aplicada ao planejamento e aos registros das próximas entregas; nenhuma integração de código alterada.
- **Validações realizadas:** conferência da regra contra o pedido, caminhos relativos, preservação das alterações preexistentes e autorrevisão do diff; git diff --check. Sem build ou testes do aplicativo, pois não houve mudança de código, interface ou Atlas. Sem revisão independente.
- **Resultado:** instrução permanente documentada no ponto de implementação do AGENTS.md; continuidade indexada. Benefício esperado: decisões de dependências mais conscientes; nenhum ganho de produtividade medido.
- **Limitações:** nenhum framework foi pesquisado, escolhido ou instalado nesta entrega. A avaliação concreta ocorrerá no escopo de cada funcionalidade elegível. Context7 e Octocode não foram consultados nesta mudança documental; Superpowers de orientação e verificação aplicados. Python indisponível no ambiente; edição realizada com Node.js já existente.
- **Próximos passos:** aplicar a diretriz no planejamento da próxima funcionalidade elegível, incluindo login social ainda em preparação; manter o trabalho preexistente separado ao preparar o commit documental.
