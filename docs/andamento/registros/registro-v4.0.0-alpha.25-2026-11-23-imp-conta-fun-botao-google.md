# Registro — v4.0.0-alpha.25 — 2026-11-23 — Imp. da Conta com Fun. de restauração do botão do Google

**Status e objetivo.** Concluído localmente. Restaurar o botão na Conta Angular com as dimensões, tipografia, borda e ícone do Next.js v3.11.1.

**Decisões, arquivos e integrações.** Estilo em `access-panel.css`. Atlas atualizado em `product.css`, `product-ui.js` e `assets/google-g.png` com o mesmo ícone do aplicativo. A prévia Angular foi reiniciada com `NOS_ANGULAR_GOOGLE=1`, o controle local já documentado. A configuração do provedor e o fluxo de autorização existentes foram preservados.

**Validação e resultado.** Conferência direta no Edge em 1440 e 390 px. Angular, Atlas e referência renderizaram o botão com 43 px de altura, texto de 14 px, bordas arredondadas de 7 px e ícone carregado. [Galeria](../../wireframes/comparacoes/v4.0.0-alpha.25-2026-11-23-botao-google-tela-01-tela-02/index.html).

**Limites e próximo passo.** Testes automatizados dispensados. Acesso pelo Google e publicação ficam fora desta conferência visual. Manter a variável de exibição no próximo início da prévia local.
