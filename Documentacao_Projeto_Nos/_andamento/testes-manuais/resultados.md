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
