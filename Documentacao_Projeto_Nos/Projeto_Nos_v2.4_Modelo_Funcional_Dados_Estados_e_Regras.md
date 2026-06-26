# Projeto Nós - Modelo Funcional, Dados, Estados e Regras (Versão 2.4)

## Status

Documento de modelagem funcional.

## Relação com as versões anteriores

- v2.1 descreve as telas.
- v2.2 descreve os fluxos.
- v2.3 descreve design system, componentes e tom.
- v2.4 descreve entidades, dados, estados, permissões e regras para implementação.

## Objetivo

Definir um modelo funcional coerente com as interfaces do protótipo e com as documentações 1.1 a 1.9, evitando que a implementação crie estruturas desalinhadas com a filosofia do Projeto Nós.

---

# 1. Regra-Mãe do Modelo

Todo dado afetivo pertence a um Núcleo, a um usuário ou a uma relação específica entre membros.

Nenhuma entidade sensível deve existir solta, sem contexto.

Contextos principais:

- `usuarioId`;
- `nucleoId`;
- `membroId`;
- `vinculoId`;
- `acordoId`;
- `eventoId`;
- `memoriaId`.

---

# 2. Entidades Principais

## 2.1 Usuário

Representa uma pessoa com conta no app.

### Campos recomendados

- `id`;
- `nome`;
- `email`;
- `avatarUrl`;
- `iniciais`;
- `createdAt`;
- `lastLoginAt`;
- `status`;
- `preferenciasNotificacao`;
- `configuracoesPrivacidade`;

### Regras

- usuário pode participar de múltiplos Núcleos;
- usuário controla seu perfil afetivo;
- usuário pode sair de um Núcleo sem apagar automaticamente suas memórias, salvo regras futuras de privacidade.

---

## 2.2 Núcleo

Unidade principal de contexto, privacidade e pertencimento.

### Campos recomendados

- `id`;
- `nome`;
- `tipo`;
- `proposito`;
- `createdBy`;
- `createdAt`;
- `nivel`;
- `estagioArvore`;
- `experienciaAtual`;
- `experienciaMeta`;
- `status`;
- `configuracoesPrivacidade`;
- `manifestoAtualId`;

### Tipos iniciais

- casal;
- família;
- irmãos;
- pais e filhos;
- amigos.

### Regras

- todo acordo, memória, gratidão, evento e Manifesto deve pertencer a um Núcleo;
- Núcleo é privado por padrão;
- entrada acontece por convite ou criação explícita;
- calendário é separado por Núcleo.

---

## 2.3 Membro do Núcleo

Representa a participação de um usuário em um Núcleo.

### Campos recomendados

- `id`;
- `usuarioId`;
- `nucleoId`;
- `papel`;
- `apelidoNoNucleo`;
- `dataEntrada`;
- `status`;
- `permissoes`;
- `visibilidadePerfil`;

### Papéis possíveis

- criador;
- administrador;
- membro;
- convidado pendente.

### Regras

- permissões podem controlar convite, configuração e remoção;
- papel não deve criar hierarquia afetiva;
- membro pendente não acessa dados internos até aceitar.

---

## 2.4 Vínculo

Representa a relação entre o usuário e outra pessoa ou entre duas pessoas no Núcleo.

### Campos recomendados

- `id`;
- `nucleoId`;
- `membroAId`;
- `membroBId`;
- `tipoVinculo`;
- `rotulo`;
- `forcaDoLaco`;
- `ultimaInteracaoAt`;
- `status`;

### Tipos de vínculo

- conhecendo;
- namorada;
- esposa;
- pai;
- mãe;
- irmão;
- amigo;
- primo;
- tio;
- outro.

### Regras

- tipo de vínculo sugere cuidado, não determina comportamento;
- força do laço deve ser interpretada com cuidado;
- vínculo pode alimentar Conexões, Perfil de Membro e Jornada.

---

## 2.5 Perfil Afetivo

Informações que ajudam outras pessoas a cuidar melhor do usuário.

### Campos recomendados

- `id`;
- `usuarioId`;
- `bio`;
- `completudePercentual`;
- `linguagensDeCuidado`;
- `preferenciasMusicais`;
- `filmesSeries`;
- `saboresFavoritos`;
- `hobbies`;
- `fraseComoGostoDeSerCuidado`;
- `visibilidadePadrao`;
- `updatedAt`;

### Regras

- usuário é dono do seu perfil afetivo;
- perfil pode ser visível a todos os Núcleos ou configurável por Núcleo em fase futura;
- completude nunca deve virar obrigação.

