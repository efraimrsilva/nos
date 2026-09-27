# Histórico de andamento

**Versão vigente do projeto:** 0.3.0

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
