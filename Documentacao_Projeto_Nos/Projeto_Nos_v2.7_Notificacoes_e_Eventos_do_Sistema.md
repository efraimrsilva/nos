# Projeto Nós - Notificações e Eventos do Sistema (Versão 2.7)

## Categoria
**2.x - Interface e Implementação**

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

## Status

Documento de especificação completa de notificações e eventos de domínio.

## Relação com as versões anteriores

- v2.4 descreve modelo funcional, dados, estados e regras.
- v2.5 descreve matriz de permissões, privacidade e visibilidade.
- v2.7 descreve notificações, seus gatilhos, destinatários, textos, deep links, prioridade, configurações e anti-regras.

## Objetivo

Especificar de forma completa o sistema de notificações do Projeto Nós, definindo todos os detalhes necessários para implementação alinhada com a filosofia do projeto.

---

# 1. Princípios Fundamentais das Notificações

1. **Cuidado, não ansiedade**: Notificações devem informar, não cobrar.
2. **Privacidade acima de tudo**: Conteúdo sensível nunca aparece em tela bloqueada.
3. **Controle total do usuário**: O usuário decide quais tipos de notificação receber.
4. **Não insistência**: Nenhuma notificação repetitiva ou cobrança de resposta.
5. **Contexto sempre presente**: Qualquer notificação deve levar diretamente ao conteúdo relevante.

---

# 2. Entidade Notificação (Atualizada)

## Campos Recomendados (Atualizados)

| Campo               | Tipo         | Obrigatório | Descrição                                                                 |
|---------------------|--------------|-------------|---------------------------------------------------------------------------|
| `id`                | UUID/string  | ✅           | Identificador único da notificação                                        |
| `usuarioId`         | UUID/string  | ✅           | ID do usuário destinatário da notificação                                 |
| `nucleoId`          | UUID/string  | ❌           | ID do Núcleo relacionado (se aplicável)                                   |
| `tipo`              | enum         | ✅           | Tipo da notificação (veja seção 3)                                        |
| `titulo`            | string       | ✅           | Título curto da notificação                                               |
| `mensagem`          | string       | ✅           | Texto principal da notificação                                            |
| `entidadeTipo`      | enum         | ❌           | Tipo da entidade relacionada (acordo, gratidao, evento, etc.)             |
| `entidadeId`        | UUID/string  | ❌           | ID da entidade relacionada                                                |
| `deepLink`          | string       | ❌           | Link profundo para navegação direta ao conteúdo                           |
| `prioridade`        | enum         | ✅           | Prioridade da notificação (baixa, normal, alta)                           |
| `lida`              | boolean      | ✅           | Se a notificação foi lida pelo usuário                                    |
| `createdAt`         | datetime     | ✅           | Data e hora de criação da notificação                                     |
| `expiresAt`         | datetime     | ❌           | Data e hora de expiração (notificações temporárias)                       |

---

# 3. Tipos de Notificação, Gatilhos e Detalhes

## 3.1 Gratidão Recebida (`gratidaoRecebida`)

| Atributo            | Valor                                                                     |
|---------------------|---------------------------------------------------------------------------|
| **Gatilho**         | `GratidaoEnviada`                                                         |
| **Destinatários**   | Todos os destinatários da gratidão                                       |
| **Texto (Título)**  | "Você recebeu uma gratidão!"                                              |
| **Texto (Mensagem)**| "{nomeAutor} agradeceu você" ou "{nomeAutor} agradeceu vocês" (plural)    |
| **Deep Link**       | `/nucleos/{nucleoId}/gratidoes/{gratidaoId}`                             |
| **Prioridade**      | alta                                                                      |
| **Quando Não Notificar** | Se o usuário desativou notificações de gratidão; se a gratidão tem visibilidade `privado` e o usuário não é o destinatário |
| **Regras Adicionais** | Não exibir nome do autor ou conteúdo da gratidão em tela bloqueada        |

## 3.2 Acordo Proposto (`acordoProposto`)

| Atributo            | Valor                                                                     |
|---------------------|---------------------------------------------------------------------------|
| **Gatilho**         | `AcordoProposto`                                                         |
| **Destinatários**   | Todos os participantes do acordo (exceto o autor)                         |
| **Texto (Título)**  | "Nova proposta de acordo"                                                 |
| **Texto (Mensagem)**| "{nomeAutor} propôs \"{tituloAcordo}\" para vocês"                        |
| **Deep Link**       | `/nucleos/{nucleoId}/acordos/{acordoId}`                                 |
| **Prioridade**      | alta                                                                      |
| **Quando Não Notificar** | Se o usuário desativou notificações de acordos                            |

