# Registro — v3.4.2 — 2026-10-30 — Imp. de auditoria de segurança com Fun. avaliação rigorosa

**Versão:** 3.4.2. **Status:** Relatório concluído com limitações e pendências de segurança abertas; não certifica aprovação integral do sistema. **Natureza:** auditoria e documentação; nenhuma correção de produto, migração, commit, push ou deploy nesta entrega.

## Objetivo, contexto e critérios

Avaliar rigorosamente segurança e privacidade do sistema existente e documentar evidências, riscos, limites e próximos passos. Critérios: examinar fronteiras de acesso; conferir permissões efetivas do banco; exercitar controles locais; distinguir achados de hipóteses e alertas automáticos; fornecer localização, impacto, reprodução segura e critério de correção. Não é certificação de invulnerabilidade, conformidade jurídica ou autorização de lançamento.

Base Git: branch `main`, HEAD `e77da4b58cb6c583442ab875434a9bc4ff877468`. A árvore já continha a entrega 3.4.3 de carregamento: fontes, teste, Atlas, manifestos, README e acompanhamento. Foi preservada. A auditoria considera os arquivos de trabalho atuais, não apenas o commit. Documentação isolada não incrementa a versão.

## Método, ambientes e ferramentas

- Revisão principal do servidor, configuração, dependências, testes e catálogos SQL; revisão independente estática das 13 migrações, permissões cumulativas e ações de autenticação, convites, agenda, acordos, administração, saída e exclusão.
- Ameaças: visitante sem sessão, participante externo ao Núcleo, membro sem administração, cliente que chama a API diretamente, sessão adulterada/expirada, token anteriormente roubado, automação abusiva e acesso à rede de desenvolvimento.
- Windows, Node 24.19.0, npm 11.17.0; Next instalado 16.3.6; CLI (interface de linha de comando) Supabase 2.118.0; PostgreSQL remoto 17.6.1.166. Dependências declaradas: React 19.3.0, supabase-js 2.117.2 e SSR 0.12.7, com intervalos compatíveis e lockfile versionado.
- Testes com escrita: exclusivamente Supabase Docker local, contêiner `supabase_db_nos`, aplicação isolada em `127.0.0.1:3200`. O executor confere fontes e recursos por SHA-256 e compila cópia temporária. Suíte pública isolada em `127.0.0.1:3100`, sem backend. Contas dos experimentos adicionais foram descartáveis e sua remoção foi confirmada.
- Hospedado: projeto identificado pelo conector como `nos-dev`, referência `pyvohqgcwkcfzbtkmbvx`, usado pelo site conforme README. Somente leitura de migrações, catálogos e avisos de segurança; nenhuma consulta a conteúdo dos Núcleos nem alteração remota.
- Superpowers 7.0.1: orientação inicial, revisão, depuração de falhas e verificação. Skills Supabase e Context7 aplicadas; Context7 respondeu sobre funções privilegiadas e sessões. Não havia indexação explícita das versões exatas dos SDKs nessa consulta; fontes e documentação instaladas complementaram a análise.
- Octocode não estava exposto. Procedimento oficial `npm exec --yes --package=octocode -- octocode --help` tentou disponibilizar a CLI e terminou com `ETIMEDOUT` no registro npm. Instalação/ativação não comprovada; pesquisa avançada substituída por buscas locais precisas, fontes e catálogos. Nenhuma economia percentual de tokens foi medida.

## Resultado executivo e prioridade

Não foi demonstrado acesso cruzado indevido entre Núcleos nem comprometimento de conta no recorte testado. Isso não comprova ausência de vulnerabilidades. Há um achado de privacidade confirmado também no remoto, problemas confirmados no ambiente local e lacunas que impedem certificar segurança integral.

Gravidade descreve impacto e condições, sem pontuação numérica inventada: **alta** exige contenção prioritária quando sua condição de exposição existe; **média** requer tratamento antes de ampliar uso público; **baixa** fortalece defesa sem exploração demonstrada. Alertas de ferramenta não recebem automaticamente essa classificação.

