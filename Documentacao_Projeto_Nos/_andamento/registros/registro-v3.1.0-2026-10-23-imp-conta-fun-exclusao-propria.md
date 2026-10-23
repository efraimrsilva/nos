# Registro — v3.1.0 — 2026-10-23 — Imp. de conta com Fun. de exclusão própria

**Status:** publicado e validado em produção em23/10/2026; migração remota aplicada e dados anteriores preservados.

## Objetivo, contexto e requisitos

Oferecer exclusão da própria conta em Conta e segurança. O usuário pediu sinalização vermelha e uma frase de duas palavras e aprovou preservar o histórico compartilhado como Conta excluída, removendo acesso e identificação. O contrato anterior encaminhava toda exclusão ao suporte. A entrega é MINOR compatível: 3.0.6 → 3.1.0.

## Decisões e integrações

- Mesma interface nas origens Conta, Configurações e rota direta, com ícone de alerta, descrição e vermelho. Confirmação exata APAGAR CONTA validada no formulário, ação e banco. Cancelar/Escape/X limpam a frase; envio bloqueia repetição.
- RPC `delete_my_account(text)` obtém somente `auth.uid()`, bloqueia a conta e os Núcleos em ordem determinística e reutiliza a saída existente. Não aceita ID de terceiros. Sucessão administrativa e encerramento do último participante permanecem transacionais.
- Referências históricas recebem ON DELETE SET NULL. Quatro tabelas de respostas ganham chave própria e mantêm unicidade dos pares para contas existentes, preservando várias respostas de contas excluídas.
- Exclui Auth, identidade, sessões e preferências; remove vínculos/nomeações e revoga convites criados pela pessoa. Conteúdo compartilhado permanece. Momentos mostram Conta excluída; agenda separa respostas históricas dos indicadores atuais.
- A prévia de convite passa a conferir existência da conta para recusar token antigo. Após sucesso, cookies locais são limpos e a pessoa retorna à Conta com mensagem de conclusão.
- Guarda explícita de Storage impede apagar a conta com arquivos associados. Erro de transporte não é apresentado como prova de que o banco deixou de concluir.

## Arquivos principais

`src/features/controls/account-deletion-input.ts`, `delete-account-action.ts`, componentes `delete-account-form.tsx` e `delete-account-option.tsx`, `settings-content.tsx`, `accounts-layout.css`; páginas Conta e detalhe de acordo; `calendar-workspace.tsx`; migração `20261023120000_delete_own_account.sql`; testes unitário, autenticado e pgTAP; limpeza de fixtures já excluídas. Atlas (`screens.js`, `product-ui.js`, `mvp-plan.js`), cobertura, inventário de modais, contrato de autonomia, manifestos, estado, histórico e Brag alinhados.

## Validações e revisão

- 38 verificações pgTAP novas e 105 existentes: 143 aprovadas no PostgreSQL local. Frase, autorização, rollback provocado no fim da operação, sessões, token antigo, sucessão, fechamento, histórico, duas contas excluídas e restrição de Storage cobertos. As fixtures SQL usam rollback.
- Teste novo autenticado aprovado em desktop e celular: opção vermelha, frase errada/correta, cancelamento, Escape/reabertura limpa, exclusão real de conta descartável, redirecionamento, proteção posterior, história da outra pessoa e situação da agenda. Dez testes autenticados existentes de administração/saída/encerramento também aprovados.
- Suíte geral: 130 testes aprovados com um worker. Tipos aprovados. Build webpack autenticado aprovado em cópia temporária com fontes e recursos conferidos por SHA-256. Tipos e build padrão Turbopack aprovados diretamente no repositório.
- Verificador novo do Atlas e Visão global aprovados em desktop/mobile; sintaxe JavaScript aprovada. Verificador legado `verify-mvp-controls.mjs` não aprovado: tenta clicar em navegação oculta da Tela12 no layout vigente. A entrega não modificou essa composição; o teste específico cobre a nova confirmação. Não foi alterado o verificador antigo fora do escopo.
- Autorrevisão e revisão independente realizadas. P2 de respostas excluídas influenciando presença/rótulos da agenda corrigido. Teste de regressão com resposta declined falhou antes e passou depois. Teste também reproduziu retenção da frase após Escape antes da correção. Uma asserção de texto exato foi ajustada porque o elemento também contém a data.

## Resultado, limites e próximos passos

Entrega local funcional. Galeria inspecionada em desktop/celular: [capturas](../../wireframes/comparacoes/v3.1.0-2026-10-23-exclusao-conta/index.html). [Contrato e roteiro manual](../funcionalidades/exclusao-conta.md).

Banco do Docker restaurado e migração aplicada/transacionada localmente; histórico local registrado. Após autorização de produção, migração aplicada também no Supabase remoto e código publicado. Nenhuma conta real de uso apagada. Textos podem identificar a pessoa; retenção e backups não são apagados imediatamente. Exclusões simultâneas com múltiplas conexões não foram certificadas especificamente; regras existentes de saída concorrente passaram.

Próximo passo: uso acompanhado e evolução separada dos procedimentos de retenção/backups. Publicação, atualização de esquema e prova com contas descartáveis concluídas conforme evidências abaixo. Não testar apagando conta real de uso.

## Ferramentas

Superpowers: entendimento, planejamento proporcional, TDD, depuração, revisão e verificação. Context7: documentação oficial Supabase sobre exclusão de Auth, sessões/JWT e tratamento de Storage, sem correspondência exata de versão do SDK 2.117.2 indexada. Octocode19.1.0 já configurado; ferramenta não exposta nesta sessão, sem pesquisa avançada entre repositórios necessária. Não houve instalação adicional de dependências do projeto.

## Publicação autorizada e concluída em23/10/2026

Usuário autorizou produção. Projeto Netlify noslife e Supabase vinculado conferidos. Referência de preservação de15 tabelas salva somente com contagens/hashes; nova migração era a única pendente no dry-run e foi aplicada com sucesso no remoto, totalizando dez. Código8afecb27da700bc064112713dea0268a5caf0d93 enviado para origin/main e hash remoto confirmado. Netlify publicou deploy6adae350fa2928885a0de2c8, contexto production, estado ready, sem erro, às04:32:53UTC (01:32:53 no fuso do usuário). Commit do deploy conferido. Verificador online exige --production e referência do projeto; não imprime credenciais e limita limpeza aos identificadores criados nesta execução.

**Prova online final:** script executado com autorização, --production, TLS com certificados do sistema e credenciais somente em memória. Desktop e celular aprovados: opção vermelha, frase exata, frase incorreta bloqueada, cancelamento, exclusão pelo formulário, mensagem final, rota protegida bloqueada, sucessão administrativa, momento como Conta excluída e agenda confirmada sem interferência da resposta histórica recusada. Quatro contas descartáveis foram criadas e removidas. Núcleos/dados descartáveis limpos por UUIDs específicos. Contagens/hashes das15 tabelas coincidiram com a referência anterior à migração. Dez migrações, RPC presente, authenticated permitido e anon negado. Capturas de produção incluídas na galeria.

**Revisão do verificador online:** revisão independente identificou que uma falha inicial de limpeza impediria as seguintes; corrigido antes da execução, tentando todas as limpezas e preservando UUIDs descartáveis para recuperação dirigida. Execução concluiu sem erro e sem resíduos. As evidências documentais finais são commitadas separadamente com [skip netlify], pois não alteram o código publicado.
