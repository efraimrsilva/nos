# Registro — v1.1.0 — 2026-10-15 — Imp. de correção online com Fun. de encerramento do Núcleo

**Status:** correção operacional concluída e verificada online. Versão1.1.0 preservada; não houve alteração de código nem nova funcionalidade. Solicitação: investigar a impossibilidade de encerrar um Núcleo já existente após a publicação Git.

## Diagnóstico e causa

O Netlify confirmou o commit `6efc4c00d56b50c45cdb8fba11dd272ae82204f2` publicado no deploy `6ad17f6c7f65114f0602d866`. O banco remoto tinha oito migrações: `close_nucleus(uuid,text)` não existia e não havia registro da migração20261015120000. O aplicativo oferecia o controle novo, mas sua ação não podia executar a função ausente. Publicar código no GitHub não aplica as migrações do Supabase.

Consulta inicial do banco: um Núcleo e dois vínculos existentes. Nenhum desses vínculos ou Núcleo foi encerrado para investigar.

## Correção e preservação

Aplicada exclusivamente `supabase/migrations/20261015120000_close_nucleus.sql` por meio da API oficial de gerenciamento do Supabase, com credencial existente no cofre do Windows, sem expor valores. Uma transação validou o histórico esperado, adquiriu a trava administrativa de migrações, criou a função/permissões e inseriu o registro com o conteúdo original. Cache do PostgREST atualizado com `NOTIFY pgrst, 'reload schema'`, conforme documentação oficial consultada pelo Context7.

Conferência posterior: nove migrações, função existente, execução concedida a `authenticated` e negada a `anon`. Conteúdo remoto da migração idêntico ao arquivo versionado. Impressões digitais dos registros de Núcleos, vínculos, convites, acordos, momentos e eventos comparadas antes/depois da migração: iguais. Essa alteração de esquema não encerra espaços por si só.

Não houve deploy manual, alteração de código, reset do banco, redução de autenticação ou encerramento do Núcleo real. A implantação automática existente já continha a interface compatível.

## Validação online

Oito grupos aprovados com duas contas confirmadas e Núcleo descartáveis:

1. Login das duas contas pelo formulário publicado.
2. Criação de Núcleo, convite, acordo, momento e evento temporários.
3. Participante comum sem controle administrativo; chamada direta de encerramento negada.
4. Formulário publicado rejeita nome incorreto e mantém o Núcleo aberto.
5. Ação de servidor exige ciência explícita mesmo sem validação nativa do navegador.
6. Confirmação correta pelo formulário retorna a Seus Núcleos com mensagem de sucesso.
7. Ambas as pessoas perdem acesso; o Núcleo deixa de aparecer nas listas e o convite antigo não permite retorno.
8. Consulta ao banco confirma `closed_at`, ausência de vínculos/convites ativos e preservação de acordo, momento e evento.

Verificação combinou formulários HTTP reais, consultas das páginas publicadas, chamadas autenticadas e conferência de armazenamento. Não foi uma execução integral por cliques no navegador. Credenciais das contas descartáveis ficaram somente na memória do processo. Scripts e resultados operacionais estão em `artifacts/`, ignorado pelo Git; não contêm chaves gravadas em texto.

Após o teste, somente a fixture descartável foi removida. Conferência final: um Núcleo e dois vínculos reais, nove migrações e zero contas temporárias `closure-*`. A limpeza não utilizou seleção ampla de Núcleos reais.

## Arquivos, revisão e limites

Fontes, migração versionada e manifestos permaneceram iguais ao commit publicado. Atualizados apenas registros: estado, histórico, README, manual, contrato, Brag e este documento. Autorrevisão da operação e resultados e `git diff --check` aprovado; não houve nova revisão independente ou repetição de build/testes locais, pois não houve mudança de fontes. As validações locais da implementação permanecem no registro anterior.

O comportamento aprovado é **encerrar para todos preservando o histórico**, não excluir fisicamente. Não existe reabertura pelo aplicativo. Este teste não certifica SMTP, recuperação externa, backup/restauração integral ou demais controles do piloto.

## Resultado e próximo passo

Encerramento pelo aplicativo publicado comprovado com fixture. Usuário pode atualizar a página, entrar como administrador e confirmar o nome atual em Pessoas e administração → Encerrar Núcleo para todos. A decisão de encerrar o Núcleo real permanece com o usuário.

Registros operacionais prontos para commit, sem novo commit/push nesta interação. Sugestão: `docs(deploy): registrar correção e validação online do encerramento`.
