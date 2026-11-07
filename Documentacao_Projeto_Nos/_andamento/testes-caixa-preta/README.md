## Modelo Hábito — roteiro vigente — v3.8.0 — 06/11/2026

Proposta → Hábito → Essência no aplicativo, com compatibilidade de leitura e momentos para o legado sem regravar termos, versões, categoria ou aceites. Nova criação normalizada para habit. Essência e passagens somente esboços, com o mesmo informe do Manifesto; sem critérios ou promoção inventados. Integração Hábito/evento, recorrência e mídia continuam planejadas. Mesmas73 fichas/13 etapas;39 recortes existentes e34 planejados, sem converter desenho em entrega funcional. Nova prévia: Acordos18 → Ver esboço de Essência → modal Nossa Essência36; X/Escape/fora, sem escrita. Casos manuais continuam Não executados pelo usuário. [Registro](../registros/registro-v3.8.0-2026-11-06-imp-acordos-fun-modelo-habito.md). As seções datadas abaixo preservam marcos anteriores.

---

# Processo permanente de testes de caixa preta — v3.8.0

[Modelo Hábito — v3.7.2](modelo-habito.md): oito casos de Atlas, adequação do MVP03 e expansões06/07; todos Não executados pelo usuário. Casos funcionais dependem de implementação.


[Relato de problemas — v3.7.0](relato-problemas.md): nove casos MVP05, Não executados pelo usuário; implementação local e autenticação SMTP real aprovadas, recebimento externo pendente.

[Sincronização da identidade — v3.6.3](sincronizacao-identidade.md): seis casos MVP02/MVP05, todos Não executados pelo usuário.

[Organização do Núcleo — v3.6.0](organizacao-nucleo.md):14 casos novos de MVP02/MVP05, todos Não executados pelo usuário.

Roteiro vigente acrescentado em 03/11/2026: [ajustes e paridade v3.5.0 — 21 casos](ajustes-v3-5.md), mais [três casos de cartões/integrantes M02-LAY-004–006](nucleos-layout.md). Todos Não executados pelo usuário. Evidência automatizada fica separada em [resultados.md](resultados.md); resultados anteriores e seus ambientes permanecem preservados.

Roteiro de aparência: [MVP05 — Aparência da conta —16 casos](aparencia-conta.md). Execução manual pendente.


Criado em 2026-10-23 por solicitação do usuário.

## Regra de manutenção

**Decisão vigente — 06/11/2026:** substitui a exigência anterior de criar ao menos um caso por funcionalidade. Não gerar, detalhar ou acrescentar testes de caixa preta automaticamente. Ao concluir a entrega, apresentar na resposta final sugestões pertinentes em uma descrição curta, semelhante à descrição de commit/push do Git. Exemplo de formato: `Sugestão de testes de caixa preta: validar entrada com Google, cancelamento e retorno ao convite.` O exemplo é apenas formato, não um caso criado ou uma execução comprovada.

O usuário decide se deseja preparar e realizar esses testes. Criar ou ampliar roteiros somente após autorização para o escopo, sem pedir novamente quando ela já tiver sido dada explicitamente. A ausência dessa autorização não bloqueia a conclusão de uma entrega que cumpra suas verificações técnicas. Preservar os casos e resultados existentes; registrar resultados relatados pelo usuário sem inferir aprovação. Esta regra não dispensa testes automatizados, análise de tipos, compilação ou outras verificações técnicas aplicáveis.

Quando a criação ou ampliação for autorizada, manter rastreabilidade ao MVP ou Expansão do Atlas vivo, caminho, pré-condição quando necessária, ação e resultado esperado; separar cenários positivos, negativos, permissões, persistência, acessibilidade e falhas quando relevantes. Não confundir representação offline do Atlas com integração executada. Revisar Atlas, contratos e código antes de gerar ou atualizar a lista; resolver divergências por evidências e decisões vigentes.

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

- [Fechamento externo de modais — v3.6.1](modais-fechamento.md): cinco casos transversais M05-MOD-001–005, Não executados pelo usuário.

- [Lista compacta de integrantes — v3.6.2](integrantes-lista.md): três casos novos, Não executados pelo usuário.
