# Registro — v3.3.3 — 2026-10-30 — Imp. de Núcleos com Fun. convite no cabeçalho

Status: concluído localmente. Versão: 3.3.3 (PATCH).

## Objetivo, contexto e requisitos
Adicionar “Entrar com convite” imediatamente à esquerda de “Criar um núcleo” em /nucleos, em computador e celular. Preservar painel removido anteriormente e ações existentes.

## Decisões e integrações
Link reutiliza routes.invitation (/comecar/convite); criação continua abrindo o mesmo modal. Grupo flexível com espaçamento e tamanho adaptados no celular. Sem mudança de banco, autenticação ou dependências. Atlas já possuía as ações; ajuste impede quebra de linha entre elas. Sem modal novo/alterado. Superpowers de entendimento, revisão e verificação aplicadas; remoção/adição de marcação não exige consulta nova a APIs de bibliotecas. Context7 disponível; Octocode não exposto, sem pesquisa avançada necessária.

## Arquivos alterados
src/app/nucleos/page.tsx; src/app/layout-system.css; tests/authenticated/nuclei-layout.spec.ts; Atlas product-ui.js/product.css/index.html; manifestos de versão; README; acompanhamento/manual/galeria.

## Validação
Tipos e build aprovados. npm run test:authenticated -- nuclei-layout.spec.ts: quatro testes desktop/mobile aprovados. Atlas: botões alinhados em desktop/mobile e atalho da conta visível. Autorrevisão: ordem visual/DOM, destino do link, ausência de overflow e modal de criação preservado. Sem revisão independente.

## Resultado, limites e próximo passo
[Galeria](../../wireframes/comparacoes/v3.3.3-2026-10-30-convites-tela_12-tela_13-tela_66/index.html). Antes do aplicativo copiado da captura real da entrega imediatamente anterior v3.3.2, nesta sessão; antes do Atlas capturado antes do ajuste. Dados descartáveis locais/ilustrativos. Teste de caixa preta do usuário não executado; sem commit, push ou deploy. Próximo passo: abrir /nucleos e testar convite pelo novo atalho.

Verificação final: Visão global aprovada (73 telas, composições compartilhadas, teclado/mobile/hash/impressão, zero erros); git diff --check aprovado. Versão 3.3.3 sincronizada nos manifestos, README, estado e identificação do Atlas.