## 3.3 Acordo Aceito (`acordoAceito`)

| Atributo            | Valor                                                                     |
|---------------------|---------------------------------------------------------------------------|
| **Gatilho**         | `AcordoAceito`                                                           |
| **Destinatários**   | Autor do acordo e demais participantes                                    |
| **Texto (Título)**  | "Acordo aceito!"                                                          |
| **Texto (Mensagem)**| "{nomeUsuario} aceitou o acordo \"{tituloAcordo}\""                       |
| **Deep Link**       | `/nucleos/{nucleoId}/acordos/{acordoId}`                                 |
| **Prioridade**      | normal                                                                    |
| **Quando Não Notificar** | Se o usuário desativou notificações de acordos                            |

## 3.4 Acordo Recusado (`acordoRecusado`)

| Atributo            | Valor                                                                     |
|---------------------|---------------------------------------------------------------------------|
| **Gatilho**         | `AcordoRecusado`                                                         |
| **Destinatários**   | Autor do acordo e demais participantes                                    |
| **Texto (Título)**  | "Acordo recusado"                                                         |
| **Texto (Mensagem)**| "{nomeUsuario} recusou o acordo \"{tituloAcordo}\""                       |
| **Deep Link**       | `/nucleos/{nucleoId}/acordos/{acordoId}`                                 |
| **Prioridade**      | normal                                                                    |
| **Quando Não Notificar** | Se o usuário desativou notificações de acordos                            |

## 3.5 Acordo Registrado (`acordoRegistrado`)

| Atributo            | Valor                                                                     |
|---------------------|---------------------------------------------------------------------------|
| **Gatilho**         | `AcordoRegistrado`                                                       |
| **Destinatários**   | Todos os participantes do acordo                                          |
| **Texto (Título)**  | "Acordo cumprido!"                                                        |
| **Texto (Mensagem)**| "\"{tituloAcordo}\" foi registrado hoje"                                  |
| **Deep Link**       | `/nucleos/{nucleoId}/acordos/{acordoId}`                                 |
| **Prioridade**      | normal                                                                    |
| **Quando Não Notificar** | Se o usuário desativou notificações de acordos                            |

## 3.6 Aprovação Pendente (`aprovacaoPendente`)

| Atributo            | Valor                                                                     |
|---------------------|---------------------------------------------------------------------------|
| **Gatilho**         | `AprovacaoCriada`                                                        |
| **Destinatários**   | Todos os destinatários da aprovação                                      |
| **Texto (Título)**  | "Aguardando seu voto"                                                     |
| **Texto (Mensagem)**| "{nomeAutor} pediu sua aprovação para {tipoAprovacao}"                    |
| **Deep Link**       | `/nucleos/{nucleoId}/aprovacoes/{aprovacaoId}`                           |
| **Prioridade**      | alta                                                                      |
| **Quando Não Notificar** | Se o usuário desativou notificações de aprovações; se o usuário já respondeu |

## 3.7 Convite Recebido (`conviteRecebido`)

| Atributo            | Valor                                                                     |
|---------------------|---------------------------------------------------------------------------|
| **Gatilho**         | `ConviteGerado`                                                          |
| **Destinatários**   | Destinatário do convite                                                   |
| **Texto (Título)**  | "Convite recebido!"                                                       |
| **Texto (Mensagem)**| "{nomeAutor} convidou você para o Núcleo \"{nomeNucleo}\""                |
| **Deep Link**       | `/convites/{conviteId}`                                                  |
| **Prioridade**      | alta                                                                      |
| **Quando Não Notificar** | Se o usuário desativou notificações de convites; se o convite já expirou ou foi revogado |

## 3.8 Membro Entrou (`membroEntrou`)

| Atributo            | Valor                                                                     |
|---------------------|---------------------------------------------------------------------------|
| **Gatilho**         | `ConviteAceito`                                                          |
| **Destinatários**   | Todos os membros do Núcleo (exceto o novo membro)                         |
| **Texto (Título)**  | "Novo membro!"                                                            |
| **Texto (Mensagem)**| "{nomeNovoMembro} entrou no Núcleo \"{nomeNucleo}\""                      |
| **Deep Link**       | `/nucleos/{nucleoId}/membros`                                             |
| **Prioridade**      | normal                                                                    |
| **Quando Não Notificar** | Se o usuário desativou notificações de novos membros                      |

