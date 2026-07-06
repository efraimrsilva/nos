# Projeto Nós - Calendário do Núcleo e Sincronização Segura (Versão 1.9)

## Categoria
**1.x - Visão e Regras de Negócio**

## Documentos Relacionados

### Versões 1.x (Visão e Regras de Negócio)
- [v1.2 - Sistema de Aprovação e Construção de Acordos](Projeto_Nos_v1.2_Sistema_de_Aprovacao_e_Construcao_de_Acordos.md)
- [v1.3 - Evolução para Núcleos](Projeto_Nos_v1.3_Evolucao_Para_Nucleos.md)
- [v1.4 - Sistema de Impacto](Projeto_Nos_v1.4_Sistema_de_Impacto.md)
- [v1.5 - Sistema de Reconhecimento e Gratidão](Projeto_Nos_v1.5_Sistema_de_Reconhecimento_e_Gratidao.md)
- [v1.6 - Sistema de Marcos de Evolução e Celebrações Saudáveis](Projeto_Nos_v1.6_Sistema_de_Marcos_de_Evolucao_e_Celebracoes_Saudaveis.md)
- [v1.7 - Sistema de Linguagens de Cuidado e Amor](Projeto_Nos_v1.7_Sistema_de_Linguagens_de_Cuidado_e_Amor.md)
- [v1.8 - Manifesto do Núcleo](Projeto_Nos_v1.8_Manifesto_do_Nucleo.md)
- [v1.9 - Calendário do Núcleo e Sincronização Segura](Projeto_Nos_v1.9_Calendario_do_Nucleo_e_Sincronizacao_Segura.md)
- [v1.10 - Sistema de Conversas Guiadas e Mediação Afetiva](Projeto_Nos_v1.10_Sistema_de_Conversas_Guiadas_e_Mediacao_Afetiva.md)

### Versões 2.x (Interface e Implementação)
- [v2.0 - Alinhamento das Telas com a Documentação](Projeto_Nos_v2.0_Alinhamento_das_Telas_com_a_Documentacao.md)
- [v2.1 - Catálogo Completo das Interfaces](Projeto_Nos_v2.1_Catalogo_Completo_das_Interfaces.md)
- [v2.2 - Fluxos, Navegação e Interações](Projeto_Nos_v2.2_Fluxos_Navegacao_e_Interacoes.md)
- [v2.3 - Design System, Componentes e Tom de Interface](Projeto_Nos_v2.3_Design_System_Componentes_e_Tom_de_Interface.md)
- [v2.4 - Modelo Funcional, Dados, Estados e Regras](Projeto_Nos_v2.4_Modelo_Funcional_Dados_Estados_e_Regras.md)
- [v2.5 - Matriz de Permissões, Privacidade e Visibilidade](Projeto_Nos_v2.5_Matriz_de_Permissoes_Privacidade_Visibilidade.md)
- [v2.6 - Estados Vazios, Erros e Carregamento](Projeto_Nos_v2.6_Estados_Vazios_Erros_e_Carregamento.md)
- [v2.7 - Notificações e Eventos do Sistema](Projeto_Nos_v2.7_Notificacoes_e_Eventos_do_Sistema.md)

---

## Regra Central

> O Calendário do Núcleo organiza momentos, experiências, revisões e encontros criados dentro do Projeto Nós, podendo sincronizá-los com calendários externos apenas como eventos marcados pelo Projeto Nós, sem importar, expor, mesclar ou compartilhar compromissos privados dos membros.

Esta regra deve orientar toda decisão de produto, interface, integração, automação, privacidade e evolução futura relacionada à agenda do Projeto Nós.

---

## Status

Planejado

## Tipo

Melhoria Incremental de Organização, Presença, Experiências, Confirmação de Participação e Sincronização Segura

## Compatibilidade

100% compatível com a Documentação v1.2, com a Evolução para Núcleos v1.3, com o Sistema de Impacto v1.4, com Reconhecimento e Gratidão v1.5, com Marcos v1.6, com Linguagens de Cuidado v1.7 e com o Manifesto do Núcleo v1.8.

Esta melhoria não altera a filosofia central do Projeto Nós.

Esta melhoria não cria uma nova categoria principal.

