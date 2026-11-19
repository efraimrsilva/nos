# Registro — v4.0.0-alpha.12 — 2026-11-17 — Imp. de paridade Angular com Fun. de abertura da Conta

**Status:** primeiro recorte concluído e validado localmente. A paridade completa permanece em execução.

**Objetivo e contexto:** usar o Atlas v3.11.1, referência Git `604a142`, para recuperar as telas e microinterações no Angular. A guia Migração reúne os 16 passos visuais e referencia as 73 fichas. Nesta entrega foram trabalhadas Conta e Criar conta (01 e 02).

**Decisões e integrações:** conservar os recursos e frases da versão anterior. O Angular renderiza a árvore e a reflexão com sinais e controla pausa, retomada e desmontagem do relógio. CSS trata a entrada curta e o movimento reduzido. O logo do Google vem dos ativos existentes e só aparece com provedor habilitado. Angular Material ou uma biblioteca de animação acrescentariam dependências para efeitos que CSS e a estrutura atual atendem.

**Arquivos:** `apps/web/src/app/auth` (abertura, formulário e estilos), preparação de ativos, manifestos da prévia, teste de acesso e guia Migração. Sem nova regra de autenticação, novo modal ou migração de banco.

**Validação:** tipos e build Angular aprovados. Verificador da guia Migração aprovou 16 passos, 73 referências de tela únicas, navegação e teclado em desktop/celular. Seis testes Playwright selecionados passaram, incluindo abertura, movimento reduzido, ação de senha e regressões de assistência e navegação. Comparação visual em 1440 e 390 pixels. [Galeria](../../wireframes/comparacoes/v4.0.0-alpha.12-2026-11-17-angular-conta-tela-01-tela-02/index.html)

**Resultado e limites:** cartão de abertura em desktop e celular, oito pontos de luz, reflexão pausável, composição do formulário e ícones da senha e do Google. A captura local não incluiu o botão Google porque o provedor estava desativado. Cabeçalho e rodapé públicos, Boas-vindas e estados dos fluxos de assistência seguem no passo 02. Sem publicação.

**Próximo passo:** abrir o passo 02 na [guia Migração](../../wireframes/atlas/index.html#migracao), comparar as fichas 03–05 e 72 e preservar os fluxos autenticados e de e-mail já existentes.
