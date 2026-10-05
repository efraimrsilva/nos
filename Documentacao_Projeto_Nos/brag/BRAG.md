# Brag document — Projeto Nós

**Versão vigente do projeto:** 0.11.0

## 2026-09-27 — Agenda interna do Núcleo

- **Problema:** participantes não tinham como combinar um momento e registrar presença dentro do Núcleo.
- **Contribuição:** agenda privada com criação, resposta individual, edição e remoção autorizadas; migração com RLS e operações autenticadas, navegação por páginas e datas com fallback de fuso.
- **Resultado verificado:** migração aplicada no `nos-dev`; duas contas testaram o fluxo e a negativa de acesso a outro Núcleo. Dados temporários foram removidos. 64 testes desktop/mobile, tipos e build passaram; dois achados da revisão independente foram corrigidos.
- **Benefício esperado:** apoiar a organização de encontros sem expor eventos fora do Núcleo.
- **Evidência:** [registro v0.6.0](../_andamento/registros/registro-v0.6.0-2026-09-27-01-imp-agenda-interna-fun-eventos-nucleo.md), `src/app/nucleos/[id]/agenda/`, `supabase/migrations/20260927221149_create_nucleus_calendar.sql` e `tests/calendar-event.spec.ts`.

## 2026-09-27 — Primeira Home protegida do Núcleo

- **Problema:** após criar ou aceitar um convite, a pessoa via apenas um resumo provisório sem contexto do próprio vínculo.
- **Contribuição:** a Home passou a mostrar nome, tipo, propósito e participação reais; convite permanece disponível só para o criador. Estados de carregamento, falha e início foram incluídos sem dados afetivos simulados.
- **Resultado verificado:** 52 testes Playwright em desktop/mobile, checagem de tipos e build passaram localmente. Uma falha de classificação do erro de autenticação foi corrigida após revisão independente. O novo layout não foi testado com sessão Supabase real nesta interação.
- **Benefício esperado:** permitir a evolução da Home por áreas com dados e permissões próprios, preservando o isolamento por Núcleo.
- **Evidência:** `src/app/nucleos/[id]/`, `tests/nucleus-home.spec.ts` e [registro v0.5.0](../_andamento/registros/registro-v0.5.0-2026-09-27-imp-home-nucleo-fun-resumo-protegido.md).

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

## 2026-09-29 — Acordos com consentimento explícito

- **Problema:** integrantes não tinham um espaço real para propor hábitos e experiências nem registrar concordância individual antes de iniciar a prática.
- **Contribuição:** criada a Tela 04 com propostas, filtros, respostas próprias e estado vazio honesto para Essência; migração com RLS e funções autenticadas que exigem unanimidade para entrar em teste e serializam respostas simultâneas.
- **Resultado verificado:** migração aplicada no `nos-dev`; três contas temporárias confirmaram aceite, recusa e isolamento entre Núcleos. Dados temporários removidos com contagens finais zero. O teste pgTAP local passou e 68 testes Playwright desktop/mobile passaram na validação final; a revisão independente não encontrou defeito material no código.
- **Benefício esperado:** sustentar a futura tela de detalhe do hábito com propostas reais em teste, sem tratar proposta como acordo ativo ou simular progresso.
- **Evidência:** `supabase/migrations/20260928120000_create_nucleus_agreements.sql`, `supabase/tests/nucleus_agreements.sql`, `tests/agreement-input.spec.ts` e [registro v0.7.0](../_andamento/registros/registro-v0.7.0-2026-09-28-imp-hub-acordos-fun-propostas-consentimento.md).

## 2026-09-29 — Detalhe protegido do Hábito

- **Problema:** a proposta aceita aparecia somente na lista, sem contexto próprio para consultar o que o Núcleo concordou em experimentar.
- **Contribuição:** criada a Tela 05 com acesso restrito a Hábito em teste, dados reais, resposta própria e retorno para Acordos; limites de acompanhamento são comunicados sem simulação.
- **Resultado verificado:** 70 testes Playwright, tipos e build passaram. Três contas locais em dois Núcleos confirmaram navegação, acesso, isolamento, categoria/estado e leitura da resposta própria sob RLS. Os dados temporários foram removidos.
- **Benefício esperado:** permitir que revisão e registro de momento sejam integrados posteriormente sobre uma consulta protegida já existente.
- **Evidência:** `src/app/nucleos/[id]/acordos/[agreementId]/page.tsx`, `tests/habit-detail.spec.ts` e [registro v0.8.0](../_andamento/registros/registro-v0.8.0-2026-09-29-imp-detalhe-habito-fun-consulta-proposta-teste.md).

## 2026-10-02 — Revisão do Hábito com consentimento — v0.10.0