Esta melhoria não transforma agenda em cobrança, vigilância, controle de rotina, exposição de privacidade ou obrigação emocional.

---

# Objetivo

Criar um calendário interno para cada Núcleo, permitindo que seus membros planejem eventos, experiências, conversas, revisões, celebrações e momentos de cuidado.

O calendário deve ajudar o Núcleo a transformar intenções em presença real, sem invadir a vida privada dos membros.

O calendário interno poderá se conectar a contas Google ou Apple, mas a sincronização deve seguir uma regra rígida:

- somente eventos criados no Projeto Nós podem ser sincronizados;
- somente eventos com identificação técnica do Projeto Nós podem ser atualizados ou removidos pelo Projeto Nós;
- eventos privados já existentes nos calendários pessoais não devem ser importados para o Núcleo;
- eventos privados dos membros não devem aparecer para outros membros;
- a conta externa deve funcionar como destino de espelho, não como fonte de mistura de dados privados.

---

# O Que Está Bom Nesta Melhoria

Esta melhoria é muito forte porque resolve uma lacuna prática que já aparece nas telas do protótipo: agenda, próximos momentos, experiências planejadas e eventos familiares.

Ela também combina bem com a filosofia do Projeto Nós, porque muitos acordos e experiências só se tornam reais quando ganham data, horário, participantes e confirmação.

Exemplos:

- jantar em família;
- noite do filme;
- passeio ao ar livre;
- conversa sem distrações;
- revisão de acordo;
- celebração de marco;
- encontro para conversar sobre uma dificuldade;
- experiência mensal do casal;
- compromisso familiar recorrente.

O ponto mais importante da sua ideia é a proteção contra bagunça e invasão de privacidade. Essa preocupação deve virar regra estrutural do produto, não apenas detalhe técnico.

---

# Decisão Estrutural

O Calendário do Núcleo será uma camada transversal do Núcleo.

Ele pode se relacionar com:

- acordos;
- hábitos;
- experiências;
- revisões;
- conversas de cuidado;
- gratidões;
- celebrações;
- marcos;
- memórias;
- perfil afetivo;
- manifesto.

O calendário não substitui acordos, experiências ou revisões.

Ele organiza quando esses momentos vão acontecer.

---

# Conceito Principal

O Projeto Nós deve ter um calendário interno próprio.

Esse calendário interno é a fonte oficial dos eventos do Núcleo.

Google Calendar, Apple Calendar ou outros calendários pessoais devem receber apenas uma cópia sincronizada dos eventos criados dentro do Projeto Nós.

## Modelo recomendado

Projeto Nós

↓ cria evento oficial

Calendário interno do Núcleo

↓ espelha somente eventos autorizados

Calendário Google ou Apple do membro

## Modelo totalmente proibido

Calendário pessoal do membro

↓ importa tudo

Calendário do Núcleo

↓ mistura compromissos privados entre pessoas

Este modelo deve ser proibido.

---

# Regra de Privacidade da Sincronização

## Regra Principal

O Projeto Nós nunca deve importar, exibir ou mesclar eventos privados já existentes nos calendários pessoais dos membros.

## Consequências práticas

- O Núcleo não vê compromissos privados dos membros.
- Um membro não vê a agenda pessoal do outro.
- Eventos antigos do Google ou Apple Calendar não entram no Projeto Nós.
- O Projeto Nós só cria, atualiza ou remove eventos que ele mesmo criou.
- Cada evento sincronizado deve possuir identificação técnica interna do Projeto Nós.
- Se um evento externo não tiver essa identificação, o Projeto Nós deve ignorá-lo.

---

# Conexão com Google e Apple

## Conta Google

A conexão com Google pode ter dois usos separados:

1. entrar no Projeto Nós com conta Google;
2. autorizar sincronização com Google Calendar.

Esses dois consentimentos devem ser separados.

Entrar com Google não deve conceder automaticamente permissão para mexer no calendário.

## Conta Apple

A conexão com Apple também deve ter dois usos separados:

1. entrar no Projeto Nós com Sign in with Apple;
2. permitir sincronização com calendário Apple quando a plataforma suportar isso.

