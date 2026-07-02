# Projeto Nós - Estados Vazios, Erros e Carregamento (Versão 2.6)

## Status

Documento de especificação de estados de interface.

## Relação com as versões anteriores

- v2.2 descreve fluxos e estados de erro.
- v2.4 descreve estados globais e estados vazios por entidade.
- v2.6 consolida todos os estados em um catálogo único para implementação.

## Objetivo

Centralizar todos os estados de interface (vazios, carregamento, erro) para garantir consistência, alinhamento com o tom do projeto e facilitar a implementação.

---

# 1. Regra-Mãe dos Estados

Todo estado deve:

1. Ser humano e acolhedor, nunca técnico ou frio.
2. Orientar o usuário para a próxima ação, se possível.
3. Evitar linguagem de culpa ou erro.
4. Preservar o tom de cuidado do Projeto Nós.

---

# 2. Estados de Carregamento

## 2.1 Carregamento Geral

### Quando usar

- Tela inicial após login ou troca de Núcleo.
- Carregamento de listas longas (acordos, memórias).
- Processamento de ações sensíveis (envio de convite, aprovação).

### Mensagens recomendadas

- "Estamos preparando o seu espaço de cuidado..."
- "Carregando memórias e acordos..."
- "Processando sua ação com calma..."

### Elementos visuais

- Ícone da árvore em animação suave (não distraente).
- Texto curto e positivo.

---

## 2.2 Carregamento por Tela/Eixo

| Tela/Eixo | Mensagem de Carregamento                 |
| --------- | ---------------------------------------- |
| Início    | "Carregando o seu Núcleo..."             |
| Acordos   | "Preparando seus acordos..."             |
| Memórias  | "Traçando sua história de cuidado..."    |
| Conexões  | "Conectando seus vínculos..."            |
| Perfil    | "Carregando seu perfil afetivo..."       |
| Manifesto | "Preparando a essência do seu Núcleo..." |

---

# 3. Estados Vazios

## 3.1 Estados Vazios de Contexto Geral

### Sem Núcleo (Autenticado, Sem Núcleo Ativo)

**Quando usar**: Tela inicial após login, quando o usuário não tem nenhum Núcleo ou não selecionou nenhum.
**Mensagem**: "Crie ou entre em um Núcleo para começar a cultivar seus laços."
**Ação recomendada**: Botão "Criar Núcleo" e link "Entrar com convite".

---

## 3.2 Estados Vazios por Tela/Eixo

| Tela/Eixo                      | Estado Vazio                            | Mensagem                                                                                            | Ação Recomendada                      |
| ------------------------------ | --------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Início (sem gratidão)          | Sem gratidão recente                    | "Ainda não há registros de gratidão por aqui. Um pequeno obrigado pode começar essa memória."       | Botão "Agradecer"                     |
| Início (sem próximos momentos) | Sem eventos futuros                     | "Nada marcado por enquanto. Que tal criar um momento simples para vocês?"                           | Botão "Criar evento"                  |
| Acordos                        | Sem acordos                             | "Comece por uma necessidade simples. Um acordo nasce melhor quando nasce de uma conversa."          | Botão "Novo acordo"                   |
| Memórias                       | Sem memórias                            | "Ainda não há memórias por aqui. Quando algo bonito acontecer, vocês podem guardar juntos."         | Botão "Registrar momento"             |
| Gratidões (seção)              | Sem gratidões                           | "Um pequeno obrigado pode ser o primeiro registro positivo deste Núcleo."                           | Botão "Enviar gratidão"               |
| Calendário                     | Sem eventos                             | "Nada marcado por enquanto. Vocês podem criar um momento quando fizer sentido."                     | Botão "Adicionar evento"              |
| Perfil Afetivo (próprio)       | Sem perfil completo                     | "Conte um pouco sobre você para quem te ama cuidar melhor."                                         | Botão "Completar perfil"              |
| Aprovações                     | Sem aprovações pendentes                | "Nada esperando seu sim agora."                                                                     | Nenhuma (ou link para "Criar acordo") |
| Manifesto                      | Manifesto inexistente                   | "Quando seu Núcleo estiver pronto, vocês poderão gerar um Manifesto que represente a sua essência." | Texto informativo, sem ação inicial   |
| Conexões                       | Sem vínculos (apenas usuário no Núcleo) | "Convide quem faz parte dessa história para começar a cultivar vínculos."                           | Botão "Convidar membro"               |

---

# 4. Estados de Erro e Recuperação

## 4.1 Erros de Convite

| Tipo de Erro                   | Mensagem                                                                                            | Ação Recomendada                                        |
| ------------------------------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Convite expirado               | "Esse convite não está mais disponível. Peça um novo código para quem cuida desse Núcleo com você." | Botão "Voltar"                                          |
| Convite inválido/código errado | "Esse código não corresponde a nenhum convite ativo. Verifique com quem te convidou."               | Campo para re-inserir código + botão "Tentar novamente" |
| Convite já aceito              | "Você já aceitou esse convite! Vamos para o seu Núcleo?"                                            | Botão "Ir para o Núcleo"                                |

