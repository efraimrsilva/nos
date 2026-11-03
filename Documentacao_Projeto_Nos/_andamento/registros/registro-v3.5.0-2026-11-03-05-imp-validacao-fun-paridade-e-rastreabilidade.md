# Registro — v3.5.0 — 2026-11-03 — Imp. de validação com Fun. paridade e rastreabilidade

- **Versão:** 3.5.0, consolidação MINOR de ajustes locais anteriores.
- **Status:** Concluído e validado localmente — publicação Git sob controle do estado canônico; sem certificação de deploy ou migração remota.
- **Objetivo/contexto:** documentar integralmente o conjunto ainda não commitado, verificar acesso equivalente no computador/celular e preparar o commit/push autorizados pelo usuário.
- **Requisitos:** verdade baseada no diff; preservar histórico e resultados de testes; sincronizar versão visível/manifestos/Atlas; distinguir validação local, publicação Git, migração remota e deploy.

## Unidades da entrega

1. [Acordos: proposta, respostas e convite administrativo](registro-v3.5.0-2026-11-03-01-imp-acordos-fun-propostas-e-respostas.md).
2. [Agenda: calendário mensal completo](registro-v3.5.0-2026-11-03-02-imp-agenda-fun-calendario-mensal.md).
3. [Núcleos, Início e navegação](registro-v3.5.0-2026-11-03-03-imp-nucleos-fun-cartoes-e-navegacao.md).
4. [Conta: senha, luzes, movimento e sinalização destrutiva](registro-v3.5.0-2026-11-03-04-imp-conta-fun-feedback-e-acessibilidade.md).

## Paridade e limites de apresentação

| Área | Computador | Celular | Contrato a preservar |
|---|---|---|---|
| Navegação | Barra lateral | Barra inferior e Mais | Mesmos destinos/contexto e acesso à versão |
| Acordos | Kanban e Painéis | Lista com diálogo de detalhe | Mesmas ações autorizadas e totais; sem progressão automática |
| Agenda | Calendário mensal e grade semanal acima de 900 pixels | Mesmo calendário mensal; lista semanal até 900 pixels | Criar, abrir, responder e gerir conforme permissão |
| Conta | Painel de perfil com seis seções; `/conta` completa | `/conta` completa | Ausência intencional do painel desktop não remove ações da página |
| Núcleos | Cartões 300 pixels a partir de 1200 pixels | Duas colunas 600–1199, uma até 599 | Link inteiro, integrantes reais, ações acessíveis |

A auditoria reproduziu nome de Núcleo com oitenta caracteres sem espaços deslocando ações do cabeçalho/breadcrumb e bloqueando clique, além de título longo de modal deslocando o corpo. São achados P2 (gravidade média), com correção e reteste sob responsabilidade do agente principal. O terceiro ajuste P2 é a reserva inferior do conteúdo móvel acompanhar a área segura da barra, exercitado com simulação de 34 pixels por variável de CSS (folha de estilos). `tests/authenticated/responsive-parity.spec.ts` protege a auditoria; registrar o resultado efetivo após execução, sem presumir aprovação. Casos NAV-AJU-005–007 preservam a cobertura manual futura. Dispositivos físicos, iPhone real e Safari não foram comprovados.

## Sessão e inicialização local

`tests/session-refresh.spec.ts` exercita proxy e biblioteca SSR (renderização no servidor) reais, com transporte Auth simulado, para renovar token expirado e devolver cookies. Os testes locais passaram na investigação informada na sessão, mas não houve correção de código de sessão neste conjunto e a causa de desconexão no ambiente hospedado não foi comprovada. Não apresentar esses testes como validação de expiração/revogação real no serviço remoto.

`scripts/dev.mjs` carrega `.env.local` antes de iniciar o Next.js com certificados do sistema e proxy do ambiente. Evita repassar `--env-file` ao processo do framework, que o propagaria em `NODE_OPTIONS`. Integra o script `dev` do manifesto. Esse ajuste de inicialização local é distinto de cookies e renovação de sessão. `dev:local` continua disponível. Alterações de seletores nos testes existentes acompanham cartões/nomes acessíveis; não devem ser contadas como funcionalidades novas.

## Versionamento, documentação e ferramentas

**Regra permanente:** conferir em cada release a atualização conjunta da versão central em `estado.md`, `package.json`, raiz/pacote principal do lockfile, README, identificação do Atlas e documentação vigente. Conferir também a versão renderizada pela lateral e pelo menu Mais, ligada ao manifesto em `application-shell.tsx`. Um build/servidor antigo pode exibir outra versão; publicar Git não comprova o deploy servido.

