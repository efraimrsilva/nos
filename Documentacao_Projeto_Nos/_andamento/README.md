# Andamento do Projeto Nós

**Versão vigente do projeto:** 0.12.0

Este diretório preserva o contexto operacional entre sessões e retomadas do projeto.

Entrega mais recente: [v0.12.0 — Conta e entrada](registros/registro-v0.12.0-2026-10-07-imp-conta-entrada-fun-recuperacao-integrada.md). [Contrato](funcionalidades/conta-entrada.md), [plano](planos/conta-entrada.md) e [diferenças visuais](../wireframes/comparacoes/2026-10-07-conta-entrada/index.html).

## Estrutura

- [Estado](estado.md): resumo canônico de retomada, decisões, contador, validações e próximo passo.
- [Histórico](historico.md): eventos relevantes em ordem cronológica.
- [Brag document](../brag/BRAG.md): contribuições do projeto com evidências.
- [Estado da primeira sessão](estado-atual.md): referência histórica.
- [Escolher caminho](funcionalidades/escolher-caminho.md): escopo e continuidade da primeira tela.
- [v0.1.0 — Escolher caminho](registros/registro-v0.1.0-2026-09-24-imp-tela-escolher-caminho-fun-entrada-nucleo.md): decisões iniciais e primeira tela.
- [v0.2.0 — Tipo de Núcleo](<registros/registro-v0.2.0-2026-09-25-01-imp-tela-tipo-nucleo-fun-selecao-vinculo.md>): seleção de tipo e continuidade para Propósito.
- [v0.2.0 — Versionamento e rastreabilidade](registros/registro-v0.2.0-2026-09-25-02-imp-documentacao-versionada-fun-rastreabilidade.md): adequação documental e entrega GitHub.
- [v0.2.0 — Registro histórico](registros/registro-v0.2.0-2026-09-25-03-imp-padronizacao-registro-historico-fun-rastreabilidade.md): padronização retrospectiva e correção da máscara sequencial.
- [v0.3.0 — Propósito do Núcleo](registros/registro-v0.3.0-2026-09-27-imp-tela-proposito-nucleo-fun-rascunho-local.md): campos, sugestão e conferência local.
- [v0.4.0 — Autenticação, criação e convite](registros/registro-v0.4.0-2026-09-27-imp-integracao-supabase-fun-criacao-convite.md): integração Supabase validada com contas reais no desenvolvimento.
- [v0.5.0 — Home do Núcleo](registros/registro-v0.5.0-2026-09-27-imp-home-nucleo-fun-resumo-protegido.md): primeira Home protegida com dados existentes e estados honestos.
- [v0.6.0 — Agenda interna](registros/registro-v0.6.0-2026-09-27-01-imp-agenda-interna-fun-eventos-nucleo.md): eventos, respostas e isolamento validados no desenvolvimento.
- [v0.7.0 — Tela 04 Acordos](registros/registro-v0.7.0-2026-09-28-imp-hub-acordos-fun-propostas-consentimento.md): propostas e consentimento com migração e três contas verificadas no `nos-dev`.
- [v0.8.0 — Tela 05 Detalhe do Hábito](registros/registro-v0.8.0-2026-09-29-imp-detalhe-habito-fun-consulta-proposta-teste.md): leitura protegida da proposta em teste, validada com contas locais.
- [v0.9.0 — Registro de momento](registros/registro-v0.9.0-2026-09-29-imp-registro-momento-habito-fun-historico-real.md): ação real da Tela 06 e histórico protegido, validados localmente com contas.
- [v0.6.0 — Análise de frameworks de IA](registros/registro-v0.6.0-2026-09-29-imp-analise-frameworks-ia-fun-apoio-conversas.md): comparação documental de opções para eventual apoio a conversas, sem implementação de IA.
- [v0.6.0 — Pesquisa de ferramentas para a stack](registros/registro-v0.6.0-2026-09-29-imp-pesquisa-ferramentas-stack-fun-qualidade-operacao.md): recomendações de qualidade, segurança e operação sem novas dependências.
- [Frontend web](tecnologias/frontend.md): organização técnica, segurança e verificações.
- `registros/`: arquivos por versão, data e finalidade, preservando a cronologia e as decisões anteriores.
- `tecnologias/<nome>.md`: criar quando uma tecnologia tiver decisões, configuração ou pendências que justifiquem acompanhamento próprio.
- `funcionalidades/<nome>.md`: criar quando uma funcionalidade tiver escopo, etapas e critérios de aceite próprios.

## Protocolo de atualização

