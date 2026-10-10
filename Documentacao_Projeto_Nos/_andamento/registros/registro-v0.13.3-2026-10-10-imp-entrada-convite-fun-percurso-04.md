# Registro — v0.13.3 — 2026-10-10 — Imp. de entrada por convite com Fun. de Percurso 04

**Status:** correções funcionais, Atlas e galeria concluídos, revisados e validados localmente. Operação pública e extensões sinalizadas pendentes.

## Objetivo, contexto e requisitos

Usuário solicitou conferir todas as telas/funcionalidades do Percurso 04, ordenar páginas e concluir o máximo possível, reservando o futuro. Base Git main/446d3ee, inicialmente limpa. Consulta e aceite já existiam; Atlas obrigava passagem pela lista em todos os casos e mostrava adiamento sem equivalente no aplicativo. Prévia recebia tipo sem exibi-lo.

Requisitos: sessão validada; conferir sem criar vínculo; consentimento explícito; validade/revogação reavaliadas no aceite; acesso privado somente após associação; repetição sem duplicação ou elevação de papel; futuro claramente identificado.

## Decisões técnicas e integrações

Reutilizado catálogo de tipos e contrato existente do banco. `Link` de adiamento/retorno evita mutações. Erro de aceite retorna código correspondente e só aparece associado àquela prévia. Sem nova dependência, rota ou migração. Mantido código fora de URLs, registros e capturas; não habilitado transporte por link sem contrato próprio.

Atlas: 01 → 10 → 11 → 13 → 12 representa chegada direta e reencontro posterior do vínculo; entrada comum 01 → 12 → 10 descrita como alternativa. Cadastro/confirmação/recuperação preservam retorno sem aceite. Estados específicos e reservas QR/link/gestão sincronizados com Visão global. Inventário permanece 72 telas, 14 percursos, 31 recortes e 41 planejadas.

## Arquivos alterados

- `src/features/invitations/actions.ts` e `components/invitation-entry.tsx`: tipo, adiamento/retorno, associação do erro ao código.
- `tests/authenticated/invitation-flow.spec.ts` e `invitation-entry.spec.ts`: duas contas locais, casos de limite, seletor restrito ao conteúdo e mensagem compatível com o contrato vigente.
- `wireframes/atlas/screens.js`, `product-ui.js`, `atlas.js`: percurso, ações, prévia e estados.
- `wireframes/tools/verify-invitation-journey.mjs`, cobertura, guia, fidelidade e galeria datada: coerência da navegação e evidência visual.
- Manifestos, README, continuidade, histórico, Brag e contratos: PATCH 0.13.2 → 0.13.3 após validação funcional.

## Validações realizadas

- TDD (Test Driven Development, desenvolvimento orientado por testes): ausência de tipo reproduzida com duas contas reais antes da correção; repetição funcional aprovada.
- 92 testes gerais desktop/celular aprovados, tipos e build aprovados.
- 16 testes autenticados de convite aprovados, incluindo chegada direta/login, consulta/adiamento sem vínculo, edição de código, expiração/revogação, revogação após consulta, aceite explícito e navegação à lista, repetição sem duplicação e preservação de papel.
- 20 testes autenticados de navegação passaram na execução combinada. Oito testes novos falharam naquela execução por seletor de alerta incluindo o anúncio interno do Next; seletor corrigido e casos repetidos com sucesso.
- Atlas Percurso 04 e Visão global: sequência, login, edição, adiamento, cinco estados, teclado/celular/sincronização e zero erros/chamadas externas aprovados. Sintaxe JavaScript conferida.
- Autorrevisão e revisão independente somente leitura: sem achados P1–P3 no código/Atlas/testes. A revisão independente não executou testes.
- Tipos/build repetidos após versionamento para v0.13.3 aprovados; links locais e imagens conferidos. Consulta confirmou zero contas das fixtures, e Supabase local foi encerrado com backup, sem reset. Galerias antigas preservadas.

## Resultado, limites e próximos passos

Fluxo central funcional e mais claro. Capturas usam exemplos, códigos mascarados e contas locais removidas pelas fixtures. Comparador geral de fidelidade requer sessão autenticada; tentativa sem sessão comparou Conta com Escolher caminho e foi rejeitada corretamente. Comparação autenticada final aprovada: 72 prévias, 181 saídas, 360 estados, 41 referências e 52 layouts; zero erros/chamadas externas. Reexecução final: 17 testes aprovados (16 funcionais + fidelidade geral), uma repetição mobile dispensada porque o próprio comparador cobre ambas as larguras. Galeria desktop/celular inspecionada. Espaço visível reservado junto à Tela 10 sinaliza QR/link sem ativação.

QR/câmera, convite por link, gestão/revogação por interface e convites individuais não foram implementados. Reservas e dependências detalhadas no [contrato](../funcionalidades/entrada-convite.md). SMTP/recebimento externo e ambiente de publicação continuam pendentes. Sem alteração remota, commit/push ou deploy.

Próximo passo: para evolução funcional, definir contrato de gestão da Tela 59 antes de implementação; para operação pública, retomar preparação Gmail após liberação da senha de aplicativo. Commit/push autorizados em interação posterior; objeto Git inspecionado e pendência de commit retirada por prova de inclusão dos arquivos. [Registro da publicação](registro-v0.13.3-2026-10-10-02-imp-publicacao-git-fun-rastreabilidade-entrada-convite.md).
