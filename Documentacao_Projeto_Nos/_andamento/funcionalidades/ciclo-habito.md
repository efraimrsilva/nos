# Ciclo real de Hábito — MVP 03

Referência vigente v0.15.1, 2026-10-13. Recorte funcional local validado; fontes e banco local determinam o estado, não a contagem de telas.

## Telas e navegação

| Tela | Função disponível e contrato |
|---|---|
| 18 | Hub de Acordos: filtros reais, proposta de Hábito, mínimo de duas pessoas, prazo 7–30 dias. |
| 22 | Conferir/editar sem gravar; envio explícito registra aceite do autor e participantes atuais. |
| 23 | Resposta própria no hub. Último aceite unânime inicia teste; recusa encerra proposta. |
| 24 | Detalhe em teste, ativo ou encerrado; termos reais, resposta própria, acesso a registro/confirmação/revisão. |
| 27 | Humor obrigatório e nota opcional compartilhada com Núcleo, somente participante aceito em testing/active. |
| 25 | Histórico no detalhe: 20 por página, cursor created_at/ID, autoria relativa e UTC. |
| 28 | Período/ciclos na rota /confirmar. Banco libera após prazo; contagem autorizada, silêncio não vota. |
| 29 | Alternativa para legado sem prazo, na mesma rota /confirmar. Proposta de duração e unanimidade antes de iniciar; datas antigas não iniciam teste. |
| 30 | Revisar: termos atuais e uma solicitação pendente, sem alteração imediata do combinado. |
| 31 | Ajuste: termos propostos, unanimidade, sete dias e aplicação explícita. Novo teste com mesma duração e novos votos. |
| 32 | Encerramento: intenção explícita, unanimidade, sete dias e aplicação. Preserva histórico e bloqueia registro. |
| 33 | Pendência visível independentemente da página; resposta própria e prontidão agregada. Histórico concluído paginado por data/ID. |

Caminho principal: **18 → 22 → 23 → 24 → 27 → 25 → 28 → 24 ativo**. Se houver legado sem prazo: **24 → 29 → teste/prática → 28**. Revisão: **24 → 30 → 31 OU 32 → 33 → 24**; após encerramento, o detalhe preservado permite voltar ao hub e consultar Encerrados. Não é necessário percorrer ajuste e encerramento em sequência. As telas são estados, abas e formulários; não representam doze rotas independentes.

## Regras preservadas

Confirmação pós-teste: floor(N/2)+1 até 150 pessoas; ceil(N/3) acima de 150. Conjunto original fixo. Entrada posterior não concede voto retroativo; saída de original bloqueia sem reduzir o limiar. Revisão pendente bloqueia confirmação. Aceite inicial, legado, ajuste e encerramento continuam unânimes. RLS (segurança em nível de linha) expõe só resposta própria; RPC (chamada de procedimento remoto) agrega prontidão e valida vínculo/status/prazos na transação. Escritas bloqueiam Hábito antes de revisão.

Histórico de revisões lê primeiro os registros concluídos, depois a pendência atual. Como revisões concluídas não reabrem, a mesma solicitação não aparece com estados contraditórios durante uma transição concorrente. Uma decisão que muda depois da leitura exige atualizar; o banco rejeita ações obsoletas. Histórico é uma fotografia da consulta, sem atualização em tempo real.

Estado vazio, carregamento e erro reutilizam os limites do Núcleo; formulários já bloqueiam envio pendente e exibem erros/sucesso. Movimento reduzido continua respeitado nas microinterações existentes. Não há progresso, frequência praticada ou consentimento inferido por silêncio.

## Espaços reservados

No detalhe e Atlas vivo: reflexões/Impacto/Linguagens de cuidado (autoria, destinatários, consentimento, retenção); fotos/mídia protegida (armazenamento/acesso/remoção); evento associado (vínculo autorizado com agenda); Essência/Árvore (fontes e critérios próprios). Também permanecem planejados necessidade/compreensão guiadas, seleção individual, central unificada/notificações, conversa de cuidado e contexto adicional do encerramento. A interface registra intenção de encerrar; não persiste um motivo separado. Essas expansões são posteriores ao ciclo central.

## Teste manual

1. Duas contas confirmadas e associadas ao mesmo Núcleo abrem Acordos. Propor Hábito de 7–30 dias, conferir, editar e enviar. Conferir que apenas enviar grava.
2. Outra pessoa aceita. Conferir termos e datas no detalhe/confirmação. Antes do fim, o botão de confirmação permanece ausente.
3. Registrar humor e nota. Outra pessoa consulta a nota no histórico do mesmo Núcleo; uma conta externa não acessa.
4. Após o prazo real, confirmar por ambas as pessoas. Com duas pessoas o limiar é dois; apenas um Sim mantém testing.
5. Propor ajuste. Conferir antes/depois, aceitar por ambas, aguardar sete dias completos e aplicar. Conferir novo teste/zero votos antigos reutilizados e momentos preservados. Recusar uma revisão mantém os termos atuais.
6. Propor encerramento, aceitar, aguardar sete dias e aplicar. Conferir detalhe/históricos e filtro Encerrados; novo registro é bloqueado.
7. Com mais de vinte revisões concluídas, usar Revisões mais antigas e retorno. Pendência continua visível e bloqueia nova solicitação em qualquer página.

Testes automatizados antecipam datas somente em fixtures do Supabase local; não comprovam uma observação longitudinal de sete dias, recebimento externo de e-mail ou implantação online. Não editar datas reais para testar o piloto.

[Plano](../planos/mvp-03-habito.md) · [MVP vivo](../../wireframes/atlas/index.html#mvp) · [Confirmação](confirmacao-habito.md).
