# Histórico de andamento

**Versão vigente do projeto:** 0.13.1

## 2026-10-07 — v0.13.1 — Alinhamento visual de Conta

- **Mudança de produto:** largura e árvore/frases estáveis entre cadastro/login; link inferior duplicado removido, mantendo retorno superior e composição de login. Atlas/ficha/galeria sincronizados.
- **Resultado:** 24 testes de Conta, tipos/build e medição em seis tamanhos aprovados; comparação específica de Conta e Visão global aprovadas. Revisão independente sem achados materiais restantes após corrigir escopo da regra CSS. Script geral de fidelidade limitado pela expectativa anterior de /comecar público.
- **Evidência:** [registro v0.13.1](registros/registro-v0.13.1-2026-10-07-imp-conta-fun-alinhamento-visual.md) e [galeria](../wireframes/comparacoes/2026-10-07-conta-alinhamento/index.html). Alterações locais, sem commit/push/deploy.

## 2026-09-24 — Primeira tela do app

- **Mudança:** base Next.js, tela Escolher caminho, rotas preparatórias e documentação de frontend.
- **Resultado:** fluxo acessível e responsivo; oito testes Playwright, build e verificação de tipos passaram na entrega original.
- **Evidência:** [registro da sessão](registros/registro-v0.1.0-2026-09-24-imp-tela-escolher-caminho-fun-entrada-nucleo.md), [escopo da tela](funcionalidades/escolher-caminho.md).

## 2026-09-24 — Context7

- **Evento:** servidor MCP Context7 instalado na configuração global do Codex; inicialização e ferramentas verificadas.
- **Evidência:** [registro da sessão](registros/registro-v0.1.0-2026-09-24-imp-tela-escolher-caminho-fun-entrada-nucleo.md). Configuração fora do Git do app.

## 2026-09-25 — Comentários no código

- **Mudança:** comentários concisos adicionados à política de cabeçalhos, entrada do onboarding, navegação centralizada, moldura compartilhada, links dos cartões e preferência de movimento reduzido.
- **Resultado:** decisões de integração e limites funcionais agora ficam registrados junto ao código; comportamento inalterado.
- **Validação:** revisão estática e `git diff --check`; sem execução de testes para o ajuste de comentários.
- **Próximo passo:** aguardar solicitação para implementar Tipo de Núcleo.

## 2026-09-25 — Diagnóstico da inicialização

- **Problema reproduzido:** `npm.cmd run dev` na pasta `Projeto Nós` falha com `ENOENT` porque o `package.json` está em `Projeto Nós\nos`.
- **Resultado:** o mesmo comando dentro de `nos` iniciou o Next.js em `http://127.0.0.1:3000`; a página `/comecar` abriu e exibiu os dois caminhos sem sobreposição de erro.
- **Ação:** README atualizado com o caminho absoluto e a orientação de manter o terminal aberto. O servidor temporário de diagnóstico foi encerrado para liberar a porta.

## 2026-09-25 — Comando `npm run dev` na pasta principal

- **Mudança:** `package.json` de lançamento criado na pasta principal do workspace, apontando para o app em `nos`; README atualizado com o comando simples.
- **Resultado:** `npm run dev` chegou ao Next.js. A execução encontrou uma instância do projeto já ativa em `127.0.0.1:3000`, que respondeu HTTP 200 para `/comecar`; por isso, uma segunda instância não foi iniciada.
- **Limite:** o lançador da pasta principal está fora do Git aninhado em `nos`; após clonar somente esse repositório, `npm run dev` deve ser executado dentro de `nos`.

## 2026-09-25 — Preparação da entrega ao GitHub

- **Escopo:** primeira tela Escolher caminho, base Next.js, navegação preparatória, testes, documentação e comentários de manutenção.
- **Verificações:** oito testes Playwright passaram; `npm run build` e `npm run typecheck` passaram. Após corrigir a configuração de Playwright, testes e tipos passaram novamente.
- **Revisão:** revisão independente sem problema crítico; corrigidas instruções de verificação no README e a invocação de `npm.cmd` no servidor de testes, conforme documentação Context7 do Playwright 1.63.
- **Destino solicitado:** commit atômico e push para `origin/main` em `github.com/efraimrsilva/nos`. O Git registra o resultado efetivo da publicação.

## 2026-09-25 — Implementação da tela Tipo de Núcleo

- **Mudança:** catálogo com nove tipos, seleção única obrigatória e acessível, passagem validada para Propósito preparatório e retorno preservando a escolha.
- **Resultado:** 16 testes Playwright desktop/mobile, build, tipos e revisão do diff aprovados; inspeção visual e revisão independente estática sem achados bloqueantes. Sem persistência real, commit, push ou deploy.
- **Evidência e continuidade:** [v0.2.0 — Tipo de Núcleo](<registros/registro-v0.2.0-2026-09-25-01-imp-tela-tipo-nucleo-fun-selecao-vinculo.md>).

## 2026-09-25 — Convenção de documentação por implementação

- **Orientação do usuário:** criar um novo documento para cada tela/implementação, preservando o histórico, com data e assunto no título e no nome do arquivo.
- **Aplicação:** protocolo atualizado no README de andamento; novo registro datado criado para Tipo de Núcleo. Os registros antigos foram preservados.

## 2026-09-25 — Adequação versionada da entrega v0.2.0

- **Mudança:** máscara anterior sem versão substituída pela regra atual de `AGENTS.md`: registros em `registros/`, título com versão/data/Imp./Fun., arquivos padronizados e sequência por versão/data.
- **Versão:** 0.1.0 → 0.2.0 (MINOR pela tela Tipo de Núcleo concluída); manifestos sincronizados. A documentação conceitual mantém suas edições históricas.
- **Publicação autorizada:** commit atômico contendo a tela, integração, testes e documentação, seguido de push para `origin/main`; o Git confirma o resultado efetivo. Sem deploy.
- **Evidência:** [registro da adequação](registros/registro-v0.2.0-2026-09-25-02-imp-documentacao-versionada-fun-rastreabilidade.md).

## 2026-09-25 — Padronização retrospectiva do registro v0.1.0

- **Mudança documental:** diário da primeira tela movido para `registros/`, com título, versão histórica comprovada, status e seções exigidas; cronologia original preservada. Sequenciais dos dois registros v0.2.0 ajustados para a posição após a data e referências atualizadas.
- **Resultado:** a sequência histórica passa de v0.1.0 (Escolher caminho) para v0.2.0 (Tipo de Núcleo). A versão vigente do aplicativo permanece 0.2.0. Nenhum código de produto alterado.
- **Git:** alterações locais, inclusive as renomeações preexistentes, reservadas para o commit da próxima funcionalidade por instrução do usuário.
- **Evidência:** [registro da padronização](registros/registro-v0.2.0-2026-09-25-03-imp-padronizacao-registro-historico-fun-rastreabilidade.md).

