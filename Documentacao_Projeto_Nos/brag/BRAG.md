# Brag document — Projeto Nós

## 2026-10-23 — v3.1.0 — autonomia para excluir a própria conta

**Problema:** exclusão dependia de suporte e referências obrigatórias de autoria impediam preservar histórico sem manter a conta. **Contribuição:** exclusão transacional da conta autenticada com confirmação por frase, aviso vermelho e preservação de conteúdo; sucessão e encerramento existentes; histórico separado da presença atual na agenda. **Resultado verificado:** 143 verificações SQL, 130 testes gerais, 12 autenticados relacionados, tipos/build e revisões; rollback provocado preservou a conta e os vínculos. **Benefício esperado:** maior autonomia e menor dependência operacional do suporte. Migração remota aplicada; prova online em andamento. [Evidências](../_andamento/registros/registro-v3.1.0-2026-10-23-imp-conta-fun-exclusao-propria.md).

## 2026-10-20 — v3.0.3 — envio externo pela Brevo

**Problema:** espera pela senha de aplicativo Google impedia comprovar o envio externo; recuperação também carecia do segredo do servidor. **Contribuição:** configuração Brevo/Supabase, segredo protegido em produção e novo deploy sem alterar fontes. **Resultado verificado:** confirmação recebida na caixa de entrada pelo responsável; recuperação solicitada na tela real, registrada como enviada e também recebida na caixa de entrada. Troca de senha pelo link ainda não certificada. Fixture removida e confirmação de cadastro preservada. **Benefício esperado:** permitir o acesso por confirmação externa sem depender de SMTP Gmail. [Evidências e limites](../_andamento/registros/registro-v3.0.3-2026-10-20-03-imp-envio-brevo-fun-autenticacao-email.md).

## 2026-10-20 — v3.0.3 — publicação integral com prova online

**Problema:** site público ainda exibia a versão anterior. **Contribuição:** integração segura em main, publicação automática acompanhada e Atlas/documentos sincronizados. **Resultado verificado:** build Netlify aprovado,27 rotas autenticadas e nove grupos online com duas contas descartáveis, removidas após comparação de oito tabelas. **Benefício esperado:** consistência entre aplicativo publicado e referência viva. [Evidências](../_andamento/registros/registro-v3.0.3-2026-10-20-02-imp-deploy-netlify-fun-publicacao-producao.md).

## 2026-10-20 — v3.0.3 — sobreposição de eventos corrigida na revisão

**Problema:** eventos longos podiam encobrir outros na Agenda. **Contribuição:** distribuição por interseção visual e faixas estáveis, com altura coerente e acesso ao detalhe completo. **Resultado verificado:** três testes unitários e revisão independente aprovados. **Benefício esperado:** reduzir ocultação acidental dos encontros na grade. [Evidência](../_andamento/registros/registro-v3.0.3-2026-10-20-imp-publicacao-layout-fun-consolidacao-interface-e-agenda.md).

## 2026-10-20 — v3.0.1 — identidade ilustrada na Conta
+
+**Problema:** o usuário solicitou recuperar a árvore original após aprovar a reconstrução. **Contribuição:** reutilização do recurso existente, restrita à Conta sem sessão, com tamanho responsivo e Atlas alinhado. **Resultado verificado:**12 testes aprovados e imagem carregada sem overflow em três larguras. **Benefício esperado:** recuperar o elemento de identidade desejado sem ampliar o escopo visual. [Evidências](../_andamento/registros/registro-v3.0.1-2026-10-20-imp-conta-fun-restauracao-arvore.md).

## 2026-10-18 — v3.0.0 — apresentação unificada e modais verificáveis

