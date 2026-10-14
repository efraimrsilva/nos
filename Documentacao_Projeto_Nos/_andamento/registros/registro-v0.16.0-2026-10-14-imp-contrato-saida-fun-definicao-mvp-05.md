# Registro — v0.16.0 — 2026-10-14 — Imp. de contrato de saída com Fun. de definição do MVP 05

Status: Em andamento — definição de produto; sem nova implementação. Versão funcional preservada em 0.16.0.

Objetivo: definir os contratos pendentes dos itens 1–4 antes de implementar saída, transferência e tratamento do histórico.

Decisões explícitas do usuário:

- Qualquer participante pode deixar o Núcleo a qualquer momento. Tratamento do criador ainda precisa ser definido sem contradizer esse direito de saída.
- Decisão vigente na resposta à pergunta 2: atividades preservadas por padrão; oferecer nas configurações opção para o usuário determinar se suas interações ficam anônimas após a saída. O aviso de saída deve refletir o comportamento escolhido. Padrão de identificação e aplicação a saídas anteriores ainda não definidos.
- Resposta à pergunta 3: opção A aprovada — uma preferência geral do aplicativo, válida para todos os Núcleos; sem escolha separada por Núcleo.
- Decisões substituídas: inicialmente foi proposta escolha de manter/apagar; depois o usuário determinou eliminação obrigatória sem histórico; na resposta à pergunta 2 substituiu essa orientação pela preservação padrão com anonimização opcional. Não implementar eliminação obrigatória com base na decisão anterior.
- Resposta à pergunta 4: opção A aprovada — preservar o conteúdo pessoal, incluindo humor e notas, retirando a identificação de autoria quando a preferência estiver ativada. Não apagar ou reescrever textos automaticamente. O aviso deve esclarecer que conteúdo/contexto pode permitir reconhecimento; não prometer anonimato completo por ocultar autoria. Ligação interna à conta, saídas anteriores e dependências de decisões coletivas ainda precisam de contrato.
- Item 5 adiado a pedido do usuário porque o Google ainda não liberou o acesso. Continuar itens 1–4; a comprovação operacional e a liberação do piloto continuam pendentes.

Próxima pergunta: quando um participante original sai durante a aprovação inicial, cancelar a proposta pendente sem transformá-la em acordo e permitir uma nova proposta para os membros atuais? Esta é recomendação, ainda não decisão aprovada. Depois definir Hábitos em teste/ativos, revisões, saídas anteriores, criador/último membro, retenção/direitos e suporte/termos.

Arquivos: este registro, funcionalidades/autonomia-protecao.md e estado/historico. Integrações: nenhuma alterada. Validação: autorrevisão documental e git diff --check; testes funcionais não repetidos nesta definição documental. Evidências funcionais da v0.16.0 pertencem à entrega anterior.

Limitação: estas decisões não implementam saída ou anonimização e não alteram votação. Sem commit, push, deploy ou operação remota.
