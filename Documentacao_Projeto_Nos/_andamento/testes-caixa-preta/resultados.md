## Evidência técnica — modelo Hábito — v3.8.0 — 06/11/2026

Regressões inicialmente falharam pelo agrupamento antigo e negativa de momento legado; após correção, quatro testes unitários e14 asserções SQL novas passaram. Oito regressões autenticadas existentes passaram; teste novo falhou por seletor de status ambíguo e passou em desktop/mobile após delimitá-lo. Tipos, três verificadores do Atlas e recuperação transacional aprovados. Build3.8.0 e rodada final8 autenticados aprovados; mais2 verificações dirigidas do fechamento por X/Escape/fora aprovadas. Galeria23 imagens e27 referências novas conferidas, conforme [registro](../registros/registro-v3.8.0-2026-11-06-imp-acordos-fun-modelo-habito.md). Suíte ampla de banco:198 asserções passaram, mas email_confirmation.sql abortou por função preexistente ausente. Nenhum caso manual aprovado por inferência; preservar os históricos abaixo.

---

# Resultados dos testes de caixa preta — v3.5.0

## 2026-11-03 — v3.7.0 — verificação real da conexão SMTP

Após usuário salvar chave de relatos, nomes de variáveis corrigidos mantendo as duas chaves separadas. npm run verify:support-mail aprovado: TLS e autenticação, sem envio externo. M05-SUP-001–009 permanecem Não executados pelo usuário; autenticação não prova recebimento.

## 2026-11-03 — relato de problemas — evidência automatizada v3.6.3

Uma falha TDD por atalho ausente;6 testes autenticados iniciais, depois10 ampliados e16 com regressões de administração/suporte aprovados (desktop/mobile). Entrega real apenas na caixa SMTP local isolada, com destinatário/replyTo/conteúdo conferidos; falha de transporte, pendente, texto preservado e cancelamento exercitados.5 testes unitários e11 asserções SQL aprovados; db advisors local sem achados. Tipos/build/Atlas aprovados. SMTP externo retornou EAUTH; usuário orientado sobre chave SMTP distinta da API. Nenhum relato externo enviado; M05-SUP-001–009 permanecem Não executados pelo usuário. [Registro](../registros/registro-v3.7.0-2026-11-03-imp-suporte-fun-relato-problemas.md).

## 2026-11-03 — evidência automatizada v3.6.3 (não aprova caixa preta)

Sincronização:2 falhas esperadas antes da correção, depois8 aprovados e rodada final10 aprovados em Chromium desktop/Pixel7 com Supabase local. Conferidos nome/propósito entre sessões, lista/contexto, seletor aberto, falha de consulta/reconexão, modal e rascunho preservados, documento não recarregado. Abort intencional produziu aviso de stream no servidor; teste demonstrou recuperação. Tipos/build finais3.6.3,81 asserções SQL de identidade/administração e verificadores Atlas Visão global/MVP aprovados. M02-SYNC-001–006 permanecem Não executados pelo usuário. [Registro](../registros/registro-v3.6.3-2026-11-03-imp-identidade-fun-sincronizacao.md).

Controle iniciado em 2026-10-23. Referência do roteiro: [MVP 01](mvp-01.md). Nenhum resultado manual foi recebido nesta entrega.

## Totais da navegação — MVP02/03/04 — v3.3.0

[12 casos NAV](totais-navegacao.md):12 Não executados manualmente. Automação local/online e inspeção visual do agente não substituem execução manual relatada.

## Aparência — MVP05 — v3.2.1

[16 casos de aparência](aparencia-conta.md):16 Não executados manualmente; nenhuma execução recebida. A validação automatizada local permanece separada.

## Situação inicial

MVP 01: 101 testes, 101 Não executados, 0 Aprovados, 0 Falhas, 0 Bloqueados, 0 Não se aplica. Contagem por ID do roteiro; execuções adicionais não aumentam o total de casos. Ao receber resultados, recalcular o estado mais recente de cada ID por ambiente/dispositivo, preservando diferenças entre ambientes.

Atualização de 2026-10-28: adicionados M01-098 e M01-099 para o transporte com proxy no ambiente local. Usuário relatou falha de consulta local em confirmação/recuperação e funcionamento em produção; o relato não identifica execução completa de um ID. Correção verificada tecnicamente, sem aprovação automática dos casos de caixa preta. Recebimento da mensagem desta rodada não foi certificado.

E-mails personalizados v3.1.3: adicionados17 casos M01-081 a M01-097. As26 capturas automatizadas representam prévias com dados fictícios, sem recebimento em caixa postal. Não atribuir aprovação manual por essas capturas. Conferir aplicação dos modelos e disponibilidade do recurso antes de executar; registrar impedimentos e retestes separadamente.

