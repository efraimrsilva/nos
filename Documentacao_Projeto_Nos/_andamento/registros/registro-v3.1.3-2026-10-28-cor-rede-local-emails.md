# Registro — v3.1.3 — 2026-10-28 — Consulta de conta no ambiente local

O usuário relatou falha em Recuperar acesso e Confirmar e-mail no ambiente local e confirmou funcionamento em noslife.netlify.app. As mensagens eram de falha da consulta de conta, anterior à chamada de envio.

Diagnóstico: projeto ativo; SMTP Brevo configurado; 13 modelos remotos iguais às fontes. A consulta direta com a chave pública respondeu normalmente, mas o mesmo fetch dentro do Next.js local expirou com ETIMEDOUT. O transporte global do processo era Agent, embora o servidor tivesse sido iniciado com --use-env-proxy. Reiniciar apenas com essas opções não resolveu. Não era evidência de falha do SMTP ou dos modelos.

Correção em src/instrumentation.ts: na inicialização do runtime Node de desenvolvimento, quando houver proxy configurado, executar a API nativa http.setGlobalProxyFromEnv antes das requisições. A API existe desde Node24.14, compatível com o mínimo24.15 do projeto. Não adiciona dependência nem desativa validação TLS. O ramo de produção não executa essa configuração.

Após reiniciar o servidor, o transporte foi EnvHttpProxyAgent e a consulta respondeu normalmente. Playwright conferiu o resultado de conta confirmada em desktop e celular. Foi solicitada uma única recuperação ao endereço fornecido pelo usuário: a ação exibiu sucesso e recovery_sent_at foi atualizado para 28/10/2026 às10h29 de Brasília. A asserção do verificador de recuperação encontrou dois elementos role=status (resultado e contador); o seletor foi corrigido, sem repetir o envio só para corrigir o verificador. Aceitação do envio não comprova recebimento na caixa postal nem conclusão da troca de senha.

Verificação de tipos e build de produção em .next-verify aprovados. Rotas temporárias de diagnóstico removidas. Sem alteração de banco, SMTP, modelos ou produção; alterações preexistentes no checkout preservadas. Dois casos de caixa preta novos, M01-098 e M01-099, agrupados no roteiro existente; total99, sem aprovação manual atribuída.

Referência: [API nativa do Node24.19](https://nodejs.org/download/release/v24.19.0/docs/api/http.html#httpsetglobalproxyfromenvproxyenv).