## 3.9 Marco Alcançado (`marcoAlcancado`)

| Atributo            | Valor                                                                     |
|---------------------|---------------------------------------------------------------------------|
| **Gatilho**         | `MarcoAlcancado`                                                         |
| **Destinatários**   | Todos os membros do Núcleo                                                |
| **Texto (Título)**  | "Marco alcançado!"                                                        |
| **Texto (Mensagem)**| "Vocês completaram {descricaoMarco}"                                      |
| **Deep Link**       | `/nucleos/{nucleoId}/marcos/{marcoId}`                                    |
| **Prioridade**      | alta                                                                      |
| **Quando Não Notificar** | Se o usuário desativou notificações de marcos                             |

## 3.10 Essência Promovida (`essenciaPromovida`)

| Atributo            | Valor                                                                     |
|---------------------|---------------------------------------------------------------------------|
| **Gatilho**         | `AcordoPromovidoParaEssencia`                                            |
| **Destinatários**   | Todos os membros do Núcleo                                                |
| **Texto (Título)**  | "Essência adicionada!"                                                    |
| **Texto (Mensagem)**| "\"{tituloAcordo}\" virou parte da Essência de vocês"                     |
| **Deep Link**       | `/nucleos/{nucleoId}/acordos/{acordoId}`                                 |
| **Prioridade**      | alta                                                                      |
| **Quando Não Notificar** | Se o usuário desativou notificações de essências                          |

## 3.11 Lembrete de Agenda (`lembreteAgenda`)

| Atributo            | Valor                                                                     |
|---------------------|---------------------------------------------------------------------------|
| **Gatilho**         | Agendamento (temporizado, 1h antes do evento)                            |
| **Destinatários**   | Todos os participantes do evento                                          |
| **Texto (Título)**  | "Evento próximo"                                                          |
| **Texto (Mensagem)**| "\"{tituloEvento}\" hoje às {horaEvento}"                                 |
| **Deep Link**       | `/nucleos/{nucleoId}/eventos/{eventoId}`                                 |
| **Prioridade**      | alta                                                                      |
| **Quando Não Notificar** | Se o usuário desativou notificações de agenda; se o evento foi cancelado; se o usuário recusou o evento |

## 3.12 Evento Criado (`eventoCriado`)

| Atributo            | Valor                                                                     |
|---------------------|---------------------------------------------------------------------------|
| **Gatilho**         | `EventoCriado`                                                           |
| **Destinatários**   | Todos os participantes do evento (exceto o autor)                         |
| **Texto (Título)**  | "Novo evento"                                                             |
| **Texto (Mensagem)**| "{nomeAutor} criou \"{tituloEvento}\" para {dataEvento}"                   |
| **Deep Link**       | `/nucleos/{nucleoId}/eventos/{eventoId}`                                 |
| **Prioridade**      | normal                                                                    |
| **Quando Não Notificar** | Se o usuário desativou notificações de eventos                            |

## 3.13 Evento Confirmado (`eventoConfirmado`)

| Atributo            | Valor                                                                     |
|---------------------|---------------------------------------------------------------------------|
| **Gatilho**         | `EventoConfirmado`                                                       |
| **Destinatários**   | Autor do evento e demais participantes                                    |
| **Texto (Título)**  | "Presença confirmada"                                                     |
| **Texto (Mensagem)**| "{nomeUsuario} confirmou presença em \"{tituloEvento}\""                  |
| **Deep Link**       | `/nucleos/{nucleoId}/eventos/{eventoId}`                                 |
| **Prioridade**      | normal                                                                    |
| **Quando Não Notificar** | Se o usuário desativou notificações de eventos                            |

## 3.14 Resposta no Diálogo (`respostaDialogo`)

| Atributo            | Valor                                                                     |
|---------------------|---------------------------------------------------------------------------|
| **Gatilho**         | `CartaoIntencaoEnviado` ou `CompreensaoConfirmada`                       |
| **Destinatários**   | Demais participantes da conversa guiada                                   |
| **Texto (Título)**  | "Atualização no espaço seguro"                                            |
| **Texto (Mensagem)**| "{nomeUsuario} respondeu no espaço de vocês"                              |
| **Deep Link**       | `/nucleos/{nucleoId}/conversas/{conversaId}`                             |
| **Prioridade**      | alta                                                                      |
| **Quando Não Notificar** | Se o usuário desativou notificações de diálogos; não exibir conteúdo sensível em tela bloqueada |

