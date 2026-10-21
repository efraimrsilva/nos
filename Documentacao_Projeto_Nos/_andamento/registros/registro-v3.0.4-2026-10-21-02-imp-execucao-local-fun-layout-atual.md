# Registro — v3.0.4 — 2026-10-21 — Imp. de execução local com Fun. de layout atual

**Status:** execução local corrigida e validada; exclusão definitiva das compilações antigas bloqueada pelo controle automático. Compilações isoladas fora do aplicativo, sem uso pelo Next.js. Sem alteração no produto ou nova versão.

## Objetivo e contexto
O comando direto next start exibia o layout antigo. O usuário solicitou retirar o layout antigo com cuidado e garantir execução por npm run dev.

## Diagnóstico e decisão
A .next/BUILD_ID original e os arquivos de produção datavam de 15/10/2026, anteriores à ApplicationShell atual. A busca encontrou 16 arquivos compilados com marcadores antigos e nenhum com os novos; o código fonte já usa data-layout=current e revisão 3. Reprodução em /conta: HTTP 200, marcadores antigos presentes e novos ausentes. Também conferida a mesma resposta no servidor existente da porta 3000, cujo comando correspondia ao informado pelo usuário.

next start serve o último build, enquanto next dev usa .next/dev. Context7 consultado: a versão exata 16.3.6 não está indexada; referência da série 16.2.9 e código oficial confirmam a separação e a exigência de build prévio. Não apagar componentes em uso ou documentação histórica para corrigir uma compilação obsoleta.

## Operação e arquivos
Servidor antigo da porta 3000 encerrado após conferir processo, comando, porta e resposta. As pastas geradas .next, .next-authenticated, .next-playwright e .next-verify foram movidas com validação de caminhos para a pasta irmã .codex-obsolete-next-2026-10-21, fora de nos e do escopo TypeScript. Nenhum arquivo fonte, dependência, configuração, dado Supabase ou segredo alterado. O controle automático rejeitou tanto o comando combinado de encerramento/remoção quanto a exclusão exclusiva do isolamento, informando apenas blocked by policy. Não insistir nem contornar: compilações continuam isoladas.

Executado npm run build padrão (Next.js 16.3.6/Turbopack), com novo BUILD_ID. Executado exatamente npm run dev, sem necessidade de alterar o script existente. Servidor de desenvolvimento deixado em http://127.0.0.1:3000; servidor de diagnóstico next start da porta 3210 encerrado. README esclarece desenvolvimento versus produção local. Atualizados estado, histórico, Brag e este registro.

## Validações e resultado
- Build padrão aprovado, incluindo TypeScript e geração de 19 páginas estáticas.
- next start com build atual: /conta, /conta/recuperar e /boas-vindas retornam HTTP 200, layout atual/revisão 3 e ausência de marcadores antigos.
- npm run dev: /conta HTTP 200 e layout novo; quatro execuções de layout-system.spec.ts aprovadas em desktop/mobile com servidor real, verificando navegação, árvore, ausência de elementos antigos, fontes, movimento reduzido e overflow.
- Captura pública existente executada contra dev: 21 capturas, sete rotas em 1440/640/390px, sem overflow. Inspeção visual da Conta desktop aprovada. Evidências locais em artifacts/current-layout-restored-2026-10-21, ignoradas pelo Git.
- Busca no novo .next/server: zero arquivos com garden-art ou surface-panel. Autorrevisão operacional; sem nova revisão independente ou teste autenticado.

## Limites e continuidade
A aplicação usa apenas o layout novo. A cópia de segurança da compilação antiga não foi apagada devido ao bloqueio; ela não está no código fonte nem no caminho servido. Não houve commit, push ou deploy. Para desenvolver: cd na pasta nos e npm run dev. Para produção local após mudanças: npm run build, depois npm start. Não presumir que editar código atualiza um build já existente.

Unidade documental pronta para commit: docs(dev): esclarecer execução local e registrar recompilação do layout atual.

## Fechamento autorizado — 2026-10-21
Usuário autorizou publicar todas as pendências. Este registro e as orientações do README integram a unidade documental de execução local; cópias geradas e capturas ignoradas não integram o Git. A exclusão anteriormente bloqueada não foi repetida.