## 2026-09-27 — Tela Propósito do Núcleo

- **Mudança:** formulário de nome e propósito com sugestão por tipo, validação e conferência local; o tipo continua na URL, os textos não.
- **Resultado:** 22 testes Playwright aprovados em desktop/mobile; tipos, build, inspeção visual e revisão própria aprovados. Nenhum Núcleo ou convite criado.
- **Evidência e continuidade:** [v0.3.0 — Propósito do Núcleo](registros/registro-v0.3.0-2026-09-27-imp-tela-proposito-nucleo-fun-rascunho-local.md). Próxima integração depende de autenticação e criação protegida.

## 2026-09-27 — Configuração do Octocode

- **Evento de ferramenta:** Octocode CLI 19.1.0 executado por `npx`, busca local validada com acesso delimitado ao repositório; MCP global registrado e habilitado. As ferramentas MCP ainda não foram recarregadas nesta sessão.
- **Limite:** configuração global fora do Git do aplicativo; nenhuma dependência adicionada ao projeto.

## 2026-09-27 — Entrega Git da v0.3.0

- **Escopo:** tela Propósito, testes, versão 0.3.0, documentação de continuidade e padronização histórica reservada para esta funcionalidade.
- **Verificações:** 22 testes Playwright, tipos, build, diff e conteúdo do commit aprovados antes do envio.
- **Destino autorizado:** `origin/main`; o hash final e a confirmação do push são obtidos pelo Git, sem registrar no próprio commit uma referência circular.

## 2026-09-27 — Integração Supabase em andamento

- **Mudança em preparação:** tela de conta, ações protegidas de criação, convite inicial, conferência e aceite, além de migração SQL com RLS e configuração local da CLI.
- **Resultado local:** 40 testes Playwright, tipos e build passaram; revisão independente encontrou dois problemas na interface autenticada, corrigidos antes da reexecução. Sem projeto remoto vinculado, nenhum cadastro, Núcleo ou convite real foi validado ou criado.
- **Limite:** Docker daemon inativo impede execução local da migração. O usuário iniciou a criação da organização no painel Supabase.
- **Evidência e retomada:** [registro da integração, concluído posteriormente na v0.4.0](registros/registro-v0.4.0-2026-09-27-imp-integracao-supabase-fun-criacao-convite.md).

## 2026-09-27 — Preparação do projeto Supabase

- **Evento externo informado pelo usuário:** conta Supabase acessada via GitHub; organização **Projetos Efraim** no plano Free criada; formulário de novo projeto aberto. Nenhum projeto ou migração confirmado ainda.
- **Orientação:** usar um projeto de desenvolvimento, guardar a senha do banco privadamente, manter a Data API para o app, retirar concessões automáticas de tabelas e ativar RLS automática. A migração versionada já define concessões e políticas específicas.

## 2026-09-27 — Projeto Supabase criado e autenticação local configurada

- **Evento externo verificado:** `nos-dev` Healthy na região São Paulo; URL e chave publicável registradas apenas em `.env.local` ignorado pelo Git. Site URL local e URL de retorno `/auth/confirm` salvos no painel.
- **Constatação:** o e-mail confirmado pelo usuário não criou usuário no aplicativo; o painel Authentication → Users mostra lista vazia. O template padrão `{{ .ConfirmationURL }}` não pode ser editado sem SMTP próprio, e o callback preparado para `token_hash` requer adaptação ao retorno padrão antes do teste real.
- **Resultado:** nenhuma migração aplicada e nenhuma conta ou Núcleo do Nós criada até esta verificação. Integração permanece em andamento.

## 2026-09-27 — Callback padrão preparado e CLI sem vínculo

- **Mudança no código:** cadastro aponta para `/auth/confirm`; a rota aceita código PKCE do template padrão e `token_hash` de template personalizado. Três testes específicos, tipos e build passaram.
- **Limite:** a suíte completa não iniciou porque outro servidor Next mantém `.next/dev` em uso; Playwright precisa de saída própria. Nenhum fluxo autenticado real validado.
- **Integração externa:** a autorização da CLI falhou por transporte; o painel gerou token legado de CLI nunca usado e sem expiração. O usuário solicitou orientação manual passo a passo. Nenhuma migração foi aplicada.

## 2026-09-27 — Token legado removido

- **Evento externo:** o usuário revogou o token criado na tentativa de login da CLI. O painel Access Tokens foi verificado e mostra lista vazia.
- **Continuidade:** criar token de projeto com prazo curto, guiando o usuário pela escolha de escopo e permissões antes de gerar a credencial. Nenhuma migração aplicada.

## 2026-09-27 — Token restrito substituído e testes isolados

- **Segurança:** o primeiro token restrito foi enviado acidentalmente no chat; o usuário informou sua revogação. A sessão de terminal que o aguardava foi encerrada sem utilizá-lo. Um novo prompt com entrada ocultada foi preparado para a credencial substituta, ainda pendente.
- **Verificação local:** o servidor Playwright agora usa diretório de build separado do servidor de desenvolvimento. A suíte executou 46 testes: 44 passaram; dois falharam por URL fixa da porta antiga no próprio teste. Após corrigir a comparação para o caminho e a consulta, os seis testes da tela de propósito passaram. A suíte completa após o ajuste ainda não foi reexecutada.

## 2026-09-27 — Diagnóstico de transporte da CLI

- **Resultado informado pelo usuário:** o token substituto foi inserido na janela PowerShell, mas `projects list` da CLI 2.118.0 falhou com `HttpClientError: Transport error`.
- **Investigação sem segredo:** a mesma falha foi reproduzida com token fictício no formato correto. `Invoke-WebRequest` e `curl` alcançaram a API por IPv4 e IPv6 e receberam HTTP 401, esperado sem credencial válida. O debug da CLI confirmou uso da variável de ambiente e falha no GET antes de uma resposta HTTP. Próximo teste: consultar o projeto por PowerShell com a credencial mantida apenas naquela janela.

## 2026-09-27 — API autenticada e suíte local conferidas