---

## 4.2 Erros de Permissão

| Tipo de Erro            | Mensagem                                                       | Ação Recomendada  |
| ----------------------- | -------------------------------------------------------------- | ----------------- |
| Sem permissão de acesso | "Você não tem acesso a esse conteúdo neste Núcleo."            | Botão "Voltar"    |
| Somente leitura         | "Você pode ver esse conteúdo, mas não pode editar ou remover." | Texto informativo |

---

## 4.3 Erros de Rede e Sincronização

| Tipo de Erro              | Mensagem                                                                                  | Ação Recomendada                                                       |
| ------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Offline                   | "Você está sem conexão agora. Vamos guardar suas alterações e sincronizar quando voltar." | Ícone offline + texto informativo                                      |
| Sincronizando             | "Estamos sincronizando suas alterações com calma..."                                      | Animação de sincronização                                              |
| Conflito de sincronização | "Houve uma divergência nas alterações. Vamos revisar juntos?"                             | Opção "Ver alterações" + "Usar minha versão" + "Usar versão do Núcleo" |
| Sessão expirada           | "Sua sessão expirou por segurança. Vamos entrar novamente?"                               | Botão "Entrar novamente"                                               |

---

## 4.4 Erros de Validação e Formulários

| Tipo de Erro            | Mensagem                                                          |
| ----------------------- | ----------------------------------------------------------------- |
| Campo obrigatório vazio | "Esse campo é importante para cuidarmos bem. Preencha com calma." |
| E-mail inválido         | "Esse e-mail não parece válido. Verifique com atenção."           |
| Senha fraca             | "Escolha uma senha que seja segura para você, sem pressa."        |
| Erro ao criar conta     | "Houve um pequeno problema. Vamos tentar novamente?"              |
| Erro ao salvar          | "Não conseguimos salvar essa alteração. Vamos tentar de novo?"    |

---

## 4.5 Erros Específicos de Fluxo

| Tipo de Erro            | Mensagem                                                             | Ação Recomendada            |
| ----------------------- | -------------------------------------------------------------------- | --------------------------- |
| Aprovação expirada      | "Essa proposta ficou antiga. Vocês podem criar uma nova, com calma." | Botão "Criar nova proposta" |
| Evento removido         | "Esse momento foi removido do calendário do Núcleo."                 | Botão "Voltar"              |
| Conteúdo não encontrado | "Esse conteúdo não está mais disponível. Vamos voltar?"              | Botão "Voltar"              |

---

# 5. Estados Globais (herdados da v2.4)

## 5.1 Autenticação

| Estado               | Descrição                                 |
| -------------------- | ----------------------------------------- |
| deslogado            | Usuário não autenticado                   |
| criandoConta         | Processo de criação de conta em andamento |
| autenticadoSemNucleo | Autenticado, mas sem Núcleo selecionado   |
| autenticadoComNucleo | Autenticado e com Núcleo ativo            |
| sessaoExpirada       | Sessão expirou, precisa reautenticar      |

---

## 5.2 Núcleo Ativo

| Estado          | Descrição                   |
| --------------- | --------------------------- |
| carregando      | Carregando dados do Núcleo  |
| selecionado     | Núcleo ativo selecionado    |
| semNucleo       | Nenhum Núcleo selecionado   |
| convitePendente | Convite de entrada pendente |
| erroAcesso      | Erro ao acessar o Núcleo    |

---

## 5.3 Sincronização

| Estado        | Descrição                       |
| ------------- | ------------------------------- |
| online        | Conectado e sincronizado        |
| offline       | Sem conexão de rede             |
| sincronizando | Sincronização em andamento      |
| conflito      | Conflito de dados detectado     |
| sincronizado  | Dados sincronizados com sucesso |

---

## 5.4 Permissão

| Estado           | Descrição               |
| ---------------- | ----------------------- |
| permitido        | Acesso permitido        |
| somenteLeitura   | Acesso somente leitura  |
| aguardandoAceite | Aguardando aprovação    |
| semPermissao     | Sem permissão de acesso |

---

# 6. Princípios para Implementação

1. **Consistência**: Usar sempre o mesmo estado para a mesma situação em todas as telas.
2. **Tom Acolhedor**: Evitar palavras como "erro", "falha", "problema" — preferir frases como "houve um pequeno problema".
3. **Ação Claro**: Sempre que possível, oferecer uma ação para recuperar ou continuar.
4. **Visual Leve**: Não usar cores vibrantes de alerta excessivamente — preferir tons suaves.
5. **Histórico**: Para erros graves, registrar log para debug, mas não exibir detalhes técnicos ao usuário.
