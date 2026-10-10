# Estado do Projeto Nós

**Versão vigente do projeto:** 0.13.2

**DOCS_DIR:** `Documentacao_Projeto_Nos`

**Atualizado:** 2026-10-10

## Publicação autorizada e retomada — v0.13.2 — 2026-10-10

Usuário autorizou commit e push abrangentes para main e solicitou retomar neste chat a ativação externa posteriormente. Fetch confirmou main/origin/main sem divergência sobre e7ff9c1. Suíte repetida: 92/92 aprovados; tipos, build, verificador do Percurso 03 e galeria/links reconferidos. [Registro de publicação](registros/registro-v0.13.2-2026-10-10-imp-publicacao-git-fun-rastreabilidade-recuperacao-acesso.md). Objeto Git inspecionado: 40 arquivos, árvore inicial 0573e1e34e0751ad0d17c78c1e893860528ffdd3 igual ao conjunto preparado, incluindo implementação, testes, versão, Atlas, comparações, preparação SMTP e documentação. Pendência retirada após essa prova; controle incorporado ao mesmo commit lógico. Comparar hash remoto após push no encerramento. Sem deploy.

**Retomada neste chat:** gerar a senha de aplicativo após liberação do Google, executar o comando com prompt oculto indicado no [roteiro Gmail](funcionalidades/recuperacao-smtp-gmail.md), certificar recebimento e recuperação externos. Senha comum do Gmail, mesmo criptografada, não substitui a autorização de SMTP. Não foi aplicada configuração SMTP remota.

## Entrega atual — Percurso 03 Recuperar acesso — v0.13.2 — 2026-10-09

**Status:** correções e integração local concluídas, revisadas e validadas; operação pública parcialmente concluída, com Gmail SMTP/recebimento pendentes. PATCH de 0.13.1 para 0.13.2 após as verificações. Objetivo atendido no aplicativo/Atlas: sequência lógica e recuperação funcional, com dependências externas explícitas.

**Escopo/decisões:** rejeitar callback ambíguo antes do Auth; retornar à Conta em modo login com next preservado; explicitar 01 → 04 → 05 → 01 → 12 e callback sem tela própria. Retorno específico de convite continua independente do aceite. Sem dependência, migração ou nova rota.

**Validação:** 92 testes desktop/celular, tipos/build, cinco testes unitários no ciclo de regressão, integração real local e Atlas/Visão global aprovados; autorrevisão e revisão independente do código sem P1–P3. Primeiro servidor de testes excedeu a espera de inicialização e uma execução teve espera insuficiente de Boas-vindas; repetição completa aprovada. Integrador recebeu margem para compilar rotas, passou e limpou contas/e-mails temporários, encerrando servidor. Capturas inspecionadas. Inventário permanece 72 telas/14 percursos/31 recortes/41 planejadas.

**Bloqueio operacional:** usuário criou Gmail sintagmasoftware@gmail.com em 2026-10-09; Google exige fator/dispositivo registrado há pelo menos sete dias para confirmar identidade e liberar senha de app. Preparação concluída: arquivo isolado SMTP e comando com prompt oculto; `-Check` aprovou TOML e acesso remoto, somente leitura. Falta liberação do Google, senha de app no prompt/painel e recebimento externo comprovado. Não registrar senha em documentos ou código. Produção ainda exige origem/segredo e URLs HTTPS corretos.

**Próximo passo executável:** após liberação do Google, gerar senha de app e executar `scripts/configure-gmail-smtp.ps1` na raiz nos, informando-a no prompt oculto; depois validar recebimento e recuperação externos com conta autorizada. **Git:** main, base e7ff9c1; publicação autorizada e objeto inspecionado no marco de 2026-10-10 acima. **Unidades pendentes de commit:** nenhuma desta entrega. Título: `fix(auth): concluir recuperação de acesso e preparar SMTP Gmail`. Sem deploy.

**Ferramentas:** Superpowers entendimento/depuração/TDD/revisão/verificação ativos; Context7 consultado para Supabase, versões do projeto mantidas; Octocode CLI 19.1.0 consultada, grafo sintático parcial complementado com busca local; Supabase CLI 2.118.0 e Docker na integração local, mais `config diff` remoto somente leitura para conferir a preparação SMTP. Sem alteração remota de configuração ou banco. Revisão independente final do script/Atlas e sintaxe PowerShell sem P1–P3.

**Conferência final:** build reconferido na v0.13.2; 419 links locais dos documentos alterados e todas as imagens da galeria aprovados. `.env.local` confere projeto nos-dev, origem, chave pública e segredo de recuperação com tamanho suficiente, sem expor valores. Cache operacional da CLI ignorado por supabase/.gitignore. Supabase local encerrado com backup, sem reset; servidor de prévia da galeria na porta 3400, apenas local.

**Índice:** [registro v0.13.2](registros/registro-v0.13.2-2026-10-09-imp-recuperacao-acesso-fun-percurso-03.md), [contrato Conta e entrada](funcionalidades/conta-entrada.md), [configuração Gmail](funcionalidades/recuperacao-smtp-gmail.md), [comparação](../wireframes/comparacoes/2026-10-09-recuperar-acesso/index.html), [verificador Atlas](../wireframes/tools/verify-recovery-journey.mjs).

Os marcos abaixo são históricos e não autorizam publicação da entrega atual.

## Entrega atual — alinhamento visual de Conta — v0.13.1 — 2026-10-07

**Publicação autorizada nesta interação:** commit e push de toda a entrega em main, com descrição abrangente. Fetch confirmou HEAD/origin/main sem divergência sobre cfcd57f02af87540b746bf3b0bfce87caf165d53. Suíte sem backend repetida: 88/88 aprovados. [Registro da publicação](registros/registro-v0.13.1-2026-10-07-02-imp-publicacao-git-fun-rastreabilidade-conta-visual.md). Objeto Git inspecionado: 33 arquivos e árvore inicial fe98a545957ca6bd6e51d47380bce4e52ccd5e46 idêntica ao conjunto preparado. Pendência retirada após essa prova; atualização incorporada ao mesmo commit lógico. Conferir hash remoto após push no encerramento. Sem deploy.

**Objetivo atendido:** alternar cadastro/login sem deslocar horizontalmente a composição nem baixar a árvore/frases no cadastro; remover Conheça o Nós e preservar o link superior. PATCH visual; contratos de autenticação preservados.

**Escopo/arquivos:** page.tsx de Conta, globals.css, AuthForm, teste existente de entrada, representação/ficha do Atlas e galeria. Referência vertical derivada da altura do login; reserva da barra de rolagem restrita a Conta; respiro inferior de 60px preserva a composição. Conta autenticada conserva centralização. Sem dependência nova.

**Validação:** 24/24 testes de Conta desktop/celular, tipos e build aprovados; medição em seis tamanhos de 320 a 1440px confirmou mesma posição nas duas abas e ausência de transbordamento horizontal. Atlas de Conta, seis telas em duas larguras, e Visão global de 72 composições aprovados. Autorrevisão e revisão independente; achado P2 de escopo CSS corrigido, sem achados materiais restantes. Capturas inspecionadas. Limitação preexistente: verify-fidelity.mjs espera /comecar público, incompatível com proteção da v0.13.0; não corrigido fora do escopo.

**Ferramentas:** Superpowers depuração/revisão/verificação aplicados. Context7 consultado para useLayoutEffect no React; versão exata 19.3 não indexada, complementada pela referência oficial compatível e compilação local. Busca avançada com Octocode dispensada neste ajuste delimitado. Sem migração ou deploy; commit/push autorizados nesta interação, conforme controle acima.

**Git:** main, base cfcd57f. Unidade commitada e objeto inspecionado: aplicativo, teste, versão, Atlas, galeria e documentação completos. **Unidades pendentes de commit:** nenhuma desta entrega. Controle incluído no mesmo commit lógico; envio autorizado nesta interação e hash remoto conferido no encerramento. Título: `fix(conta): estabilizar abas e remover link duplicado`.