- **Problema:** o Hábito em teste não podia receber ajustes ou encerramento consensual.
- **Contribuição:** revisão persistida com respostas individuais, reflexão de sete dias, prontidão agregada e aplicação transacional; histórico de momentos preservado.
- **Resultado verificado:** três contas locais confirmaram fluxo, isolamento, concorrência e interface móvel; testes de banco, 80 testes Playwright, tipos e build aprovados. Migração aplicada no nos-dev, quatro funções equivalentes às locais. Interface remota não revalidada.
- **Benefício esperado:** permitir renegociar compromissos sem alteração unilateral ou perda de registros.
- **Evidência:** [registro](../_andamento/registros/registro-v0.10.0-2026-10-02-imp-revisao-habito-fun-consentimento-reflexao.md), supabase/tests/nucleus_habit_revisions.sql e scripts/verify-habit-revision-local.mjs.

## 2026-10-03 — Confirmação proporcional do Hábito

- **Problema:** não havia prazo real nem caminho para active; unanimidade pós-teste poderia prolongar espera por respostas esquecidas.
- **Contribuição:** duração consentida, ciclos preservados e ativação proporcional após prazo; regras visíveis antes das ações e proteção transacional/RLS.
- **Resultado verificado:** 84 testes, tipos, build, cinco arquivos de banco e fluxo local com cinco contas aprovados; 150/151 exigem 76/51. Migração no nos-dev e 13 funções equivalentes conferidas.
- **Benefício esperado:** permitir efetivação com votos suficientes e tornar o critério compreensível; tempo de aprovação em uso real não medido.
- **Evidência:** [registro v0.11.0](../_andamento/registros/registro-v0.11.0-2026-10-03-imp-confirmacao-habito-fun-teste-votacao-proporcional.md), migração 20261003120000 e scripts/verify-habit-trial-local.mjs.

## 2026-10-03 — Guia visual completo de desenvolvimento

- **Problema:** o protótipo e as regras estavam distribuídos entre imagens, HTML, documentação e recortes implementados; faltava uma sequência visual com Conta primeiro e indicação de pendências.
- **Contribuição:** atlas navegável de 72 telas/estados, com fichas de contratos, permissões e saídas, 12 percursos e mapa das 37 interfaces de origem. Planejadas e recortes existentes distinguem intenção de implementação.
- **Resultado verificado:** 37 origens cobertas, IDs/destinos íntegros, 72 prévias e 360 estados renderizados sem erro JavaScript. Verificações de filtros, teclado, móvel e impressão CSS; revisão independente com dois achados corrigidos e conferidos. Versão funcional preservada.
- **Benefício esperado:** reduzir ambiguidades e orientar a ordem das próximas entregas; redução de retrabalho ainda não medida.
- **Evidência:** [guia](../wireframes/GUIA.md), [cobertura e pendências](../wireframes/COBERTURA.md) e [registro de planejamento](../_andamento/registros/planejamento-2026-10-03-wireframe-completo.md).

## 2026-10-04 — Atlas fiel à identidade e às composições aprovadas

- **Problema:** o wireframe simplificado divergia das telas implementadas e da estrutura aprovada, aumentando o risco de decisões de UX inconsistentes.
- **Contribuição:** incorporadas 28 telas em 52 composições/variações, entrada baseada no código, fontes/SVG locais, abas e procedência explícita; exemplos históricos separados de contratos atuais.
- **Resultado verificado:** paleta e títulos de três rotas e SVG/textos dos nove tipos comparados ao app; 72 telas, 173 saídas e 360 estados aprovados, sem erros de execução ou chamadas externas. Revisão independente resolveu regras e destinos inconsistentes.
- **Benefício esperado:** reduzir divergências e retrabalho de interface; esse efeito ainda não foi medido.
- **Evidência:** [procedência e manutenção](../wireframes/FIDELIDADE.md), [verificação](../wireframes/tools/verify-fidelity.mjs) e [registro](../_andamento/registros/registro-v0.11.0-2026-10-04-imp-fidelidade-visual-atlas-fun-referencia-ux-aprovada.md).

## 2026-10-05 — Referência visual prioritária para as próximas implementações

- **Problema:** a manutenção do atlas precisava explicitar sua prioridade visual e como conferir fidelidade na execução de cada tela.
- **Contribuição:** procedimento central de consulta obrigatória, prioridade alta do modo vivo, comparação com a interface real e atualização conjunta, referenciado nos pontos de entrada e retomada.
- **Resultado verificado:** sinais e pendências das 72 fichas coincidem com inventário e navegador; os 27 recortes existentes apontam para rotas do código. Verificação completa do atlas passou novamente.
- **Benefício esperado:** orientar consistentemente o desenvolvimento e reduzir divergências visuais; efeito sobre retrabalho ainda não medido.
- **Evidência:** [procedimento](../wireframes/GUIA.md#prioridade-alta-do-atlas-vivo--decisão-de-2026-10-05) e [registro](../_andamento/registros/registro-v0.11.0-2026-10-05-imp-prioridade-atlas-vivo-fun-orientacao-visual-implementacao.md).
