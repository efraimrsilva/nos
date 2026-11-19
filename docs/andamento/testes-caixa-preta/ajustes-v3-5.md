# Ajustes e paridade de interface — v3.5.0

Criado em 03/11/2026. Todos os casos estão **Não executados pelo usuário**. Executar separadamente em computador/celular, informando navegador, largura e dispositivo; automação local não aprova estes casos. Não usar conta pessoal para operações destrutivas. Resultados/retestes devem ser acrescentados em [resultados.md](resultados.md), preservando falhas anteriores.

## MVP01 — Acesso e sessão

[] M01-AJU-001 | Não executado | MVP01, `/conta` e fluxo de nova senha, conta de teste | Preencher senha em login/cadastro/nova senha; usar Mostrar/Ocultar por toque e teclado antes de enviar | Esperado: alternância conserva valor e foco utilizável, não envia formulário, não altera validações; controle acompanha bloqueio durante envio.

[] M01-AJU-002 | Não executado | MVP01, sessão de teste no ambiente informado | Usar fluxo autenticado, recarregar e voltar após expiração do acesso; registrar tempo/ambiente sem tokens | Esperado: refresh válido preserva acesso e contexto; sessão inválida orienta entrar; indisponibilidade não é apresentada como credenciais incorretas. Investigar falha hospedada sem assumir que o teste local resolve sua causa.

## MVP03 — Acordos

[] M03-AJU-001 | Não executado | MVP03, Núcleo aberto e pessoa autorizada, `/nucleos/[id]/acordos` | Nova proposta; preencher, conferir, editar e publicar | Esperado: não oferece categoria; conserva termos ao editar; cria proposta pendente com prazo de Hábito; não aceita por outra pessoa nem inicia Experiência/Essência automaticamente.

[] M03-AJU-002 | Não executado | MVP03, duas contas de teste no mesmo Núcleo e proposta atual | Na conta A abrir Nova proposta e preencher rascunho; na B responder o acordo existente | Esperado: totais de A atualizam sem recarregar após consulta periódica, rascunho/modal permanecem; mostra somente números agregados, sem resposta individual de terceiros.

[] M03-AJU-003 | Não executado | MVP03, Acordos com totais já carregados | Simular indisponibilidade de rede; aguardar consulta; restaurar conexão; alternar aba oculta/visível | Esperado: erro não vira zero ou sucesso falso, preserva último total com aviso; sem valor anterior informa indisponibilidade; retorno recupera atualização sem apagar formulário.

[] M03-AJU-004 | Não executado | MVP03/MVP02, uma conta administradora e outra membro no mesmo Núcleo | Abrir Acordos nas duas contas; administrador usar Enviar convite; membro tentar destino de gestão sem permissão | Esperado: só administrador recebe gatilho e geração autorizada; membro não obtém código por contornar interface; não há envio externo anunciado sem execução.

[] M03-AJU-005 | Não executado | MVP03, acordos suficientes para busca/paginação, computador e celular | Buscar termo, limpar busca; abrir mesmo acordo em Kanban/Painéis e na lista móvel | Esperado: busca declara limite aos registros carregados; categoria/filtro antigo ausentes; termos, situação, totais e ações permitidas equivalentes; Essência permanece planejada.

## MVP04 — Agenda

[] M04-CAL-001 | Não executado | MVP04, `/nucleos/[id]/agenda`, computador e celular | Escolher dezembro de 2030 e avançar para janeiro de 2031; escolher outro mês/ano | Esperado: sete dias por semana, seis linhas, dias adjacentes, seletores e setas funcionais; nenhum corte fixo em 2030.

[] M04-CAL-002 | Não executado | MVP04, Agenda com evento de teste e semana que cruza mês | Escolher dia no mês; navegar semana anterior/próxima até cruzar o mês | Esperado: semana e seleção coerentes; mês escolhido é preservado enquanto intersecta a semana e acompanha a mudança quando necessário; marcador indica eventos carregados da página.

