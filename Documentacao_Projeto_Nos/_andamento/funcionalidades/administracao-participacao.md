# Administração e participação — contrato implementado — v1.1.0

**Atualização operacional — v1.1.0 — 15/10/2026:** migração de encerramento aplicada no ambiente publicado, conteúdo/permissões conferidos e formulário online comprovado com duas contas descartáveis em oito grupos. Atualizar a página e usar a conta administradora. O Núcleo real permanece intacto; encerrá-lo é decisão do usuário. [Registro](../registros/registro-v1.1.0-2026-10-15-03-imp-correcao-online-fun-encerramento-nucleo.md). Limites de publicação/migração mencionados nos marcos anteriores ficam substituídos para esta função.

Atualização de15/10/2026 — v1.1.0: encerramento administrativo aprovado e validado localmente. A administração original foi publicada online em15/10; o novo encerramento ainda exige migração/publicação. [Registro](../registros/registro-v1.1.0-2026-10-15-imp-administracao-nucleo-fun-encerramento-coletivo.md). Os marcos anteriores abaixo descrevem a entrega de14/10.

Data: 2026-10-14. Status: implementação funcional validada localmente. Administração e participação são o comportamento vigente do código; publicação, aplicação da migração remota e operação do piloto continuam pendentes.

## Decisões vigentes

| Tema | Comportamento aprovado |
|---|---|
| Administração | Quem cria inicia como administrador. Pode haver vários administradores com os mesmos poderes. |
| Poderes | Gerenciar convites e revogação, remover participantes, ajustar nome/propósito e nomear/destituir administradores. Ações sensíveis pedem confirmação. |
| Encerramento administrativo | Qualquer administrador pode encerrar para todos, com nome atual digitado e ciência explícita. Revogar convites, retirar todos os vínculos e registrar fechamento na mesma transação; preservar histórico armazenado e contas. Não há reabertura pelo aplicativo. A saída individual permanece distinta. Nova função validada localmente; migração/publicação remotas pendentes. |
| Nomeação comum | A pessoa nomeada aceita o papel antes de assumi-lo. |
| Saída do último administrador | Sortear no servidor um dos participantes que permanecerem e atribuir a administração automaticamente. É a exceção explicitamente escolhida pelo usuário ao aceite da nomeação comum. Não criar eleição ou votação. |
| Entrada/saída | Entrada por aceite explícito de convite; qualquer pessoa pode sair. Saída ou remoção revoga acesso próprio e possibilidade de gravar no Núcleo. |
| Propostas | Qualquer membro pode propor. Administradores organizam, iniciam/concluem teste, ativam e encerram acordos. |
| Participação | Cada pessoa aceita, recusa ou deixa de participar por si. Administrador não aceita por outra pessoa. Novos membros podem escolher participar dos acordos disponíveis. |
| Saída e acordos | Acordos não são cancelados, encerrados nem submetidos a votação automaticamente quando alguém sai. Continuam para quem permanece; não criar exceção por restar só um participante original. |
| Ciclo | Substituir votações coletivas de aprovação/teste, confirmação e revisão pela gestão administrativa e participação individual. Não implementar unanimidade, maioria, prazos de votação ou rodadas por saída como regras do modelo novo. |
| Mudança de termos | Mostrar alteração e pedir novo aceite individual para continuar nos termos alterados. Não usar votos coletivos, silêncio ou aceite de uma versão anterior como concordância com a nova. Preservar história das versões. |
| Último participante | Ao sair, encerrar o Núcleo e revogar todos os convites. Preservar histórico conforme política de dados; quem saiu não mantém acesso e convites antigos não reabrem o espaço. Não sortear administrador se não restar ninguém. |
| Autoria após saída | Preferência geral do aplicativo, inicialmente desativada. Aplicar escolha vigente em cada saída futura. Quando ativada, ocultar autoria preservando conteúdo, humor e notas. Não reescrever textos automaticamente nem prometer anonimato completo pelo contexto. |
| Retroatividade | Não modificar automaticamente saídas anteriores nem reidentificar contribuições cuja autoria já foi ocultada. |
| Direitos sobre dados | No MVP, solicitações de acesso/correção/exportação/exclusão pelo suporte, com verificação de titularidade e proteção de terceiros. Não apresentar central automática como implementada. |