Atualização de 2026-10-27: adicionados M01-063 a M01-080 para confirmação de e-mail e revisadas as expectativas de M01-019, M01-021 e M01-025. Nenhuma execução manual ou aprovação atribuída com base nos testes automatizados. Para a nova rodada, registrar a versão efetivamente publicada e a aplicação da migração; se o ambiente ainda não tiver o recurso, registrar Bloqueado com essa razão. Casos de falha controlada e sessão pendente podem ser Bloqueados quando não houver ambiente adequado.

## Histórico de execuções

| Data | ID | Ambiente e versão implantada | Navegador/dispositivo | Resultado | Observado e evidência | Defeito/correção e próximo passo |
| --- | --- | --- | --- | --- | --- | --- |

Tabela sem linhas porque ainda não houve execução relatada. Acrescentar uma linha por execução ou reteste. Não preencher Aprovado com base em leitura de código, testes automatizados ou ausência de relato.

Preparação do Supabase local em 28/10/2026: adicionados M01-100 e M01-101. As verificações técnicas de SQL, temas, navegação e acesso com e-mail local não aprovam automaticamente os testes de caixa preta do usuário.

## 2026-11-03 — v3.6.2 — lista compacta automatizada

M05-LIS-001/002 e M02-LIS-001 em integrantes-lista.md permanecem Não executados pelo usuário. TDD2falhas esperadas por ausência da tabela; reteste14autenticados aprovados, mais2checagens do X no viewport. Nomes abrem detalhes mantendo nomeação/aceite/destituição/saída;320–1280px sem overflow e altura da linha abaixo120px. Verificador Atlas aprovado. Revisão independente estática sem bloqueio; captura final usa viewport para evitar recorte da captura por elemento. [Registro](../registros/registro-v3.6.2-2026-11-03-imp-integrantes-fun-lista-compacta.md).

Retestes finais3.6.2:8aprovados após remover Nomeação da lista;2aprovados após reduzir largura580px, incluindo nomes/detalhes/permissões/X/foco e320–1280px. Tipos/build finais aprovados. Casos manuais seguem Não executados pelo usuário. Sincronização automática de identidade adiada explicitamente.

**Fechamento v3.7.0:** tipos/build e10 testes autenticados finais aprovados, além dos três verificadores Atlas. Não altera o status dos casos manuais; entrega externa continua não executada.

## 2026-11-03 — v3.6.1 — evidência automatizada de fechamento externo

M05-MOD-001–005 em [modais-fechamento.md](modais-fechamento.md) Não executados pelo usuário. TDD:4 falhas esperadas antes/4 aprovados depois. Suíte pública:210 aprovados/2 falhas em expectativa antiga de vermelho; ajuste de teste seguido de212 aprovados. Autenticados:17 aprovados/2 falhas na abertura inicial/1 ignorado; proteção de hidratação corrigida, reteste13 aprovados/1 ignorado intencionalmente. [Registro](../registros/registro-v3.6.1-2026-11-03-imp-modais-fun-fechamento-externo.md). Sem certificar aparelho físico/Safari/deploy.

## 2026-11-03 — v3.6.0 — automação da organização do Núcleo

Não é execução dos casos de caixa preta pelo usuário. M02-ORG-001–008 e M05-ORG-001–006 permanecem Não executados. Evidência local:30 cenários autenticados aprovados na rodada ampla; reteste final3.6.0 com11 aprovados/1 ignorado intencionalmente,20 públicos e118 SQL pertinentes aprovados; tipos/build e cinco verificadores Atlas aprovados. [Falhas/retestes](../registros/registro-v3.6.0-2026-11-03-imp-nucleo-fun-mesclagem-pessoas.md). A suíte SQL total encontrou função anterior de confirmação de e-mail ausente no banco local; não foi certificada. Sem teste hospedado ou aparelho físico.

## 2026-11-03 — v3.6.0 — reparo técnico de M02-ORG-002/003

Usuário informou falha ao editar nome e propósito, sem dados suficientes para registrar dispositivo/caso específico como execução completa. Preservado relato: ambos não salvavam. Diagnóstico técnico confirmou RPC ausente no banco hospedado configurado (404/PGRST202). Migração específica aplicada; gravação remota com administrador temporário, preservação do outro campo e rejeição de participante/vazio aprovadas em transação desfeita. API passou a reconhecer função, negando chamada anônima como esperado. [Evidências e limites](../registros/registro-v3.6.0-2026-11-03-imp-banco-hospedado-fun-edicao-identidade.md). Casos manuais continuam aguardando execução/reteste explícito pelo usuário; não registrar aprovação presumida.

