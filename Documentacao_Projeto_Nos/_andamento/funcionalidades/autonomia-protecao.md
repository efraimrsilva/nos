# Autonomia e proteção — MVP 05 — v1.0.0

**Modelo implementado localmente — v1.0.0 — 14/10/2026:** [administração e participação](administracao-participacao.md) é o contrato vigente. Administração compartilhada, escolha individual, novo aceite por versão, saída com história preservada e preferência de autoria estão implementados. Sem votação coletiva ou cancelamento de acordo por saída. [Manual de teste](administracao-manual.md). Publicação, migração remota e operação do piloto permanecem pendentes.

## Histórico do modelo anterior — até v0.16.0

Os contratos e marcos abaixo são preservados para rastreabilidade; não representam as regras atuais dos Núcleos/acordos.

Data: 2026-10-13. Recorte implementado e validado localmente; etapa MVP05 permanece parcial.

**Direção de produto vigente — 14/10/2026:** quadro de administração/participação simples aprovado. Quem cria inicia administrador; administração gerencia convites/participantes e organiza acordos; entrada/participação individuais; saída não cancela acordos nem gera votação automaticamente. Preferência geral de ocultar autoria preservando conteúdo permanece. Respostas5–10 nas seções abaixo são histórico substituído, sem implementação. [Roteiro simplificado de definições restantes](../registros/registro-v0.16.0-2026-10-14-10-imp-modelo-administracao-fun-roteiro-simplificado.md). Nenhuma mudança no comportamento do aplicativo ainda.

| Tela | Disponível | Pendente/reservado |
|---|---|---|
|66 Configurações|Navegação autenticada para Privacidade, Conta e segurança e Ajuda|Preferências pessoais, perfil e notificações|
|67 Privacidade|Alcance real dos registros; vínculo explícito, votos individuais de confirmação privados|Editor por informação, mídia/rascunhos e política de retenção/direitos|
|69 Conta e segurança|Recuperação existente com retorno; logout com processamento e conservação de vínculos|Reautenticação específica, e-mail, sessões/dispositivos, revogação individual, exportar/excluir|
|70 Ajuda|Orientações sobre Núcleo, Hábito, agenda, privacidade e saída|Canal/responsável de suporte, termos e procedimento de direitos|
|71 Sair de um Núcleo|Orientação protegida por associação; contexto do criador; voltar sem alterar vínculo|Remoção efetiva, transferência consentida e retenção compartilhada|

Navegação: lista12 ou Início13 → Configurações66 → Privacidade67 OU Conta69 OU Ajuda70 → Configurações66. Saída é contextual: Início13 → orientação71 → Início13. Não é necessário visitar todas as páginas para usar o produto. Recuperação:69 →04 →05 →01 →69, após prova válida e novo login; recebimento externo depende de SMTP operacional.

Autorização: proxy e páginas conferem sessão com auth.getUser(); as novas rotas têm retorno interno autorizado sem parâmetros arbitrários. A orientação de saída valida UUID (identificador único universal), sessão e vínculo próprio sob RLS (segurança em nível de linha). Sem vínculo, notFound; em streaming a resposta HTTP pode ser200, mas o conteúdo é página não encontrada/noindex. Criador e participante recebem informações conforme papel. Nenhuma nova escrita em tabela, migração ou permissão.

Privacidade vigente: pessoas associadas consultam contexto, propostas, termos, momentos com humor/nota, revisões e agenda. Cada pessoa responde por si; votos individuais da confirmação são privados, resultado agregado exige autorização. Nenhuma opção finge esconder notas retroativamente. Logout usa a ação existente de Auth e não remove nucleus_members. Tokens já emitidos e administração individual de sessões não são apresentados como revogação imediata granular.

Pendências para fechar esta etapa e o piloto:

**Pergunta10 — 14/10/2026:** nova saída de original durante votação de continuidade pendente encerra rodada sem decidir continuidade e abre nova para originais restantes, sete dias e novos votos. Registros continuam permitidos e votos anteriores não são reaproveitados. Caso de menos de dois originais associados ainda pendente. [Registro](../registros/registro-v0.16.0-2026-10-14-08-imp-contrato-saida-fun-reinicio-votacao.md).

