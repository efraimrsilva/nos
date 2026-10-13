# Wireframe completo do Projeto Nós

**Natureza:** material de planejamento e revisão de produto, criado em 2026-10-03. **Referência do aplicativo:** v0.14.0.

Percurso 05: caminho disponível **18 → 22 → 23 → 24**, com conferência e respostas dentro do hub. Conferir/editar não gravam; enviar registra aceite do autor; último aceite inicia teste, recusa encerra. Sequência guiada 18 → 19 → 20 → 21 → 22 → 23 → 24 reservada, com 19–21 planejadas. Tela 22 é recorte existente de conferência, sem /novo. Inventário vigente: 72 telas, 14 percursos, 32 recortes e 40 planejadas. [Contrato](../_andamento/funcionalidades/proposta-habito.md), [comparação](comparacoes/v0.14.0-2026-10-10-proposta-habito-tela_18-tela_19-tela_20-tela_21-tela_22-tela_23-tela_24/index.html) e [verificador](tools/verify-habit-proposal-journey.mjs). As prévias 18/22/23 representam os estados implementados; as composições históricas continuam acessíveis como referência.

Percurso 04 atualizado em 2026-10-10: chegada direta e entrada pela lista são alternativas; prévia e adiamento não criam associação. Conferir [contrato e reservas](../_andamento/funcionalidades/entrada-convite.md) e [comparação](comparacoes/v0.13.3-2026-10-10-entrar-convite-tela_10-tela_11/index.html). As Telas 10/11 representam estados da mesma rota; QR, link e gestão continuam planejados.

Percurso 03 atualizado em 2026-10-09: Conta (login) → Recuperar acesso → link validado pela rota técnica /auth/recovery → Redefinir senha → Conta (nova senha) → Seus Núcleos. Retorno interno específico preservado; link inválido/vencido permite reinício pela solicitação de outro link. As duas passagens por Conta têm indicação explícita nos Percursos e na Visão global. Recuperação validada localmente; Gmail SMTP e recebimento externo ainda pendentes. [Comparação](comparacoes/v0.13.2-2026-10-09-recuperar-acesso-tela_04-tela_05/index.html) e [configuração Gmail](../_andamento/funcionalidades/recuperacao-smtp-gmail.md).

Abra [o atlas navegável](atlas/index.html). Ele funciona localmente, sem servidor, conta, rede ou conexão com Supabase. Para transportar o material, mantenha a pasta `atlas/` completa: página, estilos, scripts e recursos locais.

## Fidelidade às telas aprovadas — correção de 2026-10-04

O modelo inicial simplificava a interface em cartões genéricos e não preservava a hierarquia aprovada. A correção incorpora as **28 telas do documento Nos_App.dc.html**, com **52 composições e variações** de abas/vínculos, e reproduz as telas implementadas de Conta e onboarding. /comecar, /comecar/tipo e /comecar/convite foram comparadas ao aplicativo em execução, incluindo títulos, paleta e SVG dos nove tipos.

As cores de identidade são exatamente #F6F3EB (canvas), #2E4A20 (floresta), #4F7E2C (folha), #69725E (texto secundário), #E6E3D8 (contorno) e #6A3FD1 (lilás). As cores contextuais e os ícones do documento também foram preservados. Fredoka e Plus Jakarta Sans usam pesos locais correspondentes; não há carregamento remoto.

**Atlas vivo** mostra o layout vigente das telas de entrada e adapta as regras históricas ao contrato atual. **Ver desenho aprovado do documento** recupera a composição original, identificando exemplos e regras antigas. Essa separação preserva a direção visual sem transformar níveis, métricas, assinatura ou promoção ilustrativos em resultados reais. A procedência e os limites de cada composição estão em [Fidelidade e manutenção](FIDELIDADE.md).

## Manutenção contínua — decisão de 2026-10-03

### Prioridade alta do atlas vivo — decisão de 2026-10-05

