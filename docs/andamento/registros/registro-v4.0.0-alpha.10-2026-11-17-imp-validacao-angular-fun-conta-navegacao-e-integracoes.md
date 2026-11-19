# Registro — v4.0.0-alpha.10 — 2026-11-17 — Imp. de validação Angular com Fun. de Conta, navegação e integrações

**Status:** A10 e A11 validadas localmente. A12 verificada em parte no ambiente local, com ensaio Netlify/Supabase isolado ainda pendente. Linha Next.js v3.11.1.

**Objetivo:** fechar o recorte autenticado de Conta e navegação da prévia e confirmar o que pode ser verificado das integrações antes da virada. A10 cobre aparência, privacidade, exclusão e relato. A11 cobre as seis prévias, o painel de notificações e os destinos contextuais.

**Decisões:** manter Angular 22, Supabase e o transporte existentes. Corrigido o import de `ElementRef`, usado como valor ao recuperar elementos do template. O SDK (kit de desenvolvimento) do Supabase passa a ser carregado sob demanda para respeitar o orçamento da compilação inicial. A verificação de identidade ocorre depois do carregamento assíncrono. O pacote inicial caiu de 535,83 kB para 312,94 kB na compilação de ensaio. Sem dependências novas.

**Arquivos:** `account.ts`, `preview-profile.ts`, `nuclei-data.ts`, testes Angular de Conta e Núcleos, manifestos da prévia e Atlas. A revisão independente verificou sessão e navegação e motivou a verificação da identidade após a importação e dos títulos específicos dos seis destinos.

**Banco:** `supabase migration list --local` confirmou que `20261115162000`, `20261115162100`, `20261115182000` e `20261115182500` já estavam aplicadas. A divergência histórica local `20261112025922` foi preservada. Não houve aplicação de migração nesta retomada. As 257 verificações de banco passaram.

**A10:** conta e preferências por usuário, exclusão com frase e histórico acessível por outra conta, sucessão, relato aceito pela caixa SMTP (protocolo de transferência de correio simples) local, limite de um minuto e texto preservado em rejeição. **A11:** as seis rotas foram abertas com conteúdo específico e exemplos sinalizados. Vínculo, contagem pessoal, painel ilustrativo de notificações e rascunho temporário da Ponte conferidos. Aparência, Privacidade, Apagar minha conta, Relatar um problema, Sobre a área, detalhe de Memórias, perfil fictício e Notificações estão identificados na galeria.

**A12:** 15 testes de adaptadores e assinaturas passaram. O artefato da prévia foi compilado com origem HTTPS e chave pública fictícias. O receptor assinado foi invocado com cliente e transporte de ensaio ligados ao Supabase local e a uma caixa descartável. A confirmação foi registrada no banco e repetir o evento não criou outro e-mail. Cinco eventos anteriores pendentes no banco local foram preservados e não foram despachados. O disparo completo pela fila, a implantação e o retorno precisam de um destino de ensaio isolado, assim como o retorno do Google com provedor configurado.

**Verificações finais:** tipos e compilação do Angular e do Next.js aprovados. Na suíte Angular, 38 passaram e 1 caso exclusivo de celular foi omitido no desktop. Um teste de criação de Núcleo perdeu a página durante a compilação concorrente. O reteste isolado desse caso passou. Os verificadores de Migração, Controles e MVP do Atlas passaram. As duas funções também foram empacotadas com esbuild e responderam 405 a GET no Node local.

**Evidências:** [galeria do aplicativo e referência ao Atlas](../../wireframes/comparacoes/v4.0.0-alpha.10-2026-11-17-angular-conta-e-previas-tela-38-tela-40-tela-44-tela-49-tela-55-tela-60-tela-62-tela-66-tela-67-tela-69-tela-70/index.html). Chromium a 1440 e 390 pixels. Context7 consultado para as consultas de elementos do Angular. Os conectores Netlify e Supabase não iniciaram nesta sessão. Octocode não foi necessário para as leituras pontuais.

**Próximo passo:** usar o site Netlify noslife para um rascunho, conforme indicado pelo usuário. O Supabase listado é o nos-dev, ligado à produção. A fila e a entrega de ponta a ponta ainda dependem de um banco de ensaio. Executar o [roteiro hospedado](../../../apps/web/netlify/README.md) antes de iniciar A13.