- **Integração:** o usuário confirmou que a consulta autenticada direta à Management API retornou `nos-dev`; o token substituto funciona. A aplicação de migração permanece pendente. A referência oficial do endpoint de migrações foi consultada e seu acesso restrito precisa ser verificado antes de usá-lo.
- **Validação:** após separar o diretório de build dos testes e corrigir a comparação de URL do teste, 46 testes Playwright passaram em desktop/mobile; `npm.cmd run typecheck` passou. Uma tentativa intermediária da suíte encerrou cedo sem saída útil, seguida de execução explícita completa aprovada.

## 2026-09-27 — Histórico remoto vazio e revisão prévia da migração

- **Integração:** o usuário confirmou que o endpoint de histórico de migrações retornou lista vazia. Nenhuma alteração de estrutura foi enviada ao banco até aqui.
- **Revisão própria:** o SQL versionado cria três tabelas, índices, RLS, concessões apenas de leitura para usuários autenticados e quatro funções que conferem a identidade no banco; não contém exclusão de dados. O endpoint oficial de aplicação de migração foi conferido; seu acesso pode ser restrito no plano/projeto.
- **Validação local:** 46 testes, tipos, build e `git diff --check` passaram antes da aplicação remota. O arquivo SQL tinha SHA-256 `D51485AA3186206950F46DE7F460CDD8D32552567A2BBED71E282071A355502D` nesta revisão.

## 2026-09-27 — Migração aplicada ao nos-dev

- **Entrega externa verificada:** após execução pelo usuário, Database Migrations no painel mostra `20260927173656_create_nuclei_and_invitations`. Database Tables no esquema `public` mostra `nuclei`, `nucleus_members` e `nucleus_invitations`, todas com estimativa de zero registros. Functions mostra quatro RPCs do aplicativo; Policies mostra RLS ativo e uma política de leitura autenticada por tabela. O rótulo `API DISABLED` decorrente das permissões personalizadas exige teste real do acesso.
- **Alinhamento local:** arquivo SQL renomeado para o número de versão remoto, preservando seu conteúdo; evita divergência de histórico em uma futura execução de migrações pela CLI. Fluxos com contas reais ainda pendentes.

## 2026-09-27 — Primeira conta do aplicativo confirmada

- **Validação externa:** o usuário enviou o cadastro pela tela `/conta`; a interface exibiu orientação para confirmar o e-mail. O painel Authentication → Users mostra um usuário confirmado com registro de entrada. Dados pessoais e credenciais não foram copiados para a documentação.
- **Continuidade:** criar um Núcleo pela interface e confirmar inserção protegida no banco; depois validar convite com segunda conta.

## 2026-09-27 — Entrada real levou ao início

- **Validação informada pelo usuário:** após entrar pela tela `/conta`, o aplicativo navegou para `/comecar`. A sessão autenticada permite iniciar o fluxo de criação; a gravação do Núcleo ainda não foi testada.

## 2026-09-27 — Primeiro Núcleo gravado com criador

- **Validação externa:** após a ação explícita do usuário, a interface abriu `/comecar/convite-inicial/[id]`. Table Editor mostrou uma linha em `nuclei` com o mesmo identificador e uma linha em `nucleus_members` para a mesma conta com papel `creator`. Nome, propósito e identificador pessoal não foram copiados para os registros de continuidade.
- **Continuidade:** gerar convite e validar a entrada por segunda conta, incluindo isolamento das tabelas protegidas.

## 2026-09-27 — Convite exposto e revogado

- **Evento:** a geração do primeiro convite funcionou, mas seu código apareceu em captura e mensagem no chat. O convite específico foi revogado no Table Editor; `revoked_at` foi conferido em nova leitura do registro. O código não foi copiado para os documentos.
- **Interface:** após recarregar `/comecar/convite-inicial/[id]`, o código anterior deixou de aparecer e o botão `Gerar convite` voltou. É necessário gerar outro código para o teste com segunda conta.

## 2026-09-27 — Convite substituto ativo

- **Validação externa:** após nova geração informada pelo usuário, uma consulta de contagem no SQL Editor confirmou um convite ativo e um revogado para o Núcleo. Nenhum código foi lido ou registrado.
- **Continuidade:** cadastrar e confirmar segunda conta em sessão separada para testar prévia, aceite e isolamento.

## 2026-09-27 — Contas adicionais informadas para o teste

- **Relato do usuário:** contas adicionais foram criadas para testar o convite. Os endereços não foram registrados; confirmação de e-mail e sessão da conta convidada ainda precisam de verificação.
- **Continuidade:** usar a conta que não criou o Núcleo em sessão separada, conferir o convite pela interface e só então testar o aceite.

## 2026-09-27 — Prévia do convite validada

- **Validação pela interface:** captura do usuário mostrou a prévia do Núcleo após `Conferir convite`, sem expor o código. O aceite ainda não foi acionado/confirmado.
- **Achado de UX:** o aviso para criar conta ou entrar permanece visível abaixo da prévia, embora a conferência exija autenticação. A causa no componente é renderização incondicional; corrigir depois do teste de aceite para não interromper a sessão atual.

## 2026-09-27 — Redirecionamento após aceite sem novo vínculo

- **Relato da interface:** após `Aceitar convite`, o navegador abriu `/nucleos/[id]` e exibiu o resumo esperado.
- **Conferência no banco:** `auth.users` tem três contas, mas a consulta agrupada em `nucleus_members` para esse Núcleo retornou somente um `creator`, sem `member`. O redirecionamento isolado não comprova entrada da segunda conta. O usuário informou que usou navegadores diferentes; foi solicitada conferência de `/conta` em cada um, sem compartilhar e-mails.
- **Correção local de UX:** o aviso de criação/entrada passou a depender da sessão autenticada no servidor. A tela foi conferida em sessão autenticada; `typecheck`, dois testes da rota de convite, build e `git diff --check` passaram.
- **Investigação adicional:** o usuário confirmou contas conectadas diferentes nos navegadores. Nova consulta ao banco manteve um `creator` e zero `member`. A função remota `accept_invitation` contém a inserção e ignora conflito quando a conta já pertence ao Núcleo; a hipótese de sessão errada ainda não está resolvida. Foi solicitado recarregar o resumo no navegador convidado para verificar se o acesso persiste.
- **Teste de recarregamento:** no navegador convidado, F5 na rota do Núcleo exibiu página não encontrada. O acesso não persistiu para essa conta, em acordo com a ausência de `member`. A conferência e o aceite serão repetidos com essa sessão já identificada, sem compartilhar o código.
- **Recuperação do convite:** o usuário perdeu a cópia local. A rota protegida de convite inicial consulta o código ativo para o criador e o exibe novamente; o mesmo convite pode ser reutilizado no teste sem copiá-lo para o chat ou criar outro.

