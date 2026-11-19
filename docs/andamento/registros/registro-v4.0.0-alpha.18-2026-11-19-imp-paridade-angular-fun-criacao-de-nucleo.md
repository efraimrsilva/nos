# Registro — v4.0.0-alpha.18 — 2026-11-19 — Imp. da paridade Angular com Fun. de criação de Núcleo

**Status:** concluída localmente. Base Git `3a7e6cc`, branch `codex/migracao-angular`.

## Objetivo e requisitos

Retomar o passo visual 04 após a virada pública e aproximar as telas 06–09 da referência Next.js v3.11.1. Preservar escolha de tipo, validação acessível, conferência antes da gravação, edição do rascunho e opção de adiar o convite. O [Atlas](../../wireframes/atlas/index.html#migracao) mostra a mesma sequência com dados ilustrativos.

## Decisões e integrações

- `apps/web/src/app/nuclei/nucleus-wizard.ts`, `nucleus-wizard.css` e `nucleus-purpose.html` portam cartões, grade responsiva, indicação de campo inválido e conferência na própria Tela 08. O tipo permanece no endereço. Os textos ficam em memória durante a conferência e a edição.
- `nucleus-steps.ts`, `shared/nav-icon.ts` e `invitations/initial-invitation.ts` usam ícones existentes e um único indicador Angular nas etapas 07–09. A avaliação de alternativas favoreceu os controles nativos e o Angular atual, que já cobrem entrada, foco e navegação sem dependência nova.
- A solicitação de criação continua usando a função existente do Supabase com o mesmo identificador nas repetições. Isso permite recuperar uma resposta perdida sem criar outro Núcleo. O convite inicial permanece opcional e usa a autorização existente.
- `docs/wireframes/atlas/` recebeu ajustes na apresentação, fichas, conferência e geração ilustrativa do convite. Os manifestos, os lockfiles e a edição do Atlas passaram a v4.0.0-alpha.18, um ajuste compatível na mesma linha de pré-lançamento.
- `.next`, `.next-playwright`, `.next-supabase` e `.next-verify` foram movidas para `arquivo/nextjs-local/`, ignorada pelo Git. A referência visual permanece em [arquivo/nextjs](../../../arquivo/nextjs/README.md) e o snapshot executável em `604a142`.

## Validação e resultado

- `npm run typecheck` e `npm run build` aprovados.
- Quatro testes Playwright autenticados passaram. Em computador e celular, a criação confirmou retorno com tipo selecionado, foco e indicação dos campos inválidos, restauração do rascunho, criação única após perder a primeira resposta e a opção de concluir sem convite. A regressão de convites cobriu escolha, revogação e vínculo confirmado. O seletor desktop foi restringido à lista de Núcleos devido ao cartão e ao cabeçalho terem o mesmo nome.
- `supabase migration up --local` aplicou as revisões já versionadas que faltavam ao ambiente de desenvolvimento. `npm run test:db` passou com 257 verificações em 13 arquivos. O banco hospedado ficou fora desta entrega.
- Angular autenticado e Atlas conferidos em 1440 e 390 pixels, com movimento reduzido e sem erros de página no recorte. A guia Migração passou em ambas as larguras. [Antes, depois e Atlas](../../wireframes/comparacoes/v4.0.0-alpha.18-2026-11-19-paridade-comecar-tela-06-tela-07-tela-08-tela-09/index.html).

## Limites e próximo passo

Autorrevisão do diff e conferência dos links da entrega. A validação específica das Telas 06–09 cobre o percurso. O verificador histórico do MVP de Núcleos continua divergindo da Tela 59, fora deste passo. Nenhum modal foi criado ou alterado. A versão permanece local. O próximo recorte trata da entrada por código, do aceite explícito, da preparação e da gestão de convites nas Telas 10, 11, 58 e 59.