Importante: Sign in with Apple serve para autenticação. Ele não deve ser tratado como permissão automática para acessar calendário.

## Estratégia recomendada

Para a primeira versão, a melhor abordagem é:

- permitir login com Google e Apple;
- implementar sincronização completa primeiro com Google Calendar;
- no iOS, planejar integração com Apple Calendar via recursos nativos do dispositivo;
- no web, oferecer exportação ou assinatura de calendário em formato iCalendar como alternativa inicial para usuários Apple;
- deixar claro na interface quais permissões estão sendo concedidas.

---

# Modelo de Sincronização Segura

## Fonte Oficial

Todo evento nasce no Projeto Nós.

Campos mínimos:

- identificador interno do evento;
- identificador do Núcleo;
- criador;
- participantes;
- título;
- tipo de evento;
- data e horário;
- fuso horário;
- status;
- visibilidade;
- confirmação dos participantes;
- assuntos ou pauta;
- vínculo opcional com acordo, experiência, revisão, marco ou memória.

## Espelho Externo

Quando o membro autoriza, o Projeto Nós cria uma cópia no calendário externo dele.

Essa cópia deve conter uma marca técnica, por exemplo:

- `projeto_nos_event_id`;
- `projeto_nos_nucleo_id`;
- `projeto_nos_sync_source`;
- `projeto_nos_created_by`;
- `projeto_nos_visibility`.

No Google Calendar, isso pode ser feito com propriedades estendidas do evento.

Em integrações que não aceitem propriedades técnicas privadas da mesma forma, o Projeto Nós deve manter o vínculo em sua própria base de dados e, quando necessário, usar descrição, URL ou identificador controlado sem expor informações sensíveis.

## Regra de Atualização

O Projeto Nós só pode atualizar evento externo se:

- o evento externo estiver vinculado a um evento interno;
- o vínculo estiver registrado na base do Projeto Nós;
- o evento possuir marca técnica compatível;
- o membro ainda tiver autorizado a sincronização.

## Regra de Exclusão

Ao cancelar ou excluir um evento no Projeto Nós, o sistema pode remover ou cancelar os espelhos externos criados por ele.

O sistema nunca deve excluir eventos externos que não tenham sido criados pelo Projeto Nós.

---

# Calendário Separado por Núcleo

## Recomendação

Criar, para cada membro conectado, um calendário externo separado para cada Núcleo sincronizado.

Exemplos:

- Projeto Nós - Família Silva
- Projeto Nós - Nós dois
- Projeto Nós - Eu e André

## Por que isso é melhor

- Evita misturar eventos do Projeto Nós com a agenda pessoal principal.
- Permite ao usuário ativar ou ocultar o calendário facilmente no app externo.
- Reduz risco de bagunça visual.
- Facilita remoção da integração sem tocar no calendário privado.
- Reforça que eventos do Núcleo são uma camada separada.

## Alternativa permitida

Permitir que o usuário escolha sincronizar com o calendário principal.

Mas essa opção deve vir com aviso claro:

> Os eventos do Projeto Nós serão adicionados ao calendário escolhido, mas o Projeto Nós não verá nem importará seus compromissos privados.

Mesmo nesse caso, os eventos devem continuar marcados tecnicamente como eventos do Projeto Nós.

---

# Tipos de Evento

## Experiência

Momento planejado para fortalecer o vínculo.

Exemplos:

- passeio;
- jantar;
- viagem;
- noite do filme;
- atividade em família;
- tempo de qualidade.

## Hábito Agendado

Ocorrência prática de um hábito ou acordo recorrente.

Exemplos:

- conversar sem celular;
- jantar semanal;
- reunião familiar;
- caminhada juntos.

## Revisão

Momento para avaliar acordo, experiência ou fase do Núcleo.

Exemplos:

- revisão mensal de acordo;
- conversa sobre impacto percebido;
- decisão sobre manter, ajustar ou encerrar.

## Conversa de Cuidado

Momento criado para tratar dificuldades com calma, sem tom de cobrança.

Exemplo:

> Conversar sobre como podemos retomar nosso acordo com mais leveza.

## Celebração

Evento para celebrar marco, conquista saudável ou momento importante.

Exemplos:

- celebração de 6 meses de um hábito;
- aniversário do Núcleo;
- comemoração de uma promoção para Nossa Essência.

## Data Importante

Data afetiva cadastrada no perfil ou no Núcleo.

Exemplos:

- aniversário;
- data do casal;
- aniversário de casamento;
- data familiar significativa.

## Evento Livre

Evento criado pelo Núcleo sem vínculo obrigatório com acordo ou experiência.

---

# Assuntos Pertinentes em Cada Evento

Cada evento deve ter uma estrutura leve para evitar que a agenda vire apenas título e horário.

## Campos recomendados

### Título

Deve ser curto, claro e afetivo.

Exemplos:

- Jantar em família
- Nossa conversa semanal
- Revisão do acordo de presença
- Passeio ao ar livre
- Noite do filme

### Intenção do Momento

Explica por que o evento importa.

Exemplo:

> Criar um momento de presença sem distrações para conversarmos com calma.

### Tipo de Evento

Selecionado a partir das opções anteriores.

### Participantes

Membros convidados ou envolvidos.

Cada participante deve ter status próprio.

### Assuntos ou Pauta

Lista curta de temas.

Exemplos:

- conversar sobre a semana;
- combinar responsabilidades;
- revisar o que funcionou;
- planejar próxima experiência;
- celebrar uma conquista.

### Vínculo Opcional

O evento pode estar vinculado a:

- acordo;
- hábito;
- experiência;
- marco;
- memória;
- linguagem de cuidado;
- manifesto;
- perfil afetivo.

### Tom do Evento

Campo opcional para orientar a energia do momento.

Opções possíveis:

- leve;
- importante;
- celebração;
- cuidado;
- revisão;
- planejamento;
- conversa sensível.

### Lembretes

Permitir lembretes configuráveis:

- no momento;
- 10 minutos antes;
- 1 hora antes;
- 1 dia antes;
- personalizado.

### Privacidade

Define quem vê o evento dentro do Núcleo.

Opções:

- todos do Núcleo;
- apenas participantes;
- criador e convidados;
- privado do usuário, quando for uma preparação pessoal ligada ao Núcleo.

---

# Confirmação de Participação

Cada integrante convidado deve confirmar participação.

## Status de participação

- Aguardando resposta.
- Confirmado.
- Talvez.
- Recusado.
- Propôs outro horário.

## Status do evento

O evento pode ter estados próprios:

- Rascunho.
- Convite enviado.
- Aguardando confirmações.
- Confirmado.
- Precisa de novo horário.
- Cancelado.
- Realizado.
- Registrado como memória.

## Regra de confirmação

Para eventos de Núcleos íntimos e familiares, o ideal é que o evento só apareça como Confirmado quando todos os participantes obrigatórios confirmarem.

Se alguém recusar, o evento deve mudar para Precisa de novo horário ou manter status parcial, conforme decisão do criador.

## Participantes obrigatórios e opcionais

Eventos podem ter:

- participantes obrigatórios;
- participantes opcionais.

Exemplo:

Uma revisão de acordo entre casal pode exigir confirmação dos dois.

Uma festa familiar pode permitir convidados opcionais.

---

# Fluxo Recomendado

## Etapa 1 - Criar Evento no Núcleo

Um membro escolhe o Núcleo e cria um evento.

## Etapa 2 - Definir Tipo

O sistema pergunta:

> Que tipo de momento vocês querem organizar?

Opções:

- Experiência.
- Hábito agendado.
- Revisão.
- Conversa de cuidado.
- Celebração.
- Data importante.
- Evento livre.

## Etapa 3 - Definir Intenção

O usuário registra por que aquele momento importa.

Essa etapa aproxima o calendário da filosofia do Projeto Nós.

## Etapa 4 - Escolher Data, Horário e Recorrência

O evento pode ser único ou recorrente.

Recorrências sugeridas:

- semanal;
- quinzenal;
- mensal;
- anual;
- personalizada.

## Etapa 5 - Escolher Participantes

O criador escolhe quem precisa participar.

## Etapa 6 - Adicionar Assuntos

O usuário adiciona uma pauta curta, se fizer sentido.

## Etapa 7 - Enviar Convites

Os participantes recebem notificação dentro do Projeto Nós.