| ID | Gravidade | Ambiente e situação | Ação prioritária |
|---|---|---|---|
| SEG-001 | Média | Enumeração de contas confirmada em código, teste local e definição/grants remotos | Rever divulgação pública e impedir consulta direta sem controle de abuso |
| SEG-002 | Alta se acessível por rede não confiável | Administração/e-mails locais sem desafio de autenticação e portas em todas as interfaces; alcance externo não comprovado | Restringir exposição local e validar firewall/rede |
| SEG-003 | Média | Política de senha contornável na API do Auth local; remoto não aferido | Alinhar política autoritativa ao contrato e testar chamada direta |
| SEG-004 | Média condicionada à operação/janela | Limitação arquitetural conhecida: token não expirado aceito pela API de dados local após logout global | Definir janela tolerada e proteger operações sensíveis conforme risco |
| SEG-005 | Baixa | Ausência de CSP confirmada no servidor isolado; remoto não aferido | Preparar política compatível com Next e validar antes de impor |
| QUA-001 | Média para confiança da auditoria | Testes antigos e contratos contraditórios dão evidência incompleta | Corrigir testes/indicações e repetir cobertura afetada |

### SEG-001 — consulta pública permite descobrir contas

**Localização:** `supabase/migrations/20261027173526_email_confirmation_status.sql:3–16`; `src/features/auth/access-actions.ts:24–37`; cadastro em `src/features/auth/actions.ts:39–43` também distingue conta existente. A função SQL é `SECURITY DEFINER` (executa com privilégios do proprietário), lê `auth.users` e responde `confirmed`, `pending` ou `missing` para qualquer endereço. `anon` e `authenticated` podem executá-la. O catálogo remoto confirmou o mesmo corpo e o aviso oficial apontou essa exposição.

**Exploração e impacto:** uma lista de e-mails candidatos pode ser consultada sem login via `/rest/v1/rpc/get_email_confirmation_status` usando a chave pública. Revela associação ao Nós e confirmação da conta, facilitando coleta de informações e abordagens direcionadas; não revela senha nem concede sessão. O cookie de 60 segundos é removível e só é verificado depois da consulta; respostas antecipadas não o alcançam. Limites do Auth não comprovam proteção dessa RPC (chamada de procedimento remoto) da API de dados. Controles adicionais do provedor não foram integralmente aferidos.

**Contexto:** divulgação é requisito anterior explícito do modal, não uma regressão inventada pela auditoria. Mensagens neutras seriam a solução de maior privacidade; manter divulgação implica risco residual mesmo com limites e CAPTCHA (desafio contra automação).

**Correção proposta:** revisar o contrato de divulgação; restringir `EXECUTE` direto de `anon` e `authenticated`; se a consulta continuar necessária, usar fronteira de servidor com limite compartilhado, observabilidade sem e-mails nos logs e controle contra automação. Não mover a mesma consulta para uma Server Action ilimitada e considerar resolvido. Uma nova migração deve preservar o histórico e acompanhar ajuste da ação, contrato, Atlas e testes.

**Reprodução segura:** `supabase/tests/email_confirmation.sql` cria endereços fictícios em transação, muda para papel `anon`, comprova os três estados e faz rollback. Executado nesta auditoria. Não usar listas reais de pessoas nem varrer o serviço hospedado. **Aceite:** decisão de privacidade registrada, teste negativo da chamada pública direta e teste de limite que não dependa de cookies; atualizar expectativas que hoje exigem divulgação.

### SEG-002 — ferramentas locais publicadas em todas as interfaces

