# Registro — v0.2.0 — 2026-09-25 — Imp. de tela Tipo de Núcleo com Fun. seleção de vínculo

**Versão do projeto:** 0.2.0
**Status:** Concluído, revisado e validado.
**Impacto:** MINOR, nova tela e funcionalidade compatíveis com o fluxo existente (0.1.0 → 0.2.0).

## Contexto e requisitos

O caminho de criação terminava em um espaço reservado. A entrega precisa oferecer todos os tipos documentados, escolha explícita, acessibilidade, navegação responsiva, validação de entrada e retorno com seleção preservada. A documentação anterior foi migrada para o padrão versionado por solicitação do usuário, preservando o conteúdo da implementação.

## Objetivo e escopo

Implementar a próxima tela após Escolher caminho: `/comecar/tipo`. Esta entrega abrange seleção do tipo e navegação para o espaço reservado de Propósito. Não abrange formulário de propósito, criação persistente, autenticação, convites reais ou publicação.

## Decisões e referências

- Referência visual: etapa `obTipoStep` em `Telas/Nós App.dc.html`; conteúdo da tela 30 no catálogo v2.1.
- A decisão vigente de suportar todos os tipos desde o início prevalece sobre a divisão histórica da v1.3 entre tipos iniciais e expansões futuras. Incluídos Casal, Família, Irmãos, Pais e Filhos, Amigos, Equipes, Comunidades, Mentorias e Grupos Religiosos. Os primeiros cinco preservam ordem e descrições do protótipo; os demais recebem descrições curtas compatíveis com o domínio.
- Catálogo tipado em `src/features/nuclei/nucleus-types.ts`, compartilhado pelas etapas. Nenhuma regra de permissão, limite de participantes ou estrutura de backend específica por tipo.
- Nenhuma opção inicialmente selecionada. Rádios nativos oferecem seleção única, validação obrigatória e navegação por setas; feedback de seleção e foco não depende apenas de cor.
- Formulário Next.js navega com o identificador validado na URL. Não há estado global, armazenamento local nem dados pessoais. O identificador aparece no histórico do navegador; não reutilizar este contrato para nomes, propósito ou conteúdo afetivo.
- Cartões responsivos, microinterações de hover/pressionamento e respeito a `prefers-reduced-motion` reutilizam a identidade visual existente. A lista completa usa rolagem vertical normal, sem rolagem horizontal.

## Integrações, navegação e estados

- `/comecar` → `/comecar/tipo`: escolher tipo; Voltar retorna à escolha inicial.
- Continuar sem seleção mantém a tela e usa a validação nativa do navegador.
- Escolha válida → `/comecar/proposito?tipo=<id>`: mostra o tipo escolhido e informa que a próxima etapa está em preparação.
- Voltar de Propósito → `/comecar/tipo?tipo=<id>`: restaura a seleção, inclusive após recarregar Propósito.
- Tipo ausente, desconhecido ou repetido em Propósito redireciona para seleção vazia; na própria tela de seleção, parâmetros inválidos são ignorados.
- Não há requisição de criação, estado de sucesso fictício ou erro remoto a simular. Carregamento de navegação usa o mecanismo do framework; autenticação e backend permanecem pendentes.

## Arquivos principais

- `src/app/comecar/tipo/page.tsx`: substitui o espaço reservado pela seleção.
- `src/features/onboarding/components/nucleus-type-form.tsx`: formulário e apresentação do catálogo.
- `src/features/nuclei/nucleus-types.ts`: tipos e validação de entrada.
- `src/app/comecar/proposito/page.tsx`: destino preparatório validado.
- `src/shared/routes.ts`, `upcoming-step.tsx` e `src/app/globals.css`: integração, retorno e estilos.
- `tests/nucleus-type.spec.ts`, `tests/onboarding.spec.ts`: fluxo novo e regressões da escolha inicial/convite.

## Validações e revisão

- TDD: teste de escolha explícita falhou antes da implementação, pois esperava nove opções e encontrou zero.
- `npm.cmd test`: 16 testes aprovados, desktop e mobile. Cobrem todos os tipos, seleção obrigatória, retorno, recarregamento, teclado, largura de 320px, movimento reduzido e parâmetros inválidos/repetidos.
- `npm.cmd run typecheck`: aprovado.
- `npm.cmd run build`: aprovado, incluindo as novas rotas dinâmicas de Tipo e Propósito. `git diff --check`: aprovado.
- Inspeção visual com Playwright em 1440px e 390px: cartões, seleção, textos e botão legíveis; sem erro de página observado. Capturas temporárias fora do repositório.
- Autorrevisão e revisão independente estática: sem achados bloqueantes. A revisão independente não executou testes; os testes foram executados pelo agente principal.
- Avisos não bloqueantes dos testes: conflito entre variáveis de cor do terminal (`NO_COLOR` e `FORCE_COLOR`).

## Ferramentas e limites

- Skills Superpowers de entendimento, TDD, revisão e verificação aplicadas; revisão React proporcional à mudança, sem efeitos ou estado duplicado.
- Context7 ativo: biblioteca `/vercel/next.js`, consulta de parâmetros assíncronos e navegação/formulário. A lista de versões não inclui exatamente 16.3.6; compatibilidade conferida nos guias locais distribuídos com o Next.js 16.3.6 instalado (`page.md` e `form.md`).
- Octocode não está disponível nas ferramentas desta sessão. Esta entrega usou somente buscas locais delimitadas, sem pesquisa avançada entre repositórios ou pacotes; nenhuma instalação foi necessária para esse escopo.
- agent-browser não foi localizado no ambiente; inspeção visual realizada com o Playwright já instalado.

## Próxima implementação prevista

Implementar a tela **Propósito do Núcleo**: nome, propósito editável, sugestões conforme o tipo e definição do contrato de rascunho antes de coletar conteúdo afetivo. Criar um novo documento datado para essa entrega e preservar este registro. A autenticação e as proteções de backend precisam ser definidas antes da persistência real.

## Entrega Git

Branch `main`, base `32f208c`. Commit e push autorizados pelo usuário para a entrega v0.2.0; resultado verificável pelo histórico e pelas referências do Git. Unidade lógica: tela Tipo de Núcleo, integração preparatória, testes e documentação versionada. Deploy não faz parte desta entrega.

## Resultado

Tela concluída, com nove tipos e passagem validada para Propósito preparatório. Não há criação persistente de Núcleo. A adequação documental desta mesma versão tem registro separado, indexado no estado central.
