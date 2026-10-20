# Contrato permanente — identificação de modais na interface e no Atlas

Status: vigente por decisão do usuário em 2026-10-18. Inventário vigente em v3.0.1, sem alterações de modais nesta correção; integrado e validado na reconstrução v3.0.0.

## Regra permanente

Toda tela, rota, ficha, implementação e documentação do Nós deve indicar explicitamente quais partes são **modais**. O Atlas deve tornar essa identificação visível no gatilho e na inspeção da tela. Uma navegação para outra rota não deve ser classificada como modal.

Para cada modal, registrar: rota/área de origem; nome; gatilho; conteúdo/objetivo; tipo (diálogo de formulário, detalhe, confirmação ou navegação); condições de sessão/permissão; integração real ou esboço; resultado esperado e destino; cancelamento/fechamento; evidência visual. Quando o recurso ainda não existir, usar **Esboço de funcionalidade · ainda não desenvolvido** também dentro do modal.

Toda entrega que crie, altere ou remova modal deve atualizar este inventário, as fichas/ações/estados do Atlas e o registro versionado da entrega. A galeria deve ter filtros para **Telas** e **Modais**, fotografando o diálogo aberto e identificando a tela de origem. Capturas precisam aguardar o conteúdo definitivo; estados de carregamento só entram quando identificados como tais.

## Comportamento comum

Diálogo nativo com título acessível, foco contido, botão Fechar, Escape e retorno ao gatilho. Formulários mantêm validações, feedback e permissões de servidor; cancelar não grava. Destrutivos mantêm confirmação explícita. Revalidação de dados não pode apagar um código/feedback devolvido pela ação. Navegação concluída encerra o diálogo anterior. A animação respeita movimento reduzido.

## Inventário da reconstrução

| Origem | Modal / gatilho | Conteúdo e situação | Condição e resultado |
|---|---|---|---|
| Navegação global | Buscar uma área | Busca real de caminhos, sem busca em dados privados | Abre rota escolhida e fecha |
| Navegação móvel | Mais áreas e preferências | Menu real | Navega e fecha |
| Navegação global | Notificações | Esboço; não consulta nem envia avisos | Fecha sem gravação |
| /nucleos | Criar um núcleo | Escolha real entre criar e entrar com convite | Encaminha para o fluxo protegido |
| /nucleos/[id] | O que nos reúne | Propósito real do Núcleo | Exige vínculo; consulta |
| /nucleos/[id] | Conhecer esta área | Notificações; esboço explícito | Nenhum aviso real |
| /nucleos/[id]/agenda | Novo momento | Formulário real de evento | Criar por ação validada |
| /nucleos/[id]/agenda | Responder convite | Presença individual real | Responder e atualizar agenda |
| /nucleos/[id]/agenda | Editar evento | Formulário real | Somente autorizado; salvar |
| /nucleos/[id]/agenda | Remover evento | Confirmação real com ciência | Ação remove evento e respostas |
| /nucleos/[id]/pessoas | Convidar alguém / Preparar convite | Geração real de código | Administração; código visível sem envio falso |
| /nucleos/[id]/pessoas | Ver participação | Papéis, nomeação/aceite/recusa, retirada e remoção reais | Ações dependem da pessoa/papel, revalidadas no servidor |
| /nucleos/[id]/pessoas | Nome e propósito | Edição real de identidade | Administração e confirmação |
| /nucleos/[id]/pessoas | Quando alguém sai | Orientação real de consequências | Consulta; não executa saída |
| /nucleos/[id]/pessoas | Encerrar Núcleo para todos | Confirmação real por nome e ciência | Administração; histórico preservado |
| /nucleos/[id]/convites | Preparar convite | Geração real de código | Administração |
| /nucleos/[id]/convites | Revogar convite | Confirmação contextual real | Administração; revoga somente convite escolhido |
| /nucleos/[id]/acordos | Nova proposta | Formulário real de proposta | Publicar não aceita participação |
| /nucleos/[id]/acordos | Cartão de acordo | Termos, situação e participação reais | Somente Núcleo autorizado |
| /nucleos/[id]/acordos | Opções de visualização | Filtro real de situação | Navega com filtro validado |
| Acordo / detalhe | Registrar momento | Registro real de momento | Participação nos termos vigentes |
| Acordo / detalhe e período | Administrar acordo | Ativar/encerrar conforme situação | Administração, confirmação e versão |
| Acordo / termos | Alterar termos | Publicação real de versão | Novo aceite individual; histórico permanece |
| /conta conectada | Dados da conta | Dados reais da sessão | Somente própria conta |
| /conta conectada | Conta e segurança | Orientação real; sessões/dispositivos sinalizados como esboço | Recuperação por rota existente |
| /conta conectada | Sair da conta | Encerramento real da sessão | Vínculos preservados |
| /configuracoes | Visibilidade das próximas saídas | Preferência real de autoria | Salva preferência da própria pessoa |
| /configuracoes | Dados e autonomia | Orientação de dados; automações pendentes sinalizadas | Não simula exportação/exclusão |
| /configuracoes | Presença também precisa de silêncio | Notificações; esboço | Nenhuma preferência de envio gravada |
| /configuracoes | Preciso de orientação | Ajuda/contato e limites reais | Documentos pendentes sinalizados |
| /configuracoes | Conta e segurança | Conteúdo de segurança | Recursos futuros sinalizados |
| /configuracoes | Sair de um Núcleo | Orientação para escolher espaço | Não executa saída sem contexto |
| /nucleos/[id]/sair | Revisar minha saída | Consequências e confirmação reais | Saída individual, histórico preservado |
| Árvore/Memórias/Conexões/Perfis/Manifesto/Cuidado | O que está previsto nesta área? | Esboço de funcionalidade ainda não desenvolvido | Nada é salvo, enviado ou publicado |
| Memórias | Abrir detalhe da memória | Exemplo editorial; esboço | Sem arquivos/memórias reais |
| Conexões/Perfis | Explorar perfil em detalhe | Pessoa fictícia; esboço | Sem consulta ou edição de perfil real |

## Evidências e manutenção

Implementação compartilhada: src/shared/components/ui/action-dialog.tsx. Navegação global: application-shell.tsx. A reconstrução inclui um teste que visita todas as famílias de rotas, abre os gatilhos de diálogo, verifica fechamento/foco/overflow e captura seu conteúdo. Foram capturadas 85 aberturas de modais no aplicativo e 90 no Atlas. Título, gatilho e origem constam dos manifestos; busca, filtro Modal e filtro Atlas permitem conferência. [Galeria v3.0.0](../../wireframes/comparacoes/v3.0.0-2026-10-18-layout-novo-integral/index.html) · [registro e validações](../registros/registro-v3.0.0-2026-10-18-imp-reconstrucao-layout-novo-fun-interface-e-modais.md).
