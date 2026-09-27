# Estado do Projeto Nós

**Versão vigente do projeto:** 0.3.0

**DOCS_DIR:** `Documentacao_Projeto_Nos`

**Atualizado:** 2026-09-27

**Objetivo ativo:** implementar o onboarding do app Nós em etapas, abrangendo todos os tipos de Núcleo desde o início.

## Situação

As telas **Escolher caminho** (`/comecar`), **Tipo de Núcleo** (`/comecar/tipo`) e **Propósito do Núcleo** (`/comecar/proposito`) estão implementadas. Os nove tipos levam ao formulário de nome e propósito, com sugestão editável por tipo, conferência local e retorno com o tipo preservado. O rascunho fica apenas na memória da página; recarregar o descarta. Convite permanece preparatório. Não há criação persistente, autenticação ou Supabase configurado. O app ainda não está publicado.

**Escopo desta entrega e aceite:** nome e propósito editáveis, sugestão contextual para cada tipo, validação de campos em branco, conferência sem criação fictícia nem exposição dos textos na URL, responsividade, retorno ao tipo e novo registro datado. Critérios verificados; criação protegida e convite inicial são integrações futuras.

**Arquivos principais:** `src/features/nuclei/nucleus-types.ts`, `src/features/onboarding/components/nucleus-type-form.tsx`, `src/features/onboarding/components/nucleus-purpose-form.tsx`, `src/app/comecar/tipo/page.tsx`, `src/app/comecar/proposito/page.tsx`, `tests/nucleus-type.spec.ts` e `tests/nucleus-purpose.spec.ts`.

## Decisões vigentes

- TypeScript, React, Next.js, Tailwind; Supabase para backend futuro; Capacitor depois da web, Android antes de iOS.
- Suporte a todos os tipos de Núcleo por um modelo extensível.
- Usar Context7 em consultas de documentação técnica, respeitando a versão instalada e sem enviar dados privados.
- Manter este diretório atualizado; monitoramento automático permanece cancelado.
- Cada tela/implementação/funcionalidade/mudança recebe registro em `registros/`, com versão, data, Imp. e Fun. no título e arquivo. Seguir a máscara de `AGENTS.md` e do protocolo; preservar o histórico e indexar todos os registros. A regra anterior sem versão foi substituída.
- Versão 0.2.0: incremento MINOR pela nova tela concluída. `package.json` e `package-lock.json` sincronizados; edições 1.x/2.x da documentação conceitual não são versões do aplicativo.
- Versão 0.3.0: incremento MINOR pela conclusão da tela Propósito; manifestos sincronizados.
- Registros de uma mesma versão/data usam a sequência logo após a data. A primeira tela foi entregue na v0.1.0, comprovada no commit `32f208c`; seu registro foi padronizado retrospectivamente sem alterar o produto.
- Não assumir Casal como escolha inicial. Transportar somente o identificador do tipo na URL; conteúdo afetivo futuro exige contrato próprio.
- Nome e propósito desta fatia não são enviados, persistidos nem incluídos na URL. A conferência é local e explícita; a etapa de convite inicial só poderá consumir esses dados após autenticação, autorização e contrato de criação protegida.

## Verificações recentes

Entrega Propósito em 2026-09-27: TDD confirmou falha pela ausência dos campos; `npm.cmd test` aprovou 22 testes desktop/mobile, `npm.cmd run typecheck`, `npm.cmd run build` e `git diff --check` passaram. Inspeção visual em 390px, teste de largura em 320px e 13 documentos verificados sem links locais ausentes. Revisão própria sem achados bloqueantes; não houve revisão independente.

Padronização documental em 2026-09-25: versão 0.1.0 da primeira entrega confirmada no Git; registro histórico movido para `registros/`, links e máscara sequencial atualizados. A revisão atual é documental; testes de aplicação não foram reexecutados por não haver mudança no produto. Veja o registro específico desta adequação.

Preparação da entrega v0.2.0: reexecutados os 16 testes, build e checagem de tipos, todos aprovados. Versões de manifestos e 55 links locais conferidos; revisão documental e do diff sem problemas. Evidência adicional no registro de rastreabilidade.

Entrega Tipo de Núcleo em 2026-09-25: `npm.cmd test` aprovou 16 testes desktop/mobile; `npm.cmd run build`, `npm.cmd run typecheck` e `git diff --check` aprovados. Inspeção visual em 1440px e 390px, teste em 320px, revisão própria e revisão independente estática sem achados bloqueantes. Detalhes no novo registro datado.

Na entrega inicial: oito testes Playwright passaram; build e verificação de tipos passaram. Na alteração de comentários de 2026-09-25, não foram adicionados nem executados testes.

