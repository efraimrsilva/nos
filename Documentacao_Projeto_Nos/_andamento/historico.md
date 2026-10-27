# Histórico de andamento

## 2026-10-27 — v3.1.2 — confirmação de e-mail e testes manuais

Resultado no mesmo modal com ou sem sessão; só anuncia envio para confirmação pendente após sucesso. Migração aplicada no Supabase antes de publicar; três contas preservadas. Playwright/Chromium instalado;64 testes focados, tipos, build e18 cenários visuais aprovados. Roteiro MVP01 ampliado de62 para80 casos, preservando IDs e sem atribuir aprovação manual. Publicação completa autorizada e concluída: código4ba6b46 em origin/main e fluxo público conferido no site real em desktop/celular. [Registro](registros/registro-v3.1.2-2026-10-27-imp-confirmacao-fun-estado-email.md) · [testes](testes-manuais/mvp-01.md).

## 2026-10-23 — v3.1.1 — publicação GitHub dos testes manuais

Commit e push de todas as alterações documentais autorizados pelo usuário: processo permanente,62 casos MVP01, resultados/retestes e sincronização do Atlas com a evidência Brevo. Versão funcional preservada; execução manual pendente. Verificações documentais e autorrevisão; conferir hash remoto no fechamento. [Registro](registros/registro-v3.1.1-2026-10-23-imp-roteiro-manual-fun-cobertura-mvp-01.md).


## 2026-10-23 — v3.1.1 — processo e roteiro manual MVP01 (documentação)

Criados62 casos das Telas01–05/72, regra permanente por funcionalidade e controle de resultados/retestes. Nenhuma execução recebida. Atlas etapa01/fichas03/04 corrigido pela evidência Brevo de20/10; sem alteração funcional. [Roteiro](testes-manuais/mvp-01.md) · [Registro](registros/registro-v3.1.1-2026-10-23-imp-roteiro-manual-fun-cobertura-mvp-01.md).


## 2026-10-23 — v3.1.1 — cadastro com e-mail existente

Cadastro repetido avisa no formulário sem prometer confirmação; cadastro válido e destino interno preservados. 142 testes gerais, tipos, build e Visão global aprovados; autorrevisão e revisão independente concluídas. Commit e push de todas as alterações autorizados em 23/10/2026, com descrição abrangendo código, testes, Atlas, documentação e versão. Conferir hash remoto após publicação; nenhuma alteração no banco remoto. [Registro](registros/registro-v3.1.1-2026-10-23-imp-cadastro-fun-email-existente.md).


## 2026-10-23 — v3.1.0 — exclusão da própria conta

Opção vermelha e confirmação APAGAR CONTA; exclusão transacional de acesso/identificação, saída dos Núcleos e histórico preservado como Conta excluída. 130 testes gerais, 12 autenticados relacionados e 143 verificações SQL aprovados; tipos/build e revisão independente. Atlas, contratos e galeria alinhados. Migração remota aplicada após autorização; código8afecb2 publicado no deploy6adae350fa2928885a0de2c8. Prova online desktop/mobile aprovada; quatro contas descartáveis removidas e comparação de15 tabelas confirma dados anteriores preservados. [Registro](registros/registro-v3.1.0-2026-10-23-imp-conta-fun-exclusao-propria.md).

## 2026-10-21 — v3.0.3 — consolidação documental no GitHub

Publicação autorizada dos registros de SMTP Brevo e recuperação, sem novas mudanças funcionais. Descrição do commit resume layout, Conta, Acordos, Agenda, Atlas, deploy e autenticação, distinguindo as entregas já commitadas do fechamento atual. [Registro](registros/registro-v3.0.3-2026-10-21-imp-publicacao-github-fun-consolidacao-entrega.md).

## 2026-10-20 — v3.0.3 — SMTP Brevo e configuração de recuperação

Brevo substitui a preparação Gmail: remetente verificado, chave exclusiva sem expiração fixa e SMTP Supabase ativo, com confirmação obrigatória. Usuário confirmou recebimento da confirmação na entrada. Segredo de recuperação ausente criado no Netlify; deploy `6ad820c79cbacbaabe97e70f` publicado e pedido de recuperação pelo site aceito, com envio registrado. Recebimento da recuperação também confirmado na entrada; troca de senha pelo link ainda não certificada. Conta temporária removida; fontes/esquema preservados. [Registro](registros/registro-v3.0.3-2026-10-20-03-imp-envio-brevo-fun-autenticacao-email.md).

## 2026-10-20 — v3.0.3 — layout integral publicado e verificado no Netlify

Deploy6ad7eeb747e9c9a82835d3b5, fonte8b529e8e15785d0cd20732ef8fba9ff2bea9760a/main, publicado em20/10/2026 às19:44:44 (Brasília). Build real npm run build → Next16.3.6/Turbopack e TypeScript aprovados; Runtime Netlify5.16.3/Node24. Nova prova HTTPS com duas contas temporárias:27 rotas autenticadas, login/logout e preferência por formulários reais; Núcleo, convite, acordo, participação, momento e evento por RPCs (funções remotas). Nove grupos aprovados. Fixtures removidas e fingerprints de oito tabelas preservados. Nove migrações existentes; nenhuma aplicada nesta entrega. Atlas/guia/cobertura/fidelidade e continuidade atualizados, com prints reais e limites explícitos. Sem incremento funcional ou migração. [Registro](registros/registro-v3.0.3-2026-10-20-02-imp-deploy-netlify-fun-publicacao-producao.md).

## 2026-10-20 — v3.0.3 — publicação abrangente autorizada e colisões da Agenda

Revisão independente encontrou sobreposição de eventos longos na mesma faixa; corrigida por intervalos visuais e altura definida, com três testes e reconferência. Inclusão dos804 caminhos comprovada no commit inicial e41d2058f81e90781b2b9646ae1eded49a5009fe; controle incorporado à mesma unidade antes do push normal da reconstrução integral e ajustes, sem merge/deploy/banco. [Registro](registros/registro-v3.0.3-2026-10-20-imp-publicacao-layout-fun-consolidacao-interface-e-agenda.md).

## 2026-10-20 — v3.0.2 — setas distribuídas no Kanban de Acordos

Adicionadas posições central e inferior entre colunas do aplicativo, preservando largura20px, grade, último estágio e responsividade. Tipos e dez ensaios geométricos aprovados. Sem publicação. [Registro](registros/registro-v3.0.2-2026-10-20-imp-kanban-acordos-fun-setas-fluxo.md).

## 2026-10-20 — v3.0.1 — árvore decorativa restaurada na Conta
+
+Autorizado o retorno somente da ilustração original na Conta sem sessão, mantendo o Layout novo, frases10s e funções. Atlas01/02 sincronizados; nenhum modal alterado.12 testes de layout/frases, tipos e inspeção responsiva aprovados; nove capturas versionadas. [Registro](registros/registro-v3.0.1-2026-10-20-imp-conta-fun-restauracao-arvore.md). Sem publicação.

## 2026-10-18 — v3.0.0 — reconstrução de interiores e modais

Substituída a composição antiga das rotas por estruturas do Layout novo; Agenda semanal, Pessoas, Acordos móvel, controles e diálogos reconstruídos. Identificação de modais passa a ser regra permanente no Atlas/documentação; navegação e esboços distinguem-se de modais reais. 122 testes gerais aprovados; 94 cenários autenticados consolidados (66 da rodada ampla, 24 corrigidos/reexecutados, dois de registros consecutivos e dois de fidelidade protegida; rodadas focais adicionais aprovadas). Tipos, build webpack dos fontes finais e análise de CSS aprovados. Atlas: 73 telas, 207 ações, 365 estados, 41 referências históricas, 20 contextos modais e três rotas protegidas comparadas, sem erros ou chamadas externas. Visão global, MVP e percurso da proposta aprovados. 170 capturas do aplicativo (85 modais, 27 rotas autenticadas, sete páginas públicas e larguras de 390/640/768/1024/1440 px), 176 do Atlas (86 telas/contextos e 90 modais), 40 da referência e 20 anteriores: 406 imagens e 20 comparações por área/dispositivo. Modais têm título, gatilho e origem no manifesto; a captura é recortada no diálogo. [Registro](registros/registro-v3.0.0-2026-10-18-imp-reconstrucao-layout-novo-fun-interface-e-modais.md). Sem commit ou publicação remota.

## 2026-10-18 — v2.0.2 — transporte TLS local e auditoria de integração

Corrigida inicialização dev/start para usar certificados confiáveis do sistema. Falha de conexão reproduzida e removida no formulário local. Dez testes e tipos aprovados; auditoria remota somente leitura confirmou nove migrações, 15 tabelas protegidas, 26 RPCs e colunas de 27 consultas. Sem operação de dados; confirmação da conta pessoal pendente. [Registro](registros/registro-v2.0.2-2026-10-18-imp-conexao-supabase-fun-correcao-login-local.md).


## 2026-10-18 — v2.0.1 — frases da Conta por dez segundos

Temporizador alinhado às animações existentes de 10s. Oito testes de navegador e análise de tipos aprovados; pausa, retomada e sorteio preservados. [Registro](registros/registro-v2.0.1-2026-10-18-imp-frases-conta-fun-duracao-dez-segundos.md). Entrega local sem publicação; migração visual anterior permanece pendente de commit.


## 2026-10-18 — v1.1.0 — publicação Git autorizada do fluxo completo

Autorizados commit e push abrangentes da unidade documental Proposta → Hábito → Experiência → Essência, com contratos, referências, roteiro e fichas do Atlas. Base main/69888b8, fetch inicial0/0. Validações e prova de inclusão no objeto Git registradas em [estado](estado.md) e no [registro da unidade](registros/registro-v1.1.0-2026-10-18-imp-documentacao-acordos-fun-fluxo-proposta-habito-experiencia-essencia.md). Sem incremento de versão, nova implementação ou operação remota de banco/deploy.


## 2026-10-18 — v1.1.0 — decisão documental do fluxo completo de Acordos

Autorizada e documentada a ordem Proposta → Hábito → Experiência → Essência, referente à evolução da pessoa na prática apoiada pelo Núcleo. Categorias independentes e saltos ficam superados para o desenho futuro; gestão administrativa/aceite individual preservados, sem retorno de votação coletiva. Significados das quatro etapas, limites e critérios pendentes centralizados no [contrato](funcionalidades/fluxo-proposta-habito-experiencia-essencia.md); visão, dados, fluxos e Atlas referenciam a decisão. [Registro](registros/registro-v1.1.0-2026-10-18-imp-documentacao-acordos-fun-fluxo-proposta-habito-experiencia-essencia.md). Evento documental; aplicativo, banco e versão preservados. Sintaxe e três verificadores Atlas aprovados,73 telas preservadas;924 referências locais sem quebra. Revisão independente concluída após corrigir retorno da promoção e objetivo do roteiro; resultados no estado.


## 2026-10-15 — v1.1.0 — correção operacional do encerramento online

Deploy automático6ad17f6c7f65114f0602d866/6efc4c0 já publicado; função de encerramento ausente no banco remoto. Aplicada somente migração20261015120000, com histórico transacional e conteúdo conferido, elevando a nove migrações. Dados existentes preservados; oito grupos online aprovados pelo formulário/consultas com duas contas descartáveis, limpas ao final. Núcleo real não encerrado. Sem alteração de código/versão ou novo commit/push. [Registro](registros/registro-v1.1.0-2026-10-15-03-imp-correcao-online-fun-encerramento-nucleo.md).

## 2026-10-15 — v1.1.0 — publicação Git abrangente autorizada

Preparação de commit/push do encerramento, interface/árvore/rodapé/carregamento, Atlas,200 frases autorais e registros pendentes. Tipos/build e106 testes gerais reconferidos sobre cópia idêntica dos fontes; três verificadores Atlas aprovados. Sem incremento de versão ou operação remota de banco. Inclusão de89 arquivos comprovada no objeto inicial11707b907cb296e754ebb900670a5bec3e9ead7d; controle incorporado ao mesmo commit antes do push normal autorizado. Hash definitivo/igualdade remota reportados no fechamento. [Registro](registros/registro-v1.1.0-2026-10-15-02-imp-publicacao-git-fun-encerramento-interface.md).

## 2026-10-15 — v1.1.0 — encerramento administrativo do Núcleo (local)

