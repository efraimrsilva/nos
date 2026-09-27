# Brag document — Projeto Nós

**Versão vigente do projeto:** 0.4.0

Registro factual de contribuições; resultados medidos são separados de benefícios esperados.

## 2026-09-24 — Primeira tela navegável

- **Problema:** o repositório continha visão de produto e protótipo, sem aplicação executável.
- **Contribuição:** criada base Next.js com a tela Escolher caminho, dois destinos preparatórios, componentes de onboarding compartilhados e estilo responsivo/acessível.
- **Resultado verificado:** oito testes Playwright passaram em desktop e mobile; build de produção e checagem de tipos passaram.
- **Benefício esperado:** adicionar as telas do fluxo de Núcleo sem duplicar a identidade visual.
- **Evidência:** `src/app/comecar/page.tsx`, `src/features/onboarding/`, `tests/onboarding.spec.ts`, [registro](../_andamento/registros/registro-v0.1.0-2026-09-24-imp-tela-escolher-caminho-fun-entrada-nucleo.md).

## 2026-09-25 — Escolha de Tipo de Núcleo

- **Problema:** o caminho de criação terminava em uma tela reservada, sem escolha de tipo.
- **Contribuição:** implementados os nove tipos documentados, seleção acessível e obrigatória, passagem validada para o destino de Propósito e retorno com seleção preservada.
- **Resultado verificado:** 16 testes Playwright aprovados em desktop/mobile; build e tipos aprovados; inspeção visual e revisão independente estática sem achados bloqueantes.
- **Benefício esperado:** a próxima tela poderá consumir o mesmo catálogo, sem duplicação de regras por tipo. Backend e criação real continuam pendentes.
- **Evidência:** `tests/nucleus-type.spec.ts` e [registro da implementação](<../_andamento/registros/registro-v0.2.0-2026-09-25-01-imp-tela-tipo-nucleo-fun-selecao-vinculo.md>).
- **Rastreabilidade da entrega v0.2.0:** manifestos e estado central sincronizados, registros por implementação em diretório próprio e histórico anterior preservado. Benefício esperado: localizar escopo e evidências de cada versão. Veja a [adequação documental](../_andamento/registros/registro-v0.2.0-2026-09-25-02-imp-documentacao-versionada-fun-rastreabilidade.md).

## 2026-09-27 — Propósito do Núcleo

- **Problema:** o fluxo de criação parava antes de nomear o Núcleo ou definir seu propósito.
- **Contribuição:** formulário acessível com sugestão por tipo, edição livre, validação e conferência local sem enviar conteúdo afetivo ou simular criação.
- **Resultado verificado:** 22 testes Playwright passaram em desktop/mobile; tipos e build passaram; inspeção visual em tela estreita e revisão própria realizadas.
- **Benefício esperado:** conectar a criação protegida futura sem reutilizar a URL para transportar nome ou propósito.
- **Evidência:** `tests/nucleus-purpose.spec.ts` e [registro da implementação](../_andamento/registros/registro-v0.3.0-2026-09-27-imp-tela-proposito-nucleo-fun-rascunho-local.md).

## 2026-09-27 — Conta, criação protegida e convite

- **Problema:** o fluxo parava em um rascunho local; não havia identidade, gravação protegida nem entrada de outra pessoa.
- **Contribuição:** integrados Supabase Auth/SSR, confirmação de e-mail, criação atômica de Núcleo e criador, convite com prévia e aceite explícito, RLS e resumo protegido. A interface evita manter o aceite quando o código digitado muda.
- **Resultado verificado:** 46 testes Playwright, tipos e build passaram; no `nos-dev`, um Núcleo real ficou associado a um `creator` e um `member`. Antes do aceite, a conta convidada recebeu página não encontrada; depois, os dois participantes mantiveram acesso ao resumo após F5. O primeiro convite exposto foi revogado.
- **Benefício esperado:** permitir a evolução da Home do Núcleo sobre contratos de conta e associação já validados, mantendo o acesso restrito aos participantes.
- **Evidência:** migração `supabase/migrations/20260927173656_create_nuclei_and_invitations.sql`, `src/features/auth/`, `src/features/invitations/`, `tests/` e [registro v0.4.0](../_andamento/registros/registro-v0.4.0-2026-09-27-imp-integracao-supabase-fun-criacao-convite.md).