**Evidência do ambiente:** `docker inspect` confirmou `0.0.0.0` e `::` nas portas 54321 (API), 54322 (banco), 54323 (Studio) e 54324 (caixa de e-mails). Requisições HEAD locais sem credenciais a Studio e caixa retornaram 200, sem desafio `WWW-Authenticate`. O Auth local está sem CAPTCHA e com limite de envio elevado para testes. Os três perfis do Firewall do Windows estão habilitados, mas essa leitura não determinou a permissão efetiva de entrada dessas portas.

**Risco condicionado:** se outra máquina conseguir alcançar essas portas, os recursos administrativos e links de e-mail de teste podem ficar acessíveis. Isso pode comprometer dados e contas locais. Acesso a uma página HTML não comprova sozinho execução de toda operação administrativa. Não foi realizada tentativa a partir de outra máquina, prova de alcance pela internet nem exploração do banco. Não extrapolar este achado para Supabase Cloud.

**Correção proposta:** restringir portas à interface de loopback quando suportado pelo modo de execução; complementar com regras explícitas de firewall e rede confiável; preservar volumes e dados ao reconfigurar, sem reset. Nunca armazenar dados reais nesse ambiente de testes. **Aceite:** configuração de bind conferida e teste negativo autorizado de outra máquina, cobrindo IPv4 e IPv6, além de reexecução dos testes locais. Nesta entrega não houve reconfiguração de contêineres nem firewall.

### SEG-003 — validação de senha do formulário não é política do Auth

**Localização:** `src/features/auth/input.ts:3–5` exige letra, número e símbolo; `supabase/config.toml:9` define somente comprimento mínimo 8. Configuração efetiva local: `GOTRUE_PASSWORD_MIN_LENGTH=8` e `GOTRUE_PASSWORD_REQUIRED_CHARACTERS` vazio.

**Prova:** uma chamada direta de cadastro pela chave pública local aceitou uma senha de oito letras minúsculas que o aplicativo rejeitaria. Houve criação pendente, sem sessão emitida; a conta fictícia foi removida pelo identificador criado. Não foram testadas senhas ou contas reais. A confirmação de e-mail permaneceu exigida.

**Impacto:** clientes diretos contornam a promessa de complexidade; a proteção efetiva é a configurada no Auth. Isso não equivale a provar quebra de senha. Não se conclui que o remoto aceite a mesma política, pois sua configuração de Auth não foi obtida.

**Correção proposta:** definir a política pretendida e aplicá-la também no provedor; considerar comprimento e bloqueio de senhas comprometidas conforme recursos disponíveis, sem impor troca arbitrária de senha. **Aceite:** cadastro e troca de senha pela API direta rejeitam entradas fora do contrato; configuração remota verificada separadamente, sem sobrescrever toda a configuração hospedada.

### SEG-004 — logout não invalida imediatamente tokens já emitidos

**Localização:** `src/features/auth/actions.ts:66–72`, `src/features/auth/access-actions.ts:69–74` e funções/RLS (segurança por linha) baseadas em `auth.uid()` sem consulta à existência da sessão. O projeto já documenta a limitação em `funcionalidades/conta-entrada.md` e `exclusao-conta.md`.

**Prova local adicional:** conta descartável autenticada; token mantido somente em memória; logout global confirmou sucesso; chamada direta com o token anterior a `get_navigation_counts` retornou HTTP 200. Conta removida ao final. Expiração local configurada em 3600 segundos; janela restante depende do momento de emissão, não é sempre uma hora completa.

**Impacto e condição:** um portador de token roubado anteriormente pode manter acesso às operações que dependem só do token e da associação até expirar. Não é bypass da assinatura nem obtenção de token pela auditoria. O experimento provou leitura de totais, não executou exclusão com sessão revogada. Não alegar prova de todas as operações destrutivas. A exclusão própria remove associações e conta, mecanismo distinto de logout.