Administrador pode encerrar para todos com nome e ciência explícita; banco valida papel sob trava, revoga convites e remove acesso sem apagar história ou contas.105 testes SQL,10 autenticados desktop/celular, tipos/build webpack e verificadores Atlas/visão global aprovados. Autorrevisão e revisão independente estática sem bloqueios. Alterações locais anteriores preservadas; sem commit/push/deploy ou migração remota. [Registro](registros/registro-v1.1.0-2026-10-15-imp-administracao-nucleo-fun-encerramento-coletivo.md).

## 2026-10-15 — v1.0.1 — árvore opcional (local)

Painel ilustrado removido por padrão da estrutura compartilhada; Conta sem sessão e boas-vindas preservadas. Conteúdo central até 672px. Tipos, 36 testes, 12 combinações visuais públicas e visão global Atlas aprovados; revisão independente sem bloqueios. [Registro](registros/registro-v1.0.1-2026-10-15-imp-layout-interno-fun-arvore-opcional.md). Sem commit/push/deploy.

## 2026-10-15 — v1.0.0 — Implantação e comprovação online autorizadas

Deploy Netlify `6ad055c8a42c00493a8198b9`, commit `ebe823727a1c609e031a0193d8d6f860ef999884`, confirmado publicado. Aplicadas as duas migrações administrativas pendentes numa transação: oito versões remotas, arquivos conferidos, Núcleo e dois membros existentes preservados. Onze grupos online aprovados com duas contas descartáveis, incluindo formulários de login/preferência/saída/logout e regras de consentimento/administração; limpeza confirmada. HTTPS/origens conferidos. SMTP/recebimento, segredo de recuperação, backup/restauração integral e controles restantes continuam pendentes; piloto integral não liberado. Sem alteração de código, versão ou novo commit/push. [Registro](registros/registro-v1.0.0-2026-10-15-02-imp-deploy-online-fun-administracao-participacao.md).

## 2026-10-15 — v1.0.0 — Publicação Git da administração autorizada

Commit/push abrangentes solicitados pelo usuário. main/base9153223 alinhada ao origin/main após fetch. Publicar código, migração, testes, Atlas/galeria e documentação como unidade atômica, preservando a versão1.0.0. Inclusão comprovada no objeto inicial3c71eb584952d52dee5172a88127c6823fa88a51 e árvore preparada16c01439fb6694f4a7d3854d289aaa740fb91d23; controle incorporado antes do envio normal autorizado. Hash definitivo/igualdade remota reportados no encerramento. Publicação não certifica deploy ou migração remota. [Registro](registros/registro-v1.0.0-2026-10-15-imp-publicacao-git-fun-administracao-participacao.md).

## 2026-10-14 — v1.0.0 — Administração compartilhada e participação individual

Contrato implementado no banco/app/Atlas: múltiplos administradores, nomeação aceita, gestão, saída/sorteio/fechamento, privacidade após saída e acordos sem votação com termos versionados. Histórico preservado; reentrada exige novo aceite; termos idênticos não invalidam participação.81SQL,81autenticados (um dispensado),106gerais, tipos/build e revisão independente aprovados. Oito migrações do zero conferidas; cinco suítes antigas preservadas com blobs idênticos.73telas,39recortes/34planejadas,80capturas. MAJOR por reformulação incompatível, sem liberação operacional do piloto. Sem commit/push/remoto; unidade pronta registrada. [Registro](registros/registro-v1.0.0-2026-10-14-13-imp-administracao-nucleo-fun-participacao-individual.md).

## 2026-10-14 — v0.16.0 — Publicação documental do modelo simples autorizada

Usuário autorizou commit/push abrangentes do contrato consolidado e registros/referências. main/base30ea405 alinhada ao remoto após fetch. Documentação define alvo aprovado, sem alteração em código/banco/manifestos. Conferir objeto antes de retirar pendência e confirmar hash remoto após envio. Modelo simples ainda não implementado; operação adiada. [Registro](registros/registro-v0.16.0-2026-10-14-12-imp-publicacao-git-fun-contrato-administracao.md).

## 2026-10-14 — v0.16.0 — Oito respostas do modelo simples consolidadas

Usuário aprovou todas as recomendações com alteração da resposta2: sortear administrador entre participantes restantes quando último administrador sair. Resposta3 elimina votação coletiva do ciclo de acordos, mantendo escolha individual; alerta de saída informa histórico compartilhado preservado. Responsável Sintagma Software, sintagmasoftware@gmail.com. Contrato único e referências atualizadas, registros antigos5–10 superados, sem implementação/commit/push. [Registro](registros/registro-v0.16.0-2026-10-14-11-imp-contrato-administracao-fun-respostas-consolidadas.md), [contrato](funcionalidades/administracao-participacao.md).

## 2026-10-14 — v0.16.0 — Modelo simples aprovado e perguntas reelaboradas

Usuário aprovou quadro de administração/participação simples e pediu novo rumo de definições. Cancelamentos/votações por saída das respostas5–10 substituídos, registros históricos preservados. Nova sequência: oito decisões em quatro blocos, com recomendações e resposta por pacote/exceção. Nenhuma implementação. [Roteiro](registros/registro-v0.16.0-2026-10-14-10-imp-modelo-administracao-fun-roteiro-simplificado.md).

## 2026-10-14 — v0.16.0 — Reavaliação para administração simples

Usuário apontou excesso de perguntas/regras/cancelamentos e propôs administrador de Núcleo, convites/entrada de pessoas e retirada das votações adicionais para facilitar o uso. Sequência anterior interrompida; pergunta11 não respondida. Proposta de saída sem cancelamentos/votação automática em discussão, sem implementação/substituição aprovada. [Registro](registros/registro-v0.16.0-2026-10-14-09-imp-reavaliacao-contrato-fun-administracao-simples.md).

## 2026-10-14 — v0.16.0 — Reinício após nova saída aprovado

Resposta10: outra saída de original durante votação pendente encerra a rodada sem decidir continuidade e abre nova para originais restantes, sete dias/novos votos; momentos continuam permitidos. Votos antigos não reaproveitados. Próxima definição: menos de dois originais associados. Sem implementação. [Registro](registros/registro-v0.16.0-2026-10-14-08-imp-contrato-saida-fun-reinicio-votacao.md).

## 2026-10-14 — v0.16.0 — Novos registros durante votação permitidos

Resposta9 B: continuar recebendo registros de momentos durante votação de continuidade; preservá-los se o prazo terminar sem aprovação e o acordo for encerrado. Não pausar registros como sugerido antes. Próxima definição: saída adicional durante votação. Sem implementação. [Registro](registros/registro-v0.16.0-2026-10-14-07-imp-contrato-saida-fun-registros-durante-votacao.md).

## 2026-10-14 — v0.16.0 — Prazo e resultado da continuidade aprovados

Resposta8: sete dias para votar; maioria aprova continuidade imediatamente; prazo sem maioria encerra acordo preservando história. Próxima definição: novos registros durante votação. Sem implementação. [Registro](registros/registro-v0.16.0-2026-10-14-06-imp-contrato-saida-fun-prazo-votacao.md).

## 2026-10-14 — v0.16.0 — Eleitorado da continuidade aprovado

Resposta7 A: somente participantes originais do acordo que permanecem associados votam; novos membros não participam. Nova votação exige maioria absoluta dos elegíveis, sem reutilizar votos. Prazo/resultado sem maioria ainda por definir. Sem implementação. [Registro](registros/registro-v0.16.0-2026-10-14-05-imp-contrato-saida-fun-eleitorado-continuidade.md).

## 2026-10-14 — v0.16.0 — Saída encerra teste; ativo recebe votação de continuidade

Resposta6 corrigida na mesma interação: encerramento automático somente do acordo em teste, com história preservada. Ativo terá votação nova e continuará se mais da metade das pessoas com direito a voto escolher seguir. Eleitorado/prazo/estado intermediário ainda pendentes. Sem implementação; decisão posterior a30ea405. [Registro](registros/registro-v0.16.0-2026-10-14-04-imp-contrato-saida-fun-continuidade-acordo.md).

## 2026-10-14 — v0.16.0 — Cancelamento da proposta após saída aprovado

Resposta5: cancelar a proposta original se participante original sair durante aprovação inicial; proposta não passa a teste por reduzir participantes e não reaproveita votos numa nova proposta. Decisão posterior ao commit/push30ea405, ainda sem implementação. Próxima definição: Hábitos em teste/ativos. [Registro](registros/registro-v0.16.0-2026-10-14-03-imp-contrato-saida-fun-cancelamento-proposta.md).

## 2026-10-14 — v0.16.0 — Publicação Git autorizada do MVP 05

Usuário autorizou commit/push abrangentes da entrega e definições registradas até pergunta 4. main/origin/main iguais após fetch, base c40594f. Reconferir validações, índice e objeto antes do envio normal. MVP05 parcial; saída/anonimização ainda em definição, pergunta 5 sem resposta e operação adiada pelo Google. Sem deploy manual ou alteração remota de banco/configuração. [Registro](registros/registro-v0.16.0-2026-10-14-02-imp-publicacao-git-fun-rastreabilidade-mvp-05.md).

## 2026-10-14 — v0.16.0 — Conteúdo preservado após ocultar autoria

Pergunta 4: opção A aprovada. Preferência de anonimização retira identificação de autoria, preservando conteúdo pessoal, humor e notas; sem reescrita automática e sem promessa de anonimato completo do conteúdo/contexto. Próxima pergunta trata de proposta pendente e saída de participante original. Definição documental; sem implementação. [Registro vigente](registros/registro-v0.16.0-2026-10-14-imp-contrato-saida-fun-definicao-mvp-05.md).

## 2026-10-14 — v0.16.0 — Preferência geral de anonimização

Pergunta 3: usuário aprovou opção A, uma preferência do aplicativo válida para todos os Núcleos, sem configuração por Núcleo. Próxima definição: alcance sobre identificação e conteúdo pessoal. Registro documental, sem implementação/alteração funcional. [Contrato em definição](registros/registro-v0.16.0-2026-10-14-imp-contrato-saida-fun-definicao-mvp-05.md).

## 2026-10-14 — v0.16.0 — Preservação padrão e anonimização opcional

Na resposta à pergunta 2, usuário definiu preservação das atividades por padrão e opção nas configurações para anonimizar interações após a saída. Essa decisão substitui a eliminação obrigatória do evento abaixo; histórico preservado como decisão superada. Alcance da preferência e anonimização ainda em definição. Sem implementação ou mudança funcional de versão. [Registro vigente](registros/registro-v0.16.0-2026-10-14-imp-contrato-saida-fun-definicao-mvp-05.md).

## 2026-10-14 — v0.16.0 — Definição de saída e eliminação das vivências

Usuário definiu saída a qualquer momento para qualquer participante. Corrigiu a proposta inicial de escolher manter/apagar: avisar que as vivências da pessoa no Núcleo serão eliminadas ao sair, sem histórico, por privacidade. Alcance em vivências conjuntas e decisões ainda precisa ser esclarecido. Item 5 adiado pelo impedimento do Google. Sem remoção implementada ou incremento funcional. [Registro](registros/registro-v0.16.0-2026-10-14-imp-contrato-saida-fun-definicao-mvp-05.md).

## 2026-10-13 — v0.16.0 — MVP 05 autonomia e proteção

Cinco rotas de orientação autenticada, navegação e pontos de entrada; recuperação/logout existentes reutilizados e vínculo conservado. Saída exige associação e distingue criador. Atlas ordenado, toggles históricos substituídos por regras/reservas;72 telas/16 percursos/38 recortes/34 planejadas.106 gerais produção e quatro autenticados finais, tipos/build e Atlas aprovados; P2 da revisão independente corrigido. MVP05 parcial por contratos de saída/transferência/retenção/direitos/suporte/termos e operação. Sem commit/push/deploy. [Registro](registros/registro-v0.16.0-2026-10-13-imp-controles-autonomia-fun-mvp-05.md).

## 2026-10-13 — v0.15.2 — publicação Git do MVP04 autorizada

Autorizado commit/push abrangendo código, testes, Atlas, galeria26 capturas, contratos/registros/manifestos da entrega. Versão preservada; conferência do objeto e hash remoto obrigatórias antes de reportar envio. Sem migração remota ou deploy manual. [Registro](registros/registro-v0.15.2-2026-10-13-02-imp-publicacao-git-fun-rastreabilidade-mvp-04.md).

