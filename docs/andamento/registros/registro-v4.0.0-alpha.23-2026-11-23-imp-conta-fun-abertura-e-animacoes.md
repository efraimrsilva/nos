# Registro — v4.0.0-alpha.23 — 2026-11-23 — Imp. da Conta com Fun. de abertura e animações

**Status.** Concluído localmente em `codex/migracao-angular`, a partir de `aaa6d0d`.

**Objetivo e requisitos.** Em `/conta`, alinhar o formulário ao topo, sortear a subida dos oito vagalumes, transicionar as frases e alternar cinza, verde e dourado na barra conforme o Next.js v3.11.1. Evitar exposição visual da navegação interna enquanto o roteador resolve a abertura.

**Decisões e integrações.** A estrutura começa no modo público enquanto o caminho ainda está indefinido. O formulário vem primeiro no documento e na coluna móvel, com ilustração à esquerda no desktop. A decoração renova o trajeto a cada volta. A frase e a barra usam o mesmo ciclo de dez segundos e pausam em conjunto. Movimento reduzido conserva o texto e esconde as animações. A solução reutiliza Angular, estilos e o relógio existentes, sem novas dependências. O Context7 foi consultado na linha Angular 22.0.x para a identidade do bloco repetido. A versão 22.2.0 do projeto foi preservada.

**Arquivos.** `app.ts`, `access-page.html`, `access-panel.css`, `account-story.{ts,html,css}`, teste `access.spec.mjs`, manifestos e Atlas vivo (`product-ui.js`, `product.css`, `screens.js` e `index.html`). As fichas 01 e 02 registram os ajustes. Os modais existentes mantêm o contrato e os estados originais.

**Validações.** `npm run typecheck` e `npm run build` aprovados. O flash foi reproduzido antes da correção e coberto por teste de regressão. Os 12 casos de `tests/angular/access.spec.mjs` passaram em desktop e celular, incluindo confirmação, recuperação e sessão no Supabase local. Usou-se o Edge instalado porque o Chromium empacotado do Playwright estava ausente. Em 1440 e 390 pixels, o Angular e o Atlas foram conferidos quanto ao sorteio do voo, troca de frase, três fases da barra, pausa e preferência de movimento reduzido. [Galeria](../../wireframes/comparacoes/v4.0.0-alpha.23-2026-11-23-conta-tela-01-tela-02/index.html).

**Limites.** O verificador geral `verify-fidelity.mjs` falhou no estado `1/success`, com o mesmo resultado em cópia de `aaa6d0d` anterior à alteração. A conferência específica do recorte passou. A revisão do diff foi feita pelo próprio implementador. A entrega está apenas no ambiente local.

**Próximo passo.** Conferir visualmente Conta no navegador local e retomar a paridade 09 de Acordos.
