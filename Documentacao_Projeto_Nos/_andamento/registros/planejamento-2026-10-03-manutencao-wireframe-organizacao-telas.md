# Planejamento — 2026-10-03 — Manutenção contínua do wireframe e organização de Telas

**Status:** decisão registrada; referências atualizadas. **Versão funcional de referência:** v0.11.0, preservada. Esta é uma atualização documental, sem nova versão de desenvolvimento.

## Objetivo e contexto

Após a criação do atlas, o usuário determinou sua atualização contínua para refletir todo o desenvolvimento atual e futuro. Informou também que moveu a pasta Telas para dentro da documentação. As alterações locais do atlas e dos registros já existiam; foram preservadas. A movimentação feita pelo usuário foi reconhecida, sem refazê-la ou recriar a pasta antiga.

## Decisão vigente

O wireframe passa a ser uma referência visual viva. Toda entrega que afetar tela, rota, navegação, regra, permissão, dado ou estado de interface deve atualizar os desenhos e fichas correspondentes, junto da documentação do mesmo conjunto lógico. Antes de encerrar, conferir o atlas contra o comportamento efetivamente implementado, mantendo elementos futuros e pendências identificados.

Manter IDs estáveis, cobertura e percursos coerentes; registrar acréscimos/consolidações. Atualizar a referência funcional quando a versão real do aplicativo mudar. Editar o wireframe ou a documentação isoladamente não exige incremento da versão do aplicativo.

## Organização dos materiais

Local vigente: `Documentacao_Projeto_Nos/Telas/`, com protótipo HTML, ícone, PDF, imagens e extrações. Esses materiais preservam a origem histórica; o [atlas](../../wireframes/atlas/index.html) acompanha a evolução atual. [Abrir protótipo](../../Telas/N%C3%B3s%20App.dc.html).

## Arquivos envolvidos

- `estado.md`: regra permanente, organização, próximo passo, contador e pendência documental.
- `historico.md`: evento desta decisão e movimentação.
- `_andamento/README.md`: manutenção do atlas no protocolo de continuidade e próxima implementação atualizada.
- `wireframes/GUIA.md` e README principal: referência viva, manutenção por entrega e link corrigido.
- Referências de caminho em estado histórico, funcionalidade Escolher caminho e registros v0.1.0, v0.2.0 e v0.3.0: somente localização do material atualizada, sem alterar decisões ou versões históricas.

## Validação, resultado e limites

251 links locais dos documentos afetados conferidos sem alvo ausente. Os 35 arquivos de Telas foram encontrados no destino e correspondem ao conteúdo versionado em HEAD; quatro arquivos textuais exigiram normalização pelos filtros de fim de linha do Git, sem diferença de conteúdo. Autorrevisão do diff e `git diff --check` aprovados; contador atualizado para 72 e manifestos sem alteração. Não há alteração em código de aplicação, desenho, interações do atlas, banco ou manifestos; verificações funcionais do app e do atlas da entrega anterior não foram repetidas nesta atualização de texto e caminhos.

Superpowers de orientação e verificação aplicados. Nenhuma consulta de framework ou pesquisa avançada de dependências necessária; sem instalação. A regra foi persistida no repositório, não na memória global do Codex.

## Próximo passo

Retomar a definição de Nossa Árvore a partir da Tela 38 e das fontes existentes, fechando o contrato de dados antes da implementação. Atualizar o wireframe junto à entrega correspondente. A unidade local de documentação/atlas e organização de Telas continua pendente de commit autorizado.
