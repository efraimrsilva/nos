# Projeto Nós

**Regra permanente:** versionar cada entrega do sistema e manter o Atlas vivo como espelho da implementação atual, com a mesma versão. Critérios e arquivos a sincronizar em AGENTS.md.

**Consolidação v3.3.0 — 28/10/2026:** temas, totais pessoais, correções locais de acesso/rede, Supabase local e documentação reunidos. Banco remoto/local sincronizados com13 migrações; correção de bloqueios da agenda reproduzível em Windows. [Descrição integral e validações](Documentacao_Projeto_Nos/_andamento/registros/registro-v3.3.0-2026-10-28-publicacao-integral-github-supabase.md).

**Integração local — v3.3.0 — 28/10/2026:**

Integração local da branch `origin/codex/temas-conta` à base atual de `main`, preservando mudanças locais de acesso, árvore/reflexões, rodapé e transporte com proxy. Nove temas, preferência por conta, navegação e totais pessoais restaurados. Sem commit, push, deploy ou operação no banco remoto nesta rodada.

**E-mails aplicados — v3.1.3 — 27/10/2026:** 13 e-mails personalizados, com identidade do Nós e textos por situação.26 prévias desktop/celular verificadas; links e configuração de ativação preservados. 13 assuntos e13 HTMLs aplicados e conferidos no Supabase; sete avisos continuam desativados. Recebimento externo ainda exige teste manual.17 novos casos manuais M01-081–097 agrupados no MVP01, total97, ainda Não executados. [Prévias](Documentacao_Projeto_Nos/wireframes/comparacoes/2026-10-27-emails-personalizados/index.html) · [registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v3.1.3-2026-10-27-imp-emails-fun-modelos-personalizados.md).

**Publicado — v3.1.2 — 27/10/2026:** confirmação de e-mail informa o estado no próprio modal, com ou sem sessão; só anuncia envio para pendência após sucesso. Playwright/Chromium instalado. Tipos, build, 64 testes focados e 18 cenários visuais aprovados; consulta SQL validada em PostgreSQL isolado. Migração aplicada no Supabase e código4ba6b46 publicado no GitHub; fluxo público conferido no site real em desktop/celular. Roteiro manual MVP01 ampliado para80 casos, incluindo18 novos de confirmação, ainda Não executados. [Registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v3.1.2-2026-10-27-imp-confirmacao-fun-estado-email.md) · [galeria](Documentacao_Projeto_Nos/wireframes/comparacoes/2026-10-27-confirmacao-email/index.html).

**Entrega local — v3.2.1 —23/10/2026:** nove temas, com Solar/Âmbar e Noturno/Neon; Aparência no padrão da navegação desktop/mobile e cores dos ícones preservadas. Sem publicação. [Contrato](Documentacao_Projeto_Nos/_andamento/funcionalidades/aparencia-conta.md) · [Galeria](Documentacao_Projeto_Nos/wireframes/comparacoes/v3.2.1-2026-10-23-temas-solar-neon/index.html).

**Entrega local — v3.2.0 —23/10/2026:** sete temas da conta em Mais → Aparência, com aplicação imediata e salvamento automático. A área atual recebe cor própria e marcador desktop/mobile; telas públicas permanecem claras. Sem deploy desta entrega. [Contrato](Documentacao_Projeto_Nos/_andamento/funcionalidades/aparencia-conta.md) · [galeria](Documentacao_Projeto_Nos/wireframes/comparacoes/v3.2.0-2026-10-23-temas-conta/index.html).

**Entrega local — v3.1.1 — 23/10/2026:** cadastro com e-mail existente permanece no formulário e orienta entrar ou recuperar senha, sem prometer confirmação. Cadastro válido e retorno interno preservados; 142 testes gerais, tipos, build e Atlas aprovados. Commit e push desta correção autorizados em 23/10/2026; deploy correspondente ainda não certificado. [Registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v3.1.1-2026-10-23-imp-cadastro-fun-email-existente.md).

**Entrega vigente — v3.1.0 — 23/10/2026:** exclusão da própria conta em Conta e segurança, opção vermelha e frase APAGAR CONTA. Identificação/acesso removidos, histórico compartilhado preservado como Conta excluída e sucessão/encerramento reutilizados. 130 testes gerais, 12 autenticados relacionados, 143 verificações SQL, tipos e build padrão aprovados. Publicado em https://noslife.netlify.app no deploy6adae350fa2928885a0de2c8, commit8afecb2; migração remota aplicada (dez migrações). Prova online desktop/mobile aprovada com quatro contas descartáveis removidas e dados anteriores preservados. [Contrato](Documentacao_Projeto_Nos/_andamento/funcionalidades/exclusao-conta.md) · [registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v3.1.0-2026-10-23-imp-conta-fun-exclusao-propria.md) · [galeria](Documentacao_Projeto_Nos/wireframes/comparacoes/v3.1.0-2026-10-23-exclusao-conta/index.html). Os marcos abaixo são históricos.

**Envio Brevo ativo — v3.0.3 — 20/10/2026:** SMTP personalizado configurado no Supabase com remetente Gmail verificado; confirmação recebida na caixa de entrada pelo responsável. Segredo de recuperação criado no Netlify e aplicado no deploy `6ad820c79cbacbaabe97e70f`; pedido de recuperação aceito pela tela publicada, envio registrado e recebimento também confirmado na caixa de entrada pelo responsável. Troca efetiva de senha pelo link ainda não certificada. Preparação Gmail anterior substituída; sem alteração de fontes ou migração. [Registro operacional](Documentacao_Projeto_Nos/_andamento/registros/registro-v3.0.3-2026-10-20-03-imp-envio-brevo-fun-autenticacao-email.md).

