# Registro — v3.10.0 — 2026-11-07 — Imp. de publicação com Fun. de notificação de contas

**Status:** Em andamento. Usuário autorizou commit e push de todas as alterações, com descrição abrangente e reaproveitamento dos testes para economizar créditos. A regra permanente do projeto inclui acompanhamento da publicação em produção nesse pedido.

## Objetivo, escopo e contexto

Publicar o conjunto 3.10.0 na `main` de `efraimrsilva/nos`: aviso administrativo de novas contas com somente nome/e-mail, fila privada, assinatura temporária, receptor, transporte SMTP compartilhado, tentativas/deduplicação, testes, configuração de exemplo, documentação, versão e Atlas. Base `22e2304`; `git fetch origin` confirmou inicialmente zero commits de diferença entre local/remoto. Alterações anteriores desta funcionalidade preservadas.

## Decisões e arquivos

Um commit funcional completo, com título descritivo e corpo detalhando escopo e evidências; sem marcador para pular o deploy funcional. Nenhuma nova suíte ou build local será repetido sem falha nova. Conferir diff/índice/manifestos e exclusão de arquivos de ambiente/credenciais. [Registro da implementação](registro-v3.10.0-2026-11-07-imp-notificacao-cadastro-fun-aviso-email.md) contém arquivos e contratos. Eventual encerramento exclusivamente documental após deploy pode usar `[skip netlify]` para evitar segundo build.

Conferência identificou simplificação concorrente do início do README, removendo três informes antigos de acesso/publicação. Alteração preservada conforme pedido de publicar todas as mudanças; versão3.10.0 e links de configuração/andamento mantidos em uma indicação curta abaixo do título, sem restaurar os informes removidos.

## Validações reaproveitadas

Oito testes do receptor,25 verificações novas do banco e49 existentes; integração SMTP/Mailpit local em desenvolvimento e build de produção, geração de tipos/TypeScript/build Webpack e revisão independente aprovados. Limites do teste legado de confirmação e advisors preservados no registro da implementação. Nesta operação, apenas verificações de publicação e resultado hospedado, sem alegar nova suíte.

## Integrações e limitações

GitHub remoto conferido; Netlify `noslife` com publicação automática na `main`. Conectores Netlify/Supabase retornaram indisponíveis; painel Netlify autenticado acessível como alternativa. Recebimento externo e ativação administrativa ainda dependem da configuração de runtime/Vault/migração no destino; não confundir código publicado com avisos ativos. Nenhum segredo em registro ou commit.

## Próximo passo

Criar/conferir objeto Git, enviar e confirmar referência remota, acompanhar deploy funcional e conferir site público. Registrar identificadores e status reais da configuração/ativação, preservando eventuais dependências externas.