**Próximo passo executável:** conferir /conta no navegador habitual alternando as abas e redimensionando a janela; conferir retorno pelo link superior. Próxima evolução funcional continua o contrato de dados de Nossa Árvore. Nenhum bloqueio do recorte visual.

**Índice desta entrega:** [registro v0.13.1](registros/registro-v0.13.1-2026-10-07-imp-conta-fun-alinhamento-visual.md), [contrato de Conta](funcionalidades/conta-entrada.md), [galeria antes/depois/Atlas](../wireframes/comparacoes/2026-10-07-conta-alinhamento/index.html).

Os marcos abaixo são históricos; a publicação autorizada da v0.13.0 não autoriza publicar esta nova entrega.

## Publicação autorizada — v0.13.0 — 2026-10-07

Usuário solicitou commit e push abrangendo toda a entrega. Main e origin/main iguais após fetch; base 71310978b56fb1b425b163bba04b89a5f18d270a. Conjunto: navegação/sessão, Seus Núcleos, testes, atlas/galeria, contratos e continuidade. [Registro da publicação](registros/registro-v0.13.0-2026-10-07-06-imp-publicacao-git-fun-rastreabilidade-navegacao.md). Suíte sem backend repetida: 88/88 aprovados; 44 testes autenticados da entrega preservados, 813 links e diff conferidos; Objeto do commit inspecionado: 82 alterações com renomes reconhecidos, árvore inicial 86556e8d92ac93a10e5dd9823a9c37132413b078 idêntica ao conjunto preparado. Pendência removida após essa prova; controle incorporado ao mesmo commit. Envio autorizado; comparar HEAD com main remoto após push no encerramento. Sem deploy.

## Entrega vigente — navegação protegida e Seus Núcleos — v0.13.0 — 2026-10-07

**Objetivo atendido:** todo /comecar e /nucleos exige sessão validada; visitante vai ao login e retoma somente destino interno permitido. Raiz/login sem destino específico abre Seus Núcleos para pessoa autenticada. Tela 12 real consulta vínculos sob RLS, com páginas de 20, vazio/carregamento/erro e seleção explícita. Remove rascunho pré-login conforme aprovação do usuário.

**Decisões:** expiração com renovação válida mantém sessão; inválida/não renovável pede login; falha do Auth bloqueia com 503 sem afirmar logout. Proteção de ações/consultas e RLS preservada. POST expirado usa protocolo de redirecionamento do App Router, sem executar criação. Atlas/Visão global/fichas/percursos/comparações sincronizados: 72 telas, 41 planejadas, 31 recortes, 14 percursos.

**Validação:** 88 testes sem backend e 44 autenticados (desktop/celular), tipos/build de produção aprovados; Atlas: 72 prévias, 180 saídas e 360 estados e Visão global aprovados. Autorrevisão e revisão independente sem achados materiais restantes. Testes de token/cookies, renovação, retorno, isolamento, paginação e envio após expiração. [Registro](registros/registro-v0.13.0-2026-10-07-05-imp-navegacao-protegida-fun-sessao-seus-nucleos.md), [contrato](funcionalidades/navegacao-sessao.md), [galeria](../wireframes/comparacoes/2026-10-07-sessao-navegacao/index.html).

**Ambiente:** Supabase local temporário encerrado sem reset e config original restaurado; fixtures/cópias de teste removidas. Portas alternativas resolveram faixa reservada do Windows; cópia C: por SHA-256 resolveu disco/caminhos entre volumes. Sem credenciais persistidas, alteração remota de banco ou migração. Publicação Git tratada no marco acima. Código revisado em main sobre 71310978b56fb1b425b163bba04b89a5f18d270a.

**Próximo passo executável:** testar manualmente na aplicação local o acesso sem login, login com destino e seleção de Núcleo. Para lançamento, conferir SMTP/remetente, segredo e retornos HTTPS no ambiente escolhido. Próxima implementação planejada: fontes/contrato da Tela 38 Nossa Árvore. Nenhum bloqueio desta entrega.

**Unidades pendentes de commit:** nenhuma desta entrega. Inclusão de implementação, testes, atlas, galeria e registros comprovada por inspeção do objeto Git e igualdade com a árvore preparada. Publicação autorizada no marco acima; controle incluído no mesmo commit lógico. Marcas anteriores abaixo são históricas.

**Ferramentas:** Superpowers de depuração, entendimento, testes, revisão e verificação aplicados. Context7 consultado para Supabase SSR e Next; versão instalada 16.3.6 complementada pela documentação/código locais. Octocode CLI 19.1.0 consultado para dependentes do retorno de autenticação; grafo parcial por aliases complementado com buscas locais delimitadas. Playwright, Supabase CLI 2.118.0 e Docker usados somente na integração local.

**Conferência de encerramento:** 809 links locais, dez imagens da galeria em 1440/375 pixels, diff e tipos na v0.13.0 aprovados. Último P3 documental da Tela 72 corrigido e Visão global reconferida. Galeria/atlas servidos localmente em http://127.0.0.1:3400/comparacoes/2026-10-07-sessao-navegacao/index.html; processo de prévia local, sem publicação.

**Git — marco histórico de Visão global:** main; publicação autorizada de Visão global e procedimentos a partir de 7a1fedc21c90e62b2e644bf80e85c7929fce42f5, igual a origin/main após fetch. Conjunto commitado e objeto inspecionado; commit identificado pela mensagem `docs(atlas): adicionar visão global e padronizar sincronização e comparações`. Hash definitivo e main remoto conferidos no encerramento. Versão 0.12.0 preservada; sem deploy.

## Publicação autorizada — Visão global — 2026-10-07

**Escopo:** publicar um commit lógico com a aba, renderização compartilhada, sequência e ramificações, navegação/filtros, teste permanente, galeria com seis capturas e procedimento de sincronização/comparações. Inclui guia, cobertura, procedência, README, frontend, andamento, histórico e Brag. [Registro de publicação](registros/registro-v0.12.0-2026-10-07-04-imp-publicacao-atlas-fun-visao-global-procedimentos.md).

**Controle:** fetch confirmou ausência de divergência (0/0). Objeto do commit inspecionado: os 24 arquivos da entrega estão incluídos e a árvore inicial coincide com o índice preparado (965eace6228b75ebaae0b3f321bb2541e5f55f1a). Pendência removida após essa confirmação; atualização deste controle incorporada ao mesmo commit lógico. Conferir objeto final e HEAD contra main remoto após o push. Artefatos locais, credenciais, dependências e resultados de execução excluídos. Publicação Git não equivale a deploy.

**Validação desta publicação:** 108/108 testes desktop/mobile repetidos; Visão global, fidelidade geral (72 prévias/178 saídas/360 estados) e seis telas de Conta em duas larguras aprovadas novamente. Sem erro JavaScript/rede externa no atlas. Tipos/build do aplicativo não repetidos, pois código funcional e manifestos estão intactos.

## Entrega vigente — Visão global do atlas — 2026-10-07

**Objetivo atendido:** aba Visão global acima de Todas as áreas; leitura começa em Conta e reúne todas as 72 telas em oito áreas, com os 13 percursos existentes e suas alternativas/condições. Desenhos, textos, situações, pendências e saídas reutilizam as mesmas fontes e componentes do atlas por áreas. São 30 recortes existentes e 42 telas planejadas; nenhum status funcional foi promovido nesta entrega.

