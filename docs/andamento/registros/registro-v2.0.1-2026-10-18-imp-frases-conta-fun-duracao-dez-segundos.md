# Registro — v2.0.1 — 2026-10-18 — Imp. de frases da Conta com Fun. duração de dez segundos

**Status:** concluído, revisado e validado localmente. Impacto PATCH.

**Objetivo, contexto e requisitos:** alterar as frases de /conta de 7 para 10 segundos, preservando pausa, retomada, sorteio sem repetição e movimento reduzido.

**Decisão e integrações:** DISPLAY_DURATION passa a 10_000 ms em src/features/onboarding/components/account-reflections.tsx. A mesma constante controla a troca e o tempo restante da pausa. As animações em globals.css já duravam 10 segundos e ficam alinhadas ao temporizador.

**Arquivos:** componente, tests/account-reflections.spec.ts, package.json, package-lock.json, README.md, estado.md, historico.md e este registro.

**Validações:** o teste de limite atualizado falhou antes da correção nos dois dispositivos. Após a correção, npm.cmd test -- tests/account-reflections.spec.ts --workers=1 aprovou oito testes de desktop/celular: limite 9.999/10.000 ms, ciclos completos sem repetição, pausa/retomada, sorteio e movimento reduzido. npm.cmd run typecheck aprovado; git diff --check aprovado. Autorrevisão pontual concluída.

**Resultado e limitações:** duração de 10 segundos implementada localmente. Sem nova dependência, banco, commit, push ou deploy. Build não repetido para este ajuste pontual.

**Próximo passo:** conferir /conta manualmente e incluir o ajuste na unidade visual ainda pendente de commit.