**Mitigação proposta:** decidir janela tolerada, expiração e checagem de sessão vigente nas operações sensíveis; avaliar reautenticação recente para exclusão da conta, mediante atualização aprovada do contrato. O contrato atual exige sessão e frase, não reautenticação recente. `APAGAR CONTA` expressa intenção, não reautentica. A mudança precisa existir também na fronteira da API/banco, para que chamada direta não a contorne. **Aceite:** conservar teste positivo de sessão válida e demonstrar recusa da sessão revogada nas operações escolhidas, incluindo acesso direto, sem prometer revogação global instantânea se o desenho continuar baseado em JWT (token assinado com validade). Trata-se de risco conhecido do desenho, não descumprimento demonstrado do contrato vigente.

### SEG-005 — camada de contenção de scripts ausente

**Localização:** `next.config.ts:17–26`. Servidor de produção isolado, HEAD `/conta`: 200, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, cache privado/sem armazenamento; `Content-Security-Policy` ausente.

**Impacto:** falta uma defesa adicional contra injeção de scripts. Busca nos fontes não identificou uso de `dangerouslySetInnerHTML`, `eval` ou construção de HTML arbitrário; nenhuma exploração XSS (execução de script injetado) foi demonstrada. Ausência de CSP (política de segurança de conteúdo) não prova vulnerabilidade XSS. HSTS (uso obrigatório de HTTPS após visita segura) não apareceu no servidor HTTP local, o que não determina a política da hospedagem HTTPS.

**Correção proposta:** definir política com nonce por resposta ou alternativa compatível com a renderização do Next; começar com observação/report-only e validar scripts, formulários, imagens e estilos. Não copiar uma política que quebre hidratação. **Aceite:** teste em produção isolada e hospedagem com cabeçalho efetivo, fluxos íntegros e bloqueio de origem de script não permitida.

### QUA-001 — evidências antigas não acompanham o fluxo atual

`tests/recovery-proof.spec.ts:18–28` aprova mensagens neutras chamando `sendAccessEmail`, mas buscas de referências mostram que o helper só é importado por testes; a ação real usa a consulta de estado. O teste continua verde sem provar a privacidade do fluxo ativo. `tests/email-confirmation.spec.ts` testa a ação atual e espera divulgação, o que evidencia o conflito de expectativas. Contrato `funcionalidades/conta-entrada.md` ainda declarava neutralidade em seções vigentes; atualizado nesta entrega, preservando os marcos históricos.

Falhas autenticadas foram investigadas com a skill de depuração: checkbox de autoria encontra dois elementos; suporte encontra três parágrafos; campo oculto `next` encontra três formulários; seletor de link usa texto antigo; verificador de fidelidade exige `data-atlas-revision=3` na tela 03 e recebe `null`. Os erros não demonstram vazamento de dados, mas impedem aprovação integral dos fluxos seguintes. Não foram alterados testes para fazê-los passar artificialmente nem corrigida interface fora do escopo da auditoria.

**Aceite:** alinhar teste e contrato à decisão de privacidade, limitar seletores ao contexto correto e conferir a representação real do Atlas; repetir jornadas completas. Falha de teste interrompida antes da última asserção não certifica essa asserção.

## Controles efetivamente conferidos