Se tiverem sincronização externa ativa, recebem também o evento no calendário conectado.

## Etapa 8 - Confirmar Participação

Cada membro responde.

## Etapa 9 - Confirmar ou Ajustar

Se todos confirmarem, o evento fica Confirmado.

Se houver recusa ou conflito, o sistema incentiva escolher outro horário.

## Etapa 10 - Realizar

Após a data, o evento pode ser marcado como realizado.

## Etapa 11 - Registrar Momento

O sistema pode sugerir:

- registrar memória;
- registrar gratidão;
- registrar reconhecimento;
- avaliar impacto percebido;
- vincular a um marco;
- alimentar a árvore do Núcleo.

---

# Sugestão de Horários

## Fase Inicial

Na primeira versão, evitar leitura de calendários privados.

O usuário escolhe o horário manualmente.

## Fase Futura

Permitir sugestão de horários usando apenas disponibilidade livre/ocupado, se o usuário conceder permissão explícita.

Mesmo nesse caso:

- o sistema não deve mostrar títulos de compromissos privados;
- o sistema não deve mostrar locais privados;
- o sistema não deve mostrar descrições privadas;
- outros membros só devem ver sugestões agregadas, como "este horário parece funcionar".

## Exemplo de interface segura

> Encontramos alguns horários possíveis com base nas disponibilidades autorizadas. Nenhum compromisso privado será exibido ao Núcleo.

---

# Notificações

## Notificações internas

Exemplos:

- Ana criou um evento para o Núcleo.
- João confirmou presença.
- Maria propôs outro horário.
- O evento de amanhã está chegando.
- Vocês podem registrar como foi esse momento.

## Tom recomendado

Afetivo, claro e sem cobrança.

## Evitar

- Fulano ainda não respondeu.
- Você está atrasando o grupo.
- Todos já confirmaram menos você.
- Você precisa comparecer.

## Preferir

- Ainda falta sua resposta para combinarem esse momento.
- Você pode confirmar, recusar ou sugerir outro horário.
- Este momento está chegando.
- Depois, vocês podem registrar como foi.

---

# Relação com Acordos

Um acordo pode gerar eventos automaticamente ou sugeridos.

Exemplo:

Acordo:

> Conversar sem celular toda quarta-feira por 30 minutos.

Calendário:

> Criar evento recorrente toda quarta-feira, 20h.

Regra:

O agendamento deve ser uma ajuda para praticar o acordo, não uma cobrança automática.

---

# Relação com Experiências

Experiências que Queremos Viver devem poder virar eventos.

Exemplo:

Experiência:

> Fazer um passeio em família uma vez por mês.

Calendário:

> Planejar data, local, participantes, intenção e confirmação.

Após o evento, o sistema pode sugerir registro de memória.

---

# Relação com Memórias

Eventos realizados podem gerar memórias.

Campos possíveis:

- como foi o momento;
- sentimento predominante;
- foto opcional;
- gratidão relacionada;
- aprendizado;
- acordo ou experiência associada.

Nem todo evento precisa virar memória.

A sugestão deve ser leve e opcional.

---

# Relação com Marcos

Eventos podem gerar ou apoiar marcos.

Exemplos:

- primeira experiência planejada;
- primeira revisão realizada;
- 3 meses de conversa semanal;
- primeira celebração do Núcleo;
- aniversário do Núcleo.

Marcos devem seguir as regras de não competição e não cobrança.

---

# Relação com Linguagens de Cuidado

Cada evento pode ter uma ou mais Linguagens de Cuidado associadas.

Exemplos:

- jantar sem celular: Tempo de Qualidade;
- preparar uma surpresa: Presentes + Atos de Serviço;
- conversa de reconhecimento: Palavras de Afirmação;
- apoio em mudança de casa: Atos de Serviço;
- momento de proximidade do casal: Toque Físico, sempre com respeito e consentimento.

A linguagem é uma pista afetiva, não uma obrigação.

---

# Relação com Manifesto do Núcleo

Eventos podem alimentar o Manifesto quando viram parte real da trajetória do Núcleo.

O Manifesto pode considerar:

