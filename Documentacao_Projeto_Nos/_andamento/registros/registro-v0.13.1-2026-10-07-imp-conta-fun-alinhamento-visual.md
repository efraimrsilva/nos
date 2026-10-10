# Registro — v0.13.1 — 2026-10-07 — Imp. de Conta com Fun. de alinhamento visual

**Status:** concluído, revisado e validado no recorte visual. **Impacto:** PATCH. **Base:** main, cfcd57f.

## Objetivo, contexto e requisitos

Corrigir os deslocamentos horizontal e vertical ao alternar Criar conta/Já tenho conta em `/conta`, mantendo o login como referência. Remover o link inferior Conheça o Nós; preservar Voltar às boas-vindas. Não alterar contratos de autenticação.

## Diagnóstico e decisões

O cadastro acrescentava 122px à coluna do formulário em 1440px. A centralização da grade deslocava a árvore/frases em 61px: de y=219 para y=280. A barra de rolagem pode reduzir a largura disponível quando o cadastro ultrapassa a altura da janela. Conta agora reserva esse espaço com `scrollbar-gutter: stable`.

A altura de referência desconta os blocos exclusivos do cadastro e considera a área disponível da janela. `useLayoutEffect` mede antes da pintura; `ResizeObserver` acompanha mudanças de tamanho. Isso evita fixar a árvore em coordenadas de uma única resolução. A regra de alinhamento exige o painel de autenticação, preservando a centralização da Conta autenticada. A versão inicial da regra era ampla demais; achado P2 da revisão independente corrigido antes da entrega.

O respiro inferior de 60px preserva a composição do login após retirar o link duplicado. No celular, a árvore permanece no fluxo normal. Não acrescentamos animação à correção de alinhamento.

## Arquivos e integrações

- `src/app/conta/page.tsx`: marcador da rota, remoção do link e respiro inferior.
- `src/app/globals.css`: reserva da barra e alinhamento restrito ao formulário em desktop.
- `src/features/auth/components/auth-form.tsx`: medição da referência do login e marcação dos blocos exclusivos do cadastro.
- `tests/account-entry.spec.ts`: retorno às Boas-vindas pelo link superior e ausência do link removido.
- Atlas: `atlas.js`, `product-ui.js`, `product.css`, `screens.js`; mesma árvore/frases nas duas abas, link inferior removido, ficha sincronizada. Percursos/destinos e pendências funcionais permanecem válidos.
- Manifestos, README, andamento, frontend, cobertura, contrato de Conta e Brag atualizados para v0.13.1. [Comparação visual](../../wireframes/comparacoes/v0.13.1-2026-10-07-conta-alinhamento-tela_01-tela_02/index.html).

## Validações e resultado

- `npm.cmd test -- --workers=1 tests/account.spec.ts tests/account-entry.spec.ts`: 24/24 aprovados em desktop/celular, com backend desabilitado pelo ambiente de testes.
- `npm.cmd run typecheck`: aprovado.
- `npm.cmd run build`: aprovado; compilação e geração das rotas concluídas.
- Medição Playwright em 1440×900, 1440×1080, 1024×768, 768×1024, 390×844 e 320×568: árvore e título mantêm posição entre as abas, sem transbordamento horizontal. Volta ao login também conferida. Posição da árvore preservada em y=219 em 1440×900.
- Atlas: mesma posição da marca entre as abas. `verify-account-fidelity.mjs`: seis telas em duas larguras, títulos/subtítulos/campos/cor/fonte correspondentes, sem erro. `verify-global-view.mjs`: 72 composições compartilhadas, sincronização, teclado, celular, hash e impressão aprovados.
- Capturas anteriores/depois preservadas e inspecionadas; autorrevisão e revisão independente realizadas. `git diff --check` conferido.

## Limitações e próximos passos

`verify-fidelity.mjs` interrompeu na comparação de `/comecar` sem sessão: esperava Escolher caminho, mas a v0.13.0 já protege essa rota e retorna Conta. É uma premissa anterior do script, fora do ajuste visual; não indica regressão desta entrega. Não usamos sessão privada para contorná-la. Suíte completa e jornada autenticada não repetidas neste recorte.

Context7 disponível e consultado para medição de layout no React. Não ofereceu uma versão indexada exata 19.3; usamos a referência oficial compatível da API e a compilação local. Octocode não foi necessário: não houve pesquisa avançada de dependências/repositórios; buscas locais delimitadas resolveram o diagnóstico. Sem dependência nova, migração, commit, push ou deploy.

Próximo passo: conferir as duas abas manualmente no navegador habitual, principalmente no cruzamento entre conteúdo que cabe na janela e conteúdo com rolagem. Próxima evolução funcional do produto continua o contrato de dados de Nossa Árvore.