**Problema:** a migração anterior mantinha interiores antigos e não expunha todos os diálogos da referência. **Contribuição:** reconstrução de estilos/páginas/componentes, diálogos acessíveis e inventário permanente com evidências de origem/gatilho. **Resultado verificado:** 122 testes gerais e94 autenticados consolidados; 73 fichas do Atlas sincronizadas; 406 capturas e20 comparações versionadas. **Benefício esperado, não medido:** maior consistência e facilidade de verificação pelo usuário. [Evidências](../_andamento/registros/registro-v3.0.0-2026-10-18-imp-reconstrucao-layout-novo-fun-interface-e-modais.md).

## 2026-10-18 — v2.0.2 — restauração da conexão local ao Auth

**Problema:** erro de confiança do certificado impedia login local antes da validação da conta. **Contribuição:** causa reproduzida, inicialização do Node corrigida para usar certificados confiáveis do sistema e integração remota auditada sem escrita de dados. **Resultado verificado:** formulário volta a receber resposta do Auth; dez testes e tipos aprovados; nove migrações e contratos de 26 RPCs/27 consultas conferidos. Login da conta pessoal ainda requer confirmação do usuário. **Evidência:** [registro](../_andamento/registros/registro-v2.0.2-2026-10-18-imp-conexao-supabase-fun-correcao-login-local.md).


## 2026-10-18 — v1.1.0 — direção única para o fluxo de Acordos

**Problema:** documentação tratava Hábito e Experiência como categorias independentes, divergindo da sequência esclarecida pelo usuário. **Contribuição:** contrato único para Proposta → Hábito → Experiência → Essência, com avanço individual, distinção do ciclo operacional, limites de autorização e dependências de implementação; referências conceituais e Atlas sincronizados. **Resultado documental:** regra e pendências rastreáveis, com critérios de passagem não presumidos e separação entre decisão e funcionalidade disponível. **Benefício esperado, não medido:** reduzir interpretações incompatíveis em futuras implementações. **Evidência:** [contrato](../_andamento/funcionalidades/fluxo-proposta-habito-experiencia-essencia.md) e [registro](../_andamento/registros/registro-v1.1.0-2026-10-18-imp-documentacao-acordos-fun-fluxo-proposta-habito-experiencia-essencia.md). Sem nova funcionalidade ou migração.


## 2026-10-15 — v1.1.0 — encerramento operacional online

**Problema:** a interface publicada chamava uma função ainda ausente no banco remoto. **Contribuição:** diagnóstico entre Netlify/Supabase, aplicação transacional da migração já versionada e conferência de conteúdo/permissões, preservando dados existentes. **Resultado verificado:** oito grupos online aprovados pelo formulário publicado e consultas autenticadas; acesso e convites bloqueados após encerramento, histórico preservado. Fixture limpa e Núcleo real intacto. **Evidência:** [registro operacional](../_andamento/registros/registro-v1.1.0-2026-10-15-03-imp-correcao-online-fun-encerramento-nucleo.md). Não certifica demais controles do piloto.

## 2026-10-15 — v1.1.0 — encerramento coletivo com preservação da história

**Problema:** administradores não podiam encerrar o espaço para todos. **Contribuição:** confirmação explícita, verificação transacional de administração, revogação de convites e retirada do acesso, preservando dados compartilhados e contas. **Resultado verificado:**24 verificações SQL novas,105 SQL totais e10 testes autenticados aprovados, incluindo concorrência e regressões de saída; Atlas sincronizado. **Benefício esperado:** controle administrativo mais claro, sem medição de uso. **Evidência:** [registro](../_andamento/registros/registro-v1.1.0-2026-10-15-imp-administracao-nucleo-fun-encerramento-coletivo.md). Publicação remota pendente.

## 2026-10-15 — v1.0.1 — foco no conteúdo interno

**Problema:** ilustração persistente ocupava espaço nas tarefas após login. **Contribuição:** árvore opcional por padrão e coluna central; acesso preservado, Atlas sincronizado. **Resultado verificado:** 36 testes e 12 combinações públicas de rota/largura aprovados, sem overflow horizontal. **Benefício esperado:** menos distração durante as tarefas; sem medição de usabilidade. **Evidência:** [registro](../_andamento/registros/registro-v1.0.1-2026-10-15-imp-layout-interno-fun-arvore-opcional.md).