Em 2026-09-25, o comando de desenvolvimento foi reproduzido: `ENOENT` na pasta pai sem `package.json`; inicialização `Ready` em `nos`; navegador exibiu `/comecar` sem sobreposição de erro. O servidor temporário foi encerrado e a porta 3000 ficou livre para o terminal do usuário.

Em 2026-09-25, houve um lançador local em `G:\Efraim\Dev\PROJETOS\Projeto Nós\package.json` fora do repositório Git. Na verificação de 2026-09-27, esse arquivo não está presente; executar `npm run dev` dentro de `nos`.

Para a entrega GitHub de 2026-09-25, oito testes Playwright, build de produção e checagem de tipos passaram. A revisão independente encontrou uma instrução de verificação incorreta no README (corrigida) e um comando de teste específico do Windows (substituído por `npm run dev` conforme documentação do Playwright 1.63). Testes e tipos passaram novamente após o ajuste.

## Trabalho local e commit

Git verificado: branch `main`; a entrega v0.2.0 está em `4feb165` e a primeira entrega em `32f208c`. O commit atômico da v0.3.0 foi inspecionado e contém a tela Propósito, testes, versionamento, documentação e a padronização pendente dos registros v0.1.0/v0.2.0. Push para `origin/main` autorizado em 2026-09-27; o hash final e o envio são confirmados diretamente pelo Git. Configurações globais de Context7/Octocode ficam fora do repositório.

**Unidades prontas para commit:** nenhuma pendente. O commit atômico da v0.3.0 foi inspecionado e contém todo o conjunto autorizado, inclusive a pendência documental anterior. A entrega de produto v0.2.0 permanece no commit `4feb165`.

## Estado das ferramentas

Superpowers disponível e aplicado. Context7 ativo e consultado; a versão exata Next.js 16.3.6 foi complementada pelos guias locais porque o Context7 não a lista. Octocode 19.1.0 foi executado via CLI com `npx` e busca local validada após configurar `ALLOWED_PATHS`; MCP global `octocode` registrado e habilitado, mas ainda não exposto como ferramenta nesta sessão (pode exigir reabertura). Playwright disponível e usado para testes e inspeção visual. Nenhuma dependência nova foi adicionada ao app.

Na entrega v0.2.0, Git sem identidade configurada recusou a primeira tentativa de commit. Reutilizou-se a identidade consistente dos commits anteriores somente na invocação de commit, sem modificar configurações globais; aquele commit foi criado e verificado.

## Continuidade, contagem e auditoria

- A contagem começa em 2026-09-25, por não haver contagem histórica verificável: 8 interações concluídas desde esse marco, incluindo esta entrega; próxima auditoria na interação 100.
- Última revisão de over-engineering: nenhuma (0).
- Próximo passo executável, quando solicitado: definir autenticação, contrato de criação protegida e persistência do Núcleo; então conectar a etapa de convite inicial sem simular código ou criação.
- Bloqueio: nenhum para a interface atual. Backend, autorização e contas de serviços ainda não configurados para operações reais.

## Índice

- [Histórico](historico.md): eventos e resultados em ordem cronológica.
- [Brag document](../brag/BRAG.md): contribuições verificáveis.
- [Primeira tela](funcionalidades/escolher-caminho.md): escopo e continuidade.
- [v0.1.0 — Escolher caminho](registros/registro-v0.1.0-2026-09-24-imp-tela-escolher-caminho-fun-entrada-nucleo.md): contexto, primeira tela e decisões históricas.
- [v0.2.0 — Tipo de Núcleo](<registros/registro-v0.2.0-2026-09-25-01-imp-tela-tipo-nucleo-fun-selecao-vinculo.md>): escopo, decisões, evidências e continuidade desta entrega.
- [v0.2.0 — Versionamento e rastreabilidade](registros/registro-v0.2.0-2026-09-25-02-imp-documentacao-versionada-fun-rastreabilidade.md): adequação às instruções atualizadas e preparação da entrega GitHub.
- [v0.2.0 — Registro histórico](registros/registro-v0.2.0-2026-09-25-03-imp-padronizacao-registro-historico-fun-rastreabilidade.md): alterações documentais locais, pendentes do próximo commit funcional.
- [v0.3.0 — Propósito do Núcleo](registros/registro-v0.3.0-2026-09-27-imp-tela-proposito-nucleo-fun-rascunho-local.md): formulário, sugestões e conferência local.
- [Frontend web](tecnologias/frontend.md): stack, segurança e organização.
- [Estado anterior](estado-atual.md): referência histórica.
- `README.md`: protocolo do andamento.