## 2026-11-03 — v3.5.0 — novos roteiros e automação separada

Casos M01-AJU-001–002, M03-AJU-001–005, M04-CAL-001–004, M05-AJU-001–003, NAV-AJU-001–007 e M02-LAY-004–006: **Não executados pelo usuário**. A criação dos casos e correções de código não aprovam execução ou reteste manual.

Evidência automatizada anterior informada na sessão, sem converter em caixa preta: quatorze testes públicos de conta/luzes aprovados; sete verificações pgTAP da RPC aprovadas; dezesseis cenários de ajustes móveis/calendário aprovados; onze de movimento/seleção aprovados e um ignorado por painel desktop intencionalmente ausente no celular. São rodadas separadas, não uma suíte única do diff final. A seleção atual de 22 testes foi interrompida no encerramento após dois casos aprovados; não representa aprovação dos 22. Nova execução e paridade estão pendentes de resultado pelo agente principal.

Regressões de paridade reproduzidas durante a auditoria: nome de Núcleo com oitenta caracteres sem espaços bloqueando ações do cabeçalho e título longo de modal deslocando seu corpo. Correções e retestes finais em andamento. Área segura inferior será verificada por simulação de 34 pixels; isso não comprova teste em iPhone físico. Sessão foi investigada localmente com transporte Auth simulado, sem correção de código de sessão ou causa hospedada demonstrada. Ver [registro transversal](../registros/registro-v3.5.0-2026-11-03-05-imp-validacao-fun-paridade-e-rastreabilidade.md) para fechamento, limites e próximas evidências.

Atualização automatizada da consolidação: `npm test -- account.spec.ts account-lights.spec.ts proposal-creation.spec.ts session-refresh.spec.ts --trace=off` aprovou vinte testes em 20,9 segundos. Resultado comunicado pelo agente principal; a rodada autenticada atual de 26 testes continua em execução, sem aprovação presumida. Nenhum caso manual foi aprovado por esses resultados.

Continuação da investigação automatizada: as rodadas de 22 e 26 testes foram interrompidas após dois aprovados em cada execução. O teste de navegação ainda esperava o botão antigo Buscar uma área, já removido; o roteiro passou a acessar Agenda pela navegação existente e a rodada de 26 foi reiniciada. Não foi comprovado que rastreamento causasse as esperas. `npm run typecheck` padrão foi aprovado após excluir `artifacts` da análise em `tsconfig.json`; os dez erros anteriores pertenciam a cópias antigas nessa pasta, sem caracterizar dez defeitos do código canônico. Execução autenticada final e build seguem pendentes; todos os casos manuais preservam Não executado.

Rodada autenticada intermediária completa: **dezenove aprovados, seis falhas e um ignorado em 4,1 minutos**, dentre 26 cenários. Preservação das falhas: duas por título antigo de Conta no teste, duas por transbordamento real de nome longo em `.home-space summary` (conteúdo de 1924 pixels em janela de 1440) e duas por seletor de modal ancorado no título que ignorava o marcador anterior no computador. Corrigidos a quebra/tamanho mínimo do resumo e nomes de pessoas, o título e os seletores dos testes; nova rodada final de 26 cenários v3.5.0 em execução, sem resultado presumido. Nova rodada local dos sete testes pgTAP passou. Build com `NOS_LOCAL_VERIFY=1 npm run build -- --webpack` passou antes da última correção de quebra do resumo; build final do diff atualizado continua pendente. Nenhuma falha anterior foi convertida em aprovação manual.

Rodada seguinte v3.5.0: **23 aprovados, duas falhas e um ignorado em 2,3 minutos**, dentre 26 cenários. Os quatro casos de paridade passaram: nomes de oitenta caracteres entre 320 e 1440 pixels, destinos equivalentes, modais em 320/390/768/1440 pixels e área segura inferior de 34 pixels simulada. As duas falhas restantes vinham de expectativas históricas de títulos dos aliases de Conta; fontes inspecionadas confirmaram redirecionamentos existentes para `/conta` consolidada. O roteiro foi ajustado para títulos atuais e URLs/hashes canônicos; reteste específico dos dois casos em andamento. Tipos finais (`npm run typecheck`), build final (`NOS_LOCAL_VERIFY=1 npm run build -- --webpack`) e sete testes pgTAP locais aprovados; cinco verificadores do Atlas passaram e a busca local foi restaurada após achado P3. Esses resultados superam as respectivas pendências técnicas da entrada anterior, preservam seu histórico e não aprovam caixa preta do usuário, aparelho físico/Safari, migração remota ou deploy.