| Fronteira | Evidência e conclusão restrita |
|---|---|
| Banco local e remoto | 15 tabelas públicas com RLS; nenhuma leitura de tabela por `anon` nem escrita direta de tabela por `authenticated` nos privilégios consultados. Grants por coluna e RPCs precisam ser considerados junto das políticas. |
| Migrações | As mesmas 13 identificações e nomes no local e no remoto. Isso não é comparação byte a byte de todas as funções instaladas. |
| Funções privilegiadas | Todas as funções `SECURITY DEFINER` públicas consultadas têm `search_path` definido; zero views públicas nos dois ambientes. Local tem 43 assinaturas; remoto tem 44, pela função adicional de event trigger. |
| Isolamento | Testes SQL incluem negação para externo, membro sem administração, acesso a agenda alheia, RPCs legadas e manipulação de consentimento; revisão independente não confirmou bypass entre Núcleos. |
| Sessão e retorno | `getUser` no servidor; cookies HttpOnly, SameSite=Lax e Secure em produção; destinos internos com lista permitida; callbacks rejeitam parâmetros repetidos/misturados; recuperação exige prova assinada vinculada a usuário/sessão e prazo. |
| Concorrência | Quatro funções da agenda aguardaram trava de associação; criação/edição/remoção/resposta não ignoram o bloqueio testado. Não constitui prova formal de toda concorrência do sistema. |
| Segredos | 1811 caminhos rastreados inventariados; 557 arquivos textuais examinados com padrões de chave privada, tokens GitHub/AWS/OpenAI, chave Supabase secret e JWT service_role; zero candidatos. Busca histórica direcionada por padrões de chave privada/Supabase/GitHub sem resultados. Não cobre segredos sem formato conhecido, binários, todo histórico por decodificação nem arquivos ignorados. Nenhum valor de credencial foi registrado. |
| Storage | Zero buckets locais e remotos. Upload, mídia protegida e políticas de futuras galerias não estão certificados. |
| Fronteira de conteúdo | Nenhum sink explícito de HTML arbitrário encontrado nos fontes nas buscas executadas; consultas usam SDK/RPC e validação de entradas. Isso não substitui análise de todas as dependências nem fuzzing. |

## Triagem dos avisos remotos

Consulta oficial de segurança em 30/10/2026 retornou avisos de funções privilegiadas públicas/autenticadas e uma informação sobre ausência de política na tabela de nomeações.

- `get_email_confirmation_status`: achado SEG-001; não descartar apenas por ser intencional. [Orientação oficial](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable).
- `rls_auto_enable`: definição remota retorna `event_trigger`, `search_path=pg_catalog`, ligada ao gatilho `ensure_rls`. Esse tipo não se chama como função SQL comum; o aviso de EXECUTE não comprova uma RPC REST explorável. Pode-se restringir grants desnecessários após conferir dependências, sem remover a automação de RLS. Não foi contada como tomada de controle. Não existe nas migrações da aplicação; diferença operacional registrada.
- Demais funções autenticadas: são APIs de domínio intencionais, com validação de ator/papel/associação; `SECURITY DEFINER` exige revisão, mas não equivale a vulnerabilidade por si só. [Orientação oficial](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).
- `nucleus_admin_nominations`: RLS sem política e sem leitura/escrita direta aos papéis públicos consultados resulta em negação por padrão; acesso ocorre pelas funções autorizadas. Não criar política permissiva para apagar o aviso. [Orientação oficial](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).

## Validações e experimentos

| Verificação | Resultado desta execução |
|---|---|
| `npm run test:db` | Aprovado: 6 arquivos, 160 testes pgTAP, banco local; rollback nas suítes. |
| `npm run test:calendar-locks` | Aprovado: quatro funções esperam trava e funcionam após liberação; recursos do teste removidos. |
| Seleção pública de autenticação/retorno/recuperação | 70 testes aprovados desktop/celular, 27,6 segundos. Comando abaixo. |
| Seleção autenticada | 52 casos: 36 aprovados, 15 falharam e 1 ignorado explicitamente; 4,5 minutos. Não aprovada integralmente; falhas discriminadas abaixo. |
| Build da cópia autenticada | `next build --webpack` aprovado; TypeScript executado pelo build. Não equivale a executar o comando padrão `npm run build`. |
| Senha fora da política da interface | Cadastro local direto aceito, sem sessão; conta removida. |
| Token após logout | Logout global bem-sucedido, RPC de totais com token anterior respondeu 200; conta removida. |
| npm audit | Três tentativas terminaram com erro de acesso ao endpoint de advisories, incluindo uso de certificados do sistema e proxy do ambiente. Resultado inconclusivo, não zero vulnerabilidades. |
| HTTPS do site hospedado | HEAD via PowerShell recusado pela conexão deste ambiente; cabeçalhos, conteúdo publicado e deploy não certificados. |
| Tipos/build padrão | Não executados separadamente: nenhuma fonte do aplicativo alterada pela auditoria; build isolado acima era necessário para os experimentos autenticados. |
| Documentação | `git diff --check` aprovado; dez arquivos documentais conferidos e736 links locais resolvidos, sem caminhos ausentes. A primeira passagem do conferidor não tratava destinos Markdown entre `< >`; o leitor foi ajustado, sem alterar links históricos válidos. |