## 2026-10-13 — v0.15.2 — MVP04: agenda interna

Conferência do fluxo existente; remoção imediata corrigida com confirmação/ciência no servidor, cancelamento sem gravação, foco e feedback. Texto conserva respostas; remarcação pede nova resposta aos demais conforme contrato já existente. Atlas/MVP/Visão global/fichas/cobertura/galeria alinhados e futuro reservado.102 gerais e seis autenticados aprovados; revisão independente sem achado funcional/segurança. Sem migração nova/banco remoto/commit/push/deploy. [Registro](registros/registro-v0.15.2-2026-10-13-imp-agenda-interna-fun-mvp-04.md).
## 2026-10-13 — v0.15.1 — publicação Git autorizada do MVP 03

Usuário autorizou commit/push abrangente do ciclo de Hábito. Base main48fdd3d; fetch confirmou0/0. Suíte geral/tipos/build e verificadores Atlas reconferidos; fontes funcionais idênticas à implementação validada. Um commit lógico inclui código, testes,22 capturas, Atlas, versão e documentação. Inclusão/objeto e equivalência remota conferidos no fechamento; publicação Git não certifica deploy. [Registro](registros/registro-v0.15.1-2026-10-13-02-imp-publicacao-git-fun-rastreabilidade-mvp-03.md).

## 2026-10-13 — v0.15.1 — MVP 03, ciclo real de Hábito

Produto: completado acesso ao histórico antigo de revisões por cursor data/ID, com pendência visível e leitura ordenada contra estados contraditórios. Ciclo de duas pessoas validado em desktop/celular, SQL e jornada ampliada de legado/maioria/isolamento. Atlas/MVP/Visão global: caminho principal, legado opcional, ajuste ou encerramento, detalhe/história preservados; ampliações reservadas. 102 testes gerais e quatro novos autenticados aprovados; tipos/build/equivalência conferidos no fechamento. Nenhuma migração nova/alteração remota/commit/push/deploy. [Registro](registros/registro-v0.15.1-2026-10-13-imp-ciclo-habito-fun-mvp-03.md).

**Versão vigente do projeto:** 0.15.2

## 2026-10-07 — v0.13.1 — Alinhamento visual de Conta

- **Mudança de produto:** largura e árvore/frases estáveis entre cadastro/login; link inferior duplicado removido, mantendo retorno superior e composição de login. Atlas/ficha/galeria sincronizados.
- **Resultado:** 24 testes de Conta, tipos/build e medição em seis tamanhos aprovados; comparação específica de Conta e Visão global aprovadas. Revisão independente sem achados materiais restantes após corrigir escopo da regra CSS. Script geral de fidelidade limitado pela expectativa anterior de /comecar público.
- **Evidência:** [registro v0.13.1](registros/registro-v0.13.1-2026-10-07-imp-conta-fun-alinhamento-visual.md) e [galeria](../wireframes/comparacoes/v0.13.1-2026-10-07-conta-alinhamento-tela_01-tela_02/index.html). Alterações locais, sem commit/push/deploy.

## 2026-09-24 — Primeira tela do app

- **Mudança:** base Next.js, tela Escolher caminho, rotas preparatórias e documentação de frontend.
- **Resultado:** fluxo acessível e responsivo; oito testes Playwright, build e verificação de tipos passaram na entrega original.
- **Evidência:** [registro da sessão](registros/registro-v0.1.0-2026-09-24-imp-tela-escolher-caminho-fun-entrada-nucleo.md), [escopo da tela](funcionalidades/escolher-caminho.md).

## 2026-09-24 — Context7

- **Evento:** servidor MCP Context7 instalado na configuração global do Codex; inicialização e ferramentas verificadas.
- **Evidência:** [registro da sessão](registros/registro-v0.1.0-2026-09-24-imp-tela-escolher-caminho-fun-entrada-nucleo.md). Configuração fora do Git do app.

## 2026-09-25 — Comentários no código

- **Mudança:** comentários concisos adicionados à política de cabeçalhos, entrada do onboarding, navegação centralizada, moldura compartilhada, links dos cartões e preferência de movimento reduzido.
- **Resultado:** decisões de integração e limites funcionais agora ficam registrados junto ao código; comportamento inalterado.
- **Validação:** revisão estática e `git diff --check`; sem execução de testes para o ajuste de comentários.
- **Próximo passo:** aguardar solicitação para implementar Tipo de Núcleo.

## 2026-09-25 — Diagnóstico da inicialização

- **Problema reproduzido:** `npm.cmd run dev` na pasta `Projeto Nós` falha com `ENOENT` porque o `package.json` está em `Projeto Nós\nos`.
- **Resultado:** o mesmo comando dentro de `nos` iniciou o Next.js em `http://127.0.0.1:3000`; a página `/comecar` abriu e exibiu os dois caminhos sem sobreposição de erro.
- **Ação:** README atualizado com o caminho absoluto e a orientação de manter o terminal aberto. O servidor temporário de diagnóstico foi encerrado para liberar a porta.

## 2026-09-25 — Comando `npm run dev` na pasta principal

- **Mudança:** `package.json` de lançamento criado na pasta principal do workspace, apontando para o app em `nos`; README atualizado com o comando simples.
- **Resultado:** `npm run dev` chegou ao Next.js. A execução encontrou uma instância do projeto já ativa em `127.0.0.1:3000`, que respondeu HTTP 200 para `/comecar`; por isso, uma segunda instância não foi iniciada.
- **Limite:** o lançador da pasta principal está fora do Git aninhado em `nos`; após clonar somente esse repositório, `npm run dev` deve ser executado dentro de `nos`.

## 2026-09-25 — Preparação da entrega ao GitHub

- **Escopo:** primeira tela Escolher caminho, base Next.js, navegação preparatória, testes, documentação e comentários de manutenção.
- **Verificações:** oito testes Playwright passaram; `npm run build` e `npm run typecheck` passaram. Após corrigir a configuração de Playwright, testes e tipos passaram novamente.
- **Revisão:** revisão independente sem problema crítico; corrigidas instruções de verificação no README e a invocação de `npm.cmd` no servidor de testes, conforme documentação Context7 do Playwright 1.63.
- **Destino solicitado:** commit atômico e push para `origin/main` em `github.com/efraimrsilva/nos`. O Git registra o resultado efetivo da publicação.

## 2026-09-25 — Implementação da tela Tipo de Núcleo

- **Mudança:** catálogo com nove tipos, seleção única obrigatória e acessível, passagem validada para Propósito preparatório e retorno preservando a escolha.
- **Resultado:** 16 testes Playwright desktop/mobile, build, tipos e revisão do diff aprovados; inspeção visual e revisão independente estática sem achados bloqueantes. Sem persistência real, commit, push ou deploy.
- **Evidência e continuidade:** [v0.2.0 — Tipo de Núcleo](<registros/registro-v0.2.0-2026-09-25-01-imp-tela-tipo-nucleo-fun-selecao-vinculo.md>).

## 2026-09-25 — Convenção de documentação por implementação

- **Orientação do usuário:** criar um novo documento para cada tela/implementação, preservando o histórico, com data e assunto no título e no nome do arquivo.
- **Aplicação:** protocolo atualizado no README de andamento; novo registro datado criado para Tipo de Núcleo. Os registros antigos foram preservados.

## 2026-09-25 — Adequação versionada da entrega v0.2.0

- **Mudança:** máscara anterior sem versão substituída pela regra atual de `AGENTS.md`: registros em `registros/`, título com versão/data/Imp./Fun., arquivos padronizados e sequência por versão/data.
- **Versão:** 0.1.0 → 0.2.0 (MINOR pela tela Tipo de Núcleo concluída); manifestos sincronizados. A documentação conceitual mantém suas edições históricas.
- **Publicação autorizada:** commit atômico contendo a tela, integração, testes e documentação, seguido de push para `origin/main`; o Git confirma o resultado efetivo. Sem deploy.
- **Evidência:** [registro da adequação](registros/registro-v0.2.0-2026-09-25-02-imp-documentacao-versionada-fun-rastreabilidade.md).

## 2026-09-25 — Padronização retrospectiva do registro v0.1.0

- **Mudança documental:** diário da primeira tela movido para `registros/`, com título, versão histórica comprovada, status e seções exigidas; cronologia original preservada. Sequenciais dos dois registros v0.2.0 ajustados para a posição após a data e referências atualizadas.
- **Resultado:** a sequência histórica passa de v0.1.0 (Escolher caminho) para v0.2.0 (Tipo de Núcleo). A versão vigente do aplicativo permanece 0.2.0. Nenhum código de produto alterado.
- **Git:** alterações locais, inclusive as renomeações preexistentes, reservadas para o commit da próxima funcionalidade por instrução do usuário.
- **Evidência:** [registro da padronização](registros/registro-v0.2.0-2026-09-25-03-imp-padronizacao-registro-historico-fun-rastreabilidade.md).

## 2026-09-27 — Tela Propósito do Núcleo

- **Mudança:** formulário de nome e propósito com sugestão por tipo, validação e conferência local; o tipo continua na URL, os textos não.
- **Resultado:** 22 testes Playwright aprovados em desktop/mobile; tipos, build, inspeção visual e revisão própria aprovados. Nenhum Núcleo ou convite criado.
- **Evidência e continuidade:** [v0.3.0 — Propósito do Núcleo](registros/registro-v0.3.0-2026-09-27-imp-tela-proposito-nucleo-fun-rascunho-local.md). Próxima integração depende de autenticação e criação protegida.

## 2026-09-27 — Configuração do Octocode

- **Evento de ferramenta:** Octocode CLI 19.1.0 executado por `npx`, busca local validada com acesso delimitado ao repositório; MCP global registrado e habilitado. As ferramentas MCP ainda não foram recarregadas nesta sessão.
- **Limite:** configuração global fora do Git do aplicativo; nenhuma dependência adicionada ao projeto.

## 2026-09-27 — Entrega Git da v0.3.0

- **Escopo:** tela Propósito, testes, versão 0.3.0, documentação de continuidade e padronização histórica reservada para esta funcionalidade.
- **Verificações:** 22 testes Playwright, tipos, build, diff e conteúdo do commit aprovados antes do envio.
- **Destino autorizado:** `origin/main`; o hash final e a confirmação do push são obtidos pelo Git, sem registrar no próprio commit uma referência circular.

## 2026-09-27 — Integração Supabase em andamento

- **Mudança em preparação:** tela de conta, ações protegidas de criação, convite inicial, conferência e aceite, além de migração SQL com RLS e configuração local da CLI.
- **Resultado local:** 40 testes Playwright, tipos e build passaram; revisão independente encontrou dois problemas na interface autenticada, corrigidos antes da reexecução. Sem projeto remoto vinculado, nenhum cadastro, Núcleo ou convite real foi validado ou criado.
- **Limite:** Docker daemon inativo impede execução local da migração. O usuário iniciou a criação da organização no painel Supabase.
- **Evidência e retomada:** [registro da integração, concluído posteriormente na v0.4.0](registros/registro-v0.4.0-2026-09-27-imp-integracao-supabase-fun-criacao-convite.md).

## 2026-09-27 — Preparação do projeto Supabase

- **Evento externo informado pelo usuário:** conta Supabase acessada via GitHub; organização **Projetos Efraim** no plano Free criada; formulário de novo projeto aberto. Nenhum projeto ou migração confirmado ainda.
- **Orientação:** usar um projeto de desenvolvimento, guardar a senha do banco privadamente, manter a Data API para o app, retirar concessões automáticas de tabelas e ativar RLS automática. A migração versionada já define concessões e políticas específicas.

## 2026-09-27 — Projeto Supabase criado e autenticação local configurada

- **Evento externo verificado:** `nos-dev` Healthy na região São Paulo; URL e chave publicável registradas apenas em `.env.local` ignorado pelo Git. Site URL local e URL de retorno `/auth/confirm` salvos no painel.
- **Constatação:** o e-mail confirmado pelo usuário não criou usuário no aplicativo; o painel Authentication → Users mostra lista vazia. O template padrão `{{ .ConfirmationURL }}` não pode ser editado sem SMTP próprio, e o callback preparado para `token_hash` requer adaptação ao retorno padrão antes do teste real.
- **Resultado:** nenhuma migração aplicada e nenhuma conta ou Núcleo do Nós criada até esta verificação. Integração permanece em andamento.