1. Atualizar `estado.md` quando uma decisão, o escopo ou o próximo passo mudar.
2. Acrescentar eventos relevantes em ordem cronológica em `historico.md`; detalhes específicos podem ficar no registro diário legado ou em arquivos temáticos.
3. Registrar caminhos afetados, motivo, validação executada e a próxima ação concreta.
4. Nunca registrar segredos, tokens, dados pessoais reais ou conteúdo íntimo de Núcleos.
5. Em cada interação de trabalho, consultar o estado atual e atualizar os arquivos afetados antes da entrega. Revisar a coerência dos demais; não alterar documentos sem mudança relevante apenas para atualizar datas.
6. Separar claramente o que foi aprovado, proposto, implementado, verificado e o que continua pendente. Aprovação da direção não equivale a aprovação de toda a arquitetura.
7. Para cada tela, implementação, funcionalidade ou mudança, criar novo registro em `registros/` com título `Registro — v<versão> — AAAA-MM-DD — Imp. de <implementação> com Fun. <funcionalidade>` e arquivo `registro-v<versao>-AAAA-MM-DD-imp-<implementacao>-fun-<funcionalidade>.md`. Para vários registros da mesma versão e data, inserir `-01`, `-02`, etc. após a data: `registro-v<versao>-AAAA-MM-DD-01-imp-<implementacao>-fun-<funcionalidade>.md`. Incluir versão, status, objetivo, contexto, requisitos, decisões técnicas, arquivos alterados, integrações, validações, resultado, limitações e próximos passos. Indexar cada registro em `estado.md`. Durante desenvolvimento usar versão vigente e `Em andamento`; ao concluir, revisar e validar, classificar PATCH/MINOR/MAJOR, sincronizar manifestos e renomear título/arquivo. Documentação isolada não incrementa a versão. O registro da primeira tela foi migrado com sua versão histórica comprovada.
8. Manter detalhes em um único documento responsável pelo tema e usar links nos resumos para evitar versões contraditórias.
9. Ao retomar após troca de sessão ou compactação, ler este índice, o estado atual e os registros/temas relevantes; confirmar a situação dos arquivos e do Git antes de agir.
10. O monitor automático foi cancelado a pedido do usuário. Atualizações ocorrem durante as interações; novas mudanças externas serão informadas manualmente.

## Versão do aplicativo e edições documentais

A versão central do aplicativo é a indicada em `estado.md`, `package.json` e `package-lock.json`. Arquivos conceituais `Projeto_Nos_v1.x` e `Projeto_Nos_v2.x` usam numeração de edição documental; ela não representa a versão do aplicativo e não deve ser renomeada a cada entrega. Documentos de acompanhamento atualizados identificam a versão vigente; registros de entregas anteriores preservam sua versão histórica.

## Indicador de contexto

Em 2026-09-24, o usuário dispensou qualquer informação sobre percentual ou indicador de contexto nas respostas. A continuidade permanece protegida por estes arquivos.

## Wireframe vivo e materiais de origem

**Prioridade alta, definida em 2026-10-05:** toda criação, implementação, alteração ou revisão de tela começa pela inspeção visual do modo **Atlas vivo**, incluindo aspecto, identidade, abas, ícones, navegação e estados. Esse desenho orienta prioritariamente a interface; o desenho anterior é comparação. Conferir fidelidade antes de entregar e atualizar o atlas junto ao recorte. Seguir o [procedimento obrigatório](../wireframes/GUIA.md#prioridade-alta-do-atlas-vivo--decisão-de-2026-10-05), lendo também as pendências e permissões da ficha.

Decisão de 2026-10-03: manter o [wireframe](../wireframes/atlas/index.html) atualizado para refletir todo o desenvolvimento atual e futuro. Cada entrega que alterar a experiência deve atualizar desenhos, fichas, fluxos e [pendências](../wireframes/COBERTURA.md) correspondentes, com situação fiel ao código e validações. Detalhes no [guia](../wireframes/GUIA.md) e em [estado.md](estado.md).

Os materiais de origem foram movidos pelo usuário para [Telas](../Telas/Nos_App.dc.html), dentro de **Documentacao_Projeto_Nos**. Preservar essa organização; o protótipo antigo é fonte histórica, enquanto o atlas é mantido continuamente.

## Próxima implementação

A confirmação do Hábito após teste foi concluída na v0.11.0. Retomar o contrato de Nossa Árvore e manter o wireframe sincronizado com o recorte aprovado.

- [Próximo recorte — Nossa Árvore](funcionalidades/nossa-arvore.md): fontes, base real, lacunas e critérios de aceite.
