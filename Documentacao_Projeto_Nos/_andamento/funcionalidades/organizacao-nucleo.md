# Organização do Núcleo — v3.11.0 — validado localmente

O desenho aprovado substitui a guia Pessoas por funções nos locais pertinentes. Nenhuma permissão de administração ou escolha individual é ampliada.

| Local | Conteúdo e regra |
|---|---|
| Início, cabeçalho | Nome, propósito e papel, nessa ordem. Lápis de nome e propósito somente para administradores. Cada modal tem um único campo e confirmação. A RPC altera somente esse campo sob trava. |
| Início, Núcleos onde estou | Ver integrantes abre a lista completa do Núcleo atual; demais Núcleos abrem seu próprio Início. Lista compacta com cabeçalhos Nome/Papel. O nome abre detalhes e todas as ações existentes; nenhum botão Ver participação. Nomeações ficam apenas nos detalhes. |
| Conta, perfil desktop e Mais mobile | Conta e Núcleos: Seus Núcleos; Gerenciar convites, se administra algum; Sair de um Núcleo, se tem vínculo; Encerrar Núcleo para todos, se administra algum. |
| Gerenciar convites | Escolher um espaço administrado abre a gestão existente; geração e revogação preservadas. |
| Sair de um Núcleo | Escolha explícita quando há vários, nome visível, efeitos da preferência de autoria, sucessão de administrador e encerramento do último vínculo explicados; ciência antes de enviar. Falha da preferência bloqueia o envio até consultar novamente. |
| Encerrar Núcleo para todos | Classe visual e animação de Apagar minha conta; ciência e nome atual exigidos. O banco compara o nome sob trava; histórico e contas preservados, acesso removido e convites revogados. Não há reabertura pelo aplicativo. |
| Entrada por código | O atalho da Conta foi retirado; Seus Núcleos e /comecar/convite permanecem. Gerenciar convites não substitui aceite de quem recebeu um código. |
| Compatibilidade | /nucleos/[id]/pessoas redireciona para /nucleos/[id]?integrantes=1. O destino valida sessão e participação. /sair permanece como rota alternativa. |
| Barra mobile | Início → Seus Núcleos → Acordos → Agenda → Mais. Sem Pessoas na lateral ou mobile. |

Formulários reutilizam ControlActionForm e ActionDialog. Salvar identidade e gerenciar integrantes revalida dados sem redirect, mantendo posição, modal e retorno visual. Navegar por links fecha as camadas anteriores. Animações locais existentes preservadas e movimento reduzido respeitado. Confirmações são reiniciadas ao trocar o Núcleo de destino.

Integrações: sessão/RLS, get_nucleus_management, funções administrativas existentes e nova update_nucleus_identity. Migração20261103160000 aplicada e validada também no banco hospedado configurado em03/11/2026 após o relato de falha, sem alterar dados existentes; [registro do reparo](../registros/registro-v3.6.0-2026-11-03-imp-banco-hospedado-fun-edicao-identidade.md). Testes do usuário: [organização do Núcleo](../testes-caixa-preta/organizacao-nucleo.md).

**Atualização3.6.2:** seta Ver integrantes com13px de espaço junto ao texto, como Ver Seus Núcleos. Lista sem cartões grandes, nome acionável por teclado, pequenos avatares e foco preservado. Não há coluna extra de ações.

**Atualização3.6.3 — identidade compartilhada:** o shell autenticado confere um resumo SHA-256 de id/nome/propósito dos Núcleos acessíveis pela sessão/RLS a cada três segundos. Havendo alteração, router.refresh atualiza o conteúdo sem recarregar documento: Início, listas, contexto em Acordos/Agenda e seletores da Conta/Mais. Primeira conferência de cada versão/rota fecha a janela entre consultas concorrentes. Pausa com aba oculta/offline, retoma com visibilidade/conexão; falha não limpa dados. Nenhuma permissão nova, escrita pelo receptor, migração ou serviço adicional. Intervalo/rede/suspensão do navegador afetam a latência; não é push instantâneo. [Caixa preta](../testes-caixa-preta/sincronizacao-identidade.md).


**Atualização3.11.0 — nomes de integrantes:** substitui o resumo SHA-256 descrito na atualização3.6.3 por uma RPC única, get_nucleus_identity_version, com resumo MD5 de Núcleos visíveis e nomes atuais dos integrantes compartilhados. Mantém os3 segundos, pausa/retomada e refresh sem perder rascunhos. Inclui nova migração e segurança por sessão. [Contrato do perfil](nome-perfil.md). Aplicar migração antes do frontend; implementação validada somente localmente nesta entrega.