## 2026-10-15 — v1.0.0 — Administração e participação funcionais online

Problema: aplicativo publicado exigia contratos ainda ausentes no banco remoto. Contribuição: implantação coordenada das duas migrações pendentes, conferência do deploy e teste isolado com duas contas. Resultado verificado: onze grupos online aprovados, histórico remoto alinhado aos arquivos, Núcleo e dois membros existentes preservados; contas de teste removidas. Benefício esperado: permitir uso central por contas confirmadas; sem medição de uso. Cadastro/recuperação por e-mail, backup/restauração e piloto integral continuam pendentes. [Evidência](../_andamento/registros/registro-v1.0.0-2026-10-15-02-imp-deploy-online-fun-administracao-participacao.md).

## 2026-10-14 — v1.0.0 — Administração simples com consentimento individual

Problema: votação coletiva, saída bloqueada e ausência de gestão impediam executar o comportamento aprovado. Contribuição: administração compartilhada, nomeações aceitas, sorteio/fechamento atômicos, saída confirmada, preferência de autoria e acordos com gestão administrativa/novo aceite por versão. Resultado verificado:81 testes SQL,81 autenticados/um dispensado e106 gerais aprovados; isolamento, concorrência, reentrada e proteção da autoria exercitados.68 casos passaram após oito migrações do zero. Atlas73telas/80capturas e registros sincronizados. Benefício esperado, sem medição de uso: menos decisões coletivas e menor atrito. Operação do piloto continua pendente. [Evidência](../_andamento/registros/registro-v1.0.0-2026-10-14-13-imp-administracao-nucleo-fun-participacao-individual.md).

## 2026-10-14 — v0.16.0 — Contrato simples de administração e participação

Problema: saída havia acumulado cancelamentos e votações, contrariando a simplicidade pretendida pelo usuário. Contribuição documental: oito respostas consolidadas, seis registros antigos superados e referência única para gestão administrativa/participação individual. Resultado verificado: referências locais válidas e revisão independente sem inconsistências relevantes; código ainda não adaptado. Benefício esperado, não medido: menor custo de implementação/manutenção e menos etapas para o usuário. [Contrato](../_andamento/funcionalidades/administracao-participacao.md), [evidências](../_andamento/registros/registro-v0.16.0-2026-10-14-11-imp-contrato-administracao-fun-respostas-consolidadas.md).

## 2026-10-13 — v0.16.0 — Orientação de autonomia e proteção

Problema: controles do MVP05 planejados e acesso/privacidade/saída sem orientação reunida. Contribuição: cinco páginas autenticadas, vínculo e papel conferidos, recuperação/logout reusados; Atlas e reservas coerentes. Resultado verificado:106 testes gerais produção e quatro autenticados, incluindo isolamento e conservação de vínculo; revisão independente corrigida. Benefício esperado: reduzir dúvidas sobre alcance das notas e diferença entre logout/saída, sem medição de uso. [Evidência](../_andamento/registros/registro-v0.16.0-2026-10-13-imp-controles-autonomia-fun-mvp-05.md). MVP05 ainda parcial.

## 2026-10-13 — v0.15.2 — remoção consciente na agenda

**Problema:** remoção imediata contrariava confirmação prevista; Atlas misturava campos/funções atuais e futuros. **Contribuição:** confirmação contextual, ciência no servidor, cancelamento sem gravação, foco/feedback e fluxo sincronizado. **Resultado verificado:** seis casos desktop/mobile comprovam confirmação/cancelamento, bloqueio sem ciência, paginação, presença/remarcação, autorização e isolamento. **Benefício esperado:** reduzir remoções acidentais e tornar limites da agenda compreensíveis; não medido com usuários. **Evidência:** [testes](../../tests/authenticated/calendar.spec.ts), [registro](../_andamento/registros/registro-v0.15.2-2026-10-13-imp-agenda-interna-fun-mvp-04.md), [galeria](../wireframes/comparacoes/v0.15.2-2026-10-13-mvp-04-tela_14-tela_16-tela_15-tela_17/index.html).
## 2026-10-13 — v0.15.1 — ciclo de Hábito verificável e história acessível

