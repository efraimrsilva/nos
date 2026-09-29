# Frontend web

**Versão vigente do projeto:** 0.7.0

## Decisões implementadas nesta fatia

- Next.js App Router, TypeScript estrito, React e Tailwind CSS.
- Componentes próprios seguindo o protótipo; fontes Fredoka e Plus Jakarta Sans hospedadas pelo próprio app, sem requisição a Google Fonts.
- `src/app`: rotas e metadados; `src/features/onboarding`: interface do fluxo inicial; `src/features/auth`, `src/features/invitations` e `src/lib/supabase`: conta e integração; `src/shared`: contratos compartilhados de navegação.
- Componentes de servidor por padrão. Nenhum estado global, sessão fictícia ou armazenamento local de dados pessoais; a sessão real usa cookies protegidos.
- Layout de onboarding compartilhado para incorporar as próximas telas sem duplicação de identidade visual.
- Dependências reproduzíveis pelo `package-lock.json`; usar `npm.cmd ci` no Windows.

## Segurança: implementado versus pendente

Implementado: sem chaves secretas no app ou Git, cabeçalhos `nosniff`, anti-iframe, política de referenciador e restrição de câmera/microfone/geolocalização. Esses recursos poderão exigir permissões específicas no futuro; não liberar indiscriminadamente.

Validado no desenvolvimento: Supabase Auth/SSR, confirmação e entrada, criação protegida, RPCs de convite/aceite e leitura por RLS. Um Núcleo teve um `creator` e um `member`; antes do aceite a conta convidada recebeu página não encontrada e, depois, ambos mantiveram o resumo após F5. A expiração natural de sete dias não foi observada. Ainda faltam rate limiting operacional de convites, SMTP próprio, recuperação de senha, CSP compatível com Next, auditoria de privacidade e testes operacionais antes da publicação. Cabeçalhos não substituem essas proteções.

## Ambiente

Verificado Node 24.15.0 e npm 11.11.1. A instalação encontrou `UNABLE_TO_VERIFY_LEAF_SIGNATURE`; usar `$env:NODE_USE_SYSTEM_CA='1'` na sessão resolveu o acesso ao npm sem desabilitar TLS. Nenhuma configuração global alterada.

## Verificação

Testes Playwright cobrem a intenção do usuário (criar ou entrar por convite e voltar), navegação por teclado e largura da página em desktop/mobile. Build e TypeScript são verificações separadas. Resultados finais ficam no diário.

## Evolução e próxima ação

Catálogo extensível e tela Tipo de Núcleo implementados em 2026-09-25, em `src/features/nuclei` e `src/features/onboarding`, com formulário Next.js e validação do identificador nas páginas de servidor. Consulte o [registro próprio](<../registros/registro-v0.2.0-2026-09-25-01-imp-tela-tipo-nucleo-fun-selecao-vinculo.md>).

Propósito foi implementado em 2026-09-27 como [rascunho apenas em memória](../registros/registro-v0.3.0-2026-09-27-imp-tela-proposito-nucleo-fun-rascunho-local.md). A [entrega v0.4.0](../registros/registro-v0.4.0-2026-09-27-imp-integracao-supabase-fun-criacao-convite.md) acrescentou criação protegida, conta e convite real.

A [Home v0.5.0](../registros/registro-v0.5.0-2026-09-27-imp-home-nucleo-fun-resumo-protegido.md) usa `nuclei` e o vínculo próprio em `nucleus_members`, protegidos por RLS, com estados de carregamento e falha. A agenda ganhou contrato próprio na v0.6.0; árvore e gratidão ainda aguardam dados e permissões. Definir a fronteira web/Capacitor antes de empacotar Android: SSR/rotas de servidor não são executados dentro do pacote nativo. iOS permanece por último.

A [agenda interna v0.6.0](../registros/registro-v0.6.0-2026-09-27-01-imp-agenda-interna-fun-eventos-nucleo.md) tem contrato de evento e participante, autorização, RLS e interface. A migração foi aplicada ao `nos-dev` como `20260927221149_create_nucleus_calendar`; criação, resposta, edição, remoção e negativa de acesso a outro Núcleo foram testadas com duas contas. Sincronização com calendários externos fica para outra entrega. A [continuidade](../estado.md) traz o próximo passo executável.

A [Tela 04 Acordos v0.7.0](../registros/registro-v0.7.0-2026-09-28-imp-hub-acordos-fun-propostas-consentimento.md) apresenta propostas de Hábitos e Experiências, voto individual e transição para teste por unanimidade. A migração SQL, a RLS e o fluxo de consentimento foram validados no Supabase local e no `nos-dev` com contas temporárias; Essência e progresso permanecem sem dados simulados.
