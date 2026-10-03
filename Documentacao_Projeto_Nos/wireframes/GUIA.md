# Wireframe completo do Projeto Nós

**Natureza:** material de planejamento e revisão de produto, criado em 2026-10-03. **Referência do aplicativo:** v0.11.0.

Abra [o atlas navegável](atlas/index.html). Ele funciona localmente, sem servidor, conta, rede ou conexão com Supabase. Para transportar o material, mantenha a pasta `atlas/` completa: página, estilos, scripts e recursos locais.

## Manutenção contínua — decisão de 2026-10-03

Este wireframe é uma **referência viva**: deve acompanhar todo o desenvolvimento atual e futuro. Consultá-lo no início de cada recorte e atualizar os desenhos, fichas, percursos, permissões e pendências afetados junto da implementação e sua documentação. Ao concluir, verificar a correspondência com o comportamento real; manter separados os recortes existentes e os elementos ainda planejados.

Manter os IDs estáveis, registrar telas acrescentadas ou consolidadas e sincronizar o inventário de cobertura. Mudanças na versão funcional devem atualizar a referência do atlas; uma edição documental isolada não incrementa a versão do aplicativo. Conferir links, destinos e estados atingidos pela alteração, além da apresentação visual quando aplicável.

O protótipo e suas extrações estão agora em **Documentacao_Projeto_Nos/Telas/**, após movimentação feita pelo usuário. Esses materiais preservam a origem histórica; o atlas acompanha a evolução vigente. Regras implementadas e decisões explícitas prevalecem sobre exemplos antigos.

## Resultado esperado e escopo

Orientar o desenvolvimento de todo o produto documentado, começando em **01 — Conta**, com estrutura visual consistente, percursos, permissões, estados e pendências explícitos. O atlas tem 72 telas/estados, oito áreas e 12 percursos. As 37 interfaces do catálogo v2.1 estão cobertas; as 28 imagens antigas são parte desse catálogo, não seu limite.

As telas adicionais explicitam passos que o catálogo menciona sem uma composição própria: recuperação de acesso, confirmação pós-teste, acompanhamento de revisão, edição, privacidade, gestão e desfecho de conversas. Elas não significam 72 novas rotas, nem autorização para implementar todos os módulos simultaneamente. Continuações, abas e formulários podem compartilhar a mesma página.

## Como usar

1. **Atlas:** compare as telas lado a lado. Selecione uma área, busque um nome ou filtre por situação. Clique em uma tela para abrir sua ficha.
2. **Tela a tela:** consulte o desenho ampliado, o contrato, as pessoas autorizadas, a rota existente ou proposta, a origem no catálogo e as pendências. Os botões navegam entre desenhos; campos e escolhas são descartados ao mudar de tela.
3. **Celular / Web:** examine a composição estreita ou larga. A prévia Web demonstra distribuição de blocos; não é uma segunda especificação final de layout para cada módulo.
4. **Estados:** compare conteúdo, vazio, carregamento, erro, falta de permissão e sucesso. São padrões para revisão; mensagens definitivas devem respeitar a operação da tela. Sucesso visual do atlas nunca representa gravação real.
5. **Percursos:** siga as etapas dos 12 fluxos e consulte suas regras de transição. A numeração identifica telas; não implica que todas sejam um único caminho linear.
6. **Imprimir atlas:** imprime todas as áreas, removendo filtros. A ficha detalhada e as regras continuam disponíveis no material digital. Não foi exportado PDF nesta tarefa.

O [inventário de cobertura e pendências](COBERTURA.md) relaciona cada tela à interface antiga e descreve sua situação. As fichas em `atlas/screens.js` são a fonte dos desenhos e contratos; alterações futuras devem manter o inventário coerente.

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

**Conta primeiro** é a ordem desejada deste material. O aplicativo atual ainda redireciona `/` para `/comecar`; seu formulário de Conta começa no modo cadastro. Nenhuma rota ou preferência do aplicativo foi alterada nesta tarefa. Futuramente, uma sessão válida poderá ir diretamente ao contexto autorizado, sem impor novo login. Convites precisam preservar retorno durante autenticação.

A antiga entrada afetiva está preservada como composição opcional na Tela 72, fora do percurso obrigatório. As antigas Telas 05/06 são integradas ao detalhe 24. Continuações de perfil e outras áreas mantêm referências explícitas no inventário.

## Situação e pendências

**Planejada** significa que a tela ainda requer implementação ou contrato próprio. **Recorte existente** significa que a base funcional existe, mas o desenho pode conter extensões futuras. A ficha declara esses limites; esse rótulo não promete fidelidade integral entre wireframe e interface atual.

Há 45 telas planejadas e 27 recortes existentes. Os principais conjuntos pendentes são:

- **Conta:** recuperação/redefinição de senha; reenvio operacional de confirmação; SMTP (protocolo de envio de e-mail) e limites para lançamento. A entrada por Conta ainda é uma proposta de alteração do fluxo atual.
- **Núcleos:** listagem multínucleo, gestão de convites, QR (código de resposta rápida), compartilhamento ampliado e saída com tratamento das dependências. Administrador é papel documental futuro; o recorte atual usa criador e membro.
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

O material utiliza fundos claros, verde de cuidado, tipografia local e a árvore existente da marca. Blocos, campos e contornos priorizam hierarquia, ritmo de leitura e relação entre ações. Fotos pessoais, QR válidos, identidades reais e números inventados de crescimento não são utilizados.

A barra principal aparece nos hubs. Fluxos focados usam saídas contextuais para reduzir distrações. Controles têm rótulos, foco visível e navegação por teclado; filtros comunicam quantidade; estados não dependem só de cor. Movimento é breve e respeita `prefers-reduced-motion`. A implementação final deve conferir contraste, alvos de toque, leitura assistiva e mensagens específicas de cada jornada; os cartões reduzidos do atlas são miniaturas de planejamento.

As fontes Fredoka e Plus Jakarta Sans foram copiadas das dependências já instaladas, com licenças em `atlas/assets/`. A árvore foi copiada do recurso de marca local. Não há dependência nova ou recurso de rede.

## Fontes e precedência

- [Catálogo v2.1](../Projeto_Nos_v2.1_Catalogo_Completo_das_Interfaces.md): 37 interfaces e complementos.
- [Fluxos v2.2](../Projeto_Nos_v2.2_Fluxos_Navegacao_e_Interacoes.md): navegação e jornadas.
- [Design system v2.3](../Projeto_Nos_v2.3_Design_System_Componentes_e_Tom_de_Interface.md): identidade e tom.
- [Modelo funcional v2.4](../Projeto_Nos_v2.4_Modelo_Funcional_Dados_Estados_e_Regras.md) e [permissões v2.5](../Projeto_Nos_v2.5_Matriz_de_Permissoes_Privacidade_Visibilidade.md).
- [Estados v2.6](../Projeto_Nos_v2.6_Estados_Vazios_Erros_e_Carregamento.md), [eventos v2.7](../Projeto_Nos_v2.7_Notificacoes_e_Eventos_do_Sistema.md) e [segurança v2.8](../Projeto_Nos_v2.8_Autenticacao_e_Seguranca.md).
- [Acordos v1.2](../Projeto_Nos_v1.2_Sistema_de_Aprovacao_e_Construcao_de_Acordos.md), [impacto v1.4](../Projeto_Nos_v1.4_Sistema_de_Impacto.md), [marcos v1.6](../Projeto_Nos_v1.6_Sistema_de_Marcos_de_Evolucao_e_Celebracoes_Saudaveis.md), [conversas v1.10](../Projeto_Nos_v1.10_Sistema_de_Conversas_Guiadas_e_Mediacao_Afetiva.md).
- [Protótipo original](../Telas/N%C3%B3s%20App.dc.html), [estado vigente](../_andamento/estado.md) e código local das rotas, catálogos e contratos de acesso.

Quando houver divergência, decisões explícitas do usuário e contratos implementados mais recentes prevalecem sobre exemplos antigos. O wireframe propõe composição e explicita decisões abertas; não substitui regras ou permissões persistidas.

## Próximo passo executável

Manter este guia e o atlas sincronizados a cada entrega. O usuário aprovou sua continuidade como referência viva. Retomar a definição de [Nossa Árvore](../_andamento/funcionalidades/nossa-arvore.md), usando a Tela 38 como composição, fechando fontes de dados e critérios antes de implementar. Não iniciar nova funcionalidade apenas porque seu desenho está pronto.

Critérios para esta entrega: Conta em primeiro; 37 origens cobertas; telas planejadas sinalizadas; fichas com contratos e permissões; destinos íntegros; navegação local; estados e apresentação responsiva verificados; versão funcional preservada; continuidade atualizada.