**Problema:** revisões acima de vinte não tinham acesso pela interface; Atlas misturava caminho principal/legado e trazia indicadores/evento sem contrato suficiente. **Contribuição:** paginação estável, pendência preservada, leitura concorrente corrigida e planejamento sincronizado com limites explícitos. **Resultado verificado:** 23 revisões empatadas acessíveis sem repetição em desktop/mobile; duas pessoas completam registro, confirmação, recusa, ajuste/novo ciclo e encerramento com memória preservada; SQL/jornada ampliada de legado e isolamento aprovados. Benefício esperado: facilitar acompanhamento sem esconder decisões abertas; não medido com usuários. **Evidência:** [teste](../../tests/authenticated/habit-cycle.spec.ts), [registro](../_andamento/registros/registro-v0.15.1-2026-10-13-imp-ciclo-habito-fun-mvp-03.md), [galeria](../wireframes/comparacoes/v0.15.1-2026-10-13-mvp-03-tela_24-tela_28-tela_33/index.html).

**Versão vigente do projeto:** 0.15.2

## 2026-10-13 — MVP 02 com gestão de convites — v0.15.0

- **Problema:** gestão exigia operação manual, sem RPC ou tela do criador; geração simultânea podia criar mais de um código ativo.
- **Contribuição:** gestão paginada/confirmada, revogação autorizada/idempotente e bloqueios no banco; navegação e reservas futuras sincronizadas no Atlas.
- **Resultado verificado:** 102 testes gerais, rodadas autenticadas e seis finais da gestão; banco seis arquivos/19 verificações, concorrência comprovada nas duas ordens. Tipos/build e Atlas aprovados; publicação remota ainda pendente.
- **Benefício esperado:** autonomia do criador e menos risco de compartilhar códigos indisponíveis; impacto de uso ainda não medido.
- **Evidência:** [registro](../_andamento/registros/registro-v0.15.0-2026-10-13-imp-nucleo-compartilhado-fun-mvp-02-gestao-convites.md).

## 2026-10-13 — Conexão e login publicados no Netlify

- **Problema:** site online sem variáveis de ambiente; login retornava autenticação não configurada, e Supabase autorizava apenas retornos locais.
- **Contribuição:** conexão pública e origem do aplicativo no contexto Production; Site URL/retornos Supabase ajustados com configuração parcial; nova publicação sem cache.
- **Resultado verificado:** login no formulário publicado, sessão privada, saída e proteção após saída passaram em teste HTTP com conta temporária confirmada, removida e ausência comprovada. Deploy 6ace48f47aa1bb0b8a70bc68 publicado. Cadastro com confirmação externa continua pendente de SMTP; não foi comprovado recebimento.
- **Evidência:** [registro operacional](../_andamento/registros/registro-v0.14.1-2026-10-13-03-imp-conexao-netlify-fun-acesso-online.md).

## 2026-10-12 — MVP aprovado com cobertura e fonte visual compartilhada

