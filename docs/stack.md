# Projeto Nós — stack e arquitetura

**Revisão de 21/11/2026.** Inventário da branch `codex/migracao-angular`, código inventariado na revisão `6f718b7`. A revisão inventariada usava `4.0.0-alpha.29`. Consulte o [estado atual](andamento/estado.md) para a versão vigente. A estrutura de destino segue as decisões de 21/11/2026, alinhada às tecnologias já previstas no [plano de migração](andamento/planos/migracao-angular.md).

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

Decisões aprovadas em 21/11/2026. A numeração corresponde às dez perguntas de arquitetura. A execução segue os aceites da migração e das etapas de produto.

| Decisão | Direção aprovada | Momento e critério |
| --- | --- | --- |
| 1 · Primeiro serviço | Angular consulta no NestJS os dados básicos de um Núcleo. | Migração 3. Conferir integrante autorizado, outra conta, sessão expirada e serviço indisponível. |
| 2 · Identidade | Manter Supabase Auth. Reabrir emissão própria de tokens somente com requisito concreto. | Migração 3–4. Conferir renovação, recuperação, saída e isolamento do navegador até o banco. |
| 3 · Organização | Introduzir Nx preservando scripts npm, dois lockfiles, pastas atuais e artefato publicado. | Migração 2. Comparar tarefas e ensaio Netlify. Avaliar unificação de dependências separadamente. |
| 4 · Interface | Referência Next.js para ícones, prévias de temas, foco, teclado, movimento e celular. Avaliar CDK por componente e Day.js por lacuna de datas. | Migração 1. Apresentar diferenças intencionais com capturas lado a lado. |
| 5 · Atualização automática | Todo dado mutável exibido deve acompanhar mudanças autorizadas sem recarga manual. Usar WebSocket no NestJS, começando pela resposta ao convite da Agenda. | Migração 5 para o canal. MVP e Continuidade para cobertura das telas existentes, aceite de cada módulo novo e central de notificações na etapa 11. |
| 6 · Plataformas | PWA primeiro, Android em aparelho real depois e iOS em seguida. | Continuidade 13. A PWA pode começar após estabilizar a web. Validar sessão e serviços antes do pacote nativo. |
| 7 · Sem rede | Exibir estrutura pública, informar indisponibilidade e permitir tentar novamente. Armazenar apenas recursos estáticos públicos. | Piloto PWA. Conferir atualização, retorno da rede e troca de conta. Dados privados ou gravações offline exigem decisão específica. |
| 8 · Custo | Orçamento permanente de R$ 0 para serviços, automação, hospedagem e distribuição. Preservar o Netlify dentro da gratuidade. | Antes de adotar cada serviço, comparar alternativas gratuitas por cotas, suspensão, excedentes e adequação. Se houver risco de cobrança sem bloqueio ou faltar opção compatível, manter piloto local ou adiar a etapa. |
| 9 · Qualidade | Documentar campos e erros da primeira rota e validar Angular, servidor e banco antes de expandir a API. Reusar Playwright, testes Node e pgTAP. | Migração 2–3. GitHub Actions dentro da cota gratuita. Avaliar OpenAPI no primeiro contrato, Vitest ou Jest na primeira necessidade unitária e ESLint/Prettier em mudança isolada. |
| 10 · Busca pública e desktop | Adiar a avaliação de renderização no servidor (SSR) e aplicativo de computador (Electron ou Tauri). | Continuidade, sem data. Retomar diante de uma página pública com necessidade de descoberta ou tarefa específica de desktop. |

## 5. Sequência de implementação

| Etapa | Entrega | Critério para avançar |
| --- | --- | --- |
| 1. Estabilizar a web | Concluída e validada conforme confirmação do usuário em 26/11/2026. | [Registro do fechamento](andamento/registros/registro-v4.0.0-2026-11-26-imp-estabilizacao-web-fun-migracao-angular.md). |
| 2. Introduzir Nx | Reproduzir os comandos e o artefato. Manter o arquivo Next.js fora do grafo de tarefas e usar GitHub Actions dentro da cota gratuita para automatizar verificações. | Depende da fase 1. Conferir o mesmo artefato no ensaio Netlify. Eventual unificação de lockfiles tem entrega própria. |
| 3. Pilotar NestJS | Ler os dados básicos de um Núcleo. Documentar campos, erros e como a identidade chega ao banco. Integrar uma chamada Angular e extrair contrato se houver uso real nas duas aplicações. | Verificar usuário autorizado, sessão expirada e outra conta ou Núcleo, preservando o resultado e a autorização PostgreSQL. Começar localmente e conferir as condições gratuitas antes de hospedar. |
| 4. Validar identidade | Manter Supabase Auth. | Conferir renovação, revogação, recuperação, expiração e isolamento com a API. |
| 5. Pilotar WebSocket | Atualizar a resposta ao convite da Agenda pelo NestJS após validar a identidade. | Sem recarga em duas sessões, inclusive após reconexão. Impedir entrega após perda de vínculo e acompanhar a expansão na guia MVP e Continuidade. |
| 6. Validar PWA | Depois da fase 1, definir instalação, atualização e limites offline. Pode avançar junto à API e precede o Android. | Testar instalação, recuperação de atualização com falha e privacidade entre contas. O piloto usa cache de recursos públicos. |
| 7. Pilotar Capacitor | Depois da fase 1, validar os contratos de sessão e os serviços usados pelo pacote. Empacotar o Angular em Android e depois em iOS. | Conferir em aparelhos reais links de retorno, permissões, ausência de rede e distribuição interna. Começar pelo aceite da PWA e verificar distribuição gratuita por plataforma. |

Para estudo e implementação, usar uma entrega real por etapa. Primeiro, mapear o caminho da rota Angular até o PostgreSQL. Depois, reproduzir o build no Nx e implementar a primeira rota NestJS com um teste de isolamento. Na etapa de aplicativos, usar uma prova de conceito de login e retorno por link antes de integrar recursos nativos.

Após o piloto da Agenda, registrar a cobertura de cada fluxo no [plano de MVP e Continuidade](andamento/planos/mvp.md). A central de notificações entra na etapa 11 e a distribuição móvel na etapa 13, conforme a disponibilidade de um caminho gratuito.

O [plano de migração](andamento/planos/migracao-angular.md#ordem-de-implementação) detalha as dependências, e a [guia Migração do Atlas](wireframes/atlas/index.html#migracao) apresenta os mesmos marcos. O [estado](andamento/estado.md) registra o próximo passo e a versão do aplicativo. Revisões exclusivamente documentais mantêm a versão do produto.