## 2026-09-27 — Aceite persistente e entrega v0.4.0

- **Fluxo real:** após repetir o aceite na sessão convidada, consulta agregada no Supabase mostrou um `creator` e um `member`. O usuário confirmou que o resumo permaneceu visível após F5 nas duas contas; antes do vínculo, a conta convidada recebia página não encontrada. Nenhum código, e-mail ou dado afetivo foi incluído nos registros.
- **Correções de UX e revisão:** aviso de cadastro limitado a usuários sem sessão; prévia de convite ocultada quando o código digitado muda; texto do convite alinhado ao aceite direto. A revisão independente apontou a prévia e documentação defasada, corrigidas. `.next-playwright/` entrou no `.gitignore`.
- **Validação e entrega Git:** 46 testes Playwright em desktop/mobile, `npm.cmd run typecheck`, `npm.cmd run build` e `git diff --check` passaram após as correções e na conferência final. Foram conferidos 71 links locais sem alvo ausente; manifestos e registro refletem v0.4.0 MINOR. A revisão independente de confirmação não encontrou achados remanescentes. A integração foi registrada em commit atômico com código, testes e documentação; o usuário autorizou push para `origin/main`. Consultar o Git para o hash e a situação remota atuais.

## 2026-09-27 — Primeira Home do Núcleo v0.5.0

- **Mudança de produto:** `/nucleos/[id]` passou a mostrar nome, tipo, propósito e vínculo real da pessoa autenticada. O convite aparece apenas para o criador. O estado inicial, carregamento e erro comunicam o alcance atual da Home sem simular áreas futuras.
- **Segurança e validação:** consulta da participação própria sob RLS antes da leitura do Núcleo; ausência de vínculo retorna 404 e erro do serviço é tratado separadamente. A revisão independente encontrou falha do Auth tratada como sessão ausente e token expirado tratado como indisponibilidade; ambos foram corrigidos com teste de regressão. TDD da derivação de tipo/papel/convite e da classificação de erro; 52 testes Playwright em desktop/mobile, tipos e build aprovados. A nova interface ainda não foi testada em sessão Supabase real.
- **Versão e continuidade:** 0.4.0 → 0.5.0 (MINOR); [registro próprio](registros/registro-v0.5.0-2026-09-27-imp-home-nucleo-fun-resumo-protegido.md). Próxima etapa: contrato e RLS da agenda interna; as fontes e o recorte inicial estão no estado canônico. Commit e push para `origin/main` autorizados posteriormente; deploy não autorizado.
- **Entrega Git:** commit atômico com Home, tratamento de acesso, testes, versão e documentação inspecionado antes do envio. O hash final e a situação de `origin/main` devem ser confirmados no Git; o aplicativo não foi publicado por deploy.

## 2026-09-27 — Agenda interna iniciada

- **Mudança em andamento:** criada a rota protegida da agenda, formulário de evento, ações de presença/edição/remoção e migração SQL com eventos, participantes e RLS. A Home ganhou acesso à agenda.
- **Validação local:** a prova da rota falhou antes da implementação e passou após encerrar um servidor de teste órfão. A suíte final aprovou 60 testes desktop/mobile; tipos, build e `git diff --check` passaram. A migração remota e os testes com contas distintas continuam pendentes.
- **Versão naquele marco:** 0.5.0 enquanto a integração não estava concluída. [Registro da entrega, concluído depois na v0.6.0](registros/registro-v0.6.0-2026-09-27-01-imp-agenda-interna-fun-eventos-nucleo.md).

## 2026-09-27 — Migração da agenda aplicada no desenvolvimento

- **Integração:** o usuário aplicou a migração pela Management API no projeto `nos-dev`; o painel confirmou `20260927221149_create_nucleus_calendar`. O arquivo local recebeu o mesmo número de versão, sem alteração do SQL.
- **Continuidade:** validar a agenda pela aplicação com contas distintas e dois Núcleos antes de concluir a funcionalidade e atualizar a versão do projeto.

## 2026-09-27 — Agenda testada com duas contas no mesmo Núcleo

- **Fluxo real:** conta criadora criou, respondeu, editou e removeu um evento temporário. A conta participante viu o convite sem controles de edição, respondeu e recebeu confirmação. O evento de teste foi removido.
- **Revisão e validação:** revisão independente encontrou ausência de navegação após 50 eventos e possível fuso aceito pelo banco mas rejeitado pelo `Intl`; ambas as falhas foram corrigidas com testes. 64 testes desktop/mobile, tipos e build passaram. Resta conferir acesso entre Núcleos distintos antes de concluir a entrega.

## 2026-09-27 — Isolamento validado e agenda v0.6.0

- **Teste real:** a conta participante abriu a agenda do Núcleo original e recebeu 404 ao tentar a agenda de um segundo Núcleo temporário, criado sem convite pela conta criadora. O Supabase retornou exatamente o registro esperado ao removê-lo por identificador e nome; o evento temporário anterior já havia sido excluído.
- **Versão:** 0.5.0 → 0.6.0 (MINOR) pela nova rota e funcionalidade. [Registro da entrega](registros/registro-v0.6.0-2026-09-27-01-imp-agenda-interna-fun-eventos-nucleo.md). Código, migração, testes e documentação formam uma unidade local pronta para commit, sem autorização de publicação.

## 2026-09-27 — Preparação da entrega Git v0.6.0

- **Documentação:** a continuidade da Tela 04 — Acordos foi ligada ao catálogo, fluxo, modelo, permissões e regra de aprovação. Proposta não equivale a acordo ativo; os percentuais do protótipo não são dados reais. O README passou a listar as duas migrações já aplicadas em `nos-dev`.
- **Verificação:** a execução paralela dos testes encontrou timeouts ao encerrar contextos mobile em disco lento; uma execução completa com um worker aprovou 64 testes. Tipos, build e revisão do diff passaram.
- **Git:** commit atômico da agenda v0.6.0 com código, migração, testes, versão e documentação inspecionado localmente. Push para `origin/main` autorizado; confirmar a situação remota no Git.

## 2026-09-28 — Tela 04 Acordos em implementação

- **Mudança em preparação:** hub protegido, propostas de Hábitos e Experiências, respostas de aceite/recusa e migração RLS; Essência permanece sem dados simulados.
- **Resultado local:** 68 testes Playwright desktop/mobile, checagem de tipos e build passaram. Revisão independente apontou três ajustes de fluxo, corrigidos.
- **Limite naquele marco:** migração ainda não aplicada ao `nos-dev` e fluxo real não verificado. [Registro da implementação, concluída depois na v0.7.0](registros/registro-v0.7.0-2026-09-28-imp-hub-acordos-fun-propostas-consentimento.md).

