# Registro — v0.16.0 — 2026-10-14 — Imp. de contrato de saída com Fun. de definição do MVP 05

**Respostas consolidadas em 14/10/2026:** [contrato vigente](../funcionalidades/administracao-participacao.md); regras de votação coletiva do desenho anterior substituídas.

Status: Em andamento — definição de produto; sem nova implementação. Versão funcional preservada em 0.16.0.

**Direção posterior aprovada:** usuário aprovou administração simples pelo quadro Situação/Comportamento. Respostas5–10 abaixo sobre cancelamentos/votações por saída estão substituídas; não implementar essa cascata. Preservar decisões de conteúdo/preferência de autoria. Pergunta11 não respondida e não retomada. [Novo roteiro vigente](registro-v0.16.0-2026-10-14-10-imp-modelo-administracao-fun-roteiro-simplificado.md).

Objetivo: definir os contratos pendentes dos itens 1–4 antes de implementar saída, transferência e tratamento do histórico.

Decisões explícitas do usuário:

- Qualquer participante pode deixar o Núcleo a qualquer momento. Tratamento do criador ainda precisa ser definido sem contradizer esse direito de saída.
- Decisão vigente na resposta à pergunta 2: atividades preservadas por padrão; oferecer nas configurações opção para o usuário determinar se suas interações ficam anônimas após a saída. O aviso de saída deve refletir o comportamento escolhido. Padrão de identificação e aplicação a saídas anteriores ainda não definidos.
- Resposta à pergunta 3: opção A aprovada — uma preferência geral do aplicativo, válida para todos os Núcleos; sem escolha separada por Núcleo.
- Decisões substituídas: inicialmente foi proposta escolha de manter/apagar; depois o usuário determinou eliminação obrigatória sem histórico; na resposta à pergunta 2 substituiu essa orientação pela preservação padrão com anonimização opcional. Não implementar eliminação obrigatória com base na decisão anterior.
- Resposta à pergunta 4: opção A aprovada — preservar o conteúdo pessoal, incluindo humor e notas, retirando a identificação de autoria quando a preferência estiver ativada. Não apagar ou reescrever textos automaticamente. O aviso deve esclarecer que conteúdo/contexto pode permitir reconhecimento; não prometer anonimato completo por ocultar autoria. Ligação interna à conta, saídas anteriores e dependências de decisões coletivas ainda precisam de contrato.
- Item 5 adiado a pedido do usuário porque o Google ainda não liberou o acesso. Continuar itens 1–4; a comprovação operacional e a liberação do piloto continuam pendentes.

- Resposta à pergunta 5, posterior à publicação 30ea405: cancelamento da proposta original aprovado se um participante original sair durante aprovação inicial. Nova proposta para atuais exige novos aceites; saída não é aceite nem recalcula votos. [Registro da decisão](registro-v0.16.0-2026-10-14-03-imp-contrato-saida-fun-cancelamento-proposta.md).

- Resposta6 corrigida: saída de participante original encerra automaticamente somente acordo em teste, preservando histórico. Acordo ativo terá nova votação de continuidade; mais da metade com direito a voto deve escolher continuar. Eleitorado/prazo/estado intermediário ainda pendentes. [Registro da correção](registro-v0.16.0-2026-10-14-04-imp-contrato-saida-fun-continuidade-acordo.md).

- Resposta7, opção A: votarão apenas participantes originais do acordo que permanecerem associados ao Núcleo. Novos membros não participam dessa votação. [Registro](registro-v0.16.0-2026-10-14-05-imp-contrato-saida-fun-eleitorado-continuidade.md).

- Resposta8: prazo de sete dias; maioria aprova continuidade imediatamente; prazo encerrado sem maioria encerra acordo preservando histórico. [Registro](registro-v0.16.0-2026-10-14-06-imp-contrato-saida-fun-prazo-votacao.md).

- Resposta9 B: novos registros de momentos permitidos durante votação, preservados no histórico após eventual encerramento. Não pausar gravações por essa votação. [Registro](registro-v0.16.0-2026-10-14-07-imp-contrato-saida-fun-registros-durante-votacao.md).

- Resposta10: outra saída de original durante votação pendente encerra a rodada sem resultado e abre nova para originais restantes, sete dias/novos votos; momentos continuam permitidos, votos antigos não reaproveitados. [Registro](registro-v0.16.0-2026-10-14-08-imp-contrato-saida-fun-reinicio-votacao.md).

Próximo passo: implementar [contrato consolidado](../funcionalidades/administracao-participacao.md). As respostas antigas de votação abaixo são histórico superado; não retomar essa sequência.

Arquivos: este registro, funcionalidades/autonomia-protecao.md e estado/historico. Integrações: nenhuma alterada. Validação: autorrevisão documental e git diff --check; testes funcionais não repetidos nesta definição documental. Evidências funcionais da v0.16.0 pertencem à entrega anterior.

Limitação: estas decisões não implementam saída ou anonimização e não alteram votação. Sem commit, push, deploy ou operação remota.
