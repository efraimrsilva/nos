# Contrato permanente — identificação de modais na interface e no Atlas

**v3.7.2 · 05/11/2026.** “Encontrou algum problema?” é a expansão temporária do gatilho autenticado Relatar um problema. O aviso não abre o modal sozinho. A ação abre o mesmo formulário e fecha por X, Escape ou clique fora, devolvendo o foco ao ícone. [Registro](../registros/registro-v3.7.2-2026-11-05-imp-cabecalho-fun-lembrete-suporte.md).

**v3.7.1 · 05/11/2026.** O sino do cabeçalho autenticado abre o painel suspenso “Novidades, no seu tempo.” em desktop e celular. Fecha por Escape, X, clique fora ou destino. Leva a Acordos no Núcleo ou a Seus Núcleos sem contexto. A central é esboço. O cartão do Início continua com seu diálogo informativo e Relatar um problema permanece modal de formulário. [Registro](../registros/registro-v3.7.1-2026-11-05-imp-cabecalho-fun-preferencias.md).

## Modal de relato — v3.7.0 — validado localmente

| Origem | Nome/gatilho | Conteúdo e permissão | Resultado/cancelamento/situação |
|---|---|---|---|
| Conta, perfil, Mais, orientação e cabeçalho autenticado | Relatar um problema; ícone Bug no cabeçalho | Descrição obrigatória e passos opcionais; conta com e-mail confirmado, sessão conferida no servidor | Pendente bloqueia duplicação, sucesso após aceite SMTP, erro preserva texto. X/Escape/fora seguem ActionDialog; cancelar antes de enviar não envia. Prova local e autenticação SMTP real aprovadas; implantação e recebimento externo não certificados. |

[Contrato](relato-problemas.md) · [registro](../registros/registro-v3.7.0-2026-11-03-imp-suporte-fun-relato-problemas.md). Sem nova rota nem ficha artificial; representado nas fichas66/70 e navegação compartilhada. Limite de1min por conta no banco, sem persistência do conteúdo do relato.

Status: regra permanente vigente por decisão do usuário em 2026-10-18. Inventário atualizado para v3.7.0 em 03/11/2026; a reconstrução v3.0.0 permanece como evidência histórica.

## Integrantes em lista — v3.6.2

Modal Integrantes do Núcleo73 apresenta lista Nome/Papel/Nomeação. Nome substitui o gatilho Ver participação e abre o mesmo diálogo individual com ações permitidas; nenhum botão extra. No mobile, nomeação pendente sob o nome. Sem mudança de autorização, confirmação ou fechamento externo. [Registro](../registros/registro-v3.6.2-2026-11-03-imp-integrantes-fun-lista-compacta.md).

Atualização final3.6.2: lista somente Nome/Papel; Nomeação retirada também no mobile e mantida apenas nos detalhes. Largura horizontal do modal limitada ao padrão580px desktop, com limite de viewport no celular.

## Regra permanente

Toda tela, rota, ficha, implementação e documentação do Nós deve indicar explicitamente quais partes são **modais**. O Atlas deve tornar essa identificação visível no gatilho e na inspeção da tela. Uma navegação para outra rota não deve ser classificada como modal.

Para cada modal, registrar: rota/área de origem; nome; gatilho; conteúdo/objetivo; tipo (diálogo de formulário, detalhe, confirmação ou navegação); condições de sessão/permissão; integração real ou esboço; resultado esperado e destino; cancelamento/fechamento; evidência visual. Quando o recurso ainda não existir, usar **Esboço de funcionalidade · ainda não desenvolvido** também dentro do modal.

Toda entrega que crie, altere ou remova modal deve atualizar este inventário, as fichas/ações/estados do Atlas e o registro versionado da entrega. A galeria deve ter filtros para **Telas** e **Modais**, fotografando o diálogo aberto e identificando a tela de origem. Capturas precisam aguardar o conteúdo definitivo; estados de carregamento só entram quando identificados como tais.

## Comportamento comum

Diálogo nativo com título acessível, foco contido, botão Fechar, Escape e retorno ao gatilho. Formulários mantêm validações, feedback e permissões de servidor; cancelar não grava. Destrutivos mantêm confirmação explícita. Revalidação de dados não pode apagar um código/feedback devolvido pela ação. Navegação concluída encerra o diálogo anterior. A animação respeita movimento reduzido.

## Inventário da reconstrução

