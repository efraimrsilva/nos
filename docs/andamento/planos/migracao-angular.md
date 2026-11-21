# Plano de migração para Angular

A [guia Migração do Atlas](../../wireframes/atlas/index.html#migracao) reúne os 16 passos e 73 fichas. Na implementação, consulte primeiro o [código Next.js v3.11.1 por recorte](paridade-angular-fontes.md) e use o Atlas para conferir a apresentação. Execute o passo correspondente antes de concluir a paridade da virada.


**Status:** A01–A11 validadas na prévia v4.0.0-alpha.10. A12 tem rascunho no Netlify, login confirmado pelo usuário e fila testada em banco local isolado. A13 tem [preparação local v4.0.0-alpha.11](../registros/registro-v4.0.0-alpha.11-2026-11-17-imp-preparacao-angular-fun-transporte-e-paridade.md), com conferência dos 32 caminhos e suporte ao transporte de e-mail oficial. O Angular foi publicado no Netlify em A13. A14 preserva a referência estética Next.js v3.11.1. A validação com sessão real e entrega de e-mail hospedada continua pendente.

**Objetivo.** Estabilizar o Nós em Angular para navegadores de computador e celular, preservando funcionalidades, endereços públicos e dados. Usar essa base para introduzir a infraestrutura planejada e empacotar a interface com Capacitor.

## Stack de destino

**Decisão inicial de arquitetura — 19/11/2026.** Esta é a referência para a evolução da linha Angular.

O [mapa da stack e dos diretórios](../../stack.md) registra a implementação atual, a estrutura-alvo proposta e as decisões aprovadas.

| Camada | Tecnologia definida | Situação |
| --- | --- | --- |
| Frontend | Angular + TypeScript | Web responsiva em `apps/web`, com Angular 22 e TypeScript 6.0. |
| Estilização | Tailwind CSS | Em uso junto aos estilos próprios do projeto. CDK e Material dependem de necessidade concreta. |
| Backend | NestJS | Definido para a API (interface de programação de aplicações) e os serviços de backend. Implementação pendente. |
| Banco de dados | PostgreSQL / Supabase | Em uso. Preservar dados, migrações, regras transacionais e políticas de acesso vigentes. |
| Mobile | Capacitor | Empacotamento da web Angular após sua estabilização, primeiro para Android e depois para iOS. |
| PWA | Web instalável e service worker | Planejada. Instalação, cache, atualização e limites offline têm aceite próprio. |
| Tempo real | WebSocket no NestJS | Resposta ao convite da Agenda como piloto. Estender a cobertura a todos os dados mutáveis. |
| Autenticação | Supabase Auth | Preservar o provedor e verificar autorização até o PostgreSQL. |
| Organização | Monorepo com Nx | Planejado. Hoje a raiz e `apps/web` têm lockfiles npm próprios. |
| Testes | Playwright, Node e pgTAP | Em uso. Avaliar Vitest ou Jest no piloto NestJS. |
| Publicação e automação | Netlify + automação de verificações | Netlify serve a web e suas funções atuais. Usar GitHub Actions dentro da cota gratuita na fase 2. A API e os apps nativos terão critérios próprios de publicação. |

### Transição a partir da prévia

A web usa Supabase Auth, acesso ao PostgreSQL pelas operações existentes e funções protegidas para e-mails e integrações. Essa base sustenta a publicação Angular. O [inventário da stack](../../stack.md#1-stack-verificada) registra as versões e o que foi verificado na página pública.

## Ordem de implementação

**Próximo passo:** paridade visual 16, com a escolha dos recortes da revisão transversal e as pendências da conferência hospedada. Os passos 01–15 foram registrados ao longo das entregas locais. O [estado do projeto](../estado.md) é a referência de retomada. Usar o [mapa de fontes](paridade-angular-fontes.md) ao implementar os recortes escolhidos. Os números **A01–A14** identificam entregas técnicas da fase 1. Os **passos 01–16** descrevem seu roteiro visual.

### Fase 1 — Estabilizar a web Angular

1. **Fechar a paridade.** Classificar as diferenças da revisão transversal por impacto em acesso, conclusão da tarefa e fidelidade visual. Começar pelos candidatos com impacto de uso: Início do Núcleo, resposta a convite da Agenda e Acordos no celular. Registrar a seleção no passo 16 da [guia Migração](../../wireframes/atlas/index.html#migracao). Em 1440 e 390 pixels, comparar os recortes com o Next.js e o Atlas e conferir estados, diálogo, teclado, toque, navegação e permissões. Esboços continuam identificados. Guardar evidências por recorte.
2. **A12 — Fechar o ensaio hospedado.** Conferir URLs diretas, login, renovação de sessão, confirmação, recuperação, fila de avisos com falha e nova tentativa e recebimento de relato por uma caixa de teste. Retestar a falha de relatos registrada.
3. **A13 — Confirmar a publicação.** O Angular já está publicado. Antes de uma candidata, registrar revisão, ambiente, migrações requeridas e último deploy recuperável. Ensaiar a restauração do deploy e do destino da fila, se alterado. Conferir no domínio público sessão, permissões, gravações principais e integrações. Usar o [roteiro operacional](../../../apps/web/netlify/README.md) para publicar ou restaurar quando autorizado.
4. **A14 — Confirmar a independência do arquivo.** Os estilos, a marca e as referências já estão em [arquivo/nextjs](../../../arquivo/nextjs/README.md). O código executável permanece recuperável pelo Git. Confirmar que build, testes e publicação Angular funcionam sem dependência operacional desse caminho.

**Aceite.** A paridade visual 16 e os fluxos críticos hospedados têm evidências com ambiente e revisão. O retorno foi ensaiado e o arquivo Next.js ficou fora do build ativo.

### Fase 2 — Introduzir Nx

**Depende da fase 1.** Registrar os comandos atuais e o artefato `apps/web/dist/nos-web/browser`. Introduzir o Nx em uma entrega independente de NestJS, preservando os scripts npm, o artefato e os dois lockfiles inicialmente. Excluir `arquivo/nextjs` do grafo de tarefas ativas. Avaliar unificar a instalação em outra entrega.

**Aceite.** Desenvolvimento local, verificação de tipos, build e verificações existentes produzem resultados equivalentes. O ambiente de ensaio do Netlify publica o mesmo artefato, com rotas diretas e integrações funcionando. Automatizar primeiro as verificações determinísticas de dependências, tipos e build. Usar GitHub Actions em propostas de alteração, introduzir a rotina em `.github/workflows` e manter os testes autenticados e de banco condicionados ao ambiente adequado.

### Fase 3 — Pilotar uma API NestJS

**Depende da fase 2.** Abrir `apps/api` com uma leitura autenticada. Operação aprovada: dados básicos de um Núcleo já consultados pela web. Mapear campos, erros e papéis. Manter Supabase Auth no piloto e levar a identidade verificada à operação PostgreSQL para preservar políticas por linha e regras transacionais. Extrair apenas os formatos compartilhados em `libs/contracts` quando a web e a API passarem a consumir o contrato.

**Aceite.** A leitura via NestJS devolve o mesmo resultado autorizado da web, recusa sessão inválida ou expirada e bloqueia outra conta sem vínculo. Testar também indisponibilidade da API. Escolher Vitest ou Jest se necessário, reaproveitar Playwright e as verificações PostgreSQL e avaliar OpenAPI no contrato HTTP. Começar pelo piloto local e ensaiar a API em hospedagem gratuita verificada, com diagnóstico de disponibilidade e retorno ao caminho anterior. Os dois endpoints Netlify continuam no caminho atual durante o piloto.

### Fase 4 — Validar a continuidade do Supabase Auth

**Depende da fase 3.** Manter Supabase Auth. Verificar identidade e permissões do navegador até o banco. Reabrir emissão própria de tokens somente com necessidade concreta.

**Aceite.** A decisão tem justificativa registrada. Login, confirmação, recuperação, renovação, expiração, saída e isolamento foram conferidos no navegador e nas fronteiras da API e do banco.

### Fase 5 — Validar tempo real em um fluxo

**Depende do contrato de identidade da fase 4.** Usar WebSocket no NestJS para a resposta ao convite da Agenda. Vincular o evento à gravação confirmada, inclusive pelo caminho atual de escrita da web. Autorizar assinatura e entrega por conta e Núcleo. Na reconexão ou retorno ao primeiro plano, reler o estado autorizado. Antes do ensaio hospedado, verificar suporte gratuito a conexões persistentes, suspensão e limites de uso.

**Aceite.** Duas contas autorizadas recebem a atualização e uma conta sem vínculo fica fora. Testar troca de Núcleo, sessão expirada, saída e reconexão. Confirmar a convergência das telas sem recarga manual, inclusive após eventos perdidos ou duplicados. Expandir por fluxo no plano de MVP e Continuidade.

### Fase 6 — Validar PWA e limites offline

**Depende da fase 1.** Primeira plataforma de continuidade. Pode avançar junto à API e precede o Android. Começar pela instalação web e pelo cache dos recursos públicos. Registrar por fluxo o que pode ser usado sem rede, a indicação de indisponibilidade e a estratégia de atualização do service worker. Nesta primeira entrega, manter dados privados e gravações fora da política de cache offline.

**Aceite.** Instalação e atualização conferidas em navegadores compatíveis. Sem rede, a interface informa o limite, e sair ou trocar de conta não revela dados privados anteriores. Verificar também recuperação de uma atualização com falha.

### Fase 7 — Pilotar Capacitor em Android e depois iOS

**Depende da fase 1 e dos contratos de sessão e serviços usados pelo pacote.** Começar Android após o aceite da PWA. Se o pacote consumir uma nova API ou um novo fluxo de identidade, exigir o aceite da entrega correspondente. Abrir `apps/mobile`, reaproveitar o build da web e definir a origem HTTPS das integrações e os retornos de autenticação. Manter projetos nativos, permissões e configurações de assinatura por plataforma.

**Aceite.** Validar primeiro Android em dispositivo real e distribuição interna. A partir dessa evidência, validar iOS separadamente com macOS e Xcode. Para ambos, conferir instalação, retorno de login e recuperação, saída, limpeza da sessão, ausência de rede, teclado, botão de retorno e permissões dos recursos efetivamente usados.

As fases 6 e 7 são marcos técnicos da etapa 13 de [MVP e Continuidade](mvp.md). Em todas as fases vale o orçamento permanente de R$ 0 registrado na [stack](../../stack.md#4-divergências-e-decisões).

## Estratégia de transição

**Estratégia adotada na transição:** evoluir o Angular em prévia isolada antes da publicação. A página pública já serve Angular. A validação hospedada continua descrita na fase 1. O build é servido como arquivos estáticos com abertura de rotas diretamente pela URL. Os retornos de autenticação e de integração devem continuar funcionando com a regra de fallback. [Publicação Angular](https://angular.dev/tools/cli/deployment)

## Versionamento durante a transição

A migração para Angular marcou a passagem para a série `4.x`. A linha Next.js `3.x` permanece como referência de histórico. A tabela registra os marcos e os critérios de versão estável.

| Linha ou marco | Versão | Quando usar |
| --- | --- | --- |
| Next.js em manutenção | `3.x` | Manter a versão vigente e incrementar conforme as entregas dessa linha. Por exemplo, uma correção pode gerar `3.11.2` a partir de `3.11.1`. |
| Primeiro marco Angular | `4.0.0-alpha.1` | Após validar A01, com leitura e edição do próprio nome funcionando na prévia. |
| Marcos Angular seguintes | `4.0.0-alpha.2`, `4.0.0-alpha.3`, … | Ao concluir e verificar um conjunto demonstrável. Um marco pode reunir várias das 14 entregas. |
| Candidata a lançamento | `4.0.0-rc.1` | Após verificar a paridade dos fluxos e ensaiar a publicação e o retorno. Se houver outra candidata, avançar para `rc.2` e assim por diante. |
| Virada pública | `4.0.0` | Identificar a publicação estável do Angular em A13. Registrar a confirmação após verificar os fluxos críticos no site público. |

Em cada linha, manter a mesma versão nos manifestos, no lockfile, no estado do projeto e na identificação do Atlas correspondente. Registrar passos menores em commits e reservar versões para marcos verificáveis. Antes da virada, registrar a versão, o commit e o deploy da última `3.x` para permitir o retorno. Depois da virada, tratar A14 como uma entrega separada e classificar seu impacto quando estiver concluída.

## Uma aplicação Angular para computador e celular

Angular é o único frontend de destino. A aplicação usa os mesmos componentes, rotas, operações e estados em qualquer largura. A navegação se adapta à tela. O navegador móvel espelha a experiência prevista para o aplicativo, com os mesmos fluxos e permissões. O Atlas vivo acompanha as duas larguras. Next.js serve como referência de paridade e opção de retorno durante a transição, com um frontend por ambiente.

## Aplicativos nativos após a web

Após estabilizar a web e retirar a dependência operacional do Next.js, empacotar a compilação estática Angular via Capacitor, primeiro para Android e depois para iOS. Na etapa nativa, apontar `webDir` para a saída que contém `index.html`. Autenticação, dados e operações privilegiadas continuam remotos. Definir nessa etapa a versão do Capacitor, os plugins e os requisitos de distribuição. [Instalação do Capacitor em uma aplicação existente](https://capacitorjs.com/docs/getting-started)

Validar em dispositivo real o retorno de login e recuperação por links do aplicativo, o armazenamento e a limpeza da sessão, a origem e o acesso aos serviços remotos, a falta de rede, o botão Voltar, o teclado e as áreas seguras. A conferência em navegador móvel cobre a interface compartilhada. O aceite nativo tem verificações próprias.

## Conferência da base da migração

| Etapas | Evidência na branch e trabalho restante |
| --- | --- |
| A01–A02 | Estrutura responsiva, roteamento e diálogos compartilhados no Angular. Conta tem edição do nome. |
| A03 | Páginas públicas e três retornos de autenticação no Angular Router. Google precisa de ensaio com provedor habilitado na prévia. |
| A04–A09 | Núcleos, convites, administração, acordos, ciclos e Agenda já têm rotas Angular. Desktop e navegador móvel usam a mesma aplicação. Conferir as migrações de criação de Núcleos e registro de momentos no destino antes de hospedar a prévia. |
| A10–A11 | Completar Conta, Configurações, Privacidade e Ajuda. Portar as seis áreas privadas ilustrativas e conferir os menus nas duas larguras. Os destinos provisórios contam como pendência. |
| A12 | Netlify publica a saída estática Angular. Retornos de autenticação e rotas das funções de e-mail precedem o fallback da navegação. Renovação de sessão, fila e recebimento externo ainda exigem ensaio hospedado. |
| A13–A14 | Angular publicado e referência visual preservada em `arquivo/nextjs`. Falta fechar a paridade 16, registrar a conferência dos fluxos críticos hospedados e comprovar o retorno operacional. |

Reaproveitar A01–A09 preserva a base Angular e os fluxos que já têm testes. A auditoria do código encontrou reutilização de utilitários TypeScript, sem montagem de React no frontend Angular. Recomeçar exigiria reconstruir e testar esses mesmos fluxos.

## Entregas em ordem de execução

Cada linha é uma unidade de trabalho revisável. A coluna de aceite indica a evidência esperada para fechar a unidade. As listas de rotas usam `:id` para representar parâmetros.

| ID  | Entrega e dependência                                     | Escopo e arquivos de referência                                                                                                                                                                                                                                                                                                                                                                                                                         | Aceite técnico                                                                                                                                                                                                                                                                   |
| --- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A01 | **Validada localmente.** Base local e primeiro fluxo protegido                     | Criar o mínimo em `apps/web`. Em `/configuracoes/conta`, migrar só leitura e edição do nome. Usar uma conta descartável, com sessão emitida pelo Supabase Auth local. Referências em `src/features/controls/profile-name-action.ts` e `src/lib/supabase/`.                                                                                                                                                                                              | Compilar a aplicação Angular. Demonstrar leitura e gravação via Supabase, persistência após recarregar, nome inválido, sessão expirada e isolamento entre contas.                                                                                                                |
| A02 | **Validada localmente.** Interface compartilhada e navegação · A01                 | Migrar layout raiz, estilos, marca, fontes, estados de rota, página 404, menus e estrutura responsiva. Portar diálogos compartilhados e a navegação por teclado. Preservar títulos, rótulos e movimento reduzido. Referências em `src/app/layout.tsx`, `src/app/*.css` e `src/shared/components/`.                                                                                                                                                      | Conferir desktop e celular sem recarregar o documento, foco, volta da navegação e fechamento de modal por X, Escape e gesto externo iniciado e encerrado fora. Em diálogos aninhados, fechar apenas o superior.                                                                  |
| A03 | **Validada localmente (e-mail e sessão).** Conta e sessão · A01–A02                                  | Migrar `/`, `/conta`, `/conta/confirmar-email`, `/conta/recuperar`, `/conta/nova-senha` e `/boas-vindas`. Portar cadastro, entrada, saída, confirmação, recuperação, login social e complemento de perfil. Preservar os três caminhos HTTP `/auth/confirm`, `/auth/recovery` e `/auth/callback`. Referências em `src/features/auth/`, `src/app/auth/` e `src/proxy.ts`.                                                                                 | Confirmar fluxos com o ambiente local e, quando configurado, com cada provedor ativo na prévia. Validar abertura por link, retorno de convite, renovação e encerramento da sessão, Auth indisponível e destino de retorno seguro.                                                |
| A04 | **Validada localmente.** Escolha e criação de Núcleos · A02–A03                    | Migrar `/nucleos`, `/nucleos/:id`, `/comecar`, `/comecar/tipo` e `/comecar/proposito`. Preservar lista, rascunho, criação, resumo e seleção por conta. Integrar o destino de convite inicial entregue em A05. Referências em `src/features/nuclei/` e `src/features/onboarding/`.                                                                                                                                                                       | Criação sem duplicidade, estado vazio, carregamento, acesso permitido por vínculo e recusa de leitura em outro Núcleo. A jornada de convite da criação fecha em A05.                                                                                                             |
| A05 | **Validada localmente.** Convites · A04                                            | Migrar `/comecar/convite`, `/comecar/convite-inicial/:id` e `/nucleos/:id/convites`. Portar gerar, consultar prévia, aceitar e revogar. Referência em `src/features/invitations/`.                                                                                                                                                                                                                                                                      | Conferir ponta a ponta com duas contas, link direto, convite inválido ou revogado, permissões e repetição do aceite.                                                                                                                                                             |
| A06 | **Validada localmente.** Pessoas e administração · A04–A05 | Migrar `/nucleos/:id/pessoas` e `/nucleos/:id/sair`, incluindo edição de nome/propósito, sincronização de identidade, aceite administrativo, saída, encerramento e preservação do histórico. [Registro A06](../registros/registro-v4.0.0-alpha.6-2026-11-15-imp-pessoas-angular-fun-administracao-e-participacao.md). | Duas contas, atualização entre sessões, permissão administrativa, preferência de autoria e nome de confirmação do encerramento. |
| A07 | **Validada localmente.** Propostas e respostas · A04 | Migrar `/nucleos/:id/acordos` e a primeira parte de `/nucleos/:id/acordos/:agreementId`. Portar listagem, criação, contagens, respostas individuais e detalhe dos termos. [Registro A07](../registros/registro-v4.0.0-alpha.7-2026-11-15-imp-acordos-angular-fun-propostas-e-respostas.md). | Duas contas, conferência local, aceite por versão, recusa individual, contagens, leitura de legado e proteção do detalhe. |
| A08 | **Local.** Ciclo de Hábito · A07 | Completar o detalhe e migrar `/confirmar`, `/registrar` e `/revisar`. Preservar histórico e categoria antiga. [Registro A08](../registros/registro-v4.0.0-alpha.8-2026-11-15-imp-habito-angular-fun-ciclo-momentos-e-historico.md). | Duas contas, vigência do aceite, versão sob trava, revisão, administração e leitura após encerramento. |
| A09 | **Validada localmente.** Agenda · A04                                              | Migrar `/nucleos/:id/agenda`. Substituir React Day Picker por componente compatível com Angular, avaliado com foco em teclado, português e navegação entre anos. Portar grade semanal, lista móvel, criação, edição, respostas e remoção. Referência em `src/features/calendar/`.                                                                                                                                                                       | Conferir calendário mensal e semanal, horários, telas estreitas, permissões, bloqueios e concorrência de alterações pertinentes.                                                                                                                                                 |
| A10 | **Verificada localmente.** Configurações, aparência e suporte · A01–A03 e A06        | Completar `/configuracoes/conta` e migrar `/configuracoes`, `/configuracoes/privacidade` e `/ajuda`. Preservar redirecionamentos, temas, exclusão da conta, suporte e acesso pelos menus. Referências em `src/features/controls/`, `src/features/appearance/` e `src/features/support/`.                                                                                                                                                                | Conferir temas por conta, troca de sessão, exclusão com confirmação explícita e proteção do histórico, limite de envio e resultado confirmado do suporte.                                                                                                                        |
| A11 | **Verificada localmente.** Áreas planejadas e integração da navegação · A04, A06–A10 | Migrar as prévias `arvore`, `memorias`, `conexoes`, `perfis`, `manifesto` e `cuidado` sob `/nucleos/:id`. Integrar cabeçalho, totais, notificações visuais e destinos na interface autenticada. Referências em `src/features/preview/` e `src/features/navigation/`.                                                                                                                                                                                    | Preservar status ilustrativo e proteção das prévias. Conferir destinos, totais existentes, estados e modais no aplicativo e no Atlas.                                                                                                                                            |
| A12 | **Em validação.** Integrações e ensaio de produção · A03 e A10              | Portar `POST /api/account-notifications` para uma função protegida do Supabase ou integração serverless equivalente, preservando o contrato. Conferir fila, autenticação entre serviços, tentativas, deduplicação e transporte de e-mail. Preparar hospedagem, configuração, cabeçalhos, arquivos estáticos e regras de encaminhamento. Referências em `src/features/account-notifications/`, `netlify.toml`, `next.config.ts` e `supabase/templates/`. | Ensaiar a prévia com configurações próprias, sem envio a destinatários reais. Verificar persistência da sessão, encaminhamento de `/auth/*` e `/api/*`, renovação de sessão, links diretos, ausência de cache privado e capacidade de retorno ao artefato anterior.              |
| A13 | Paridade e virada pública · A01–A12                       | Conferir as 32 páginas, três rotas de retorno de autenticação e um receptor, mais layouts, estados, modais, integrações e documentação. Publicar com autorização e manter referência ao último deploy Next.js para retorno.                                                                                                                                                                                                                             | Aprovar builds e suítes aplicáveis, conferir a prévia e depois verificar no site público os fluxos críticos. Se falharem sessão, autorização, escrita principal ou entrega de integração, retornar ao deploy anterior e conferir a recuperação.                                  |
| A14 | Arquivamento do Next.js · A13 | Após a verificação pública, preservar a referência visual legada em `arquivo/nextjs/` e separar os utilitários, ativos, scripts e testes ainda usados pelo Angular. | Cópia consultável com commit e deploy de referência. Instalação, tipos, build, testes e publicação Angular independentes do código Next.js arquivado. |

## Contratos que evitam retrabalho

- **Perfil e dados.** Usar Supabase Auth para consultar e atualizar o nome da própria conta. Preservar validação do nome e proteção contra troca de conta durante a edição. Usar as operações de banco e políticas existentes para os demais domínios.
- **Sessão e operações protegidas.** O navegador usa chave publicável e sessão do usuário. Verificar políticas por linha e permissões de execução das funções do banco. Manter credenciais administrativas e de e-mail em funções protegidas. Ensaiar confirmação, recuperação, login social e renovação da sessão. [Políticas do Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security) · [Segredos nas funções](https://supabase.com/docs/guides/functions/secrets)
- **Navegação contínua.** Usar Angular Router com links internos e manter cabeçalho, menus e navegação móvel montados. Precarregar rotas frequentes conforme o custo observado e carregar os dados na área da rota, com feedback local em rede lenta. Cancelar ou ignorar respostas de rotas e contas anteriores. A primeira abertura, um recarregamento manual e os retornos externos de autenticação têm carregamento inicial.
- **Aceite de navegação.** Em desktop e celular, conferir links internos e voltar/avançar sem nova requisição de documento. Em rede lenta, manter a estrutura principal visível, sem tela em branco ou carregador global. Validar abertura direta, foco, sessão expirada e autorização. [Angular Router](https://angular.dev/guide/routing/navigate-to-routes)
- **Paridade por entrega.** Antes de portar cada tela, conferir o Atlas vivo, ficha e contrato. Reutilizar as suítes existentes de Playwright, inclusive as autenticadas, e as verificações de banco e de bloqueios conforme a área. Comparar desktop e celular, guardar evidências quando aplicável e atualizar Atlas e registro. Preservar os roteiros de caixa preta existentes.
- **Virada e retorno.** Registrar os artefatos, as configurações e os caminhos que precisam mudar juntos. Evitar migrações destrutivas do banco. Conferir na prévia a compatibilidade da sessão entre as duas aplicações e planejar nova autenticação na virada se a continuidade da sessão exigir mudança de formato.

**A09 verificada localmente:** [registro e evidências](../registros/registro-v4.0.0-alpha.9-2026-11-15-imp-agenda-angular-fun-calendario-e-eventos.md). Calendário, navegação, criação, edição, remoção e respostas usam o contrato vigente, sem nova migração.

**Entregas localmente verificadas:** A10 e A11. [Registro da retomada](../registros/registro-v4.0.0-alpha.10-2026-11-17-imp-validacao-angular-fun-conta-navegacao-e-integracoes.md). [Registro A11](../registros/registro-v4.0.0-alpha.9-2026-11-16-imp-previas-angular-fun-navegacao-e-totais.md). A12 prepara a configuração, as funções e o [ensaio hospedado](../../../apps/web/netlify/README.md), com rascunho verificado no Netlify e prova local da fila completa. [Registro do ensaio](../registros/registro-v4.0.0-alpha.10-2026-11-17-imp-ensaio-angular-fun-rascunho-netlify-e-fila.md). [Registro A12](../registros/registro-v4.0.0-alpha.9-2026-11-16-imp-previa-hospedada-fun-integracoes-angular.md).

### Execução da A08

1. Conferir no Atlas detalhe, registro, histórico, período, revisão e encerramento, inclusive o contexto legado sem duração.
2. Reutilizar Angular, os validadores do aplicativo e o Supabase. As operações de ciclo e revisão permanecem no banco. A proteção do registro usa a mesma trava do acordo para comparar a versão antes da escrita. Um novo servidor ou biblioteca de formulários duplicaria responsabilidades para este recorte.
3. Conferir com duas contas o ciclo, o aceite após revisão, o registro sob versão concorrente, o histórico atual e legado e a leitura após encerramento.

### Execução da A07

1. Conferir Acordos (18), conferência (22), participação (23), detalhe (24) e esboço de Essência (36).
2. Reutilizar Angular, os validadores do aplicativo e o cliente Supabase. As funções existentes já controlam vínculo, versão e contagem. Uma biblioteca de estados ou um novo servidor duplicaria responsabilidades, dependências e operação para duas rotas.
3. Validar que conferir e editar não gravam, publicar deixa participação pendente e aceitar ou recusar afeta somente a própria conta. Conferir também falha de envio, mudança de versão entre sessões, lista móvel e registros anteriores.

### Execução da A06

1. Conferir Início (13), Saída (71) e Integrantes (73). Preservar o redirecionamento de Pessoas para o modal do Início.
2. Manter os formulários Angular junto à área do Núcleo e reutilizar as funções do Supabase. Angular e Supabase já atendem à interface e às regras administrativas. Uma nova camada de servidor ou dependência de interface duplicaria controles, manutenção e operação.
3. Conferir, com duas contas, sincronização, aceite da nomeação, saída e encerramento com confirmação do nome. Validar os papéis, a preservação do histórico e o redirecionamento no banco e no navegador.

### Execução da A01

1. Isolar o Angular CLI e o TypeScript 6.0 em `apps/web`, com lockfile próprio. Reutilizar Node, npm e Playwright do projeto. A prévia roda em outra porta; o build da raiz continua Next.js.
2. Servir a configuração pública do Supabase local somente no modo de desenvolvimento. Usar entrada por e-mail/senha apenas como suporte de teste; cadastro, callbacks e layout completo ficam em A02/A03.
3. Portar o modal Dados da conta e a edição de nome na rota `/configuracoes/conta`. Conferir identidade pelo Supabase Auth e vincular a gravação à mesma credencial verificada, preservando outros metadados.
4. Validar build e tipos dos dois pacotes, rodar Playwright em desktop e celular contra Supabase local, comparar o recorte com o Atlas e manter a cobertura 3.x separada da prévia.

### Execução da A02

1. Manter a estrutura no componente raiz do Angular e trocar o conteúdo com Angular Router. Usar Início provisório e Conta para verificar o histórico até as rotas seguintes chegarem.
2. Portar paleta, tipografia existente, barra lateral e barra móvel com Mais. Usar diálogos nativos com fechamento centralizado, sem introduzir Angular Material ou CDK (kit de componentes).
3. Carregar Conta sob demanda. Mostrar carregamento e falha dentro do conteúdo. O link de recuperação reabre a rota em outro documento, pois o navegador pode guardar a falha de importação no documento atual.
4. Verificar foco, navegação por teclado, gesto externo, diálogos aninhados e regressões de Conta em desktop e celular. Documentar a representação separada do Next.js no Atlas.

### Execução da A03

1. Portar Conta e Boas-vindas com a marca existente. Reutilizar validação de entrada e destinos permitidos da linha Next.js.
2. Usar Supabase Auth com PKCE (prova de posse de chave temporária) para confirmação e Google. Em recuperação, guardar somente o verificador entre abas e validar a credencial numa sessão em memória, separada da sessão normal.
3. Usar a origem local autorizada para conferir a caixa de e-mails e os retornos. Google permanece condicionado à configuração do provedor no ambiente da prévia.
4. Preservar destinos futuros, incluindo convite, com indicação de disponibilidade na prévia. A04/A05 ativam os módulos nesses endereços.

### Execução da A04

1. Proteger as telas de Núcleos com a sessão verificada. Consultar lista e resumo com as mesmas políticas do Postgres usadas pelo Next.js.
2. Reutilizar o catálogo, restaurar o tipo pela URL e manter nome e propósito apenas na página. Vincular cada confirmação a um identificador único e usar a mesma confirmação ao repetir após falha de resposta.
3. Guardar a seleção por conta após leitura autorizada e reconferir o vínculo antes de oferecer o atalho de retorno.
4. Verificar a interface, o banco e a recuperação de falhas. Reservar a gestão de convites para A05 e a gestão de integrantes para A06.

### Execução da A05

1. Substituir a confirmação provisória da A04 pelo convite inicial. Reutilizar rota, sessão e operações do banco.
2. Portar consulta ao convite e aceite explícito. Manter código em memória e guardar somente destinos permitidos durante autenticação.
3. Portar filtros, paginação, preparo e confirmação de revogação. Carregar apenas identificadores e datas na listagem.
4. Verificar com duas contas, incluindo código inválido, adiamento, resposta incerta, revogação antes e depois do aceite e acesso por endereço direto.
