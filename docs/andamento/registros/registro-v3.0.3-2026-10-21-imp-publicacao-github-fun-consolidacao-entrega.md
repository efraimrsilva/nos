# Registro — v3.0.3 — 2026-10-21 — Imp. de publicação GitHub com Fun. de consolidação da entrega

**Status:** fechamento documental autorizado para commit e push em main. Versão 3.0.3 preservada; nenhuma mudança funcional nova.

## Objetivo, contexto e requisitos

Publicar as alterações pendentes com uma descrição que abranja o trabalho desenvolvido até este momento. Base local e remota conferidas em 69c6eb8, sem divergência. O aplicativo completo já consta de f925c17; preparação da publicação em 8b529e8 e evidências do deploy/Atlas em 69c6eb8. Não reescrever os commits existentes.

## Escopo e decisões

Commit atual inclui registros de SMTP (protocolo de envio de e-mail) Brevo no Supabase, remetente verificado, confirmação e recuperação recebidas pelo responsável, segredo de recuperação configurado no Netlify, deploy operacional e limites da validação. Guia Gmail passa a histórico. Não incluir credenciais ou capturas privadas.

A descrição do commit distingue os arquivos novos da entrega acumulada já no histórico: reconstrução do layout e modais; árvore da Conta e frases de dez segundos; Acordos/Kanban/Painéis/lista/setas; Agenda com eventos sobrepostos; Pessoas/Convites/controles; correção TLS local; Atlas, esboços sinalizados, testes, galerias e publicação Netlify.

## Arquivos e integrações

README, estado, histórico, Brag, guia histórico Gmail, registro Brevo e este registro. Sem alteração de fontes, dependências, esquema ou serviços externos nesta interação. Push normal para origin/main, com conferência posterior de hash e conteúdo do commit. Mensagem com [skip netlify] porque o conteúdo é documental e o aplicativo já está implantado.

## Validações e revisão

Autorrevisão do diff completo, identificação dos arquivos pendentes, conferência de referências locais e git diff --check no conjunto preparado. Não repetir build/testes funcionais nem testes de envio de e-mail: nenhum código foi alterado. Evidências operacionais anteriores estão no [registro Brevo](registro-v3.0.3-2026-10-20-03-imp-envio-brevo-fun-autenticacao-email.md), sem alegar nova certificação nesta publicação.

## Resultado, limites e próximo passo

Os registros integram a mesma unidade documental deste commit; o hash final e a igualdade local/remoto serão informados após o push. A troca completa de senha pelo link, backup/restauração e liberação integral do piloto continuam pendentes. Próximo passo: validar o fluxo completo com conta própria. Não usar links da conta temporária removida.
