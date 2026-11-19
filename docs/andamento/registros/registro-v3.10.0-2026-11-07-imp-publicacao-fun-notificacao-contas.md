# Registro — v3.10.0 — 2026-11-07 — Imp. de publicação com Fun. de notificação de contas

**Atualização posterior:** ativação retomada e concluída com aceite SMTP; consultar [registro operacional](registro-v3.10.0-2026-11-07-imp-ativacao-fun-notificacao-contas.md). O relato de interrupção e pendências abaixo preserva o estado daquela publicação.

**Status:** Código enviado ao GitHub e publicado em produção; ativação dos avisos pendente. Usuário autorizou commit e push de todas as alterações, com descrição abrangente e reaproveitamento dos testes para economizar créditos. A regra permanente do projeto inclui acompanhamento da publicação em produção nesse pedido.

## Objetivo, escopo e contexto

Publicar o conjunto 3.10.0 na `main` de `efraimrsilva/nos`: aviso administrativo de novas contas com somente nome/e-mail, fila privada, assinatura temporária, receptor, transporte SMTP compartilhado, tentativas/deduplicação, testes, configuração de exemplo, documentação, versão e Atlas. Base `22e2304`; `git fetch origin` confirmou inicialmente zero commits de diferença entre local/remoto. Alterações anteriores desta funcionalidade preservadas.

## Decisões e arquivos

Um commit funcional completo, com título descritivo e corpo detalhando escopo e evidências; sem marcador para pular o deploy funcional. Nenhuma nova suíte ou build local será repetido sem falha nova. Conferir diff/índice/manifestos e exclusão de arquivos de ambiente/credenciais. [Registro da implementação](registro-v3.10.0-2026-11-07-imp-notificacao-cadastro-fun-aviso-email.md) contém arquivos e contratos. Eventual encerramento exclusivamente documental após deploy pode usar `[skip netlify]` para evitar segundo build.

Conferência identificou simplificação concorrente do início do README, removendo três informes antigos de acesso/publicação. Alteração preservada conforme pedido de publicar todas as mudanças; versão3.10.0 e links de configuração/andamento mantidos em uma indicação curta abaixo do título, sem restaurar os informes removidos.

**Orientação posterior do usuário:** não registrar versões no README da raiz. A indicação curta também foi retirada, assim como o informe restante de entrega anterior; a obrigação antiga foi substituída no AGENTS.md. [Registro da regra permanente](registro-v3.10.0-2026-11-07-imp-diretrizes-readme-fun-versionamento-documental.md).

## Validações reaproveitadas

Oito testes do receptor,25 verificações novas do banco e49 existentes; integração SMTP/Mailpit local em desenvolvimento e build de produção, geração de tipos/TypeScript/build Webpack e revisão independente aprovados. Limites do teste legado de confirmação e advisors preservados no registro da implementação. Nesta operação, apenas verificações de publicação e resultado hospedado, sem alegar nova suíte.

## Integrações e limitações

GitHub remoto conferido; Netlify `noslife` com publicação automática na `main`. Conectores Netlify/Supabase retornaram indisponíveis; painel Netlify autenticado acessível como alternativa. Recebimento externo e ativação administrativa ainda dependem da configuração de runtime/Vault/migração no destino; não confundir código publicado com avisos ativos. Nenhum segredo em registro ou commit.

## Próximo passo

Commit funcional `fe4f1353431cbc4fa6d04390b885f6facdef54f8` com19 arquivos conferido no objeto Git e enviado à `main`; referência remota confirmada. Título e corpo abrangem fila/gatilho, HMAC, receptor, SMTP, retries/deduplicação, dados mínimos, testes, configuração, documentação, versão e Atlas.

Netlify confirmou `Published` na produção/main desse commit, deploy `6aeeb3b6ed474f1e2766bcc0`. Nenhuma suíte/build local repetida nesta operação; build da hospedagem executado pelo deploy. Sem nova alegação de recebimento externo.

Usuário autorizou explicitamente configurar os novos segredos no Netlify e ativar a integração. Projeto Supabase `nos-dev`/`pyvohqgcwkcfzbtkmbvx` conferido pela Management API: ativo,17 migrações, schema `private` ausente, `pg_net`/`pg_cron` disponíveis e ainda não instalados. Chave administrativa existente e novo segredo de assinatura preparados em arquivo temporário ignorado pelo Git, sem imprimir valores. O navegador foi interrompido pela tecla Escape antes de importar o arquivo; nenhuma variável nova foi gravada no Netlify e nenhuma migração/Vault remoto foi aplicado. Arquivo temporário de credenciais e auxiliar operacional removidos ao encerrar. Não retomar controle de navegador automaticamente após essa interrupção.

**Próximo passo executável:** quando o usuário retomar a configuração, concluir importação dos dois segredos somente em produção, aplicar a migração específica, publicar runtime atualizado e configurar Vault por último, conforme contrato. A autorização de configuração já foi dada; não solicitá-la novamente sem mudança de escopo. Uma nova publicação será necessária para incorporar as variáveis ao runtime. Criar conta controlada e confirmar recebimento externo somente depois da ativação. Encerramento documental com regra do README e estado real usa `[skip netlify]`, evitando build redundante de documentos.
