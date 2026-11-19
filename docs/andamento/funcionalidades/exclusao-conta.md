# Exclusão da própria conta — v3.1.0

## Contrato aprovado em 23/10/2026

A pessoa autenticada encontra **Apagar minha conta** em vermelho, com ícone e descrição de perigo, em Conta e segurança. O mesmo conteúdo é reutilizado pela Conta conectada, Configurações e `/configuracoes/conta`. O diálogo exige a frase exata **APAGAR CONTA**, sem espaços adicionais ou alteração de maiúsculas. Cancelar, X e Escape fecham a confirmação e limpam a frase. O envio bloqueia repetição, mostra processamento e apresenta erro sem expor detalhes internos.

A frase é uma confirmação de intenção, não uma credencial. A ação de servidor valida a frase e consulta a identidade pelo Auth. A RPC `delete_my_account(confirmation_phrase text)` usa exclusivamente `auth.uid()`; não existe argumento para excluir terceiros. Anônimos não recebem permissão de execução. A existência da conta é conferida sob bloqueio antes da operação.

## Efeito da confirmação

- Exclui a linha de Auth e, pelas cascatas oficiais, sessões, identidades e credenciais associadas. Remove preferências e vínculos de participação.
- Sai de todos os Núcleos na mesma transação, reutilizando `depart_nucleus_member`: se não restar administrador, sorteia alguém; se não restar participante, encerra o Núcleo e revoga seus convites.
- Revoga convites criados pela pessoa, inclusive em Núcleos dos quais já saiu, e remove nomeações pendentes relacionadas à conta.
- Conserva Núcleos, acordos, eventos, momentos, revisões e respostas históricas. As referências à conta passam a NULL. Quatro tabelas de respostas ganham uma chave própria, preservando a unicidade para contas existentes e permitindo mais de uma resposta com conta excluída.
- Momentos mostram **Conta excluída**. A agenda distingue criador excluído e respostas históricas; essas respostas não contam como presença atual nem influenciam os avisos de confirmação/remarcação.
- Textos permanecem e podem identificar a pessoa. O fluxo não promete anonimato completo, remoção imediata de backups ou eliminação de conteúdo pertencente a terceiros.
- Uma conta nova exige novos convites e aceites; não recupera vínculos anteriores.

## Atomicidade e sessões

A exclusão é uma transação: uma falha final reverte também saídas, sucessão, encerramento e revogações. Em erro de transporte, a interface orienta conferir a sessão antes de repetir; não afirma que uma operação de resultado desconhecido falhou no banco.

Tokens de acesso já emitidos podem permanecer válidos até expirar. As associações removidas impedem consultar ou gravar dados dos Núcleos, e `inspect_invitation`, que não depende de associação, também verifica a existência da conta. O servidor consulta `auth.getUser()`; os cookies locais são limpos após o sucesso. O retorno é `/conta?resultado=conta-excluida`.

## Arquivos e retenção

O aplicativo ainda não oferece uploads. Como SQL direto não verifica a propriedade de objetos de Storage automaticamente, a função recusa a exclusão se houver arquivos associados por `owner` ou `owner_id`. O formulário orienta buscar ajuda. Esses arquivos precisam ser tratados pela API de Storage, nunca removidos apenas por SQL. Essa restrição é testada com metadados descartáveis locais. Políticas operacionais de retenção, backups e solicitações sobre conteúdo identificável continuam exigindo definição própria.

## Validação e publicação

Testes pgTAP verificam autorização, frase, rollback, sucessão, fechamento, preservação de respostas, duas exclusões sucessivas, sessões e token antigo. O teste autenticado usa duas contas locais em computador e celular e verifica exclusão pelo formulário, cancelamento, limpeza ao reabrir, bloqueio posterior e história disponível à outra pessoa. Dados temporários são removidos por identificadores específicos.

Migração: `supabase/migrations/20261023120000_delete_own_account.sql`. Aplicada ao Docker local e, após autorização em23/10/2026, ao Supabase de produção. Para produção, aplicar a migração antes de publicar o código que usa o novo retorno da agenda; conferir a atualização do cache de esquema. Não executar a exclusão de uma conta real como teste. Publicação e migração remota foram autorizadas e concluídas em23/10/2026; nova execução de verificação destrutiva depende de autorização própria.

## Roteiro de testes de caixa preta

1. Usar uma conta descartável em ambiente local com a migração aplicada.
2. Abrir Conta → Conta e segurança → Apagar minha conta; conferir vermelho, ícone e consequências.
3. Digitar uma frase incorreta: botão permanece desabilitado. Digitar APAGAR CONTA: botão habilita.
4. Cancelar ou pressionar Escape; reabrir e conferir o campo vazio e a conta preservada.
5. Confirmar a exclusão; conferir mensagem de sucesso e bloqueio de rotas protegidas.
6. Pela outra conta do Núcleo, conferir a sucessão, o histórico como Conta excluída e a agenda sem presença atual da conta apagada.

## Evidência de produção — 23/10/2026

Commit8afecb2, deploy Netlify6adae350fa2928885a0de2c8 em noslife.netlify.app. Dez migrações remotas. Duas jornadas online (desktop/celular) aprovadas, quatro contas descartáveis removidas e dados anteriores preservados em15 tabelas. Verificador: scripts/verify-account-deletion-online.mjs; exige --production, projeto fixo e referência prévia de hashes. Nenhuma conta real apagada.
