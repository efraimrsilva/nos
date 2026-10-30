# Totais pessoais na navegação — v3.3.0

Desktop: número textual à direita de Seus Núcleos, Acordos, Agenda e Pessoas. Celular: junto ao rótulo; Seus Núcleos no Mais e no atalho externo ao Núcleo. Sem fundo, círculo, sobreposição no ícone, alerta ou animação de notificação. Cores de texto seguem o tema da conta; ícones preservados.

Os quatro totais são **gerais da pessoa**, mesmo dentro de um Núcleo. Links continuam abrindo a área do Núcleo atual. Descrição acessível e título do número esclarecem o alcance; valores móveis a partir de mil usam formato compacto, preservando o valor exato na descrição acessível.

| Total | Regra vigente |
| --- | --- |
| Núcleos | Associação atual da própria pessoa, com `closed_at is null`. Convites pendentes não são associação. |
| Acordos | Nos Núcleos acima, status `pending/testing/active`, resposta própria `accepted` e `accepted_version = terms_version`. Propostas aceitas também contam; encerrados/recusados e aceite antigo ficam fora. |
| Agenda | Nos Núcleos acima, inclusão própria `pending/accepted` e `ends_at > now()`. Inclui compromisso em andamento; exclui terminado, recusado e evento sem inclusão própria. |
| Pessoas | Pessoas distintas nos Núcleos acima, excluindo a própria conta. Não duplica quem compartilha vários Núcleos. |

`get_navigation_counts()` executa quatro agregações na mesma fotografia de leitura, sem retornar listas, autoria ou identificadores de terceiros. Não recebe ID de pessoa: usa `auth.uid()`. `SECURITY DEFINER`, caminho de busca vazio e referências qualificadas; execução somente para `authenticated`, com identidade exigida também no corpo. Nenhum privilégio de leitura das tabelas da Agenda é ampliado. A migração é aditiva e não modifica dados armazenados.

`OnboardingShell` consulta no servidor. `cache()` do React evita repetição na renderização da mesma requisição, sem cache persistente entre contas. `ApplicationShell` recebe só os totais. Zero significa resultado real; erro/resposta inválida gera “—” e descrição de indisponibilidade. Entrada pública não mostra números. Estados de carregamento/erro de rota não anunciam totais antigos.

Atualiza ao renderizar/navegar/recarregar, inclusive após as ações que renovam a página. Não há assinatura em tempo real nem relógio para remover imediatamente um compromisso que terminou com a página parada; nesse caso atualizar a página obtém novo total.

Atlas usa exemplos identificados e permanece offline. Não altera telas planejadas, jornada, número de fichas ou permissões. [Registro](../registros/registro-v3.3.0-2026-10-24-imp-navegacao-fun-totais-pessoais.md) · [Testes de caixa preta](../testes-caixa-preta/totais-navegacao.md) · [galeria](../../wireframes/comparacoes/v3.3.0-2026-10-24-totais-navegacao/index.html).