- **Problema:** faltava uma prioridade aprovada que distinguisse primeiro valor utilizável do caminho até todo o produto.
- **Contribuição:** 13 etapas com dependências e critérios, login existente como início, 37 telas/estados no primeiro marco e cobertura de 72 telas/184 ações. Reuso da fonte/composição do atlas, aviso de nova tela sem etapa e documentação de manutenção conjunta.
- **Resultado verificado:** cobertura única, login Entrar, atualização de fonte, filtros/teclado/celular/retorno/hash/impressão aprovados. Revisão independente resolveu funções sem etapa; seis amostras de comparação documental acrescentadas após aprovação.
- **Benefício esperado:** orientar prioridades e reduzir divergências entre planejamento e implementação; redução de retrabalho ainda não medida. Aprovação não representa módulos concluídos.
- **Evidência:** [plano aprovado](../_andamento/planos/mvp.md), [registro](../_andamento/registros/registro-v0.14.0-2026-10-12-imp-mvp-atlas-fun-roteiro-aprovado.md), [guia viva](../wireframes/atlas/index.html#mvp) e [comparação](../wireframes/comparacoes/v0.14.0-2026-10-12-mvp-atlas-tela_01-a-tela_72/index.html).

## 2026-10-10 — Conferência da proposta e clareza do Percurso 05

- **Problema:** envio direto sem conferência e percurso disponível misturado às telas guiadas ainda planejadas.
- **Contribuição:** conferência local de todos os termos, aceite do autor explícito, edição/erro sem perda; caminho disponível e reservas guiadas sincronizados, com origem visual correta e categorias preservadas.
- **Resultado verificado:** 92 testes gerais, 4 casos autenticados desktop/celular e 1 comparador completo; banco/tipos/build/Atlas aprovados. Aceite e recusa pela interface, cancelar recusa sem escrita. 72 prévias/184 saídas/360 estados/52 layouts; zero erro ou chamada externa no Atlas.
- **Benefício esperado:** reduzir envio sem revisão e tornar pendências compreensíveis; nenhuma métrica de uso foi medida.
- **Evidência:** [registro](../_andamento/registros/registro-v0.14.0-2026-10-10-imp-proposta-habito-fun-percurso-05.md), [contrato](../_andamento/funcionalidades/proposta-habito.md), [comparação](../wireframes/comparacoes/v0.14.0-2026-10-10-proposta-habito-tela_18-tela_19-tela_20-tela_21-tela_22-tela_23-tela_24/index.html).

## 2026-10-10 — Entrada por convite e sequência do Percurso 04

- **Problema:** prévia omitia tipo já disponível, ação de adiamento não existia no aplicativo e percurso tratava passagem pela lista como obrigatória.
- **Contribuição:** tipo pelo catálogo existente, navegação de adiamento sem escrita, erro vinculado ao código e sincronização de estados/sequência/reservas no Atlas.
- **Resultado verificado:** 92 testes gerais, 16 casos autenticados de convite e um verificador completo autenticado aprovados; tipos/build e Atlas/Visão global aprovados. Consulta/adiamento não criam vínculo; repetição mantém associação única e papel. Autorrevisão e revisão independente sem P1–P3. Benefício esperado: decisão mais clara e retomada previsível.
- **Limite:** QR, link, gestão e certificação pública permanecem pendentes; evidência funcional exclusivamente local. Nenhuma métrica de conversão foi medida.
- **Evidência:** [registro](../_andamento/registros/registro-v0.13.3-2026-10-10-imp-entrada-convite-fun-percurso-04.md), [contrato](../_andamento/funcionalidades/entrada-convite.md) e [comparação](../wireframes/comparacoes/v0.13.3-2026-10-10-entrar-convite-tela_10-tela_11/index.html).

## 2026-10-09 — Recuperação de acesso e sequência do Percurso 03

- **Problema:** retorno da recuperação abria cadastro, e callback aceitava alguns parâmetros ambíguos para processamento no Auth.
- **Contribuição:** retorno ao login com destino interno preservado; rejeição de credenciais repetidas/misturadas antes do serviço; etapas do percurso e dependência SMTP sincronizadas no Atlas; configuração Gmail isolada e comando com prompt oculto, sem persistir credenciais.
- **Resultado verificado:** 92 testes desktop/celular, tipos/build e Atlas aprovados; recuperação real local recusou senha antiga, aceitou nova, revogou renovação de outra sessão, rejeitou link reutilizado/prova adulterada e manteve link válido após entradas ambíguas. Revisão independente sem P1–P3. Benefício esperado: menos confusão na retomada e contrato de recuperação mais rigoroso.
- **Limite:** preparação SMTP conferida com diff remoto somente leitura; ativação aguarda senha de app após liberação do Google e teste externo. Resultado local não certifica operação pública.
- **Evidência:** [registro v0.13.2](../_andamento/registros/registro-v0.13.2-2026-10-09-imp-recuperacao-acesso-fun-percurso-03.md) e [comparação](../wireframes/comparacoes/v0.13.2-2026-10-09-recuperar-acesso-tela_04-tela_05/index.html).

## 2026-10-07 — Estabilidade visual em Conta

- **Problema:** cadastro deslocava a árvore/frases 61px em desktop e a barra de rolagem podia mudar a largura da composição.
- **Contribuição:** referência de altura do login, reserva da barra e remoção de link duplicado; Atlas e evidência visual sincronizados.
- **Resultado verificado:** mesma posição entre abas em seis tamanhos; 24 testes de Conta, tipos/build e comparação específica do Atlas aprovados. Benefício esperado: alternância de acesso mais confortável.
- **Evidência:** [registro v0.13.1](../_andamento/registros/registro-v0.13.1-2026-10-07-imp-conta-fun-alinhamento-visual.md), com [galeria](../wireframes/comparacoes/v0.13.1-2026-10-07-conta-alinhamento-tela_01-tela_02/index.html).

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

## 2026-10-07 — Recuperação segura e continuidade de entrada

- **Problema:** recuperação/redefinição ausentes, confirmação sem reenvio e atlas com composições planejadas divergentes da aplicação.
- **Contribuição:** conclusão da área de entrada, prova de recuperação assinada e vinculada à sessão, mensagens neutras inclusive em falha SMTP, revogação e retorno de convite. Seis composições sincronizadas com comparação visual.
- **Resultado verificado:** 108 testes desktop/mobile; jornada real local confirmou troca de senha e revogação de outra sessão. Atlas com 72 prévias/178 saídas/360 estados, sem erro/rede externa; revisão independente com achados corrigidos. Configuração nos-dev reconferida.
- **Benefício esperado:** permitir retomar o acesso sem suporte manual e reduzir divergência entre planejamento e produto. Não medida taxa de recuperação/conversão nem entrega remota.
- **Evidência:** [registro](../_andamento/registros/registro-v0.12.0-2026-10-07-imp-conta-entrada-fun-recuperacao-integrada.md) e [comparação](../wireframes/comparacoes/v0.12.0-2026-10-07-conta-entrada-tela_01-tela_02-tela_03-tela_04-tela_05-tela_72/index.html).

## 2026-10-07 — Visão global com conteúdo compartilhado

- **Problema:** faltava uma leitura conjunta da sequência e das ramificações, e criar outra coleção de desenhos exigiria manutenção duplicada.
- **Contribuição:** visão iniciada em Conta reutiliza as 72 composições e os 13 percursos; diferencia saídas previstas e contexto. Procedimento permanente exige atualização conjunta do app/atlas e galeria de comparação em cada criação ou alteração.
- **Resultado verificado:** teste conferiu igualdade das 72 composições, propagação de título/dependência/ação e inclusão de tela nova, navegação, filtros e celular. Revisão independente identificou e reconferiu a correção de um P2. Seis capturas antes/depois preservadas; fidelidade das seis telas reais de Conta reconferida em duas larguras.
- **Benefício esperado:** facilitar decisões de navegação e evitar divergência entre visões. Redução de retrabalho futuro ainda não medida; sincronização com o app continua exigindo conferência por entrega.
- **Evidência:** [teste](../wireframes/tools/verify-global-view.mjs), [galeria](../wireframes/comparacoes/v0.12.0-2026-10-07-visao-global-tela_01-a-tela_72/index.html) e [registro](../_andamento/registros/registro-v0.12.0-2026-10-07-03-imp-visao-global-atlas-fun-sequencia-sincronizacao-comparacoes.md).


## 2026-10-07 — Navegação privada e entrada pelos vínculos existentes

- Problema: onboarding abria sem sessão e login reenviava integrantes ao fluxo inicial; Tela12 ainda planejada.
- Contribuição: validação no proxy, retorno seguro, listagem real sob RLS e protocolo de login para formulário expirado; Atlas e galeria sincronizados.
- Resultado verificado: 132 testes desktop/celular, tipos/build e Atlas aprovados; acesso a outro Núcleo negado, renovação válida mantida e envio expirado sem criação. Revisão independente sem achados materiais restantes. Integração desta entrega somente local.
- Benefício esperado: reduzir confusão ao entrar e impedir renderização privada sem identidade válida.
- Evidência: [registro v0.13.0](../_andamento/registros/registro-v0.13.0-2026-10-07-05-imp-navegacao-protegida-fun-sessao-seus-nucleos.md), src/proxy.ts, src/app/nucleos/page.tsx e tests/authenticated/session-navigation.spec.ts.


## 2026-10-13 — v0.14.1 — Mensagens corretas na entrada da conta

- Problema: falha do serviço ou limite do Auth era apresentado como credenciais incorretas; consulta pública ignorava indisponibilidade.
- Contribuição: separar mensagens de limite/transporte/credenciais e sinalizar consulta de sessão falha, preservando retorno interno e privacidade dos e-mails.
- Resultado verificado: regressão falhou antes/passou depois; 100 testes gerais, tipos/build e jornada real local de e-mail aprovados; revisão independente sem achados relevantes restantes.
- Benefício esperado: orientar a próxima tentativa sem induzir troca desnecessária de senha. Redução de tentativas não medida. Gmail externo ainda pendente.
- Evidência: [registro](../_andamento/registros/registro-v0.14.1-2026-10-13-imp-acesso-existente-fun-mvp-etapa-01.md), tests/auth-service.spec.ts e [comparação](../wireframes/comparacoes/v0.14.1-2026-10-13-acesso-indisponivel-tela_01/index.html).

## 2026-10-18 — v2.0.0 — Identidade visual coerente em toda a aplicação

- **Problema:** a aplicação usava a primeira composição e não representava a nova direção de navegação e módulos.
- **Contribuição:** estrutura compartilhada, migração das rotas/ações existentes, Kanban/Painéis/lista, ícones e movimentos acessíveis; seis esboços privados com limites explícitos; Atlas e comparação completa sincronizados.
- **Resultado verificado:**122 testes gerais,87 cenários autenticados consolidados/1 dispensa e tipos/build aprovados;73 fichas/207 ações/365 estados do Atlas sem erros/rede;165 capturas. Achados de navegação, acessibilidade e evidência resolvidos; sem alteração de regras ou dependências.
- **Benefício esperado:** consistência da experiência e menor custo para manter navegação/identidade. Ganho de usabilidade não foi medido com pessoas usuárias.
- **Evidência:** [registro](../_andamento/registros/registro-v2.0.0-2026-10-18-imp-layout-atual-fun-migracao-integral.md), [galeria](../wireframes/comparacoes/v2.0.0-2026-10-18-layout-atual-tela_01-a-tela_73/index.html) e testes de layout/navegação.

## 2026-10-21 — v3.0.4 — Contexto do Núcleo visível no Início
Problema: propósito exigia abrir um diálogo. Contribuição: propósito e vínculo visíveis acima dos blocos. Benefício esperado: facilitar reconhecer a intenção compartilhada e o próprio papel. Evidência: página nucleos/[id], Atlas e seis testes de lógica aprovados; sem medição de uso.

## 2026-10-21 — v3.0.4 — Execução local alinhada ao código atual
Problema: start servia compilação com layout antigo. Contribuição: diagnóstico pela resposta HTTP e artefatos, isolamento seguro do build obsoleto e recompilação atual, sem exclusão de funcionalidades. Resultado verificado: dev e produção local com layout novo, build padrão aprovado, quatro testes de interface e21 capturas públicas sem overflow. Exclusão definitiva do isolamento bloqueada pelo controle automático.
