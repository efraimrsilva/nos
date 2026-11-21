# Registro — v4.0.0-alpha.29 — 2026-11-20 — Imp. da paridade Angular com Fun. de conta, privacidade e suporte

**Status.** Validada localmente na branch `codex/migracao-angular` a partir de `322e643`. Referência Next.js no commit `604a142`. Angular continua como aplicativo executável.

**Escopo.** Telas 66–70. Grade da Conta, ícones e diálogos, Aparência com nove miniaturas das paletas, privacidade em cinco seções, Dados e autonomia, aviso de notificações futuras, alerta e cancelamento da exclusão e conteúdo de suporte. O botão de relato preserva a transição do lembrete e os diálogos respeitam a preferência de movimento reduzido.

**Integrações e decisões.** Formulários Angular preservam os serviços existentes de sessão, preferências e suporte. Os atalhos consultam apenas os vínculos da própria pessoa. Convites abrem a rota existente, saída pede a confirmação na rota do Núcleo e encerramento reutiliza o formulário e a operação com autorização no banco. Recuperação e confirmação de e-mail abrem pelas rotas Angular de assistência.

**Arquivos.** Componentes Account, AccountPreferences, AppearancePicker, ProblemReport e NavIcon em `apps/web/src/app/`, leitura NucleiData, cobertura Playwright e representação nas fichas e no produto do Atlas vivo.

**Evidências.** Verificação de tipos e build. Dezoito execuções autenticadas aprovadas, nove em cada largura, incluindo temas, privacidade, troca de sessão, encerramento de Núcleo, exclusão de conta e envio de relatos para receptor descartável com rejeição de envio repetido. Banco local com 257 verificações em 13 arquivos. Atlas em desktop e celular. [Galeria](../../wireframes/comparacoes/v4.0.0-alpha.29-2026-11-20-paridade-conta-tela-66-tela-67-tela-68-tela-69-tela-70/index.html).

**Limites e continuidade.** Notificações permanecem planejadas. Recebimento externo, fluxo hospedado e publicação seguem pendentes. As demais telas foram comparadas por código com a referência antes de escolher os próximos recortes de migração.
