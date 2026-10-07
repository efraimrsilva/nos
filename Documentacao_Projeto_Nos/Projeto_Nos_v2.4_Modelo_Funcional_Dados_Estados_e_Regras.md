# Projeto Nós - Modelo Funcional, Dados, Estados e Regras (Versão 2.4)

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

Documento de modelagem funcional.

## Relação com as versões anteriores

- v2.1 descreve as telas.
- v2.2 descreve os fluxos.
- v2.3 descreve design system, componentes e tom.
- v2.4 descreve entidades, dados, estados, permissões e regras para implementação.

## Objetivo

Definir um modelo funcional coerente com as interfaces do protótipo e com as documentações 1.1 a 1.10, evitando que a implementação crie estruturas desalinhadas com a filosofia do Projeto Nós.

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
- proposta inicial exige aceite unânime; Hábito ativo exige prazo de teste completo e limiar de confirmações do ciclo (maioria absoluta até 150; um terço arredondado para cima acima de 150);
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

## 2.16 ConversaGuiada (Espaço de Conversa Guiada)

Fluxo estruturado de preparação para diálogo presencial em temas sensíveis. "Espaço de Conversa Guiada" ou "Diálogo Guiado" são nomes de produto na interface; `ConversaGuiada` é o nome técnico da entidade persistida.

O Projeto Nós **não possui chat livre** nem mensageria aberta entre membros.

### Campos recomendados

- `id`;
- `nucleoId`;
- `participantes`;
- `tipoConversa`;
- `origemTipo`;
- `origemId`;
- `status`;
- `motivoPeso`;
- `rascunhoPreparacao`;
- `cartaoIntencao`;
- `eventoAoVivoId`;
- `desfecho`;
- `pontosUtilizados`;
- `createdAt`;
- `resolvedAt`.

### Tipos de conversa (`tipoConversa`)

- `compreensao`;
- `alinhamento`;
- `reparo`;
- `revisao`;
- `gratidao`;
- `necessidade`;
- `retomada`.

### Origem (`origemTipo`)

- `acordo`;
- `proposta`;
- `revisao`;
- `gratidao`;
- `vinculo`;
- `aprovacao`;
- `manual`.

### Status

- `convite`;
- `preparando`;
- `cartaoEnviado`;
- `aguardandoEncontro`;
- `encontroRealizado`;
- `desfechoRegistrado`;
- `adiada`;
- `arquivada`;
- `compreensaoPendente`;
- `compreensaoConfirmada`.

### Desfechos (`desfecho`)

- `reparacao`;
- `evento`;
- `ajuste`;
- `gratidao`;
- `pausa`;
- `arquivado`;
- `proposta`;
- `compreensaoConfirmada`.

### Cartão de Intenção (`cartaoIntencao`)

Mensagem única opcional que convida ao encontro presencial. Não abre thread.

Campos:

- `texto`;
- `enviadoEm`;
- `enviadoPor`;
- `resposta`; // aceitar · sugerirHorario · adiar
- `respondidoEm`.

### Compreensão (troca única estruturada)

Campos auxiliares quando `tipoConversa = compreensao`:

- `necessidadeOriginal`;
- `reformulacao`;
- `reformuladoPor`;
- `confirmadoPor`;
- `confirmadoEm`.

Permite no máximo uma reformulação por rodada. Não é chat.

### Registro do Ponte do Nós

Referência às dicas aplicadas durante a preparação. O Ponte do Nós não é entidade de domínio separada; dicas vêm de biblioteca configurável.

Campos em `pontosUtilizados`:

- `pontoId`;
- `momento`; // pre_preparacao · pre_envio · pos_preparacao_positiva · impasse · escalada · pos_encontro · encerramento
- `exibidoEm`.

Tipos de autor em registros auxiliares:

- `usuario`;
- `pontoDoNos`;
- `sistema`.

### Regras

- sistema apoia, não julga;
- Ponte do Nós evita diagnóstico;
- conversa encaminha para evento ao vivo, proposta, reparação ou encerramento;
- acesso restrito aos participantes;
- **não persistir thread de mensagens abertas**;
- feedback corretivo do Ponte do Nós privado ao autor;
- Manifesto não consome conteúdo literal por padrão.

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