## 2026-09-27 — Callback padrão preparado e CLI sem vínculo

- **Mudança no código:** cadastro aponta para `/auth/confirm`; a rota aceita código PKCE do template padrão e `token_hash` de template personalizado. Três testes específicos, tipos e build passaram.
- **Limite:** a suíte completa não iniciou porque outro servidor Next mantém `.next/dev` em uso; Playwright precisa de saída própria. Nenhum fluxo autenticado real validado.
- **Integração externa:** a autorização da CLI falhou por transporte; o painel gerou token legado de CLI nunca usado e sem expiração. O usuário solicitou orientação manual passo a passo. Nenhuma migração foi aplicada.

## 2026-09-27 — Token legado removido

- **Evento externo:** o usuário revogou o token criado na tentativa de login da CLI. O painel Access Tokens foi verificado e mostra lista vazia.
- **Continuidade:** criar token de projeto com prazo curto, guiando o usuário pela escolha de escopo e permissões antes de gerar a credencial. Nenhuma migração aplicada.

## 2026-09-27 — Token restrito substituído e testes isolados

- **Segurança:** o primeiro token restrito foi enviado acidentalmente no chat; o usuário informou sua revogação. A sessão de terminal que o aguardava foi encerrada sem utilizá-lo. Um novo prompt com entrada ocultada foi preparado para a credencial substituta, ainda pendente.
- **Verificação local:** o servidor Playwright agora usa diretório de build separado do servidor de desenvolvimento. A suíte executou 46 testes: 44 passaram; dois falharam por URL fixa da porta antiga no próprio teste. Após corrigir a comparação para o caminho e a consulta, os seis testes da tela de propósito passaram. A suíte completa após o ajuste ainda não foi reexecutada.

## 2026-09-27 — Diagnóstico de transporte da CLI

- **Resultado informado pelo usuário:** o token substituto foi inserido na janela PowerShell, mas `projects list` da CLI 2.118.0 falhou com `HttpClientError: Transport error`.
- **Investigação sem segredo:** a mesma falha foi reproduzida com token fictício no formato correto. `Invoke-WebRequest` e `curl` alcançaram a API por IPv4 e IPv6 e receberam HTTP 401, esperado sem credencial válida. O debug da CLI confirmou uso da variável de ambiente e falha no GET antes de uma resposta HTTP. Próximo teste: consultar o projeto por PowerShell com a credencial mantida apenas naquela janela.

## 2026-09-27 — API autenticada e suíte local conferidas

- **Integração:** o usuário confirmou que a consulta autenticada direta à Management API retornou `nos-dev`; o token substituto funciona. A aplicação de migração permanece pendente. A referência oficial do endpoint de migrações foi consultada e seu acesso restrito precisa ser verificado antes de usá-lo.
- **Validação:** após separar o diretório de build dos testes e corrigir a comparação de URL do teste, 46 testes Playwright passaram em desktop/mobile; `npm.cmd run typecheck` passou. Uma tentativa intermediária da suíte encerrou cedo sem saída útil, seguida de execução explícita completa aprovada.

## 2026-09-27 — Histórico remoto vazio e revisão prévia da migração

- **Integração:** o usuário confirmou que o endpoint de histórico de migrações retornou lista vazia. Nenhuma alteração de estrutura foi enviada ao banco até aqui.
- **Revisão própria:** o SQL versionado cria três tabelas, índices, RLS, concessões apenas de leitura para usuários autenticados e quatro funções que conferem a identidade no banco; não contém exclusão de dados. O endpoint oficial de aplicação de migração foi conferido; seu acesso pode ser restrito no plano/projeto.
- **Validação local:** 46 testes, tipos, build e `git diff --check` passaram antes da aplicação remota. O arquivo SQL tinha SHA-256 `D51485AA3186206950F46DE7F460CDD8D32552567A2BBED71E282071A355502D` nesta revisão.

## 2026-09-27 — Migração aplicada ao nos-dev

- **Entrega externa verificada:** após execução pelo usuário, Database Migrations no painel mostra `20260927173656_create_nuclei_and_invitations`. Database Tables no esquema `public` mostra `nuclei`, `nucleus_members` e `nucleus_invitations`, todas com estimativa de zero registros. Functions mostra quatro RPCs do aplicativo; Policies mostra RLS ativo e uma política de leitura autenticada por tabela. O rótulo `API DISABLED` decorrente das permissões personalizadas exige teste real do acesso.
- **Alinhamento local:** arquivo SQL renomeado para o número de versão remoto, preservando seu conteúdo; evita divergência de histórico em uma futura execução de migrações pela CLI. Fluxos com contas reais ainda pendentes.

## 2026-09-27 — Primeira conta do aplicativo confirmada

- **Validação externa:** o usuário enviou o cadastro pela tela `/conta`; a interface exibiu orientação para confirmar o e-mail. O painel Authentication → Users mostra um usuário confirmado com registro de entrada. Dados pessoais e credenciais não foram copiados para a documentação.
- **Continuidade:** criar um Núcleo pela interface e confirmar inserção protegida no banco; depois validar convite com segunda conta.

## 2026-09-27 — Entrada real levou ao início

- **Validação informada pelo usuário:** após entrar pela tela `/conta`, o aplicativo navegou para `/comecar`. A sessão autenticada permite iniciar o fluxo de criação; a gravação do Núcleo ainda não foi testada.

## 2026-09-27 — Primeiro Núcleo gravado com criador

- **Validação externa:** após a ação explícita do usuário, a interface abriu `/comecar/convite-inicial/[id]`. Table Editor mostrou uma linha em `nuclei` com o mesmo identificador e uma linha em `nucleus_members` para a mesma conta com papel `creator`. Nome, propósito e identificador pessoal não foram copiados para os registros de continuidade.
- **Continuidade:** gerar convite e validar a entrada por segunda conta, incluindo isolamento das tabelas protegidas.

## 2026-09-27 — Convite exposto e revogado

- **Evento:** a geração do primeiro convite funcionou, mas seu código apareceu em captura e mensagem no chat. O convite específico foi revogado no Table Editor; `revoked_at` foi conferido em nova leitura do registro. O código não foi copiado para os documentos.
- **Interface:** após recarregar `/comecar/convite-inicial/[id]`, o código anterior deixou de aparecer e o botão `Gerar convite` voltou. É necessário gerar outro código para o teste com segunda conta.

## 2026-09-27 — Convite substituto ativo

- **Validação externa:** após nova geração informada pelo usuário, uma consulta de contagem no SQL Editor confirmou um convite ativo e um revogado para o Núcleo. Nenhum código foi lido ou registrado.
- **Continuidade:** cadastrar e confirmar segunda conta em sessão separada para testar prévia, aceite e isolamento.

## 2026-09-27 — Contas adicionais informadas para o teste

- **Relato do usuário:** contas adicionais foram criadas para testar o convite. Os endereços não foram registrados; confirmação de e-mail e sessão da conta convidada ainda precisam de verificação.
- **Continuidade:** usar a conta que não criou o Núcleo em sessão separada, conferir o convite pela interface e só então testar o aceite.

## 2026-09-27 — Prévia do convite validada

- **Validação pela interface:** captura do usuário mostrou a prévia do Núcleo após `Conferir convite`, sem expor o código. O aceite ainda não foi acionado/confirmado.
- **Achado de UX:** o aviso para criar conta ou entrar permanece visível abaixo da prévia, embora a conferência exija autenticação. A causa no componente é renderização incondicional; corrigir depois do teste de aceite para não interromper a sessão atual.

## 2026-09-27 — Redirecionamento após aceite sem novo vínculo

- **Relato da interface:** após `Aceitar convite`, o navegador abriu `/nucleos/[id]` e exibiu o resumo esperado.
- **Conferência no banco:** `auth.users` tem três contas, mas a consulta agrupada em `nucleus_members` para esse Núcleo retornou somente um `creator`, sem `member`. O redirecionamento isolado não comprova entrada da segunda conta. O usuário informou que usou navegadores diferentes; foi solicitada conferência de `/conta` em cada um, sem compartilhar e-mails.
- **Correção local de UX:** o aviso de criação/entrada passou a depender da sessão autenticada no servidor. A tela foi conferida em sessão autenticada; `typecheck`, dois testes da rota de convite, build e `git diff --check` passaram.
- **Investigação adicional:** o usuário confirmou contas conectadas diferentes nos navegadores. Nova consulta ao banco manteve um `creator` e zero `member`. A função remota `accept_invitation` contém a inserção e ignora conflito quando a conta já pertence ao Núcleo; a hipótese de sessão errada ainda não está resolvida. Foi solicitado recarregar o resumo no navegador convidado para verificar se o acesso persiste.
- **Teste de recarregamento:** no navegador convidado, F5 na rota do Núcleo exibiu página não encontrada. O acesso não persistiu para essa conta, em acordo com a ausência de `member`. A conferência e o aceite serão repetidos com essa sessão já identificada, sem compartilhar o código.
- **Recuperação do convite:** o usuário perdeu a cópia local. A rota protegida de convite inicial consulta o código ativo para o criador e o exibe novamente; o mesmo convite pode ser reutilizado no teste sem copiá-lo para o chat ou criar outro.

## 2026-09-27 — Aceite persistente e entrega v0.4.0

- **Fluxo real:** após repetir o aceite na sessão convidada, consulta agregada no Supabase mostrou um `creator` e um `member`. O usuário confirmou que o resumo permaneceu visível após F5 nas duas contas; antes do vínculo, a conta convidada recebia página não encontrada. Nenhum código, e-mail ou dado afetivo foi incluído nos registros.
- **Correções de UX e revisão:** aviso de cadastro limitado a usuários sem sessão; prévia de convite ocultada quando o código digitado muda; texto do convite alinhado ao aceite direto. A revisão independente apontou a prévia e documentação defasada, corrigidas. `.next-playwright/` entrou no `.gitignore`.
- **Validação e entrega Git:** 46 testes Playwright em desktop/mobile, `npm.cmd run typecheck`, `npm.cmd run build` e `git diff --check` passaram após as correções e na conferência final. Foram conferidos 71 links locais sem alvo ausente; manifestos e registro refletem v0.4.0 MINOR. A revisão independente de confirmação não encontrou achados remanescentes. A integração foi registrada em commit atômico com código, testes e documentação; o usuário autorizou push para `origin/main`. Consultar o Git para o hash e a situação remota atuais.

## 2026-09-27 — Primeira Home do Núcleo v0.5.0

- **Mudança de produto:** `/nucleos/[id]` passou a mostrar nome, tipo, propósito e vínculo real da pessoa autenticada. O convite aparece apenas para o criador. O estado inicial, carregamento e erro comunicam o alcance atual da Home sem simular áreas futuras.
- **Segurança e validação:** consulta da participação própria sob RLS antes da leitura do Núcleo; ausência de vínculo retorna 404 e erro do serviço é tratado separadamente. A revisão independente encontrou falha do Auth tratada como sessão ausente e token expirado tratado como indisponibilidade; ambos foram corrigidos com teste de regressão. TDD da derivação de tipo/papel/convite e da classificação de erro; 52 testes Playwright em desktop/mobile, tipos e build aprovados. A nova interface ainda não foi testada em sessão Supabase real.
- **Versão e continuidade:** 0.4.0 → 0.5.0 (MINOR); [registro próprio](registros/registro-v0.5.0-2026-09-27-imp-home-nucleo-fun-resumo-protegido.md). Próxima etapa: contrato e RLS da agenda interna; as fontes e o recorte inicial estão no estado canônico. Commit e push para `origin/main` autorizados posteriormente; deploy não autorizado.
- **Entrega Git:** commit atômico com Home, tratamento de acesso, testes, versão e documentação inspecionado antes do envio. O hash final e a situação de `origin/main` devem ser confirmados no Git; o aplicativo não foi publicado por deploy.

## 2026-09-27 — Agenda interna iniciada

- **Mudança em andamento:** criada a rota protegida da agenda, formulário de evento, ações de presença/edição/remoção e migração SQL com eventos, participantes e RLS. A Home ganhou acesso à agenda.
- **Validação local:** a prova da rota falhou antes da implementação e passou após encerrar um servidor de teste órfão. A suíte final aprovou 60 testes desktop/mobile; tipos, build e `git diff --check` passaram. A migração remota e os testes com contas distintas continuam pendentes.
- **Versão naquele marco:** 0.5.0 enquanto a integração não estava concluída. [Registro da entrega, concluído depois na v0.6.0](registros/registro-v0.6.0-2026-09-27-01-imp-agenda-interna-fun-eventos-nucleo.md).

