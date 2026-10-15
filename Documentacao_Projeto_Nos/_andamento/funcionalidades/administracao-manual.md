# Administração e participação — manual de teste — v1.0.0

Status: implementação funcional validada localmente, 2026-10-14. [Contrato](administracao-participacao.md). Não executar este roteiro em produção sem publicar código e aplicar a migração correspondente.

## Gestão do Núcleo

1. Com duas contas locais, crie um Núcleo e aceite um convite com a segunda conta. O criador inicia administrador; a outra pessoa inicia participante.
2. No Início, abra Pessoas e administração. O administrador consulta os participantes, convida, gerencia códigos e ajusta nome/propósito.
3. Nomeie a outra pessoa e confirme. Antes do aceite, ela continua participante. Na segunda conta, aceite a nomeação: ambos passam a ter os mesmos poderes.
4. Retire a administração de um dos dois e confirme. O vínculo de participante permanece. Não é permitido retirar o papel do último administrador sem sair do Núcleo.
5. Confira que um membro comum pode consultar pessoas e responder à própria nomeação, mas não recebe controles administrativos. As funções do banco também negam essas ações sem autorização.

## Acordos sem votação coletiva

1. Abra Acordos, preencha e confira uma proposta. Conferir/editar não gravam. Publicar cria a proposta e não aceita por ninguém.
2. Cada conta escolhe se participa. Recusar ou deixar de participar não cancela o acordo das demais pessoas.
3. Um administrador inicia o teste, conclui-o ativando o acordo ou encerra explicitamente. Não há votação, quórum ou obrigação de resposta de todos.
4. Com os termos atuais aceitos, registre humor e nota. Administrador não registra aceite por outro membro.
5. Abra Termos e histórico, altere um campo e publique. A versão anterior permanece, e cada pessoa deve aceitar a nova antes de registrar novos momentos. Uma página desatualizada não aceita outra versão silenciosamente.
6. Salvar sem mudança não cria versão nem invalida aceites. Encerrar impede novos registros e mantém os momentos e versões consultáveis. Históricos do modelo anterior são apenas leitura.
7. Hábitos e Experiências permitem proposta, participação e gestão. Detalhe e registro específicos de Experiência permanecem planejados; não confundir a proposta com esse módulo completo.

## Saída e privacidade

1. Em Configurações → Privacidade, escolha se deseja ocultar autoria nas próximas saídas. A opção começa desativada e não altera saídas anteriores.
2. Abra Sair deste Núcleo. Confira o aviso: acesso perdido, história compartilhada preservada e efeito da preferência. Voltar sem confirmar conserva o vínculo.
3. Saia como último administrador com outro participante presente: o servidor sorteia o restante e atribui o papel na mesma transação. Acordos não são cancelados.
4. Como participante restante, consulte os momentos e a agenda: conteúdos continuam; autoria protegida não é exposta por consultas diretas. O próprio texto pode identificar a pessoa.
5. Uma reentrada por convite não restaura participação em acordos sem novo aceite. Autoria já ocultada permanece assim; a própria presença em um evento continua disponível à pessoa autenticada, inclusive após remarcação.
6. Saída do último membro encerra o Núcleo e revoga os códigos. Um convite antigo não pode reabrir o espaço.

## Suporte e reservas

Ajuda informa Sintagma Software e sintagmasoftware@gmail.com. Acesso, correção, exportação e exclusão são solicitações manuais; titularidade e terceiros devem ser protegidos. Não enviar senha, token ou conteúdo íntimo. O aplicativo não envia pedidos automaticamente, não oferece exclusão física automática e não promete prazo de atendimento/retenção.

Termos e política completos, rotina operacional de atendimento/retenção, dispositivos, alteração de e-mail, chat, mídia e demais expansões têm espaço sinalizado. O item5 (SMTP/recebimento, segredo de recuperação, origens/HTTPS, limites/logs, backup/restauração e duas contas online) permanece adiado pelo Google. Teste local não comprova operação remota.
