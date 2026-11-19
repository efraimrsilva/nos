# Registro — v3.6.1 — 2026-11-03 — Imp. de modais com Fun. fechamento externo

**Status:** concluído e publicado no GitHub. Versão3.6.1 (PATCH). Usuário autorizou commit/push de todo o conjunto anterior e solicitou fechamento externo em todos os modais atuais/futuros. Pedido posterior, para depois da publicação atual: aproximar seta de Ver integrantes do texto, como Ver Seus Núcleos.

## Objetivo e decisões

Inscrição única no documento pelo componente DialogBackdropDismiss, no layout raiz. Abrange todos os diálogos nativos atuais e criados posteriormente, sem inscrição por instância. Somente clique/toque primário iniciado e concluído fora do mesmo diálogo fecha; padding é interno e arraste iniciado dentro não fecha. Modal aninhado fecha apenas a camada superior. Usa close() e os callbacks existentes, mantendo X/Escape/foco e as regras próprias de reset dos formulários; não prometer preservação universal de rascunhos. Popover nativo mantém fechamento externo existente. Atlas recebe comportamento equivalente offline.

## Validação em curso

TDD: quatro falhas esperadas antes da implementação; quatro testes desktop/mobile aprovados depois, incluindo recuperação, padding, arraste, foco, reabertura e diálogos futuros/aninhados. Suíte completa:210 aprovados/2 falhas em expectativa antiga do vermelho dos ícones de exclusão; CSS já usava o vermelho aprovado, teste atualizado. Reteste completo em execução. Verificador Atlas de clique externo/padding desktop/mobile aprovado. Testes autenticados de notificações/Conta/Mais e build finais pendentes. Revisão independente estática sem bloqueios; ressalva de reset preexistente de Dados da conta documentada.

## Publicação e próximo passo

Dois conjuntos lógicos: reorganização3.6.0 com reparo da identidade hospedada; fechamento de modais3.6.1 com regra permanente. Descrições completas no Git, sem misturar a alteração posterior da seta. Conferir objeto dos commits e igualdade com origin/main depois do push. Após concluir publicação, executar ajuste da seta solicitado em nova unidade local.

## Direcionamento posterior — executar depois da publicação atual

1. Aproximar a seta de Ver integrantes do texto, como Ver Seus Núcleos.
2. Trocar cartões grandes do modal de integrantes por lista compacta com cabeçalhos/detalhes, inspirada na organização do Explorador do Windows fornecida pelo usuário. Usar nomes/papéis/nomeação/ações, mantendo gestão e adaptação móvel. Nenhuma autorização nova de publicação foi inferida para esses ajustes posteriores.

Atualização: suíte pública completa212 aprovada após alinhar teste antigo ao vermelho aprovado. Rodada autenticada20: notificações não permaneceram abertas nos dois dispositivos; identificado fechamento incondicional na montagem do shell, corrigido para somente mudança real de pathname. Mesma proteção aplicada ao popover; notificações aguardam hidratação. Reteste específico em execução. Commit16f47bd da reorganização criado e fontes/migração conferidos no objeto Git; publicação aguarda a unidade de modais.

Direcionamento posterior adicional: usuário pediu retirar o botão Ver participação da lista. Na unidade posterior de lista compacta, o nome abrirá os detalhes, preservando as ações administrativas, sem botão/coluna adicional de ações.

## Fechamento da implementação

Tipos e build3.6.1 aprovados; seleção final13autenticados aprovados/1ignorado intencionalmente depois da proteção de hidratação. Suíte pública212aprovada; quatro testes novos específicos aprovados. Revisão independente final dos guards sem bloqueios, além da autorrevisão. Três verificadores Atlas aprovados (fechamento, Visão global, MVP). Galeria8imagens do Atlas antes/depois e modais reais desktop/mobile; sem mudança de aparência. Os testes de regressão regravaram capturas antigas com contas descartáveis; imagens históricas restauradas do commit16f47bd para preservar a evidência. Nenhum segredo ou arquivo artifacts será publicado.

Publicação confirmada: commit a17052cf911b614170bcd5037773cfe45cc56dc8 em origin/main; igualdade conferida por git ls-remote. Commit anterior16f47bd93efe131561745f193a412ba013a6d063 inclui toda a reorganização3.6.0. Nenhum deploy certificado. Este fechamento documental é preservado na unidade posterior de continuidade.

Pedido posterior adicional: sincronização de nome/propósito para todos os integrantes sem recarregar, desktop/mobile. Usuário pediu concluir primeiro a unidade atual de lista/seta; implementar sincronização depois, sem perder o escopo autorizado.