## 2026-09-27 — Migração da agenda aplicada no desenvolvimento

- **Integração:** o usuário aplicou a migração pela Management API no projeto `nos-dev`; o painel confirmou `20260927221149_create_nucleus_calendar`. O arquivo local recebeu o mesmo número de versão, sem alteração do SQL.
- **Continuidade:** validar a agenda pela aplicação com contas distintas e dois Núcleos antes de concluir a funcionalidade e atualizar a versão do projeto.

## 2026-09-27 — Agenda testada com duas contas no mesmo Núcleo

- **Fluxo real:** conta criadora criou, respondeu, editou e removeu um evento temporário. A conta participante viu o convite sem controles de edição, respondeu e recebeu confirmação. O evento de teste foi removido.
- **Revisão e validação:** revisão independente encontrou ausência de navegação após 50 eventos e possível fuso aceito pelo banco mas rejeitado pelo `Intl`; ambas as falhas foram corrigidas com testes. 64 testes desktop/mobile, tipos e build passaram. Resta conferir acesso entre Núcleos distintos antes de concluir a entrega.

## 2026-09-27 — Isolamento validado e agenda v0.6.0

- **Teste real:** a conta participante abriu a agenda do Núcleo original e recebeu 404 ao tentar a agenda de um segundo Núcleo temporário, criado sem convite pela conta criadora. O Supabase retornou exatamente o registro esperado ao removê-lo por identificador e nome; o evento temporário anterior já havia sido excluído.
- **Versão:** 0.5.0 → 0.6.0 (MINOR) pela nova rota e funcionalidade. [Registro da entrega](registros/registro-v0.6.0-2026-09-27-01-imp-agenda-interna-fun-eventos-nucleo.md). Código, migração, testes e documentação formam uma unidade local pronta para commit, sem autorização de publicação.

## 2026-09-27 — Preparação da entrega Git v0.6.0

- **Documentação:** a continuidade da Tela 04 — Acordos foi ligada ao catálogo, fluxo, modelo, permissões e regra de aprovação. Proposta não equivale a acordo ativo; os percentuais do protótipo não são dados reais. O README passou a listar as duas migrações já aplicadas em `nos-dev`.
- **Verificação:** a execução paralela dos testes encontrou timeouts ao encerrar contextos mobile em disco lento; uma execução completa com um worker aprovou 64 testes. Tipos, build e revisão do diff passaram.
- **Git:** commit atômico da agenda v0.6.0 com código, migração, testes, versão e documentação inspecionado localmente. Push para `origin/main` autorizado; confirmar a situação remota no Git.

## 2026-09-28 — Tela 04 Acordos em implementação

- **Mudança em preparação:** hub protegido, propostas de Hábitos e Experiências, respostas de aceite/recusa e migração RLS; Essência permanece sem dados simulados.
- **Resultado local:** 68 testes Playwright desktop/mobile, checagem de tipos e build passaram. Revisão independente apontou três ajustes de fluxo, corrigidos.
- **Limite naquele marco:** migração ainda não aplicada ao `nos-dev` e fluxo real não verificado. [Registro da implementação, concluída depois na v0.7.0](registros/registro-v0.7.0-2026-09-28-imp-hub-acordos-fun-propostas-consentimento.md).

## 2026-09-29 — Análise documental de frameworks de IA

- **Pesquisa:** Genkit, Vercel AI SDK e Mastra comparados com a stack, a RLS e as regras do Ponte do Nós; [registro](registros/registro-v0.6.0-2026-09-29-imp-analise-frameworks-ia-fun-apoio-conversas.md).
- **Resultado:** AI SDK Core é a opção mais simples para eventual sugestão pontual; nenhuma dependência ou funcionalidade de IA foi adicionada. Acordos permanece em desenvolvimento e com validação remota pendente.

## 2026-09-29 — Pesquisa de projetos de apoio à stack

- **Pesquisa:** projetos para Next.js, TypeScript, Playwright e Supabase com foco em RLS, manutenção de dependências, observabilidade e acessibilidade; [registro](registros/registro-v0.6.0-2026-09-29-imp-pesquisa-ferramentas-stack-fun-qualidade-operacao.md).
- **Resultado:** pgTAP/Supabase CLI é a lacuna mais próxima para testar políticas e RPCs; Renovate ou Dependabot após CI; Sentry apenas com aplicação publicada e regras de minimização; axe-core pode complementar Playwright. Nenhuma ferramenta foi instalada. Ferramentas externas condicionais e exclusões estão detalhadas no registro.
- **Validação documental:** fontes oficiais consultadas na web; compatibilidade e custo não foram testados no projeto.
- **Próximo passo:** priorizar a integração real da migração de Acordos; avaliar pgTAP após Docker/local Supabase estar disponível.

## 2026-09-29 — Migração de Acordos validada localmente

- **Integração local:** Docker 29.8.1 iniciou o Supabase; a migração de Acordos foi aplicada após as duas anteriores. `supabase test db` aprovou o novo teste pgTAP de RLS, votos e estados.
- **Fluxo real local:** contas temporárias criaram, aceitaram e recusaram propostas pela aplicação; outra conta recebeu a página 404. Duas respostas simultâneas em um Núcleo de três pessoas levaram a proposta para teste. Os dados temporários foram removidos e as contagens finais foram zero.
- **Limite naquele marco:** a CLI ainda não dispunha de token para o `nos-dev`; a migração remota estava pendente. [Registro da Tela 04, concluída depois na v0.7.0](registros/registro-v0.7.0-2026-09-28-imp-hub-acordos-fun-propostas-consentimento.md).
- **Ambiente:** o Supabase local foi encerrado com backup após os testes; o Docker permaneceu disponível.

## 2026-09-29 — Diagnóstico do login remoto do Supabase

- **Falha:** a CLI 2.118.0 recebeu o código de verificação, mas o GET de confirmação retornou `Transport error`; com credencial fictícia, a listagem de projetos também falhou no transporte.
- **Evidência:** HTTP do Windows chegou à API (401 esperado sem credencial); Node sem certificados do sistema falhou com `UNABLE_TO_VERIFY_LEAF_SIGNATURE` e com `NODE_USE_SYSTEM_CA=1` alcançou a API. O usuário relatou bloqueio pelo antivírus e criou exceção.
- **Continuidade:** o usuário reiniciará o computador para efetivar a exceção. Após isso, testar novamente o transporte da CLI antes de repetir o login. Nenhuma migração foi aplicada ao `nos-dev` nesta etapa.

## 2026-09-29 — Transporte da CLI ainda bloqueado após reinício

- **Diagnóstico:** a exceção do executável no Avast Free Antivirus e o reinício não resolveram `Transport error`. O certificado de `api.supabase.com` foi emitido por `Avast Web/Mail Shield Root`, confirmando a inspeção HTTPS local; a documentação oficial do Supabase descreve esse padrão.
- **Ferramenta:** executável completo da CLI 2.118.0 restaurado do cache npm e conferido; a falha persistiu também no caminho original.
- **Próximo teste:** usuário orientado a criar exceção de Site/Domínio apenas para `api.supabase.com` no Avast; verificar o certificado e o transporte antes de novo login. Migração remota permanece pendente.

## 2026-09-29 — Transporte da CLI restaurado

- **Ajuste de ambiente:** o usuário salvou a exceção de Site/Domínio para `api.supabase.com` no Avast Free Antivirus.
- **Evidência:** o emissor do certificado passou de `Avast Web/Mail Shield Root` para `WE1`; a CLI 2.118.0 passou a receber `Unauthorized` com credencial fictícia, comprovando comunicação HTTP com a API sem expor credenciais reais.
- **Continuidade:** janela de login real aberta em PowerShell; autorização ainda não confirmada. Migração de Acordos no `nos-dev` segue pendente.

## 2026-09-29 — Tela 04 Acordos validada no `nos-dev` e v0.7.0

- **Migração:** login da CLI confirmado; `nos-dev` identificado e vinculado. A simulação indicou somente `20260928120000_create_nucleus_agreements.sql`; `db push --skip-vault` aplicou a migração. `migration list` mostrou três versões alinhadas e uma nova simulação informou banco atualizado. Uma tentativa intermediária de simulação encontrou falha transitória de autenticação do papel `cli_login_postgres`; a repetição passou sem reaplicar SQL.
- **Fluxo remoto:** três contas temporárias verificaram convite, proposta pendente, aceite unânime para `testing`, recusa para `declined` e negativa de leitura/resposta por pessoa fora do Núcleo. A limpeza pela API foi restringida por `DELETE`; a consulta administrativa removeu o Núcleo e a conta restantes, com contagens finais zero de Núcleo, propostas e contas de teste.
- **Verificação:** 68 testes Playwright desktop/mobile, checagem de tipos, build de produção e `git diff --check` aprovados na v0.7.0. Manifestos alinhados e links do registro renomeado conferidos. A primeira tentativa não iniciou o servidor de testes dentro de 120 segundos, mas a inicialização isolada respondeu HTTP 200 e a repetição passou. Revisão independente final não encontrou defeito material de código e solicitou atualização da documentação, realizada nesta entrega.
- **Versão e continuidade:** incremento MINOR de 0.6.0 para 0.7.0 pela nova tela/funcionalidade. Próxima etapa do catálogo: Tela 05 — Detalhe do Hábito, começando pelo contrato de dados reais e sem percentuais simulados. [Registro v0.7.0](registros/registro-v0.7.0-2026-09-28-imp-hub-acordos-fun-propostas-consentimento.md).

## 2026-09-29 — Preparação da publicação Git da v0.7.0

- **Continuidade:** conferida a Tela 05 no catálogo; o estado canônico agora distingue dados já disponíveis na proposta em teste dos dados que exigem contrato e integração próprios. Os registros das pesquisas de IA e ferramentas receberam notas posteriores sem apagar o contexto em que foram escritos.
- **Entrega:** usuário autorizou commit e push para `origin/main`, com descrição que abranja Acordos, validação do banco, testes, versão e as duas pesquisas documentais locais concluídas antes da funcionalidade. Verificações finais e confirmação do hash remoto devem preceder o encerramento.
- **Verificação desta preparação:** uma execução de 68 testes perdeu o servidor de desenvolvimento após o primeiro caso (44 falhas de navegação por conexão recusada); iniciar a página isoladamente retornou HTTP 200 e o caso isolado passou. A nova execução completa aprovou 68/68 testes, seguida de checagem de tipos e build aprovados, sem alteração no código do aplicativo.
- **Commit:** a Tela 04, a migração, os testes, a versão e os registros das duas pesquisas foram reunidos em um commit descritivo da v0.7.0. O hash final deve ser consultado no Git após o ajuste deste andamento e comparado com `origin/main` após o push.

## 2026-09-29 — Tela 05 Detalhe do Hábito v0.8.0

- **Produto:** propostas de Hábito em teste ganharam link para detalhe protegido com descrição, momento, frequência, data identificada em UTC e resposta própria. A interface explica a ausência de histórico, progresso, revisão e evento associado, sem simular dados.
- **Verificação:** teste de acesso sem sessão falhou antes da rota e passou depois; 70 testes desktop/mobile, tipos e build passaram. Revisão independente apontou fuso não indicado, corrigido. Com Supabase local, três contas e dois Núcleos temporários validaram o link, acesso dos integrantes, isolamento, rejeição de categoria/estado inadequados e RLS da resposta própria. Dados temporários removidos. A nova rota não foi testada no `nos-dev`.
- **Versão e continuidade:** 0.7.0 → 0.8.0 (MINOR) pelo recorte inicial da Tela 05, com nova rota de consulta protegida. A Tela 06 deve definir persistência e permissões de revisão e registro de momento; os itens restantes da Tela 05 serão integrados quando houver dados reais. [Registro](registros/registro-v0.8.0-2026-09-29-imp-detalhe-habito-fun-consulta-proposta-teste.md). Commit atômico conferido com código, teste, versão e documentação; push para `origin/main` autorizado em 2026-09-29. Confirmar o estado remoto pelo Git.

## 2026-10-02 — Retomada documental após v0.9.0

