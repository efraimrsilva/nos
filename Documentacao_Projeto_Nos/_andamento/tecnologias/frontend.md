# Frontend web

## Decisões implementadas nesta fatia

- Next.js App Router, TypeScript estrito, React e Tailwind CSS.
- Componentes próprios seguindo o protótipo; fontes Fredoka e Plus Jakarta Sans hospedadas pelo próprio app, sem requisição a Google Fonts.
- `src/app`: rotas e metadados; `src/features/onboarding`: interface do fluxo inicial; `src/shared`: contratos compartilhados de navegação.
- Componentes de servidor por padrão. Nenhum estado global, sessão fictícia ou armazenamento local de dados pessoais.
- Layout de onboarding compartilhado para incorporar as próximas telas sem duplicação de identidade visual.
- Dependências reproduzíveis pelo `package-lock.json`; usar `npm.cmd ci` no Windows.

## Segurança: implementado versus pendente

Implementado: sem chaves/segredos, sem coleta de dados nesta tela, cabeçalhos `nosniff`, anti-iframe, política de referenciador e restrição de câmera/microfone/geolocalização. Esses recursos poderão exigir permissões específicas no futuro; não liberar indiscriminadamente.

Pendente: Supabase/Auth/RLS, validação de entrada no servidor, autorização por associação ao Núcleo, rate limiting de convites, CSP compatível com Next, auditoria de privacidade e testes de isolamento. Cabeçalhos e remoção de comentários não substituem essas proteções. O aplicativo ainda não está pronto para dados reais ou publicação.

## Ambiente

Verificado Node 24.15.0 e npm 11.11.1. A instalação encontrou `UNABLE_TO_VERIFY_LEAF_SIGNATURE`; usar `$env:NODE_USE_SYSTEM_CA='1'` na sessão resolveu o acesso ao npm sem desabilitar TLS. Nenhuma configuração global alterada.

## Verificação

Testes Playwright cobrem a intenção do usuário (criar ou entrar por convite e voltar), navegação por teclado e largura da página em desktop/mobile. Build e TypeScript são verificações separadas. Resultados finais ficam no diário.

## Próxima ação

Adicionar o catálogo extensível de tipos na feature de Núcleos e a tela seguinte. Definir a fronteira web/Capacitor antes de empacotar Android: SSR/rotas de servidor não são executados dentro do pacote nativo. iOS permanece por último.
