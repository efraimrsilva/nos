## Adequação do aplicativo — atualização de execução — v3.8.0 — 06/11/2026

Proposta → Hábito → Essência no aplicativo, com compatibilidade de leitura e momentos para o legado sem regravar termos, versões, categoria ou aceites. Nova criação normalizada para habit. Essência e passagens somente esboços, com o mesmo informe do Manifesto; sem critérios ou promoção inventados. Integração Hábito/evento, recorrência e mídia continuam planejadas. Mesmas73 fichas/13 etapas;39 recortes existentes e34 planejados, sem converter desenho em entrega funcional. Nova prévia: Acordos18 → Ver esboço de Essência → modal Nossa Essência36; X/Escape/fora, sem escrita. Casos manuais continuam Não executados pelo usuário. [Registro](../registros/registro-v3.8.0-2026-11-06-imp-acordos-fun-modelo-habito.md). As seções datadas abaixo preservam marcos anteriores.

---

# Adequação do Atlas e implementação futura do modelo Hábito — v3.7.2

**Data:** 06/11/2026. **Escopo autorizado nesta entrega:** Atlas vivo, MVP e planejamento. **Contrato:** [Proposta → Hábito → Essência](../funcionalidades/fluxo-proposta-habito-essencia.md). **Stack do Atlas:** HTML, CSS e JavaScript locais; verificação com Playwright 1.63.0. Aplicativo Next.js e banco não são alterados nesta revisão.

## Entrega de planejamento

- [x] Inspecionar o desenho vivo e capturar antes de editar.
- [x] Consolidar o quadro em três colunas e identificar o limite entre modelo-alvo e aplicativo com legado.
- [x] Reaproveitar fichas 34/35 para agendamento/pós-evento; registro27 e histórico25 continuam únicos.
- [x] Ajustar fichas de Proposta, Hábito, Essência, Árvore, percursos, Visão global, cobertura e etapas do MVP.
- [x] Substituir a direção vigente de quatro etapas e registrar compatibilidade, consentimento e pendências de dados.
- [x] Concluir verificação das três visões, navegação, estados, celular/web e galeria antes/depois; atualizar registro e continuidade com resultados.

## Próximas entregas funcionais — ainda não executadas

### 1. Adequar o fluxo existente e o legado — MVP03

**Arquivos responsáveis:** `src/features/agreements/components/agreement-presentation.ts`, `agreements-workspace.tsx`, `src/app/nucleos/[id]/acordos/page.tsx`, página de detalhe, `src/features/agreements/actions.ts`, `proposal-input.ts` e migrações futuras em `supabase/migrations/`.

1. Inventariar dados e contratos que aceitam `experience` no ambiente autorizado. Definir mapeamento, preservação das referências, janela de compatibilidade e recuperação. Não há inventário remoto nesta entrega.
2. Especificar a diferença entre categoria técnica e etapa individual. A eliminação de Experiência da interface pode ser entregue sem simular a promoção individual ainda indefinida.
3. Proteger por regressão: novos acordos continuam `habit`; acordo legado mantém termos, participantes e histórico após o mapeamento aprovado; recusa/saída individual não encerra o acordo; termos novos exigem aceite novo; leitura entre Núcleos é negada.
4. Implementar apresentação, contratos e migração somente após as decisões dependentes. Validar consulta, escrita, gestão e recuperação com dados descartáveis no ambiente local. Não aplicar migração remota por este plano.

**Aceite:** nenhuma coluna, rótulo ou criação pública de Experiência; registros antigos acessíveis e íntegros; nenhuma atribuição fictícia de estágio; ausência de quebra para versões em uso. Casos futuros E06-HAB-005/006.

### 2. Integrar Hábito e agenda — Expansão06, dependência MVP03/04

**Fontes:** detalhe24, histórico25, registro27, agenda14/evento15/formulários16–17; fichas planejadas34/35. Reutilizar módulos de acordos/calendário, sem endpoint ou entidade de Experiência.

1. Fechar vínculo acordo/evento, recorrência, leitura de ocorrências passadas, participantes e visibilidade. Definir correções e retenção do vínculo sem duplicar o registro.
2. Agendar ocorrência pelo Hábito; após evento, oferecer o registro existente somente com associação e aceite vigente. Presença no evento não equivale a prática nem aceita acordo.
3. Conferir evento livre sem acordo: continuar na agenda; encaminhamento a Memórias somente quando esse módulo existir. Não salvar memória em tabela de Hábito sem vínculo real.
4. Validar sucesso, cancelamento, falha, remarcação, evento removido, acordo encerrado e perda de acesso. Integrar mídia apenas com contrato de armazenamento/privacidade próprio.

**Aceite:** um registro de prática, um histórico responsável e vínculos rastreáveis; nenhum registro automático por presença. Casos E06-HAB-003/004/007.

### 3. Fechar e implementar as duas transições — Expansão06/07

**Decisões necessárias:** critérios, atores e evidências de Proposta → Hábito; elegibilidade e consentimentos de Hábito → Essência; representação individual/coletiva, revisão dos termos e legado. São decisões abertas, não parâmetros autorizados por este plano.

Após fechar essas decisões, elaborar o recorte de dados e testes das passagens com duas pessoas em estágios distintos. Nenhum prazo, nível ou volume de registros promove automaticamente. Não reutilizar votos históricos como decisão vigente.

**Aceite:** cada passagem tem evidência da pessoa/prática/versão corretas; ninguém avança por resposta de terceiros. Caso E07-HAB-001.

### 4. Consumir o modelo nos módulos posteriores

Árvore/marcos, Memórias, gratidão, perfis, Manifesto, notificações e conversas usam as fontes de Hábitos/eventos/momentos existentes, com autorização própria. Retirar indicadores e eventos de domínio exclusivos da categoria removida; preservar a distinção entre uso genérico da palavra e etapa de acordo.

**Aceite:** nenhuma contagem duplicada por prática e antiga categoria; eventos reais não inventam frequência ou identidade; notificações e sínteses não promovem pessoas nem revelam conteúdo privado.

## Ordem, validação e publicação

O roteiro geral do MVP mantém suas dependências operacionais de acesso/piloto. A adequação do legado deve preceder expansões que dependam do modelo de acordos; esta revisão não certifica o piloto nem altera resultados manuais anteriores.

Ao executar uma entrega funcional, aplicar Superpowers de execução e verificação, consultar documentação compatível via Context7 e validar o recorte pertinente. Nesta entrega do Atlas, usar somente os verificadores offline de modelo/MVP/Visão global, revisão do diff e galeria. Commit, push e migrações requerem autorização aplicável à nova entrega.
