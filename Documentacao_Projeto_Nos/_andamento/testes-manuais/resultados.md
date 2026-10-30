# Resultados dos testes manuais — v3.3.0

Controle iniciado em 2026-10-23. Referência do roteiro: [MVP 01](mvp-01.md). Nenhum resultado manual foi recebido nesta entrega.

## Totais da navegação — MVP02/03/04 — v3.3.0

[12 casos NAV](totais-navegacao.md):12 Não executados manualmente. Automação local/online e inspeção visual do agente não substituem execução manual relatada.

## Aparência — MVP05 — v3.2.1

[16 casos de aparência](aparencia-conta.md):16 Não executados manualmente; nenhuma execução recebida. A validação automatizada local permanece separada.

## Situação inicial

MVP 01: 101 testes, 101 Não executados, 0 Aprovados, 0 Falhas, 0 Bloqueados, 0 Não se aplica. Contagem por ID do roteiro; execuções adicionais não aumentam o total de casos. Ao receber resultados, recalcular o estado mais recente de cada ID por ambiente/dispositivo, preservando diferenças entre ambientes.

Atualização de 2026-10-28: adicionados M01-098 e M01-099 para o transporte com proxy no ambiente local. Usuário relatou falha de consulta local em confirmação/recuperação e funcionamento em produção; o relato não identifica execução completa de um ID. Correção verificada tecnicamente, sem aprovação automática dos casos manuais. Recebimento da mensagem desta rodada não foi certificado.

E-mails personalizados v3.1.3: adicionados17 casos M01-081 a M01-097. As26 capturas automatizadas representam prévias com dados fictícios, sem recebimento em caixa postal. Não atribuir aprovação manual por essas capturas. Conferir aplicação dos modelos e disponibilidade do recurso antes de executar; registrar impedimentos e retestes separadamente.

Atualização de 2026-10-27: adicionados M01-063 a M01-080 para confirmação de e-mail e revisadas as expectativas de M01-019, M01-021 e M01-025. Nenhuma execução manual ou aprovação atribuída com base nos testes automatizados. Para a nova rodada, registrar a versão efetivamente publicada e a aplicação da migração; se o ambiente ainda não tiver o recurso, registrar Bloqueado com essa razão. Casos de falha controlada e sessão pendente podem ser Bloqueados quando não houver ambiente adequado.

## Histórico de execuções

| Data | ID | Ambiente e versão implantada | Navegador/dispositivo | Resultado | Observado e evidência | Defeito/correção e próximo passo |
| --- | --- | --- | --- | --- | --- | --- |

Tabela sem linhas porque ainda não houve execução relatada. Acrescentar uma linha por execução ou reteste. Não preencher Aprovado com base em leitura de código, testes automatizados ou ausência de relato.

Preparação do Supabase local em 28/10/2026: adicionados M01-100 e M01-101. As verificações técnicas de SQL, temas, navegação e acesso com e-mail local não aprovam automaticamente os testes manuais do usuário.

## 2026-10-29 — v3.3.1 — conta e perfil

M05-PER-001–008 criados, status Não executado pelo usuário. Testes automatizados locais e capturas não constituem aprovação manual. Consultar [registro](../registros/registro-v3.3.1-2026-10-29-imp-conta-perfil-fun-navegacao-contextual.md) para resultados e retestes automatizados.

## 2026-10-30 — v3.3.2 — Núcleos
M02-LAY-001: Não executado pelo usuário. Dois cenários automatizados desktop/mobile aprovados separadamente; não equivalem à execução manual.

## 2026-10-30 — v3.3.3 — Convites
M02-LAY-002 e M05-PER-009: Não executados pelo usuário. Quatro testes automatizados aprovados separadamente em desktop/mobile; tipos/build aprovados e capturas inspecionadas.
# 2026-10-30 — v3.4.0 — nome do perfil

M05-PER-010 a013: **Não executados pelo usuário**. Evidência separada:2 cenários automatizados autenticados em Supabase local (desktop/celular),4 testes da ação e Atlas aprovados. Cancelamento, validação, gravação/reload e erro de transporte provocado; conta original/sessão divergente cobertas no teste da ação. Não converter automação em aprovação manual. [Registro](../registros/registro-v3.4.0-2026-10-30-imp-conta-fun-nome-perfil.md).

## 2026-10-30 — v3.4.1 — Meia-noite
M05-TEM-017: Não executado pelo usuário.16 testes gerais e dois autenticados finais aprovados; Atlas e capturas desktop/mobile conferidos. Rodada intermediária desktop falhou ao testar coluna lateral em cópia criada antes do ajuste; reteste final aprovado, sem apagar essa evidência.

## 2026-10-30 — v3.4.2 — Barra lateral
M05-PER-014: Não executado pelo usuário. Quatro testes autenticados desktop/mobile e16 de aparência aprovados; tipos/build e verificadores Atlas aprovados. Capturas novas na galeria3.4.2; galeria histórica3.3.1 preservada.

## 2026-10-30 — Consolidação GitHub v3.4.2
Rodada automatizada final:192 gerais e12 autenticados aprovados; tipos/build e Atlas aprovados. Esses resultados não aprovam nenhum caso manual do usuário. Evidência e comandos no registro de publicação.
