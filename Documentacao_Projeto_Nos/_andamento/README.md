# Andamento do Projeto Nós

Este diretório preserva o contexto operacional entre sessões e retomadas do projeto.

## Estrutura

- [Estado](estado.md): resumo canônico de retomada, decisões, contador, validações e próximo passo.
- [Histórico](historico.md): eventos relevantes em ordem cronológica.
- [Brag document](../brag/BRAG.md): contribuições do projeto com evidências.
- [Estado da primeira sessão](estado-atual.md): referência histórica.
- [Escolher caminho](funcionalidades/escolher-caminho.md): escopo e continuidade da primeira tela.
- [Frontend web](tecnologias/frontend.md): organização técnica, segurança e verificações.
- [Registro de 2026-09-24](registro-2026-09-24.md): decisões e alterações desta sessão.
- `registro-AAAA-MM-DD.md`: histórico por data, com novas entradas acrescentadas sem apagar decisões anteriores.
- `tecnologias/<nome>.md`: criar quando uma tecnologia tiver decisões, configuração ou pendências que justifiquem acompanhamento próprio.
- `funcionalidades/<nome>.md`: criar quando uma funcionalidade tiver escopo, etapas e critérios de aceite próprios.

## Protocolo de atualização

1. Atualizar `estado.md` quando uma decisão, o escopo ou o próximo passo mudar.
2. Acrescentar eventos relevantes em ordem cronológica em `historico.md`; detalhes específicos podem ficar no registro diário legado ou em arquivos temáticos.
3. Registrar caminhos afetados, motivo, validação executada e a próxima ação concreta.
4. Nunca registrar segredos, tokens, dados pessoais reais ou conteúdo íntimo de Núcleos.
5. Em cada interação de trabalho, consultar o estado atual e atualizar os arquivos afetados antes da entrega. Revisar a coerência dos demais; não alterar documentos sem mudança relevante apenas para atualizar datas.
6. Separar claramente o que foi aprovado, proposto, implementado, verificado e o que continua pendente. Aprovação da direção não equivale a aprovação de toda a arquitetura.
7. Ao criar um arquivo temático, incluir objetivo, status, decisões, dependências, verificações e próxima ação; adicioná-lo a este índice.
8. Manter detalhes em um único documento responsável pelo tema e usar links nos resumos para evitar versões contraditórias.
9. Ao retomar após troca de sessão ou compactação, ler este índice, o estado atual e os registros/temas relevantes; confirmar a situação dos arquivos e do Git antes de agir.
10. O monitor automático foi cancelado a pedido do usuário. Atualizações ocorrem durante as interações; novas mudanças externas serão informadas manualmente.

## Indicador de contexto

Em 2026-09-24, o usuário dispensou qualquer informação sobre percentual ou indicador de contexto nas respostas. A continuidade permanece protegida por estes arquivos.