Seleção pública executada:

```powershell
npm test -- tests/auth-service.spec.ts tests/recovery-proof.spec.ts tests/recovery-protocol.spec.ts tests/confirmation-protocol.spec.ts tests/email-confirmation.spec.ts tests/session-routing.spec.ts tests/protected-creation.spec.ts tests/account-deletion.spec.ts
```

O argumento `tests/recovery-protocol.spec.ts` não corresponde a arquivo existente; não foi contado como cobertura. Os 70 casos vêm dos arquivos encontrados pelo Playwright.

Seleção autenticada executada:

```powershell
npm run test:authenticated -- tests/authenticated/invitation-flow.spec.ts tests/authenticated/controls.spec.ts tests/authenticated/account-deletion.spec.ts tests/authenticated/session-navigation.spec.ts tests/authenticated/calendar.spec.ts
```

Falhas da seleção autenticada, todas presentes no estado de trabalho anterior às edições documentais desta auditoria:

| Arquivo e linha | Dispositivos/casos que falharam | Causa observada e limite |
|---|---|---|
| `tests/authenticated/controls.spec.ts:33` e `:85` | Desktop e celular; quatro falhas | Rótulo de autoria encontra dois checkboxes; fluxos de nomeação e saídas não chegam ao fim. |
| `tests/authenticated/controls.spec.ts:62` | Desktop e celular; duas falhas | Texto de suporte encontra três parágrafos; seletor viola unicidade. |
| `tests/authenticated/session-navigation.spec.ts:59` | Desktop e celular; duas falhas | Link com nome antigo não encontrado; teste não conclui a jornada inteira de listagem/isolamento. |
| `tests/authenticated/session-navigation.spec.ts:104` e `:130` | Desktop e celular; quatro falhas | `input[name="next"]` encontra três formulários, todos com o destino esperado; bloqueio/retorno ao login ocorreu, mas retomada e asserção final de ausência de criação não ficam certificadas por esses casos interrompidos. |
| `wireframes/tools/verify-fidelity.mjs:22`, chamado por `tests/authenticated/invitation-flow.spec.ts:36` e `session-navigation.spec.ts:71` | Dois chamadores desktop e um celular; três falhas | Tela 03 tem revisão `null`, verificador espera `3`; fidelidade integral do Atlas não foi aprovada. O quarto caso foi ignorado pelo próprio teste. |

Os 36 aprovados incluem exclusão própria, agenda, sete cenários funcionais de convites por dispositivo e parte dos controles de sessão; não compensam os casos interrompidos. Avisos de cookie/token inválido no terminal foram provocados pelos testes negativos e não expuseram valores de credenciais na síntese.

Artefatos locais de falha ficam em `test-results-authenticated/`, ignorados pelo Git e sujeitos a substituição por outra execução. Não versionar traces de sessão; este registro guarda somente a descrição sanitizada das falhas. Os experimentos não substituem os testes de caixa preta do usuário.

## Cobertura e limites materiais

Revisão abrangeu os módulos existentes de conta, autenticação, convites, Núcleos, agenda, acordos/participação, preferências, autoria e exclusão, suas fronteiras principais e migrações. Rotas de esboço foram consideradas quanto à proteção de entrada, sem certificar regras futuras. Foram consultados README, AGENTS, estado, MVP, documentação de segurança, contratos afetados e testes; não se declara releitura integral de todo o acervo histórico, galerias e documentos conceituais nesta auditoria.

