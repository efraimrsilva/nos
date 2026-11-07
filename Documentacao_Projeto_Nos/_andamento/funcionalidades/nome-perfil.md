# Nome do perfil — v3.11.0 — concluído localmente

Pedido: permitir que a pessoa altere seu próprio nome pelo lápis ao lado do nome em **Dados da conta**. MVP05, Tela66 e painel de perfil desktop nas rotas autenticadas (exemplo Tela13). Não substitui o perfil afetivo planejado nas Telas49–54.

O modal existente passa de consulta a consulta/formulário. Lápis “Editar nome do perfil” abre campo com foco, Salvar nome e Cancelar. Nome obrigatório, de 1 a 80 caracteres após remover espaços das pontas, mantendo o limite do cadastro. Cancelar ou fechar antes do envio descarta o rascunho; fechar depois de enviar não desfaz a operação já iniciada. Durante envio, campo e botões de edição ficam desabilitados. Erro mantém a entrada e permite reenvio; sucesso somente após confirmação do Auth. Mensagens acessíveis por alert/status; lápis recupera foco após salvar/cancelar. Animação curta respeita movimento reduzido.

Persistência: ação no servidor verifica a identidade pelo Auth e compara com a conta originalmente exibida, impedindo formulário antigo de alterar outra sessão. Usa updateUser com somente data.name; não recebe ID para escolher alvo de gravação, não usa chave administrativa nem concede permissões pelo nome. Outros metadados, e-mail, senha e vínculos não são alterados. Revalidação atualiza nome e iniciais da interface. Listas de participantes existentes consultam raw_user_meta_data.name. Na3.11.0, a migração20261107100000_profile_identity_sync adiciona a comparação periódica descrita abaixo. Não é transmissão instantânea por push.

Atlas reutiliza a composição compartilhada em Tela66, painel13, MVP e Visão global. Nome editado somente no diálogo de demonstração, com aviso explícito de ausência de gravação real. Reabrir a prévia restaura o exemplo. Mesmos73 IDs e cobertura funcional planejada preservados.

Validação e limites finais: consultar registro da entrega no estado canônico. Teste de caixa preta M05-PER-010 a013; automação não aprova execução manual pelo usuário.


## Sincronização entre sessões — v3.11.0 — 2026-11-07

A conferência existente a cada3 segundos passa a incluir o nome exibido da própria pessoa e dos integrantes atuais dos Núcleos comuns. Mudanças atualizam as listas/iniciais dos cartões e a lista de integrantes, incluindo título de detalhes já aberto, sem recarga integral do documento. Outros rascunhos e modais permanecem abertos. O intervalo é uma frequência de consulta, não garantia de entrega em3s: latência, aba oculta, suspensão e conexão interferem.

RPC get_nucleus_identity_version sem argumentos usa auth.uid e retorna somente um MD5 determinístico de Núcleos autorizados e nomes visíveis; MD5 é detector de mudança, não autorização ou anonimização garantida. Não inclui e-mail, tema ou demais metadados; nomes de pessoas sem Núcleo comum não alteram o resumo. Quem sai deixa de compor o resumo. Sem acesso direto do cliente a auth.users, sem novo temporizador/trigger/serviço.

Pausa com aba oculta/offline, retoma em visibilidade/conexão. Erro ou RPC ausente preserva dados exibidos e tenta novamente nos próximos ciclos. O leitor antigo foi substituído: aplicar a migração antes de publicar o frontend é obrigatório para não suspender também a sincronização de nome/propósito do Núcleo. Migração aplicada e conferida também no Supabase hospedado em07/11/2026 antes do frontend; aplicativo publicado no Netlify em07/11/2026 no commitd4cd65b. Evidências funcionais de duas sessões continuam locais até conferência online específica.

Validação:8 testes autenticados desktop/mobile (2 novos e6 regressões de Núcleo),10 testes SQL de resumo/isolamento e13 existentes de identidade aprovados. Edição pelo formulário real atualizou outra sessão e preservou os dois diálogos; falha de transporte recuperou a lista sem reload. Ver registro e galeria no estado. Sem novos roteiros de caixa preta automaticamente.
