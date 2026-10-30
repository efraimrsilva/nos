# Nome do perfil — v3.4.0 — concluído localmente

Pedido: permitir que a pessoa altere seu próprio nome pelo lápis ao lado do nome em **Dados da conta**. MVP05, Tela66 e painel de perfil desktop nas rotas autenticadas (exemplo Tela13). Não substitui o perfil afetivo planejado nas Telas49–54.

O modal existente passa de consulta a consulta/formulário. Lápis “Editar nome do perfil” abre campo com foco, Salvar nome e Cancelar. Nome obrigatório, de 1 a 80 caracteres após remover espaços das pontas, mantendo o limite do cadastro. Cancelar ou fechar antes do envio descarta o rascunho; fechar depois de enviar não desfaz a operação já iniciada. Durante envio, campo e botões de edição ficam desabilitados. Erro mantém a entrada e permite reenvio; sucesso somente após confirmação do Auth. Mensagens acessíveis por alert/status; lápis recupera foco após salvar/cancelar. Animação curta respeita movimento reduzido.

Persistência: ação no servidor verifica a identidade pelo Auth e compara com a conta originalmente exibida, impedindo formulário antigo de alterar outra sessão. Usa updateUser com somente data.name; não recebe ID para escolher alvo de gravação, não usa chave administrativa nem concede permissões pelo nome. Outros metadados, e-mail, senha e vínculos não são alterados. Revalidação atualiza nome e iniciais da interface. Listas de participantes existentes consultam raw_user_meta_data.name. Não há migração nem sincronização em tempo real para páginas já abertas por outras pessoas.

Atlas reutiliza a composição compartilhada em Tela66, painel13, MVP e Visão global. Nome editado somente no diálogo de demonstração, com aviso explícito de ausência de gravação real. Reabrir a prévia restaura o exemplo. Mesmos73 IDs e cobertura funcional planejada preservados.

Validação e limites finais: consultar registro da entrega no estado canônico. Manual M05-PER-010 a013; automação não aprova execução manual pelo usuário.
