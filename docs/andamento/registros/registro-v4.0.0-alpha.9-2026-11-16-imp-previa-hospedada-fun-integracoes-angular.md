# Registro — v4.0.0-alpha.9 — 2026-11-16 — Imp. de prévia hospedada com Fun. de integrações Angular

**Status:** em andamento. Configuração e adaptadores locais, com ensaio integrado pendente.

**Objetivo e requisitos:** preparar a hospedagem Angular isolada, preservar os retornos de autenticação e a interface do receptor de avisos e do relato. Verificar por etapas usando dados descartáveis e capacidade de retorno.

**Decisão:** Netlify Functions com Node reutiliza o contrato assinado, o transporte e as operações já instaladas no Supabase. Uma função no Supabase exigiria adaptar e verificar o transporte de e-mail em outro ambiente. Uma aplicação de servidor separada acrescentaria hospedagem e manutenção. A configuração da prévia está em `apps/web/netlify.toml`; o Netlify da raiz continua vinculado à linha Next.js. Sem nova migração.

**Arquivos e integrações:** `apps/web/netlify.toml` e `apps/web/netlify/` configuram saída, rotas, cabeçalhos e funções. `scripts/build-angular-preview.mjs` gera configuração pública validada. `public-config.ts` restringe origem local ou HTTPS e rejeita chaves de serviço. O suporte compartilha o tratamento local e hospedado. O receptor reutiliza assinatura, reserva e confirmação do banco, com caixa SMTP de teste e envio desativado por padrão.

**Validações:** 15 testes Node aprovados, cobrindo avisos assinados, reserva e deduplicação simuladas, relatos, configuração pública e ordem de rotas. Guia Migração do Atlas aprovada em desktop e celular. Revisão independente estática apontou variantes de loopback aceitas no modo hospedado, corrigidas e cobertas pelos testes. O build da prévia parou por falta do Angular CLI. O registro npm retornou `ETIMEDOUT`. Tipos e build do Next.js continuaram bloqueados pela ausência de Nodemailer e React Day Picker. O ensaio local da fila parou no Supabase local indisponível.

**Limites:** sem publicação, mudança na fila externa ou uso de credenciais reais. Confirmação em caixa de teste, execução das regras no Netlify, renovação da sessão hospedada e retorno do artefato anterior exigem ambiente isolado. A10 e A11 também aguardam validação no aplicativo. As versões foram preservadas.

**Próximo passo:** restabelecer a execução local, seguir o [roteiro do ensaio](../../../apps/web/netlify/README.md) e registrar as evidências da prévia isolada antes de propor a virada pública.
