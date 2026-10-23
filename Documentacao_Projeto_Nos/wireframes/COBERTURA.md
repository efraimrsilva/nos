# Cobertura e pendências do wireframe

**Publicação vigente — v3.0.3 — 20/10/2026:** layout completo em [produção](https://noslife.netlify.app/conta), deploy6ad7eeb747e9c9a82835d3b5/main@8b529e8. Build Netlify aprovado;27 rotas autenticadas verificadas com fixtures removidas. Atlas preserva73 fichas,39 recortes existentes/34 planejadas e20 contextos modais, sem promover esboços a funcionalidades. [Registro](../_andamento/registros/registro-v3.0.3-2026-10-20-02-imp-deploy-netlify-fun-publicacao-producao.md) · [prints](comparacoes/v3.0.3-2026-10-20-producao-netlify/index.html). Marcos abaixo são históricos; SMTP/piloto completo mantêm pendências.

**Atualização vigente — v3.0.1 — 20/10/2026:** por autorização explícita, a árvore original retorna somente ao painel público da Conta; Atlas01/02 usam a mesma imagem. A composição3.0.0 permanece a base; demais telas e modais preservados. Validação pontual:12 testes, tipos, três larguras e prévias de cadastro/login. [Registro](../_andamento/registros/registro-v3.0.1-2026-10-20-imp-conta-fun-restauracao-arvore.md) · [galeria](comparacoes/v3.0.1-2026-10-20-conta-arvore/index.html).

## Cobertura da reconstrução do Layout novo — 18/10/2026

**Reconstrução validada localmente — v3.0.0.** A composição viva das **73 fichas** usa a referência [Layout novo](../Telas/Layout%20novo/index.html). O inventário permanece em **39 recortes existentes e 34 planejadas**, com IDs históricos preservados. O shell visual não altera contratos, permissões ou conclusão dos módulos.

| Fichas | Representação atual | Limite funcional |
| --- | --- | --- |
| 01–05 e72 | Entrada/Conta com a nova identidade | Sessão, confirmação e recuperação preservam contratos existentes |
| 06–13;58–59 | Criação/entrada, Núcleos e convites com nova estrutura | Convites reais continuam sujeitos a papéis e validação; Atlas não grava |
| 14–17 | Agenda com nova estrutura | Grade semanal, painel, lista/formulários/respostas reais; mês/dia/recorrência/externos planejados |
| 18;22–33 | Acordos, participação, gestão e histórico com nova identidade | Kanban/Painéis/lista móvel organizam o modelo atual; não implementam evolução individual |
| 38 e40 | Esboços protegidos de Árvore e Memórias | /nucleos/[id]/arvore e /memorias; sem crescimento, fotos, feed ou persistência |
| 44 e49 | Esboços protegidos de Conexões e Perfis | /nucleos/[id]/conexoes e /perfis; sem métricas nem perfis afetivos persistidos |
| 55 e61 | Esboços protegidos de Manifesto e Cuidado | /nucleos/[id]/manifesto e /cuidado; sem assinaturas ou conversas persistidas |
| 66–71;73 | Preferências, ajuda, saída e administração com nova estrutura | Funções existentes preservadas; notificações68 permanecem planejadas |
| Demais fichas planejadas | Desenhos de planejamento com shell atual e aviso explícito | A presença do desenho não cria a rota nem conclui o módulo |

Árvore/Memórias, Conexões/Perfis e Manifesto/Cuidado são pares de esboços acessíveis pelo menu e pelos links do respectivo módulo. Os percursos detalhados preservam seus IDs, regras pendentes e ordem de planejamento. O modo histórico e as galerias anteriores estão preservados. A origem histórica reorganizada está em [Layout inicial](../Telas/Layout%20inicial/Nos_App.dc.html) e [PDFs](../Telas/Layout%20inicial/pdfs/source1.pdf).

**Modais:** identificação no gatilho/ficha, origem e título; links para rotas e seleção inline não recebem esse rótulo. [Inventário permanente](../_andamento/funcionalidades/modais-interface.md) · [galeria 3.0.0](comparacoes/v3.0.0-2026-10-18-layout-novo-integral/index.html). 170 capturas do aplicativo (85 capturas de modais, 27 rotas autenticadas, sete páginas públicas e larguras de 390/640/768/1024/1440 px), 176 do Atlas (86 telas/contextos e 90 capturas de modais), 40 da referência e 20 anteriores: 406 imagens e 20 comparações por área/dispositivo. Modais têm título, gatilho e origem no manifesto; a captura é recortada no diálogo.

## Cobertura histórica por marco

Os inventários e contratos abaixo devem ser lidos na data correspondente. A migração visual acima prevalece na apresentação; o contrato administrativo vigente prevalece sobre regras históricas de votação e de criador exclusivo.

**Fluxo completo aprovado, implementação pendente — v1.1.0 — 18/10/2026:** [Proposta → Hábito → Experiência → Essência](../_andamento/funcionalidades/fluxo-proposta-habito-experiencia-essencia.md) é a sequência obrigatória da evolução de cada pessoa na prática apoiada pelo Núcleo. O formulário atual ainda oferece categorias diretas e não está adequado a essa direção. Fichas de Proposta, Experiência e Essência e roteiro apontam o fluxo, sem inferir avanço coletivo, critérios, votação ou migração. Inventário e capturas históricas preservados; nenhuma nova certificação de fidelidade funcional.

**Entrega local vigente — v1.1.0 — 15/10/2026:** Tela73 inclui encerramento administrativo para todos, com nome/ciência e cancelamento sem gravação. Todos perdem acesso, convites são revogados, histórico e contas permanecem armazenados. Alternativa73 →12; saída individual71 preservada. Mesmas73 telas,39 recortes existentes e34 planejadas. Atlas/MVP/visão global sincronizados. [Galeria](comparacoes/v1.1.0-2026-10-15-encerramento/index.html). Nova função ainda sem publicação/migração remota.

**Composição vigente — v1.0.1 — 15/10/2026:** árvore decorativa apenas na entrada de Conta sem sessão e boas-vindas opcionais. Demais telas que usam a estrutura compartilhada ocupam uma coluna central de até 672px, sem painel lateral ou árvore acima no celular. Reintrodução depende de benefício confirmado para a experiência. Rotas, permissões, percursos e funcionalidades planejadas não mudaram. [Comparação local](comparacoes/v1.0.1-2026-10-15-arvore/index.html). Marcos abaixo preservam o histórico.

**Atualização de implementação — 2026-10-14 — v1.0.0 · funcional validado localmente:** o Atlas vivo representa o contrato aprovado de administração e participação individual. São **73 telas: 39 recortes existentes e 34 planejadas**. Nova Tela73 `/nucleos/[id]/pessoas`; IDs anteriores preservados. Gestão73 → saída71 → Seus Núcleos12 e configurações66 → privacidade67, conta69 ou ajuda70 são caminhos contextuais. Proposta18 → conferência22 → participação23 → detalhe24; administrador inicia teste e gerencia28; registro27/histórico25; alteração30/31 → versões33 → novo aceite23. Não há votação coletiva, unanimidade, quórum ou prazo de votação nos acordos vigentes. Preferência de autoria inicialmente desativada vale para saídas futuras; histórico permanece. Sintagma Software e sintagmasoftware@gmail.com são o responsável e canal manual. Conteúdo ilustrativo do Atlas não grava dados. Desenhos em modo Documento aprovado e galerias anteriores preservam história. Termos completos, retenção e operação do piloto continuam pendentes; item5 dependente do Google está adiado. [Contrato aprovado](../_andamento/funcionalidades/administracao-participacao.md).


**Marco histórico da aprovação — v0.16.0 — 14/10/2026:** [administração e participação](../_andamento/funcionalidades/administracao-participacao.md) substitui votação coletiva de acordos por gestão administrativa e escolha individual. Saída não cancela acordos nem abre votação; último administrador transfere papel por sorteio. Naquele marco documental, Atlas e código ainda representavam contratos anteriores. A implementação e sincronização corrente estão descritas acima.

**Marco histórico — v0.16.0 — 2026-10-13:** cinco recortes de orientação MVP05 implementados; etapa parcial. Configurações66 →67 OU69 OU70 →66; saída contextual13→71→13, sem remover vínculo.72 telas/16 percursos/38 recortes/34 planejadas. Saída/transferência/retenção/direitos/suporte/termos/operação reservados. [Contrato](../_andamento/funcionalidades/autonomia-protecao.md), [galeria](comparacoes/v0.16.0-2026-10-13-mvp-05-tela_66-tela_67-tela_69-tela_70-tela_71/index.html), [verificador](tools/verify-mvp-controls.mjs). Marcos anteriores são históricos.

**Marco histórico — v0.15.2 — 2026-10-13:** MVP04 validado localmente. Quatro telas/estados14 →16 →15 →17 opcional →14 da mesma rota; novo percurso de agenda acrescentado sem renumerar os anteriores.72 telas,15 percursos,33 recortes/39 planejadas. Confirmação/cancelamento/ciência no servidor, feedback e reservas futuras. Sem migração nova; commit/publicação/prova online pendentes. [Contrato](../_andamento/funcionalidades/agenda-interna.md), [galeria](comparacoes/v0.15.2-2026-10-13-mvp-04-tela_14-tela_16-tela_15-tela_17/index.html), [verificador](tools/verify-mvp-agenda.mjs). Marcos anteriores abaixo são históricos.
**Marco histórico — v0.15.1 — 2026-10-13:** MVP 03 local validado: doze telas/estados, ciclo central, histórico de revisões paginado e pendência visível. Ordem 18 → 22 → 23 → 24 → 27 → 25 → 28; legado 29 é alternativa; ajuste/encerramento passam por 30 → 31 OU 32 → 33 → detalhe preservado. 72 telas, 33 recortes e 39 planejadas mantidos. Reflexões/Impacto/Linguagens/progresso/evento/Essência/fotos sinalizados como futuros; sem migração nova ou prova online. [Contrato](../_andamento/funcionalidades/ciclo-habito.md), [galeria](comparacoes/v0.15.1-2026-10-13-mvp-03-tela_24-tela_28-tela_33/index.html), [verificador](tools/verify-mvp-habit.mjs). A conferência MVP 02 abaixo é histórica, com seus limites operacionais próprios.

**Marco histórico — v0.15.0 — 2026-10-13:** MVP 02 local concluído; Tela 59 gestão privada existente, rota nova e migração de revogação/concorrência. Sequência de criador/convidado sincronizada; 72 telas, 33 recortes existentes, 39 planejadas e 186 ações. QR/link/destinatários/administradores/histórico por aceite reservados. Publicação/migração online pendentes. [Contrato](../_andamento/funcionalidades/nucleo-compartilhado.md), [comparação](comparacoes/v0.15.0-2026-10-13-mvp-02-tela_09-tela_13-tela_58-tela_59/index.html), [verificador](tools/verify-mvp-nucleus.mjs).

**Operação online — v0.14.1 — 2026-10-13:** Netlify conectado ao nos-dev, origem e retornos online configurados, login/sessão/saída validados por HTTP com fixture confirmada removida após teste. Cadastro com confirmação externa continua pendente de SMTP; recuperação também exige segredo no Netlify. Desenhos/rotas e contagens preservados. [Registro operacional](../_andamento/registros/registro-v0.14.1-2026-10-13-03-imp-conexao-netlify-fun-acesso-online.md).

**Marco histórico — v0.14.1 — 2026-10-13:** etapa 01 validada localmente; mensagem de sessão indisponível da Tela 01 sincronizada. 72 telas, 32 recortes/40 planejadas preservados. Gmail ainda aguarda senha de aplicativo/recebimento externo. [Registro](../_andamento/registros/registro-v0.14.1-2026-10-13-imp-acesso-existente-fun-mvp-etapa-01.md), [comparação](comparacoes/v0.14.1-2026-10-13-acesso-indisponivel-tela_01/index.html). Os marcos abaixo permanecem históricos.

**MVP aprovado — 2026-10-12 — v0.14.0:** [guia prioritária](atlas/index.html#mvp) e [plano registrado](../_andamento/planos/mvp.md). Todas as 72 telas e 184 ações atuais das fichas estão relacionadas; 13 etapas, 37 telas/estados no primeiro marco. Situações preservadas: 32 recortes existentes/40 planejadas. Títulos, regras, limites e desenhos usam a mesma fonte viva, sem cópia visual. ID sem etapa/ausente/duplicado sinaliza cobertura a revisar. Aprovação não conclui funcionalidades. [Manutenção obrigatória](GUIA.md#mvp-aprovado--prioridade-e-manutenção-do-roteiro), [comparação documental](comparacoes/v0.14.0-2026-10-12-mvp-atlas-tela_01-a-tela_72/index.html) e [verificador](tools/verify-mvp-view.mjs).

Material de planejamento criado em 2026-10-03 e corrigido visualmente em 2026-10-04. Referência funcional: v0.14.0. Atualização do Percurso 05 em 2026-10-10.

Histórico do Percurso05 antes da administração: caminho **18 →22 →23 →24**, cujo aceite automático e consenso foram substituídos pelo contrato de 14/10. Sequência guiada 18 → 19 → 20 → 21 → 22 → 23 → 24 reservada, com 19–21 planejadas. Tela 22 é recorte existente de conferência, sem /novo. Inventário histórico desse marco: 72 telas, 14 percursos, 32 recortes e 40 planejadas. [Contrato](../_andamento/funcionalidades/proposta-habito.md), [comparação](comparacoes/v0.14.0-2026-10-10-proposta-habito-tela_18-tela_19-tela_20-tela_21-tela_22-tela_23-tela_24/index.html) e [verificador](tools/verify-habit-proposal-journey.mjs). As prévias 18/22/23 representam os estados implementados; as composições históricas continuam acessíveis como referência.

Histórico v0.13.3 — Percurso 04: chegada direta 01 → 10 → 11 → 13 → 12; entrada comum 01 → 12 → 10. Cadastro/confirmação/recuperação preservam o destino. Tipo, adiamento sem associação, edição e estados de convite indisponível sincronizados. QR/leitura e transporte por link reservados na Tela 10; QR de geração na Tela 58 e gestão na Tela 59 continuam planejados. Inventário preservado: 72 telas, 14 percursos, 31 recortes e 41 planejadas. [Contrato](../_andamento/funcionalidades/entrada-convite.md) e [comparação](comparacoes/v0.13.3-2026-10-10-entrar-convite-tela_10-tela_11/index.html).

Histórico v0.13.2 — Percurso 03 validado localmente: 01 (login) → 04 → callback validado → 05 → 01 (novo login) → 12, com destino interno específico preservado. Voltar para Conta abre login; parâmetros repetidos/misturados são rejeitados antes do Auth. Remetente Gmail escolhido; configuração e recebimento externo permanecem pendentes. Inventário preservado: 72 telas, 14 percursos, 31 recortes e 41 planejadas. [Comparação](comparacoes/v0.13.2-2026-10-09-recuperar-acesso-tela_04-tela_05/index.html).

## Situação verificada

v0.13.1: Telas 01/02 mantêm árvore/frases e largura ao alternar cadastro/login; link inferior duplicado removido. Classificações, destinos dos percursos e pendências funcionais preservados. [Comparação](comparacoes/v0.13.1-2026-10-07-conta-alinhamento-tela_01-tela_02/index.html).

**Visão global:** reutiliza os 72 desenhos e suas situações/pendências; o mapa não altera a classificação de implementação. Percursos e destinos vêm do inventário; ligações de contexto estão distinguidas de saídas previstas nas fichas. [Abrir mapa](atlas/index.html#visao-global) e seguir o [padrão de sincronização/comparações](GUIA.md#visão-global-sincronização-e-comparações--procedimento-permanente).

Conferência atualizada em 2026-10-13: as 72 fichas, situações e pendências coincidem com este inventário e com os rótulos visíveis nas miniaturas e na inspeção. Todos os 33 recortes existentes apontam para rotas presentes no código; isso não confirma as ampliações ilustradas. Os 39 desenhos planejados continuam identificados. **Antes de implementar qualquer tela, consultar seu aspecto no modo Atlas vivo com prioridade alta**, conforme o [procedimento obrigatório](GUIA.md#prioridade-alta-do-atlas-vivo--decisão-de-2026-10-05).

- 72 telas/estados; 8 áreas; 14 percursos.
- 39 telas planejadas e pendentes de implementação.
- 33 recortes existentes: o desenho pode incluir ampliações ainda pendentes, descritas individualmente.
- As 37 interfaces do catálogo v2.1 estão mapeadas. Continuação de página, aba e estado podem compartilhar rota; 72 desenhos não significam 72 rotas novas.

## Inventário completo

| Tela | Área | Nome | Situação | Origem v2.1 | Localização / rota | Pendência ou limite |
|---|---|---|---|---|---|---|
| 01 | Conta e entrada | [Conta](atlas/index.html#tela-01) | Recorte existente | 01, 12 | /conta · entrada / | Fluxo implementado; configuração SMTP, URLs autorizadas e limites remotos exigem validação no ambiente de publicação. |
| 02 | Conta e entrada | [Criar conta](atlas/index.html#tela-02) | Recorte existente | 12 | /conta · modo cadastro | v3.1.1: cadastro válido segue para confirmação; conta existente avisa no formulário com acesso/recuperação. Ação e fluxo público validados localmente; publicação desta correção pendente. |
| 03 | Conta e entrada | [Confirmar e-mail](atlas/index.html#tela-03) | Recorte existente | Complemento de segurança | /conta/confirmar-email · /auth/confirm | Cadastro, reenvio e confirmação implementados; entrega local comprovada. SMTP e limites da hospedagem ainda exigem conferência. |
| 04 | Conta e entrada | [Recuperar acesso](atlas/index.html#tela-04) | Recorte existente | Complemento de segurança | /conta/recuperar · /auth/recovery | Recuperação validada localmente; Gmail SMTP preparado, ativação aguarda senha de app após liberação do Google. Origem, segredo e URLs de publicação exigem conferência. |
| 05 | Conta e entrada | [Redefinir senha](atlas/index.html#tela-05) | Recorte existente | Complemento de segurança | /conta/nova-senha | Redefinição integrada; chave de assinatura somente no servidor. Link inválido, usado ou aberto sem verificador oferece reinício seguro. |
| 06 | Criar e entrar no Núcleo | [Escolher caminho](atlas/index.html#tela-06) | Recorte existente | 29 | /comecar | Tela protegida existente; Seus Núcleos é a entrada padrão após login. |
| 07 | Criar e entrar no Núcleo | [Tipo de Núcleo](atlas/index.html#tela-07) | Recorte existente | 30 | /comecar/tipo | Catálogo atual de nove tipos; manter identificador validado na URL. |
| 08 | Criar e entrar no Núcleo | [Propósito do Núcleo](atlas/index.html#tela-08) | Recorte existente | 31 | /comecar/proposito | Criação existente; sem persistência de rascunho no atlas. |
| 09 | Criar e entrar no Núcleo | [Convite inicial](atlas/index.html#tela-09) | Recorte existente | 32 | /comecar/convite-inicial/[id] | Código, cópia, expiração real em UTC e gestão existentes. QR/link reservados. Gestão requer migração no ambiente de uso. |
| 10 | Criar e entrar no Núcleo | [Inserir convite](atlas/index.html#tela-10) | Recorte existente | 18 · entrada complementar | /comecar/convite | Consulta existente com prévia restrita. QR/câmera e transporte de código por link permanecem planejados; código fica fora das URLs atuais. |
| 11 | Criar e entrar no Núcleo | [Aceitar convite](atlas/index.html#tela-11) | Recorte existente | 18 | /comecar/convite · prévia | Aceite, tipo e adiamento existentes. Gestão/revogação pela interface existe na Tela 59, validada localmente; publicação/migração no ambiente de uso pendentes. |
| 12 | Criar e entrar no Núcleo | [Seus Núcleos](atlas/index.html#tela-12) | Recorte existente | 13 | /nucleos | Listagem, seleção, paginação, vazio, carregamento e erro implementados; cartões do atlas são exemplos identificados. |
| 13 | Início e agenda | [Início do Núcleo](atlas/index.html#tela-13) | Recorte existente | 02 | /nucleos/[id] | Home protegida com acesso à gestão do criador; resumo afetivo completo depende de módulos futuros. |
| 14 | Início e agenda | [Agenda do Núcleo](atlas/index.html#tela-14) | Recorte existente | 03 | /nucleos/[id]/agenda | Lista cronológica/paginada real; mês/dia, recorrência, memória e integrações reservados. |
| 15 | Início e agenda | [Detalhe do evento](atlas/index.html#tela-15) | Recorte existente | Complemento da 03 | /nucleos/[id]/agenda · item existente | Evento/respostas no hub; presença individual, agregação e processamento. Ainda não sei e rota própria planejadas. |
| 16 | Início e agenda | [Novo evento](atlas/index.html#tela-16) | Recorte existente | Complemento da 03 | /nucleos/[id]/agenda · formulário | Título/intenção opcional/início/término/fuso; cria aceite do autor e pendência dos atuais. Local/seleção/vínculos planejados. |
| 17 | Início e agenda | [Editar evento](atlas/index.html#tela-17) | Recorte existente | Complemento da 03 | /nucleos/[id]/agenda · edição | Edição explica conservação/remarcação. Remoção contextual confirmada, manter sem gravação e ciência no servidor; notificações/histórico planejados. |
| 18 | Acordos e consentimento | [Acordos](atlas/index.html#tela-18) | Recorte existente | 04 | /nucleos/[id]/acordos | Formulário, conferência, filtros e respostas reais no hub. Necessidade, compreensão, seleção de participantes e Essência ainda planejadas. |
| 19 | Acordos e consentimento | [Novo acordo · necessidade](atlas/index.html#tela-19) | Planejada | 08 | Proposta: /nucleos/[id]/acordos/novo · etapa 1 | Hub cria propostas; fluxo guiado completo ainda não existe. |
| 20 | Acordos e consentimento | [Novo acordo · proposta](atlas/index.html#tela-20) | Planejada | Fluxo v2.2 · etapa complementar | Proposta: /nucleos/[id]/acordos/novo · etapa 2 | Dados essenciais e prazo já existem no formulário atual; novo fluxo e seleção explícita pendentes. |
| 21 | Acordos e consentimento | [Novo acordo · compreensão](atlas/index.html#tela-21) | Planejada | Fluxo v1.10 / v2.2 | Proposta: /nucleos/[id]/acordos/novo · etapa 3 | Compreensão estruturada e fluxo assíncrono pendentes. |
| 22 | Acordos e consentimento | [Novo acordo · conferir](atlas/index.html#tela-22) | Recorte existente | Fluxo v2.2 · etapa complementar | /nucleos/[id]/acordos · conferência do formulário | Conferência implementada dentro do hub. Rota /novo e integração guiada com necessidade/compreensão permanecem planejadas. |
| 23 | Acordos e consentimento | [Aprovações](atlas/index.html#tela-23) | Recorte existente | 36 | /nucleos/[id]/acordos · respostas / hub futuro | Respostas individuais no hub, sem central unificada, abas Enviados/Aguardando você, votos alheios ou notificações implementadas. |
| 24 | Acordos e consentimento | [Detalhe do Hábito](atlas/index.html#tela-24) | Recorte existente | 05, 06 | /nucleos/[id]/acordos/[agreementId] | Detalhe, registro, confirmação e revisão existem; reflexões/impacto/evento associado pendentes. |
| 25 | Acordos e consentimento | [Histórico do Hábito](atlas/index.html#tela-25) | Recorte existente | 05 · aba histórico | /nucleos/[id]/acordos/[agreementId] · histórico | Histórico real existente, com cursor; foto e memória geral ainda pendentes. |
| 26 | Acordos e consentimento | [Reflexões do Hábito](atlas/index.html#tela-26) | Planejada | 05 · aba reflexões | Proposta: detalhe do Hábito · reflexões | Persistência e privacidade das reflexões pendentes. |
| 27 | Acordos e consentimento | [Registrar momento](atlas/index.html#tela-27) | Recorte existente | 16 | /nucleos/[id]/acordos/[agreementId]/registrar | Humor e nota existentes; foto, registro de experiência e memória geral são futuros. |
| 28 | Acordos e consentimento | [Confirmar após teste](atlas/index.html#tela-28) | Recorte existente | Complemento v0.11.0 | /nucleos/[id]/acordos/[agreementId]/confirmar | Implementado na v0.11.0. Este cenário é ilustrativo e não executa votação. |
| 29 | Acordos e consentimento | [Definir teste do legado](atlas/index.html#tela-29) | Recorte existente | Complemento v0.11.0 | /nucleos/[id]/acordos/[agreementId]/confirmar · legado | Fluxo legado implementado; atlas reúne as etapas sem simular aprovação real. |
| 30 | Acordos e consentimento | [Revisar Hábito](atlas/index.html#tela-30) | Recorte existente | 22 | /nucleos/[id]/acordos/[agreementId]/revisar | Ajuste/encerramento existentes; conversa e Essência são futuras. |
| 31 | Acordos e consentimento | [Propor ajuste](atlas/index.html#tela-31) | Recorte existente | 22 · ajuste | /nucleos/[id]/acordos/[agreementId]/revisar · formulário | Contrato de revisão existente. |
| 32 | Acordos e consentimento | [Propor encerramento](atlas/index.html#tela-32) | Recorte existente | 22 · encerramento | /nucleos/[id]/acordos/[agreementId]/revisar · encerramento | Encerramento existente; campo de contexto exige conferência do contrato atual. |
| 33 | Acordos e consentimento | [Acompanhar revisão](atlas/index.html#tela-33) | Recorte existente | 22 · acompanhamento | /nucleos/[id]/acordos/[agreementId]/revisar · pendência | RPC agregada e aplicação explícita existentes. |
| 34 | Acordos e consentimento | [Detalhe de experiência](atlas/index.html#tela-34) | Planejada | 21 | Proposta: /nucleos/[id]/experiencias/[id] | Modelo de ocorrência, agenda e memória de experiência pendentes. |
| 35 | Acordos e consentimento | [Registrar experiência](atlas/index.html#tela-35) | Planejada | 16, 21 · extensão | Proposta: experiência/[id]/registrar | Registro de experiência e armazenamento de mídia não implementados. |
| 36 | Acordos e consentimento | [Nossa Essência](atlas/index.html#tela-36) | Recorte existente | 04 · aba Essência | /nucleos/[id]/acordos · Essência | Aba vazia existente; promoção e persistência de Essência pendentes. |
| 37 | Acordos e consentimento | [Promover para Essência](atlas/index.html#tela-37) | Planejada | 23 | Proposta: acordos/[id]/essencia | Essência, elegibilidade e consenso específicos pendentes. |
| 38 | Árvore e memórias | [Nossa Árvore](atlas/index.html#tela-38) | Planejada | 07 | Proposta: /nucleos/[id]/arvore | Próxima implementação prevista; contratos de crescimento ainda abertos. |
| 39 | Árvore e memórias | [Marcos e celebrações](atlas/index.html#tela-39) | Planejada | 07, 09 · v1.6 | Proposta: /nucleos/[id]/marcos | Regras de marcos, eventos e notificações pendentes. |
| 40 | Árvore e memórias | [Memórias](atlas/index.html#tela-40) | Planejada | 09 | Proposta: /nucleos/[id]/memorias | Feed unificado, fotos, gratidão e marcos pendentes. |
| 41 | Árvore e memórias | [Detalhe da memória](atlas/index.html#tela-41) | Planejada | 09 · detalhe complementar | Proposta: /nucleos/[id]/memorias/[id] | Entidade de memória e ações por autoria pendentes. |
| 42 | Árvore e memórias | [Galeria de fotos](atlas/index.html#tela-42) | Planejada | 09 · galeria complementar | Proposta: /nucleos/[id]/memorias/fotos | Armazenamento privado de mídia pendente. |
| 43 | Árvore e memórias | [Demonstrar gratidão](atlas/index.html#tela-43) | Planejada | 17 | Proposta: /nucleos/[id]/gratidao | Persistência, visibilidade e notificações de gratidão pendentes. |
| 44 | Conexões e perfis | [Conexões](atlas/index.html#tela-44) | Planejada | 35 | Proposta: /nucleos/[id]/conexoes | Modelo de vínculo, métricas e permissões pendentes. |
| 45 | Conexões e perfis | [Perfil de membro](atlas/index.html#tela-45) | Planejada | 19 | Proposta: /nucleos/[id]/membros/[id] | Perfil afetivo e leitura por contexto pendentes. |
| 46 | Conexões e perfis | [Gostos do membro](atlas/index.html#tela-46) | Planejada | 20 | Proposta: perfil do membro · continuação | Campos afetivos e regras por campo pendentes. |
| 47 | Conexões e perfis | [Tipos de vínculo](atlas/index.html#tela-47) | Planejada | 33 | Proposta: /nucleos/[id]/vinculos/novo | Modelo de vínculo e distinção do Núcleo pendentes. |
| 48 | Conexões e perfis | [Nossa jornada](atlas/index.html#tela-48) | Planejada | 34 | Proposta: /nucleos/[id]/vinculos/[id]/jornada | Modelo de fase e mudança consensual pendentes. |
| 49 | Conexões e perfis | [Meu perfil](atlas/index.html#tela-49) | Planejada | 10 | Proposta: /perfil | Perfil geral e afetivo pendentes; conta autenticada já existe. |
| 50 | Conexões e perfis | [Perfil · maturidade e opções](atlas/index.html#tela-50) | Planejada | 11 | Proposta: /perfil · continuação | Maturidade e perfil pendentes; logout existente em Conta. |
| 51 | Conexões e perfis | [Sobre mim](atlas/index.html#tela-51) | Planejada | 27 | Proposta: /perfil/sobre-mim | Modelo de perfil afetivo pendente. |
| 52 | Conexões e perfis | [Gostos, cuidado e datas](atlas/index.html#tela-52) | Planejada | 28 | Proposta: /perfil/sobre-mim · continuação | Persistência por campo e compartilhamento de datas pendentes. |
| 53 | Conexões e perfis | [Editar perfil afetivo](atlas/index.html#tela-53) | Planejada | 27, 28 · edição | Proposta: /perfil/editar | Esquema e regras de privacidade pendentes. |
| 54 | Conexões e perfis | [Lista de desejos](atlas/index.html#tela-54) | Planejada | 19, 27 · complemento | Proposta: /perfil/desejos | Desejos e visibilidade pendentes. |
| 55 | Manifesto e cuidado | [Nosso manifesto](atlas/index.html#tela-55) | Planejada | 25 | Proposta: /nucleos/[id]/manifesto | Geração, revisão, assinaturas e versões pendentes. |
| 56 | Manifesto e cuidado | [Revisar manifesto](atlas/index.html#tela-56) | Planejada | 25 · revisão complementar | Proposta: /nucleos/[id]/manifesto/revisar | Modelo de versões e confirmação pendentes. |
| 57 | Manifesto e cuidado | [Compartilhar manifesto](atlas/index.html#tela-57) | Planejada | 25 · compartilhar | Proposta: manifesto · confirmação de exportação | Exportação, permissão coletiva e revogação pendentes. |
| 58 | Criar e entrar no Núcleo | [Convidar para o Núcleo](atlas/index.html#tela-58) | Recorte existente | 14, 32 | /comecar/convite-inicial/[id] | Código, cópia, compartilhamento e gestão existentes. QR/link, destinatários individuais e histórico de aceites reservados. |
| 59 | Criar e entrar no Núcleo | [Gerenciar convites](atlas/index.html#tela-59) | Recorte existente | 14 · gestão complementar | /nucleos/[id]/convites | Gestão implementada e validada localmente; publicar/aplicar migração no ambiente de uso. Histórico de quem aceitou permanece reservado. |
| 60 | Manifesto e cuidado | [Notificações](atlas/index.html#tela-60) | Planejada | 15 | Proposta: /notificacoes | Eventos, fila, preferências e canais pendentes. |
| 61 | Manifesto e cuidado | [Conversa de cuidado](atlas/index.html#tela-61) | Planejada | 24 | Proposta: /nucleos/[id]/cuidado/novo | Conversa guiada, privacidade e consentimento pendentes. |
| 62 | Manifesto e cuidado | [Ponte do Nós](atlas/index.html#tela-62) | Planejada | 37 | Proposta: /nucleos/[id]/cuidado/[id] | Sistema de preparação e eventual IA pendentes. |
| 63 | Manifesto e cuidado | [Cartão de Intenção](atlas/index.html#tela-63) | Planejada | 24, 37 · complemento v1.10 | Proposta: cuidado/[id]/intencao | Mensagem única e estados de resposta pendentes. |
| 64 | Manifesto e cuidado | [Marcar conversa ao vivo](atlas/index.html#tela-64) | Planejada | 24, 37 · complemento | Proposta: cuidado/[id]/encontro | Evento restrito e integração conversa/agenda pendentes. |
| 65 | Manifesto e cuidado | [Depois da conversa](atlas/index.html#tela-65) | Planejada | 37 · desfecho | Proposta: cuidado/[id]/desfecho | Estados de conclusão e arquivamento pendentes. |
| 66 | Preferências e segurança | [Configurações](atlas/index.html#tela-66) | Recorte existente | 26 | /configuracoes | Orientação disponível; controles futuros permanecem reservados. |
| 67 | Preferências e segurança | [Privacidade e visibilidade](atlas/index.html#tela-67) | Recorte existente | 11, 26 · v2.5 | /configuracoes/privacidade | Orientação disponível; controles futuros permanecem reservados. |
| 68 | Preferências e segurança | [Preferências de notificações](atlas/index.html#tela-68) | Planejada | 26 · v2.7 | Proposta: /configuracoes/notificacoes | Notificações e canais pendentes. |
| 69 | Preferências e segurança | [Conta e segurança](atlas/index.html#tela-69) | Recorte existente | 26 · v2.8 | /configuracoes/conta | Orientação disponível; controles futuros permanecem reservados. |
| 70 | Preferências e segurança | [Ajuda e suporte](atlas/index.html#tela-70) | Recorte existente | 26 · complemento | /ajuda | Orientação disponível; controles futuros permanecem reservados. |
| 71 | Preferências e segurança | [Sair de um Núcleo](atlas/index.html#tela-71) | Recorte existente | Complemento de privacidade | /nucleos/[id]/sair | Orientação disponível; controles futuros permanecem reservados. |
| 72 | Conta e entrada | [Entrada afetiva · opcional](atlas/index.html#tela-72) | Recorte existente | 01 | /boas-vindas | Apresentação opcional implementada. Cadastro/login diretos, sem login social nem aceite jurídico fictício. |

## Mapeamento das interfaces de origem

| Interface do catálogo | Telas do novo atlas |
|---|---|
| 01 | 01 — Conta; 72 — Entrada afetiva · opcional |
| 02 | 13 — Início do Núcleo |
| 03 | 14 — Agenda do Núcleo; 15 — Detalhe do evento; 16 — Novo evento; 17 — Editar evento |
| 04 | 18 — Acordos; 36 — Nossa Essência |
| 05 | 24 — Detalhe do Hábito; 25 — Histórico do Hábito; 26 — Reflexões do Hábito |
| 06 | 24 — Detalhe do Hábito |
| 07 | 38 — Nossa Árvore; 39 — Marcos e celebrações |
| 08 | 19 — Novo acordo · necessidade |
| 09 | 39 — Marcos e celebrações; 40 — Memórias; 41 — Detalhe da memória; 42 — Galeria de fotos |
| 10 | 21 — Novo acordo · compreensão; 49 — Meu perfil; 63 — Cartão de Intenção |
| 11 | 28 — Confirmar após teste; 29 — Definir teste do legado; 50 — Perfil · maturidade e opções; 67 — Privacidade e visibilidade |
| 12 | 01 — Conta; 02 — Criar conta |
| 13 | 12 — Seus Núcleos |
| 14 | 58 — Convidar para o Núcleo; 59 — Gerenciar convites |
| 15 | 60 — Notificações |
| 16 | 27 — Registrar momento; 35 — Registrar experiência |
| 17 | 43 — Demonstrar gratidão |
| 18 | 10 — Inserir convite; 11 — Aceitar convite |
| 19 | 45 — Perfil de membro; 54 — Lista de desejos |
| 20 | 46 — Gostos do membro |
| 21 | 34 — Detalhe de experiência; 35 — Registrar experiência |
| 22 | 30 — Revisar Hábito; 31 — Propor ajuste; 32 — Propor encerramento; 33 — Acompanhar revisão |
| 23 | 37 — Promover para Essência |
| 24 | 61 — Conversa de cuidado; 63 — Cartão de Intenção; 64 — Marcar conversa ao vivo |
| 25 | 55 — Nosso manifesto; 56 — Revisar manifesto; 57 — Compartilhar manifesto |
| 26 | 66 — Configurações; 67 — Privacidade e visibilidade; 68 — Preferências de notificações; 69 — Conta e segurança; 70 — Ajuda e suporte |
| 27 | 51 — Sobre mim; 53 — Editar perfil afetivo; 54 — Lista de desejos |
| 28 | 52 — Gostos, cuidado e datas; 53 — Editar perfil afetivo |
| 29 | 06 — Escolher caminho |
| 30 | 07 — Tipo de Núcleo |
| 31 | 08 — Propósito do Núcleo |
| 32 | 09 — Convite inicial; 58 — Convidar para o Núcleo |
| 33 | 47 — Tipos de vínculo |
| 34 | 48 — Nossa jornada |
| 35 | 44 — Conexões |
| 36 | 23 — Aprovações |
| 37 | 62 — Ponte do Nós; 63 — Cartão de Intenção; 64 — Marcar conversa ao vivo; 65 — Depois da conversa |

## Fidelidade às fontes aprovadas

28 telas do documento importadas em 52 composições e variações; 41 pontos de acesso ao desenho histórico. As telas implementadas de entrada têm layout próprio. Paleta, textos e ícones das três rotas de onboarding comparados ao app com sessão validada; extensões e limites de web sinalizados. Consultar [origens e manutenção](FIDELIDADE.md).

## Verificação histórica do artefato — v0.12.0

Inventário sem IDs duplicados ou destinos ausentes; 37 origens cobertas; 72 prévias, 178 saídas do contrato e 360 estados visuais verificados com Playwright; 52 composições aprovadas também renderizadas. Busca, filtros, teclado, 13 percursos, modo web, impressão CSS e ausência de transbordamento horizontal a 375 px conferidos. Nenhum erro JavaScript detectado. A impressão foi verificada por CSS, sem exportação ou inspeção de PDF.

Esta validação comprova o funcionamento do atlas. Não valida novamente funcionalidades do aplicativo, integrações Supabase nem regras futuras ainda sem implementação.


## Navegação e sessão — v0.13.0

Conta → Seus Núcleos → Início escolhido. Sem associação, criar ou conferir convite; destino específico tem prioridade após login. Todo /comecar e /nucleos exige sessão validada antes de renderizar; token expirado com renovação válida mantém a sessão. Tela 12 tem listagem real protegida por RLS; nenhuma alteração em permissões do banco. Validação atual: 72 prévias, 180 saídas, 360 estados, 14 percursos e Visão global sincronizada; 132 testes do aplicativo, tipos/build e revisão independente aprovados. Métricas da seção histórica acima pertencem à entrega anterior.

## Atualização — v3.1.0 — 23/10/2026

Tela69/Conta e segurança: exclusão da própria conta implementada e validada localmente, opção vermelha, confirmação exata APAGAR CONTA e modal identificado no inventário. Tela01 recebe o resultado; Telas24/28/33 preservam momentos com autoria Conta excluída; Agenda14/15 separa resposta histórica de presença atual. Configurações66, Privacidade67 e Ajuda70 orientam o novo fluxo. Histórico compartilhado mantido, sucessão/encerramento existentes reutilizados. Nova migração apenas no Docker local; produção pendente. [Contrato](../_andamento/funcionalidades/exclusao-conta.md) · [galeria](comparacoes/v3.1.0-2026-10-23-exclusao-conta/index.html).

**Produção v3.1.0 — 23/10/2026:** migração e código8afecb2 publicados, deploy6adae350fa2928885a0de2c8. Exclusão da conta validada online em desktop/celular; quatro contas descartáveis removidas e dados anteriores preservados em15 tabelas. O status remoto pendente do bloco anterior foi concluído.
