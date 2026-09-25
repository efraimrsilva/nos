# Estado do Projeto Nós

**Versão vigente do projeto:** 0.2.0

**DOCS_DIR:** `Documentacao_Projeto_Nos`

**Atualizado:** 2026-09-25

**Objetivo ativo:** implementar o onboarding do app Nós em etapas, abrangendo todos os tipos de Núcleo desde o início.

## Situação

As telas **Escolher caminho** (`/comecar`) e **Tipo de Núcleo** (`/comecar/tipo`) estão implementadas. Os nove tipos documentados podem ser selecionados; Continuar encaminha ao espaço reservado de Propósito e Voltar preserva a seleção. Convite permanece preparatório. Não há criação persistente, autenticação ou Supabase configurado. O app ainda não está publicado.

**Escopo desta entrega e aceite:** catálogo completo, escolha única obrigatória, retorno com seleção, teclado, responsividade, rejeição de tipo inválido em Propósito e novo registro datado. Critérios verificados; Propósito completo é a próxima implementação.

**Arquivos principais:** `src/features/nuclei/nucleus-types.ts`, `src/features/onboarding/components/nucleus-type-form.tsx`, `src/app/comecar/tipo/page.tsx`, `src/app/comecar/proposito/page.tsx` e `tests/nucleus-type.spec.ts`.

## Decisões vigentes

- TypeScript, React, Next.js, Tailwind; Supabase para backend futuro; Capacitor depois da web, Android antes de iOS.
- Suporte a todos os tipos de Núcleo por um modelo extensível.
- Usar Context7 em consultas de documentação técnica, respeitando a versão instalada e sem enviar dados privados.
- Manter este diretório atualizado; monitoramento automático permanece cancelado.
- Cada tela/implementação/funcionalidade/mudança recebe registro em `registros/`, com versão, data, Imp. e Fun. no título e arquivo. Seguir a máscara de `AGENTS.md` e do protocolo; preservar o histórico e indexar todos os registros. A regra anterior sem versão foi substituída.
- Versão 0.2.0: incremento MINOR pela nova tela concluída. `package.json` e `package-lock.json` sincronizados; edições 1.x/2.x da documentação conceitual não são versões do aplicativo.
- Não assumir Casal como escolha inicial. Transportar somente o identificador do tipo na URL; conteúdo afetivo futuro exige contrato próprio.

## Verificações recentes

Preparação da entrega v0.2.0: reexecutados os 16 testes, build e checagem de tipos, todos aprovados. Versões de manifestos e 55 links locais conferidos; revisão documental e do diff sem problemas. Evidência adicional no registro de rastreabilidade.

Entrega Tipo de Núcleo em 2026-09-25: `npm.cmd test` aprovou 16 testes desktop/mobile; `npm.cmd run build`, `npm.cmd run typecheck` e `git diff --check` aprovados. Inspeção visual em 1440px e 390px, teste em 320px, revisão própria e revisão independente estática sem achados bloqueantes. Detalhes no novo registro datado.

Na entrega inicial: oito testes Playwright passaram; build e verificação de tipos passaram. Para a alteração de comentários desta interação, não foram adicionados nem executados testes.

Em 2026-09-25, o comando de desenvolvimento foi reproduzido: `ENOENT` na pasta pai sem `package.json`; inicialização `Ready` em `nos`; navegador exibiu `/comecar` sem sobreposição de erro. O servidor temporário foi encerrado e a porta 3000 ficou livre para o terminal do usuário.

Na interação seguinte, foi criado um lançador local em `G:\Efraim\Dev\PROJETOS\Projeto Nós\package.json` para aceitar `npm run dev` na pasta principal. O comando encaminhou ao Next.js; uma instância já ativa respondeu HTTP 200 em `/comecar` e bloqueou uma segunda execução pelo lock de desenvolvimento. O lançador fica fora do repositório Git `nos`.

Para a entrega GitHub de 2026-09-25, oito testes Playwright, build de produção e checagem de tipos passaram. A revisão independente encontrou uma instrução de verificação incorreta no README (corrigida) e um comando de teste específico do Windows (substituído por `npm run dev` conforme documentação do Playwright 1.63). Testes e tipos passaram novamente após o ajuste.

## Trabalho local e commit

Git verificado: branch `main`, base `32f208c` contém a entrega inicial. Alterações preexistentes desta sessão correspondem à tela Tipo de Núcleo, integração preparatória, testes e documentação. Commit e push para `origin/main` autorizados para a entrega v0.2.0; sem deploy. Configuração global do Context7 e lançador da pasta principal ficam fora do repositório.

**Unidades prontas para commit:** nenhuma pendente. O commit `feat(onboarding): entrega v0.2.0 com seleção de tipo de Núcleo`, posterior à base `32f208c`, foi inspecionado com `git show` e contém os 21 arquivos da entrega. Esta atualização do registro integra o mesmo commit lógico. O hash final e o envio são verificáveis pelo Git, evitando registrar um hash que mudaria ao incluir este próprio texto.

## Estado das ferramentas

Superpowers disponível e aplicado. Context7 ativo e consultado; versão exata Next.js 16.3.6 complementada pelos guias locais. Octocode não exposto nesta sessão, sem necessidade de pesquisa avançada neste escopo. Playwright disponível e usado para testes e inspeção visual; agent-browser não localizado. Nenhuma dependência nova instalada.

Git sem identidade configurada: a primeira tentativa de commit foi recusada. Reutilizada a identidade consistente dos três commits anteriores somente na invocação de commit, sem modificar configurações globais; commit criado e conteúdo verificado.

## Continuidade, contagem e auditoria

- A contagem começa em 2026-09-25, por não haver contagem histórica verificável: 6 interações concluídas desde esse marco, incluindo a adequação documental e entrega GitHub atuais; próxima auditoria na interação 100.
- Última revisão de over-engineering: nenhuma (0).
- Próximo passo executável, quando solicitado: implementar Propósito do Núcleo com nome, propósito editável e sugestões por tipo; definir o contrato de rascunho antes de coletar conteúdo afetivo. Criar um novo registro datado para essa implementação.
- Bloqueio: nenhum para a tela atual. Backend e contas de serviços ainda não configurados.

## Índice

- [Histórico](historico.md): eventos e resultados em ordem cronológica.
- [Brag document](../brag/BRAG.md): contribuições verificáveis.
- [Primeira tela](funcionalidades/escolher-caminho.md): escopo e continuidade.
- [v0.2.0 — Tipo de Núcleo](<registros/registro-v0.2.0-2026-09-25-imp-tela-tipo-nucleo-fun-selecao-vinculo-01.md>): escopo, decisões, evidências e continuidade desta entrega.
- [v0.2.0 — Versionamento e rastreabilidade](registros/registro-v0.2.0-2026-09-25-imp-documentacao-versionada-fun-rastreabilidade-02.md): adequação às instruções atualizadas e preparação da entrega GitHub.
- [Frontend web](tecnologias/frontend.md): stack, segurança e organização.
- [Registro da primeira sessão](registro-2026-09-24.md): decisões e implantação inicial.
- [Estado anterior](estado-atual.md): referência histórica.
- `README.md`: protocolo do andamento.