**Decisão permanente:** consultar o Atlas vivo com prioridade alta antes de toda mudança; avaliar o impacto em todas as telas e sincronizar aplicativo, atlas, fichas, percursos, cobertura e pendências no mesmo conjunto lógico. Toda criação ou alteração deve acrescentar uma galeria datada em comparacoes/, preservando evidências anteriores. Reuso sincroniza automaticamente as visões do atlas; a correspondência com o aplicativo exige alteração e conferência explícitas. [Procedimento obrigatório](../wireframes/GUIA.md#visão-global-sincronização-e-comparações--procedimento-permanente), [índice de comparações](../wireframes/comparacoes/README.md).

**Arquivos principais e evidência:** [mapa vivo](../wireframes/atlas/index.html#visao-global), global-view.js/global-view.css e renderização compartilhada em atlas.js; [teste permanente](../wireframes/tools/verify-global-view.mjs), [galeria antes/depois](../wireframes/comparacoes/2026-10-07-visao-global/index.html) e [registro v0.12.0](registros/registro-v0.12.0-2026-10-07-03-imp-visao-global-atlas-fun-sequencia-sincronizacao-comparacoes.md). Teste demonstrou igualdade das 72 composições, atualização de dados e tela nova, filtros, teclado, celular, hash e impressão por CSS. Fidelidade e seis telas reais de Conta em duas larguras reconferidas. Capturas inspecionadas; revisão independente reconferiu o P2 corrigido de alternância com filtros, sem achados materiais restantes no escopo revisado. Sem erros JavaScript ou chamadas externas no atlas.

**Limites e retomada:** v0.12.0 preservada; src/, banco e manifestos intactos. Suíte funcional, tipos e build do aplicativo não repetidos nesta alteração exclusiva de atlas/documentação. Sem bloqueio para este artefato. Próximo passo funcional: fechar fontes e contrato de Nossa Árvore antes dos indicadores; dependências operacionais de autenticação permanecem registradas na entrega de Conta abaixo. Usar Visão global para localizar o contexto e conferir a ficha e o desenho vivo antes de implementar.

**Unidades pendentes de commit:** nenhuma desta entrega. Inclusão de Visão global, renderização compartilhada, teste, comparações e procedimento documental comprovada pela inspeção do objeto Git. Publicação autorizada nesta interação; resumo no marco acima.


## Entrega vigente — Conta e entrada — v0.12.0 — 2026-10-07

**Objetivo atendido:** toda a área Conta e entrada do Atlas vivo, incluindo as telas 01–05 e a Entrada afetiva opcional 72. Conferência inicial localizou duas telas planejadas e ações pendentes; a auditoria completa identificou também a tela 72 no fim do inventário. Todas agora têm rotas/ações integradas, sem login social ou aceites jurídicos fictícios.

**Escopo e resultado:** raiz abre Conta; cadastro segue para confirmação visual com reenvio; recuperação e redefinição de senha reais; prova assinada vinculada a sessão validada por 15 minutos; revogação global após senha nova e novo login; retorno de convite preservado. /boas-vindas é opcional, sem espera. Atlas/aplicativo compartilham identidade, composição, textos, campos e ações. Decisão permanente do usuário em 2026-10-07: qualquer mudança visual ou funcional em um lado deve atualizar o outro e apresentar as diferenças.

**Evidência:** 108 testes desktop/mobile; tipos/build; jornada local com e-mails, PKCE e token direto, senha antiga negada, nova aceita, refresh token de outra sessão revogado, link reutilizado/cookie adulterado rejeitados e limpeza de fixtures. Atlas: 72 prévias, 178 saídas, 360 estados, 13 percursos, 41 referências; seis telas em duas larguras comparadas. Sem erro JavaScript/rede externa. Autorrevisão e revisão independente; três P2 corrigidos e leitura final sem achados materiais.

**Configuração:** Supabase CLI 2.118.0 atualizou somente dois campos no nos-dev: retornos de confirmação/recuperação (incluindo next) e mínimo de senha oito. Diff remoto posterior: zero mudanças nessas propriedades; 11 campos não declarados preservados. AUTH_RECOVERY_SECRET criado somente em .env.local ignorado pelo Git. Não certificado SMTP/domínio/remetente de produção, nem executada jornada autenticada remota. Não houve commit, push Git ou deploy do app.

**Arquivos e continuidade:** [contrato da área](funcionalidades/conta-entrada.md), [plano executado](planos/conta-entrada.md), [registro v0.12.0](registros/registro-v0.12.0-2026-10-07-imp-conta-entrada-fun-recuperacao-integrada.md), [comparação antes/atlas/aplicação](../wireframes/comparacoes/2026-10-07-conta-entrada/index.html). Configuração e roteiro operacional no contrato. Atlas passa a 42 telas planejadas e 30 recortes existentes.

**Próximo passo executável:** conferir SMTP/remetente e segredo/URLs HTTPS no ambiente destinado ao lançamento. Telas e integração da área implementadas; dependências operacionais não equivalem a telas ausentes. Próximo módulo planejado permanece Nossa Árvore: fechar fontes/contrato antes dos indicadores. Esta entrega substitui a continuidade que priorizava Árvore como tarefa ativa; marcos abaixo são históricos.

**Unidades pendentes de commit:** nenhuma desta entrega. Objeto do commit inspecionado e árvore comparada ao índice preparado; inclui implementação, atlas, galeria, testes, registros e revisão documental de segurança anteriormente pendente. Credenciais/artefatos de execução excluídos.

## Revisão documental — autenticação e segurança v2.8 — 2026-10-06

Incremento solicitado pelo usuário concluído na [especificação v2.8](../Projeto_Nos_v2.8_Autenticacao_e_Seguranca.md). Requisitos originais mapeados para status e critérios de aceite; corrigidas distinções de sessão/bloqueio, arquitetura mobile e anonimização. Recuperação, login social, biometria, direitos dos titulares e controles operacionais permanecem pendentes de implementação. Política de senha de 15 caracteres e prazos são propostas, sem alteração do código ou da configuração do Auth.

[Registro da revisão](registros/registro-v0.11.0-2026-10-06-imp-revisao-autenticacao-fun-contratos-seguranca.md). Edição v2.8 e versão funcional 0.11.0 mantidas. Validação documental por confronto com código/migrações, fontes oficiais, links e diff; sem testes funcionais novos. Alterações locais sem commit, push ou deploy nesta interação. A próxima implementação de Nossa Árvore permanece como continuidade; futuros recortes de autenticação devem seguir os contratos e critérios da v2.8.

## Publicação atual — fidelidade e prioridade visual do atlas — 2026-10-05

**Autorização e escopo:** usuário solicitou commit e push de toda a correção visual e sua orientação documental, com descrição abrangente. Fetch confirmou main sem divergência. Publicar layouts aprovados, identidade, comparação viva/histórica, recursos locais, importação/verificação, sinalização e prioridade alta. [Registro de publicação](registros/registro-v0.11.0-2026-10-05-02-imp-publicacao-atlas-fun-fidelidade-prioridade-visual.md).

**Validação final:** 84/84 testes desktop/mobile, tipos e build aprovados novamente. Atlas: 72 prévias, 173 saídas, 360 estados, 41 referências e 52 layouts/28 telas, sem erro JavaScript ou chamadas externas. Sinais de 72 fichas e rotas dos 27 recortes reconferidos; fonte renomeada R100 idêntica. Revisão independente de publicação sem achados materiais; recursos temporários/credenciais fora do conjunto. Código funcional, banco e versão 0.11.0 preservados.

**Controle de publicação:** objeto do commit inspecionado, com árvore idêntica ao conjunto preparado e 33 arquivos, incluindo renomeação R100. Nenhum arquivo de execução temporária ou credencial incluído; pendência de commit removida após essa confirmação. Conferir HEAD contra main remoto após o push e reportar o identificador na conclusão; publicação Git não comprova deploy. 714 links locais e diff aprovados na consolidação final.

**Retomada:** consultar Tela 38 no Atlas vivo, fechar contrato de Nossa Árvore e manter desenho/ficha/pendências sincronizados com a próxima implementação.

## Marco — sinalização e prioridade alta do atlas vivo — 2026-10-05

**Objetivo atendido:** conferidas as 72 telas; situações e pendências coincidem entre fichas, inventário, miniaturas e inspeção. As 27 bases funcionais apontam para rotas presentes no código; 45 telas continuam Planejadas. Origem aprovada e Recorte existente não confirmam todas as ampliações do desenho. [Registro](registros/registro-v0.11.0-2026-10-05-imp-prioridade-atlas-vivo-fun-orientacao-visual-implementacao.md).

**Decisão permanente — prioridade alta:** antes de criar, implementar, alterar ou revisar qualquer tela, abrir o modo Atlas vivo e conferir obrigatoriamente seu aspecto, hierarquia, paleta, fontes, ícones, abas, navegação e estados, além da ficha. Guiar a interface prioritariamente por ele; o desenho histórico é comparação. Comparar resultado real e atlas antes de concluir, registrar divergências necessárias e atualizar desenho/contratos/pendências no mesmo recorte. Seguir o [procedimento obrigatório](../wireframes/GUIA.md#prioridade-alta-do-atlas-vivo--decisão-de-2026-10-05). Essa prioridade visual preserva regras vigentes, segurança e consentimento.

**Validações:** cruzamento no navegador das 72 fichas/miniaturas com COBERTURA.md e presença das rotas existentes; verificação completa do atlas aprovada novamente (72 prévias, 173 saídas, 360 estados, 52 layouts, 41 referências), sem erro JavaScript ou chamadas externas. 709 links locais e git diff --check aprovados; autorrevisão e revisão documental independente sem achados materiais. Alteração atual somente documental, sem nova versão funcional. Continuidade, README, frontend, guia e procedência atualizados.

**Próximo passo:** abrir Tela 38 no Atlas vivo e sua ficha, fechar contrato de Nossa Árvore e implementar somente o recorte aprovado com dados reais. Correção visual anterior e sua orientação documental continuam pendentes do mesmo conjunto lógico de commit; nenhum push/deploy realizado.

## Marco — fidelidade visual e UX do atlas — 2026-10-04

**Objetivo atendido:** corrigida a simplificação excessiva, incorporando as 28 telas aprovadas de Nos_App.dc.html em 52 layouts/variações e as oito composições de Conta/onboarding baseadas no código. As três rotas solicitadas foram comparadas ao app local, incluindo paleta exata, títulos, nove tipos, descrições e SVG. Conta permanece primeira; 72 telas, 45 planejadas e 27 recortes existentes. [Registro da entrega](registros/registro-v0.11.0-2026-10-04-imp-fidelidade-visual-atlas-fun-referencia-ux-aprovada.md), [atlas](../wireframes/atlas/index.html), [procedência e manutenção](../wireframes/FIDELIDADE.md).

**Decisões:** aplicação como referência da entrada; documento como base visual dos demais módulos. Modo vivo atualiza contratos; modo histórico preserva composição com aviso de exemplo. Regras atuais prevalecem sobre níveis, força, assinaturas e promoção antigos. Ponte permanece privada, sem chat; destinos e autoria respeitados. Importação gera HTML/SVG local, sem support.js ou dependência nova. Renomeação preexistente para Nos_App.dc.html preservada, com links atualizados.

**Validações recentes:** 72 prévias, 173 saídas, 360 estados, 41 referências, 52 layouts/28 telas, três rotas e nove ícones; rascunho, convite, abas, teclado, filtros, 12 percursos, mobile/web, movimento reduzido e impressão CSS. Zero erros JavaScript/rede externa. Capturas inspecionadas; revisão independente e reconferência sem achados materiais remanescentes. Scripts em wireframes/tools. Tipos/build/suíte funcional não repetidos: app, banco e manifestos preservados.

**Situação Git:** HEAD b853bbaafc2b87aeca7324246f96ce391de55b24, main; correção atual ainda não commitada ou publicada. A autorização e o envio de 2026-10-03 pertencem ao marco anterior. Versão funcional continua 0.11.0; esta edição não cria versão de desenvolvimento.

**Bloqueios e próximo passo:** nenhuma pendência para o artefato corrigido. Permanecem contratos das telas planejadas e composição web dos módulos aprovados só em móvel. Continuar manutenção do atlas junto às entregas e fechar o contrato da Tela 38 — Nossa Árvore antes de implementar indicadores.

## Publicação autorizada do atlas — 2026-10-03

Usuário autorizou commit e push abrangendo o atlas, sua manutenção contínua e a reorganização dos materiais. Branch main; fetch confirmou ausência de divergência a partir de e3643b6. [Registro de publicação](registros/planejamento-2026-10-03-publicacao-wireframe-github.md).

**Validação final desta publicação:** 84/84 testes Playwright desktop/mobile, tipos e build aprovados novamente; atlas verificado com 72 prévias/saídas, 360 estados e 12 percursos sem erro JavaScript; 617 links locais de toda a documentação e README sem alvo ausente. Os 35 renomes têm conteúdo idêntico (R100); manifestos e código de aplicação preservados. Revisão independente final sem achado bloqueante no atlas ou escopo; autorrevisão e diff preparados conferidos. Objeto Git inspecionado: 60 arquivos, incluindo 35 renomes R100, atlas e registros; nenhum arquivo de credenciais ou execução temporária. A comparação de HEAD com o hash remoto será feita após o envio. Esta publicação Git não é deploy do aplicativo.

**Continuidade vigente:** fechar contrato de Nossa Árvore e atualizar a Tela 38 junto à implementação. Regra permanente do atlas vivo continua em vigor; versão funcional permanece 0.11.0.

## Planejamento atual — wireframe completo — 2026-10-03

Antes da próxima implementação, foi produzido um guia visual com Conta como Tela 01: 72 desenhos, oito áreas, 12 percursos e as 37 interfaces do catálogo cobertas. **45 telas planejadas** e **27 recortes existentes**, com limites e pendências individuais. [Abrir atlas](../wireframes/atlas/index.html), [guia de uso e decisões](../wireframes/GUIA.md), [inventário e pendências](../wireframes/COBERTURA.md), [registro de planejamento](registros/planejamento-2026-10-03-wireframe-completo.md), [decisão de manutenção contínua](registros/planejamento-2026-10-03-manutencao-wireframe-organizacao-telas.md).

**Versão funcional preservada em 0.11.0.** Usuário determinou que esta tarefa não registra versão de desenvolvimento. Nenhuma mudança nas rotas, contratos persistidos ou manifestos. A entrada Conta primeiro pertence ao planejamento; o app atual mantém / → /comecar. Na criação inicial, Git conferido em main, HEAD e3643b6, sem envio remoto. A publicação posterior está registrada acima.

**Critérios e validação:** primeira tela Conta; cobertura integral; permissões e decisões abertas sinalizadas; destinos íntegros. Playwright verificou 72 prévias, saídas, 360 estados, busca, filtros, teclado, 12 percursos, modo web, impressão CSS e ausência de transbordamento horizontal a 375 px; zero erros JavaScript. Capturas inspecionadas. Revisão independente identificou navegação principal em fluxos focados e autoria incorreta no caminho de desejos alheios; ambos corrigidos e reconferidos pelo revisor. Verificação do atlas repetida após correções. Não houve nova validação funcional do app nem exportação de PDF.

**Ferramentas desta tarefa:** Superpowers de entendimento, revisão e verificação; Playwright local. Context7 disponível, sem consulta necessária para desenho offline em tecnologias nativas. Octocode MCP não exposto; sem pesquisa avançada de dependências nesta tarefa, buscas locais delimitadas suficientes. Nenhuma instalação ou dependência nova.

**Próximo passo executável:** wireframe aprovado como referência viva; incorporar ajustes futuros junto às entregas e fechar fontes/contrato da Tela 38 — Nossa Árvore, conforme documento de continuidade já existente, antes de implementar. Bloqueio de implementação: indicadores de crescimento ainda sem contrato; não bloqueia o material de planejamento.

## Regra permanente — wireframe vivo — decisão de 2026-10-03

O usuário determinou que o wireframe será mantido continuamente para refletir **todo o desenvolvimento atual e futuro**. Ele passa a ser a referência visual viva do produto; a criação inicial não encerra sua manutenção. Esta decisão amplia o uso anterior como planejamento das próximas telas, sem criar uma nova versão de desenvolvimento nesta atualização documental.

- Ao planejar ou alterar telas, rotas, navegação, regras, permissões, dados ou estados de interface, consultar o atlas e atualizar os desenhos e fichas afetados no mesmo conjunto lógico da entrega.
- Ao concluir cada recorte, confrontar o wireframe com o comportamento real: atualizar situação, ações, destinos, contratos, permissões, limitações e pendências. Elementos futuros continuam identificados como planejados; não marcar uma tela inteira como concluída quando só um recorte existe.
- Manter coerentes [atlas e fichas](../wireframes/atlas/index.html), [guia](../wireframes/GUIA.md), [cobertura e pendências](../wireframes/COBERTURA.md) e o registro da entrega. Atualizar a referência funcional do atlas quando a versão real do aplicativo mudar; isso não significa incrementar a versão apenas para editar o wireframe.
- Preservar os IDs existentes sempre que possível; acrescentar telas e registrar substituições ou consolidações sem perder a referência às interfaces antigas. Conferir destinos, links, estados e apresentação das partes alteradas; ampliar a verificação se a mudança afetar renderização ou navegação compartilhada.
- Em retomadas, conferir as fichas relevantes contra o código e as evidências atuais. Diferenças devem ser corrigidas ou sinalizadas explicitamente antes de considerar a entrega concluída.

**Protótipo e materiais de origem:** pasta movida pelo usuário para [Documentacao_Projeto_Nos/Telas](../Telas/Nos_App.dc.html). HTML, PDF, imagens e extrações permanecem como fontes históricas; o atlas vivo acompanha a evolução. Não recriar a pasta antiga na raiz.

## Última entrega funcional — Confirmação do Hábito após teste

A v0.11.0 conclui o ciclo de teste e confirmação. Novas propostas de Hábito exigem duração inteira de 7 a 30 dias, informada antes do aceite; o último aceite unânime inicia o teste no banco. Após o prazo, o Sim que alcança floor(N/2)+1 até 150 participantes, ou ceil(N/3) acima de 150, ativa o Hábito em transação. N é o conjunto fixo dos participantes originais da proposta, fotografado no ciclo. Ausências não contam como votos; membros posteriores consultam sem entrar na votação. Saída de participante original bloqueia a operação sem reduzir N.

Hábitos legados precisam de duração explicitamente aprovada por todos, sem retroatividade. Revisão pendente bloqueia confirmação. Ajuste ou encerramento continuam exigindo unanimidade, sete dias de reflexão e aplicação explícita. Ajustar testing ou active inicia novo teste com a mesma duração e votos novos; momentos, ciclos e respostas anteriores permanecem no histórico. O hub distingue Ativos; registro e revisão funcionam também em active. As orientações estão visíveis na proposta, no detalhe, na confirmação e antes do ajuste.

**Validação:** 84/84 testes Playwright desktop/mobile; tipos e build aprovados. Cinco arquivos de banco passaram, incluindo fixtures reais de 150/151 participantes (76/51 votos). Jornada local com cinco contas verificou criação pela interface, prazo, maioria 3/4, simultaneidade, isolamento, entrada posterior, legado, active, ajuste e layout móvel; dados temporários removidos e servidor de teste encerrado. Migração 20261003120000 aplicada localmente e no nos-dev em transação com histórico; 13 assinaturas/corpos normalizados conferidos sem divergência, duas políticas de leitura e helper sem execução direta por authenticated. CLI remota parou na inicialização do papel; editor SQL foi a alternativa. Interface autenticada validada localmente, sem repetição remota. Autorrevisão e revisão independente corrigiram orientação sobre novo teste, âncora documental e limpeza do script.

**Objetivo/critério atendido:** prazo persistido, confirmação explícita proporcional, orientações visíveis, privacidade e histórico preservados. **Bloqueios:** nenhum para este recorte. Publicação pública, progresso, reflexões e Essência continuam fora dele.

**Próximo passo executável:** definir o contrato de dados reais da Tela 07 — Nossa Árvore, confrontando catálogo v2.1 com impacto v1.4 e marcos v1.6. Escolher o recorte sustentado pelos dados existentes antes de implementar níveis, experiência ou indicadores; não usar os números de exemplo do protótipo como integração. A conferência autenticada no nos-dev permanece uma validação complementar da interface. [Registro v0.11.0](registros/registro-v0.11.0-2026-10-03-imp-confirmacao-habito-fun-teste-votacao-proporcional.md); [contrato](funcionalidades/confirmacao-habito.md); [plano executado](planos/confirmacao-habito.md).

## Marco anterior — Revisar Hábito

A v0.10.0 implementa revisão de Hábito em teste: ajuste do combinado ou encerramento consensual. Solicitações não alteram o combinado até unanimidade dos envolvidos originais, sete dias completos desde a criação e aplicação explícita por participante. Recusa preserva o combinado; encerramento conserva momentos e impede novas gravações. Apenas uma revisão pendente por Hábito. A interface consulta prontidão agregada sem revelar votos individuais.

**Validação:** 80/80 testes Playwright desktop/mobile, tipos e build aprovados; três arquivos de teste de banco passaram. Script local com três contas verificou ajuste, prazo, falta de consenso após prazo, recusa, isolamento, histórico, encerramento, concorrência e layout móvel. Dados temporários removidos. Migração 20261002230000 aplicada localmente e no nos-dev; corpos normalizados das quatro funções coincidem. CLI remota parou na inicialização do papel de conexão; aplicação e histórico realizados em transação pelo editor SQL. Interface autenticada testada localmente, sem repetição remota. Revisão independente encontrou ação prematura de aplicação, corrigida com RPC agregada e teste; segunda revisão sem novos achados.

**Próximo passo daquele marco, concluído na v0.11.0:** especificar confirmação do Hábito após teste, com duração de 7 a 30 dias conforme v1.2/v2.4. Definir início/duração, tratamento dos Hábitos existentes sem prazo, consentimento e compatibilidade de acordo ativo. Os sete dias de reflexão da revisão são independentes. [Continuidade detalhada](funcionalidades/confirmacao-habito.md). Essência, progresso e conversa de cuidado continuam dependências próprias. [Registro v0.10.0](registros/registro-v0.10.0-2026-10-02-imp-revisao-habito-fun-consentimento-reflexao.md).

## Marco anterior — registro de momento do Hábito

A v0.9.0 implementa **Registrar momento** com humor, nota opcional, autoria e histórico real no detalhe. A migração cria leitura protegida por RLS e uma função autenticada que exige vínculo, aceite individual e Hábito em teste. Naquele marco, Revisar permanecia sem ação ativa; o recorte foi entregue na v0.10.0. [Registro v0.9.0](registros/registro-v0.9.0-2026-09-29-imp-registro-momento-habito-fun-historico-real.md).

**Situação:** migração `20260929220000` aplicada no Supabase local e no `nos-dev`, com quatro versões alinhadas. `supabase test db` passou; três contas locais verificaram gravação, leitura, isolamento e interface em desktop/celular. A navegação do histórico foi testada com inserção entre páginas. A revisão independente encontrou e permitiu corrigir cursor instável e parâmetro repetido; a conferência final não encontrou achados materiais. Após a instalação dos navegadores, a verificação final aprovou 78/78 testes Playwright, além do sucesso de tipos e build na v0.9.0. **Continuidade desse marco:** recorte de Revisar aprovado em 2026-10-02 e entregue na v0.10.0; a v0.9.0 consta no commit `381a308`.

## Marco anterior — Tela 05 Detalhe do Hábito na v0.8.0

O recorte inicial da Tela 05 foi concluído na v0.8.0: a rota `/nucleos/[id]/acordos/[agreementId]` lê apenas propostas de Hábito em `testing` pertencentes ao Núcleo autenticado. O hub liga esses itens ao detalhe, que apresenta descrição, momento, frequência, data UTC e resposta própria. Naquele marco, histórico e reflexões, calendário de prática, progresso, revisão, impacto, linguagem de cuidado e evento associado não tinham dados reais. O histórico de momentos chegou na v0.9.0. [Registro v0.8.0](registros/registro-v0.8.0-2026-09-29-imp-detalhe-habito-fun-consulta-proposta-teste.md).

**Validação:** teste da rota sem sessão passou em desktop e móvel após falhar antes da implementação; 78 testes Playwright, tipos e build passaram na conferência de 2026-10-01. Revisão independente apontou indicação do fuso, corrigida. Supabase local e três contas temporárias verificaram acesso autorizado, link do hub, isolamento entre Núcleos, categoria/estado e leitura apenas da resposta própria. Dados temporários removidos. A nova tela não foi testada no `nos-dev`.

**Continuidade daquele marco:** a ação de registro e o histórico foram entregues na v0.9.0. Revisar Hábito em teste foi entregue na v0.10.0 com consenso e reflexão; acordo ativo ainda exige confirmação após teste. Conferir permissões da matriz v2.5, regras dos fluxos v2.2 e contratos v2.4 antes de expor ação ativa. Progresso, árvore e evento associado dependem de contratos próprios. A publicação pública permanece fora de escopo.

## Entrega concluída — Tela 04 Acordos

O hub privado em `/nucleos/[id]/acordos` está concluído na v0.7.0. O recorte inclui propostas de Hábitos e Experiências com descrição, momento e frequência, respostas individuais, aceite unânime para entrada em teste, recusa explícita, filtros e estado vazio de Essência. Nenhum progresso ou acordo exemplar é simulado. Há link na Home. A migração `supabase/migrations/20260928120000_create_nucleus_agreements.sql` foi aplicada e conferida no `nos-dev`.

**Critérios de conclusão:** revisar o SQL/RLS e o diff, aprovar testes/tipos/build, aplicar a migração em ambiente de desenvolvimento identificado, verificar o fluxo com duas contas e isolamento entre Núcleos, atualizar a versão e os registros após essas evidências.

**Arquivos principais:** `src/app/nucleos/[id]/acordos/`, `src/features/agreements/`, migração acima, `supabase/tests/nucleus_agreements.sql` e `tests/agreement-input.spec.ts`. [Registro da entrega](registros/registro-v0.7.0-2026-09-28-imp-hub-acordos-fun-propostas-consentimento.md).

**Validações recentes:** 78 testes Playwright desktop/mobile, `npm.cmd run typecheck` e `npm.cmd run build` passaram na v0.9.0 em 2026-10-01.

**Continuidade:** a Tela 05 foi entregue inicialmente na v0.8.0 e recebeu histórico na v0.9.0; a ação Revisar da Tela 06 foi integrada na v0.10.0. Publicação pública continua fora de escopo.

## Entrega concluída — agenda interna

Agenda por Núcleo concluída na **v0.6.0**: eventos pontuais com título, intenção opcional, início/fim e fuso; convite aos integrantes atuais; resposta individual; edição/remoção pelo autor ou criador; leitura isolada por RLS. A tela fica em `/nucleos/[id]/agenda`, ligada à Home. O recorte exclui sincronização externa, recorrência e vínculo com outros módulos.

**Arquivos da entrega:** `src/app/nucleos/[id]/agenda/`, `src/features/calendar/`, `supabase/migrations/20260927221149_create_nucleus_calendar.sql`, `tests/calendar-event.spec.ts`, `tests/nucleus-calendar.spec.ts` e [registro da agenda](registros/registro-v0.6.0-2026-09-27-01-imp-agenda-interna-fun-eventos-nucleo.md).

**Decisão:** eventos e respostas são visíveis apenas aos integrantes; operações de escrita passam por RPCs que conferem `auth.uid()` e associação no banco. O calendário interno é a fonte oficial. Integrantes que entrarem depois da criação poderão ler o evento, mas não recebem convite retroativo nesta fatia.

**Validação da entrega v0.6.0:** migração SQL aplicada ao `nos-dev` e confirmada no painel como `20260927221149_create_nucleus_calendar`. Em sessão real, a conta criadora criou, respondeu, editou e removeu um evento; a participante viu o convite sem controles de edição, respondeu e recebeu confirmação. Um segundo Núcleo temporário sem convite foi criado; a participante abriu a agenda original e recebeu 404 na agenda temporária. O segundo Núcleo foi excluído por identificador e nome; o banco retornou exatamente um registro removido e voltou a contar um Núcleo. Revisão independente encontrou dois casos de borda, corrigidos com fallback de fuso e paginação. Na conferência de entrega, a primeira execução paralela teve nove timeouts ao encerrar contextos mobile em disco lento; `npm.cmd test -- --workers=1` aprovou os 64 testes desktop/mobile. `npm.cmd run typecheck` e build de produção passaram. Sem sessão, a rota redireciona para `/conta`.

**Continuidade após a agenda:** a Tela 04 — Acordos foi concluída na v0.7.0; evidência e limites constam em [Entrega concluída — Tela 04 Acordos](#entrega-concluída--tela-04-acordos). A credencial de acesso permanece fora do repositório. Publicação pública exige revisão própria de privacidade e operação.

**Unidades pendentes de commit neste marco histórico:** nenhuma para a correção visual e orientação de prioridade alta; inclusão no commit confirmada por inspeção do objeto e comparação da árvore. Mensagem: `docs(wireframe): alinhar atlas ao app e consolidar prioridade visual`.

**Contador de interações:** 86, incluindo a entrega de recuperação e sua publicação autorizada, a partir da última contagem persistida 84; eventuais interações sem registro não foram inventadas. Começou em 2026-09-25 sem histórico anterior verificável. Último marco de over-engineering: nenhum (0); próxima auditoria: 100.

## Objetivo e situação histórica — v0.11.0

O onboarding web contempla **Escolher caminho** (`/comecar`), **Tipo** (`/comecar/tipo`), **Propósito** (`/comecar/proposito`), **Conta** (`/conta`), **Convite inicial** (`/comecar/convite-inicial/[id]`) e **Entrada por convite** (`/comecar/convite`). A área protegida inclui Home (`/nucleos/[id]`), agenda (`/nucleos/[id]/agenda`), Acordos (`/nucleos/[id]/acordos`), Detalhe do Hábito (`/nucleos/[id]/acordos/[agreementId]`) , Registrar momento (`/nucleos/[id]/acordos/[agreementId]/registrar`) Revisar (`/nucleos/[id]/acordos/[agreementId]/revisar`) e Confirmar (`/nucleos/[id]/acordos/[agreementId]/confirmar`). A migração atual chegou ao `nos-dev`; a interface desta rota foi validada com Supabase local. O app ainda não foi publicado.

**Critérios de aceite da entrega v0.5.0:** exibir nome, tipo, propósito e vínculo reais para participante autorizado; oferecer convite apenas ao criador; manter autenticação e RLS; distinguir ausência de acesso de falha de consulta; informar carregamento, erro e alcance inicial sem simular árvore, agenda ou gratidão. Os fluxos de conta e associação foram testados com contas distintas na v0.4.0.

**Arquivos principais:** `src/app/nucleos/[id]/`, `src/features/nuclei/nucleus-access.ts`, `src/features/nuclei/nucleus-home-details.ts`, `tests/nucleus-home.spec.ts`; base de conta e dados em `src/lib/supabase/`, `src/proxy.ts` e `supabase/migrations/`.

## Decisões vigentes

- TypeScript, React, Next.js e Tailwind para a web; Supabase para autenticação e banco. Capacitor será avaliado depois da web, Android antes de iOS.
- Todos os tipos de Núcleo usam o catálogo existente. Só o identificador validado do tipo viaja na URL; nome e propósito não são colocados na URL nem persistidos antes da criação explícita.
- O servidor valida a sessão com `auth.getUser()`. Funções SQL usam `auth.uid()`, associam o criador na mesma transação e limitam leitura por RLS. O convite exige código completo, expira em sete dias e só entra em vigor com aceite explícito. A interface oculta uma prévia quando o código digitado deixa de corresponder ao código conferido.
- O primeiro convite real teve código exposto em captura/chat e foi revogado no painel. O substituto foi gerado e usado sem reproduzir seu código em documentação ou respostas. Não registrar e-mails, senhas, tokens, códigos ou conteúdo afetivo nos documentos de andamento.
- A v0.4.0 é MINOR pelas novas rotas e integração. A v0.3.0 de Propósito e as versões anteriores permanecem registradas historicamente. A edição v2.8 da especificação de segurança é versão documental, independente da versão do aplicativo.
- A v0.5.0 é MINOR pela primeira Home do Núcleo. A página consulta apenas o vínculo próprio e o Núcleo sob RLS; tipo, nome e propósito vêm do banco. A ação de convite deriva do papel `creator`.
- A v0.6.0 é MINOR pela agenda interna. Eventos e respostas pertencem ao Núcleo; leitura exige vínculo sob RLS e alterações passam por RPCs autenticadas. Árvore e gratidão ainda exigem contratos e permissões próprios.
- A v0.7.0 é MINOR pela Tela 04 Acordos. Propostas pertencem ao Núcleo, respostas são individuais e a unanimidade é necessária para iniciar teste; uma proposta não equivale a acordo ativo. Essência e progresso não são simulados.
- A v0.8.0 é MINOR pelo recorte inicial da Tela 05 e sua nova rota. O detalhe lê exclusivamente Hábito em teste e a resposta própria; dados de acompanhamento ainda indisponíveis são explicados sem simulação.
- A v0.9.0 é MINOR pela ação real de Registrar momento, nova rota, histórico e contrato persistido. Notas são visíveis ao Núcleo; somente participante que aceitou pode gravar. Revisão foi integrada na v0.10.0; este é o limite histórico da v0.9.0.
- Cada mudança tem registro datado em `registros/`, com versão, Imp. e Fun. no título e arquivo. O monitoramento automático continua cancelado.

## Evidências e limites

- Supabase `nos-dev`: migração remota `20260927173656_create_nuclei_and_invitations`, três tabelas, quatro funções e RLS verificados no painel. O SQL local tem o mesmo número de versão.
- Fluxo real: uma conta confirmada criou Núcleo e vínculo `creator`; outro convite ativo substituiu o revogado; conta diferente conferiu e aceitou. Consulta agregada no banco confirmou **um `creator` e um `member`**. Antes do aceite efetivo, o navegador convidado recebeu página não encontrada após F5; depois, ambos os navegadores mantiveram o resumo visível após F5. Isso valida o acesso positivo e a negativa anterior para a conta ainda não associada.
- Houve uma primeira tentativa que redirecionou para o resumo sem criar `member`; a recarga da conta convidada mostrou página não encontrada. A segunda tentativa, com sessão convidada confirmada, criou o vínculo. A causa exata da primeira tentativa não foi reproduzida; a função de aceite já tratava de forma idempotente quem pertencia ao Núcleo. O registro conserva a investigação sem atribuir causa não demonstrada.
- Verificações locais após os ajustes finais: `npm.cmd run typecheck`, 46 testes Playwright desktop/mobile, `npm.cmd run build` e `git diff --check` passaram. Foram conferidos 71 links locais sem alvo ausente; `package.json` e lockfile coincidem na v0.4.0.
- A revisão independente estática apontou uma prévia que permanecia visível após editar o código e documentação defasada. A prévia foi vinculada ao código exibido, os registros foram atualizados e a revisão de confirmação não encontrou achados remanescentes. A autorrevisão do diff não encontrou outro problema no escopo.
- Na v0.5.0, 52 testes Playwright desktop/mobile, `npm.cmd run typecheck` e `npm.cmd run build` passaram. Os testes novos cobrem tipo, papel, convite e distinção entre sessão ausente/expirada e falha do Auth; a suíte confirma que a rota continua exigindo conta. O novo layout não foi revalidado com sessão real do Supabase nesta interação. A revisão independente apontou a classificação de erro do Auth, corrigida com teste de regressão. Revisão do diff e `git diff --check` constam no [registro](registros/registro-v0.5.0-2026-09-27-imp-home-nucleo-fun-resumo-protegido.md).
- Na entrega v0.4.0, a CLI falhou no transporte à Management API e a migração foi aplicada pela API autenticada; naquela etapa, Docker inativo impediu teste local do SQL. Esses impedimentos de ambiente foram resolvidos para a v0.7.0. Expiração real de sete dias, limites de envio de e-mail, SMTP próprio, rate limiting operacional, recuperação de senha, Home completa e empacotamento nativo permanecem fora das entregas atuais. Não tratar o app como pronto para publicação pública.

## Continuidade e commit

- A Home v0.5.0, a agenda v0.6.0, Acordos v0.7.0, a Tela 05 v0.8.0 e o registro de momento v0.9.0 estão registrados no Git. O ambiente local foi validado com contas no Supabase local e migração aplicada ao `nos-dev`. Publicação pública segue condicionada a SMTP, limites operacionais e privacidade.

## Estado das ferramentas

Superpowers disponível e aplicado. Context7 ativo, consultado nesta entrega para Next.js/Supabase; a versão instalada Next.js 16.3.6 foi conferida nos guias locais. No marco v0.9.0, Octocode MCP não estava exposto; a CLI 19.1.0 em cache foi conferida, mas a consulta de grafo naquela sessão falhou ao interpretar JSON no PowerShell; buscas locais precisas complementaram a investigação. Playwright disponível. Docker 29.8.1 funcional; Supabase local iniciado nesta entrega. CLI Supabase 2.118.0 autenticada e vinculada ao `nos-dev`; a exceção específica para `api.supabase.com` no Avast eliminou a interceptação HTTPS. Não guardar token no repositório.

Pesquisa externa de ferramentas em 2026-09-29 consultou projetos e documentação oficiais. Candidatos priorizados: Supabase CLI + pgTAP para contratos/RLS; Renovate ou Dependabot para atualizações controladas; Sentry para observabilidade após lançamento; axe-core integrado ao Playwright para acessibilidade. Lighthouse CI, Gitleaks e CodeQL são opções condicionais de CI/segurança; nenhum foi instalado ou configurado. Não adicionar essas ferramentas até a etapa funcional apropriada.

## Índice

- [v0.13.0 — Publicação da navegação](registros/registro-v0.13.0-2026-10-07-06-imp-publicacao-git-fun-rastreabilidade-navegacao.md).
- [v0.13.0 — Navegação e sessão](registros/registro-v0.13.0-2026-10-07-05-imp-navegacao-protegida-fun-sessao-seus-nucleos.md).
- [Contrato de navegação e sessão](funcionalidades/navegacao-sessao.md).
- [v0.12.0 — Publicação de Visão global e procedimentos](registros/registro-v0.12.0-2026-10-07-04-imp-publicacao-atlas-fun-visao-global-procedimentos.md).
- [v0.12.0 — Visão global, sincronização e comparações](registros/registro-v0.12.0-2026-10-07-03-imp-visao-global-atlas-fun-sequencia-sincronizacao-comparacoes.md).
- [Procedimento permanente de comparações](../wireframes/comparacoes/README.md).
- [v0.11.0 — Fidelidade visual do atlas](registros/registro-v0.11.0-2026-10-04-imp-fidelidade-visual-atlas-fun-referencia-ux-aprovada.md).
- [v0.11.0 — Prioridade alta do Atlas vivo](registros/registro-v0.11.0-2026-10-05-imp-prioridade-atlas-vivo-fun-orientacao-visual-implementacao.md).
- [v0.11.0 — Publicação de fidelidade e prioridade visual](registros/registro-v0.11.0-2026-10-05-02-imp-publicacao-atlas-fun-fidelidade-prioridade-visual.md).

- [Histórico](historico.md): eventos relevantes em ordem cronológica.
- [Brag document](../brag/BRAG.md): contribuições verificáveis.
- [Primeira tela](funcionalidades/escolher-caminho.md): escopo e continuidade.
- [v0.1.0 — Escolher caminho](registros/registro-v0.1.0-2026-09-24-imp-tela-escolher-caminho-fun-entrada-nucleo.md).
- [v0.2.0 — Tipo de Núcleo](registros/registro-v0.2.0-2026-09-25-01-imp-tela-tipo-nucleo-fun-selecao-vinculo.md).
- [v0.2.0 — Versionamento e rastreabilidade](registros/registro-v0.2.0-2026-09-25-02-imp-documentacao-versionada-fun-rastreabilidade.md).
- [v0.2.0 — Registro histórico](registros/registro-v0.2.0-2026-09-25-03-imp-padronizacao-registro-historico-fun-rastreabilidade.md).
- [v0.3.0 — Propósito do Núcleo](registros/registro-v0.3.0-2026-09-27-imp-tela-proposito-nucleo-fun-rascunho-local.md).
- [v0.4.0 — Autenticação, criação e convite](registros/registro-v0.4.0-2026-09-27-imp-integracao-supabase-fun-criacao-convite.md).
- [v0.5.0 — Home do Núcleo](registros/registro-v0.5.0-2026-09-27-imp-home-nucleo-fun-resumo-protegido.md).
- [v0.6.0 — Agenda interna do Núcleo](registros/registro-v0.6.0-2026-09-27-01-imp-agenda-interna-fun-eventos-nucleo.md).
- [v0.7.0 — Tela 04 Acordos](registros/registro-v0.7.0-2026-09-28-imp-hub-acordos-fun-propostas-consentimento.md).
- [v0.8.0 — Tela 05 Detalhe do Hábito](registros/registro-v0.8.0-2026-09-29-imp-detalhe-habito-fun-consulta-proposta-teste.md).
- [v0.9.0 — Registro de momento](registros/registro-v0.9.0-2026-09-29-imp-registro-momento-habito-fun-historico-real.md).
- [v0.6.0 — Análise de Genkit, AI SDK e Mastra](registros/registro-v0.6.0-2026-09-29-imp-analise-frameworks-ia-fun-apoio-conversas.md).
- [v0.6.0 — Pesquisa de ferramentas para a stack](registros/registro-v0.6.0-2026-09-29-imp-pesquisa-ferramentas-stack-fun-qualidade-operacao.md).
- [Frontend web](tecnologias/frontend.md): stack, segurança e próximos passos.
- [Estado anterior](estado-atual.md): referência histórica.
- `README.md`: protocolo do andamento.

## Retomada — 2026-10-02

Código, documentação e Git conferidos: HEAD e referência local origin/main coincidem em 381a308; não houve fetch. Alteração preexistente deste documento preservada. Próxima entrega proposta: revisão do Hábito em teste com ajustes ou encerramento consensual, histórico preservado e reflexão de sete dias. Recorte aprovado na interação seguinte e implementado na v0.10.0; consulte a entrega atual.

- [Registro de retomada](registros/registro-v0.9.0-2026-10-02-imp-retomada-projeto-fun-escopo-revisao.md).

## Ferramentas e execução — v0.10.0

Superpowers: planejamento, TDD, depuração, revisão e verificação aplicados. Context7 consultado para Next.js/Supabase; guias locais do Next.js 16.3.6 complementaram a consulta, pois essa versão não apareceu no catálogo versionado. Octocode CLI 19.1.0 disponível e usado para dependentes de habit-access.ts; ALLOWED_PATHS foi definido somente no processo de consulta. Grafo sintático parcial por imports não resolvidos, complementado com leitura local. Docker reiniciado e Supabase local disponível. CLI Supabase em cache foi usada diretamente; invocação npx não retornou prontamente. Aplicação remota concluída via painel autenticado, sem alteração de credenciais.

- [Plano executado da revisão](planos/revisao-habito.md).

**Conferência final v0.10.0:** tipos e build repetidos após versionamento, manifestos alinhados, 90 links locais sem alvo ausente e diff sem erros de formatação. Consulta local confirmou zero Núcleos temporários do verificador. Este era o estado anterior à autorização Git de 2026-10-03; não houve deploy.

## Publicação Git — 2026-10-03 — v0.10.0

Usuário autorizou commit e push com descrição abrangente. [Registro desta preparação](registros/registro-v0.10.0-2026-10-03-imp-publicacao-git-fun-continuidade-confirmacao.md). Próximo passo documentado com fontes, decisões pendentes e critérios observáveis; sem nova funcionalidade iniciada.

**Validação para publicação em 2026-10-03:** 80/80 testes Playwright, três arquivos de teste do banco, checagem de tipos e build aprovados novamente; 121 links locais sem alvo ausente e diff sem erro de formatação. Revisão independente final sem novos achados de implementação.

## Retomada da confirmação — 2026-10-03

Objetivo ativo: definir o contrato da confirmação do Hábito após teste, próximo passo da v0.10.0. HEAD e main remoto conferidos diretamente em e315b12f37b6c94718c1d56d4b73c7d4b722b14a; diretório inicialmente limpo. Instruções AGENTS.md fornecidas na conversa aplicadas; o arquivo permanece removido pelo commit remoto anterior.

Proposta concreta em [confirmação do Hábito](funcionalidades/confirmacao-habito.md#proposta-de-recorte--retomada-em-2026-10-03): duração escolhida de 7 a 30 dias, início no último aceite, novo ciclo consensual para legado sem datas, confirmação unânime após prazo, reutilização da revisão e compatibilidade de active. **Aguarda aprovação; escolhas ainda não são decisões vigentes.** Próximo passo executável: confirmar o recorte, planejar esquema/migração e implementar com testes dos contratos. Sem código, migração ou mudança de versão nesta retomada.

Superpowers using-superpowers, brainstorming e verification-before-completion lidos. Octocode CLI 19.1.0 operacional para consulta local, grafo parcial complementado por leitura precisa. Context7 exposto, sem consulta nesta etapa de regras de negócio. Validação documental e autorrevisão do diff; resultados funcionais acima pertencem à entrega anterior.

- [Registro desta retomada](registros/registro-v0.10.0-2026-10-03-imp-retomada-confirmacao-fun-proposta-contrato.md).

- [v0.11.0 — Confirmação com votação proporcional](registros/registro-v0.11.0-2026-10-03-imp-confirmacao-habito-fun-teste-votacao-proporcional.md).
- [Plano de confirmação executado](planos/confirmacao-habito.md).

**Conferência final da v0.11.0:** tipos e build repetidos após manifestos; git diff --check aprovado na configuração real do repositório; 491 links locais e suas âncoras sem alvo ausente. Revisão independente de confirmação aprovou as correções e indicou cabeçalho documental P3, corrigido e conferido. Sem achados materiais remanescentes.

- [Próximo recorte — Nossa Árvore](funcionalidades/nossa-arvore.md): fontes, base real, lacunas e critérios de aceite.

- [Publicação Git e continuidade da v0.11.0](registros/registro-v0.11.0-2026-10-03-02-imp-publicacao-git-fun-continuidade-arvore.md).


**Conferência final da v0.12.0 — 2026-10-07:** tipos e build aprovados após proteção dos logs de callbacks; revisão independente desse ajuste sem achados. Seis telas em duas larguras reconferidas sem diferenças de rótulos/títulos/subtítulos/cor/fonte e sem transbordamento. 428 links nos 46 documentos locais modificados/novos e 171 links do atlas sem destino ausente; `git diff --check` aprovado. Aplicativo compilado disponível em http://127.0.0.1:3000; galeria/atlas em http://127.0.0.1:3400, processos locais desta sessão, sem publicação.


## Publicação autorizada — v0.12.0 — 2026-10-07

Usuário autorizou commit/push abrangentes para main, incluindo a revisão documental de segurança anteriormente pendente. Base e origin/main iguais após fetch; segredo e artefatos ignorados. [Registro de publicação](registros/registro-v0.12.0-2026-10-07-02-imp-publicacao-git-fun-rastreabilidade-conta-entrada.md). Conferir objeto do commit e hash remoto antes de concluir. Sem deploy incluído na autorização.


**Controle da publicação:** suíte repetida com 108/108 aprovados. Objeto inicial e árvore preparada conferidos; captura histórica da tela 72 corrigida após inspeção visual e incorporada ao mesmo commit. Conjunto final: 74 arquivos. Push normal autorizado para origin/main; comparar hash remoto ao HEAD no encerramento e reportar resultado. Removida pendência de commit após comprovar inclusão dos arquivos, sem novo desenvolvimento ou deploy.
