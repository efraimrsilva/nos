# Registro — v3.10.0 — 2026-11-07 — Imp. de diretrizes do README com Fun. de versionamento documental

**Status:** Concluído. Mudança exclusivamente documental, sem incremento da versão.

**Objetivo/contexto:** durante a publicação autorizada, o usuário determinou documentar a regra de não registrar versões no README da raiz. O commit funcional `fe4f135` já havia sido enviado; a correção documental segue em novo commit sem reescrever histórico.

**Requisitos/decisão:** remover a obrigação anterior de sincronizar a versão do aplicativo no README e proibir novos informes de versão atual, releases e publicações versionadas nesse arquivo. Centralizar esses dados em manifestos, Atlas e `_andamento/`. README permanece apresentação, stack, execução e referências; versões de dependências e caminhos de registros históricos não são histórico de releases do aplicativo.

**Arquivos alterados:** `AGENTS.md`, `README.md`, este registro e estado/histórico. Removidos os informes atuais/restantes de entrega no início do README, preservando restante do conteúdo e links históricos.

**Integrações/validações:** sem mudança em código, banco, interface ou configuração; autorrevisão da regra e diff, pesquisa das referências e `git diff --check`. Nenhum novo teste, build local ou revisão independente necessário. Build funcional hospedado acompanhado separadamente; commit documental usará `[skip netlify]` para evitar novo build.

**Resultado/limites/próximo passo:** regra permanente rastreável e README sem registro de versões do aplicativo. Conferir sua inclusão no objeto Git e referência remota ao fechar a publicação. Não alterar versões/datas dos registros históricos.
