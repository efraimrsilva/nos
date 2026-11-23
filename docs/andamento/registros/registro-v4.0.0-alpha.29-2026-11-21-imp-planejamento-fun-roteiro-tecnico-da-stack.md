# Registro — v4.0.0-alpha.29 — 2026-11-21 — Imp. do planejamento com Fun. de roteiro técnico da stack

**Status.** Planejamento documentado na branch `codex/migracao-angular`, base `bdf2c8f`. As fases 2–7 estão planejadas e o aceite da fase 1 segue em andamento.

**Objetivo.** Conferir se toda a evolução da stack tinha caminho no plano de migração e no Atlas e organizar entregas com dependências e critérios verificáveis.

**Decisões.** A primeira fase fecha a paridade 16 e o aceite hospedado da web já publicada. Nx e o piloto NestJS têm aceites independentes. O piloto usa Supabase Auth e preserva as autorizações do banco. A decisão de identidade precede a escolha do transporte de tempo real. PWA e mobile são entregas próprias após a estabilização web. O piloto mobile depende dos serviços selecionados e passa primeiro por Android.

**Arquivos e integração.** [Stack](../../stack.md), [Plano de migração](../planos/migracao-angular.md#ordem-de-implementação), [Plano MVP](../planos/mvp.md), [Atlas · Migração](../../wireframes/atlas/index.html#migracao), [Atlas · MVP](../../wireframes/atlas/index.html#mvp) e [Guia](../../wireframes/guia.md). Os verificadores acompanham o roteiro e a navegação entre guias. A etapa 13 do MVP referencia as fases técnicas. O catálogo preserva as 73 fichas.

**Validação.** Verificação da guia Migração em 1440 e 390 pixels, do roteiro MVP e da Visão global do Atlas. Os verificadores conferem as sete fases, rótulos e critérios, navegação por teclado, acesso à stack, impressão e cobertura das fichas. Conferência de links locais e revisão do diff.

**Limites.** A entrega atualiza documentação e planejamento no Atlas. A versão do aplicativo permanece `4.0.0-alpha.29`. Sessão, fila, recebimento externo de relatos e ensaio de retorno hospedados continuam pendentes da fase 1.

**Próximo passo.** Fechar os recortes escolhidos da paridade 16 e registrar os resultados do ensaio hospedado antes de iniciar Nx.
