# Proposta de Hábito — Percurso 05 — v1.0.0

**Fluxo completo aprovado — v1.1.0 — 18/10/2026:** [Proposta → Hábito → Experiência → Essência](fluxo-proposta-habito-experiencia-essencia.md) é a sequência obrigatória da evolução da pessoa. Propor Experiência diretamente pertence ao modelo implementado anterior. Critérios das três passagens, dados individuais, adequação do código e legado pendentes; marcos históricos abaixo preservados.

**Modelo implementado localmente — v1.0.0 — 14/10/2026:** [administração e participação](administracao-participacao.md) é o contrato vigente. Administração compartilhada, escolha individual, novo aceite por versão, saída com história preservada e preferência de autoria estão implementados. Sem votação coletiva ou cancelamento de acordo por saída. [Roteiro de testes de caixa preta](administracao-caixa-preta.md). Publicação, migração remota e operação do piloto permanecem pendentes.

## Histórico do modelo anterior — até v0.16.0

Os contratos e marcos abaixo são preservados para rastreabilidade; não representam as regras atuais dos Núcleos/acordos.

Referência funcional: **v0.14.0**, recorte disponível concluído em 2026-10-10. DOCS_DIR: Documentacao_Projeto_Nos.

## Caminho disponível e aceite

18 — Acordos → 22 — conferência do formulário → 23 — respostas no hub → 24 — detalhe após o último aceite.

18, 22 e 23 são seções/estados de `/nucleos/[id]/acordos`. A nova conferência é local: preencher, conferir e editar não executam gravação. Enviar usa a Server Action existente e a RPC (Remote Procedure Call, chamada de função no banco) `create_nucleus_agreement`. A função valida associação, termos, categoria e prazo, exige ao menos duas pessoas e inclui os membros atuais do Núcleo. O autor aceita ao enviar; outras respostas começam pendentes.

Cada participante original responde somente por si por `respond_nucleus_agreement`. A consulta sob RLS (Row Level Security, segurança por linha) não revela respostas individuais de terceiros. Aceites parciais conservam `pending`; o último aceite unânime inicia `testing` e o prazo real, de 7 a 30 dias. Uma recusa encerra como `declined`; cancelar a confirmação da recusa não grava. `testing` não equivale a `active`: confirmação pós-teste pertence ao Percurso 06.

O formulário conserva os campos ao editar e quando a ação retorna erro. Conferência recebe foco e editar devolve foco ao título. Botões de envio/edição ficam bloqueados enquanto a ação está em andamento. A interface de conferência depende de JavaScript; validação e autorização continuam obrigatórias no servidor. Não há promessa de idempotência entre requisições independentes: identificador persistente de envio ainda precisa de contrato próprio.

## Espaço reservado e sequência futura

18 → **19 necessidade** → **20 proposta guiada** → **21 compreensão** → **22 conferência integrada** → 23 respostas → 24 teste.

- **19 — Planejada:** definir dados e persistência da necessidade, autoria, privacidade e retenção do rascunho.
- **20 — Planejada:** os termos básicos já existem no hub; rota `/novo`, integração entre etapas e seleção individual de participantes não existem. Seleção exige regras de autorização e de congelamento do conjunto original.
- **21 — Planejada:** definir destinatários, compartilhamento explícito, compreensão estruturada e respostas assíncronas. Não transformar em chat nem em aceite implícito.
- **22 — Recorte existente:** conferência dentro do hub concluída nesta entrega; rota e integração com 19–21 ainda futuras.
- **23 — Recorte existente:** respostas no hub; central unificada, abas “Enviados por você/Aguardando você”, notificações e conversa preparada não implementadas.
- **24 — Recorte existente:** detalhe após unanimidade; reflexões, impacto, progresso e evento associado continuam pendentes, fora desta entrega.

Novas pessoas não entram retroativamente na proposta. Saída de participantes e novos ciclos seguem os contratos vigentes do banco; não inferir consentimento a partir de silêncio ou de respostas visíveis sob RLS.

## Validação e teste de caixa preta

Validação local: 92 testes gerais; 4 casos autenticados desktop/celular e 1 comparador completo; 5 arquivos/6 testes SQL (Structured Query Language, linguagem de consulta do banco); tipos/build, Percurso 05 e Visão global. Aceite e recusa foram exercitados pela interface, incluindo cancelar a recusa. [Registro da entrega](../registros/registro-v0.14.0-2026-10-10-imp-proposta-habito-fun-percurso-05.md).

Para testar manualmente com duas contas autorizadas no mesmo Núcleo:

1. Abrir Acordos/Hábitos, preencher compromisso, descrição, momento, frequência e prazo de 7–30 dias.
2. Conferir: verificar o resumo e retornar por Editar proposta. Nenhuma proposta deve aparecer antes de Enviar para aprovação.
3. Enviar: o autor vê que aceitou e aguarda as outras pessoas. A outra conta vê os mesmos termos e responde por si.
4. Aceitar na outra conta: o Hábito passa a Em teste e permite abrir o detalhe. Não deve aparecer como ativo.
5. Criar outra proposta, cancelar a confirmação de recusa e verificar que continua pendente; depois confirmar a recusa e verificar Proposta recusada.
6. Com um Núcleo de uma pessoa, tentar enviar; conferir erro e preservação dos termos ao editar. Trocar para Experiência não deve exigir prazo de Hábito.

Próximo passo executável: definir os contratos de necessidade/compreensão antes de implementar o fluxo guiado e a rota `/novo`. Não há migração nem alteração remota nesta entrega.
