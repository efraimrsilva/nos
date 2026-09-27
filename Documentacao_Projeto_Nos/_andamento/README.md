# Andamento do Projeto Nós

**Versão vigente do projeto:** 0.6.0

Este diretório preserva o contexto operacional entre sessões e retomadas do projeto.

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
