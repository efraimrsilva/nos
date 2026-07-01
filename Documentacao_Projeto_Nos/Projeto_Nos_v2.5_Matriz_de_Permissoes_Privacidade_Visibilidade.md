# Projeto Nós - Matriz de Permissões, Privacidade e Visibilidade (Versão 2.5)

## Status

Documento de especificação de permissões e privacidade.

## Relação com as versões anteriores

- v1.1 descreve visão e regras de negócio.
- v2.4 descreve modelo funcional, dados, estados e regras.
- v2.5 descreve matriz de permissões, privacidade e visibilidade para implementação.

## Objetivo

Definir claramente quem pode ver, criar, editar e excluir cada entidade do sistema, alinhado com a filosofia do Projeto Nós.

---

# 1. Regra-Mãe de Permissões

Todo acesso a dados afetivos deve ser contextualizado por `nucleoId` ou `usuarioId`.

Nenhuma entidade sensível deve ser acessível fora de seu contexto de privacidade.

---

# 2. Papéis dos Membros do Núcleo

| Papel               | Descrição                                                                 |
|---------------------|---------------------------------------------------------------------------|
| Criador             | Membro que criou o Núcleo                                                |
| Administrador       | Membro com permissões administrativas (pode ser múltiplo)                |
| Membro              | Membro regular do Núcleo                                                 |
| Convidado Pendente  | Usuário que recebeu convite mas ainda não aceitou                        |

---

# 3. Matriz de Permissões por Entidade

## 3.1 Acordo

| Ação                  | Criador | Administrador | Membro | Convidado Pendente | Regras Adicionais |
|-----------------------|---------|---------------|--------|--------------------|-------------------|
| Ver                   | ✅       | ✅             | ✅      | ❌                  | Todos os membros do Núcleo podem ver acordos ativos. |
| Criar Proposta        | ✅       | ✅             | ✅      | ❌                  | Qualquer membro pode propor um novo acordo. |
| Editar Proposta       | ✅       | ✅             | ✅ (somente próprio) | ❌ | Apenas o autor da proposta pode editá-la antes da aprovação. |
| Editar Acordo Ativo   | ✅       | ✅             | ❌      | ❌                  | Requer nova aprovação dos participantes. |
| Excluir               | ✅       | ✅             | ❌      | ❌                  | Requer consenso dos participantes. |
| Aprovar/Recusar       | ✅       | ✅             | ✅ (se for participante) | ❌ | Apenas participantes do acordo podem votar. |

## 3.2 Memória

| Ação                  | Criador | Administrador | Membro | Convidado Pendente | Regras Adicionais |
|-----------------------|---------|---------------|--------|--------------------|-------------------|
| Ver                   | ✅       | ✅             | ✅      | ❌                  | Depende da visibilidade configurada na memória. |
| Criar                 | ✅       | ✅             | ✅      | ❌                  | Qualquer membro pode criar memórias. |
| Editar                | ✅       | ✅             | ✅ (somente próprio) | ❌ | Apenas o autor da memória pode editá-la. |
| Excluir               | ✅       | ✅             | ✅ (somente próprio) | ❌ | Apenas o autor da memória pode excluí-la, a menos que haja regras do Núcleo. |

## 3.3 Gratidão

| Ação                  | Criador | Administrador | Membro | Convidado Pendente | Regras Adicionais |
|-----------------------|---------|---------------|--------|--------------------|-------------------|
| Ver                   | ✅       | ✅             | ✅      | ❌                  | Depende da visibilidade configurada na gratidão. |
| Criar                 | ✅       | ✅             | ✅      | ❌                  | Qualquer membro pode enviar gratidão a outro(s) membro(s). |
| Editar                | ❌       | ❌             | ❌      | ❌                  | Gratidão não pode ser editada após envio. |
| Excluir               | ✅       | ✅             | ✅ (somente próprio) | ❌ | Apenas o autor da gratidão pode excluí-la. |

## 3.4 Evento de Calendário

| Ação                  | Criador | Administrador | Membro | Convidado Pendente | Regras Adicionais |
|-----------------------|---------|---------------|--------|--------------------|-------------------|
| Ver                   | ✅       | ✅             | ✅      | ❌                  | Todos os membros do Núcleo podem ver eventos. |
| Criar                 | ✅       | ✅             | ✅      | ❌                  | Qualquer membro pode criar eventos. |
| Editar                | ✅       | ✅             | ✅ (somente próprio) | ❌ | Apenas o autor do evento pode editá-lo, a menos que seja evento do Núcleo. |
| Excluir               | ✅       | ✅             | ✅ (somente próprio) | ❌ | Apenas o autor do evento pode excluí-lo. |
| Confirmar Presença    | ✅       | ✅             | ✅      | ❌                  | Apenas participantes do evento podem confirmar. |

## 3.5 Convite

| Ação                  | Criador | Administrador | Membro | Convidado Pendente | Regras Adicionais |
|-----------------------|---------|---------------|--------|--------------------|-------------------|
| Ver (convites enviados) | ✅     | ✅             | ❌      | ❌                  | Apenas criador/administradores podem ver convites enviados. |
| Criar                 | ✅       | ✅             | ❌      | ❌                  | Apenas criador/administradores podem convidar novos membros. |
| Revogar               | ✅       | ✅             | ❌      | ❌                  | Apenas criador/administradores podem revogar convites. |
| Aceitar/Recusar       | ❌       | ❌             | ❌      | ✅                  | Apenas o destinatário do convite pode aceitar/recusar. |