Código e Git conferidos em 381a308. Próxima entrega proposta: Revisar Hábito em teste com consenso e reflexão. Recorte aguarda aprovação; nenhuma alteração de produto. Registro: registros/registro-v0.9.0-2026-10-02-imp-retomada-projeto-fun-escopo-revisao.md.

## 2026-10-02 — Revisão consensual do Hábito v0.10.0

Ajustes e encerramento de Hábitos em teste exigem unanimidade, reflexão de sete dias e aplicação explícita. Histórico preservado. Banco local, fluxo de três contas, concorrência, 80 testes, tipos e build aprovados. Achado independente de prontidão corrigido. Migração aplicada ao nos-dev pelo editor SQL em transação com histórico, após bloqueio da CLI; quatro corpos de função equivalentes aos locais. Interface autenticada validada localmente. Unidade pronta para commit, não autorizado nesta interação. [Registro](registros/registro-v0.10.0-2026-10-02-imp-revisao-habito-fun-consentimento-reflexao.md).

## 2026-10-03 — Preparação de commit e push da v0.10.0

Usuário autorizou publicação Git abrangente. Fetch encontrou 264f483 (remoção de AGENTS.md), incorporado por avanço direto sem sobrescrever o remoto. Revisão final independente confirmou o próximo passo; documentação agora diferencia teste de 7 a 30 dias e reflexão de sete dias, com decisões pendentes explícitas. Testes de banco repetidos com sucesso; verificações finais e hash publicado serão conferidos antes de encerrar. [Registro](registros/registro-v0.10.0-2026-10-03-imp-publicacao-git-fun-continuidade-confirmacao.md).

- **Commit conferido:** unidade da v0.10.0 contém os 22 arquivos previstos, incluindo a continuidade da confirmação. Pendência de commit removida por inspeção do objeto Git, não somente pela limpeza do diretório. Ajustes deste registro incorporados ao mesmo commit antes do envio. Hash final consultável em HEAD; publicação confirmada pela comparação com refs/heads/main ao concluir o push.

## 2026-10-03 — Retomada do contrato de confirmação pós-teste

HEAD e main no GitHub conferidos em e315b12; diretório inicialmente limpo. Documentação e código confrontados com as regras v1.2/v2.4. Proposta para duração, início, legado, confirmação e compatibilidade de active registrada, aguardando aprovação antes de implementação. Sem alteração de produto ou versão; preparação documental acompanha a próxima entrega funcional. [Registro](registros/registro-v0.10.0-2026-10-03-imp-retomada-confirmacao-fun-proposta-contrato.md).

## 2026-10-03 — v0.11.0: confirmação do Hábito após teste

Duração explícita, ciclos reais, maioria até 150 e um terço acima de 150; orientações visíveis e active integrado. Legado exige novo prazo aceito; ajustes preservam história e reiniciam teste. 84 testes, tipos, build, cinco arquivos SQL e jornada local com cinco contas passaram. Migração aplicada no nos-dev; 13 funções equivalentes. Revisão independente corrigida; interface autenticada validada localmente. Unidade local pronta para commit. [Registro](registros/registro-v0.11.0-2026-10-03-imp-confirmacao-habito-fun-teste-votacao-proporcional.md).

## 2026-10-03 — Publicação Git abrangente da v0.11.0

Usuário autorizou commit e push. Continuidade de Nossa Árvore detalhada com fontes, lacunas e critérios; 84 testes, cinco arquivos SQL, tipos, build e 498 links aprovados novamente. Conferência do objeto Git e do hash remoto ao concluir o envio. [Registro](registros/registro-v0.11.0-2026-10-03-02-imp-publicacao-git-fun-continuidade-arvore.md).

## 2026-10-03 — Planejamento visual completo, sem nova versão de desenvolvimento

Atlas offline com Conta primeiro, 72 telas/estados, oito áreas, 12 percursos e cobertura das 37 interfaces. 45 telas planejadas e 27 recortes existentes com limites, contratos e permissões. Prévia, estados, destinos, filtros, teclado, layout móvel e impressão CSS verificados; zero erros JavaScript. Dois achados independentes corrigidos e reconferidos. Aplicativo, banco e versão 0.11.0 preservados; nenhum commit/push/deploy. Revisar o material antes de retomar Nossa Árvore. [Guia](../wireframes/GUIA.md), [pendências](../wireframes/COBERTURA.md) e [registro](registros/planejamento-2026-10-03-wireframe-completo.md).

## 2026-10-03 — Wireframe vivo e organização dos materiais de origem

Usuário determinou manutenção contínua do wireframe para refletir o desenvolvimento atual e futuro. Regra permanente registrada em estado, protocolo de andamento e guia: atualizar desenhos, contratos, permissões, situação e pendências junto a cada entrega afetada. Pasta Telas movida pelo usuário para Documentacao_Projeto_Nos/Telas; links e referências ajustados, sem refazer a movimentação. Versão funcional 0.11.0 preservada. [Registro](registros/planejamento-2026-10-03-manutencao-wireframe-organizacao-telas.md).

## 2026-10-03 — Publicação autorizada do atlas vivo no GitHub

Commit e push autorizados pelo usuário com descrição abrangente do trabalho: 72 telas/estados, 12 percursos, contratos/pendências, manutenção contínua e 35 materiais movidos para a documentação. Fetch sem divergência; 84 testes, tipos, build, atlas, 617 links e diff aprovados. Revisão independente sem achado bloqueante no atlas ou escopo. Objeto Git e hash remoto conferidos ao encerrar o envio; sem deploy ou alteração de versão funcional. [Registro](registros/planejamento-2026-10-03-publicacao-wireframe-github.md).

## 2026-10-04 — Fidelidade visual e UX do atlas, sem nova versão funcional

Corrigida a simplificação do atlas: 28 telas aprovadas importadas em 52 layouts/variações, oito composições de entrada conforme código, paleta e nove ícones comparados ao app local. Abas, rascunho e convite locais; modo histórico separado de regras atuais. 72 prévias, 173 saídas, 360 estados e 41 referências passaram, sem JavaScript/rede externa; revisão independente corrigida e reconferida. Nome Nos_App.dc.html preservado, links ajustados. Versão 0.11.0, app e banco preservados; unidade pronta para commit, sem publicação. [Registro](registros/registro-v0.11.0-2026-10-04-imp-fidelidade-visual-atlas-fun-referencia-ux-aprovada.md).

## 2026-10-05 — Conferência da sinalização e prioridade alta do atlas vivo

Conferidas as 72 fichas, situações e pendências no inventário e navegador: 45 Planejadas e 27 Recortes existentes, com rotas presentes no código. Definida consulta visual obrigatória ao modo Atlas vivo antes de criar/implementar/alterar/revisar telas, prioridade alta da composição e comparação com a interface real antes da entrega. Regra propagada ao guia, READMEs, frontend, procedência e continuidade; regras de segurança/consentimento preservadas. Verificação completa do atlas aprovada novamente; versão 0.11.0 mantida, sem publicação. [Registro](registros/registro-v0.11.0-2026-10-05-imp-prioridade-atlas-vivo-fun-orientacao-visual-implementacao.md).

## 2026-10-05 — Publicação autorizada de fidelidade e prioridade visual do atlas

Usuário autorizou commit e push com descrição abrangente da correção visual, layouts aprovados, comparação viva/histórica, recursos locais, importação/verificação, sinais e orientação de prioridade alta. Main inicialmente sem divergência; 84 testes, tipos, build, atlas completo e sinalização aprovados novamente. Revisão independente de publicação sem achados materiais; fonte renomeada R100 preservada, sem alteração funcional ou versão nova. Inspeção do commit e igualdade com main remoto são os controles finais de envio. [Registro](registros/registro-v0.11.0-2026-10-05-02-imp-publicacao-atlas-fun-fidelidade-prioridade-visual.md).

## 2026-10-06 — Incremento documental de autenticação e segurança v2.8

Revisão solicitada pelo usuário incorporada à especificação: oito requisitos originais, status real, arquitetura web/mobile, login social, biometria, recuperação, sessão/revogação, RLS e tratamento de dados. Propostas de senha e retenção distinguidas da implementação; fontes oficiais e critérios de aceite incluídos. Código e migrações consultados; links e diff conferidos. Sem nova versão funcional, alteração de interface, configuração de serviço ou publicação. [Registro](registros/registro-v0.11.0-2026-10-06-imp-revisao-autenticacao-fun-contratos-seguranca.md).

## 2026-10-07 — Conta e entrada completa — v0.12.0

- **Entrega:** telas 01–05 e 72 integradas: Conta como raiz, confirmação/reenvio, recuperação/redefinição segura, retorno de convite e apresentação opcional. Atlas atualizado e diferenças apresentadas em galeria.
- **Resultado:** 108 testes, tipos/build, jornada local real e revisão independente. Dados temporários removidos. Configuração nos-dev aplicada somente para URLs e senha mínima; outros 11 campos preservados.
- **Evidência:** [registro v0.12.0](registros/registro-v0.12.0-2026-10-07-imp-conta-entrada-fun-recuperacao-integrada.md), [contrato](funcionalidades/conta-entrada.md) e [comparação](../wireframes/comparacoes/v0.12.0-2026-10-07-conta-entrada-tela_01-tela_02-tela_03-tela_04-tela_05-tela_72/index.html). Sem commit, push Git ou deploy. SMTP de lançamento ainda exige validação operacional.


## 2026-10-07 — Publicação Git da v0.12.0

Commit/push autorizados para Conta e entrada completa, Atlas vivo sincronizado, galeria, testes/configuração e revisão documental de segurança pendente. [Registro de publicação](registros/registro-v0.12.0-2026-10-07-02-imp-publicacao-git-fun-rastreabilidade-conta-entrada.md). Conferência de conteúdo e hash remoto exigida; publicação Git não equivale a deploy.

Conferência desta publicação: 108/108 testes repetidos; objeto Git inspecionado; 74 arquivos incluindo a revisão v2.8. Captura histórica 72 corrigida no mesmo commit. Credenciais/artefatos excluídos e pendência de commit removida por evidência do objeto.

## 2026-10-07 — Visão global e padrão de sincronização — documentação v0.12.0

- **Entrega:** nova aba acima de Todas as áreas, todas as 72 telas e os 13 percursos reutilizados; sequência inicia em Conta e distingue alternativas, saídas e contexto. Renderização única das prévias e contratos entre as visões.
- **Procedimento:** toda alteração avalia impacto nas telas e sincroniza aplicativo/atlas; toda criação ou modificação acrescenta galeria datada de comparações, preservando as anteriores. Procedimento central referenciado na documentação de entrada e continuidade.
- **Resultado:** teste de igualdade das 72 composições e atualização dinâmica, navegação, filtros, celular e impressão CSS; fidelidade geral e seis telas de Conta em duas larguras aprovadas. P2 de filtro obsoleto reproduzido e corrigido; revisão independente de reconferência sem achados materiais no escopo revisado. Galeria com seis capturas antes/depois inspecionada.
- **Evidência e limite:** [registro](registros/registro-v0.12.0-2026-10-07-03-imp-visao-global-atlas-fun-sequencia-sincronizacao-comparacoes.md), [comparações](../wireframes/comparacoes/v0.12.0-2026-10-07-visao-global-tela_01-a-tela_72/index.html) e [padrão](../wireframes/comparacoes/README.md). Versão funcional preservada, sem alteração no aplicativo, commit, push ou deploy. Unidade pronta para commit autorizado.

## 2026-10-07 — Publicação autorizada de Visão global — v0.12.0

Usuário autorizou commit e push abrangentes da Visão global, reuso de composições/contratos, sequência e ramificações, correção de filtros, teste, galeria e procedimentos de manutenção. Fetch confirmou main sem divergência a partir de 7a1fedc. [Registro da publicação](registros/registro-v0.12.0-2026-10-07-04-imp-publicacao-atlas-fun-visao-global-procedimentos.md). Verificar conteúdo do objeto e hash remoto; excluir artefatos/credenciais. Sem deploy ou incremento de versão funcional.

Conferência da publicação: 108/108 testes repetidos, verificações global/fidelidade/Conta aprovadas, 781 alvos de links locais e diff conferidos. Objeto inicial inclui os 24 arquivos e coincide com a árvore preparada; pendência removida por evidência de inclusão, com atualização do controle no mesmo commit lógico. Hash final reportado após conferência remota no encerramento.