## Diálogo Guiado / ConversaGuiada

- privado aos participantes;
- não possui chat livre nem inbox;
- rascunhos de preparação privados ao autor;
- Cartão de Intenção é mensagem única, sem thread;
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
- `ConversaGuiadaPreparada`;
- `CartaoIntencaoEnviado`;
- `ConversaAoVivoAgendada`;
- `CompreensaoConfirmada`;
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
- cobrança insistente de resposta;
- chat livre ou mensageria contínua entre membros;
- thread de respostas após Cartão de Intenção;
- inbox ou caixa de mensagens do Núcleo.

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
- conversasGuiadas.

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
11. Conversas Guiadas preparam encontros presenciais; o Projeto Nós não possui chat livre.
12. O Ponte do Nós orienta preparação; não julga, não diagnostica e não decide culpa.


---

# Diagrama de Fluxo da Versao

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': { 'primaryColor': '#fff', 'primaryTextColor': '#fff', 'primaryBorderColor': '#fff', 'lineColor': '#fff', 'secondaryColor': '#fff', 'tertiaryColor': '#fff', 'background': '#000', 'mainBkg': '#333', 'nodeBorder': '#fff', 'clusterBkg': '#333', 'clusterBorder': '#fff', 'titleColor': '#fff', 'edgeLabelBackground': '#333', 'tertiaryBorderColor': '#fff', 'fontFamily': 'arial'}}}%%
stateDiagram-v2
    [*] --> Deslogado
    Deslogado --> CriandoConta
    CriandoConta --> AutenticadoSemNucleo: Cadastro Completo
    AutenticadoSemNucleo --> AutenticadoComNucleo: Selecionar/Criar Nucleo
    AutenticadoComNucleo --> SessaoExpirada: Token Expirado / Inatividade
    SessaoExpirada --> Deslogado: Logout / Reautenticar
    classDef default fill:#4F7E2C,stroke:#fff,color:#fff
    classDef state fill:#6A3FD1,stroke:#fff,color:#fff
    classDef transition fill:#E2A52C,stroke:#fff,color:#fff
```


## Contrato implementável de ciclos e confirmações — decisão de 2026-10-03

**Versão de implementação vigente: 0.11.0; confirmação implementada e validada.**

Persistir duração inteira de 7 a 30 dias, início/fim reais, fotografia dos participantes, número exigido de votos e respostas/data de confirmação por ciclo. O ciclo guarda o combinado; ajustes preservam o ciclo anterior e abrem outro sem votos reaproveitados. Até 150 participantes, requiredVotes=floor(N/2)+1; acima de 150, requiredVotes=ceil(N/3). Ativar somente na última confirmação necessária após prazo, sem revisão pendente. Estado active é compatível com detalhe, momentos e revisão. Dados legados sem datas permanecem sem término inferido até novo período unânime. Escritas usam transação com bloqueio do Hábito antes de ciclo/revisão.

Regra canônica: [v1.2 — confirmação pós-teste](Projeto_Nos_v1.2_Sistema_de_Aprovacao_e_Construcao_de_Acordos.md#regra-de-confirmação-do-hábito--decisão-de-2026-10-03).


## Ajuste aprovado de navegação e sessão — 2026-10-07

O fluxo vigente implementado na v0.13.0 é Conta → Seus Núcleos (/nucleos) → Início do Núcleo escolhido. Sem associações, a lista oferece criação ou convite; retorno específico permitido tem prioridade após autenticar. Todo /comecar e /nucleos exige sessão validada antes da renderização, inclusive rascunho e prévia de convite. Esta decisão substitui a abertura de rascunho antes do login e a listagem multínucleo apenas planejada.

Token expirado com renovação válida mantém a sessão. Sessão ausente, inválida ou não renovável pede login; falha operacional bloqueia sem afirmar logout. Ações/consultas continuam verificando identidade e autorização, com RLS por associação. Listagem não usa chave administrativa e não aceita convite automaticamente. [Contrato e validação](./_andamento/funcionalidades/navegacao-sessao.md).