---

## 2.6 Desejo

Item da lista de desejos ou ideia de presente.

### Campos recomendados

- `id`;
- `usuarioId`;
- `titulo`;
- `categoria`;
- `precoEstimado`;
- `descricao`;
- `url`;
- `tipo`;
- `visibilidade`;
- `createdAt`;

### Tipos

- produto;
- experiência;
- gesto;
- outro.

### Regras

- preço é opcional;
- lista existe para cuidado, não consumo obrigatório;
- usuário pode ocultar ou remover.

---

## 2.7 Data Importante

Datas afetivas vinculadas a usuário, vínculo ou Núcleo.

### Campos recomendados

- `id`;
- `nucleoId`;
- `usuarioId`;
- `vinculoId`;
- `titulo`;
- `data`;
- `recorrente`;
- `tipo`;
- `visibilidade`;
- `gerarLembrete`;

### Regras

- datas podem gerar eventos ou lembretes;
- lembretes dependem de permissão;
- datas íntimas devem respeitar visibilidade.

---

## 2.8 Acordo

Compromisso construído a partir de necessidade, conversa e consentimento.

### Campos recomendados

- `id`;
- `nucleoId`;
- `titulo`;
- `descricao`;
- `categoria`;
- `status`;
- `frequencia`;
- `ritmo`;
- `impactoEsperado`;
- `linguagemDeCuidado`;
- `createdBy`;
- `createdAt`;
- `revisaoEm`;
- `periodoTesteAte`;
- `participantes`;
- `aprovacoes`;
- `progressoPercentual`;

### Categorias

- hábito;
- experiência;
- essência.

### Status

- rascunho;
- proposta;
- aguardandoAprovacao;
- emTeste;
- ativo;
- emRevisao;
- ajustePendente;
- elegivelEssencia;
- promovidoEssencia;
- encerramentoPendente;
- encerrado.

### Regras

- proposta não é acordo;
- acordo ativo exige aceite dos participantes;
- mudanças estruturais exigem aprovação;
- encerramento deve ser de comum acordo;
- promoção para Essência exige consenso.

---

## 2.9 Registro de Momento

Registro de uma prática, experiência ou evento vivido.

### Campos recomendados

- `id`;
- `nucleoId`;
- `acordoId`;
- `eventoId`;
- `autorId`;
- `humor`;
- `nota`;
- `fotos`;
- `createdAt`;
- `visibilidade`;
- `geraMemoria`;

### Humores

- ótimo;
- bem;
- neutro;
- difícil.

### Regras

- nota e foto são opcionais;
- humor difícil não reduz valor do vínculo;
- registro pode alimentar Memórias, Árvore e Marcos;
- autor pode editar ou remover conforme regra de histórico.

---

## 2.10 Gratidão

Registro positivo enviado a um ou mais membros.

### Campos recomendados

- `id`;
- `nucleoId`;
- `autorId`;
- `destinatarios`;
- `mensagem`;
- `sugestaoUsada`;
- `acordoId`;
- `momentoId`;
- `createdAt`;
- `visibilidade`;
- `reacoes`;

### Regras

- gratidão deve ser voluntária;
- não gera ranking;
- pode virar memória;
- destinatário recebe notificação se permitido.

---

## 2.11 Memória

Item da linha do tempo afetiva do Núcleo.

### Campos recomendados

- `id`;
- `nucleoId`;
- `tipo`;
- `titulo`;
- `texto`;
- `midias`;
- `autorId`;
- `participantes`;
- `entidadeOrigemTipo`;
- `entidadeOrigemId`;
- `createdAt`;
- `visibilidade`;
- `reacoes`;
- `comentarios`;

### Tipos

- gratidão;
- foto;
- marco;
- momento;
- experiência;
- celebração;
- manifesto;
- entradaMembro.

### Regras

- memória é privada por padrão;
- itens sensíveis podem ter visibilidade restrita;
- origem deve ser rastreável;
- comentários devem seguir tom de cuidado.

---

## 2.12 Marco

Evento de evolução saudável do Núcleo.

### Campos recomendados

- `id`;
- `nucleoId`;
- `tipo`;
- `titulo`;
- `descricao`;
- `entidadeRelacionadaTipo`;
- `entidadeRelacionadaId`;
- `createdAt`;
- `celebrado`;
- `memoriaId`;

### Tipos

- início;
- continuidade;
- cuidado;
- revisão;
- impacto;
- essência;
- manifesto;
- jornada.

### Regras

