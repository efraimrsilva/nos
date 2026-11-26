# Registro — v4.0.1 — 2026-11-26 — Imp. da configuração Netlify com Fun. de remoção do runtime Next.js

**Status** Configuração do painel concluída. Migração das variáveis legadas e publicação pendentes.

## Objetivo, escopo e decisão

Remover o runtime Next.js e o destino .next do projeto noslife. O painel tinha configurações distintas das efetivas em netlify.toml. Foi salvo o comando base Angular, o destino apps/web/dist/nos-web/browser e apps/web/netlify/functions, com o campo Runtime vazio. O contexto de produção continua definido em netlify.toml.

## Arquivos e integração

A flag NETLIFY_NEXT_PLUGIN_SKIP foi removida da configuração local. Versão 4.0.1 preservada para o ajuste de hospedagem. O Angular publicado ainda usa NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. O código lê chaves distintas de serviço e assinatura ao ativar a configuração Angular explícita. As variáveis de produção foram preservadas para manter a compatibilidade da publicação atual.

## Evidência e próximo passo

Configuração salva e reconferida no [painel do Netlify](https://app.netlify.com/projects/noslife/configuration/developer-settings). Os 20 testes de integração locais passaram. A limpeza local ainda depende de envio. Para completar a migração, provisionar os quatro valores Angular equivalentes nos escopos corretos, publicar e testar Conta e funções. Após esse aceite, retirar o fallback e as duas variáveis NEXT_PUBLIC do site.