Contratos, inventário de modais, [roteiro novo](../testes-caixa-preta/ajustes-v3-5.md), [casos de Núcleos](../testes-caixa-preta/nucleos-layout.md), [histórico de resultados](../testes-caixa-preta/resultados.md) e [Brag](../../brag/BRAG.md) foram atualizados. Novos casos começam Não executados pelo usuário. Documentação conceitual e galerias históricas preservam suas versões; a sincronização do Atlas é parte da entrega e será registrada no fechamento. Ferramentas/consultas efetivamente usadas e limitações de disponibilidade devem constar no estado canônico; não se atribui instalação/consulta apenas por existir uma exigência geral.

## Evidência e fechamento pendente

Rodadas anteriores informadas na sessão, separadas da execução final: quatorze testes públicos de conta/luzes aprovados; sete verificações pgTAP de totais aprovadas; dezesseis cenários de ajustes móveis/calendário aprovados; onze de movimento/seleção aprovados e um ignorado por painel exclusivamente desktop. Não somar como uma única rodada nem afirmar cobertura adicional a partir dessas contagens. As seleções atuais de 22 e 26 testes foram interrompidas após dois casos aprovados; nenhuma dessas execuções aprova a suíte. A investigação identificou em `layout-navigation.spec.ts` espera pelo botão antigo Buscar uma área, removido anteriormente. O roteiro foi atualizado para acessar Agenda pela navegação real. Não há evidência de que o rastreamento tenha causado as esperas. A seleção de 26 testes foi reiniciada com o roteiro atualizado e permanece pendente.

**A completar após evidência:** comandos e resultados finais de tipos/build/testes/Atlas; situação da regressão de nome longo; galeria/comparação visual; revisão do diff; hashes de commit/push e correspondência remota. Não foram comprovados nesta documentação aplicação remota de `20261103122309_agreement_response_counts.sql`, novo deploy, testes em aparelho físico/Safari ou aprovação de caixa preta do usuário.

**Atualização de evidência desta consolidação:** `npm test -- account.spec.ts account-lights.spec.ts proposal-creation.spec.ts session-refresh.spec.ts --trace=off`: vinte testes aprovados em 20,9 segundos, resultado comunicado pelo agente principal. O inicializador de `npm run dev` foi confirmado operacional. A rodada autenticada atual tem 26 testes em execução e ainda não está aprovada. Regressões antes da correção: clique interceptado pelo nome longo no cabeçalho e transbordamento de título de modal de 320 pixels reproduzidos. A correção inclui quebra de nomes sem espaços nos resumos de cartões (`.ui-row strong`, `.home-agreement h3`), além de tamanho mínimo do texto de navegação, cabeçalho, diálogo e reserva da área segura inferior.

`npm run typecheck` padrão foi aprovado após incluir `artifacts` na exclusão do `tsconfig.json`. A tentativa anterior apresentava dez erros em cópias antigas de código guardadas nessa pasta, não nos arquivos canônicos da aplicação. A exclusão delimita os arquivos do projeto analisados pelo TypeScript; não constitui correção de dez defeitos do aplicativo. `tsconfig.json` integra, portanto, o conjunto desta entrega. Build e rodada autenticada final continuam pendentes de evidência.

Autorrevisão documental: dezenove arquivos novos/alterados examinados; 212 links locais existentes conferidos no fechamento, nenhum ausente; 21 casos transversais confirmados, mais três de Núcleos. `git diff --check` no recorte documental passou. Essa conferência não substitui revisão/validação final de código e Atlas.

**Rodada autenticada intermediária preservada:** seleção completa de 26 cenários terminou com dezenove aprovados, seis falhas e um ignorado, em 4,1 minutos. Duas falhas vinham de título antigo da página Conta no roteiro (`Seu espaço também merece cuidado`, substituído por `Conta, Preferências e Ajuda`); duas evidenciaram transbordamento real de nome longo no resumo `.home-space summary`, com largura de conteúdo de 1924 pixels em janela de 1440; duas eram seletores de modal ancorados no início do título, incompatíveis com o marcador que precede o título no computador. O código do resumo recebeu tamanho mínimo zero/quebra de palavras no segundo `span` e nos nomes da lista; os testes tiveram título e seletores atualizados. A rodada final de 26 cenários foi reiniciada já na v3.5.0 e ainda aguarda resultado. O teste ignorado não equivale a caso aprovado.

**Banco e compilação intermediária:** nova execução local dos sete testes pgTAP da RPC passou. `NOS_LOCAL_VERIFY=1 npm run build -- --webpack` passou antes do último ajuste de quebra do resumo `.home-space`; por isso não certifica sozinho o diff final. O build final, após atualização da versão e desse ajuste, será executado pelo agente principal. Nenhuma dessas verificações comprova aplicação remota da migração ou deploy.