- marco celebra evolução, não desempenho;
- celebração é opcional;
- marco pode alimentar árvore e memórias.

---

## 2.13 Evento de Calendário

Momento planejado no calendário interno do Núcleo.

### Campos recomendados

- `id`;
- `nucleoId`;
- `titulo`;
- `tipo`;
- `intencao`;
- `inicioEm`;
- `fimEm`;
- `recorrencia`;
- `participantesObrigatorios`;
- `participantesOpcionais`;
- `status`;
- `acordoId`;
- `experienciaId`;
- `vinculoId`;
- `privacidade`;
- `sincronizacaoExterna`;

### Tipos

- experiência;
- hábitoAgendado;
- revisão;
- conversaDeCuidado;
- celebração;
- dataImportante;
- livre.

### Status

- rascunho;
- conviteEnviado;
- aguardandoConfirmacoes;
- confirmado;
- remarcacaoSugerida;
- realizado;
- cancelado.

### Regras

- calendário interno é fonte oficial;
- sincronização externa é espelho;
- dados sensíveis não devem ir para Google/Apple sem consentimento;
- pós-evento pode sugerir registro de momento.

---

## 2.14 Convite

Convite para entrada no Núcleo ou participação em experiência.

### Campos recomendados

- `id`;
- `nucleoId`;
- `tipo`;
- `codigo`;
- `link`;
- `qrPayload`;
- `createdBy`;
- `destinatarioEmail`;
- `destinatarioUsuarioId`;
- `status`;
- `expiresAt`;
- `createdAt`;

### Tipos

- entradaNucleo;
- experiencia;
- evento;

### Status

- ativo;
- pendente;
- aceito;
- recusado;
- expirado;
- revogado.

### Regras

- convite deve ser revogável;
- código deve ser único por Núcleo e período;
- aceitar convite de Núcleo cria Membro;
- aceitar convite de experiência confirma participação.

---

## 2.15 Aprovação

Consentimento explícito para ações importantes.

### Campos recomendados

- `id`;
- `nucleoId`;
- `tipo`;
- `entidadeTipo`;
- `entidadeId`;
- `solicitanteId`;
- `destinatarios`;
- `status`;
- `respostas`;
- `createdAt`;
- `expiresAt`;

### Tipos

- novoAcordo;
- ajusteAcordo;
- encerrarAcordo;
- promoverEssencia;
- conviteExperiencia;
- mudarFaseJornada;
- confirmarManifesto;
- eventoObrigatorio.

### Status

- aguardando;
- parcialmenteAceito;
- aceito;
- recusado;
- emConversa;
- expirado;
- cancelado.

### Regras

- aceitar e recusar têm o mesmo valor de agência;
- "conversar" muda status para `emConversa`;
- todos os envolvidos obrigatórios precisam responder quando a regra exigir consenso;
- aprovação deve registrar histórico.

---

## 2.16 Diálogo Guiado / Conversa Guiada

Espaço mediado para cuidado em temas sensíveis. "Diálogo Guiado" é o nome de produto exibido na interface; "Conversa Guiada" pode ser usado como nome técnico da entidade persistida.

### Campos recomendados

- `id`;
- `nucleoId`;
- `participantes`;
- `origemTipo`;
- `origemId`;
- `status`;
- `createdAt`;
- `resolvedAt`;

### Mensagem da conversa

Campos:

- `id`;
- `conversaId`;
- `autorTipo`;
- `autorId`;
- `texto`;
- `createdAt`;
- `tipo`;

Tipos:

- usuario;
- ponteDoNos;
- sugestao;
- sistema.

### Regras

- sistema media, não julga;
- mensagens do Nós devem evitar diagnóstico;
- conversa pode gerar proposta, reparação, evento ou encerramento;
- acesso restrito aos participantes.

---

## 2.17 Manifesto

Síntese viva do Núcleo.

### Campos recomendados

- `id`;
- `nucleoId`;
- `titulo`;
- `texto`;
- `status`;
- `versao`;
- `geradoEm`;
- `confirmadoEm`;
- `assinaturas`;
- `fontesUtilizadas`;

### Status

- inexistente;
- elegivel;
- gerado;
- emRevisao;
- confirmado;
- arquivado.

### Regras

- confirmado exige assinaturas/aceites;
- texto não deve expor conteúdo íntimo literal sem permissão;
- versões anteriores devem ser preservadas;
- Manifesto pode ser compartilhado apenas conforme privacidade.

---

## 2.18 Notificação

Aviso interno do app.

### Campos recomendados

