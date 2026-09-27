# Histórico de andamento

**Versão vigente do projeto:** 0.4.0

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