O sorteio foi aprovado especificamente para a saída do último administrador com participantes restantes. A escolha deve ocorrer junto da saída de forma atômica, sem incluir a pessoa que saiu nem permitir sorteio no navegador que possa ser manipulado. A implementação serializa as operações pelo Núcleo e confere permissões no servidor; saídas simultâneas foram testadas.

Administrador tem poderes de gestão, não acesso irrestrito a dados pessoais. Preservar isolamento entre Núcleos e decisões individuais. Deixar o Núcleo não apaga a conta nem associa automaticamente a outro espaço.

## Alerta de saída

O usuário pediu avisar, antes de confirmar, que o histórico de conversas permanecerá. Texto-base aprovado em intenção, sujeito apenas a ajuste de clareza:

> Ao sair, você perderá o acesso a este Núcleo. O histórico de conversas e das demais interações já compartilhadas permanecerá no espaço. Sua preferência de identificação será aplicada conforme informado abaixo.

Mostrar o efeito da preferência no próprio aviso: autoria mantida ou ocultada, sempre com conteúdo preservado. Não sugerir apagamento total. O aplicativo atual não oferece chat livre: a menção a conversas não autoriza criar chat ou simular um módulo futuro. As interações atualmente disponíveis são as que devem ser explicadas concretamente na tela; conteúdo de conversa, quando contratado/implementado, terá a mesma orientação de retenção aprovada.

## Responsável e suporte

- Responsável informado pelo usuário: **Sintagma Software**.
- Canal público definido: **sintagmasoftware@gmail.com**.
- Usar essas informações em Ajuda, termos e informações de tratamento de dados. Não inventar endereço, registro empresarial ou prazo de resposta.
- Atendimento e solicitações sobre dados serão manuais no MVP. O contato informado não comprova atendimento executado, recebimento externo ou resolução de solicitações; nenhuma mensagem foi enviada nesta definição.
- Prazo de retenção, rotina de exclusão física/backup e prazos operacionais de atendimento ainda não foram especificados. Não inventar duração nem apresentar esse contrato como certificação jurídica/operacional. O fechamento operacional continua dependente da etapa adiada.

## Substituições e limites

Respostas antigas5–10 sobre cancelamentos, encerramento automático de teste por saída, maioria, sete dias, continuidade e reinícios ficam superadas. A antiga pergunta11 não foi respondida e não será retomada. A nova resposta3 também substitui, no comportamento futuro de acordos, votações coletivas existentes de confirmação/revisão; não construir essas votações novamente.

Preservar migrações, testes e registros históricos da aplicação sem reescrevê-los como se já implementassem este modelo. Aplicação, dados, interfaces e testes foram adaptados em conjunto. As cinco suítes SQL substituídas permanecem intactas em supabase/tests-legacy; os históricos anteriores são somente consulta. Não reutilizar votos antigos como participação na versão nova.

Este escopo trata de Núcleos e acordos. Não definir por inferência o comportamento de módulos futuros sem contrato, como manifesto/Essência. Não gerar um sistema genérico de votação para essas áreas nesta entrega.

Item5 operacional permanece adiado a pedido do usuário pelo impedimento do Google. Não configurar SMTP, publicar, migrar banco remoto ou enviar mensagens apenas por consolidar estas respostas.

## Critérios implementados e validados

Foram validados gestão com múltiplos administradores, aceite de nomeação comum, saída/remoção com revogação, sorteio do último administrador, fechamento do último membro, participação individual, mudança de termos com novo aceite, gestão do teste/ativo/encerramento sem votação, história preservada e preferência de autoria. Atualizar aplicação, banco, testes, Atlas/Visão global/MVP/fichas/galeria e documentos coerentemente. Fonte de verdade deste desenho: este contrato; registros antigos servem apenas de histórico.