- experiências vividas;
- revisões realizadas;
- celebrações recorrentes;
- momentos de cuidado registrados;
- eventos associados a alto impacto percebido;
- formas de cuidado percebidas nos eventos.

Regra:

O Manifesto não deve usar eventos apenas planejados como evidência forte de identidade.

Eventos realizados e registrados devem ter mais peso do que eventos criados e não vividos.

---

# Cuidados de Produto

## Privacidade visível

Em telas de conexão externa, mostrar mensagem clara:

> O Projeto Nós só sincroniza eventos criados aqui. Seus compromissos privados não serão compartilhados com o Núcleo.

## Consentimento separado

Login e calendário são permissões diferentes.

## Controle por membro

Cada membro decide se quer sincronizar seus eventos com calendário externo.

## Controle por Núcleo

Um usuário pode ativar sincronização para um Núcleo e não para outro.

## Remoção segura

Ao desconectar a conta externa, o usuário deve poder escolher:

- parar novas sincronizações;
- remover eventos futuros do Projeto Nós do calendário externo;
- manter eventos já sincronizados como registro pessoal.

## Transparência

Cada evento deve mostrar se está sincronizado externamente.

Exemplo:

> Sincronizado com Google Calendar.

---

# Regras de Negócio Adicionais

## Regra C1

Todo Núcleo pode possuir um Calendário do Núcleo.

## Regra C2

Todo evento do Calendário do Núcleo deve pertencer a um Núcleo.

## Regra C3

O calendário não cria nova categoria principal na plataforma.

## Regra C4

O Projeto Nós deve tratar o calendário interno como fonte oficial dos eventos do Núcleo.

## Regra C5

Eventos externos privados não devem ser importados, exibidos, mesclados ou compartilhados dentro do Núcleo.

## Regra C6

Somente eventos criados pelo Projeto Nós e identificados tecnicamente como eventos do Projeto Nós podem ser sincronizados, atualizados ou removidos pela plataforma.

## Regra C7

Login com Google ou Apple não deve conceder automaticamente permissão de calendário.

## Regra C8

Cada membro deve conceder consentimento explícito para sincronizar eventos com calendário externo.

## Regra C9

Cada participante convidado deve possuir status de confirmação.

## Regra C10

Para eventos com participantes obrigatórios, o status Confirmado deve depender da confirmação dos participantes definidos como obrigatórios.

## Regra C11

O sistema deve permitir que participantes recusem ou sugiram outro horário sem tom de culpa.

## Regra C12

Eventos podem ser associados a acordos, hábitos, experiências, revisões, conversas de cuidado, celebrações, marcos, memórias e Linguagens de Cuidado.

## Regra C13

Eventos realizados podem gerar memórias, gratidões, reconhecimentos, impacto percebido ou marcos, sempre de forma opcional.

## Regra C14

A sugestão de horários com base em disponibilidade externa só pode ocorrer com autorização explícita e deve ocultar detalhes privados dos calendários pessoais.

## Regra C15

O usuário deve poder desconectar a sincronização externa sem perder o calendário interno do Núcleo.

## Regra C16

O Projeto Nós não deve criar notificações punitivas relacionadas a falta de confirmação, ausência ou reagendamento.

## Regra C17

Eventos cancelados ou não realizados não devem gerar punição, vergonha, perda de progresso ou exposição negativa.

## Regra C18

Eventos do calendário podem apoiar o Manifesto do Núcleo apenas quando representarem práticas reais, vividas ou confirmadas na trajetória.

---

# Benefícios

## Para o Usuário

- Ajuda a lembrar e praticar momentos importantes.
- Reduz desencontros.
- Facilita confirmação de presença.
- Mantém eventos do Núcleo visíveis no calendário pessoal sem expor compromissos privados.
- Dá mais clareza sobre intenção, pauta e participantes.

## Para o Núcleo

- Transforma acordos e experiências em momentos concretos.
- Melhora organização sem burocratizar o vínculo.
- Ajuda a criar memórias afetivas.
- Apoia revisões, celebrações e continuidade.
- Fortalece presença e compromisso coletivo.

## Para a Plataforma

- Integra Home, Agenda, Experiências, Acordos, Memórias e Manifesto.
- Aumenta utilidade diária do produto.
- Cria base para lembretes saudáveis.
- Diferencia o Projeto Nós de calendários genéricos ao preservar intenção afetiva e privacidade.

