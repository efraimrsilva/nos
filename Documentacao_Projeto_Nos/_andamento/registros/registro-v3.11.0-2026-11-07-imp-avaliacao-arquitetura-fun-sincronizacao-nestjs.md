# Registro — v3.11.0 — 2026-11-07 — Imp. de avaliação de arquitetura com Fun. de sincronização e NestJS

- Versão/status:3.11.0; avaliação concluída após publicação funcional, sem adoção de framework e sem incremento por mudança documental.
- Objetivo/contexto: usuário cogita NestJS para ampliar sincronizações entre usuários. Avaliação baseada no código atual, Context7 e documentação primária consultada em07/11/2026. Não houve instalação, protótipo, novo serviço ou benchmark.
- Estado verificado: Next16.3.6/React19.3.0, supabase-js2.117.2, Auth/Postgres/RLS e Functions do Netlify. Identidade usa um cliente no shell, setInterval3s, getUser e RPC de versão. Nome/propósito e nomes compartilhados participam do mesmo resumo. Refresh completo da árvore de servidor ocorre quando versão muda, preservando estado do navegador. Sem NestJS instalado.

## Recomendação e alternativas

**Recomendo manter a arquitetura atual e avaliar Supabase Realtime Broadcast para a próxima expansão relevante. Adiar NestJS até existir requisito de backend autônomo.** Essa é uma conclusão de adequação ao projeto, não um benchmark comparativo.

| Alternativa | Adequação ao pedido | Custo e consequência |
|---|---|---|
| Polling compartilhado atual | Atende atualização eventual, poucas áreas e tolerância a segundos | Requisições periódicas mesmo sem mudança; evitar um temporizador independente por módulo |
| Next.js + Supabase Realtime Broadcast | Próxima opção a avaliar para várias áreas compartilhadas e atualização mais imediata | Requer canais privados, autorização por vínculo, reconexão, controle de eventos e medição de quotas; preserva infraestrutura principal |
| Next.js + serviço NestJS | Útil quando API/serviço independente, coordenação de processos/integracões e protocolos próprios forem requisitos concretos | Outro deploy/runtime, autenticação e autorização integradas, logs, operação/recuperação e escala; benefícios precisam justificar manutenção adicional |

NestJS é framework de backend: módulos/serviços e gateways podem organizar WebSockets, mas o projeto ainda precisa implementar emissão de eventos, escopo, autenticação, tratamento de reconexão e consistência. A documentação mostra suporte a Socket.IO e ws. Escala horizontal com Socket.IO requer planejamento de adaptador compartilhado e transporte/roteamento; Redis sozinho não resolve todos os cenários. Não é necessário adicionar Redis ou microserviços preventivamente.

A documentação Supabase recomenda Broadcast por escalabilidade/segurança para mudanças de banco, enquanto Postgres Changes é mais simples e menos escalável. Para o Nós, preservar canais privados por Núcleo ou conta, autorização por associação atual e payload mínimo de invalidação (“dados mudaram”); o destinatário relê dados pelo servidor/RLS. A aplicação de eventos não deve depender de nomes, nem aceitar um aviso do cliente como autorização. Nomes ficam no Auth: não expor auth.users/row completo em canais, nem emitir e-mail/metadados. Desenhar emissão confiável do servidor/banco, revogação de participação e reconciliação após reconectar antes da implementação.

## Volume e critérios de decisão

Estimativa teórica do código atual em estado estável: uma aba ativa faz aproximadamente20 verificações/minuto;100 abas simultâneas, cerca de2.000/minuto. São ciclos do temporizador, não usuários medidos ou chamadas totais: Auth, leitura da versão, eventos iniciais e atualizações de tela acrescentam operações. Abas ocultas/offline pausam. Esse exemplo explica por que aumentar temporizadores por área amplia trabalho; não demonstra saturação real.

Antes de escolher escala/contratação, medir abas e usuários simultâneos, mudanças por minuto, latência desejada/observada, consultas e custo. Realtime possui quotas de conexões/mensagens/canais por plano; não foi prometido custo menor. O runtime atual usa funções por requisição; adotar Nest como processo/gateway próprio exigiria planejar hospedagem e ciclo de vida, além de preservar as regras SQL existentes. Não concluí que qualquer pacote resolveria sincronização ao ser instalado.

Reavaliar NestJS quando houver demanda comprovada por API reutilizada por vários clientes, integrações complexas, workers/processamento duradouro, controle próprio de WebSockets ou equipe/domínio que precise de backend separado. Muitas sincronizações de dados compartilhados, isoladamente, favorecem avaliar eventos sobre a estrutura existente primeiro.

## Próximo passo sugerido, sem implementação autorizada

Escolher um fluxo real (por exemplo Acordos ou Agenda, quando solicitado), definir quem recebe qual evento e qual latência precisa, avaliar um canal privado de invalidação e medir. Prever reconciliação ao retomar conexão/aba, agrupamento de eventos para evitar refresh em rajada e alternativa de recuperação. Preservar silenciamento/consentimento do produto; sincronização de dados não autoriza criar chat livre nem notificações externas.

## Fontes primárias e limites

- [NestJS Gateways](https://docs.nestjs.com/websockets/gateways) — recursos de gateways; Context7 também consultado na revisão11.0.0 da documentação, sem impor versão futura ao projeto.
- [NestJS Adapters](https://docs.nestjs.com/websockets/adapter) — adaptadores e escala com várias instâncias.
- [Supabase: mudanças no banco](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes) — Broadcast/Postgres Changes e recomendação oficial.
- [Supabase: autorização](https://supabase.com/docs/guides/realtime/authorization) — canais privados/políticas.
- [Supabase: limites](https://supabase.com/docs/guides/realtime/limits) — quotas por plano, sem cotação financeira nesta avaliação.
- [Netlify Functions](https://docs.netlify.com/build/functions/overview/) — modelo de execução atual; não foi adotado um servidor persistente.

Arquivos relacionados: package.json, netlify.toml, src/features/nuclei/components/nucleus-identity-sync.tsx, identity-actions.ts e identity-version.ts. Alterações desta etapa: este registro, estado/histórico e fechamento da publicação. Fontes conferidas e links revisados; sem testes/build por documentação. Próximo passo depende de nova solicitação de implementação.