Não houve pentest destrutivo, carga, varredura de terceiros, exploração de contas reais, auditoria completa de rede/firewall, inspeção de todos os logs, análise binária de artefatos, fuzzing sistemático, auditoria de provedores ou restauração de backup. Não se verificaram configuração remota de complexidade/senhas vazadas/CAPTCHA/MFA, expiração efetiva de tokens remotos, controles administrativos dos provedores, plano de incidentes, política de retenção nem recuperação de desastre. MFA (autenticação com múltiplos fatores) ausente da interface não foi classificada automaticamente como falha explorável. Direitos sobre dados e conformidade legal exigem avaliação própria.

A falha do npm impede afirmar que dependências estão livres de vulnerabilidades conhecidas. A leitura de migrações e catálogos não comprova qual versão da aplicação está implantada. O acesso bem-sucedido ao conector Supabase não prova acesso direto HTTPS a todos os serviços.

## Ordem de tratamento e próximos passos executáveis

1. Conter exposição administrativa local conforme SEG-002 e confirmar a condição de acesso pela rede. Preservar dados/volumes e servidores do usuário.
2. Decidir e implementar a mitigação da enumeração SEG-001, incluindo chamadas diretas; documentar risco residual se o estado continuar público.
3. Alinhar política do Auth, conferir configuração hospedada por leitura sanitizada e decidir proteção de sessão/reautenticação nas operações sensíveis.
4. Corrigir testes/contratos divergentes QUA-001 e repetir fluxos completos; guardar falhas anteriores.
5. Restabelecer consulta de advisories npm e concluir dependências; preparar CSP e conferir cabeçalhos hospedados sem presumir deploy.
6. Conferir backups/restauração e resposta a incidentes antes de ampliar público. Definir responsáveis e prazos com o usuário; nenhum prazo inventado nesta auditoria.

Cada correção deverá ter teste que falhe antes, passe depois e cubra a API direta quando aplicável. Não há autorização implícita para publicação ou reconfiguração remota apenas por constar como recomendação.

## Arquivos, revisão e entrega

Arquivos desta entrega: este registro; estado e histórico; contrato de Conta e entrada; nota de segurança no plano MVP; resultados das verificações; índice dos testes; Brag document; referência de auditoria no README. Não houve alteração de comportamento, componentes, Atlas, manifestos ou esquema por esta auditoria. Os testes criaram/removeram fixtures locais; não houve mutação de dados remotos.

Revisão independente estática confirmou SEG-001 e não confirmou bypass de Núcleos no recorte examinado. Demais experimentos e conclusões são da revisão principal; não atribuir sua execução ao revisor independente. A revisão independente documental solicitou dois ajustes, incorporados: reautenticação recente é recomendação a aprovar, não contrato existente; token de acesso expirado pode renovar com refresh token válido. SEG-004 foi identificado como limitação arquitetural conhecida. Autorrevisão documental, links e conferência do diff realizados no fechamento, sem atribuir ao revisor a execução dos experimentos.

**Resultado esperado da documentação:** permitir correções verificáveis sem transformar alertas automáticos ou testes verdes em garantia de segurança. Não se mediu redução de incidentes ou risco após correção, pois nenhuma mitigação de produto foi aplicada nesta entrega.

## Fontes técnicas

- [Supabase: funções de banco e privilégios](https://supabase.com/docs/guides/database/functions), consultado também via Context7.
- [Supabase: limites do Auth](https://supabase.com/docs/guides/auth/rate-limits).
- [Supabase: sessões e validação no servidor](https://supabase.com/docs/guides/auth/server-side/advanced-guide).
- Documentação da versão instalada: `node_modules/next/dist/docs/01-app/02-guides/data-security.md` e `content-security-policy.md`.
- [Procedimento oficial Octocode](https://github.com/bgauryy/octocode), tentativa limitada pelo acesso ao npm. O índice de changelog Supabase `.md` não pôde ser lido pelo navegador da ferramenta; não se alega revisão completa de changelog.
