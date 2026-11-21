# Projeto Nós — stack e arquitetura

**Revisão de 21/11/2026.** Inventário da branch `codex/migracao-angular`, revisão `6f718b7`. O código local está na versão `4.0.0-alpha.29`. A estrutura de destino é uma proposta para discussão, alinhada às tecnologias já previstas no [plano de migração](andamento/planos/migracao-angular.md).

O Nós ajuda pessoas a cultivar vínculos em Núcleos privados por meio de convites, acordos, hábitos e agenda compartilhada. A web responsiva é a primeira plataforma de entrega. O objetivo da etapa móvel é reaproveitar a interface Angular e validar, em cada dispositivo, o que depende de permissões, sessão, navegação ou integração nativa.

## 1. Stack verificada

| Área | O que existe hoje | Evidência |
| --- | --- | --- |
| Frontend | Angular **22.2.6**, Angular Router **22.2.6**, TypeScript **6.0.3** e RxJS **7.8.2** no lockfile. A interface usa HTML, CSS, componentes próprios e Signals. A aplicação é renderizada no navegador. | [Manifesto web](../apps/web/package.json) · [Lockfile web](../apps/web/package-lock.json) · [Configuração Angular](../apps/web/angular.json) |
| Estilos | Tailwind CSS **4.3.3** com PostCSS, utilitários selecionados e estilos do projeto. A versão Angular preserva o CSS de componentes, as variáveis de tema e o layout responsivo. | [Lockfile da raiz](../package-lock.json) · [Estilos globais](../apps/web/src/styles.css) |
| Execução e pacotes | Node.js **24**, com mínimo **24.15** para o ambiente web, e npm. A raiz e `apps/web` têm instalação e lockfile próprios. A web declara npm **11.11.1**. | [Manifesto da raiz](../package.json) · [Manifesto web](../apps/web/package.json) |
| Sessão e dados | Supabase Auth, cliente JavaScript **2.117.2** e PostgreSQL. O navegador usa a chave pública e a sessão da pessoa. Políticas por linha (RLS) e funções chamadas por procedimento remoto (RPC) aplicam permissões e operações transacionais. Google depende da configuração do provedor no ambiente. | [Acesso Angular](../apps/web/src/app/auth/access-auth.ts) · [Acesso a dados](../apps/web/src/app/nuclei/nuclei-data.ts) · [Migrações](../supabase/migrations/) |
| Integrações de servidor | Node.js e Nodemailer **10.3.1**. Adaptadores Netlify expõem `/api/problem-report` e `/api/account-notifications`. O processamento está em `apps/web/server`. Credenciais de servidor ficam no ambiente protegido. | [Servidor](../apps/web/server/) · [Funções](../apps/web/netlify/functions/) · [Netlify](../netlify.toml) |
| Atualização entre sessões | Alguns recortes fazem consultas periódicas, por exemplo para identidade do Núcleo e contagens de Acordos. | [Identidade](../apps/web/src/app/nuclei/nucleus-identity-sync.ts) · [Contagens](../apps/web/src/app/agreements/agreement-counts.ts) |
| Qualidade e operação | Playwright **1.63.0** em computador e celular, testes de integração com `node --test`, verificações PostgreSQL com pgTAP, Supabase CLI **2.118.0** e Docker para o ambiente local. Git e GitHub versionam o código. A configuração Netlify publica o build web e mantém as rotas de integração antes do fallback da aplicação. | [Scripts](../package.json) · [Playwright](../playwright.angular.config.mjs) · [Testes de banco](../supabase/tests/) · [Roteiro de publicação](../apps/web/netlify/README.md) |

