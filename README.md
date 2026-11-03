# Nós — plataforma para cultivar vínculos

Aplicação web full stack para organizar espaços compartilhados, construir acordos e acompanhar práticas de cuidado com participação voluntária. O projeto reúne interface responsiva, autenticação, regras de negócio no servidor e no banco, testes automatizados e documentação de produto.

**[Acessar o aplicativo no Netlify](https://noslife.netlify.app)** · **[Tela de acesso](https://noslife.netlify.app/conta)** · **[Código-fonte](src)** · **[Documentação](Documentacao_Projeto_Nos/_andamento/estado.md)**

**Versão do código: 3.6.2.** Projeto em evolução, com fluxos centrais implementados e áreas futuras identificadas como esboços. O endereço hospedado pode apresentar uma versão diferente do repositório; a revisão deste README não certifica um novo deploy.

## O problema e a proposta

Na convivência de casais e famílias, desejos como passar mais tempo juntos, dividir responsabilidades ou demonstrar cuidado podem permanecer implícitos. Quando as expectativas não são conversadas e os combinados se perdem na rotina, fica difícil saber o que cada pessoa espera, o que foi aceito e o que precisa ser revisto.

O **Nós** nasce para apoiar esse caminho entre a intenção e a prática. A plataforma organiza pessoas em **Núcleos**: espaços compartilhados com um propósito, nos quais é possível propor acordos, escolher participar, registrar momentos da prática e organizar encontros na agenda. O histórico permite retomar o que foi combinado e revisar os termos conforme as necessidades de quem participa.

Por exemplo, o desejo de ter mais tempo de qualidade em família pode se transformar em uma proposta de encontro semanal. Cada pessoa decide se quer participar, o encontro pode ser organizado na agenda e os registros ajudam a trazer experiências concretas para a próxima conversa sobre o acordo.

**A autonomia de cada pessoa faz parte da solução.** Administrar um Núcleo não permite aceitar acordos por outra pessoa; mudanças de termos exigem novo aceite, e a saída de alguém não cancela os acordos de quem permanece. O objetivo é oferecer estrutura para o diálogo e a construção de hábitos de cuidado, respeitando a liberdade de aceitar, recusar, rever ou encerrar a própria participação.

A versão 3.6.0 redistribui a antiga guia Pessoas: integrantes e administração em modal no Início; nome e propósito editáveis separadamente; convites, saída e encerramento na Conta, no perfil desktop e em Mais no celular. Entrada por código permanece em Seus Núcleos. [Contrato e validação](Documentacao_Projeto_Nos/_andamento/funcionalidades/organizacao-nucleo.md). A nova migração de identidade precisa existir no banco de destino antes de publicar este código.

## Funcionalidades implementadas

| Área | O que existe no aplicativo |
| --- | --- |
| Acesso e conta | Cadastro, login, confirmação de e-mail, recuperação de acesso e encerramento de sessão; rotas privadas com validação no servidor. |
| Núcleos | Criação com tipo, nome e propósito, listagem dos vínculos da pessoa, seleção do espaço e início com dados reais. |
| Convites | Geração e gestão de convites, entrada por código, prévia antes do aceite e revogação de convites. |
| Administração | Múltiplos administradores, nomeação com aceite, gestão de participantes, saída individual e encerramento do Núcleo com preservação do histórico armazenado. |
| Acordos e Hábitos | Propostas, respostas individuais, gestão do período de teste, registro de momentos, histórico, revisão de termos e encerramento. |
| Agenda compartilhada | Calendário mensal com navegação contínua de anos, grade semanal no desktop e lista em telas menores; criação, edição, remoção e respostas de participação. |
| Perfil e preferências | Edição do próprio nome, nove temas visuais com preferência salva por conta, navegação contextual e totais pessoais. |
| Exclusão da própria conta | Confirmação explícita, remoção da identificação e do acesso, com tratamento do histórico compartilhado. |
| Interface | Navegação para computador e celular, componentes compartilhados, estados de carregamento, vazio, erro e sucesso e microinterações com tratamento de movimento reduzido. |

A versão 3.5.0 também consolida propostas sem seleção de categoria, contagens de respostas atualizadas a cada três segundos, cartões de Núcleos com integrantes e correções de nomes/títulos longos e área segura móvel. A versão mostrada na lateral e em Mais vem de `package.json`; conferir manifestos e versão renderizada faz parte de cada publicação. A nova função de contagens exige a migração `20261103122309_agreement_response_counts.sql` no banco de destino; a validação desta entrega comprova somente sua aplicação local. Evidências, matriz mobile/desktop e limites estão no [registro de validação](Documentacao_Projeto_Nos/_andamento/registros/registro-v3.5.0-2026-11-03-05-imp-validacao-fun-paridade-e-rastreabilidade.md).

As funcionalidades possuem diferentes evidências locais e hospedadas, registradas na documentação. Esta tabela descreve a implementação; não equivale à aprovação integral do piloto ou de todos os testes manuais.

### Percurso para conhecer o produto

1. Abra a [tela de acesso](https://noslife.netlify.app/conta). Não há credenciais públicas de demonstração neste README.
2. Use uma conta própria e conclua a confirmação de e-mail quando solicitada.
3. Crie um Núcleo ou entre com um convite válido.
4. Explore acordos, práticas e agenda; para avaliar a participação compartilhada, utilize duas contas próprias de teste.
5. Consulte Aparência e Dados da conta para conhecer as preferências e a edição de perfil.

Para uma avaliação reproduzível sem depender do envio externo de e-mails, use o ambiente local descrito abaixo.

## Stack tecnológica

As versões dos pacotes abaixo são as fixadas no `package-lock.json`. Os intervalos permitidos estão no `package.json`.

| Camada | Tecnologia | Versão / uso |
| --- | --- | --- |
| Execução | Node.js | Requisito `>=24.15.0`; `.nvmrc` indica a família 24. |
| Framework web | Next.js | 16.3.6, com App Router. |
| Interface | React e React DOM | 19.3.0. |
| Calendário mensal | React Day Picker | 9.14.0, localização em português e janela de anos dinâmica. |
| Linguagem | TypeScript | 7.0.2, com verificação estrita. |
| Estilos | Tailwind CSS | 4.3.3, combinado com CSS próprio. |
| Processamento de estilos | `@tailwindcss/postcss` | 4.3.3. |
| Ícones | Lucide React | 1.48.0. |
| Backend e autenticação | Supabase | Auth, acesso aos dados e PostgreSQL hospedado/local. |
| Cliente Supabase | `@supabase/supabase-js` | 2.117.2. |
| Sessão no servidor | `@supabase/ssr` | 0.12.7, integração com cookies e renderização no servidor. |
| Banco de dados | PostgreSQL, SQL e PL/pgSQL | Modelo relacional, funções, transações, migrações e políticas de acesso. A versão do servidor depende do ambiente. |
| Ferramenta de banco | Supabase CLI | 2.118.0, fixada nas dependências de desenvolvimento. |
| Testes de navegador | Playwright Test | 1.63.0, com projetos desktop e emulação de celular. |
| Testes de banco | pgTAP | Verificações SQL de funções, permissões e regras de negócio. |
| Hospedagem | Netlify | Configuração de build versionada em `netlify.toml`. |
| E-mails | Supabase Auth + SMTP Brevo | Integração documentada para autenticação e modelos HTML personalizados. |
| Desenvolvimento local | Docker Desktop, Supabase Studio e Mailpit | Serviços locais, administração do banco e inspeção de e-mails de teste. |
| Dependências e versionamento | npm, Git e GitHub | Instalação pelo lockfile e histórico de alterações. |
| Automação | JavaScript e PowerShell | Scripts de operação, testes, verificações e capturas de interface. |

Também fazem parte das dependências de desenvolvimento: `@types/node` 26.6.2, `@types/react` 19.3.0 e `@types/react-dom` 19.3.0, para definições de tipos; e `@napi-rs/keyring` 2.1.2, utilizado na configuração operacional de e-mails para acessar credenciais do sistema. A versão de `@types/node` não determina a versão de execução do Node.js. SMTP significa protocolo de envio de e-mails; CLI significa interface de linha de comando.

## Arquitetura e decisões técnicas

O código da interface e do servidor é organizado no mesmo aplicativo Next.js, com funcionalidades agrupadas por domínio.

```text
Navegador — componentes React e estilos
    ↕
Next.js — páginas, componentes de servidor, ações e rotas HTTP
    ↕
Supabase Auth — identidade e sessão
PostgreSQL — dados, funções, transações e políticas de acesso
```

- **App Router e Server Components:** páginas e layouts organizados por rota, com leitura de dados no servidor e componentes interativos no navegador quando necessário.
- **Server Actions e Route Handlers:** operações de formulários no servidor e endpoints para retornos de autenticação, como confirmação e recuperação.
- **Sessões com cookies:** o proxy participa da renovação da sessão e verifica a identidade antes da renderização das páginas protegidas. As ações também conferem as condições de acesso.
- **Autorização no banco:** RLS (*Row-Level Security*, segurança por linha) e funções SQL restringem operações conforme vínculo e permissão; os controles visuais complementam essas verificações.
- **Regras transacionais:** RPC (*Remote Procedure Call*, chamada de procedimento remoto) permite executar funções do PostgreSQL a partir do servidor. Operações da agenda possuem verificações específicas de concorrência.
- **Evolução do esquema:** alterações de estrutura e permissões ficam registradas em migrações versionadas, separadas da configuração de ambiente.
- **Experiência consistente:** temas por conta, componentes compartilhados, estados explícitos e alternativas de movimento reduzido com `prefers-reduced-motion`.

Exemplos para revisão técnica: [integração Supabase](src/lib/supabase/server.ts), [proxy de sessão](src/proxy.ts), [ações de acordos](src/features/agreements/actions.ts), [distribuição dos eventos da agenda](src/features/calendar/calendar-lanes.ts) e [migrações](supabase/migrations).

## Qualidade e evidências de engenharia

O repositório inclui testes de comportamento com Playwright, jornadas autenticadas com backend local, testes SQL com pgTAP, verificações de tipos e scripts de comparação do aplicativo com o Atlas visual. Os testes de navegador contemplam computador e emulação de celular; isso não substitui testes em dispositivos físicos.

Evidências registradas em entregas anteriores:

| Evidência | Escopo e limite |
| --- | --- |
| [Consolidação da interface e perfil — 30/10/2026](Documentacao_Projeto_Nos/_andamento/registros/registro-v3.4.2-2026-10-30-imp-publicacao-github-fun-consolidacao-entregas.md) | Registro de tipos/build, 192 testes gerais e 12 autenticados aprovados naquela entrega. |
| [Auditoria de segurança — 30/10/2026](Documentacao_Projeto_Nos/_andamento/registros/registro-v3.4.2-2026-10-30-imp-auditoria-seguranca-fun-avaliacao-rigorosa.md) | 160 testes de banco e 70 públicos aprovados; seleção autenticada com 36 aprovações, 15 falhas e 1 ignorado. Achados e limitações permanecem documentados. |
| [Ambiente Supabase local](Documentacao_Projeto_Nos/_andamento/registros/registro-v3.3.0-2026-10-28-supabase-local.md) | Fluxos locais de cadastro, confirmação e recuperação, banco e e-mails de teste. |
| [Comparações visuais de conta e perfil](Documentacao_Projeto_Nos/wireframes/comparacoes/v3.3.1-2026-10-29-conta-perfil-tela_13-tela_66-tela_69/index.html) | Capturas históricas do aplicativo e do Atlas em computador e celular. Para visualizar a galeria HTML, abra-a localmente. |

Esses resultados pertencem às execuções e ambientes descritos nos registros. Não são uma nova execução das suítes nem devem ser somados como total único de testes. Os [testes de caixa preta](Documentacao_Projeto_Nos/_andamento/testes-caixa-preta/README.md) têm acompanhamento próprio e não recebem aprovação manual por inferência.

## Executar localmente

Execute os comandos na raiz deste repositório, onde estão `package.json` e `package-lock.json`.

### Pré-requisitos

- Node.js da família 24, a partir de 24.15.0, e npm.
- Docker Desktop em execução para utilizar o Supabase local.
- Git para obter e acompanhar o código.

### Aplicativo com banco e e-mails locais

```powershell
npm ci
npm run supabase:start
npm run dev:supabase
```

Na primeira inicialização, o Docker baixa os serviços e a CLI aplica as migrações ao banco local. O script `dev:supabase` obtém a configuração da CLI, injeta as variáveis somente no processo do aplicativo e prepara o segredo local de recuperação sem alterar `.env.local`.

| Serviço | Endereço local padrão |
| --- | --- |
| Aplicativo | [127.0.0.1:3001](http://127.0.0.1:3001) |
| Supabase Studio | [127.0.0.1:54323](http://127.0.0.1:54323) |
| E-mails de teste — Mailpit | [127.0.0.1:54324](http://127.0.0.1:54324) |

Crie contas próprias de teste; usuários do ambiente hospedado não são copiados. Consulte `npm run supabase:status` para verificar os serviços. `npm run supabase:stop` encerra o ambiente normalmente, preservando os volumes. Não utilize reset ou remoção de volumes no uso diário.

O ambiente local tem pendências de restrição de portas administrativas registradas na auditoria. Utilize-o em máquina e rede confiáveis, sem expor Studio, banco ou caixa de e-mails à internet.

### Aplicativo com um projeto Supabase configurado

Copie `.env.example` para `.env.local` e preencha os valores do seu ambiente:

| Variável | Finalidade |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave pública destinada ao aplicativo. |
| `APP_ORIGIN` | Origem do aplicativo; no desenvolvimento padrão, `http://127.0.0.1:3000`. |
| `AUTH_RECOVERY_SECRET` | Segredo exclusivo do servidor, com pelo menos 32 caracteres aleatórios, usado no fluxo de recuperação. |

Não use `service_role` como chave pública nem versione `.env.local`. O projeto Supabase precisa ter as migrações correspondentes; revise o destino antes de qualquer aplicação remota. Configure a origem e os retornos `/auth/confirm` e `/auth/recovery` no Auth. A operação dos modelos de e-mail está descrita em [supabase/templates/README.md](supabase/templates/README.md).

```powershell
npm run dev
```

Abra [127.0.0.1:3000](http://127.0.0.1:3000). Sem configuração válida do backend, as rotas privadas bloqueiam o acesso e não simulam persistência. Os scripts preservam a validação dos certificados e usam os certificados confiáveis do sistema; configurações particulares de proxy devem permanecer no ambiente local.

Execute o comando dentro da pasta `nos`, onde está o `package.json`. O script `dev` carrega `.env.local` antes de iniciar o Next.js diretamente: isso também disponibiliza o proxy ao Node.js e evita a falha de localização do pacote observada com `node --run` em caminhos com acentos no Windows.

Para executar uma construção de produção local, use `npm run build` e depois `npm start`. O comando `npm start` serve o último build; para acompanhar alterações nos arquivos, use `npm run dev`.

### Comandos de verificação

```powershell
npx playwright install chromium
npm run typecheck
npm test
npm run build
```

Com Docker e Supabase local em execução:

```powershell
npm run test:db
npm run test:calendar-locks
npm run test:authenticated
```

Os testes gerais utilizam a porta 3100 sem backend; a suíte autenticada utiliza a porta 3200 e dados temporários no Supabase local. Os executores separam as saídas de build para reduzir conflitos com o desenvolvimento. Não existe script de `lint` declarado atualmente.

## Estrutura do repositório

```text
src/
  app/                    Rotas, páginas, layouts e estados de navegação
  features/               Autenticação, Núcleos, acordos, agenda, conta e temas
  lib/supabase/           Integração de sessão e acesso ao Supabase
  shared/                 Componentes e utilitários compartilhados
  proxy.ts                Verificação de sessão e renovação de cookies
supabase/
  migrations/             Histórico do esquema, funções e permissões
  tests/                  Testes SQL
  templates/              Modelos HTML de e-mail
tests/                    Testes Playwright, incluindo jornadas autenticadas
scripts/                  Automação, verificações e capturas
Documentacao_Projeto_Nos/
  _andamento/             Contratos, planos, registros e continuidade
  brag/                   Contribuições com evidências e limites
  wireframes/             Atlas vivo e comparações visuais
```

## Documentação de produto e interface

O **Atlas vivo** é uma ferramenta própria em HTML, CSS e JavaScript para reunir desenhos, fichas de tela, navegação, estados e pendências. Ele diferencia o que está implementado do que é planejado e acompanha a evolução do produto. Para interagir com os arquivos HTML, abra-os em um navegador local; a visualização de código do GitHub não executa a ferramenta.

- [Atlas vivo](Documentacao_Projeto_Nos/wireframes/atlas/index.html), [guia de uso](Documentacao_Projeto_Nos/wireframes/GUIA.md) e [cobertura](Documentacao_Projeto_Nos/wireframes/COBERTURA.md).
- [Estado atual e próximos passos](Documentacao_Projeto_Nos/_andamento/estado.md) e [histórico de entregas](Documentacao_Projeto_Nos/_andamento/historico.md).
- [Plano do MVP — produto mínimo viável](Documentacao_Projeto_Nos/_andamento/planos/mvp.md).
- [Contrato de administração e participação](Documentacao_Projeto_Nos/_andamento/funcionalidades/administracao-participacao.md).
- [Registros técnicos por entrega](Documentacao_Projeto_Nos/_andamento/registros) e [contribuições documentadas](Documentacao_Projeto_Nos/brag/BRAG.md).

Os documentos conceituais das séries 1.x e 2.x preservam decisões e propostas históricas; suas edições não representam a versão do aplicativo. Para comportamento vigente, consulte o estado atual, os contratos correspondentes e o código.

## Evolução planejada e limites atuais

O percurso **Proposta → Hábito → Experiência → Essência** é a direção aprovada do produto. A progressão individual e os critérios de transição ainda precisam de adequação funcional; o quadro visual não comprova essa evolução implementada.

Nossa Árvore, Memórias, Conexões, Perfis, Manifesto e Cuidado possuem recortes ilustrativos ou planejados, identificados na interface. Uploads, integrações externas, notificações e inteligência artificial não devem ser inferidos desses esboços.

Há achados de segurança e pendências operacionais abertos, incluindo ajustes de testes autenticados, configuração de proteção local e comprovação de backup/restauração. Consulte a [auditoria de segurança](Documentacao_Projeto_Nos/_andamento/registros/registro-v3.4.2-2026-10-30-imp-auditoria-seguranca-fun-avaliacao-rigorosa.md) e o [estado atual](Documentacao_Projeto_Nos/_andamento/estado.md) para prioridades e evidências. A presença de RLS e testes não constitui certificação integral de segurança ou de lançamento.

Consulte o [histórico operacional](Documentacao_Projeto_Nos/_andamento/historico.md) e os registros versionados vinculados ao estado atual para acompanhar as entregas anteriores.
