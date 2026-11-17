# Registro — v4.0.0-alpha.11 — 2026-11-17 — Imp. de preparação Angular com Fun. de transporte e paridade

**Status:** recorte local concluído. A13 continua em preparação. A virada pública foi adiada a pedido do usuário.

## Objetivo e critérios do recorte

Abrir no Angular os 32 caminhos de página disponíveis no Next.js, em computador e celular, e preparar os avisos de cadastro e relatos de problema para a futura implantação oficial. Manter a configuração e o transporte descartáveis no ensaio. Preservar a verificação de assinatura e a fila dos avisos, além da sessão e do limite de envio no relato.

## Implementação e decisões

- `apps/web/netlify/preview-mail.mjs` seleciona a configuração de teste ou a oficial. O envio oficial exige habilitação explícita, contexto de produção publicado e correspondência entre a origem da requisição, a origem do site segundo a Netlify e `APP_ORIGIN`. As credenciais do Supabase para as funções usam prefixos distintos.
- `apps/web/netlify/functions/account-notifications.mjs` e `problem-report.mjs` reutilizam o transporte e o destino da equipe usados no Next.js. Mantêm os contratos da fila, da assinatura e do relato. A prévia continua com caixa descartável configurada separadamente.
- `scripts/build-angular-preview.mjs` gera configurações públicas separadas por meio de `--production`. Nenhuma credencial de servidor pertence ao artefato entregue ao navegador. A configuração de implantação pública da raiz segue sob operação do Next.js.
- Nenhum framework adicional foi necessário. O transporte existente, as funções Netlify e as operações Supabase cobrem os requisitos do recorte. A seleção se apoia no [contexto de execução documentado pela Netlify](https://docs.netlify.com/build/functions/api/#deploy).
- Manifestos Angular, Atlas, roteiro de operação e documentos de retomada identificam o marco local. A linha Next.js preserva a versão 3.11.1.

## Evidência

- Abertura dos 32 caminhos do Next.js no artefato Angular, em 1440 e 390 pixels, com dados descartáveis do Supabase local. Conferidos destinos de redirecionamentos, acesso a páginas autenticadas com parâmetros de Núcleo e acordo, detalhes e modais selecionados, largura e ausência de erros de execução capturados pelo navegador. A prova foi feita com um verificador local temporário. Cada caminho foi aberto, sem repetir todas as ações e estados de cada página.
- Playwright de acesso, navegação e perfil com 21 testes aprovados e três ignorados pelas condições da suíte. Um era específico do menu móvel na matriz de computador, e dois exigiam a caixa SMTP (protocolo de transferência de correio simples) descartável para o relato. Confirmação de e-mail e recuperação de senha usaram o serviço de captura do Supabase local. A prova do callback de provedor cobriu a recusa e o retorno, sem novo login Google hospedado.
- 19 testes Node das integrações aprovados, incluindo isolamento das credenciais, configuração insuficiente, origem e contexto do deploy. As duas funções foram empacotadas com esbuild e importadas no Node. Ambas recusaram GET com `405` e `Cache-Control: no-store`.
- Verificação de tipos e compilação do Next.js local e do Angular aprovadas. As compilações Angular de ensaio e produção receberam valores fictícios, e cada artefato expôs apenas URL, chave pública e opção Google. O verificador da guia Migração do Atlas passou em computador e celular.
- A revisão independente do primeiro diff apontou o risco de compartilhar credenciais e o bloqueio indevido da caixa de captura no site isolado. Ambos foram corrigidos e cobertos por testes. Nenhum e-mail oficial enviado, nenhuma implantação promovida e nenhuma migração remota executada.

## Pendências para completar A13

1. Fechar o ensaio da A12 com renovação da sessão, fluxos de e-mail e fila hospedada em ambiente descartável. Ensaiar e comprovar o retorno ao deploy anterior. Considerar novo login na virada enquanto a continuidade da sessão entre os frontends não for comprovada.
2. Antes da publicação, conferir no destino as migrações `20261115162000`, `20261115162100`, `20261115182000` e `20261115182500`, que tratam de criação de Núcleo e registro de momento com a versão dos termos. O estado remoto deve ser reconfirmado quando houver autorização para a virada.
3. Seguir o [roteiro operacional](../../../apps/web/netlify/README.md#preparação-da-produção-para-a13) após fechar os demais ajustes do usuário. A candidata de lançamento depende da paridade e do ensaio, e a versão 4.0.0 depende da publicação e da verificação pública.

