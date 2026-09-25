# Histórico de andamento

## 2026-09-24 — Primeira tela do app

- **Mudança:** base Next.js, tela Escolher caminho, rotas preparatórias e documentação de frontend.
- **Resultado:** fluxo acessível e responsivo; oito testes Playwright, build e verificação de tipos passaram na entrega original.
- **Evidência:** [registro da sessão](registro-2026-09-24.md), [escopo da tela](funcionalidades/escolher-caminho.md).

## 2026-09-24 — Context7

- **Evento:** servidor MCP Context7 instalado na configuração global do Codex; inicialização e ferramentas verificadas.
- **Evidência:** [registro da sessão](registro-2026-09-24.md). Configuração fora do Git do app.

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