## 3.15 Memória Criada (`memoriaCriada`)

| Atributo            | Valor                                                                     |
|---------------------|---------------------------------------------------------------------------|
| **Gatilho**         | `MemoriaCriada`                                                          |
| **Destinatários**   | Todos os membros do Núcleo (se memória tem visibilidade `publicoNoNucleo`) |
| **Texto (Título)**  | "Nova memória!"                                                           |
| **Texto (Mensagem)**| "{nomeAutor} adicionou uma nova memória"                                  |
| **Deep Link**       | `/nucleos/{nucleoId}/memorias/{memoriaId}`                               |
| **Prioridade**      | baixa                                                                     |
| **Quando Não Notificar** | Se o usuário desativou notificações de memórias; se memória tem visibilidade `privado` ou `restrito` e usuário não está entre os participantes |

## 3.16 Manifesto Gerado (`manifestoGerado`)

| Atributo            | Valor                                                                     |
|---------------------|---------------------------------------------------------------------------|
| **Gatilho**         | `ManifestoGerado`                                                        |
| **Destinatários**   | Todos os membros do Núcleo                                                |
| **Texto (Título)**  | "Manifesto gerado!"                                                       |
| **Texto (Mensagem)**| "O Manifesto do seu Núcleo está pronto para revisão"                      |
| **Deep Link**       | `/nucleos/{nucleoId}/manifesto`                                          |
| **Prioridade**      | normal                                                                    |
| **Quando Não Notificar** | Se o usuário desativou notificações de manifesto                          |

## 3.17 Manifesto Confirmado (`manifestoConfirmado`)

| Atributo            | Valor                                                                     |
|---------------------|---------------------------------------------------------------------------|
| **Gatilho**         | `ManifestoConfirmado`                                                    |
| **Destinatários**   | Todos os membros do Núcleo                                                |
| **Texto (Título)**  | "Manifesto confirmado!"                                                   |
| **Texto (Mensagem)**| "O Manifesto do seu Núcleo foi confirmado por todos"                      |
| **Deep Link**       | `/nucleos/{nucleoId}/manifesto`                                          |
| **Prioridade**      | alta                                                                      |
| **Quando Não Notificar** | Se o usuário desativou notificações de manifesto                          |

---

# 4. Prioridades das Notificações

| Prioridade | Descrição                                                                 | Exemplos                                 |
|------------|---------------------------------------------------------------------------|------------------------------------------|
| `alta`     | Requer atenção do usuário em tempo útil                                   | Gratidão recebida, aprovação pendente, lembrete de agenda |
| `normal`   | Informação importante, mas não urgente                                    | Acordo aceito/recusado, evento criado, manifesto gerado |
| `baixa`    | Informação adicional, sem pressão de tempo                                | Memória criada, marco alcançado (opcional) |

---

# 5. Configurações de Notificações do Usuário

## 5.1 Estrutura de Preferências

Cada usuário pode configurar individualmente quais tipos de notificação receber, diferenciando entre **notificações push** (dispositivo) e **notificações in-app** (dentro do app).

| Tipo de Notificação       | Padrão Push | Padrão In-App |
|----------------------------|-------------|---------------|
| Gratidão Recebida          | ✅          | ✅            |
| Acordo Proposto            | ✅          | ✅            |
| Acordo Aceito              | ✅          | ✅            |
| Acordo Recusado            | ✅          | ✅            |
| Acordo Registrado          | ✅          | ✅            |
| Aprovação Pendente         | ✅          | ✅            |
| Convite Recebido           | ✅          | ✅            |
| Membro Entrou              | ✅          | ✅            |
| Marco Alcançado            | ✅          | ✅            |
| Essência Promovida         | ✅          | ✅            |
| Lembrete de Agenda         | ✅          | ✅            |
| Evento Criado              | ✅          | ✅            |
| Evento Confirmado          | ✅          | ✅            |
| Resposta no Diálogo        | ✅          | ✅            |
| Memória Criada             | ❌          | ✅            |
| Manifesto Gerado           | ✅          | ✅            |
| Manifesto Confirmado       | ✅          | ✅            |

## 5.2 Tela de Configurações

A tela de configurações de notificações deve:
- Ser acessível via o menu do perfil do usuário
- Agrupar tipos de notificação por categoria (Acordos, Agenda, Gratidões, etc.)
- Permitir toggle separado para push e in-app
- Ter uma opção "Desativar todas as notificações"
- Ser clara e seguir o tom de cuidado do projeto

