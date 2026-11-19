# Registro — v3.9.1 — 2026-11-07 — Imp. da Conta com Fun. acesso social somente Google

**Status:** concluído localmente, sem commit/push/deploy. Pedido: descartar tentativa Microsoft e voltar à versão commitada, seguindo apenas com botão Google. Base54016c5, branch main. Versão3.10.0 não publicada foi descartada;3.9.1 PATCH identifica somente retirada do botão Apple e ajuste textual/Atlas.

**Reversão:** todos os arquivos rastreados da tentativa restaurados de HEAD; registro e galeria3.10.0 removidos explicitamente. Nenhuma configuração Microsoft chegou a ser criada no Supabase/aplicativo remoto. Não há cancelamento de conta Azure/cartão: isso é externo e não foi solicitado nem executado. Não afirmar ausência de cobrança; cadastro gratuito foi recusado antes da oferta paga.

**Alteração final:** somente botão Google no cadastro/login; e-mail/senha preservados. Mensagem de erro deixa de oferecer Apple. Código de início/sessão, callback, flags e configuração retornaram exatamente à base commitada; Apple permanece preparada internamente e desativada, sem botão. Sem Microsoft/azure nos fontes de autenticação. Sem banco ou dependência nova.

**Arquivos:** components/social-login.tsx, conta/page.tsx, teste social-login.spec.ts; Atlas product-ui/screens/mvp-plan/index e documentos vigentes; package/lock3.9.1.

**Validação proporcional:** diff da remoção e autorrevisão aprovados; conferência real da Conta em localhost3100, abas login e cadastro mostram exatamente um botão social Continuar com Google. Captura inspecionada, form de e-mail preservado. Sem novo teste/suíte/build/tipos para remoção de elemento/texto, conforme regra pontual do AGENTS. Teste existente atualizado às expectativas, não executado. Atlas código/sintaxe conferidos; inspeção viva continua limitada pelo bloqueio file conhecido. Evidência artifacts/conta-somente-google.png ignorada. Sem nova revisão independente.

**Resultado e próximo passo:** Microsoft descartado a pedido; login social Google permanece como único botão. Produção segue3.9.0, pois esta retirada não foi publicada. Unidade pronta para commit: fix(auth): manter somente Google como opção de acesso social. Autorizar publicação em nova etapa se desejado.