- `id`;
- `usuarioId`;
- `nucleoId`;
- `tipo`;
- `titulo`;
- `mensagem`;
- `entidadeTipo`;
- `entidadeId`;
- `lida`;
- `createdAt`;
- `prioridade`;

### Tipos

- gratidaoRecebida;
- acordoCumprido;
- aprovacaoPendente;
- conviteRecebido;
- membroEntrou;
- marcoAlcancado;
- essenciaPromovida;
- lembreteAgenda;
- respostaDialogo.

### Regras

- usuário pode configurar tipos;
- notificações sensíveis devem ocultar conteúdo em tela bloqueada;
- evitar excesso de lembretes.

---

# 3. Estados Globais de UI

## Autenticação

- deslogado;
- criandoConta;
- autenticadoSemNucleo;
- autenticadoComNucleo;
- sessãoExpirada.

## Núcleo ativo

- carregando;
- selecionado;
- semNucleo;
- convitePendente;
- erroAcesso.

## Sincronização

- online;
- offline;
- sincronizando;
- conflito;
- sincronizado.

## Permissão

- permitido;
- somenteLeitura;
- aguardandoAceite;
- semPermissao.

---

# 4. Permissões

## Ações por membro comum

- ver conteúdos do Núcleo;
- criar proposta de acordo;
- enviar gratidão;
- registrar momento;
- criar evento;
- responder aprovações;
- editar próprio perfil afetivo;
- sair do Núcleo.

## Ações por administrador/criador

- convidar membros;
- revogar convites;
- alterar configurações do Núcleo;
- remover membro, se regra futura permitir;
- editar dados institucionais do Núcleo.

## Ações sempre pessoais

- editar próprio perfil afetivo;
- configurar notificações;
- aceitar/recusar convites;
- assinar Manifesto;
- responder aprovações em seu nome.

## Regras

- ninguém responde consentimento por outra pessoa;
- administrador não pode transformar proposta em acordo sem aceite dos envolvidos;
- permissões administrativas não devem sobrepor privacidade pessoal.

---

# 5. Regras de Privacidade

## Núcleo

- privado por padrão;
- acesso por convite;
- dados isolados por `nucleoId`.

## Memórias

- visíveis ao Núcleo por padrão;
- podem ter visibilidade restrita;
- autor deve ter controle sobre remoção ou ocultação dentro das regras do Núcleo.

## Perfil Afetivo

- pertence ao usuário;
- visibilidade deve ser configurável;
- dados podem ser removidos a qualquer momento.

## Calendário

- fonte oficial interna;
- integrações externas precisam de consentimento;
- espelho externo deve usar título seguro quando necessário.

## Diálogo Guiado

- privado aos participantes;
- não deve alimentar Manifesto sem consentimento explícito;
- conteúdo sensível não deve aparecer em notificações públicas.

---

# 6. Regras de Cálculo e Evolução

## Árvore

Pode crescer com:

- hábito praticado;
- momento registrado;
- experiência vivida;
- gratidão enviada;
- marco alcançado;
- acordo promovido para Essência;
- Manifesto confirmado.

Não deve crescer com:

- quantidade bruta de mensagens;
- cobrança;
- ranking individual;
- tempo de tela;
- insistência em convites.

## Progresso de hábito

Campos possíveis:

- frequência esperada;
- registros no período;
- registros válidos;
- percentual;
- próximo prazo.

Regra: progresso deve ser indicativo, não punitivo.

## Força do laço

Sinais possíveis:

- tempo desde última interação;
- gratidões trocadas;
- experiências vividas;
- acordos compartilhados;
- datas importantes próximas;
- resposta a convites;
- momentos registrados.

Regra: força do laço deve gerar sugestões de cuidado, nunca juízo moral.

## Completude de perfil

Sinais possíveis:

- bio preenchida;
- ao menos uma linguagem de cuidado;
- gostos;
- desejos;
- datas importantes;
- hobbies;
- formas de cuidado.

Regra: completude não deve impedir uso do app.

---

# 7. Eventos de Domínio

Eventos úteis para implementação:

- `UsuarioCriado`;
- `NucleoCriado`;
- `ConviteGerado`;
- `ConviteAceito`;
- `NucleoSelecionado`;
- `AcordoProposto`;
- `AcordoAceito`;
- `AcordoRecusado`;
- `AcordoRegistrado`;
- `AcordoRevisado`;
- `AcordoPromovidoParaEssencia`;
- `MomentoRegistrado`;
- `GratidaoEnviada`;
- `MemoriaCriada`;
- `MarcoAlcancado`;
- `EventoCriado`;
- `EventoConfirmado`;
- `EventoRealizado`;
- `DialogoIniciado`;
- `DialogoResolvido`;
- `ManifestoGerado`;
- `ManifestoConfirmado`;
- `PerfilAfetivoAtualizado`;
- `NotificacaoCriada`.