[] M04-CAL-003 | Não executado | MVP04/MVP05, temas escuros disponíveis | Alternar temas; abrir seletores de mês/ano; navegar por teclado | Esperado: dias, opções, seleção e foco legíveis, sem texto invisível; controles acessíveis em computador/celular.

[] M04-CAL-004 | Não executado | MVP04, mesma conta/evento, larguras acima e até 900 pixels | Abrir evento, criar, responder e usar gestão conforme papel | Esperado: calendário mensal em ambas; grade acima de 900 e lista até 900; apresentação não remove ações autorizadas nem introduz rolagem horizontal.

## MVP05 — Conta e aparência

[] M05-AJU-001 | Não executado | MVP05, computador, Núcleo ativo | Abrir perfil e as seções; fechar com botão/Escape/clique fora; repetir com movimento reduzido | Esperado: entrada suave sem alterar rota/Núcleo; movimento reduzido elimina animações aplicáveis; foco e ações continuam acessíveis. No celular perfil abre `/conta` completa, sem painel desktop.

[] M05-AJU-002 | Não executado | MVP05, `/conta` autenticada, conta de teste | Conferir Apagar minha conta em cada um dos nove temas; focar por teclado, abrir e cancelar confirmação | Esperado: texto/ícone/realce vermelhos e foco visível; exige APAGAR CONTA; cancelar preserva conta. Este caso não solicita confirmar exclusão.

[] M05-AJU-003 | Não executado | MVP01/MVP05, composição com árvore visível | Observar luzes após carregamento e repetir com preferência por movimento reduzido | Esperado: oito luzes decorativas distribuídas, sem foco/leitura assistiva; preferência reduz o movimento sem ocultar conteúdo ou impedir acesso.

## Navegação transversal — MVP02–05 e destinos da Expansão

[] NAV-AJU-001 | Não executado | Sessão e Núcleo ativos, desktop e celular | Comparar destinos da barra lateral com barra inferior/Mais; abrir cada destino | Esperado: mesmas áreas acessíveis, contexto correto e indicação de esboço preservada; Mais fecha ao navegar.

[] NAV-AJU-002 | Não executado | Núcleo com nome longo e caracteres acentuados | Conferir Início na lateral e barra móvel; usar leitor de tela quando disponível | Esperado: nome abreviado a 18/12 caracteres conforme apresentação, com reticências e nome completo acessível; link abre o mesmo Núcleo.

[] NAV-AJU-003 | Não executado | Versão do ambiente identificada no manifesto/build | Abrir Sua conta na lateral e Mais no celular | Esperado: versão visível coincide com o build servido, ao final da seção e sem linha inferior; divergência é registrada por ambiente, sem inferir deploy pelo número local.

[] NAV-AJU-004 | Não executado | Início do Núcleo e Pessoas, desktop e celular | Conferir cabeçalho, cartões, final de página e convites | Esperado: propósito não exposto no cabeçalho, Um lugar à mesa ausente, links secundários de rodapé e divisórias finais removidos; gestão do propósito e caminhos de convite continuam acessíveis.

[] NAV-AJU-005 | Não executado | Núcleo de teste com nome de oitenta caracteres sem espaços | Abrir Início e Acordos nas larguras desktop, intermediária e móvel; usar ações do cabeçalho | Esperado: nome/breadcrumb não sobrepõem nem bloqueiam ações, sem rolagem horizontal; abreviação mantém identificação acessível.

[] NAV-AJU-006 | Não executado | Acordo/evento com título longo sem espaços, pessoa autorizada | Abrir detalhe e demais diálogos afetados; fechar e retornar ao gatilho | Esperado: título quebra dentro do modal, corpo/ações cabem na largura, conteúdo acessível por rolagem vertical e foco preservado.

[] NAV-AJU-007 | Não executado | Celular com área segura inferior, ou emulação identificada | Abrir listas longas/última ação e rolar ao fim | Esperado: reserva inferior acompanha barra e área segura, sem conteúdo coberto; anotar se evidência é simulação em vez de aparelho físico.
