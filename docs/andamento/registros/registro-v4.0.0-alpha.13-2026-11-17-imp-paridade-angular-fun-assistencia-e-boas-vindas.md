# Registro — v4.0.0-alpha.13 — 2026-11-17 — Imp. de paridade Angular com Fun. de assistência e Boas-vindas

**Status:** passo 02 da guia Migração, validado localmente.

**Objetivo e contexto:** recuperar a apresentação das fichas 03, 04, 05 e 72 do Atlas v3.11.1. Preservar destinos, estados e permissões dos fluxos de acesso.

**Decisões e integrações:** usar o cabeçalho público e ocultar a navegação interna nas rotas públicas, mantendo a mesma saída e o mesmo ponto de foco do Angular. Reutilizar a reflexão na tela de Boas-vindas. Usar os modais existentes para e-mail, seu fechamento compartilhado e avisos acessíveis. A redefinição preserva a prova de recuperação, o retorno interno e a limpeza da sessão. CSS e Angular atendem ao recorte sem biblioteca adicional.

**Arquivos:** estrutura compartilhada em `app.html`, `app.ts` e `app.css`; Boas-vindas em `preview-home.ts`; `auth/` para modais, aviso, redefinição e reflexão; testes de acesso e navegação; Atlas e manifestos da prévia. Sem mudança de regras do banco.

**Modais:** Confirmar e-mail e Recuperar acesso abrem pelos links de assistência e pelos endereços diretos nas telas 03–04. O formulário usa e-mail e comunica confirmação, envio ou falha conforme o serviço. X, Escape e gesto externo fecham sem enviar e preservam o destino. Redefinir senha é uma rota da tela 05.

**Validações:** tipos e build Angular aprovados. Playwright de acesso e navegação: 15 passaram e um cenário exclusivo do menu móvel foi omitido no desktop. O verificador da guia Migração passou nas duas larguras. Autorrevisão do diff, 24 imagens e links conferidos. Percurso local de cadastro, confirmação, reenvio, renovação de sessão e redefinição por e-mail descartável em desktop e celular. Comparação em 1440 e 390 px. [Galeria](../../wireframes/comparacoes/v4.0.0-alpha.13-2026-11-17-angular-acesso-publico-tela-03-tela-04-tela-05-tela-72/index.html)

**Resultado e limites:** cabeçalho e rodapé públicos, composição de Boas-vindas e apresentação da assistência e redefinição. A galeria da tela 05 no aplicativo mostra o estado de link ausente; o formulário com link válido foi exercitado pelo teste autenticado. Sem publicação.

**Próximo passo:** passo 03 na [guia Migração](../../wireframes/atlas/index.html#migracao), começando pelos ícones, grupos e estrutura de navegação autenticada.
