# Relato de problemas — v3.7.0 — concluído localmente

[Registro e evidências](../registros/registro-v3.7.0-2026-11-03-imp-suporte-fun-relato-problemas.md). Implementação validada localmente e autenticação SMTP real aprovada com a nova chave. Nenhuma mensagem externa enviada; implantação e recebimento externo permanecem sem certificação.

| Local | Acesso |
|---|---|
| Conta → Ajuda e suporte | Relatar um problema |
| Perfil desktop → Ajuda e suporte | Mesmo modal |
| Mais mobile → Ajuda e suporte | Mesmo modal |
| Orientação / Dados e autonomia | Atalho dentro do conteúdo de ajuda |
| Cabeçalho das telas autenticadas | Ícone de problema, nome acessível Relatar um problema |

Descrição10–2000 caracteres obrigatória; passos opcionais1000. Contexto limitado à rota sem parâmetros/identificadores e versão. Contato obtido da conta confirmada. Endereço da equipe somente servidor; nenhum mailto na ajuda. Sem anexos, sem cópia de relatos em banco. Não enviar senha, código ou conteúdo íntimo. A integração envia texto simples ao serviço de e-mail; esse serviço recebe e mantém a mensagem conforme sua operação.

Uma tentativa por minuto/conta com reserva atômica; configuração ausente, sessão inválida e erro de envio nunca geram sucesso. Falha preserva rascunho; fechar cancela formulário sem disparar envio. Fechar durante uma solicitação já enviada não cancela uma operação do servidor. Aceite SMTP não promete chegada à caixa de entrada nem prazo de atendimento. Ação usa sessão/RLS; tabela de intervalo não expõe dados ao cliente.

Configuração servidor: SUPPORT_SMTP_HOST, SUPPORT_SMTP_PORT, SUPPORT_SMTP_USER, SUPPORT_SMTP_PASSWORD (chave SMTP, não API), SUPPORT_MAIL_FROM (remetente verificado). npm run verify:support-mail confere autenticação/TLS sem enviar mensagem. Antes de publicar, provisionar as variáveis no runtime e aplicar somente a migração desta funcionalidade no ambiente autorizado. Não copiar SMTP completo do Auth nem reutilizar credenciais de API como SMTP.

Ambiente de desenvolvimento: scripts/dev.mjs carrega .env.local antes de iniciar o Next. Reiniciar npm run dev se o processo já estava aberto com a credencial anterior. O servidor habitual pode apontar para Supabase hospedado: nesse caso, aplicar/provisionar a migração de suporte e as variáveis no destino exige autorização específica; a migração executada nesta entrega está somente no Supabase local de testes.
