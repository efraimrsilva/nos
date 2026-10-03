# Publicação Git — 2026-10-03 — Atlas vivo e organização dos materiais de referência

**Referência funcional:** v0.11.0, sem incremento de versão. **Autorização:** usuário solicitou commit e push para o GitHub, com descrição abrangendo todo o trabalho deste momento. Registro integrado ao mesmo commit lógico.

## Escopo do commit

- Atlas offline completo com Conta primeiro, 72 telas/estados, oito áreas e 12 percursos; cobertura das 37 interfaces de origem.
- Prévia por tela, disposição celular/Web, busca, filtros, estados, contratos, permissões, destinos e pendências: 45 telas planejadas e 27 recortes existentes.
- Fontes, árvore e licenças locais, sem dependências novas ou operações reais de conta, votos, gravações e mensagens.
- Guia, inventário, histórico, Brag e registros de criação/manutenção; regra permanente de atualização do wireframe junto a todo desenvolvimento atual e futuro.
- Movimentação dos 35 arquivos de Telas para Documentacao_Projeto_Nos/Telas, feita pelo usuário, preservando conteúdo; referências corrigidas e ignore de desktop.ini ajustado ao novo local.
- Continuidade da próxima implementação: fechar contrato de Nossa Árvore, manter a Tela 38 sincronizada e preservar limites de dados/permissões.

Código de aplicação, banco e manifestos permanecem inalterados. Arquivos temporários de execução/capturas e credenciais permanecem fora do commit.

## Preparação e validação

Branch main, HEAD inicial e3643b69dd323b78ac348e4033f3e936a8a1fca0. Fetch de origin concluído; divergência inicial 0/0. Verificação do atlas repetida: 72 prévias, saídas, 360 estados, 12 percursos, filtros, busca, teclado, Web, móvel e impressão CSS; zero erros JavaScript. Movimentação confrontada com Git: 35 arquivos correspondem à origem, quatro textos normalizados pelos filtros de fim de linha. Links locais e formatação conferidos.

Verificações finais aprovadas: 84 testes Playwright desktop/mobile, npm.cmd run typecheck e npm.cmd run build; 617 links locais em toda a documentação/README, diff e conjunto preparado conferidos. Revisão independente final sem achado bloqueante no atlas ou escopo. O conjunto contém 60 arquivos, incluindo 35 renomes R100. Manifestos e código de aplicação sem alteração. O objeto Git foi inspecionado: todos os arquivos previstos, as 35 movimentações R100 e a descrição abrangente estão no commit. A pendência documental foi removida somente depois dessa inspeção e a atualização incorporada ao mesmo commit antes do push. A confirmação final do envio compara HEAD com refs/heads/main diretamente no GitHub; o hash final pode ser consultado no commit desta publicação. Não confundir publicação Git com deploy do aplicativo.

## Descrição abrangente

Título: **docs(wireframe): publicar atlas vivo completo e organizar referências do Projeto Nós**.

Corpo do commit descreve criação, cobertura, navegação/estados, contratos/pendências, manutenção contínua, reorganização, validações e preservação da versão funcional. Nenhuma publicação pública do app faz parte desta autorização.

## Próximo passo

Retomar Nossa Árvore pelo contrato registrado e manter o wireframe atualizado junto à entrega. As pendências de produto permanecem explícitas no inventário; este commit publica o material de planejamento e continuidade.