## 2026-09-29 — Análise documental de frameworks de IA

- **Pesquisa:** Genkit, Vercel AI SDK e Mastra comparados com a stack, a RLS e as regras do Ponte do Nós; [registro](registros/registro-v0.6.0-2026-09-29-imp-analise-frameworks-ia-fun-apoio-conversas.md).
- **Resultado:** AI SDK Core é a opção mais simples para eventual sugestão pontual; nenhuma dependência ou funcionalidade de IA foi adicionada. Acordos permanece em desenvolvimento e com validação remota pendente.

## 2026-09-29 — Pesquisa de projetos de apoio à stack

- **Pesquisa:** projetos para Next.js, TypeScript, Playwright e Supabase com foco em RLS, manutenção de dependências, observabilidade e acessibilidade; [registro](registros/registro-v0.6.0-2026-09-29-imp-pesquisa-ferramentas-stack-fun-qualidade-operacao.md).
- **Resultado:** pgTAP/Supabase CLI é a lacuna mais próxima para testar políticas e RPCs; Renovate ou Dependabot após CI; Sentry apenas com aplicação publicada e regras de minimização; axe-core pode complementar Playwright. Nenhuma ferramenta foi instalada. Ferramentas externas condicionais e exclusões estão detalhadas no registro.
- **Validação documental:** fontes oficiais consultadas na web; compatibilidade e custo não foram testados no projeto.
- **Próximo passo:** priorizar a integração real da migração de Acordos; avaliar pgTAP após Docker/local Supabase estar disponível.

## 2026-09-29 — Migração de Acordos validada localmente

- **Integração local:** Docker 29.8.1 iniciou o Supabase; a migração de Acordos foi aplicada após as duas anteriores. `supabase test db` aprovou o novo teste pgTAP de RLS, votos e estados.
- **Fluxo real local:** contas temporárias criaram, aceitaram e recusaram propostas pela aplicação; outra conta recebeu a página 404. Duas respostas simultâneas em um Núcleo de três pessoas levaram a proposta para teste. Os dados temporários foram removidos e as contagens finais foram zero.
- **Limite naquele marco:** a CLI ainda não dispunha de token para o `nos-dev`; a migração remota estava pendente. [Registro da Tela 04, concluída depois na v0.7.0](registros/registro-v0.7.0-2026-09-28-imp-hub-acordos-fun-propostas-consentimento.md).
- **Ambiente:** o Supabase local foi encerrado com backup após os testes; o Docker permaneceu disponível.

## 2026-09-29 — Diagnóstico do login remoto do Supabase

- **Falha:** a CLI 2.118.0 recebeu o código de verificação, mas o GET de confirmação retornou `Transport error`; com credencial fictícia, a listagem de projetos também falhou no transporte.
- **Evidência:** HTTP do Windows chegou à API (401 esperado sem credencial); Node sem certificados do sistema falhou com `UNABLE_TO_VERIFY_LEAF_SIGNATURE` e com `NODE_USE_SYSTEM_CA=1` alcançou a API. O usuário relatou bloqueio pelo antivírus e criou exceção.
- **Continuidade:** o usuário reiniciará o computador para efetivar a exceção. Após isso, testar novamente o transporte da CLI antes de repetir o login. Nenhuma migração foi aplicada ao `nos-dev` nesta etapa.

## 2026-09-29 — Transporte da CLI ainda bloqueado após reinício

- **Diagnóstico:** a exceção do executável no Avast Free Antivirus e o reinício não resolveram `Transport error`. O certificado de `api.supabase.com` foi emitido por `Avast Web/Mail Shield Root`, confirmando a inspeção HTTPS local; a documentação oficial do Supabase descreve esse padrão.
- **Ferramenta:** executável completo da CLI 2.118.0 restaurado do cache npm e conferido; a falha persistiu também no caminho original.
- **Próximo teste:** usuário orientado a criar exceção de Site/Domínio apenas para `api.supabase.com` no Avast; verificar o certificado e o transporte antes de novo login. Migração remota permanece pendente.

## 2026-09-29 — Transporte da CLI restaurado

- **Ajuste de ambiente:** o usuário salvou a exceção de Site/Domínio para `api.supabase.com` no Avast Free Antivirus.
- **Evidência:** o emissor do certificado passou de `Avast Web/Mail Shield Root` para `WE1`; a CLI 2.118.0 passou a receber `Unauthorized` com credencial fictícia, comprovando comunicação HTTP com a API sem expor credenciais reais.
- **Continuidade:** janela de login real aberta em PowerShell; autorização ainda não confirmada. Migração de Acordos no `nos-dev` segue pendente.

## 2026-09-29 — Tela 04 Acordos validada no `nos-dev` e v0.7.0

- **Migração:** login da CLI confirmado; `nos-dev` identificado e vinculado. A simulação indicou somente `20260928120000_create_nucleus_agreements.sql`; `db push --skip-vault` aplicou a migração. `migration list` mostrou três versões alinhadas e uma nova simulação informou banco atualizado. Uma tentativa intermediária de simulação encontrou falha transitória de autenticação do papel `cli_login_postgres`; a repetição passou sem reaplicar SQL.
- **Fluxo remoto:** três contas temporárias verificaram convite, proposta pendente, aceite unânime para `testing`, recusa para `declined` e negativa de leitura/resposta por pessoa fora do Núcleo. A limpeza pela API foi restringida por `DELETE`; a consulta administrativa removeu o Núcleo e a conta restantes, com contagens finais zero de Núcleo, propostas e contas de teste.
- **Verificação:** 68 testes Playwright desktop/mobile, checagem de tipos, build de produção e `git diff --check` aprovados na v0.7.0. Manifestos alinhados e links do registro renomeado conferidos. A primeira tentativa não iniciou o servidor de testes dentro de 120 segundos, mas a inicialização isolada respondeu HTTP 200 e a repetição passou. Revisão independente final não encontrou defeito material de código e solicitou atualização da documentação, realizada nesta entrega.
- **Versão e continuidade:** incremento MINOR de 0.6.0 para 0.7.0 pela nova tela/funcionalidade. Próxima etapa do catálogo: Tela 05 — Detalhe do Hábito, começando pelo contrato de dados reais e sem percentuais simulados. [Registro v0.7.0](registros/registro-v0.7.0-2026-09-28-imp-hub-acordos-fun-propostas-consentimento.md).

## 2026-09-29 — Preparação da publicação Git da v0.7.0

