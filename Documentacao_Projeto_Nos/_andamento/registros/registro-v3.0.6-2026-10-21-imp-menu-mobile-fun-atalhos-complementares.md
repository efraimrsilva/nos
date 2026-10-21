# Registro — v3.0.6 — 2026-10-21 — Imp. de menu mobile com Fun. de atalhos complementares

**Status:** concluído localmente; sem commit, push ou deploy.

## Objetivo e requisitos
Retirar Início, Acordos, Agenda e Pessoas de Mais no celular, porque já estão na barra inferior. Preservar os demais destinos e a navegação desktop.

## Decisões e arquivos
ApplicationShell filtra os grupos do diálogo usando os destinos de mobileItems no contexto de Núcleo e remove grupos vazios. Sem Núcleo selecionado, a navegação existente permanece. A lista completa continua usada pelo desktop e pela busca. Não há detecção de viewport por JavaScript ou alteração de sessão/permissões. O diálogo só é aberto pela barra móvel existente.

Arquivos: src/shared/components/application-shell.tsx; tests/authenticated/layout-navigation.spec.ts; Documentacao_Projeto_Nos/wireframes/atlas/product-ui.js; manifestos de versão e registros. Atlas usa os destinos complementares aos quatro primeiros da sua barra fixa. PATCH 3.0.6. Trabalho anterior não commitado preservado.

## Validação e revisão
Verificação isolada com renderização React real de ApplicationShell, dependências de navegação substituídas e pathname de Núcleo: falhou antes em Duplicado em Mais: Início e passou após a correção. Confere quatro ausências em Mais, quatro presenças na barra inferior e desktop, ausência de grupo vazio e preservação dos outros seis destinos. Artefato local ignorado artifacts/verify-mobile-more.cjs; não certifica autenticação ou interação integral no navegador.

npm run typecheck aprovado; quatro testes públicos layout-system.spec.ts contra npm run dev aprovados em desktop/mobile; node --check do Atlas aprovado; autorrevisão e git diff --check. Teste autenticado existente recebeu asserções de não duplicação, barra inferior e grupos; não foi executado nesta rodada. Sem build novo, revisão independente ou prova visual autenticada.

## Resultado, limites e próximo passo
Mais complementa a barra inferior do Núcleo, sem atalhos duplicados. Conferir manualmente no celular: abrir Mais, verificar Seus Núcleos, áreas de história/vínculos, Conta e Preferências; fechar e usar os quatro atalhos inferiores. Em desktop, verificar navegação completa. Sem novas dependências ou documentação de API necessária; Superpowers de entendimento/verificação proporcionais.

Unidade pronta para commit: fix(navegacao): remover atalhos duplicados do menu Mais no celular.

## Fechamento autorizado — 2026-10-21
Commit/push autorizado para todas as pendências. Tipos, dez testes de lógica/interface pública, verificação isolada e build Turbopack aprovados. Asserções autenticadas conferem a barra antes de abrir o diálogo para respeitar o foco modal; suíte autenticada não executada. Ver registro abrangente desta publicação.