### Evidência mais recente — fonte final v3.5.0

- **Tipos finais:** `npm run typecheck`, aprovado após a atualização para v3.5.0.
- **Build final:** `NOS_LOCAL_VERIFY=1 npm run build -- --webpack`, aprovado depois dos ajustes de quebra do resumo. Substitui a pendência de compilação final descrita nas etapas anteriores.
- **Banco local:** sete testes pgTAP da RPC aprovados novamente; aplicação remota continua não comprovada.
- **Suíte autenticada:** 26 cenários em 2,3 minutos, **23 aprovados, duas falhas e um ignorado**. As duas falhas restantes eram expectativas antigas de títulos para aliases de Conta. As fontes confirmaram os redirecionamentos históricos de `/configuracoes`, `/configuracoes/privacidade`, `/configuracoes/conta` e `/ajuda` para a página consolidada `/conta` e seções correspondentes. Os testes foram ajustados para conferir títulos atuais e URLs/hashes canônicos; reteste somente desses dois cenários em execução. Preservar os resultados anteriores, sem anunciar 26 aprovações ou somar rodadas repetidas.
- **Paridade:** os quatro cenários passaram, cobrindo nome de oitenta caracteres sem espaços entre 320 e 1440 pixels, equivalência dos destinos, títulos/corpo dos modais em 320/390/768/1440 pixels e reserva inferior com área segura de 34 pixels simulada. Os três achados P2 foram corrigidos e protegidos; simulação não comprova iPhone físico/Safari.
- **Atlas/revisão:** cinco verificadores passaram. Achado P3 de revisão levou à restauração da busca local do Atlas, preservando a interação já disponível. O agente principal registrará identificadores dos verificadores e galeria real no fechamento.

**Pendência desta etapa, superada no fechamento abaixo:** receber o reteste dos dois cenários de navegação, vincular galeria/evidência final, concluir a revisão do conjunto e registrar commits/push. As indicações anteriores de tipos/build/paridade pendentes representam os momentos de investigação, superados pelos resultados acima. Nenhum caso manual do usuário foi aprovado, e não houve comprovação de migração remota ou deploy.

Próximo passo executável: agente principal concluir essas verificações, atualizar estado/histórico/manifestos/Atlas e os status dos cinco registros, revisar o conjunto e realizar commit/push já autorizados, mantendo migração remota/deploy como etapas distintas.

### Fechamento local confirmado

Reteste específico dos dois cenários de navegação aprovado: computador em 23,4 segundos e celular em 17,3 segundos (rodada de aproximadamente 1,2 minuto). O conjunto de 26 casos únicos fecha com **25 aprovados e um ignorado intencional**, consolidando 23 aprovações da rodada anterior e as duas falhas de aliases corrigidas/retestadas. Não houve uma única rodada com 26 aprovações; falhas e retestes permanecem preservados neste registro e no histórico de resultados. O ignorado corresponde ao painel de perfil desktop, intencionalmente ausente no celular.

Tipos finais v3.5.0, build final webpack, vinte testes públicos e sete testes pgTAP locais aprovados; cinco verificadores do Atlas aprovados. [Galeria v3.5.0 com aplicativo real](../../wireframes/comparacoes/v3.5.0-2026-11-03-paridade-tela_01-tela_05-tela_12-tela_13-tela_14-tela_18-tela_66-tela_73/index.html#aplicativo-real): dezoito capturas reais (duas anteriores e dezesseis posteriores) e 36 capturas do Atlas, totalizando 54 imagens. A galeria distingue antes/depois, aplicativo/Atlas e seus limites; não certifica aparelho físico ou Safari. Publicação Git será registrada pelo agente principal no estado canônico. Deploy e aplicação remota da migração continuam sem comprovação; os 24 casos novos de caixa preta permanecem Não executados pelo usuário.

**Identificadores da validação do Atlas:** `verify-fidelity.mjs`, `verify-global-view.mjs`, `verify-mvp-view.mjs`, `verify-habit-proposal-journey.mjs` e `verify-parity-3-5.mjs`. A verificação específica e a Visão global foram novamente executadas após a restauração da busca, sem erros ou requisições externas. Tipos padrão foram novamente conferidos após a última alteração dos testes, com aprovação.

**Limpeza:** duas contas e dois Núcleos sintéticos das execuções interrompidas foram identificados por IDs/horários da própria tarefa e removidos somente do Supabase local. Consulta final encontrou zero contas `routing-…@example.test`. Duas cópias temporárias próprias foram removidas após validação dos caminhos e desligamento dos processos de teste; dados do usuário e volumes Docker preservados.