- **Continuidade:** conferida a Tela 05 no catálogo; o estado canônico agora distingue dados já disponíveis na proposta em teste dos dados que exigem contrato e integração próprios. Os registros das pesquisas de IA e ferramentas receberam notas posteriores sem apagar o contexto em que foram escritos.
- **Entrega:** usuário autorizou commit e push para `origin/main`, com descrição que abranja Acordos, validação do banco, testes, versão e as duas pesquisas documentais locais concluídas antes da funcionalidade. Verificações finais e confirmação do hash remoto devem preceder o encerramento.
- **Verificação desta preparação:** uma execução de 68 testes perdeu o servidor de desenvolvimento após o primeiro caso (44 falhas de navegação por conexão recusada); iniciar a página isoladamente retornou HTTP 200 e o caso isolado passou. A nova execução completa aprovou 68/68 testes, seguida de checagem de tipos e build aprovados, sem alteração no código do aplicativo.
- **Commit:** a Tela 04, a migração, os testes, a versão e os registros das duas pesquisas foram reunidos em um commit descritivo da v0.7.0. O hash final deve ser consultado no Git após o ajuste deste andamento e comparado com `origin/main` após o push.

## 2026-09-29 — Tela 05 Detalhe do Hábito v0.8.0

- **Produto:** propostas de Hábito em teste ganharam link para detalhe protegido com descrição, momento, frequência, data identificada em UTC e resposta própria. A interface explica a ausência de histórico, progresso, revisão e evento associado, sem simular dados.
- **Verificação:** teste de acesso sem sessão falhou antes da rota e passou depois; 70 testes desktop/mobile, tipos e build passaram. Revisão independente apontou fuso não indicado, corrigido. Com Supabase local, três contas e dois Núcleos temporários validaram o link, acesso dos integrantes, isolamento, rejeição de categoria/estado inadequados e RLS da resposta própria. Dados temporários removidos. A nova rota não foi testada no `nos-dev`.
- **Versão e continuidade:** 0.7.0 → 0.8.0 (MINOR) pelo recorte inicial da Tela 05, com nova rota de consulta protegida. A Tela 06 deve definir persistência e permissões de revisão e registro de momento; os itens restantes da Tela 05 serão integrados quando houver dados reais. [Registro](registros/registro-v0.8.0-2026-09-29-imp-detalhe-habito-fun-consulta-proposta-teste.md). Commit atômico conferido com código, teste, versão e documentação; push para `origin/main` autorizado em 2026-09-29. Confirmar o estado remoto pelo Git.

## 2026-10-02 — Retomada documental após v0.9.0

Código e Git conferidos em 381a308. Próxima entrega proposta: Revisar Hábito em teste com consenso e reflexão. Recorte aguarda aprovação; nenhuma alteração de produto. Registro: registros/registro-v0.9.0-2026-10-02-imp-retomada-projeto-fun-escopo-revisao.md.

## 2026-10-02 — Revisão consensual do Hábito v0.10.0

Ajustes e encerramento de Hábitos em teste exigem unanimidade, reflexão de sete dias e aplicação explícita. Histórico preservado. Banco local, fluxo de três contas, concorrência, 80 testes, tipos e build aprovados. Achado independente de prontidão corrigido. Migração aplicada ao nos-dev pelo editor SQL em transação com histórico, após bloqueio da CLI; quatro corpos de função equivalentes aos locais. Interface autenticada validada localmente. Unidade pronta para commit, não autorizado nesta interação. [Registro](registros/registro-v0.10.0-2026-10-02-imp-revisao-habito-fun-consentimento-reflexao.md).

## 2026-10-03 — Preparação de commit e push da v0.10.0

Usuário autorizou publicação Git abrangente. Fetch encontrou 264f483 (remoção de AGENTS.md), incorporado por avanço direto sem sobrescrever o remoto. Revisão final independente confirmou o próximo passo; documentação agora diferencia teste de 7 a 30 dias e reflexão de sete dias, com decisões pendentes explícitas. Testes de banco repetidos com sucesso; verificações finais e hash publicado serão conferidos antes de encerrar. [Registro](registros/registro-v0.10.0-2026-10-03-imp-publicacao-git-fun-continuidade-confirmacao.md).

- **Commit conferido:** unidade da v0.10.0 contém os 22 arquivos previstos, incluindo a continuidade da confirmação. Pendência de commit removida por inspeção do objeto Git, não somente pela limpeza do diretório. Ajustes deste registro incorporados ao mesmo commit antes do envio. Hash final consultável em HEAD; publicação confirmada pela comparação com refs/heads/main ao concluir o push.

## 2026-10-03 — Retomada do contrato de confirmação pós-teste

HEAD e main no GitHub conferidos em e315b12; diretório inicialmente limpo. Documentação e código confrontados com as regras v1.2/v2.4. Proposta para duração, início, legado, confirmação e compatibilidade de active registrada, aguardando aprovação antes de implementação. Sem alteração de produto ou versão; preparação documental acompanha a próxima entrega funcional. [Registro](registros/registro-v0.10.0-2026-10-03-imp-retomada-confirmacao-fun-proposta-contrato.md).

## 2026-10-03 — v0.11.0: confirmação do Hábito após teste

Duração explícita, ciclos reais, maioria até 150 e um terço acima de 150; orientações visíveis e active integrado. Legado exige novo prazo aceito; ajustes preservam história e reiniciam teste. 84 testes, tipos, build, cinco arquivos SQL e jornada local com cinco contas passaram. Migração aplicada no nos-dev; 13 funções equivalentes. Revisão independente corrigida; interface autenticada validada localmente. Unidade local pronta para commit. [Registro](registros/registro-v0.11.0-2026-10-03-imp-confirmacao-habito-fun-teste-votacao-proporcional.md).

## 2026-10-03 — Publicação Git abrangente da v0.11.0

Usuário autorizou commit e push. Continuidade de Nossa Árvore detalhada com fontes, lacunas e critérios; 84 testes, cinco arquivos SQL, tipos, build e 498 links aprovados novamente. Conferência do objeto Git e do hash remoto ao concluir o envio. [Registro](registros/registro-v0.11.0-2026-10-03-02-imp-publicacao-git-fun-continuidade-arvore.md).

## 2026-10-03 — Planejamento visual completo, sem nova versão de desenvolvimento

