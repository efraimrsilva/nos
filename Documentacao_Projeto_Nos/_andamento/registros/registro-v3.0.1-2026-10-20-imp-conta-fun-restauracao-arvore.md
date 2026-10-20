# Registro — v3.0.1 — 2026-10-20 — Imp. de Conta com Fun. de restauração da árvore

Status: concluído e validado localmente. PATCH visual; versão anterior3.0.0. Branch codex/novo-layout, referência de44ca8. Sem commit, push ou deploy. Alterações preexistentes preservadas.

## Objetivo, contexto e requisitos

Após aprovar o Layout novo, o usuário autorizou retornar somente a árvore que aparecia antes em `/conta`. Essa autorização é uma exceção pontual à remoção da apresentação antiga: reutilizar a ilustração original, mantendo toda a estrutura nova, os formulários, as frases de10 segundos e o comportamento de sessão existente.

## Decisão e arquivos

- `src/shared/components/application-shell.tsx`: reutiliza `/brand/nos-tree.png` com Next Image, dimensões intrínsecas, sizes e preload. Renderiza somente dentro do painel habilitado por showTree e na rota `/conta`; a página continua fornecendo `showTree={!user}` a partir de getUser.
- `src/app/layout-system.css`: largura máxima280px no computador e160px até700px, mantendo proporção e espaçamento no painel novo.
- `wireframes/atlas/product-ui.js` e `product.css`: árvore nas prévias01/02 de cadastro/login; demais telas, incluindo72, preservadas. Imagem do Atlas já existente, sem duplicação de recurso.
- `tests/layout-system.spec.ts`: verifica imagem visível/carregada na Conta e ausente na recuperação e nas boas-vindas.
- Manifestos, README, guia, cobertura, fidelidade, andamento e galeria atualizados para3.0.1. Fontes de imagem originais não alteradas.

## Integrações, modais e limites

Somente apresentação. Sem alteração de autenticação, ações, banco, permissões, textos das frases ou temporizador. Não cria nem altera **modais**; a regra e o inventário permanente continuam vigentes. Não restaura estilos ou outros elementos do primeiro layout. O módulo funcional Árvore permanece esboço e não é afetado pela ilustração decorativa.

## Validações e revisão

Ausência da árvore reproduzida antes da correção em verificação de navegador. Depois:12 testes de Conta/layout/reflexões aprovados, análise de tipos aprovada, sintaxe do JavaScript do Atlas e diff conferidos. Conta inspecionada em1440/640/390px: imagem carregada e sem transbordamento horizontal. Atlas01/02 em computador/celular conferidos,72 sem árvore restaurada. Autorrevisão focal; não houve nova revisão independente.

O servidor isolado3100 excedeu o prazo de120s. Alternativa: configuração temporária ignorada pelo Git reutiliza somente as verificações de leitura no servidor local3000, com traces desativados por limitação de gravação já conhecida. Não foram enviados formulários nem alterados dados. A condição autenticada foi preservada por inspeção de código; não houve nova jornada com banco/autenticação ou build de produção nesta alteração visual.

[Galeria v3.0.1](../../wireframes/comparacoes/v3.0.1-2026-10-20-conta-arvore/index.html): nove capturas, com antes/depois nos mesmos tamanhos e prévias do Atlas. Evidências anteriores preservadas.

## Resultado e próximo passo

Ilustração original restaurada somente na Conta sem sessão, com composição nova e responsividade preservadas. Usuário pode atualizar `/conta` e alternar cadastro/login para conferir. Unidade pronta para commit; publicação depende de autorização.
