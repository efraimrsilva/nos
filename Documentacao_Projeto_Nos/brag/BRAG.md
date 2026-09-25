# Brag document — Projeto Nós

**Versão vigente do projeto:** 0.2.0

Registro factual de contribuições; resultados medidos são separados de benefícios esperados.

## 2026-09-24 — Primeira tela navegável

- **Problema:** o repositório continha visão de produto e protótipo, sem aplicação executável.
- **Contribuição:** criada base Next.js com a tela Escolher caminho, dois destinos preparatórios, componentes de onboarding compartilhados e estilo responsivo/acessível.
- **Resultado verificado:** oito testes Playwright passaram em desktop e mobile; build de produção e checagem de tipos passaram.
- **Benefício esperado:** adicionar as telas do fluxo de Núcleo sem duplicar a identidade visual.
- **Evidência:** `src/app/comecar/page.tsx`, `src/features/onboarding/`, `tests/onboarding.spec.ts`, [registro](../_andamento/registro-2026-09-24.md).

## 2026-09-25 — Escolha de Tipo de Núcleo

- **Problema:** o caminho de criação terminava em uma tela reservada, sem escolha de tipo.
- **Contribuição:** implementados os nove tipos documentados, seleção acessível e obrigatória, passagem validada para o destino de Propósito e retorno com seleção preservada.
- **Resultado verificado:** 16 testes Playwright aprovados em desktop/mobile; build e tipos aprovados; inspeção visual e revisão independente estática sem achados bloqueantes.
- **Benefício esperado:** a próxima tela poderá consumir o mesmo catálogo, sem duplicação de regras por tipo. Backend e criação real continuam pendentes.
- **Evidência:** `tests/nucleus-type.spec.ts` e [registro da implementação](<../_andamento/registros/registro-v0.2.0-2026-09-25-imp-tela-tipo-nucleo-fun-selecao-vinculo-01.md>).
- **Rastreabilidade da entrega v0.2.0:** manifestos e estado central sincronizados, registros por implementação em diretório próprio e histórico anterior preservado. Benefício esperado: localizar escopo e evidências de cada versão. Veja a [adequação documental](../_andamento/registros/registro-v0.2.0-2026-09-25-imp-documentacao-versionada-fun-rastreabilidade-02.md).
