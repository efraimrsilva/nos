# Registro — v4.0.0-alpha.9 — 2026-11-16 — Imp. de prévias Angular com Fun. de navegação e totais

**Status:** em andamento. A11 implementada localmente, com validação parcial. A10 permanece em validação funcional independente.

**Objetivo e requisitos:** migrar as seis rotas de prévia, protegê-las pelo vínculo com o Núcleo e manter os exemplos identificados, sem escrita, envio, pontuação ou acesso a perfis reais. Integrar destinos contextuais, totais pessoais e o painel visual de notificações no desktop e no celular.

**Decisões técnicas:** reutilizar roteador, carregamento padrão, alias de Integrantes e diálogos nativos do Angular. Angular Material acrescentaria dependência e estilos sem resolver nenhum requisito ausente. O componente de prévia usa os exemplos editoriais existentes. Não há migração de dados. O Supabase usa as políticas vigentes para conferir participação e a função `get_navigation_counts`, sem aceitar identificador de outra conta.

**Arquivos e integrações:** `apps/web/src/app/previews/`, roteador, navegação compartilhada e Início do Núcleo. `tests/angular/nuclei.spec.mjs` cobre o acesso direto com duas contas descartáveis e o descarte do rascunho. O Atlas atualiza o roteiro e as fichas 38, 40, 44, 49, 55, 60 e 62.

**Modais:** Sobre a área abre pelo botão O que está previsto nesta área? na prévia autenticada. Memórias abre o detalhe do exemplo selecionado e Conexões/Perfis abrem o perfil fictício. Notificações abre pelo atalho no cabeçalho autenticado e aponta para Acordos ou Seus Núcleos. X, Escape e gesto externo fecham a camada superior. No Atlas tudo continua demonstrativo.

**Validações e resultado:** seis rotas confrontadas com a lista de retornos do Auth. Os verificadores Migração e MVP do Atlas passaram em desktop e celular, com 73 fichas e sem erros. O índice, os links e as 36 imagens da galeria foram conferidos. A revisão independente identificou um vínculo de fechamento do menu Mais no lugar errado e o ajuste foi aplicado. O Playwright listou 36 casos e parou na inicialização do Supabase local. O teste de banco encontrou conexão recusada na porta 54322. O registro npm não respondeu e tipos e compilação Angular pararam por falta dos executáveis. [Galeria parcial do Atlas](../../wireframes/comparacoes/v4.0.0-alpha.9-2026-11-16-angular-previas-tela-38-tela-40-tela-44-tela-49-tela-55-tela-60-tela-62/index.html)

**Limites e próximo passo:** restaurar as dependências e o ambiente isolado do Supabase. Executar tipos, compilação e testes Angular e de banco. Validar os totais em contas distintas, acesso direto, retorno após entrar, descarte do rascunho, diálogos, histórico da navegação e paridade de desktop/celular no aplicativo. Encerrar A10 e A11 depois das verificações. A12 tratará a hospedagem e as integrações operacionais.