| Origem | Modal / gatilho | Conteúdo e situação | Condição e resultado |
|---|---|---|---|
| Navegação global | Buscar uma área — removido em v3.3.1 | Lupa, modal e busca do topo removidos | Sem gatilho vigente |
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
| /nucleos/[id]/acordos | Opções de visualização — removido em v3.5.0 | Filtro histórico retirado | Sem gatilho vigente |
| Acordo / detalhe | Registrar momento | Registro real de momento | Participação nos termos vigentes |
| Acordo / detalhe e período | Administrar acordo | Ativar/encerrar conforme situação | Administração, confirmação e versão |
| Acordo / termos | Alterar termos | Publicação real de versão | Novo aceite individual; histórico permanece |
| /conta conectada e painel do perfil desktop | Dados da conta — v3.4.0 | Consulta real; lápis abre edição do nome no mesmo modal, Salvar nome/Cancelar; erros e progresso | Somente própria conta, validada no servidor; trim e 1–80 caracteres; fechar antes de enviar descarta rascunho; sucesso atualiza nome/iniciais; Atlas demonstra sem gravação real. Contrato: [nome do perfil](nome-perfil.md) |
| /conta com ou sem sessão; /conta/confirmar-email abre o diálogo | Confirmar e-mail / Preciso confirmar meu e-mail | Estado real do endereço; confirmado informa no próprio modal; pendente solicita envio; falha e conta inexistente exibem alerta | Com sessão, confirmado aparece ao abrir e pendente vem preenchido; sem sessão, consulta após informar endereço. Fecha por botão/Escape sem navegar; preserva next. Migração aplicada e código4ba6b46 publicado em 27/10/2026; fluxo público conferido em produção no computador/celular. [Evidência desktop/celular](../../wireframes/comparacoes/2026-10-27-confirmacao-email/index.html) |
| /conta conectada | Conta e segurança — removido em v3.3.1 | Recuperação e saída seguem em Entrar e recuperar; exclusão em bloco próprio | Rotas antigas preservadas |
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

## Fechamento externo — v3.6.1

Todos os modais atuais e futuros fecham por clique ou toque externo, além de X e Escape. DialogBackdropDismiss, inscrito uma vez no layout raiz, cobre ActionDialog, notificações, Mais e diálogos nativos criados depois da hidratação. Gesto deve começar e terminar fora do mesmo diálogo; padding/conteúdo e arraste iniciado dentro não fecham. Somente a camada superior fecha. close() mantém foco, onClose e regras próprias de reset/cancelamento; fechar não equivale a confirmar uma operação. Popover mantém comportamento externo nativo. Atlas replica a regra offline. [Registro](../registros/registro-v3.6.1-2026-11-03-imp-modais-fun-fechamento-externo.md).

## Redistribuição de Pessoas — v3.6.0 — validado localmente

Todas as funções abaixo são reais no aplicativo; o Atlas usa exemplos offline. [Contrato](organizacao-nucleo.md) e [roteiro](../testes-caixa-preta/organizacao-nucleo.md).

| Origem / gatilho | Modal | Permissão / integração | Resultado / cancelamento |
|---|---|---|---|
| Início13, lápis junto ao nome | Editar nome do Núcleo | Administrador; update_nucleus_identity altera só name | Feedback local e cabeçalho atualizado; fechar sem salvar não grava; foco retorna ao lápis |
| Início13, lápis junto ao propósito | Editar propósito do Núcleo | Administrador; mesma RPC altera só purpose | Nome preservado; confirmação e feedback locais; fechar não grava |
| Início13, Núcleos onde estou / Ver integrantes | Integrantes do Núcleo (ID73 preservado) | Pessoa associada; get_nucleus_management retorna lista completa | Sem navegação ao abrir; fechar volta ao Início; /pessoas só redireciona |
| Integrantes / Ver participação | Participação de pessoa | Nomeação, aceite/recusa, deixar/retirar administração e remoção, conforme papel | Mesmas permissões e confirmações anteriores; feedback não desaparece com seu formulário; cancelar não grava |
| Conta66/popover/Mais, abaixo Seus Núcleos | Gerenciar convites | Administrador escolhe Núcleo; links para /convites | Gestão gera/revoga pelo contrato existente; navegar fecha menu e modal anteriores |
| Conta66/popover/Mais | Sair de um Núcleo | Pessoa associada; avisos, autoria e ciência; leave_nucleus | Sucesso retorna /nucleos; cancelar mantém vínculo; troca de Núcleo reinicia confirmação |
| Conta66/popover/Mais, abaixo saída | Encerrar Núcleo para todos | Administrador; close_nucleus valida nome atual e ciência | Mesmos avisos/efeitos; estilo vermelho e animação de Apagar minha conta; sucesso /nucleos?resultado=encerrado; cancelar não grava |