---

# 6. Quando Não Notificar (Anti-Regras)

1. **Usuário desativou o tipo**: Se o usuário desativou notificações para aquele tipo.
2. **Conteúdo sensível e tela bloqueada**: Não exibir detalhes de gratidões, diálogos ou conteúdos íntimos na tela de bloqueio do dispositivo.
3. **Usuário já interagiu**: Se o usuário já visualizou ou interagiu com o conteúdo (ex: já respondeu uma aprovação).
4. **Entidade não existe mais**: Se a entidade relacionada foi excluída ou cancelada.
5. **Notificação expirada**: Se passou o tempo de validade (ex: lembrete de evento que já aconteceu).
6. **Mesmo usuário**: Não notificar o usuário sobre sua própria ação (ex: não notificar o autor de uma gratidão).
7. **Privacidade violada**: Se a notificação exporia conteúdo que o usuário não tem permissão para ver.
8. **Horário de descanso (opcional/futuro)**: Possibilidade de configurar um horário em que notificações push são silenciadas.

---

# 7. Eventos de Domínio (Atualizados)

Adicionamos eventos que faltavam na v2.4:

- `AprovacaoCriada`
- `AprovacaoRespondida`
- `EventoConfirmado`
- `EventoRealizado`
- `EventoCancelado`

---

# 8. Implementação Recomendada

## 8.1 Arquitetura de Eventos

Recomendamos usar uma arquitetura orientada a eventos:
1. Quando uma ação é executada (ex: gratidão enviada), disparar o evento de domínio correspondente
2. Ouvintes (listeners) processam esses eventos e criam as notificações necessárias
3. As notificações são persistidas no banco de dados
4. Um serviço separado envia as notificações push (usando Firebase Cloud Messaging, OneSignal ou similar)

## 8.2 Banco de Dados

Adicionar tabela/coleção `preferenciasNotificacoes` com:
- `usuarioId` (chave estrangeira)
- `tipoNotificacao`
- `pushAtivo` (boolean)
- `inAppAtivo` (boolean)

## 8.3 Deep Links

Estrutura recomendada para deep links:
- `nosapp://nucleos/{nucleoId}/acordos/{acordoId}`
- `nosapp://nucleos/{nucleoId}/gratidoes/{gratidaoId}`
- `nosapp://nucleos/{nucleoId}/eventos/{eventoId}`
- `nosapp://convites/{conviteId}`

---

# 9. Tom de Voz das Notificações

Todas as notificações devem seguir o tom de cuidado definido na v2.3:
- Calmo e acolhedor
- Sem pressão ou ansiedade
- Sem linguagem de cobrança
- Sem alarmes de "falha"
- Sem emojis excessivos
- Usar nomes dos membros quando for apropriado
- Ser direto e claro


---

# Diagrama de Fluxo da Versao

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': { 'primaryColor': '#fff', 'primaryTextColor': '#fff', 'primaryBorderColor': '#fff', 'lineColor': '#fff', 'secondaryColor': '#fff', 'tertiaryColor': '#fff', 'background': '#000', 'mainBkg': '#333', 'nodeBorder': '#fff', 'clusterBkg': '#333', 'clusterBorder': '#fff', 'titleColor': '#fff', 'edgeLabelBackground': '#333', 'tertiaryBorderColor': '#fff', 'fontFamily': 'arial'}}}%%
graph TD
    A[Evento de Dominio] --> B[Gatilho do Sistema]
    B --> C[Verificar Configuracao do Usuario]
    C -->{Notificacao Ativada?}
    C -->|Nao| D[Ignorar]
    C -->|Sim| E[Dispositivo Bloqueado?]
    E -->|Sim| F[Ocultar Conteudo Sensivel / Mostrar Texto Generico]
    E -->|Nao| G[Exibir Notificacao Completa]
    F & G --> H[Redirecionamento via Deep Link para a Tela Relacionada]
    style A fill:#4F7E2C,stroke:#fff,color:#fff
    style B fill:#6A3FD1,stroke:#fff,color:#fff
    style C fill:#E2A52C,stroke:#fff,color:#fff
    style D fill:#EC6F9E,stroke:#fff,color:#fff
    style E fill:#E2A52C,stroke:#fff,color:#fff
    style F fill:#EC6F9E,stroke:#fff,color:#fff
    style G fill:#4F7E2C,stroke:#fff,color:#fff
    style H fill:#6A3FD1,stroke:#fff,color:#fff
```
