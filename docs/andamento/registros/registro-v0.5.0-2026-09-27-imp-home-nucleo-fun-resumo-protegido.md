# Registro — v0.5.0 — 2026-09-27 — Imp. de Home do Núcleo com Fun. resumo protegido

**Versão vigente do projeto:** 0.5.0
**Status:** Concluído, revisado, validado localmente e incluído em commit atômico; `origin/main` é o destino autorizado, sem deploy.

## Objetivo e contexto

Evoluir o resumo protegido de `/nucleos/[id]` para a primeira etapa da Home. O banco atual oferece identidade, tipo e propósito do Núcleo, além do vínculo da pessoa autenticada. O protótipo prevê árvore, agenda e gratidão, cujos dados e permissões ainda não existem.

## Requisitos e decisões técnicas

- Exibir apenas dados reais do Núcleo autorizado e da participação da pessoa autenticada. O tipo usa o catálogo compartilhado; a participação vem de `nucleus_members`, cujo RLS só expõe o próprio vínculo.
- Preservar autenticação e RLS. Sessão ausente ou expirada pede entrada; falha operacional do Auth mostra erro com nova tentativa. Núcleo inexistente ou sem vínculo retorna 404; falha de consulta mostra erro com opção de tentar novamente.
- Oferecer estado inicial honesto e ação de convite somente a quem criou o Núcleo.
- Não mostrar árvore, agenda, gratidão, contadores ou membros fictícios. Planejar contratos e permissões desses módulos em entregas próprias.
- Manter layout responsivo, navegação por teclado e feedback de carregamento e erro.

## Arquivos alterados e integrações

`src/app/nucleos/[id]/page.tsx`, `loading.tsx`, `error.tsx`, `src/features/nuclei/nucleus-access.ts`, `nucleus-home-details.ts`, `tests/nucleus-home.spec.ts`, `package.json`, `package-lock.json`, README e documentação de andamento. A página usa o cliente Supabase SSR já existente e mantém a política RLS da v0.4.0, sem migração ou dependência nova. A v0.5.0 é MINOR pela evolução compatível da Home.

## Validações realizadas

Três testes novos começaram com falha esperada na derivação de tipo, papel, ação de convite e distinção de falha do Auth; passaram após a implementação. A suíte completa aprovou 52 testes Playwright em desktop/mobile. `npm.cmd run typecheck` e `npm.cmd run build` passaram. A revisão independente apontou o tratamento de erro do Auth e dos tokens expirados; ambos foram corrigidos antes da validação final. A autorrevisão do diff e `git diff --check` foram executados ao concluir a entrega.

## Resultado, limitações e próximos passos

A Home apresenta nome, tipo, propósito, participação e ação de convite adequada ao criador. O estado inicial explica o alcance real da página; carregamento e falha têm feedback. Os testes automatizados executam sem conexão Supabase e não comprovam o novo layout com uma sessão real; a proteção de rota e o fluxo real de associação foram validados na entrega v0.4.0. Não houve nova migração nem publicação.

A próxima etapa será especificar e validar a agenda interna do Núcleo, conforme a Tela 03 do catálogo v2.1, a regra do calendário v1.9, o modelo de Evento v2.4, a matriz de permissões v2.5 e os estados vazios v2.6. O recorte inicial deve definir evento, participante, horários/fuso, autor, operações, visibilidade, RLS e testes com contas distintas. Sincronização externa fica fora dessa fatia. Árvore e gratidão exigem contratos próprios antes de aparecer.