**Fechamento automatizado local v3.5.0:** reteste específico dos dois cenários de navegação aprovado, computador em 23,4 segundos e celular em 17,3 segundos (rodada de aproximadamente 1,2 minuto). O conjunto final de 26 casos únicos possui **25 aprovados e um ignorado intencional**: 23 aprovações da rodada anterior mais dois retestes aprovados; não se afirma uma única rodada com 26 aprovações. O ignorado é o painel de perfil exclusivamente desktop, sem correspondente móvel por decisão de interface. Tipos/build finais, vinte testes públicos, sete pgTAP locais e cinco verificadores do Atlas aprovados. [Galeria](../../wireframes/comparacoes/v3.5.0-2026-11-03-paridade-tela_01-tela_05-tela_12-tela_13-tela_14-tela_18-tela_66-tela_73/index.html#aplicativo-real): dezoito capturas reais (duas anteriores/dezesseis posteriores), 36 do Atlas, 54 no total. **Os 24 casos novos de caixa preta continuam Não executados pelo usuário**; falhas/retestes automatizados anteriores permanecem acima, sem certificar dispositivo físico/Safari, migração remota ou deploy.

## 2026-10-30 — v3.4.3 — Informe de espera
M02-LAY-003 Não executado pelo usuário.16 verificações automatizadas focadas aprovadas; componentes reais renderizado isoladamente, sem afirmar jornada autenticada completa.

## 2026-10-30 — v3.4.2 — Barra lateral
M05-PER-014: Não executado pelo usuário. Quatro testes autenticados desktop/mobile e16 de aparência aprovados; tipos/build e verificadores Atlas aprovados. Capturas novas na galeria3.4.2; galeria histórica3.3.1 preservada.

## 2026-10-30 — Consolidação GitHub v3.4.2
Rodada automatizada final:192 gerais e12 autenticados aprovados; tipos/build e Atlas aprovados. Esses resultados não aprovam nenhum caso de caixa preta do usuário. Evidência e comandos no registro de publicação.

## 2026-10-30 — v3.4.2 — Auditoria de segurança

Resultado automatizado da auditoria:160 testes locais do banco e70 públicos aprovados; quatro verificações de bloqueio concorrente aprovadas. Seleção autenticada52:36 aprovados,15 falharam e1 ignorado. Falhas de seletores antigos e verificador de fidelidade foram investigadas, preservadas e detalhadas no [relatório](../registros/registro-v3.4.2-2026-10-30-imp-auditoria-seguranca-fun-avaliacao-rigorosa.md); não converter casos interrompidos em aprovação de isolamento ou retomada. Experimentos locais comprovaram divergência de senha e janela de token após logout; não constituem mitigação nem aprovação manual. Dependências e validação hospedada permanecem incompletas.

## 2026-10-30 — v3.4.1 — Meia-noite
M05-TEM-017: Não executado pelo usuário.16 testes gerais e dois autenticados finais aprovados; Atlas e capturas desktop/mobile conferidos. Rodada intermediária desktop falhou ao testar coluna lateral em cópia criada antes do ajuste; reteste final aprovado, sem apagar essa evidência.

# 2026-10-30 — v3.4.0 — nome do perfil

M05-PER-010 a013: **Não executados pelo usuário**. Evidência separada:2 cenários automatizados autenticados em Supabase local (desktop/celular),4 testes da ação e Atlas aprovados. Cancelamento, validação, gravação/reload e erro de transporte provocado; conta original/sessão divergente cobertas no teste da ação. Não converter automação em aprovação manual. [Registro](../registros/registro-v3.4.0-2026-10-30-imp-conta-fun-nome-perfil.md).

## 2026-10-30 — v3.3.3 — Convites
M02-LAY-002 e M05-PER-009: Não executados pelo usuário. Quatro testes automatizados aprovados separadamente em desktop/mobile; tipos/build aprovados e capturas inspecionadas.

## 2026-10-30 — v3.3.2 — Núcleos
M02-LAY-001: Não executado pelo usuário. Dois cenários automatizados desktop/mobile aprovados separadamente; não equivalem à execução manual.

## 2026-10-29 — v3.3.1 — conta e perfil

M05-PER-001–008 criados, status Não executado pelo usuário. Testes automatizados locais e capturas não constituem aprovação manual. Consultar [registro](../registros/registro-v3.3.1-2026-10-29-imp-conta-perfil-fun-navegacao-contextual.md) para resultados e retestes automatizados.
