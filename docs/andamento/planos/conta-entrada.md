# Conta e entrada — plano de implementação

Data: 2026-10-07. Versão inicial: 0.11.0. Escopo autorizado: concluir telas 01–05 e 72 do Atlas vivo; preservar alterações documentais preexistentes.

Referência visual inspecionada: capturas locais `artifacts/atlas-account-before-{1,3,4,5}.png`. Conta/cadastro usam OnboardingShell; confirmação/recuperação/redefinição serão sincronizadas com esse mesmo layout no atlas, removendo a divergência entre o formulário genérico planejado e a aplicação. Comparação antes/depois acompanha a entrega.

## Critérios e execução

- [x] Escrever testes de navegação: `/` abre Conta; recuperação valida e-mail; nova senha sem prova não mostra formulário; confirmação permite solicitar novo link sem exibir credenciais.
- [x] Executar esses testes antes da implementação e confirmar falhas pelas funcionalidades ausentes.
- [x] Implementar validação compartilhada de senha e retorno interno seguro. Testar URLs externas, valores repetidos e retorno de convite.
- [x] Criar ações de recuperação/reenvio, confirmação visual e rotas `/conta/recuperar`, `/conta/confirmar-email`, `/conta/nova-senha`, `/auth/recovery`. Usar Auth existente, sem dependência nova. Prova de recuperação assinada, curta e vinculada à sessão; uma sessão comum nunca basta.
- [x] Validar link PKCE (Proof Key for Code Exchange) ou token de recuperação, retirar credenciais da URL, conferir sessão no servidor e redefinir senha. Encerrar sessões globalmente e orientar novo login. Revogação não antecipa expiração de JWT (JSON Web Token) já emitido.
- [x] Validar cadastro, confirmação/reenvio, login, retorno de convite, recuperação com e-mail real local, senha anterior rejeitada, senha nova aceita, link reutilizado e acesso direto negado. Limpar contas temporárias ao concluir.
- [x] Sincronizar composição, fichas 01–05, percurso, cobertura e pendências do atlas; conferir identidade, textos, botões e mobile/web com capturas antes/depois.
- [x] Executar testes desktop/mobile, tipos, build, verificação do atlas e diff; revisar segurança e comportamento com a skill de revisão.
- [x] Atualizar versão MINOR após validação completa, registro versionado, estado/histórico/BRAG e lembrete de commit. Sem commit, push ou deploy nesta tarefa.

## Decisões e limites

Preservar senha atual (8 caracteres, letra, número, símbolo), sem adotar proposta documental de 15 caracteres sem sincronização do Auth. Intervalo local de 60 segundos complementa os limites do Supabase; não é bloqueio global contra abuso. SMTP (Simple Mail Transfer Protocol) de produção, domínio/remetente e limites remotos são dependências operacionais, não serão apresentados como configurados por testes locais. Termos jurídicos e editor de privacidade pertencem a outros módulos; não criar aceites fictícios.

A chave `AUTH_RECOVERY_SECRET` será segredo somente de servidor para assinar a prova de recuperação. Sem chave, falhar explicitamente e manter mudança de senha bloqueada. Cookies HttpOnly, SameSite e Secure em HTTPS; prazo de 15 minutos após validar o link. A prova é vinculada ao ID de sessão do JWT verificado pelo Auth, sem senha/token nos registros.

Auditoria completa acrescentou ID72 da mesma área: /boas-vindas opcional, dois destinos de Conta com modo explícito. Teste escrito/observado falhando antes de implementar; aprovado em desktop/mobile. Desenho vivo sincronizado e histórico preservado.
