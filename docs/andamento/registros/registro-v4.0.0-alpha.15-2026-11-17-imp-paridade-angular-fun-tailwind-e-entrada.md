# Registro — v4.0.0-alpha.15 — 2026-11-17 — Imp. de base Angular com Fun. de Tailwind e entrada

**Status:** validado localmente.

**Objetivo:** disponibilizar os utilitários Tailwind no Angular inteiro e aplicar a referência Next.js v3.11.1 às telas 01–02. A guia Migração e o Atlas conferem o resultado.

**Decisões e integração:** reutilizar Tailwind 4 e PostCSS do lockfile da raiz. A entrada global registra toda a árvore `app` e mapeia os nomes de tokens do Next.js à paleta dinâmica Angular. O Preflight permanece desativado. Os estilos próprios de AuthForm e PasswordInput e a transição de account-motion.css foram portados para `access-panel.css`. ResizeObserver mede a altura real; o foco de navegação preserva o controle em mudanças só de consulta. O Google mantém feedback próprio e a assistência conserva os modais e regras existentes.

**Arquivos:** `apps/web/src/styles.css`, `app.ts`, `auth/access-page.*`, `auth/access-panel.css` e `auth/auth.css`. Teste Playwright de foco e altura, manifestos Angular, Atlas e continuidade.

**Evidência:** tipos e build Angular. Playwright de acesso e navegação com 17 aprovações e uma dispensa no desktop, mais quatro aprovações em aparência, privacidade e perfil. Cadastro, confirmação e recuperação com e-mail local. Classe de acessibilidade conferida em navegador novo e comparação em 1440 e 390 pixels. [Galeria com 12 capturas](../../wireframes/comparacoes/v4.0.0-alpha.15-2026-11-17-tailwind-entrada-tela-01-tela-02/index.html)

**Resultado e limites:** base Tailwind disponível para os demais recortes. A entrada recupera o indicador de modo, a altura animada, o controle de senha e avisos. As demais telas conservam o próprio CSS e serão portadas conforme o roteiro. O ambiente local não tinha Google habilitado; as capturas cobrem e-mail e senha. Nenhuma publicação, dependência nova ou mudança de esquema.

**Próximo passo:** retomar o passo 03 pelo código Next.js, começando pelos controles incorporados ao perfil e ao Mais e pelo lembrete de suporte.