## 3.6 Manifesto

| Ação                  | Criador | Administrador | Membro | Convidado Pendente | Regras Adicionais |
|-----------------------|---------|---------------|--------|--------------------|-------------------|
| Ver                   | ✅       | ✅             | ✅      | ❌                  | Todos os membros do Núcleo podem ver o Manifesto confirmado. |
| Gerar                 | ✅       | ✅             | ✅      | ❌                  | Qualquer membro pode solicitar geração de Manifesto. |
| Editar (em revisão)   | ✅       | ✅             | ✅      | ❌                  | Todos os membros podem colaborar na revisão do Manifesto. |
| Confirmar             | ✅       | ✅             | ✅      | ❌                  | Requer assinatura/aceite de todos os membros. |
| Arquivar              | ✅       | ✅             | ❌      | ❌                  | Apenas criador/administradores podem arquivar Manifestos antigos. |

## 3.7 Perfil Afetivo

| Ação                  | Criador | Administrador | Membro | Convidado Pendente | Regras Adicionais |
|-----------------------|---------|---------------|--------|--------------------|-------------------|
| Ver (próprio perfil)  | ✅       | ✅             | ✅      | ❌                  | Todo usuário pode ver seu próprio perfil. |
| Ver (perfil de outro membro) | ✅ | ✅ | ✅ | ❌ | Depende da configuração de visibilidade do perfil do outro usuário. |
| Criar/Editar          | ✅       | ✅             | ✅ (somente próprio) | ❌ | Apenas o usuário pode editar seu próprio perfil afetivo. |
| Excluir               | ✅       | ✅             | ✅ (somente próprio) | ❌ | Apenas o usuário pode excluir seu próprio perfil afetivo. |

## 3.8 Conversa Guiada

| Ação                  | Criador | Administrador | Membro | Convidado Pendente | Regras Adicionais |
|-----------------------|---------|---------------|--------|--------------------|-------------------|
| Ver                   | ✅ (se for participante) | ✅ (se for participante) | ✅ (se for participante) | ❌ | Apenas participantes da conversa podem acessá-la. |
| Criar                 | ✅       | ✅             | ✅      | ❌                  | Qualquer membro pode iniciar uma conversa guiada com outro(s) membro(s). |
| Editar (rascunhos)    | ✅       | ✅             | ✅ (somente próprio) | ❌ | Apenas o autor pode editar seus próprios rascunhos de preparação. |
| Arquivar              | ✅       | ✅             | ✅ (se for participante) | ❌ | Participantes podem arquivar conversas concluídas. |

---

# 4. Níveis de Visibilidade

## 4.1 Visibilidade de Memórias e Gratidões

| Nível de Visibilidade | Descrição                                                                 |
|-----------------------|---------------------------------------------------------------------------|
| `publicoNoNucleo`     | Visível para todos os membros do Núcleo (padrão para gratidões).          |
| `restrito`            | Visível apenas para participantes específicos (padrão para conversas guiadas). |
| `privado`             | Visível apenas para o autor (padrão para rascunhos).                     |

## 4.2 Visibilidade do Perfil Afetivo

| Nível de Visibilidade | Descrição                                                                 |
|-----------------------|---------------------------------------------------------------------------|
| `todosOsNucleos`      | Visível para todos os membros de todos os Núcleos que o usuário participa. |
| `somenteEsteNucleo`   | Visível apenas para membros do Núcleo selecionado.                        |
| `privado`             | Visível apenas para o próprio usuário.                                   |

---

# 5. Regras Gerais de Privacidade

1. **Dados Isolados por Núcleo**: Todos os dados de um Núcleo são completamente isolados de outros Núcleos.
2. **Privacidade Padrão**: Conteúdos sensíveis são privados ou restritos por padrão.
3. **Controle do Usuário**: Cada usuário tem controle total sobre seu perfil afetivo e suas criações (memórias, gratidões).
4. **Não há Hierarquia Afetiva**: Permissões administrativas não dão acesso a dados pessoais ou íntimos de outros membros.
5. **Histórico Preservado**: Ações importantes são registradas para auditoria.

---

# 6. Implementação Recomendada

## 6.1 Estrutura de Dados para Permissões

Adicionar campos em entidades relevantes:
- `visibilidade`: enum com valores como `publicoNoNucleo`, `restrito`, `privado`
- `autorId`: ID do usuário que criou a entidade
- `participantes`: array de IDs de membros participantes (para restrito)

## 6.2 Funções de Verificação de Permissão

Implementar funções como:
- `podeVer(usuarioId, entidade)`: verifica se o usuário pode ver a entidade
- `podeEditar(usuarioId, entidade)`: verifica se o usuário pode editar a entidade
- `podeExcluir(usuarioId, entidade)`: verifica se o usuário pode excluir a entidade
- `podeCriar(usuarioId, nucleoId, tipoEntidade)`: verifica se o usuário pode criar a entidade no Núcleo