**Perguntas6–9 — 14/10/2026:** saída de original encerra automaticamente somente acordo em teste, preservando histórico. Ativo terá votação nova com maioria absoluta dos originais que permanecem associados; novos membros não votam. Sete dias: maioria aprova imediatamente; prazo sem maioria encerra com história preservada. Resposta9 B permite novos registros durante votação, mantidos após eventual encerramento. Saída adicional definida na pergunta10 acima, sem recálculo silencioso. Implementação pendente. [Continuidade](../registros/registro-v0.16.0-2026-10-14-04-imp-contrato-saida-fun-continuidade-acordo.md), [eleitorado](../registros/registro-v0.16.0-2026-10-14-05-imp-contrato-saida-fun-eleitorado-continuidade.md), [prazo](../registros/registro-v0.16.0-2026-10-14-06-imp-contrato-saida-fun-prazo-votacao.md), [registros](../registros/registro-v0.16.0-2026-10-14-07-imp-contrato-saida-fun-registros-durante-votacao.md).

**Pergunta 5 aprovada após a publicação — 14/10/2026:** saída de um participante original durante aprovação inicial cancela a proposta. Os atuais poderão criar nova proposta com novos aceites; nenhum aceite implícito ou recálculo silencioso. Implementação ainda pendente. [Registro](../registros/registro-v0.16.0-2026-10-14-03-imp-contrato-saida-fun-cancelamento-proposta.md).

**Definição em andamento — 14/10/2026:** qualquer participante poderá sair a qualquer momento. Atividades preservadas por padrão; preferência geral para todos os Núcleos poderá retirar identificação de autoria após sair. Pergunta 4, opção A: conteúdo pessoal, humor e notas permanecem; não apagar/reescrever textos automaticamente, nem prometer anonimato completo de conteúdo/contexto. Essas decisões substituem a eliminação obrigatória anterior; aviso refletirá a escolha vigente. Saídas anteriores, decisões coletivas e tratamento do criador ainda precisam de definição. Nenhuma saída/anonimização implementada. Item 5 adiado explicitamente devido ao impedimento do Google; continuar itens 1–4. [Registro de definição](../registros/registro-v0.16.0-2026-10-14-imp-contrato-saida-fun-definicao-mvp-05.md).

1. Definir saída, revogação de acesso e novos registros, destino de decisões pendentes e histórico; saída de participante original não pode recalcular votos silenciosamente.
2. Definir transferência do criador com aceite explícito, último membro e eventual encerramento do Núcleo.
3. Aprovar retenção e procedimentos de acesso, correção, exportação e exclusão que protejam terceiros.
4. Definir responsável/canal de suporte, termos de uso e informações do tratamento de dados.
5. Comprovar no ambiente de uso: SMTP/recebimento, segredo de recuperação, origens/HTTPS (conexão segura), limites de tentativas, logs sem segredos, backup/restauração e duas contas online. O estado operacional não foi atualizado remotamente nesta entrega.

Teste manual: entrar → Seus Núcleos → Configurações; abrir três alternativas e retornar; conferir reservas; Conta69 → recuperação com retorno; sair e tentar abrir Configurações novamente. Num Núcleo próprio, abrir orientação71 e voltar: vínculo deve permanecer. Com outra conta sem associação, acessar a URL da orientação: nenhum contexto privado deve aparecer. Participante não vê mensagem exclusiva do criador. Usar teclado e celular; logout deve bloquear repetição enquanto processa.

Evidências:106 testes gerais com compilação local de produção; quatro autenticados desktop/mobile com duas contas, recuperação/retorno/logout, vínculo preservado e isolamento; tipos/build webpack; verificadores MVP05/MVP/Visão global; capturas reais fictícias e antes extraído de c40594f. Autorrevisão e revisão independente; P2 de entradas no Atlas corrigido. Não foi provocada indisponibilidade real do Auth, nem realizada restauração ou prova externa.

## Evolução — v3.1.0 — 23/10/2026

A exclusão da própria conta deixa de ser apenas uma solicitação manual: Conta e segurança oferece ação vermelha, diálogo de consequências e frase APAGAR CONTA. Somente a conta da sessão pode ser excluída. Identificação e acesso removidos; histórico compartilhado preservado como Conta excluída. Participação, sucessão e encerramento seguem o contrato atual; dados textuais e backups têm limites explícitos. Implementação e banco local validados, sem aplicação remota ou deploy. Este bloco substitui a orientação histórica de exclusão exclusivamente por suporte. [Contrato completo](exclusao-conta.md).