## 2026-10-07 — v0.13.0 — Navegação autenticada e Seus Núcleos

- Mudança: proteger etapas antes públicas e organizar Conta → lista real → Início, com retorno privado permitido. Sessão expirada renovável continua; não renovável pede login inclusive durante envio.
- Resultado: 88 testes sem backend e 44 autenticados, tipos/build, Atlas72/180/360 e Visão global aprovados; revisão independente sem achados materiais restantes.
- Evidência: [registro](registros/registro-v0.13.0-2026-10-07-05-imp-navegacao-protegida-fun-sessao-seus-nucleos.md), [contrato](funcionalidades/navegacao-sessao.md) e [comparações](../wireframes/comparacoes/v0.13.0-2026-10-07-sessao-navegacao-tela_01-tela_06-tela_12-tela_13/index.html). Ambiente/fixtures locais limpos e config restaurado. Sem migração remota, commit/push ou deploy.


## 2026-10-07 — Publicação autorizada da v0.13.0

Usuário autorizou commit/push abrangentes. Fetch confirmou main sem divergência. Implementação, testes, Atlas/galeria e documentação compõem uma unidade lógica; [registro de publicação](registros/registro-v0.13.0-2026-10-07-06-imp-publicacao-git-fun-rastreabilidade-navegacao.md). Conferir objeto e hash remoto no encerramento; sem deploy.

## 2026-10-07 — Publicação autorizada de Conta visual — v0.13.1

- **Evento Git:** usuário autorizou commit e push abrangendo a entrega inteira. Main/origin/main sem divergência após fetch, base cfcd57f. Suíte sem backend repetida: 88/88 aprovados. Objeto Git inspecionado: 33 arquivos e árvore inicial idêntica ao índice preparado. Pendência retirada e controle incorporado ao mesmo commit lógico; hash remoto conferido no encerramento.
- **Conjunto:** aplicativo, teste, versão, Atlas/ficha, galeria e documentação do alinhamento de Conta e remoção de link duplicado. Sem deploy ou migração.
- **Evidência:** [registro da publicação](registros/registro-v0.13.1-2026-10-07-02-imp-publicacao-git-fun-rastreabilidade-conta-visual.md).

## 2026-10-09 — Percurso 03 Recuperar acesso — v0.13.2

- **Produto:** retorno da confirmação/recuperação à Conta abre login com destino preservado; callback rejeita credenciais repetidas/misturadas antes do Auth, sem consumir token legítimo. Prova e regra de senha vigentes preservadas; PATCH 0.13.1 → 0.13.2.
- **Atlas/documentação:** sequência 01 → 04 → 05 → 01 → 12 com etapas distintas de Conta, callback técnico sem tela, reinício e retorno específico explícitos; galeria, fichas, cobertura, contrato e roteiro Gmail sincronizados.
- **Evidência:** 92 testes desktop/celular, tipos/build, integração real local e Atlas/Visão global aprovados; autorrevisão e revisão independente sem P1–P3. Compilação inicial causou esperas insuficientes nas primeiras execuções; repetição completa passou. Fixtures e e-mails locais removidos.
- **Operação:** usuário criou Gmail sintagmasoftware@gmail.com e informou bloqueio do Google, exigindo fator/dispositivo registrado por pelo menos sete dias. Pediu deixar preparado para somente informar a senha depois. Arquivo SMTP isolado e script com prompt oculto preparados; `-Check` aprovou configuração e acesso remoto, somente leitura. Sem ativação SMTP, envio externo, alteração remota, commit/push ou deploy. [Registro](registros/registro-v0.13.2-2026-10-09-imp-recuperacao-acesso-fun-percurso-03.md), [comparação](../wireframes/comparacoes/v0.13.2-2026-10-09-recuperar-acesso-tela_04-tela_05/index.html) e [roteiro SMTP](funcionalidades/recuperacao-smtp-gmail.md).

## 2026-10-10 — Publicação autorizada e retomada da recuperação — v0.13.2

- **Evento Git:** commit e push para main autorizados pelo usuário, abrangendo código, testes, Atlas/comparações, versão, preparação Gmail e documentação. Fetch sem divergência sobre e7ff9c1; 92/92 testes, tipos, build, percurso Atlas e galeria/links reconferidos. Objeto Git inspecionado: 40 arquivos e árvore inicial idêntica ao conjunto preparado; pendência retirada, controle incorporado ao mesmo commit lógico. Conferir hash remoto no encerramento.
- **Continuidade:** usuário solicitou retomar neste chat a ativação após liberação da senha de aplicativo; prompt oculto preparado, recebimento externo pendente. Senha comum criptografada não substitui autorização do Google. Sem aplicação SMTP remota ou deploy.
- **Evidência:** [registro de publicação](registros/registro-v0.13.2-2026-10-10-imp-publicacao-git-fun-rastreabilidade-recuperacao-acesso.md).

## 2026-10-10 — Percurso 04 Entrar por convite — v0.13.3

- **Produto:** tipo na prévia, adiamento/retorno à lista sem vínculo e erro de aceite associado ao código. Consulta, validade/revogação, associação e repetição conferidas com duas identidades locais.
- **Atlas:** chegada direta 01 → 10 → 11 → 13 → 12, entrada comum pela lista como alternativa, estados específicos e reservas QR/link/gestão. Telas 10/11 são estados da mesma rota; nenhuma tela futura declarada concluída.
- **Evidência:** 92 testes gerais, 16 testes autenticados de convite e fidelidade geral adicional aprovados; tipos/build, Percurso 04 e Visão global aprovados. 20 testes de navegação aprovados na execução combinada. Falhas de seletor dos testes novos corrigidas e repetidas; comparação sem sessão rejeitada e depois executada autenticada. Autorrevisão e revisão independente sem P1–P3. Capturas históricas preservadas, códigos mascarados e fixtures locais removidas.
- **Limites:** SMTP externo, QR/câmera, link e gestão da Tela 59 permanecem pendentes. Sem migração, alteração remota, commit/push ou deploy. [Registro](registros/registro-v0.13.3-2026-10-10-imp-entrada-convite-fun-percurso-04.md), [contrato](funcionalidades/entrada-convite.md) e [comparação](../wireframes/comparacoes/v0.13.3-2026-10-10-entrar-convite-tela_10-tela_11/index.html).

## 2026-10-10 — Publicação autorizada do Percurso 04 — v0.13.3

Usuário autorizou commit e push de toda a entrega, com descrição abrangente. Fetch confirmou main sem divergência sobre 446d3ee. Código, testes, Atlas/galeria, versão e documentação compõem uma unidade lógica; publicação exige reconferência das verificações, inspeção do objeto Git e igualdade de hash remoto. [Registro](registros/registro-v0.13.3-2026-10-10-02-imp-publicacao-git-fun-rastreabilidade-entrada-convite.md). Sem deploy ou alteração remota de banco/configuração.

Conferência do objeto desta publicação: 34 arquivos incluídos e árvore inicial 8166532172f56c9427d51541bc8cde156d963c6a idêntica ao índice preparado. Pendência removida após prova de inclusão, com atualização de controle incorporada ao mesmo commit lógico. Credenciais/artefatos excluídos; identificador final e igualdade remota conferidos após envio no encerramento.

## 2026-10-10 — Nomes versionados das pastas de comparações — documentação v0.13.3

Diretriz solicitada: novas galerias usam v<versão>-AAAA-MM-DD-assunto, como v0.13.3-2026-10-10-entrada-convite. Versão vem do estado vigente; ajustar nome/referências se a entrega finalizar com incremento funcional. Pastas históricas preservadas. Padrão e guia sincronizados; autorrevisão, links locais e diff conferidos. Sem alteração visual/funcional, incremento de versão, commit, push ou deploy. [Registro](registros/registro-v0.13.3-2026-10-10-03-imp-diretriz-comparacoes-fun-nomes-versionados.md).

## 2026-10-10 — Identificação da tela nas pastas de comparações — documentação v0.13.3

Padrão ampliado por solicitação do usuário para v<versão>-AAAA-MM-DD-assunto-tela_<número>, com prefixo literal tela_, como v0.13.3-2026-10-10-entrada-convite-tela_10. IDs reais do atlas; múltiplas telas identificadas individualmente no final. Em nomes repetidos, revisão fica no assunto para manter tela no final. Decisão anterior preservada e sinalizada como substituída. Autorrevisão, links locais e diff conferidos; sem incremento funcional, renomeação histórica, commit, push ou deploy. [Registro](registros/registro-v0.13.3-2026-10-10-04-imp-diretriz-comparacoes-fun-identificacao-tela.md).

## 2026-10-10 — Migração das galerias para nomes com versão e tela — documentação v0.13.3

Usuário autorizou aplicar o padrão às seis pastas existentes e corrigir seus caminhos. Versões históricas e imagens preservadas; links documentais, página de comparação e destinos de captura dos testes/auxiliares atualizados. Visão global identifica cobertura contínua como tela_01-a-tela_72, sem inventar ID do produto. Esta autorização substitui a manutenção dos nomes antigos registrada nas diretrizes anteriores. [Registro](registros/registro-v0.13.3-2026-10-10-05-imp-migracao-comparacoes-fun-caminhos-versionados-telas.md). Sem incremento funcional, commit, push ou deploy.

Conferência da migração: 77 arquivos em seis pastas; 71 imagens com hash idêntico e somente um HTML com link entre galerias alterado. Todas as galerias, oito opções de seletores e 18 links HTML locais carregados/conferidos sem erro/rede externa. Referências ativas antigas ausentes; configuração de testes autenticados carregada com --list (60 testes), sem execução dos fluxos ou regeneração de capturas.

## 2026-10-10 — Publicação autorizada das diretrizes e migração de comparações — v0.13.3

Usuário autorizou commit/push abrangentes do padrão versão/data/assunto/tela, da migração das seis galerias e da atualização de referências. Fetch confirmou main/origin/main sem divergência sobre dbefcd3. Verificação repetida das galerias/hashes/seletores/links, ausência de caminhos antigos ativos e carregamento dos testes com --list aprovada. [Registro da publicação](registros/registro-v0.13.3-2026-10-10-06-imp-publicacao-comparacoes-fun-rastreabilidade-migracao.md). Inspecionar objeto e igualdade remota; sem incremento funcional ou deploy.

Objeto desta publicação inspecionado: 101 arquivos, 76 renomes idênticos e um HTML com ajuste de link; árvore inicial 4973af998eaf908dcad8d664e40e32473e746a40 coincide com índice preparado. Pendência removida após comprovar inclusão e controle incorporado ao mesmo commit lógico. 917 alvos de links documentais e diff aprovados; identificador definitivo reportado após conferência remota no encerramento.


## 2026-10-10 — v0.14.0 — Percurso 05 Uma proposta de Hábito

- **Produto:** conferência antes do envio no hub; editar/erro conservam campos; autor conhece seu aceite e inclusão dos membros atuais. Sem nova rota ou migração.
- **Atlas:** disponível 18 → 22 → 23 → 24; guiado reservado 18 → 19 → 20 → 21 → 22 → 23 → 24. Tela 22 passa a recorte existente; 72 telas/14 percursos/32 recortes/40 planejadas. Categorias/referências históricas preservadas; atribuição visual corrigida.
- **Evidência:** 92 testes gerais, 4 casos autenticados e 1 comparador completo; banco 5 arquivos/6 testes, tipos/build, Atlas/Visão global; revisão independente com dois P2 corrigidos. Nenhum dado remoto alterado, commit, push ou deploy. [Registro](registros/registro-v0.14.0-2026-10-10-imp-proposta-habito-fun-percurso-05.md), [contrato](funcionalidades/proposta-habito.md), [galeria](../wireframes/comparacoes/v0.14.0-2026-10-10-proposta-habito-tela_18-tela_19-tela_20-tela_21-tela_22-tela_23-tela_24/index.html).


## 2026-10-12 — Reconferência e autorização de publicação de Hábito — v0.14.0

Usuário autorizou publicar Hábito e MVP em dois commits separados. Tipos/build, 92 testes gerais, cinco testes autenticados (uma repetição dispensada), banco 5/6 e Atlas aprovados novamente. Revisão identificou capturas prematuras das respostas/detalhe; esperas corrigidas e quatro imagens refeitas antes de publicar. Inicialização no G excedeu 120s; cópia local conferida por SHA-256 resolveu sem mudar fontes. Verificação somente local, sem deploy ou alteração remota de banco. [Registro](registros/registro-v0.14.0-2026-10-10-imp-proposta-habito-fun-percurso-05.md).

