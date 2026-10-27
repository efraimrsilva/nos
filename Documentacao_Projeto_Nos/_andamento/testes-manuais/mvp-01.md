# Testes manuais — MVP 01 — v3.1.2

Criado em 2026-10-23. Status: roteiro revisado; execução manual pendente. Referência: [Atlas MVP](../../wireframes/atlas/index.html#mvp), etapa Começar pelo login existente; Telas 01, 02, 03, 04, 05 e 72. MVP significa Produto Mínimo Viável. Nenhum item foi executado nesta entrega.

Atualizado em 2026-10-27: 80 casos no total. Confirmação de e-mail v3.1.2 agrupada nesta mesma etapa, com revisão de M01-019, M01-021 e M01-025 e inclusão de M01-063 a M01-080. Os IDs anteriores permanecem estáveis. Para testar apenas esta alteração, execute primeiro M01-018 a M01-025 e M01-063 a M01-080. Confirme a versão publicada e a aplicação da migração antes de atribuir o resultado à v3.1.2; o código local e os testes automatizados não comprovam produção.

## Preparação e ordem

Use a URL do ambiente escolhido como base dos caminhos e registre ambiente, versão implantada, navegador e dispositivo no controle. Versão do repositório não comprova versão online. Separe uma conta própria de teste confirmada, endereços/aliases próprios novos e dois navegadores independentes. Senhas somente no gerenciador, nunca no controle ou chat. Use caixa de e-mail acessível e respeite intervalos/limites do provedor. Recuperação altera senha e revoga renovações de sessão: use conta de teste. Falhas controladas, limites e expiração podem ser marcados Bloqueado com motivo; não provoque indisponibilidade em produção.

Execute na ordem das seções. Casos que consumirem ou vencerem um link exigem nova solicitação para o próximo caso. Repita jornadas principais no computador e celular; resultados por dispositivo ficam separados. Convite aqui testa autenticação/retorno; criação e aceite pertencem ao MVP 02. Direitos ampliados e exclusão pertencem ao MVP 05. Login social pertence à expansão de plataformas.

**E-mail documentado:** o registro de 20/10 comprova recebimento pela Brevo e configuração do segredo de recuperação em produção; substitui a espera pelo Gmail. Troca completa de senha pelo link não foi certificada naquela operação. Esta lista exige nova evidência no ambiente testado. [Registro operacional](../registros/registro-v3.0.3-2026-10-20-03-imp-envio-brevo-fun-autenticacao-email.md).

Formato solicitado: `[] ID | MVP/Expansão | caminho e ação | Esperado: resultado`. Uma linha por teste. IDs estáveis, sem reutilização; resultados e retestes em [resultados.md](resultados.md).

## Entrada e acolhimento

[] M01-001 | MVP 01 | Sem sessão, abrir `/` diretamente | Esperado: chegar a `/conta`, sem precisar passar pelas boas-vindas.
[] M01-002 | MVP 01 | Abrir `/boas-vindas` e clicar em Começar agora | Esperado: abrir `/conta` na aba Criar conta.
[] M01-003 | MVP 01 | Em `/boas-vindas`, clicar em Entrar na minha conta | Esperado: abrir `/conta?modo=login` na aba Já tenho conta.
[] M01-004 | MVP 01 | Em `/conta`, clicar em Voltar às boas-vindas e retornar pelos dois botões | Esperado: navegação livre, sem cadastro, sessão ou Núcleo criado.
[] M01-005 | MVP 01 | Em `/conta`, alternar Criar conta e Já tenho conta após preencher campos ou provocar erro | Esperado: campos e mensagens reiniciados conforme o modo; Nome e regra de senha aparecem no cadastro; árvore e painel mantêm composição estável.

## Cadastro

[] M01-006 | MVP 01 | Em `/conta` → Criar conta, enviar todos os campos vazios | Esperado: aviso pedindo nome, e-mail e senha; permanecer no formulário.
[] M01-007 | MVP 01 | Em `/conta` → Criar conta, informar nome somente com espaços, e-mail válido e senha válida | Esperado: nome recusado, sem criar conta.
[] M01-008 | MVP 01 | Em `/conta` → Criar conta, preencher nome de 80 caracteres e depois tentar ultrapassar esse limite | Esperado: aceitar o limite e impedir ou rejeitar o excedente, sem quebrar o formulário.
[] M01-009 | MVP 01 | Em `/conta` → Criar conta, preencher nome e senha válidos e usar e-mail sem @ ou sem domínio completo | Esperado: aviso de e-mail inválido, sem prosseguir.
[] M01-010 | MVP 01 | Em `/conta` → Criar conta, testar separadamente senha com 7 caracteres, sem letra, sem número e sem símbolo | Esperado: cada tentativa recusada com orientação de pelo menos 8 caracteres, letra, número e símbolo.
[] M01-011 | MVP 01 | Em `/conta` → Criar conta, usar e-mails de teste diferentes para senhas válidas de 8 e de 128 caracteres; depois tentar 129 caracteres | Esperado: limites válidos aceitos e excedente recusado; nenhuma senha exposta na tela.
[] M01-012 | MVP 01 | Em `/conta` → Criar conta, cadastrar nome com acento, e-mail próprio novo e senha válida | Esperado: seguir para `/conta/confirmar-email` quando a confirmação estiver ativa; não criar Núcleo nem associação.
[] M01-013 | MVP 01 | Em `/conta` → Criar conta, cadastrar novamente um e-mail já confirmado | Esperado: aviso de conta existente no próprio formulário, indicando Já tenho conta ou Esqueci minha senha; não prometer novo e-mail de confirmação.
[] M01-014 | MVP 01 | Após o aviso de conta existente, usar Já tenho conta e entrar com a senha correta | Esperado: acesso à conta original, sem conta duplicada.
[] M01-015 | MVP 01 | Em `/conta` → Criar conta, clicar duas vezes em Criar conta durante o envio | Esperado: botão ocupado/desabilitado e apenas uma submissão em andamento, sem duplicar cadastro.

## Confirmação de e-mail

[] M01-016 | MVP 01 | Após cadastro novo, conferir caixa de entrada e spam | Esperado: receber confirmação referente ao ambiente testado; o link deve conduzir ao aplicativo correto. Sem recebimento, registrar como falha de entrega ou bloqueio identificado.
[] M01-017 | MVP 01 | Com conta ainda não confirmada, tentar entrar em `/conta?modo=login` | Esperado: acesso privado recusado enquanto a confirmação for obrigatória; não entrar em Núcleos.
[] M01-018 | MVP 01 | Em `/conta` → Preciso confirmar meu e-mail, enviar campo vazio e depois e-mail malformado | Esperado: validação clara, sem solicitar envio inválido.
[] M01-019 | MVP 01 | Sem sessão, em `/conta/confirmar-email`, informar e-mail próprio de cadastro pendente e clicar em Reenviar confirmação | Esperado: consultar o estado e, após sucesso do envio, mostrar no mesmo modal “Enviamos a confirmação para o seu e-mail”, manter o endereço preenchido e exibir intervalo de 60 segundos; conferir recebimento na caixa de entrada/spam separadamente, pois a resposta do formulário não comprova entrega.
[] M01-020 | MVP 01 | Em `/conta/confirmar-email`, tentar novo envio antes e depois do intervalo exibido | Esperado: botão bloqueado durante a contagem e liberado ao terminar, respeitando limites adicionais do serviço.
[] M01-021 | MVP 01 | Em `/conta/confirmar-email`, solicitar confirmação para endereço sob seu controle que ainda não possui conta | Esperado: alerta “Não encontramos uma conta para este e-mail”, com orientação para conferir o endereço ou criar conta; não anunciar envio, não mostrar confirmação concluída e manter o campo preenchido. A recuperação de senha continua com resposta neutra.
[] M01-022 | MVP 01 | Abrir o link de confirmação recém-recebido no navegador que fez o cadastro | Esperado: confirmar e-mail e chegar a `/nucleos` quando não houver destino específico.
[] M01-023 | MVP 01 | Reabrir o link de confirmação já consumido | Esperado: não criar novo acesso indevido; exibir orientação de link inválido/usado e caminho para entrar ou solicitar outro.
[] M01-024 | MVP 01 | Usar um link de confirmação vencido e, separadamente, abrir `/auth/confirm` sem parâmetros | Esperado: falha tratada, sem página quebrada, com caminho para solicitar outra confirmação.
[] M01-025 | MVP 01 | Sem sessão, abrir `/conta/confirmar-email?next=/comecar/convite` e fechar o modal pelo botão Fechar Confirmar e-mail | Esperado: continuar na Conta, aba Já tenho conta, com o destino interno preservado; abrir a rota é navegação que apresenta o modal, e fechá-lo não autentica nem aceita convite.

### Confirmação v3.1.2 — resultado imediato com e sem login

Preparação específica: use uma conta própria confirmada, uma conta própria pendente e um endereço próprio ainda sem cadastro. Saia da conta ou use uma janela privativa para os casos sem sessão. Cada execução registra dispositivo/navegador separadamente. Falhas de serviço, SMTP, migração ausente, limite e sessão de conta pendente só devem ser reproduzidos em ambiente controlado; sem essa condição, marque Bloqueado com o motivo, sem alterar configuração de produção. Confira [registro da alteração](../registros/registro-v3.1.2-2026-10-27-imp-confirmacao-fun-estado-email.md) e [referência visual](../../wireframes/comparacoes/2026-10-27-confirmacao-email/index.html).

[] M01-063 | MVP 01 · Tela 03 · sem sessão | Em `/conta` → Preciso confirmar meu e-mail, informar endereço de uma conta já confirmada e clicar em Reenviar confirmação | Esperado: mostrar “Este e-mail já está confirmado” no próprio modal, sem mensagem de envio, sem iniciar nova contagem e sem exigir login para consultar o estado.
[] M01-064 | MVP 01 · Tela 03 · sem sessão | Abrir diretamente `/conta/confirmar-email` em janela privativa | Esperado: chegar à Conta com o modal Confirmar e-mail aberto; solicitar o endereço antes da consulta; apenas abrir a tela não anuncia confirmação concluída nem envio.
[] M01-065 | MVP 01 · Telas 69/03 · com sessão | Entrar com conta confirmada, abrir `/conta` e clicar na linha Confirmar e-mail | Esperado: informar imediatamente “Seu e-mail já está confirmado”, sem campo de e-mail ou botão Reenviar confirmação no modal e sem solicitar outro e-mail.
[] M01-066 | MVP 01 · Tela 03 · com sessão | Com conta confirmada conectada, abrir diretamente `/conta/confirmar-email` | Esperado: modal aberto com confirmação concluída imediatamente; continuar conectado à mesma conta e não exibir o formulário público de reenvio.
[] M01-067 | MVP 01 · Tela 03 · com sessão pendente | Somente em ambiente controlado que permita sessão de conta ainda pendente, abrir o modal e reenviar | Esperado: endereço da conta preenchido; após envio bem-sucedido, mostrar a mensagem de confirmação enviada no mesmo modal e preservar o endereço. Se a confirmação obrigatória impedir criar essa sessão, registrar Bloqueado, sem desabilitar a proteção em produção.
[] M01-068 | MVP 01 · Tela 03 · normalização | Sem sessão, consultar uma conta confirmada usando maiúsculas e espaços antes/depois do e-mail | Esperado: reconhecer o mesmo endereço e informar que já está confirmado, sem tratá-lo como inexistente ou prometer envio.
[] M01-069 | MVP 01 · Tela 03 · normalização e entrega | Com endereço próprio pendente, reenviar usando maiúsculas e espaços nas extremidades | Esperado: reconhecer a conta pendente, anunciar envio apenas após sucesso e receber a mensagem no endereço correspondente; respeitar o intervalo do provedor.
[] M01-070 | MVP 01 · Tela 03 · manutenção do campo | Informar um endereço próprio inexistente, observar o alerta e corrigir para uma conta confirmada antes de enviar novamente | Esperado: cada resposta corresponde ao endereço efetivamente enviado; o campo não é apagado após a resposta e a segunda consulta informa confirmação concluída.
[] M01-071 | MVP 01 · Tela 03 · falha de consulta | Em ambiente controlado, tornar indisponível a consulta do estado e solicitar confirmação para uma conta de teste | Esperado: alerta “Não foi possível verificar a confirmação deste e-mail”, sem mensagem de confirmação concluída ou enviada e sem tentativa de reenvio; registrar evidência técnica sem credenciais.
[] M01-072 | MVP 01 · Tela 03 · migração ausente | Somente em ambiente descartável sem a migração de consulta, abrir o modal público e solicitar confirmação | Esperado: tratar a ausência da consulta com alerta, sem página quebrada nem anúncio de envio; com a migração aplicada, repetir e registrar um reteste separado. Não remover funções de produção para executar este caso.
[] M01-073 | MVP 01 · Tela 03 · falha de envio | Em ambiente controlado com conta pendente, provocar falha SMTP ou de transporte após a consulta do estado | Esperado: alerta “Não foi possível enviar a confirmação”, endereço preservado e intervalo de tentativa visível; nunca apresentar sucesso de envio nessa resposta.
[] M01-074 | MVP 01 · Tela 03 · limite do serviço | Em ambiente controlado, simular resposta de limite de solicitações ao reenviar para conta pendente | Esperado: aviso para aguardar, sem mensagem de envio bem-sucedido; não provocar excesso de solicitações em produção para reproduzir o limite.
[] M01-075 | MVP 01 · Tela 03 · confirmação durante intervalo | No mesmo navegador, reenviar para uma conta pendente e, antes dos 60 segundos, recarregar `/conta/confirmar-email` e consultar outra conta própria já confirmada | Esperado: a consulta da conta confirmada informa o resultado mesmo com intervalo de reenvio ainda ativo; não consome outro envio nem retorna bloqueio de intervalo para esse endereço confirmado.
[] M01-076 | MVP 01 · Tela 03 · submissão repetida | Com conta pendente e conexão lenta controlada, clicar em Reenviar confirmação e tentar clicar novamente enquanto processa | Esperado: botão e campo ocupados/desabilitados durante a ação, uma solicitação em andamento e resultado exibido no mesmo modal; repetir não deve disparar envios simultâneos pelo formulário.
[] M01-077 | MVP 01 · Tela 03 · retorno interno | Abrir `/conta/confirmar-email?next=/comecar/convite`, consultar conta confirmada e fechar o modal; depois fazer login nessa conta | Esperado: resultado permanece no modal até fechá-lo, destino interno preservado e login retorna à inserção do convite, sem aceitar convite automaticamente.
[] M01-078 | MVP 01 · Tela 03 · teclado e foco | Abrir o modal pelo gatilho usando teclado, consultar um e-mail confirmado e fechar com Escape; repetir fechando pelo botão | Esperado: foco visível e contido no diálogo, resultado acessível e foco devolvido ao gatilho após fechar; nenhum envio provocado pelo fechamento.
[] M01-079 | MVP 01 · Tela 03 · computador e celular | Repetir M01-063, M01-065 e M01-019 no computador e no celular; no computador usar zoom de 200% | Esperado: resultado, campo quando aplicável e botão Fechar acessíveis, sem corte ou rolagem horizontal que impeça leitura; registrar cada dispositivo separadamente.
[] M01-080 | MVP 01 · Telas 03/04 · regressão | Consultar conta confirmada em Confirmar e-mail e depois abrir Recuperar acesso para conta própria existente e endereço próprio inexistente, respeitando intervalos | Esperado: confirmação distingue o estado do endereço, enquanto recuperação continua com mensagem neutra equivalente, sem revelar cadastro; a mudança da confirmação não altera senha nem inicia recuperação por si só.

## Login e sessão

[] M01-026 | MVP 01 | Em `/conta?modo=login`, enviar campos vazios e depois e-mail malformado | Esperado: validação clara, sem abrir área privada.
[] M01-027 | MVP 01 | Em `/conta?modo=login`, usar conta existente com senha errada e depois e-mail inexistente com senha qualquer | Esperado: mensagem genérica de credenciais recusadas, sem revelar qual dado está errado.
[] M01-028 | MVP 01 | Em `/conta?modo=login`, entrar com conta confirmada e senha correta | Esperado: abrir `/nucleos`; boas-vindas e criação de Núcleo não são obrigatórias.
[] M01-029 | MVP 01 | Em `/conta?modo=login`, usar o e-mail confirmado com maiúsculas e espaços nas extremidades | Esperado: normalizar e-mail e permitir login; senha permanece exata.
[] M01-030 | MVP 01 | Após login, atualizar `/nucleos` e abrir `/` em nova aba do mesmo navegador | Esperado: sessão mantida e raiz encaminhando para `/nucleos`.
[] M01-031 | MVP 01 | Autenticado, abrir `/conta` → Dados da conta | Esperado: mostrar nome, e-mail e situação de confirmação da pessoa conectada, sem dados de outra conta.
[] M01-032 | MVP 01 | Autenticado, abrir `/conta` → Continuar para o Nós | Esperado: seguir para `/nucleos` ou para o destino interno preservado.
[] M01-033 | MVP 01 | Em `/conta` → Sair da conta, abrir o diálogo e cancelá-lo por um controle disponível | Esperado: continuar conectado; nenhum vínculo removido.
[] M01-034 | MVP 01 | Em `/conta` → Sair da conta, confirmar a saída; depois tentar `/nucleos` e atualizar uma aba privada antiga | Esperado: pedir login; entrar novamente preserva os Núcleos existentes.
[] M01-035 | MVP 01 | Sem sessão, abrir diretamente `/nucleos`, `/comecar` e `/comecar/convite` | Esperado: pedir login antes de mostrar conteúdo protegido ou permitir ações.

## Retorno após autenticação

[] M01-036 | MVP 01 | Sem sessão, abrir `/comecar/convite` e fazer login quando solicitado | Esperado: voltar à inserção de convite, sem aceitar convite automaticamente.
[] M01-037 | MVP 01 | Sem sessão, abrir `/conta?next=/comecar/convite`, cadastrar conta nova e confirmar o e-mail | Esperado: manter o destino e chegar à inserção de convite, sem criar associação.
[] M01-038 | MVP 01 | Abrir `/conta?modo=login&next=https://example.com` e entrar com conta de teste | Esperado: ignorar destino externo e abrir `/nucleos`, sem sair do aplicativo.
[] M01-039 | MVP 01 | Sem sessão, abrir `/conta?modo=login&next=/comecar/convite` → Esqueci minha senha; concluir recuperação e novo login | Esperado: preservar destino de convite até o final, sem aceite automático.

## Recuperação e nova senha

[] M01-040 | MVP 01 | Em `/conta` → Esqueci minha senha, enviar campo vazio e depois e-mail inválido | Esperado: orientar correção sem solicitar recuperação inválida.
[] M01-041 | MVP 01 | Em `/conta/recuperar`, solicitar link para conta existente e depois para e-mail inexistente, respeitando o intervalo | Esperado: respostas neutras equivalentes, sem revelar cadastro.
[] M01-042 | MVP 01 | Em `/conta/recuperar`, tentar repetir solicitação durante e após a contagem de 60 segundos | Esperado: bloqueio temporário visível e nova tentativa liberada ao final, sujeita aos limites do serviço.
[] M01-043 | MVP 01 | Após solicitar recuperação da conta de teste, conferir caixa de entrada e spam | Esperado: receber mensagem com link para o ambiente correto; resposta do formulário sozinha não comprova entrega.
[] M01-044 | MVP 01 | Abrir recuperação recém-recebida no navegador que a solicitou | Esperado: chegar a `/conta/nova-senha` autorizado, sem credenciais de recuperação na URL final.
[] M01-045 | MVP 01 | Sem abrir link, acessar `/conta/nova-senha` deslogado e depois com login comum | Esperado: ambos sem autorização para salvar nova senha; oferecer Solicitar outro link.
[] M01-046 | MVP 01 | Com link válido aberto, em `/conta/nova-senha`, enviar campos vazios e depois duas senhas diferentes | Esperado: recusar ambas as tentativas, sem alterar a senha atual.
[] M01-047 | MVP 01 | Com recuperação válida, testar senha com menos de 8 caracteres e, separadamente, sem letra, sem número ou sem símbolo | Esperado: recusar cada senha e mostrar a política vigente.
[] M01-048 | MVP 01 | Com recuperação válida, colar senha válida e confirmação usando gerenciador ou área de transferência | Esperado: permitir colagem, manter conteúdo mascarado e aceitar valores iguais.
[] M01-049 | MVP 01 | Em `/conta/nova-senha`, salvar senha válida e igual nos dois campos | Esperado: voltar ao login com aviso de senha atualizada; exigir novo acesso.
[] M01-050 | MVP 01 | Após redefinir senha, tentar login com a senha antiga e depois com a nova | Esperado: antiga recusada e nova aceita na mesma conta, com vínculos preservados.
[] M01-051 | MVP 01 | Reabrir o link de recuperação já utilizado e, separadamente, abrir `/auth/recovery` sem parâmetros | Esperado: não autorizar nova alteração; orientar solicitação de outro link.
[] M01-052 | MVP 01 | Usar link de recuperação vencido e depois um link recém-recebido | Esperado: vencido recusado; novo permite reiniciar o fluxo.
[] M01-053 | MVP 01 | Abrir link válido de recuperação, aguardar mais de 15 minutos sem salvar e tentar alterar a senha | Esperado: prova de recuperação vencida; nenhuma alteração; solicitar novo link.
[] M01-054 | MVP 01 | Manter conta de teste conectada em dois navegadores; redefinir senha no primeiro e tentar renovar a sessão no segundo após expirar o acesso vigente | Esperado: segunda sessão não se renova e exige login; token de acesso já emitido pode valer até expirar.
[] M01-055 | MVP 01 | Em Recuperar acesso e Redefinir senha, usar Voltar para Conta; em Redefinir senha, usar Solicitar outro link | Esperado: voltar ao login ou à recuperação conforme a ação, preservando destino interno.
[] M01-056 | MVP 01 | Abrir link de recuperação em outro navegador | Esperado: template direto pode autorizar; fluxo dependente do navegador de origem deve recusar com orientação para reiniciar, sem acesso indevido.

## Experiência, acessibilidade e falhas controladas

[] M01-057 | MVP 01 | Percorrer cadastro, login, confirmação e recuperação usando somente Tab, Shift+Tab e Enter | Esperado: foco visível, ordem compreensível e ações alcançáveis sem mouse.
[] M01-058 | MVP 01 | Repetir as telas 01–05 e 72 no celular, abrir teclado virtual e usar zoom de 200% no computador | Esperado: textos, campos, avisos e botões acessíveis, sem corte ou sobreposição que impeça uso.
[] M01-059 | MVP 01 | Em `/conta`, observar árvore e frases por pelo menos 20 segundos; depois ativar redução de movimento no sistema | Esperado: alternância legível, sem deslocar formulário; movimentos respeitam a preferência de acessibilidade.
[] M01-060 | MVP 01 | Em cadastro, login, reenvio e nova senha, enviar com conexão lenta controlada e tentar repetir o clique | Esperado: feedback de processamento, bloqueio de envio duplicado e resultado compreensível.
[] M01-061 | MVP 01 | Em ambiente de teste controlado, provocar indisponibilidade do serviço de autenticação ao entrar ou conferir sessão | Esperado: aviso de serviço/sessão indisponível, sem classificar a falha como senha incorreta; sem controle do ambiente, marcar Bloqueado.
[] M01-062 | MVP 01 | Em ambiente de teste controlado, atingir o limite de tentativas de login | Esperado: aviso para aguardar, sem classificar limite como credenciais incorretas; sem condição segura de reprodução, marcar Bloqueado.

## Rastreabilidade e aceite

Tela72: entrada; Tela01: abas/login/sessão; Tela02: cadastro; Tela03: confirmação; Tela04: solicitação; Tela05: redefinição. Retorno seguro, revogação, acessibilidade e falhas atravessam essas telas. Fontes: Atlas mvp-plan.js/screens.js; src/app/conta/; src/app/boas-vindas/page.tsx; src/app/page.tsx; src/features/auth/; contrato funcionalidades/conta-entrada.md; correção de cadastro repetido v3.1.1. Expectativas descrevem o contrato, sem atestar execução ou ausência de defeitos. Conclusão exige avaliar resultados, resolver falhas, repetir casos afetados e explicitar bloqueios.