Atlas offline com Conta primeiro, 72 telas/estados, oito áreas, 12 percursos e cobertura das 37 interfaces. 45 telas planejadas e 27 recortes existentes com limites, contratos e permissões. Prévia, estados, destinos, filtros, teclado, layout móvel e impressão CSS verificados; zero erros JavaScript. Dois achados independentes corrigidos e reconferidos. Aplicativo, banco e versão 0.11.0 preservados; nenhum commit/push/deploy. Revisar o material antes de retomar Nossa Árvore. [Guia](../wireframes/GUIA.md), [pendências](../wireframes/COBERTURA.md) e [registro](registros/planejamento-2026-10-03-wireframe-completo.md).

## 2026-10-03 — Wireframe vivo e organização dos materiais de origem

Usuário determinou manutenção contínua do wireframe para refletir o desenvolvimento atual e futuro. Regra permanente registrada em estado, protocolo de andamento e guia: atualizar desenhos, contratos, permissões, situação e pendências junto a cada entrega afetada. Pasta Telas movida pelo usuário para Documentacao_Projeto_Nos/Telas; links e referências ajustados, sem refazer a movimentação. Versão funcional 0.11.0 preservada. [Registro](registros/planejamento-2026-10-03-manutencao-wireframe-organizacao-telas.md).

## 2026-10-03 — Publicação autorizada do atlas vivo no GitHub

Commit e push autorizados pelo usuário com descrição abrangente do trabalho: 72 telas/estados, 12 percursos, contratos/pendências, manutenção contínua e 35 materiais movidos para a documentação. Fetch sem divergência; 84 testes, tipos, build, atlas, 617 links e diff aprovados. Revisão independente sem achado bloqueante no atlas ou escopo. Objeto Git e hash remoto conferidos ao encerrar o envio; sem deploy ou alteração de versão funcional. [Registro](registros/planejamento-2026-10-03-publicacao-wireframe-github.md).

## 2026-10-04 — Fidelidade visual e UX do atlas, sem nova versão funcional

Corrigida a simplificação do atlas: 28 telas aprovadas importadas em 52 layouts/variações, oito composições de entrada conforme código, paleta e nove ícones comparados ao app local. Abas, rascunho e convite locais; modo histórico separado de regras atuais. 72 prévias, 173 saídas, 360 estados e 41 referências passaram, sem JavaScript/rede externa; revisão independente corrigida e reconferida. Nome Nos_App.dc.html preservado, links ajustados. Versão 0.11.0, app e banco preservados; unidade pronta para commit, sem publicação. [Registro](registros/registro-v0.11.0-2026-10-04-imp-fidelidade-visual-atlas-fun-referencia-ux-aprovada.md).

## 2026-10-05 — Conferência da sinalização e prioridade alta do atlas vivo

Conferidas as 72 fichas, situações e pendências no inventário e navegador: 45 Planejadas e 27 Recortes existentes, com rotas presentes no código. Definida consulta visual obrigatória ao modo Atlas vivo antes de criar/implementar/alterar/revisar telas, prioridade alta da composição e comparação com a interface real antes da entrega. Regra propagada ao guia, READMEs, frontend, procedência e continuidade; regras de segurança/consentimento preservadas. Verificação completa do atlas aprovada novamente; versão 0.11.0 mantida, sem publicação. [Registro](registros/registro-v0.11.0-2026-10-05-imp-prioridade-atlas-vivo-fun-orientacao-visual-implementacao.md).

## 2026-10-05 — Publicação autorizada de fidelidade e prioridade visual do atlas

Usuário autorizou commit e push com descrição abrangente da correção visual, layouts aprovados, comparação viva/histórica, recursos locais, importação/verificação, sinais e orientação de prioridade alta. Main inicialmente sem divergência; 84 testes, tipos, build, atlas completo e sinalização aprovados novamente. Revisão independente de publicação sem achados materiais; fonte renomeada R100 preservada, sem alteração funcional ou versão nova. Inspeção do commit e igualdade com main remoto são os controles finais de envio. [Registro](registros/registro-v0.11.0-2026-10-05-02-imp-publicacao-atlas-fun-fidelidade-prioridade-visual.md).

## 2026-10-06 — Incremento documental de autenticação e segurança v2.8

Revisão solicitada pelo usuário incorporada à especificação: oito requisitos originais, status real, arquitetura web/mobile, login social, biometria, recuperação, sessão/revogação, RLS e tratamento de dados. Propostas de senha e retenção distinguidas da implementação; fontes oficiais e critérios de aceite incluídos. Código e migrações consultados; links e diff conferidos. Sem nova versão funcional, alteração de interface, configuração de serviço ou publicação. [Registro](registros/registro-v0.11.0-2026-10-06-imp-revisao-autenticacao-fun-contratos-seguranca.md).

## 2026-10-07 — Conta e entrada completa — v0.12.0

- **Entrega:** telas 01–05 e 72 integradas: Conta como raiz, confirmação/reenvio, recuperação/redefinição segura, retorno de convite e apresentação opcional. Atlas atualizado e diferenças apresentadas em galeria.
- **Resultado:** 108 testes, tipos/build, jornada local real e revisão independente. Dados temporários removidos. Configuração nos-dev aplicada somente para URLs e senha mínima; outros 11 campos preservados.
- **Evidência:** [registro v0.12.0](registros/registro-v0.12.0-2026-10-07-imp-conta-entrada-fun-recuperacao-integrada.md), [contrato](funcionalidades/conta-entrada.md) e [comparação](../wireframes/comparacoes/2026-10-07-conta-entrada/index.html). Sem commit, push Git ou deploy. SMTP de lançamento ainda exige validação operacional.


## 2026-10-07 — Publicação Git da v0.12.0

Commit/push autorizados para Conta e entrada completa, Atlas vivo sincronizado, galeria, testes/configuração e revisão documental de segurança pendente. [Registro de publicação](registros/registro-v0.12.0-2026-10-07-02-imp-publicacao-git-fun-rastreabilidade-conta-entrada.md). Conferência de conteúdo e hash remoto exigida; publicação Git não equivale a deploy.

Conferência desta publicação: 108/108 testes repetidos; objeto Git inspecionado; 74 arquivos incluindo a revisão v2.8. Captura histórica 72 corrigida no mesmo commit. Credenciais/artefatos excluídos e pendência de commit removida por evidência do objeto.

## 2026-10-07 — Visão global e padrão de sincronização — documentação v0.12.0