---

# Recomendações de Implementação Incremental

## Fase 1 - Calendário Interno Simples

Criar calendário por Núcleo com:

- eventos;
- participantes;
- data e horário;
- tipo;
- intenção;
- confirmação de presença;
- vínculo opcional com acordo ou experiência.

## Fase 2 - Home e Próximos Momentos

Exibir próximos eventos na Home do Núcleo e na área de Agenda.

## Fase 3 - Confirmação de Participação

Implementar status por participante:

- Aguardando resposta.
- Confirmado.
- Talvez.
- Recusado.
- Propôs outro horário.

## Fase 4 - Sincronização com Google Calendar

Implementar conexão com Google Calendar usando calendário externo separado por Núcleo e marca técnica dos eventos criados pelo Projeto Nós.

## Fase 5 - Exportação iCalendar e Apple

Oferecer exportação ou assinatura de calendário para usuários Apple.

Em aplicativos iOS, planejar integração nativa com Apple Calendar mediante permissão explícita.

## Fase 6 - Recorrência

Permitir eventos recorrentes para hábitos, revisões e experiências periódicas.

## Fase 7 - Pós-Evento

Após o evento, sugerir registro opcional:

- memória;
- foto;
- gratidão;
- reconhecimento;
- impacto percebido;
- marco.

## Fase 8 - Sugestão de Horários Segura

Adicionar sugestão de horários usando apenas disponibilidade livre/ocupado e consentimento explícito.

## Fase 9 - Integração com Manifesto

Usar eventos realizados e registrados como evidências cuidadosas da trajetória do Núcleo.

---

# Exemplo Completo

## Núcleo

Família Silva

## Evento

Jantar em família

## Tipo

Hábito Agendado

## Intenção

Criar um momento semanal de presença e conversa sem celulares.

## Data

Toda quarta-feira, 20h.

## Participantes obrigatórios

Ana, João, Clara e Pedro.

## Assuntos

- conversar sobre a semana;
- combinar responsabilidades;
- agradecer algo bom que aconteceu;
- planejar o fim de semana.

## Acordo relacionado

Jantar juntos sem celular uma vez por semana.

## Linguagem de Cuidado esperada

Tempo de Qualidade.

## Confirmações

- Ana: Confirmado.
- João: Confirmado.
- Clara: Talvez.
- Pedro: Aguardando resposta.

## Status do evento

Aguardando confirmações.

## Sincronização externa

Evento criado no calendário interno do Projeto Nós.

Espelhado no Google Calendar dos membros que ativaram sincronização.

Não importou nenhum compromisso privado dos membros.

## Após o evento

O sistema sugere:

> Vocês querem registrar como foi esse jantar?

Possíveis registros:

- memória;
- gratidão;
- reconhecimento;
- impacto percebido;
- marco de continuidade.

---

# Resumo da Decisão

O Calendário do Núcleo será uma camada transversal para organizar momentos importantes do Projeto Nós.

O calendário interno será a fonte oficial.

A sincronização com Google ou Apple deve funcionar apenas como espelho dos eventos criados dentro do Projeto Nós.

Eventos privados dos membros não devem ser importados, exibidos ou compartilhados.

Cada evento deve possuir participantes, confirmação de presença, intenção, assuntos e vínculo opcional com acordos, experiências, revisões, memórias, marcos e Linguagens de Cuidado.

A regra principal será:

> O Projeto Nós ajuda o Núcleo a marcar momentos importantes, sem invadir calendários privados e sem transformar agenda em controle.

---

# Visão de Longo Prazo

O Calendário do Núcleo pode se tornar uma das principais pontes entre intenção e prática.

Ele transforma acordos, experiências, revisões, celebrações e conversas em momentos reais no tempo.

Quando bem desenhado, o calendário não é uma ferramenta de cobrança.

Ele é um lembrete cuidadoso de presença.

Ao sincronizar apenas eventos do Projeto Nós e proteger totalmente os compromissos privados dos membros, essa melhoria fortalece a utilidade diária da plataforma sem quebrar sua promessa de confiança, intimidade e respeito.