**Consultar obrigatoriamente o atlas vivo antes de criar, implementar, alterar ou revisar qualquer tela. O modo Atlas vivo é a referência visual de prioridade alta do projeto.** Conferir o aspecto da tela: hierarquia, disposição, paleta, tipografia, ícones, abas, navegação, linguagem de cuidado e estados. A consulta apenas à ficha textual não substitui a inspeção do desenho.

1. **Antes de implementar:** localizar o ID e o percurso no atlas, abrir o modo Atlas vivo e ler situação, rota, permissões, contrato e pendências. Registrar no plano/registro a tela usada como referência e as decisões ainda abertas.
2. **Durante a implementação:** seguir a composição viva e sua identidade, reutilizando padrões aprovados. O desenho anterior serve à comparação e à origem das decisões; não substituir o atlas vivo por ele ou por uma nova composição sem registrar a mudança de direção.
3. **Ao resolver divergências:** confrontar atlas, comportamento real e regras vigentes. Prioridade visual não autoriza dados simulados, permissões indevidas ou regras históricas; corrigir e documentar a divergência no mesmo recorte. Mudança visual necessária deve ter motivo explícito e atualizar o atlas junto à implementação.
4. **Antes de concluir:** comparar a interface real com o desenho vivo, em celular e web quando definidos, incluindo abas, destinos, acessibilidade e estados. Se a composição web ou um contrato estiver pendente, registrar e resolver no recorte; não apresentá-lo como aprovado ou implementado.
5. **Na entrega:** sincronizar desenho, ficha, percursos, cobertura, limitações e registro. Marcar somente o recorte efetivamente implementado e validado. O atlas continua sendo a referência prioritária para o desenvolvimento atual e futuro.

**Interpretação dos sinais:** Planejada exige implementação/contrato; Recorte existente confirma uma base funcional com limites. Origem visual aprovada não significa funcionalidade concluída. O modo histórico é uma referência comparativa. As pendências da ficha e de COBERTURA.md precisam ser lidas antes de ativar ações reais.

Este wireframe é uma **referência viva**: deve acompanhar todo o desenvolvimento atual e futuro. Consultá-lo no início de cada recorte e atualizar os desenhos, fichas, percursos, permissões e pendências afetados junto da implementação e sua documentação. Ao concluir, verificar a correspondência com o comportamento real; manter separados os recortes existentes e os elementos ainda planejados.

Manter os IDs estáveis, registrar telas acrescentadas ou consolidadas e sincronizar o inventário de cobertura. Mudanças na versão funcional devem atualizar a referência do atlas; uma edição documental isolada não incrementa a versão do aplicativo. Conferir links, destinos e estados atingidos pela alteração, além da apresentação visual quando aplicável.