**Produção vigente — v3.0.3 — 20/10/2026:** [abrir o Nós](https://noslife.netlify.app/conta). Layout completo publicado no deploy6ad7eeb747e9c9a82835d3b5/main@8b529e8; build real Netlify aprovado. Nova prova online:27 rotas autenticadas, nove grupos, duas contas temporárias removidas e dados anteriores preservados. [Registro de publicação](Documentacao_Projeto_Nos/_andamento/registros/registro-v3.0.3-2026-10-20-02-imp-deploy-netlify-fun-publicacao-producao.md) · [prints reais](Documentacao_Projeto_Nos/wireframes/comparacoes/v3.0.3-2026-10-20-producao-netlify/index.html). Esboços continuam identificados; SMTP/recebimento externo e piloto completo não certificados. Os marcos seguintes preservam a situação anterior.

**Versão vigente — v3.0.3 — 20/10/2026:** reconstrução integral da interface e modais, Conta com árvore/frases10s, Kanban com setas em três níveis e Agenda com faixas corretas para eventos sobrepostos. Publicação Git autorizada; build webpack, 128 testes gerais, tipos e verificadores do Atlas aprovados. [Registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v3.0.3-2026-10-20-imp-publicacao-layout-fun-consolidacao-interface-e-agenda.md). Marcos abaixo são históricos.

**Ajuste vigente — v3.0.1 — 20/10/2026:** árvore original restaurada somente na Conta sem sessão, dentro do layout novo. Frases10s, funções e modais preservados. [Registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v3.0.1-2026-10-20-imp-conta-fun-restauracao-arvore.md) · [antes/depois](Documentacao_Projeto_Nos/wireframes/comparacoes/v3.0.1-2026-10-20-conta-arvore/index.html). A reconstrução3.0.0 abaixo é a base histórica desta correção.

**Reconstrução integral — v3.0.0 — 18/10/2026:** interiores, formulários e modais reconstruídos conforme [Layout novo](Documentacao_Projeto_Nos/Telas/Layout%20novo/index.html), com um único sistema visual e funções existentes preservadas. A primeira tentativa v2.0.0 foi substituída após revisão do usuário. Recursos futuros permanecem esboços explícitos. Entrega validada localmente; sem publicação remota. [Registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v3.0.0-2026-10-18-imp-reconstrucao-layout-novo-fun-interface-e-modais.md) · [galeria com 406 prints](Documentacao_Projeto_Nos/wireframes/comparacoes/v3.0.0-2026-10-18-layout-novo-integral/index.html). Os marcos abaixo são históricos.

**Regra permanente de documentação:** todo modal deve ser identificado no Atlas, na ficha da tela, no registro da entrega e na galeria, com nome, gatilho, finalidade, permissão, resultado e situação real/esboço. Links para outras rotas continuam classificados como navegação. Consulte o [contrato e inventário de modais](Documentacao_Projeto_Nos/_andamento/funcionalidades/modais-interface.md).

**Marco visual anterior — v2.0.0 — 18/10/2026:** todas as famílias de rotas migradas para [Layout atual](Documentacao_Projeto_Nos/Telas/Layout%20novo/index.html), com menus lateral/inferior, ícones coloridos, microinterações acessíveis e funcionalidades existentes preservadas. Árvore, Memórias, Conexões, Perfis, Manifesto e Cuidado têm esboços protegidos explicitamente identificados, sem persistência. A evolução individual das quatro etapas continua pendente de critérios/dados; o Kanban organiza o modelo atual. Entrega local revisada e validada; sem novo deploy ou banco remoto. [Registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v2.0.0-2026-10-18-imp-layout-atual-fun-migracao-integral.md) · [galeria com165 capturas](Documentacao_Projeto_Nos/wireframes/comparacoes/v2.0.0-2026-10-18-layout-atual-tela_01-a-tela_73/index.html). Os marcos seguintes são históricos.

**Fluxo completo aprovado — v1.1.0 — 18/10/2026:** [Proposta → Hábito → Experiência → Essência](Documentacao_Projeto_Nos/_andamento/funcionalidades/fluxo-proposta-habito-experiencia-essencia.md) é a sequência obrigatória da evolução da pessoa no Núcleo. Direção documentada; critérios de passagem, progressão individual, código e migração pendentes. As categorias diretas ainda presentes no aplicativo pertencem ao modelo anterior.

**Encerramento online corrigido — v1.1.0 — 15/10/2026:** deploy6ad17f6c7f65114f0602d866/6efc4c0 conferido publicado; nova migração20261015120000 aplicada no Supabase, agora com nove migrações. Oito grupos online aprovados, incluindo encerramento pelo formulário, bloqueio de acesso/convites e preservação do histórico. Um Núcleo e dois vínculos reais preservados; fixture removida. Sem exclusão física ou nova certificação do piloto. [Registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v1.1.0-2026-10-15-03-imp-correcao-online-fun-encerramento-nucleo.md). As pendências de migração/publicação nos marcos abaixo são anteriores a esta correção.

**Entrega local — v1.1.0 — 15/10/2026:** administradores podem encerrar o Núcleo para todos em Pessoas e administração, com nome digitado e ciência explícita. Todos perdem acesso e convites são revogados; acordos, momentos, agenda e contas permanecem armazenados. Sem reabertura pelo aplicativo. Nova migração aplicada somente localmente; publicação e migração remota desta função pendentes. [Registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v1.1.0-2026-10-15-imp-administracao-nucleo-fun-encerramento-coletivo.md).

**Entrega local — v1.0.1 — 15/10/2026:** árvore decorativa reservada à Conta sem sessão e boas-vindas. Conteúdo interno centralizado, sem painel lateral. [Registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v1.0.1-2026-10-15-imp-layout-interno-fun-arvore-opcional.md). Publicação online abaixo permanece na versão anterior.

**Online — v1.0.0 — 15/10/2026:** [abrir o aplicativo](https://noslife.netlify.app). Deploy `6ad055c8a42c00493a8198b9` do commit `ebe8237` publicado; banco alinhado às oito migrações. Onze grupos de verificação online aprovados com duas contas temporárias, incluindo login, convite, administração, participação, privacidade, saída e encerramento. Contas de teste removidas e dados existentes preservados. Uso central com contas confirmadas disponível; cadastro/recuperação por e-mail ainda dependem de SMTP Google e segredo de recuperação. Backup/restauração e controles restantes do piloto seguem pendentes. [Registro operacional completo](Documentacao_Projeto_Nos/_andamento/registros/registro-v1.0.0-2026-10-15-02-imp-deploy-online-fun-administracao-participacao.md). Os marcos abaixo preservam o estado nas datas das entregas anteriores.

**MVP05 — administração e participação — v1.0.0:** modelo aprovado implementado e validado localmente. Múltiplos administradores com aceite de nomeação, gestão de pessoas/convites, sorteio na saída do último administrador, fechamento do último membro e preferência de autoria após saída. Acordos usam gestão administrativa e participação individual, com novo aceite por versão dos termos. Sem votação coletiva. [Contrato](Documentacao_Projeto_Nos/_andamento/funcionalidades/administracao-participacao.md), [manual](Documentacao_Projeto_Nos/_andamento/funcionalidades/administracao-manual.md), [registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v1.0.0-2026-10-14-13-imp-administracao-nucleo-fun-participacao-individual.md), [comparação](Documentacao_Projeto_Nos/wireframes/comparacoes/v1.0.0-2026-10-14-mvp-05-administracao/index.html). Responsável: Sintagma Software, sintagmasoftware@gmail.com. Termos/política completos e operação do piloto permanecem pendentes; item5 adiado pelo Google. [Publicação Git desta entrega](Documentacao_Projeto_Nos/_andamento/registros/registro-v1.0.0-2026-10-15-imp-publicacao-git-fun-administracao-participacao.md). Migração remota e deploy não certificados.

**Marco histórico MVP05 — v0.16.0:** Configurações, Privacidade, Conta e segurança, Ajuda e orientação de saída disponíveis com acesso protegido. Recuperação/logout reusados; logout conserva vínculos. Saída efetiva, transferência, retenção/direitos, suporte/termos e operação ainda pendentes: etapa parcial, piloto não liberado. [Contrato/manual](Documentacao_Projeto_Nos/_andamento/funcionalidades/autonomia-protecao.md), [registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.16.0-2026-10-13-imp-controles-autonomia-fun-mvp-05.md) e [galeria](Documentacao_Projeto_Nos/wireframes/comparacoes/v0.16.0-2026-10-13-mvp-05-tela_66-tela_67-tela_69-tela_70-tela_71/index.html). Entrega incluída no commit atômico de publicação Git autorizado em14/10/2026; confirmação remota reportada no encerramento. Sem deploy certificado.

**Versão vigente do projeto:**3.4.0

**MVP 04 — v0.15.2:** agenda interna conferida localmente; confirmação de remoção, cancelamento sem gravação, feedback de presença/remoção e reservas futuras. Sequência14 →16 →15 →17 opcional →14; são seções da mesma rota. Duas contas desktop/mobile validam criação, respostas, edição/remarcação, paginação, exclusão e isolamento. [Contrato/manual](Documentacao_Projeto_Nos/_andamento/funcionalidades/agenda-interna.md), [registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.15.2-2026-10-13-imp-agenda-interna-fun-mvp-04.md) e [galeria](Documentacao_Projeto_Nos/wireframes/comparacoes/v0.15.2-2026-10-13-mvp-04-tela_14-tela_16-tela_15-tela_17/index.html). Entrega incluída no commit atômico de publicação Git autorizado em13/10/2026; confirmação remota reportada no encerramento. Prova online pendente.

**MVP 03 — v0.15.1:** ciclo central validado localmente com duas pessoas em computador/celular, legado, maioria, isolamento, revisão e história preservada. Histórico de revisões agora paginado, pendência sempre visível; Atlas ordenado e ampliações reservadas. [Contrato/manual](Documentacao_Projeto_Nos/_andamento/funcionalidades/ciclo-habito.md), [registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.15.1-2026-10-13-imp-ciclo-habito-fun-mvp-03.md) e [comparação](Documentacao_Projeto_Nos/wireframes/comparacoes/v0.15.1-2026-10-13-mvp-03-tela_24-tela_28-tela_33/index.html). Publicação e prova online desta versão ainda pendentes.

**MVP 02 — v0.15.0:** recorte funcional concluído localmente: gestão de convites do criador, revogação confirmada, filtros/paginação e concorrência protegida. Atlas ordenado e futuro reservado. Migração/publicação online pendentes; publicação Git autorizada em 13/10/2026, com controle no [registro de publicação](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.15.0-2026-10-13-02-imp-publicacao-git-fun-rastreabilidade-mvp-02.md). [Contrato e teste manual](Documentacao_Projeto_Nos/_andamento/funcionalidades/nucleo-compartilhado.md), [registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.15.0-2026-10-13-imp-nucleo-compartilhado-fun-mvp-02-gestao-convites.md), [comparação](Documentacao_Projeto_Nos/wireframes/comparacoes/v0.15.0-2026-10-13-mvp-02-tela_09-tela_13-tela_58-tela_59/index.html).

**Publicado em https://noslife.netlify.app (v0.14.1):** conexão Supabase e login com conta confirmada validados online em 13/10/2026. Cadastro público com confirmação externa ainda depende da liberação da senha de aplicativo Gmail e ativação SMTP. Recuperação completa também requer segredo de recuperação no Netlify. [Configuração e evidências](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.14.1-2026-10-13-03-imp-conexao-netlify-fun-acesso-online.md).

Etapa 01 do MVP reconferida em 13/10/2026: falhas de login/sessão agora distinguem indisponibilidade e limite de credenciais incorretas. 100 testes gerais, tipos/build e jornada real local de e-mail aprovados. Fechamento operacional pendente: Google ainda não liberou senha de aplicativo para ativar envio Gmail e comprovar recebimento externo. [Registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.14.1-2026-10-13-imp-acesso-existente-fun-mvp-etapa-01.md).

Na v0.13.3, o Percurso 04 mostra tipo na prévia, permite adiar sem associação e organiza chegada direta/entrada pela lista no Atlas. Convites inválidos, expirados, revogados e repetidos foram conferidos com duas identidades no backend local. Nesse marco, QR/link/gestão eram planejados; gestão foi concluída localmente na v0.15.0, com publicação/migração pendentes. [Contrato](Documentacao_Projeto_Nos/_andamento/funcionalidades/entrada-convite.md), [registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.13.3-2026-10-10-imp-entrada-convite-fun-percurso-04.md) e [comparação](Documentacao_Projeto_Nos/wireframes/comparacoes/v0.13.3-2026-10-10-entrar-convite-tela_10-tela_11/index.html).

Na v0.13.2, o Percurso 03 Recuperar acesso retorna à Conta em modo login e rejeita credenciais ambíguas antes do Auth. Recuperação local e Atlas validados; Gmail SMTP preparado com comando de prompt oculto, aguardando senha de app após liberação do Google e teste externo. [Registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.13.2-2026-10-09-imp-recuperacao-acesso-fun-percurso-03.md), [comparação](Documentacao_Projeto_Nos/wireframes/comparacoes/v0.13.2-2026-10-09-recuperar-acesso-tela_04-tela_05/index.html) e [configuração SMTP Gmail](Documentacao_Projeto_Nos/_andamento/funcionalidades/recuperacao-smtp-gmail.md).

Na v0.13.1, as abas de Conta mantêm a largura e a altura da árvore/frases; o link inferior duplicado foi removido. [Registro visual](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.13.1-2026-10-07-imp-conta-fun-alinhamento-visual.md) e [comparação antes/depois](Documentacao_Projeto_Nos/wireframes/comparacoes/v0.13.1-2026-10-07-conta-alinhamento-tela_01-tela_02/index.html).

Um espaço privado para cultivar vínculos saudáveis.

**Referência visual viva do desenvolvimento atual e futuro:** [wireframe completo](Documentacao_Projeto_Nos/wireframes/atlas/index.html), com Conta como Tela 01, 73 telas/estados, percursos e fichas de implementação. Consulte [uso e decisões](Documentacao_Projeto_Nos/wireframes/GUIA.md) e [cobertura e telas pendentes](Documentacao_Projeto_Nos/wireframes/COBERTURA.md). Manter desenhos, contratos, fluxos e pendências sincronizados a cada entrega, conforme decisão de 2026-10-03. Atualizações documentais isoladas não alteram a versão de desenvolvimento. [Protótipo e materiais de origem](Documentacao_Projeto_Nos/Telas/Layout%20inicial/Nos_App.dc.html) estão dentro da pasta de documentação.

**MVP aprovado em 2026-10-12:** [guia MVP](Documentacao_Projeto_Nos/wireframes/atlas/index.html#mvp), acima da Visão global, e [roteiro documental](Documentacao_Projeto_Nos/_andamento/planos/mvp.md). Começar pelo login existente; 13 etapas cobrem todas as 72 telas/estados, com 37 no primeiro marco e expansões até plataformas/integrações. Aprovação orienta prioridade; situações/contratos/pendências continuam obrigatórios. Atualizar o MVP junto de qualquer mudança no aplicativo/atlas. [Registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.14.0-2026-10-12-imp-mvp-atlas-fun-roteiro-aprovado.md) e [comparação](Documentacao_Projeto_Nos/wireframes/comparacoes/v0.14.0-2026-10-12-mvp-atlas-tela_01-a-tela_72/index.html).

## Supabase local

Requer Docker Desktop em execução. A CLI 2.118.0 está fixada nas dependências de desenvolvimento. Na primeira inicialização, o Docker baixa os serviços e a CLI aplica as migrações existentes ao banco local.

```powershell
npm run supabase:start
npm run dev:supabase
```

O aplicativo local abre em http://127.0.0.1:3001; Studio em http://127.0.0.1:54323 e a caixa de e-mails local em http://127.0.0.1:54324. Cadastros e recuperações nesse modo entregam as mensagens na caixa local. Use contas de teste próprias desse banco: os usuários do projeto hospedado não são copiados.

`dev:supabase` obtém URL/chave pública da CLI e substitui essas variáveis somente no processo do aplicativo. Não altera `.env.local`. O comando `npm run dev` mantém a configuração existente e a porta 3000. A saída `.next-supabase` evita disputa com esse servidor. A chave de recuperação local fica em `supabase/.temp`, ignorada pelo Git. Logs centralizados (Analytics/Vector) estão desativados neste Windows: o coletor exigia uma API TCP do Docker que não está habilitada. Os logs dos serviços continuam acessíveis por `docker logs`.

```powershell
npm run test:db
npm run test:calendar-locks
npm run test:authenticated
npm run supabase:status
npm run supabase:stop
```

Os testes autenticados criam e removem contas temporárias exclusivamente no banco local e usam a porta 3200, com build de produção em uma cópia conferida por hash. Para conferir apenas temas e totais: `npm run test:authenticated -- themes.spec.ts navigation-counts.spec.ts`. A parada normal preserva os volumes; não use opções de apagar/resetar dados para o uso diário. Nenhum comando desta seção publica no Supabase hospedado.

## Executar o aplicativo

Use Node.js 24 LTS, versão 24.15.0 ou superior. Os scripts dev e start habilitam --use-system-ca para confiar também nos certificados do Windows e evitar a falha local UNABLE_TO_VERIFY_LEAF_SIGNATURE ao acessar o Supabase, mantendo a validação TLS. [Correção e auditoria do banco v2.0.2](Documentacao_Projeto_Nos/_andamento/registros/registro-v2.0.2-2026-10-18-imp-conexao-supabase-fun-correcao-login-local.md).

**Visão global e sincronização obrigatória:** a aba [Visão global](Documentacao_Projeto_Nos/wireframes/atlas/index.html#visao-global), acima de Todas as áreas, reaproveita as mesmas telas, fichas e percursos. Em qualquer alteração, conferir impacto no projeto inteiro e sincronizar aplicativo/Atlas vivo/Visão global/contratos no mesmo recorte. Toda tela criada ou alterada deve acrescentar evidência em [comparacoes](Documentacao_Projeto_Nos/wireframes/comparacoes/README.md), preservando galerias anteriores. Seguir o [procedimento permanente](Documentacao_Projeto_Nos/wireframes/GUIA.md#visão-global-sincronização-e-comparações--procedimento-permanente).

**Regra de desenvolvimento — prioridade alta:** antes de criar, implementar, alterar ou revisar uma tela, abrir o **Atlas vivo** e conferir seu aspecto visual, abas, ícones, hierarquia, navegação e estados. A implementação deve se guiar prioritariamente por esse desenho; a composição histórica serve à comparação. Confrontar a interface real com o atlas antes de concluir e atualizar ambos na mesma entrega, respeitando contratos e permissões. Procedimento obrigatório no [guia do atlas](Documentacao_Projeto_Nos/wireframes/GUIA.md#prioridade-alta-do-atlas-vivo--decisão-de-2026-10-05).

**Neste computador do trabalho, inicie o aplicativo na pasta `D:\Proj\nos`:**

```powershell
cd D:\Proj\nos
npm run dev
```

O comando usa apenas o Node e o Next.js: o Node lê `.env.local` e executa a etapa interna `dev:local`, sem comandos adicionais para você. Essa separação evita que o Next.js repasse a opção de leitura do arquivo ao seu processo servidor, que não a aceita. Os arquivos `dev.mjs` e `dev-network.mjs`, que preparavam dependências e detectavam redes, foram removidos. As dependências já estão instaladas neste computador; se precisarem ser reinstaladas, execute `npm ci` separadamente.

A configuração fixa da rede do trabalho fica somente em `.env.local`, ignorado pelo Git: `HTTP_PROXY` e `HTTPS_PROXY` indicam o proxy autorizado da empresa; `NO_PROXY=localhost,127.0.0.1,::1` mantém o acesso local direto. O endereço do proxy e as credenciais do Supabase não são publicados no repositório. O comando mantém a validação dos certificados do Windows. Após alterar `.env.local`, reinicie o servidor. O desenvolvimento está configurado e validado somente neste computador/rede.

O script operacional `configure-auth-emails.mjs` também lê essa configuração local com as opções nativas do Node, sem depender dos scripts removidos.

Mantenha o terminal aberto para acompanhar as alterações em tempo real; `Ctrl+C` encerra o servidor. Se aparecer aviso de que já existe um servidor Next.js, use o que está em `http://127.0.0.1:3000` ou encerre a instância anterior no terminal em que ela foi aberta antes de iniciar outra.

Para desenvolver, use **`npm run dev`**: ele compila o código atual e acompanha as alterações. O comando `next start` (também usado por `npm start`) serve a última compilação de produção, sem recompilar os arquivos que você acabou de editar. Para conferir o aplicativo em modo de produção local, encerre a instância anterior e execute:

```powershell
npm run build
npm start
```

Em 21/10/2026, a compilação local antiga foi retirada do caminho ativo e substituída por um build do layout atual. A versão do produto permanece 3.0.4; não foi necessário alterar os componentes ou o script `dev`.

Abra http://127.0.0.1:3000. Sem sessão, a raiz abre **Conta**; após login, abre **Seus Núcleos** (`/nucleos`) ou o destino privado solicitado. A lista contém somente associações reais da pessoa e permite escolher o Início de cada Núcleo. Quem ainda não participa recebe opções de criar ou entrar com convite. **Escolher caminho** (`/comecar`) continua como alternativa protegida. Criar segue Tipo → Propósito → conferir rascunho → criação explícita. Todo `/comecar` e `/nucleos` exige sessão validada, inclusive o rascunho local. Recarregar descarta o rascunho; nome e propósito só são persistidos ao criar.

As rotas de conta, criação protegida, convite e a primeira Home protegida estão implementadas. A Home mostra dados reais do Núcleo e do vínculo próprio. Sem Supabase configurado, as rotas protegidas não simulam cadastro, Núcleo ou convite. O fluxo de conta e associação foi validado com contas reais no projeto de desenvolvimento `nos-dev`; a Home também foi acessada nas sessões usadas para testar a agenda. Na validação original, o aplicativo ainda não estava publicado; o estado online atual está descrito no início deste README.

A agenda interna em `/nucleos/[id]/agenda` está concluída na v0.6.0. A migração `20260927221149_create_nucleus_calendar` foi aplicada e conferida no `nos-dev`; criação, resposta, edição, remoção e negativa de acesso a outro Núcleo foram validadas com duas contas. O Núcleo e o evento temporários usados nos testes foram removidos.

A Tela 04 de Acordos em `/nucleos/[id]/acordos` está concluída na v0.7.0. Há propostas reais de Hábitos e Experiências, respostas individuais e entrada em teste somente por aceite unânime; recusa encerra a proposta. Essência apresenta estado vazio, sem progresso simulado. A migração `20260928120000_create_nucleus_agreements` foi aplicada ao `nos-dev`; três contas temporárias validaram aceite, recusa e isolamento, e os dados de teste foram removidos. A validação original ocorreu antes da publicação; o estado online atual está descrito no início deste README.

O detalhe de um Hábito em teste em `/nucleos/[id]/acordos/[agreementId]` começou na v0.8.0 com os dados reais da proposta e acesso protegido. Na v0.9.0, pessoas que aceitaram participar podem abrir `/registrar`, guardar humor e nota opcional, e consultar o histórico visível ao Núcleo. A migração de momentos foi aplicada ao `nos-dev`; o percurso autenticado foi validado no Supabase local com três contas, sem revalidação remota da interface. Na v0.10.0, `/revisar` permite propor ajuste ou encerramento consensual do Hábito em teste. A aplicação exige unanimidade, sete dias desde a solicitação e confirmação explícita. Encerrar preserva os momentos e impede novas gravações; o hub inclui o filtro Encerrados. Progresso, reflexões, impacto, linguagem de cuidado e evento associado ainda exigem contratos próprios. A agenda pode ser aberta separadamente.

## Configurar Supabase

1. O projeto de desenvolvimento `nos-dev` já foi criado na organização **Projetos Efraim**. Guarde a senha do banco fora do repositório.
2. A **Project URL** e a **publishable key** já estão em `.env.local` neste ambiente, ignorado pelo Git. Em outro ambiente, copie `.env.example` para `.env.local` e preencha essas variáveis. Não use uma secret key ou `service_role` no app.
3. Em **Authentication → URL Configuration**, o Site URL é `https://noslife.netlify.app`; retornos `/auth/confirm` e `/auth/recovery` online e locais estão autorizados, incluindo o destino interno `next`. A referência parcial aplicada está em `supabase/operacao/netlify/supabase/config.toml`; não aplicar o arquivo principal de desenvolvimento sobre o remoto. Os modelos personalizados preservam `{{ .ConfirmationURL }}` nos links. SMTP Brevo está configurado conforme registro de20/10; apresentação/recebimento dos novos modelos exigem teste próprio. Consulte supabase/templates/README.md para a operação de e-mails.
4. As migrações `20260927173656_create_nuclei_and_invitations`, `20260927221149_create_nucleus_calendar`, `20260928120000_create_nucleus_agreements`, `20260929220000_create_nucleus_habit_moments` `20261002230000_create_nucleus_habit_revisions` e `20261003120000_create_nucleus_habit_trials` já foram aplicadas e conferidas no `nos-dev`. **Não as reaplique nesse projeto.** Em um novo projeto, use as migrações versionadas em `supabase/migrations/`: autentique a CLI, vincule o projeto correto, revise `npx supabase db push --dry-run` e só então aplique `npx supabase db push`.
5. O fluxo de cadastro/confirmação, criação, convite, prévia, aceite e leitura condicionada à associação foi validado com duas contas distintas no ambiente de desenvolvimento.

O valor `<id-do-projeto>` aparece na URL `https://supabase.com/dashboard/project/<id-do-projeto>`. A CLI pode pedir a senha do banco no terminal; não a registre em arquivos ou mensagens. Neste ambiente, a inspeção HTTPS do Avast exigiu uma exceção de domínio para `api.supabase.com`; após a correção, a CLI 2.118.0 aplicou a migração de Acordos e confirmou o histórico remoto. O envio de e-mail padrão do Supabase tem limites de teste, então configure SMTP próprio antes de uso público.
No PowerShell que bloqueie `npx.ps1`, execute os mesmos comandos com `npx.cmd`.

Para as verificações, use a pasta `nos`, que é a raiz deste repositório Git. Neste workspace, se estiver na pasta principal `Projeto Nós`, execute `cd .\nos`; em um clone do GitHub, permaneça na raiz do clone. Depois:

```powershell
npx playwright install chromium
npm test
npm run typecheck
npm run build
```

No ambiente Windows em que ocorrer `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, o uso dos certificados confiáveis do sistema foi verificado com `$env:NODE_USE_SYSTEM_CA='1'` antes de instalar. Não desabilite a validação TLS.

Código: `src/app` (rotas), `src/features/onboarding` (componentes do fluxo) e `src/shared` (navegação). Testes de comportamento em `tests`. Fontes e imagem da árvore servidas localmente. Consulte [frontend](Documentacao_Projeto_Nos/_andamento/tecnologias/frontend.md) e [primeira tela](Documentacao_Projeto_Nos/_andamento/funcionalidades/escolher-caminho.md) para limites e próximos passos.

---

## Estrutura de Documentação

A documentação está organizada em três categorias principais:

### 1.x - Visão e Regras de Negócio

Documentos que definem a filosofia, as regras de negócio e os conceitos fundamentais do projeto.

- [v1.1 - Visão e Regras de Negócio](Documentacao_Projeto_Nos/Projeto_Nos_v1.1_Visao_e_Regras_de_Negocio.md)
- [v1.2 - Sistema de Aprovação e Construção de Acordos](Documentacao_Projeto_Nos/Projeto_Nos_v1.2_Sistema_de_Aprovacao_e_Construcao_de_Acordos.md)
- [v1.3 - Evolução para Núcleos](Documentacao_Projeto_Nos/Projeto_Nos_v1.3_Evolucao_Para_Nucleos.md)
- [v1.4 - Sistema de Impacto](Documentacao_Projeto_Nos/Projeto_Nos_v1.4_Sistema_de_Impacto.md)
- [v1.5 - Sistema de Reconhecimento e Gratidão](Documentacao_Projeto_Nos/Projeto_Nos_v1.5_Sistema_de_Reconhecimento_e_Gratidao.md)
- [v1.6 - Sistema de Marcos de Evolução e Celebrações Saudáveis](Documentacao_Projeto_Nos/Projeto_Nos_v1.6_Sistema_de_Marcos_de_Evolucao_e_Celebracoes_Saudaveis.md)
- [v1.7 - Sistema de Linguagens de Cuidado e Amor](Documentacao_Projeto_Nos/Projeto_Nos_v1.7_Sistema_de_Linguagens_de_Cuidado_e_Amor.md)
- [v1.8 - Manifesto do Núcleo](Documentacao_Projeto_Nos/Projeto_Nos_v1.8_Manifesto_do_Nucleo.md)
- [v1.9 - Calendário do Núcleo e Sincronização Segura](Documentacao_Projeto_Nos/Projeto_Nos_v1.9_Calendario_do_Nucleo_e_Sincronizacao_Segura.md)
- [v1.10 - Sistema de Conversas Guiadas e Mediação Afetiva](Documentacao_Projeto_Nos/Projeto_Nos_v1.10_Sistema_de_Conversas_Guiadas_e_Mediacao_Afetiva.md)

### 2.x - Interface e Implementação

Documentos que definem as telas, fluxos, design system e regras de implementação.

- [v2.0 - Alinhamento das Telas com a Documentação](Documentacao_Projeto_Nos/Projeto_Nos_v2.0_Alinhamento_das_Telas_com_a_Documentacao.md)
- [v2.1 - Catálogo Completo das Interfaces](Documentacao_Projeto_Nos/Projeto_Nos_v2.1_Catalogo_Completo_das_Interfaces.md)
- [v2.2 - Fluxos, Navegação e Interações](Documentacao_Projeto_Nos/Projeto_Nos_v2.2_Fluxos_Navegacao_e_Interacoes.md)
- [v2.3 - Design System, Componentes e Tom de Interface](Documentacao_Projeto_Nos/Projeto_Nos_v2.3_Design_System_Componentes_e_Tom_de_Interface.md)
- [v2.4 - Modelo Funcional, Dados, Estados e Regras](Documentacao_Projeto_Nos/Projeto_Nos_v2.4_Modelo_Funcional_Dados_Estados_e_Regras.md)
- [v2.5 - Matriz de Permissões, Privacidade e Visibilidade](Documentacao_Projeto_Nos/Projeto_Nos_v2.5_Matriz_de_Permissoes_Privacidade_Visibilidade.md)
- [v2.6 - Estados Vazios, Erros e Carregamento](Documentacao_Projeto_Nos/Projeto_Nos_v2.6_Estados_Vazios_Erros_e_Carregamento.md)
- [v2.7 - Notificações e Eventos do Sistema](Documentacao_Projeto_Nos/Projeto_Nos_v2.7_Notificacoes_e_Eventos_do_Sistema.md)
- [v2.8 - Autenticação e Segurança](Documentacao_Projeto_Nos/Projeto_Nos_v2.8_Autenticacao_e_Seguranca.md)

### 3.x - Técnica e Arquitetura

Documentos técnicos sobre arquitetura, infraestrutura e implementação.

_(Ainda não há documentos nesta categoria)_

### Andamento

Registro persistente das decisões, do estado atual e das próximas ações do projeto.

- [Índice de andamento](Documentacao_Projeto_Nos/_andamento/README.md)
- [Estado atual](Documentacao_Projeto_Nos/_andamento/estado.md)
- [v0.1.0 — Escolher caminho](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.1.0-2026-09-24-imp-tela-escolher-caminho-fun-entrada-nucleo.md)
- [v0.2.0 — Tipo de Núcleo](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.2.0-2026-09-25-01-imp-tela-tipo-nucleo-fun-selecao-vinculo.md)
- [v0.3.0 — Propósito do Núcleo](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.3.0-2026-09-27-imp-tela-proposito-nucleo-fun-rascunho-local.md)
- [v0.4.0 — Autenticação, criação e convite](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.4.0-2026-09-27-imp-integracao-supabase-fun-criacao-convite.md)
- [v0.5.0 — Home do Núcleo](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.5.0-2026-09-27-imp-home-nucleo-fun-resumo-protegido.md)
- [v0.6.0 — Agenda interna](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.6.0-2026-09-27-01-imp-agenda-interna-fun-eventos-nucleo.md)
- [v0.7.0 — Acordos](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.7.0-2026-09-28-imp-hub-acordos-fun-propostas-consentimento.md)
- [v0.8.0 — Detalhe do Hábito](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.8.0-2026-09-29-imp-detalhe-habito-fun-consulta-proposta-teste.md)
- [v0.9.0 — Registrar momento](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.9.0-2026-09-29-imp-registro-momento-habito-fun-historico-real.md)

---

## Licença

## Verificar Revisar Hábito — v0.10.0

A migração de revisão foi aplicada ao nos-dev pelo editor SQL em transação com o registro de versão; a CLI parou ao inicializar o papel de conexão. As quatro funções remotas foram comparadas com as locais. A interface autenticada foi validada no Supabase local, sem repetição remota.

Com Docker e Supabase local disponíveis, execute `supabase test db`. Para repetir a jornada autenticada, defina `SUPABASE_CLI_PATH` com o executável da CLI e execute `node scripts/verify-habit-revision-local.mjs`. O script aceita somente backend local, cria e remove dados temporários e usa a porta 3200 e o diretório isolado `.next-verify`; não precisa encerrar o servidor de desenvolvimento na porta 3000. Não registra credenciais. O teste antecipa o relógio somente para solicitações temporárias locais.

[Registro de revisão](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.10.0-2026-10-02-imp-revisao-habito-fun-consentimento-reflexao.md).

## Confirmação do Hábito — v0.11.0

Novos Hábitos exigem teste de 7 a 30 dias. O último aceite unânime inicia o prazo real. Depois do prazo, a confirmação ativa o Hábito com mais da metade dos participantes originais até 150 pessoas (floor(N/2)+1), ou um terço arredondado para cima acima de 150 (ceil(N/3)). Exemplos: 76 de 150; 51 de 151. A interface explica as regras antes das ações e mostra contagem e prazo reais em `/confirmar`. Ajustes e encerramentos mantêm unanimidade, sete dias de reflexão e aplicação explícita; ajuste abre novo teste e novas confirmações. Hábitos sem prazo precisam de novo período explicitamente aceito, sem inferir datas antigas.

Com Supabase local iniciado e SUPABASE_CLI_PATH configurado, execute `supabase test db` e `node scripts/verify-habit-trial-local.mjs`. O script usa cinco contas temporárias, porta 3200 e `.next-verify`, aceita somente backend local e limpa os dados/servidor ao terminar. A antecipação de prazo acontece somente nas fixtures locais. 84 testes, tipos, build, banco e jornada autenticada passaram. Migração aplicada no nos-dev; 13 funções conferidas, interface autenticada testada localmente. [Registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.11.0-2026-10-03-imp-confirmacao-habito-fun-teste-votacao-proporcional.md).

## v0.14.0 — Percurso 05 Uma proposta de Hábito

Conferência antes de enviar no formulário de Acordos, com edição e preservação dos termos após erro. Enviar registra o aceite do autor; só o último aceite inicia o teste. Caminho disponível 18 → 22 → 23 → 24; necessidade/proposta guiada/compreensão (19–21) e /novo permanecem reservadas. [Contrato e teste manual](Documentacao_Projeto_Nos/_andamento/funcionalidades/proposta-habito.md), [registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.14.0-2026-10-10-imp-proposta-habito-fun-percurso-05.md), [comparação](Documentacao_Projeto_Nos/wireframes/comparacoes/v0.14.0-2026-10-10-proposta-habito-tela_18-tela_19-tela_20-tela_21-tela_22-tela_23-tela_24/index.html).

Repetir com Supabase local: SUPABASE_CLI_PATH configurado e node scripts/test-authenticated-local.mjs habit-proposal.spec.ts. O processo usa contas temporárias e backend local; não altera ambiente remoto. Próximo passo desta área: definir persistência, privacidade e destinatários para necessidade/compreensão antes de integrar o fluxo guiado.

## Próximo passo após v0.11.0

Definir os dados reais da Tela 07 — Nossa Árvore a partir do catálogo v2.1, impacto v1.4 e marcos v1.6. Níveis, experiência e indicadores do protótipo exigem contrato próprio antes da implementação. Progresso, reflexões e publicação pública permanecem fora da entrega atual.

## Conta e entrada — v0.12.0

Área completa (01–05 e 72) implementada. A raiz abre Conta; /boas-vindas é apresentação opcional. Cadastro, confirmação/reenvio e recuperação/redefinição usam Supabase Auth com retorno de convite e prova de recuperação validada no servidor. Configure AUTH_RECOVERY_SECRET somente no servidor, além das variáveis existentes.

[Contrato e configuração](Documentacao_Projeto_Nos/_andamento/funcionalidades/conta-entrada.md), [registro](Documentacao_Projeto_Nos/_andamento/registros/registro-v0.12.0-2026-10-07-imp-conta-entrada-fun-recuperacao-integrada.md) e [diferenças antes/atlas/aplicação](Documentacao_Projeto_Nos/wireframes/comparacoes/v0.12.0-2026-10-07-conta-entrada-tela_01-tela_02-tela_03-tela_04-tela_05-tela_72/index.html). A decisão do usuário exige atualizar os dois lados e mostrar sempre a diferença.

Para reproduzir a jornada de e-mails no Supabase local, configure SUPABASE_CLI_PATH e execute `node scripts/verify-account-local.mjs`. O script aceita somente backend local, usa porta 3200/.next-verify, cria/remove conta e e-mails temporários e encerra o servidor isolado. Não executa envio remoto ou deploy. Verificação visual: `node Documentacao_Projeto_Nos/wireframes/tools/verify-account-fidelity.mjs` com app na porta 3000.

## v0.13.0 — Sequência e sessão

O proxy valida identidade antes de renderizar páginas privadas. Sessão ausente, adulterada ou não renovável pede login e preserva somente um destino interno permitido; token de acesso expirado com renovação válida mantém a sessão. Falha operacional bloqueia o acesso temporariamente. Ações e RLS continuam conferindo autorização. [Contrato e roteiro de teste](Documentacao_Projeto_Nos/_andamento/funcionalidades/navegacao-sessao.md) e [comparações visuais](Documentacao_Projeto_Nos/wireframes/comparacoes/v0.13.0-2026-10-07-sessao-navegacao-tela_01-tela_06-tela_12-tela_13/index.html).