- **Entrega:** nova aba acima de Todas as áreas, todas as 72 telas e os 13 percursos reutilizados; sequência inicia em Conta e distingue alternativas, saídas e contexto. Renderização única das prévias e contratos entre as visões.
- **Procedimento:** toda alteração avalia impacto nas telas e sincroniza aplicativo/atlas; toda criação ou modificação acrescenta galeria datada de comparações, preservando as anteriores. Procedimento central referenciado na documentação de entrada e continuidade.
- **Resultado:** teste de igualdade das 72 composições e atualização dinâmica, navegação, filtros, celular e impressão CSS; fidelidade geral e seis telas de Conta em duas larguras aprovadas. P2 de filtro obsoleto reproduzido e corrigido; revisão independente de reconferência sem achados materiais no escopo revisado. Galeria com seis capturas antes/depois inspecionada.
- **Evidência e limite:** [registro](registros/registro-v0.12.0-2026-10-07-03-imp-visao-global-atlas-fun-sequencia-sincronizacao-comparacoes.md), [comparações](../wireframes/comparacoes/2026-10-07-visao-global/index.html) e [padrão](../wireframes/comparacoes/README.md). Versão funcional preservada, sem alteração no aplicativo, commit, push ou deploy. Unidade pronta para commit autorizado.

## 2026-10-07 — Publicação autorizada de Visão global — v0.12.0

Usuário autorizou commit e push abrangentes da Visão global, reuso de composições/contratos, sequência e ramificações, correção de filtros, teste, galeria e procedimentos de manutenção. Fetch confirmou main sem divergência a partir de 7a1fedc. [Registro da publicação](registros/registro-v0.12.0-2026-10-07-04-imp-publicacao-atlas-fun-visao-global-procedimentos.md). Verificar conteúdo do objeto e hash remoto; excluir artefatos/credenciais. Sem deploy ou incremento de versão funcional.

Conferência da publicação: 108/108 testes repetidos, verificações global/fidelidade/Conta aprovadas, 781 alvos de links locais e diff conferidos. Objeto inicial inclui os 24 arquivos e coincide com a árvore preparada; pendência removida por evidência de inclusão, com atualização do controle no mesmo commit lógico. Hash final reportado após conferência remota no encerramento.


## 2026-10-07 — v0.13.0 — Navegação autenticada e Seus Núcleos

- Mudança: proteger etapas antes públicas e organizar Conta → lista real → Início, com retorno privado permitido. Sessão expirada renovável continua; não renovável pede login inclusive durante envio.
- Resultado: 88 testes sem backend e 44 autenticados, tipos/build, Atlas72/180/360 e Visão global aprovados; revisão independente sem achados materiais restantes.
- Evidência: [registro](registros/registro-v0.13.0-2026-10-07-05-imp-navegacao-protegida-fun-sessao-seus-nucleos.md), [contrato](funcionalidades/navegacao-sessao.md) e [comparações](../wireframes/comparacoes/2026-10-07-sessao-navegacao/index.html). Ambiente/fixtures locais limpos e config restaurado. Sem migração remota, commit/push ou deploy.


## 2026-10-07 — Publicação autorizada da v0.13.0

Usuário autorizou commit/push abrangentes. Fetch confirmou main sem divergência. Implementação, testes, Atlas/galeria e documentação compõem uma unidade lógica; [registro de publicação](registros/registro-v0.13.0-2026-10-07-06-imp-publicacao-git-fun-rastreabilidade-navegacao.md). Conferir objeto e hash remoto no encerramento; sem deploy.

## 2026-10-07 — Publicação autorizada de Conta visual — v0.13.1

- **Evento Git:** usuário autorizou commit e push abrangendo a entrega inteira. Main/origin/main sem divergência após fetch, base cfcd57f. Suíte sem backend repetida: 88/88 aprovados. Objeto Git inspecionado: 33 arquivos e árvore inicial idêntica ao índice preparado. Pendência retirada e controle incorporado ao mesmo commit lógico; hash remoto conferido no encerramento.
- **Conjunto:** aplicativo, teste, versão, Atlas/ficha, galeria e documentação do alinhamento de Conta e remoção de link duplicado. Sem deploy ou migração.
- **Evidência:** [registro da publicação](registros/registro-v0.13.1-2026-10-07-02-imp-publicacao-git-fun-rastreabilidade-conta-visual.md).

## 2026-10-09 — Percurso 03 Recuperar acesso — v0.13.2

- **Produto:** retorno da confirmação/recuperação à Conta abre login com destino preservado; callback rejeita credenciais repetidas/misturadas antes do Auth, sem consumir token legítimo. Prova e regra de senha vigentes preservadas; PATCH 0.13.1 → 0.13.2.
- **Atlas/documentação:** sequência 01 → 04 → 05 → 01 → 12 com etapas distintas de Conta, callback técnico sem tela, reinício e retorno específico explícitos; galeria, fichas, cobertura, contrato e roteiro Gmail sincronizados.
- **Evidência:** 92 testes desktop/celular, tipos/build, integração real local e Atlas/Visão global aprovados; autorrevisão e revisão independente sem P1–P3. Compilação inicial causou esperas insuficientes nas primeiras execuções; repetição completa passou. Fixtures e e-mails locais removidos.
- **Operação:** usuário criou Gmail sintagmasoftware@gmail.com e informou bloqueio do Google, exigindo fator/dispositivo registrado por pelo menos sete dias. Pediu deixar preparado para somente informar a senha depois. Arquivo SMTP isolado e script com prompt oculto preparados; `-Check` aprovou configuração e acesso remoto, somente leitura. Sem ativação SMTP, envio externo, alteração remota, commit/push ou deploy. [Registro](registros/registro-v0.13.2-2026-10-09-imp-recuperacao-acesso-fun-percurso-03.md), [comparação](../wireframes/comparacoes/2026-10-09-recuperar-acesso/index.html) e [roteiro SMTP](funcionalidades/recuperacao-smtp-gmail.md).

## 2026-10-10 — Publicação autorizada e retomada da recuperação — v0.13.2

- **Evento Git:** commit e push para main autorizados pelo usuário, abrangendo código, testes, Atlas/comparações, versão, preparação Gmail e documentação. Fetch sem divergência sobre e7ff9c1; 92/92 testes, tipos, build, percurso Atlas e galeria/links reconferidos. Objeto Git inspecionado: 40 arquivos e árvore inicial idêntica ao conjunto preparado; pendência retirada, controle incorporado ao mesmo commit lógico. Conferir hash remoto no encerramento.
- **Continuidade:** usuário solicitou retomar neste chat a ativação após liberação da senha de aplicativo; prompt oculto preparado, recebimento externo pendente. Senha comum criptografada não substitui autorização do Google. Sem aplicação SMTP remota ou deploy.
- **Evidência:** [registro de publicação](registros/registro-v0.13.2-2026-10-10-imp-publicacao-git-fun-rastreabilidade-recuperacao-acesso.md).
