# Plano — v3.1.0 — Exclusão da própria conta

Desenho aprovado em 23/10/2026: opção vermelha em Conta e segurança; confirmação exata `APAGAR CONTA`; exclusão do acesso e identificação, saída de todos os Núcleos, sucessão/encerramento existentes e histórico preservado como Conta excluída. Textos podem identificar a pessoa. Inicialmente sem publicação; usuário autorizou produção durante a conclusão em23/10/2026. Prova remota restrita a contas descartáveis.

## Execução e aceite

- [x] Criar testes de confirmação, autorização, preservação e sucessão antes da implementação. Usar Playwright e pgTAP existentes, somente com contas descartáveis locais.
- [x] Migração `20261023120000_delete_own_account.sql`: referências históricas anuláveis, respostas preservadas com chave própria, função `delete_my_account(confirmation_phrase text)` sem identificador de terceiros. Validar frase e existência da conta; bloquear a conta e Núcleos; reutilizar `depart_nucleus_member`; excluir Auth na mesma transação. Rejeitar token de conta apagada na prévia de convite.
- [x] Formulário em `features/controls`, ação de servidor, estilos vermelhos e estados de processamento/erro/cancelamento. Reutilizar SecurityContent em Conta, Configurações e rota direta; redirecionar para Conta com resultado após sucesso.
- [x] Conferir histórico de momentos e agenda; diferenciar autoria oculta e conta excluída. Executar testes locais, tipos, build e revisão independente conforme skill requesting-code-review.
- [x] Sincronizar Atlas, ficha69, inventário de modais, contrato, estado, histórico e Brag. Incrementar MINOR somente após validação concluída; registrar limites remotos e pendência de commit.

## Riscos e limites

A migração não apaga conteúdo compartilhado nem dados de outras contas. Falhas devem reverter a transação. Tokens emitidos podem durar até expirar, mas vínculos são removidos e operações sem associação precisam negar conta inexistente. Storage não é utilizado pelo aplicativo; caso exista objeto associado, a restrição do Supabase deve abortar a exclusão sem limpar objetos por SQL. Backup e retenção externa não são apagados por este fluxo.

Publicação autorizada: migração remota aplicada antes do código; conferir deploy e hashes dos dados existentes no fechamento.