Objeto inicial de Hábito inspecionado: 57 arquivos; árvore ce5387d26f208b02d7730605bc2d4ed9d23fbe24 idêntica ao índice preparado. Inclusão dos arquivos confirmada, pendência retirada e controle incorporado ao mesmo commit lógico antes do envio.


## 2026-10-12 — MVP aprovado e roteiro completo — documentação v0.14.0

Usuário aprovou a guia MVP criada com dispensa inicial de documentos/comparações e autorizou registrar/publicar. Guia acima de Visão global, login existente primeiro, 13 etapas e cobertura única de 72 telas/184 ações. Primeiro marco tem 37 telas/estados; futuros módulos e funções transversais têm posição explícita. Plano em planos/mvp.md, procedimento de manutenção das três visões e nova comparação documental. Funcionalidades permanecem 32 recortes/40 planejadas; versão preservada. Prioridade geral muda para etapa 01; recomendações anteriores de Árvore/proposta guiada ficam históricas, previstas em 07/06.

Publicação separada conforme escolha do usuário: objeto de Hábito conferido no primeiro commit; MVP reúne 25 arquivos no segundo, árvore inicial 76fafd7569d2f39e604d64c74fc16a8fdeeb597e igual ao índice preparado. Revisão final independente sem achados pendentes; 992 links e nova galeria responsiva aprovados. Pendências de commit retiradas por prova de inclusão, controle incorporado à mesma unidade; conferir hash remoto no encerramento. Sem deploy.

Validação: MVP, Visão global, Percurso 05, fonte compartilhada, filtros/teclado/celular/retorno/hash/impressão; revisão independente com omissões de QR/administração/agenda mensal corrigidas. Publicação autorizada em dois commits separados: Hábito e depois MVP. [Plano](planos/mvp.md), [registro](registros/registro-v0.14.0-2026-10-12-imp-mvp-atlas-fun-roteiro-aprovado.md) e [comparação](../wireframes/comparacoes/v0.14.0-2026-10-12-mvp-atlas-tela_01-a-tela_72/index.html). Sem deploy.


## 2026-10-13 — v0.14.1 — Conferência da etapa 01 do MVP

Correção P2: login distingue indisponibilidade/limite de credenciais, Conta/raiz explicam falha de consulta de sessão. Regressores antes/depois, 100 testes gerais, tipos/build e jornada real local de e-mail aprovados; 14 testes autenticados de sessão executados antes da correção. Revisão independente sem achados relevantes restantes. Atlas/MVP/ficha e comparação Tela 01 sincronizados. Documentação autorizada após dispensa inicial. Google ainda não liberou senha de aplicativo: SMTP Gmail e recebimento externo permanecem bloqueio operacional da etapa 01. -Check conferiu preparação/acesso em leitura. Sem ativação, configuração remota, commit, push ou deploy. [Registro](registros/registro-v0.14.1-2026-10-13-imp-acesso-existente-fun-mvp-etapa-01.md).


## 2026-10-13 — Publicação autorizada da etapa 01 — v0.14.1

Usuário autorizou commit/push de toda a entrega com descrição abrangente. Fetch confirmou main/origin/main sem divergência sobre 2c7a836. Código, regressões, Atlas/MVP, seis imagens de comparação, versão e registros compõem uma unidade lógica. Reconferir testes/tipos/build e objeto Git; registrar inclusão antes de retirar pendência. SMTP Gmail continua bloqueado pelo Google. Sem deploy. [Registro da publicação](registros/registro-v0.14.1-2026-10-13-02-imp-publicacao-git-fun-rastreabilidade-mvp-01.md).

Conferência do objeto de publicação: 29 arquivos incluídos, árvore inicial 935142e09add8e73171ec69acd3d90f901c82e6c igual ao índice preparado. Pendência removida após comprovação; registros de controle incorporados ao mesmo commit lógico antes do envio autorizado. Hash definitivo e igualdade remota devem ser conferidos no encerramento.

## 2026-10-13 — v0.14.1 — Conexão e login online no Netlify

Site noslife.netlify.app retornava autenticação não configurada. Netlify sem variáveis confirmado; configurados endereço/chave pública Supabase e APP_ORIGIN somente em Production, seguido de deploy sem cache 6ace48f47aa1bb0b8a70bc68 Published em main a219fb4. Supabase Site URL online/retornos acrescentados com push parcial dos dois campos e diff posterior aprovado. Jornada HTTP do formulário publicado confirmou login, sessão por cookies, saída e proteção posterior com fixture confirmada; conta temporária removida/404. SMTP próprio desabilitado; usuário reconfirmou senha Gmail ainda não liberada. Cadastro com e-mail externo e recuperação completa (segredo ainda ausente no Netlify) permanecem pendentes. Código/versão/migrações preservados; sem commit/push. Autorrevisão; build remoto aprovado. [Registro](registros/registro-v0.14.1-2026-10-13-03-imp-conexao-netlify-fun-acesso-online.md).

## 2026-10-13 — Publicação autorizada da conexão Netlify — v0.14.1

Commit/push autorizados para a unidade de conexão/login online, incluindo referência parcial Supabase, README, contrato, MVP/cobertura, Brag e registros. Fetch confirmou main/origin/main 0/0 sobre a219fb4. Trabalho paralelo da etapa 02 do Núcleo preservado fora do conjunto. Sem novo código/migração; cadastro externo segue bloqueado pela senha Gmail. Verificar conteúdo do objeto antes de retirar pendência e comparar hash remoto após push. [Registro](registros/registro-v0.14.1-2026-10-13-04-imp-publicacao-git-fun-rastreabilidade-acesso-online.md).

Objeto inicial 52c4604 conferido: 10 arquivos e árvore 0a4131df6dfe142182491df9112ad4ee52db8d25 idêntica ao índice preparado. Pendência de commit retirada por prova de inclusão; controle incorporado ao mesmo commit lógico antes do push. 415 links locais, diff preparado e configuração remota parcial reconferidos. Confirmar hash definitivo no remoto após o envio.

## 2026-10-13 — v0.15.0 — MVP 02 Núcleo compartilhado

Gestão privada do criador implementada: filtros/paginação, confirmação/cancelamento e RPC de revogação idempotente sem remover membros. Geração e aceite/revogação com bloqueios; cópia/expiração, navegação/retorno Auth e estados sincronizados. Atlas 33 existentes/39 planejadas/186 ações, QR/link/histórico individual reservados. 102 testes gerais, rodadas autenticadas 28/44 e seis finais; banco 6 arquivos/19 verificações; tipos/build/Atlas/revisão independente aprovados. Contagem100: auditoria over-engineering baixo, sem novas dependências/tabelas/camadas. Sem operação remota/commit/push/deploy; unidade pronta registrada. [Registro](registros/registro-v0.15.0-2026-10-13-imp-nucleo-compartilhado-fun-mvp-02-gestao-convites.md).

## 2026-10-13 — Publicação Git autorizada do MVP 02 — v0.15.0

Usuário autorizou commit/push abrangentes da entrega. Base/main remoto 5819a52 iguais após fetch (0/0). Reconferência de testes gerais/tipos/build e Atlas; descrição cobre código/migração/testes/navegação/Atlas/galeria/registros/versão. Inspecionar índice/objeto e incorporar controle de pendência ao mesmo commit lógico. Sem migração remota ou deploy manual; eventual pipeline automático não é certificado. [Registro](registros/registro-v0.15.0-2026-10-13-02-imp-publicacao-git-fun-rastreabilidade-mvp-02.md).

Reconferência para publicação: 102 testes gerais, tipos/build produção e quatro verificadores Atlas aprovados; 591 referências sem ausências. Testes em cópia C: com hash e startup de produção temporário após limitações dos servidores dev G/C. Fontes/configuração original preservados, cópia removida. Índice com 59 arquivos sem credenciais/artefatos.

Objeto de publicação inspecionado: 59 arquivos e 19 imagens; árvore inicial 2b332e7fcf7d942cd9b37cd1c2ce0dd6acf26a2b igual ao índice preparado. Inclusão comprovada, pendência retirada e controle incorporado ao mesmo commit lógico antes do push autorizado. Comparar identificador definitivo ao remoto no encerramento.

Controle de publicação MVP05 em14/10/2026:87 arquivos/46 imagens conferidos no objeto inicial5572751; árvore6efcec131b6e924af9d1df056a9a489de7f1e8fc idêntica ao índice preparado. Pendência retirada por prova de inclusão; controle incorporado ao mesmo commit antes do push.106 testes/tipos/build/Atlas/revisão aprovados. Hash definitivo/equivalência remota reportados no encerramento, sem deploy certificado.

Controle de inclusão da publicação documental:28 documentos no objeto inicial5602093; árvorecb6e4bd383d69f12e82e367e060d980e047dfb6e igual ao índice preparado. Nenhuma mudança de código/banco/manifestos. Pendência retirada após comprovar inclusão e controle incorporado ao mesmo commit lógico antes do push. Confirmar hash final remoto no encerramento.

## 2026-10-18 — v2.0.0 — Migração integral do Layout atual

Todas as famílias de rotas passam à nova estrutura, preservando ações e permissões. Kanban/Painéis/lista de Acordos e seis esboços privados sem persistência; Atlas73 fichas sincronizado.122 testes gerais e87 cenários autenticados consolidados aprovados/1 dispensa; tipos/build local e verificador73 telas/207 ações/365 estados. Capturas históricas preservadas e nova galeria165 imagens. Revisões estática/funcional corrigiram menu administrativo, cascata/hierarquia, eventos do Atlas, rótulos e evidência de capturas. Sem nova migração, commit, push ou deploy. [Registro](registros/registro-v2.0.0-2026-10-18-imp-layout-atual-fun-migracao-integral.md).

## 2026-10-21 — v3.0.4 — Propósito no Início
Propósito e vínculo movidos para o cabeçalho; diálogo duplicado removido e Atlas alinhado. Tipos, seis testes de lógica e sintaxe aprovados. Sem publicação. Registro: registros/registro-v3.0.4-2026-10-21-imp-inicio-nucleo-fun-proposito-e-participacao.md.

## 2026-10-21 — v3.0.4 — Publicação GitHub autorizada
Preparado commit atômico do propósito e vínculo no Início, Atlas, manifestos e registros; tipos e seis testes de lógica revalidados. Conferência de hash remoto no fechamento da operação; deploy não certificado.

## 2026-10-21 — v3.0.4 — Correção da compilação local antiga
Diagnóstico comprovou next start servindo build15/10. Compilações obsoletas isoladas fora do app por bloqueio de exclusão; build padrão atual e npm run dev validados. Quatro testes de interface e21 capturas públicas aprovados. Nenhuma fonte alterada. Registro: registros/registro-v3.0.4-2026-10-21-02-imp-execucao-local-fun-layout-atual.md.

## 2026-10-21 — v3.0.5 — Destaque de administração no Início
Selo verde, negrito e escudo para quem administra o Núcleo; mensagem comum preservada para membros. Atlas alinhado; tipos/seis testes/sintaxe aprovados. Registro: registros/registro-v3.0.5-2026-10-21-imp-inicio-fun-destaque-administracao.md. Sem publicação.

## 2026-10-21 — v3.0.6 — Atalhos complementares no menu Mais
Removidas quatro duplicações da navegação móvel; grupos vazios ocultados e desktop preservado. Componente validado isoladamente antes/depois; tipos/quatro testes públicos/sintaxe aprovados. Asserções autenticadas adicionadas, não executadas. Registro: registros/registro-v3.0.6-2026-10-21-imp-menu-mobile-fun-atalhos-complementares.md. Sem publicação.

## 2026-10-21 — v3.0.6 — Publicação integral autorizada
Três unidades: execução local1e6fb0d, destaque1c8be96 e menu móvel complementar, com Atlas/testes/manifestos/registros. Tipos, dez testes, verificação isolada, sintaxe e build padrão aprovados. Conferência remota no fechamento; deploy não certificado. Registro: registros/registro-v3.0.6-2026-10-21-02-imp-publicacao-github-fun-consolidacao-ajustes.md.
