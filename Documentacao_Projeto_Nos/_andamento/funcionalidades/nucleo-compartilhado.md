# Núcleo compartilhado — v1.0.0

**Modelo implementado localmente — v1.0.0 — 14/10/2026:** [administração e participação](administracao-participacao.md) é o contrato vigente. Administração compartilhada, escolha individual, novo aceite por versão, saída com história preservada e preferência de autoria estão implementados. Sem votação coletiva ou cancelamento de acordo por saída. [Manual de teste](administracao-manual.md). Publicação, migração remota e operação do piloto permanecem pendentes.

## Histórico do modelo anterior — até v0.16.0

Os contratos e marcos abaixo são preservados para rastreabilidade; não representam as regras atuais dos Núcleos/acordos.

Atualizado em 2026-10-13. MVP 02 concluído no recorte funcional local; publicação e migração remotas pendentes. Conta confirmada é pré-requisito; operação externa da etapa 01 continua pendente.

## Fluxos e permissões

Criador: Conta → Seus Núcleos (12) → Tipo (07), ou escolha opcional (06) → Propósito/conferência (08) → criação explícita → convite inicial/compartilhamento (09/58, mesma rota) → Início (13). Gerenciar (59) é opcional e acessível pelo convite ou Início. Quem já participa abre diretamente o Núcleo escolhido.

Pessoa convidada: lista/escolha → código (10) → prévia restrita (11) → aceite explícito → Início (13) → lista (12). Conferir ou adiar não cria vínculo; aceitar não aprova acordos. Cadastro/confirmação e recuperação preservam retorno interno, inclusive gestão com status/página; parâmetros arbitrários e códigos são rejeitados.

Criação e associação do criador ocorrem na mesma transação. Nome e propósito permanecem locais até confirmar, sem URL ou persistência de rascunho. Nove tipos validados; retorno ao tipo preserva seleção. Lista/Início exigem vínculo real; sair da conta não remove associação.

## Gestão de convites

`/nucleos/[id]/convites`, somente criador associado. Consulta com RLS (segurança por linha) e sem selecionar códigos. Ativos, expirados e revogados são filtros mutuamente exclusivos, com prioridade para revogação. Ordenação por criação/ID e paginação de 20 itens + um para detectar próxima página. Datas usam UTC explícito.

Revogar exige confirmação. Cancelar não grava. Server Action valida IDs/sessão/confirmação; RPC revalida papel/contexto. Repetir preserva a primeira data. Revogar impede novos aceites e não remove membros, registros ou acordos. Não há inferência de aceite por silêncio.

Geração bloqueia a linha do Núcleo e reutiliza código ativo para evitar duplicação concorrente. Aceite bloqueia a linha do convite; revogação atualiza a mesma linha. Quem obtém primeiro o bloqueio determina a ordem: se revogar primeiro, aceite é negado; se aceitar primeiro, vínculo é criado antes da revogação e permanece. Expiração é reconferida após aguardar. Privilégios estreitos, `SECURITY DEFINER SET search_path=''`, sem segredo no cliente.

Convite inicial mostra expiração real, cópia explícita e compartilhamento nativo com alternativa. Cancelamento do compartilhamento recebe mensagem própria. Erros de consulta não simulam lista vazia; erro/carregamento da gestão têm limites próprios. Botões bloqueados durante envio e movimento reduzido seguem o CSS existente.

## Reservas e operação

QR/câmera/link, destinatários individuais, administradores e histórico de uso por convite permanecem planejados nas Telas 09/58/59 e entrada 10. Código é reutilizável por mais de uma pessoa: categoria Aceitos não pode ser preenchida sem novo contrato/rastreabilidade. A gestão atual atende ativos/expirados/revogados; remoção de membros é outro contrato.

Migração `20261013150000_manage_nucleus_invitations.sql` aplicada somente no contêiner local; histórico local alinhado após aplicação SQL com `migration repair --local`. Antes de usar online: revisar migração em ambiente de desenvolvimento autorizado, aplicar via CLI, publicar aplicação e repetir jornada com duas contas. Sem alteração remota nesta entrega. SMTP/recebimento externo e recuperação continuam com dependências próprias.

## Validação e teste manual

Testes locais cobrem duas identidades, conferência sem escrita, aceite/retorno/F5/isolamento, cancelamento/revogação/novo código, geração paralela, paginação 20/1/20 e duas ordens de concorrência com bloqueios comprovados por `pg_stat_activity`. Banco confirma privilégios, expiração, contexto e preservação de data/membros. Não foi provocada indisponibilidade real de banco ou clipboard do dispositivo; tratamento verificado por leitura e Atlas.

1. Entrar com conta confirmada; criar Núcleo e conferir/editar antes de gravar.
2. Gerar/copiar código; conferir expiração. Na gestão, cancelar uma revogação e conferir que código continua ativo.
3. Em outro navegador/conta, conferir e aceitar. Recarregar e reencontrar na lista; gestão não aparece nem permite acesso direto ao participante.
4. No criador, revogar e conferir filtro Revogados. Membro continua associado; novas tentativas com código antigo são negadas.
5. Gerar outro código; testar filtros, retorno ao Início e movimento reduzido em 320px. Não registrar códigos em capturas.

[Plano](../planos/mvp-02-nucleo.md) · [Comparação visual](../../wireframes/comparacoes/v0.15.0-2026-10-13-mvp-02-tela_09-tela_13-tela_58-tela_59/index.html) · [Verificador do Atlas](../../wireframes/tools/verify-mvp-nucleus.mjs).