Em 21/11/2026, a página pública de Conta retornou HTTP 200 com a raiz da aplicação e os arquivos JavaScript compilados do Angular. Essa conferência foi da página pública. Sessão autenticada, revisão publicada, banco hospedado e recebimento externo de e-mail exigem evidências próprias. [Página pública de Conta](https://noslife.netlify.app/conta) · [Estado do projeto](andamento/estado.md)

### Limites do produto

- Conta, Núcleos, convites, participantes, agenda e acordos têm implementação local. O fluxo de acordos preserva consentimento individual, versões dos termos e histórico. Use o [contrato do modelo Proposta, Hábito e Essência](andamento/funcionalidades/fluxo-proposta-habito-essencia.md) e o [Atlas vivo](wireframes/atlas/index.html) para delimitar o que está disponível.
- Memórias, perfis afetivos, Essência e outras áreas têm recortes demonstrativos ou planejados. Os **avisos operacionais por e-mail sobre contas** têm finalidade distinta de uma futura **central de notificações para participantes**.
- No frontend, preservar layout próprio para teclado e toque, foco nos diálogos, estados de carregamento e erro, contraste e preferência por movimento reduzido. No backend e no banco, preservar a autorização por conta e Núcleo em toda consulta ou alteração.

## 2. Diretório atual

Árvore resumida dos caminhos versionados que importam para a arquitetura.

```text
nos/
├── apps/web/
│   ├── src/
│   │   ├── app/                  # Rotas, telas e serviços Angular por área
│   │   │   ├── auth/
│   │   │   ├── nuclei/
│   │   │   ├── invitations/
│   │   │   ├── calendar/
│   │   │   ├── agreements/
│   │   │   ├── previews/
│   │   │   └── shared/
│   │   └── domain/               # Modelos e funções do recorte atual
│   ├── public/brand/
│   ├── server/                   # Processamento das integrações Node.js
│   ├── netlify/functions/         # Adaptadores de publicação
│   └── angular.json + package.json + package-lock.json
├── supabase/
│   ├── migrations/
│   ├── tests/ + tests-legacy/
│   ├── templates/
│   └── operacao/ + rollback/
├── tests/angular/
├── scripts/
├── docs/
│   ├── stack.md
│   ├── andamento/                # Estado, planos, contratos e registros
│   ├── regra-de-negocio/ + telas/
│   └── wireframes/ + brag/
├── arquivo/nextjs/               # Referência visual histórica
└── netlify.toml + package.json + package-lock.json + README.md
```

O Angular já agrupa funcionalidades em `apps/web/src/app`. Mantenha `app.routes.ts`, as áreas existentes, `public/brand` e `scripts` como pontos de entrada. Extraia código de uma área quando houver um segundo consumidor ou uma fronteira clara. Uma troca de nomes como `app/agreements` para `app/features/agreements` deslocaria arquivos e imports sem alterar essa fronteira.

## 3. Estrutura proposta para todo o projeto

Os caminhos marcados como futuros entram quando a entrega correspondente tiver um consumidor e testes. Os demais permanecem nos locais atuais.

```text
nos/
├── apps/
│   ├── web/                      # Angular, recursos e integrações web atuais
│   │   ├── src/app/ + src/domain/
│   │   ├── public/
│   │   └── server/ + netlify/     # Permanecem enquanto atendem a publicação atual
│   ├── api/                      # Futuro · NestJS
│   │   └── src/
│   │       ├── main.ts
│   │       └── modules/          # Começa com o módulo do primeiro fluxo
│   └── mobile/                   # Futuro · Capacitor, reaproveita o build web
│       ├── capacitor.config.ts
│       ├── android/              # Na entrega Android
│       └── ios/                  # Na entrega iOS
├── libs/
│   └── contracts/                # Futuro · contratos que web e API realmente usam
├── supabase/                     # Migrações, testes, templates e operação de dados
├── tests/angular/                # Jornadas web e verificações integradas existentes
├── scripts/                      # Build, desenvolvimento e verificações operacionais
├── docs/                         # Stack, decisões técnicas, regras e Atlas
├── arquivo/nextjs/               # Referência fora do build ativo
├── .github/workflows/            # Futuro · automação de verificações
├── nx.json                       # Futuro · orquestração e grafo de tarefas
└── netlify.toml + package.json + README.md
```

- **Web.** Manter o artefato esperado pelo Netlify em `apps/web/dist/nos-web/browser` na primeira transição. O shell de navegação e os componentes visuais continuam em `apps/web`. Uma biblioteca `libs/ui` passa a fazer sentido se outro aplicativo consumir componentes Angular independentemente. O Capacitor reutiliza a própria web compilada.
- **API.** Começar em `apps/api` com um módulo delimitado. O NestJS pode organizar entradas, casos de uso e integrações. Operações dependentes de atomicidade ou autorização no banco continuam protegidas no PostgreSQL.
- **Contratos.** Compartilhar formatos de entrada, saída e erros quando os dois lados precisarem deles. Código privilegiado, políticas SQL e detalhes de infraestrutura permanecem no servidor ou em `supabase/`. Considerar uma biblioteca de domínio apenas para regras puras com mais de um consumidor.
- **Mobile.** Proposta de manter o empacotamento em `apps/mobile`, com os projetos nativos sob a mesma pasta. Na prova de conceito, definir a etapa que copia o build web, com `index.html`, para o `webDir` configurado. As chamadas que hoje usam `/api/*` no mesmo domínio da web precisarão de configuração de origem ou de URL HTTPS para o contêiner nativo. Validar retornos de autenticação, links de recuperação, armazenamento e limpeza de sessão, teclado, botão de retorno e comportamento sem rede. Android vem primeiro. Para compilar iOS, prever macOS com Xcode. [Instalação do Capacitor](https://capacitorjs.com/docs/getting-started) · [Configuração do Capacitor](https://capacitorjs.com/docs/config)

## 4. Divergências e decisões

| Tema | Ajuste em relação ao anexo | Decisão para a próxima etapa |
| --- | --- | --- |
| Backend e identidade | NestJS está previsto. A operação atual usa Supabase Auth, PostgreSQL e funções Netlify. No plano vigente, a decisão de identidade de longo prazo segue em aberto. | Começar o primeiro fluxo NestJS com a sessão atual do Supabase. Decidir a emissão própria de tokens depois de comparar renovação, revogação, recuperação, login social e isolamento de dados. |
| Nx e organização | O repositório ainda executa npm com dois lockfiles. As pastas `core/`, `features/`, `layouts/` e `routes/` da árvore original dariam uma nova organização à web existente. | Introduzir Nx com tarefas equivalentes antes de considerar uma instalação unificada. Manter os nomes e a estrutura da web na primeira etapa. A escolha de versão deve considerar Angular, TypeScript e Node em uso. [Adoção incremental do Nx](https://nx.dev/docs/kb/adding-to-existing-project) |
| Interface | Tailwind e CSS próprio já estão em uso. Angular CDK e Material são opções para necessidades específicas. | Avaliar CDK por componente e preservar a identidade do Nós. Considerar Day.js apenas se surgir uma lacuna que o tratamento de datas atual não resolva. |
| Tempo real | A consulta periódica já atende alguns casos. Os transportes em avaliação são WebSocket pelo NestJS ou Supabase Realtime. | Escolher um fluxo, definir latência, autorização, reconexão e recuperação e adotar um único canal para essa responsabilidade. |
| PWA, Android e iOS | Web responsiva está disponível. PWA (aplicação web progressiva), instalação, cache controlado e os aplicativos nativos são entregas futuras. | Definir se a PWA vem antes ou em paralelo ao piloto Android. Na PWA, começar com recursos estáticos e definir por fluxo o comportamento offline e o tratamento de dados privados. |
| Hospedagem e automação | Netlify é o caminho configurado para a web e as funções atuais. GitHub Actions, hospedagem da futura API e pipeline nativo ainda precisam de definição. | Preservar a publicação web e decidir a hospedagem da API quando houver requisitos do piloto. Tratar assinatura e distribuição mobile como etapas próprias. |
| Qualidade e alternativas | Playwright, testes de integração Node e pgTAP já têm tarefas. Vitest ou Jest, ESLint, Prettier, OpenAPI e Swagger são avaliações futuras. SSR em páginas públicas, Electron ou Tauri dependem de uma necessidade de produto. | Escolher um executor unitário quando entrar a primeira área que o justifique. Adotar OpenAPI no primeiro contrato HTTP próprio se ajudar o consumo e a verificação da API. |

## 5. Sequência de implementação

| Etapa | Entrega | Critério para avançar |
| --- | --- | --- |
| 1. Estabilizar a web | Fechar a revisão transversal restante e as pendências de sessão e e-mail no ambiente hospedado, conforme o plano vigente. | Registrar o deploy conferido e a evidência de login, permissões, fluxos críticos e integrações. Validar o caminho de retorno antes de alterações de infraestrutura. |
| 2. Introduzir Nx | Mapear e reproduzir os comandos de desenvolvimento, tipos, build e testes. Conservar o caminho de publicação e manter o arquivo Next.js fora do grafo de tarefas. | Comparar comandos e artefato antes e depois. Conferir build Netlify em ambiente de ensaio. Tratar eventual unificação de lockfiles como passo distinto. |
| 3. Pilotar NestJS | Escolher um fluxo pequeno, preferencialmente uma leitura autenticada com operação existente. Documentar campos, erros e como a identidade chega ao banco. Integrar uma chamada Angular e extrair contrato se houver uso real nas duas aplicações. | Verificar usuário autorizado, sessão expirada e outra conta ou Núcleo, preservando o resultado e a autorização PostgreSQL. Escolher o primeiro recorte e a hospedagem antes de iniciar a implementação. |
| 4. Validar identidade e tempo real | Comparar o ciclo de sessão atual com a alternativa de tokens próprios. Selecionar um único fluxo para medir o ganho da atualização por eventos. | Confirmar renovação/revogação, reconexão, troca de Núcleo e ausência de eventos para quem está fora do vínculo. |
| 5. Entregar PWA e mobile por recorte | Definir o contrato offline e testar instalação e atualização da PWA quando priorizada. Empacotar o Angular no Capacitor, primeiro em Android e depois em iOS. | Conferir em navegador e aparelhos reais os fluxos suportados, links de retorno, permissões, ausência de rede e distribuição em ambiente de teste. |

Para estudo e implementação, usar uma entrega real por etapa. Primeiro, mapear o caminho da rota Angular até o PostgreSQL. Depois, reproduzir o build no Nx e implementar a primeira rota NestJS com um teste de isolamento. Na etapa de aplicativos, usar uma prova de conceito de login e retorno por link antes de integrar recursos nativos.

O [plano de migração](andamento/planos/migracao-angular.md) mantém os recortes e critérios da virada. O [estado](andamento/estado.md) registra o próximo passo e a versão do aplicativo. Revisões exclusivamente documentais mantêm a versão do produto.