---

# 8. Gatilhos de Notificação

## Gratidão enviada

Destinatários recebem:

"Ana agradeceu você" ou "Sofia agradeceu você".

## Acordo cumprido

Participantes recebem:

"Conversar sem distrações foi registrado."

## Aprovação pendente

Destinatário recebe:

"Ana propôs um acordo para vocês conversarem."

## Marco alcançado

Núcleo recebe:

"Vocês completaram 2 meses cultivando este hábito."

## Essência promovida

Núcleo recebe:

"Um hábito virou parte da Essência de vocês."

## Evento próximo

Participantes recebem:

"Jantar em família hoje às 20:00."

## Resposta no diálogo

Participante recebe:

"Ana respondeu no espaço seguro de vocês."

---

# 9. Validações

## Acordo

- título obrigatório;
- participantes obrigatórios;
- categoria obrigatória;
- frequência obrigatória para hábito;
- data obrigatória para evento derivado;
- impacto esperado recomendado;
- aprovação obrigatória para ativação.

## Gratidão

- destinatário obrigatório;
- mensagem obrigatória;
- destinatário deve pertencer ao Núcleo.

## Momento

- acordo ou evento recomendado;
- humor obrigatório se vier da tela Registrar Momento;
- nota opcional;
- foto opcional.

## Convite

- Núcleo obrigatório;
- código único;
- validade;
- status ativo para aceite.

## Manifesto

- Núcleo obrigatório;
- texto obrigatório;
- status;
- assinaturas para confirmação.

---

# 10. Estados Vazios por Entidade

## Sem Núcleo

"Crie ou entre em um Núcleo para começar a cultivar seus laços."

## Sem Acordos

"Comece por uma necessidade simples. Um acordo nasce melhor quando nasce de uma conversa."

## Sem Memórias

"Ainda não há memórias por aqui. Quando algo bonito acontecer, vocês podem guardar juntos."

## Sem Gratidões

"Um pequeno obrigado pode ser o primeiro registro positivo deste Núcleo."

## Sem Eventos

"Nada marcado por enquanto. Vocês podem criar um momento quando fizer sentido."

## Sem Perfil Afetivo

"Conte um pouco sobre você para quem te ama cuidar melhor."

## Sem Aprovações

"Nada esperando seu sim agora."

---

# 11. Anti-Regras

O Projeto Nós não deve implementar:

- ranking de membros;
- pontuação individual pública;
- streak punitivo;
- alerta de "falha" em acordo;
- exposição automática de calendário pessoal externo;
- diagnóstico emocional;
- mensagens automáticas que se passem pela pessoa;
- promoção para Essência sem consentimento;
- Manifesto confirmado sem aceite;
- entrada pública em Núcleo;
- comparação entre Núcleos;
- cobrança insistente de resposta.

---

# 12. Recomendações para Banco de Dados

## Chaves

Todas as entidades principais devem usar IDs estáveis.

## Isolamento

Adicionar `nucleoId` em entidades do Núcleo:

- acordos;
- memórias;
- gratidões;
- eventos;
- convites;
- aprovações;
- manifesto;
- conversas.

## Auditoria

Adicionar histórico ou eventos para ações sensíveis:

- aprovação;
- recusa;
- promoção para Essência;
- confirmação de Manifesto;
- mudança de privacidade;
- remoção de membro;
- revogação de convite.

## Soft delete

Recomendado para:

- memórias;
- acordos;
- convites;
- eventos;
- mensagens sensíveis.

---

# 13. Contrato de Implementação para IA

Ao criar código para o Projeto Nós, a IA deve assumir:

1. `nucleoId` é obrigatório em quase toda entidade afetiva.
2. Consentimento é regra de domínio, não detalhe de UI.
3. Privacidade é padrão, não opção avançada.
4. Progresso é simbólico e coletivo.
5. Textos precisam seguir o tom de cuidado definido na v2.3.
6. Entidades devem preservar origem e contexto.
7. Fluxos difíceis devem oferecer conversa, reparação e calma.
8. Dados pessoais do perfil afetivo pertencem ao usuário.
9. Integrações externas nunca são fonte oficial de agenda.
10. A árvore e o Manifesto são sínteses de trajetória, não métricas brutas.