Removidos: gatilho combinado Nome e propósito e acesso Pessoas na navegação. Entrada por convite da Conta retirada, mas rota e atalho em Seus Núcleos preservados. Conta/popover/Mais reutilizam AccountPreferences com IDs distintos. Links no Mais encerram a camada anterior, inclusive ao navegar para preferências de autoria. Diálogos, microinterações e movimento reduzido seguem os componentes existentes.

## Atualização vigente — v3.5.0

| Origem | Modal / gatilho | Conteúdo e permissão | Resultado, cancelamento e situação |
|---|---|---|---|
| Acordos | Nova proposta | Formulário real sem seleção de categoria; servidor força início como Hábito pendente | Conferir/editar preserva campos; fechar antes de enviar não publica; publicar não aceita por terceiros |
| Acordos | Enviar convite | Geração existente; gatilho somente para administrador, autorização no servidor/banco | Código real após sucesso, sem envio externo simulado; fechar não aceita convite |
| Acordos | Cartão de acordo / linha móvel | Termos, situação e ações da própria participação; totais agregados atualizados | Mesmas ações autorizadas nas duas apresentações; fechar não responde nem apaga rascunho da proposta |
| Acordos | Opções de visualização — removido | Seletor de categoria e diálogo de filtro retirados | Sem gatilho vigente; busca da página permanece |
| Perfil desktop | Conta, Preferências e Ajuda | Painel nativo real, seis seções, agora com entrada suave e movimento reduzido | Fechar, Escape ou clique fora preserva rota/Núcleo; no celular o perfil navega para `/conta`, sem painel desktop |
| Navegação móvel | Mais áreas e preferências | Menu real com destinos complementares e versão do manifesto ao final de Sua conta | Selecionar destino fecha o diálogo; versão não é ação |

Calendário mensal e Mostrar/Ocultar senha são controles na própria composição, não modais. A remoção visual do propósito no cabeçalho não remove o diálogo O que nos reúne. Casos e limites estão no [roteiro v3.5.0](../testes-caixa-preta/ajustes-v3-5.md); [registros desta entrega](../registros/registro-v3.5.0-2026-11-03-05-imp-validacao-fun-paridade-e-rastreabilidade.md). Capturas/Atlas finais devem ser vinculados no fechamento; os números históricos abaixo não comprovam esses novos estados.

## Atualização v3.3.1 — perfil e conta

Perfil desktop: popover não modal com seis seções, gatilho no avatar, sessão necessária, fechamento nativo por Escape/clique fora/botão e retorno ao Núcleo. Dados da conta, recuperação, confirmação, saída, Aparência, privacidade e ajuda reutilizam os diálogos existentes dentro do painel; ao fechar retornam ao gatilho. Notificações e exclusão ficam apenas na página completa. Exclusão mantém APAGAR CONTA; nenhuma exclusão real foi executada na verificação. Tela 69 do Atlas representa essa confirmação. [Galeria e resultados](../registros/registro-v3.3.1-2026-10-29-imp-conta-perfil-fun-navegacao-contextual.md).

## Atualização — v3.1.0 — 23/10/2026

**Apagar minha conta:** gatilho vermelho e com alerta dentro de Conta e segurança, nas origens /conta conectada, /configuracoes e /configuracoes/conta. Finalidade: apresentar consequências e coletar APAGAR CONTA. Permissão: somente titular autenticado; servidor e banco revalidam. Resultado real: exclusão da conta e identificação, saída de todos os Núcleos e preservação do histórico como Conta excluída. Situação: implementado e testado localmente; banco remoto e publicação pendentes. Cancelar/X/Escape limpam a frase. Atlas oferece somente demonstração, sem exclusão real. Substitui a informação anterior de que toda exclusão dependeria de suporte; exportação/correção e tratamento de arquivos permanecem pelo atendimento. [Contrato](exclusao-conta.md) · [galeria](../../wireframes/comparacoes/v3.1.0-2026-10-23-exclusao-conta/index.html).

**Produção v3.1.0 — 23/10/2026:** migração e código8afecb2 publicados, deploy6adae350fa2928885a0de2c8. Exclusão da conta validada online em desktop/celular; quatro contas descartáveis removidas e dados anteriores preservados em15 tabelas. O status remoto pendente do bloco anterior foi concluído.