O protótipo e suas extrações estão agora em **Documentacao_Projeto_Nos/Telas/**, após movimentação feita pelo usuário. Esses materiais preservam a origem histórica; o atlas acompanha a evolução vigente. Regras implementadas e decisões explícitas prevalecem sobre exemplos antigos.

## Resultado esperado e escopo

Orientar o desenvolvimento de todo o produto documentado, começando em **01 — Conta**, com estrutura visual consistente, percursos, permissões, estados e pendências explícitos. O atlas tem 72 telas/estados, oito áreas e 14 percursos. As 37 interfaces do catálogo v2.1 estão cobertas; as 28 imagens antigas são parte desse catálogo, não seu limite.

As telas adicionais explicitam passos que o catálogo menciona sem uma composição própria: recuperação de acesso, confirmação pós-teste, acompanhamento de revisão, edição, privacidade, gestão e desfecho de conversas. Elas não significam 72 novas rotas, nem autorização para implementar todos os módulos simultaneamente. Continuações, abas e formulários podem compartilhar a mesma página.

## Como usar

1. **Atlas:** compare as telas lado a lado. Selecione uma área, busque um nome ou filtre por situação. Clique em uma tela para abrir sua ficha.
2. **Tela a tela:** consulte o desenho ampliado, o contrato, as pessoas autorizadas, a rota existente ou proposta, a origem no catálogo e as pendências. Abas de Acordos, detalhe do Hábito, Memórias e tipos de vínculo mudam a composição. Os campos são locais; a escolha do tipo é preservada ao voltar, como no app.
3. **Celular / Web:** o onboarding reproduz a árvore acima no celular e ao lado no web. O documento aprova composições móveis: o atlas não inventa uma aprovação de layout web para os demais módulos; essa adaptação permanece sinalizada.
4. **Estados:** compare conteúdo, vazio, carregamento, erro, falta de permissão e sucesso. São padrões para revisão; mensagens definitivas devem respeitar a operação da tela. Sucesso visual do atlas nunca representa gravação real.
5. **Percursos:** siga as etapas dos 12 fluxos e consulte suas regras de transição. A numeração identifica telas; não implica que todas sejam um único caminho linear.
6. **Imprimir atlas:** imprime todas as áreas, removendo filtros. A ficha detalhada e as regras continuam disponíveis no material digital. Não foi exportado PDF nesta tarefa.

O [inventário de cobertura e pendências](COBERTURA.md) relaciona cada tela à interface antiga e descreve sua situação. As fichas em `atlas/screens.js` contêm contratos, saídas e blocos das extensões. `product-ui.js` representa a entrada implementada e adapta layouts aprovados; `approved-layouts.js` é gerado a partir do documento. Alterações futuras devem atualizar o desenho, sua origem e o inventário juntos.

## Ordem e composição

| Área                     | Intenção                                      | Principais telas                        |
| ------------------------ | --------------------------------------------- | --------------------------------------- |
| Conta e entrada          | Acesso seguro antes do contexto privado       | 01–05; 72 como entrada afetiva opcional |
| Criar e entrar no Núcleo | Escolha, propósito, convite e associação      | 06–12; 58–59                            |
| Início e agenda          | Contexto atual e tempo compartilhado          | 13–17                                   |
| Acordos e consentimento  | Necessidade, proposta, prática e revisão      | 18–37                                   |
| Árvore e memórias        | Evolução coletiva e registros afetivos        | 38–43                                   |
| Conexões e perfis        | Conhecer e cuidar com visibilidade escolhida  | 44–54                                   |
| Manifesto e cuidado      | Identidade coletiva e preparação de encontros | 55–57; 60–65                            |
| Preferências e segurança | Controle pessoal e consequências claras       | 66–71                                   |

**Conta primeiro** é a entrada sem sessão desde v0.12.0. Na v0.13.0, pessoa autenticada abre Seus Núcleos; um retorno privado específico tem prioridade. /boas-vindas é apresentação opcional, sem atraso; convites preservam retorno interno durante a autenticação.

A antiga entrada afetiva está preservada como composição opcional na Tela 72, fora do percurso obrigatório. As antigas Telas 05/06 são integradas ao detalhe 24. Continuações de perfil e outras áreas mantêm referências explícitas no inventário.

## Situação e pendências

**Planejada** significa que a tela ainda requer implementação ou contrato próprio. **Recorte existente** significa que a base funcional existe, mas a composição afetiva aprovada pode conter extensões futuras. A ficha declara esses limites. Os rótulos de procedência distinguem layout implementado, base do documento e extensão; a presença de um recorte funcional não confirma todos os elementos do desenho.

Há 40 telas planejadas e 32 recortes existentes. Os principais conjuntos pendentes são:

- **Conta:** telas 01–05 e 72 implementadas e comparadas. SMTP, remetente, domínio e limites do ambiente de lançamento ainda precisam de conferência; funcionalidades de login social e gestão de dados são módulos próprios.
- **Núcleos:** listagem multínucleo e seleção implementadas na Tela 12; permanecem gestão de convites, QR (código de resposta rápida), compartilhamento ampliado e saída com tratamento das dependências. Administrador é papel documental futuro; o recorte atual usa criador e membro.
- **Home e agenda:** resumo afetivo completo, composição mensal, vínculo com experiências e eventos restritos de cuidado. O banco atual permite autor ou criador editar/remover evento; a ficha respeita isso.
- **Acordos:** fluxo guiado de necessidade/proposta/compreensão/conferência, reflexões, detalhe e registro de experiência, fotos, Essência e promoção. O hub já possui criação e respostas; não confundir esse recorte com o fluxo guiado completo.
- **Árvore:** fechar contagens, fontes e critérios de crescimento antes de mostrar nível, experiência, estágio ou marcos. A base real da v0.11.0 não determina esses indicadores automaticamente.
- **Memórias e gratidão:** feed unificado, visibilidade, autoria, retenção, mídia privada e eventos. Histórico de momentos de Hábito existente não é um módulo completo de Memórias.
- **Conexões e perfis:** vínculos, leitura autorizada, preferências por campo, desejos, datas e jornada opcional. Métricas de força/intimidade precisam de contrato e não são desenhadas como pontuação real.
- **Manifesto:** geração, versões, revisão, aceites e autorização separada para compartilhamento externo.
- **Cuidado:** rascunho privado, Ponte do Nós, cartão único, encontro restrito e desfecho. A agenda atual visível ao Núcleo não pode receber conteúdo de conversa restrita sem novo contrato.
- **Preferências:** notificações/canais, editor de privacidade, administração de conta, dados e suporte operacional.

Seleção de participantes, visibilidade por campo, motivo de encerramento e canais de aviso exibidos em telas futuras são **propostas para decisão**, não contratos já implementados. Cada pendência deve ser resolvida no recorte correspondente antes de ativar ações reais.

## Regras preservadas

1. O Núcleo define contexto de acesso e isolamento. Conhecer um endereço ou receber código não concede associação.
2. Proposta não equivale a acordo ativo. Na implementação vigente, aceite unânime inicia teste; recusa encerra proposta.
3. Novos Hábitos têm duração consentida de 7 a 30 dias inteiros. O último aceite inicia o prazo real. Legado sem duração exige novo período aprovado, sem retroatividade.
4. Após o prazo, confirmação usa o conjunto original fixo: até 150 pessoas, `floor(N/2)+1`; acima de 150, `ceil(N/3)`. Exemplos: 76/150 e 51/151. Entrada posterior não adiciona voto; saída de participante original bloqueia sem reduzir N. Revisão pendente bloqueia confirmação.
5. Ajuste/encerramento mantêm unanimidade, sete dias de reflexão e aplicação explícita. Esses sete dias não são a duração do teste. Ajuste reinicia teste e confirmações quando há duração; legado sem prazo exige novo período consentido. Histórico permanece.
6. Notas de momentos do Hábito são visíveis ao Núcleo no contrato atual. Opções futuras de privacidade não alteram essa regra implicitamente. Apenas participante que aceitou registra em `testing` ou `active`; encerrado mantém consulta sem novos registros.
7. Essência, crescimento da árvore e assinaturas do manifesto não são consequências automáticas de Hábito ativo.
8. Conversas não são chat livre. Rascunho privado, cartão único e encontro consentido têm permissões distintas. Recusar ou adiar não gera penalidade.
9. Perfil alheio é consulta autorizada. Só a pessoa edita seus gostos e desejos. Criador não ganha acesso a preparação privada por seu papel.
10. Compartilhar externamente não deriva da permissão de ler. Conta, saída de Núcleo e exclusão de dados são ações diferentes.

## Direção visual e acessibilidade

O material utiliza a paleta exata da identidade aprovada, tipografia local e a árvore existente da marca. Blocos, campos, ilustrações e abas preservam hierarquia e ritmo de leitura. Fotos pessoais, QR válidos e identidades reais não são utilizados. O modo histórico conserva números ilustrativos do documento com aviso explícito; o modo vivo neutraliza crescimento, força e promoção sem contrato.

A barra principal aparece nos hubs. Fluxos focados usam saídas contextuais para reduzir distrações. Controles têm rótulos, foco visível e navegação por teclado; filtros comunicam quantidade; estados não dependem só de cor. Movimento é breve e respeita `prefers-reduced-motion`. A implementação final deve conferir contraste, alvos de toque, leitura assistiva e mensagens específicas de cada jornada; os cartões reduzidos do atlas são miniaturas de planejamento.

As fontes Fredoka e Plus Jakarta Sans foram copiadas das dependências já instaladas, com licenças em `atlas/assets/`. A árvore foi copiada do recurso de marca local. Não há dependência nova ou recurso de rede.

## Fontes e precedência

- [Catálogo v2.1](../Projeto_Nos_v2.1_Catalogo_Completo_das_Interfaces.md): 37 interfaces e complementos.
- [Fluxos v2.2](../Projeto_Nos_v2.2_Fluxos_Navegacao_e_Interacoes.md): navegação e jornadas.
- [Design system v2.3](../Projeto_Nos_v2.3_Design_System_Componentes_e_Tom_de_Interface.md): identidade e tom.
- [Modelo funcional v2.4](../Projeto_Nos_v2.4_Modelo_Funcional_Dados_Estados_e_Regras.md) e [permissões v2.5](../Projeto_Nos_v2.5_Matriz_de_Permissoes_Privacidade_Visibilidade.md).
- [Estados v2.6](../Projeto_Nos_v2.6_Estados_Vazios_Erros_e_Carregamento.md), [eventos v2.7](../Projeto_Nos_v2.7_Notificacoes_e_Eventos_do_Sistema.md) e [segurança v2.8](../Projeto_Nos_v2.8_Autenticacao_e_Seguranca.md).
- [Acordos v1.2](../Projeto_Nos_v1.2_Sistema_de_Aprovacao_e_Construcao_de_Acordos.md), [impacto v1.4](../Projeto_Nos_v1.4_Sistema_de_Impacto.md), [marcos v1.6](../Projeto_Nos_v1.6_Sistema_de_Marcos_de_Evolucao_e_Celebracoes_Saudaveis.md), [conversas v1.10](../Projeto_Nos_v1.10_Sistema_de_Conversas_Guiadas_e_Mediacao_Afetiva.md).
- [Protótipo original](../Telas/Nos_App.dc.html), [estado vigente](../_andamento/estado.md) e código local das rotas, catálogos e contratos de acesso.

Quando houver divergência, decisões explícitas do usuário e contratos implementados mais recentes prevalecem sobre exemplos antigos. O wireframe propõe composição e explicita decisões abertas; não substitui regras ou permissões persistidas.

## Próximo passo executável

Manter este guia e o atlas sincronizados a cada entrega. O usuário aprovou sua continuidade como referência viva. Retomar a definição de [Nossa Árvore](../_andamento/funcionalidades/nossa-arvore.md), usando a Tela 38 como composição, fechando fontes de dados e critérios antes de implementar. Não iniciar nova funcionalidade apenas porque seu desenho está pronto.

Critérios para esta entrega: Conta em primeiro; 37 origens cobertas; telas planejadas sinalizadas; fichas com contratos e permissões; destinos íntegros; navegação local; estados e apresentação responsiva verificados; versão funcional preservada; continuidade atualizada.

## Sincronização e apresentação de diferenças — decisão de 2026-10-07

Usuário determinou que atlas vivo e aplicativo devem ter os mesmos aspectos. Ao alterar qualquer lado, atualizar o outro na mesma entrega, incluindo campos, textos, botões, navegação, estados e regras. Apresentar sempre o que mudou; para mudanças visuais, registrar capturas antes/depois e comparação atlas/aplicação. Desenho histórico permanece como evidência de origem, sem sugerir integração não existente. [Comparação desta entrega](comparacoes/v0.12.0-2026-10-07-conta-entrada-tela_01-tela_02-tela_03-tela_04-tela_05-tela_72/index.html).

## Visão global, sincronização e comparações — procedimento permanente

Decisão de 2026-10-07: **qualquer alteração deve conferir o impacto em todas as telas do projeto e sincronizar aplicativo, Atlas vivo, Visão global, fichas, percursos e cobertura no mesmo conjunto lógico. Toda tela criada ou alterada deve acrescentar comparação em wireframes/comparacoes/.** O Atlas vivo mantém prioridade visual alta.

**Visão global**, acima de Todas as áreas, organiza a leitura desde Conta, com cadastro/recuperação opcionais, criação/convite alternativos e retorno ao Início do Núcleo. Os módulos seguintes são acessos contextuais, não uma fila obrigatória. “Saída” deriva de uma ação da ficha; “Contexto” é ligação conceitual de um percurso e não afirma botão direto. Consultar as condições e permissões antes de implementar. Busca/situação filtram as miniaturas; percursos permanecem completos para não ocultar etapas necessárias.

### Uma fonte para os desenhos e contratos

- screens.js contém telas, situações, rotas, regras, permissões, dependências, ações e percursos. global-view.js referencia esses dados; não copiar títulos, contratos ou imagens de uma tela para criar uma segunda versão no mapa.
- tileHtml e productPhoneHtml renderizam as mesmas composições nas duas visões. product-ui.js/product.css continuam representando a interface viva; approved-layouts.js preserva o documento histórico gerado.
- Uma tela acrescentada ao inventário aparece automaticamente na área correspondente da Visão global. Conferir sua posição contextual, atualizar os percursos/ações atingidos e revisar a ordem de leitura quando necessário. A organização não substitui a validação da jornada.
- O reuso sincroniza as visões do atlas automaticamente; a sincronização com o aplicativo exige atualizar o código/contrato afetado e conferir a interface real. Não alegar equivalência visual ou integração protegida somente porque a rota existe.

### Procedimento de cada alteração

1. **Impacto:** consultar estado, Visão global e fichas; identificar IDs/rotas, estados, dados, permissões, módulos compartilhados e caminhos atingidos. Ler a composição viva com prioridade alta. Antes de editar, preservar a aparência anterior e seu contexto de versão/commit.
2. **Implementação sincronizada:** alterar aplicativo e referência viva juntos, quando houver tela real; atualizar fonte, composição, fichas, ações, percursos, pendências e cobertura. Mudança funcional sem diferença estética também exige conferir as regras/estados das telas afetadas.
3. **Comparação obrigatória:** acrescentar pasta e galeria em comparacoes/ com nome `v<versão>-AAAA-MM-DD-assunto-tela_<número>` (**versão-data-assunto-tela**), usando a versão vigente e o número real da tela no atlas; exemplo: `v0.13.3-2026-10-10-entrada-convite-tela_10`. Escrever literalmente `tela_` antes do número, com pelo menos dois dígitos. Para várias telas ou nomes repetidos, seguir o [padrão de comparações](comparacoes/README.md). Se a entrega incrementar a versão, finalizar a pasta com essa versão e atualizar as referências. Preservar entregas anteriores. Tela alterada apresenta antes/depois, Atlas vivo e aplicativo real; tela nova explicita que não havia versão anterior. Capturar estados atingidos, celular/web quando definidos, diferenças e limites. Se só houver planejamento ou ferramenta do atlas, declarar a ausência de rota correspondente; não fabricar captura do produto.
4. **Verificação:** conferir todas as telas atingidas e seus caminhos, alternância de visões com filtros, títulos/campos/ações, responsividade, teclado, estados e imagens. Executar verify-global-view.mjs para o mapa; verify-fidelity.mjs para inventário/percursos e verify-account-fidelity.mjs para a área de Conta, com o app local disponível. Fluxos protegidos exigem verificação autorizada específica; esses scripts não certificam todos os módulos futuros.
5. **Entrega:** indexar a nova galeria em comparacoes/README.md e no registro, atualizar andamento/histórico/Brag quando relevante e informar diferenças, validações e pendências. Atualizar referência de versão somente quando o produto mudar; trabalho isolado no atlas/documentação não incrementa a versão funcional.

[Abrir Visão global](atlas/index.html#visao-global) · [Comparação da nova visão](comparacoes/v0.12.0-2026-10-07-visao-global-tela_01-a-tela_72/index.html).


## Navegação protegida — v0.13.0

Conta → Seus Núcleos → Início escolhido. Criação e convite são alternativas explícitas da lista; /comecar continua protegido. Tela12 passou de planejada a recorte existente. 132 testes, tipos/build, 72 prévias/180 saídas/360 estados e Visão global aprovados. Comparação real autenticada em desktop/celular na [galeria desta entrega](comparacoes/v0.13.0-2026-10-07-sessao-navegacao-tela_01-tela_06-tela_12-tela_13/index.html).
