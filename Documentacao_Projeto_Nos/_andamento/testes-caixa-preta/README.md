# Processo permanente de testes de caixa preta — v3.4.2

Roteiro de aparência: [MVP05 — Aparência da conta —16 casos](aparencia-conta.md). Execução manual pendente.


Criado em 2026-10-23 por solicitação do usuário.

## Regra de manutenção

Cada funcionalidade criada ou alterada deve ter ao menos um teste de caixa preta rastreável ao MVP ou Expansão do Atlas vivo, no mesmo conjunto lógico da entrega. Inclua caminho, pré-condição quando necessária, ação e resultado esperado; separe cenários positivos, negativos, permissões, persistência, acessibilidade e falhas quando relevantes. Não confunda representação offline do Atlas com integração executada. Revise Atlas, contratos e código antes de gerar ou atualizar a lista; divergências devem ser resolvidas por evidências e decisões vigentes.

Use uma linha por teste, iniciada por `[]`, com ID estável. Planejado não entra como funcionalidade concluída: registre etapa/expansão, contrato pendente e bloqueio de execução. Não invente resultados. Novos MVPs serão detalhados em partes conforme a sequência do Atlas; o roteiro inicial detalhou o MVP01 e a v3.2.1 acrescenta Aparência no MVP05.

## Execução e resultados

O usuário executa e envia ID, resultado e observação. Ao receber, atualizar resultados.md e a continuidade no mesmo atendimento. Estados: Não executado, Aprovado, Falhou, Bloqueado e Não se aplica (sempre com justificativa). Cada execução/reteste tem linha própria; não apagar falha anterior nem aprovar todos os dispositivos com uma execução. Corrigir um bug não aprova automaticamente o reteste de caixa preta.

Formato de retorno: `M01-013 | Falhou | ambiente/navegador/dispositivo | observado | evidência opcional`. Se contexto faltar, registrar Não informado; se relato for ambíguo, pedir esclarecimento sem inventar aprovação. Nunca incluir senha, token, link completo de autenticação ou dados pessoais em evidências. Priorizar correção de bloqueios do acesso e exposição de dados.

## Índice

- [MVP 01 — 101 testes](mvp-01.md): confirmação com e sem login em M01-063 a M01-080; e-mails personalizados em M01-081 a M01-097; rede local com proxy em M01-098 e M01-099; Supabase local em M01-100 e M01-101. Modelos de fluxos futuros não significam funcionalidade ativada; conferir a aplicação no Supabase antes de testar recebimento real.
- [Resultados e histórico de execuções](resultados.md).
- [MVP05 — Aparência —16 testes](aparencia-conta.md).
- [Totais pessoais da navegação —12 testes](totais-navegacao.md).
- MVP02–04, demais funcionalidades do MVP05 e expansões: detalhamento futuro, sem afirmar cobertura já criada.

- [MVP05 — Conta e perfil — v3.3.1](conta-perfil.md): oito casos M05-PER-001–008, todos Não executados pelo usuário; evidência automatizada separada no registro.

- [MVP02 — distribuição dos Núcleos — v3.3.2](nucleos-layout.md): M02-LAY-001, Não executado.
# Nome do perfil — v3.4.0

MVP05: [M05-PER-010 a013 em conta-perfil.md](conta-perfil.md). Edição do próprio nome, persistência, cancelamento, falha/reenvio e formulário após troca de conta. Todos **Não executados pelo usuário**; automação local registrada separadamente em resultados.md.

- v3.4.2: [Conta/perfil — M05-PER-014](conta-perfil.md), remoção do cartão da barra lateral, Não executado pelo usuário.
