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
| /conta com ou sem sessão; /conta/confirmar-email abre o diálogo | Confirmar e-mail / Preciso confirmar meu e-mail | Estado real do endereço; confirmado informa no próprio modal; pendente solicita envio; falha e conta inexistente exibem alerta | Com sessão, confirmado aparece ao abrir e pendente vem preenchido; sem sessão, consulta após informar endereço. Fecha por botão/Escape sem navegar; preserva next. Migração aplicada e código4ba6b46 publicado em 27/10/2026; fluxo público conferido em produção no computador/celular. [Evidência desktop/celular](../../wireframes/comparacoes/2026-10-27-confirmacao-email/index.html) |
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

## Atualização — v3.1.0 — 23/10/2026

**Apagar minha conta:** gatilho vermelho e com alerta dentro de Conta e segurança, nas origens /conta conectada, /configuracoes e /configuracoes/conta. Finalidade: apresentar consequências e coletar APAGAR CONTA. Permissão: somente titular autenticado; servidor e banco revalidam. Resultado real: exclusão da conta e identificação, saída de todos os Núcleos e preservação do histórico como Conta excluída. Situação: implementado e testado localmente; banco remoto e publicação pendentes. Cancelar/X/Escape limpam a frase. Atlas oferece somente demonstração, sem exclusão real. Substitui a informação anterior de que toda exclusão dependeria de suporte; exportação/correção e tratamento de arquivos permanecem pelo atendimento. [Contrato](exclusao-conta.md) · [galeria](../../wireframes/comparacoes/v3.1.0-2026-10-23-exclusao-conta/index.html).

**Produção v3.1.0 — 23/10/2026:** migração e código8afecb2 publicados, deploy6adae350fa2928885a0de2c8. Exclusão da conta validada online em desktop/celular; quatro contas descartáveis removidas e dados anteriores preservados em15 tabelas. O status remoto pendente do bloco anterior foi concluído.
