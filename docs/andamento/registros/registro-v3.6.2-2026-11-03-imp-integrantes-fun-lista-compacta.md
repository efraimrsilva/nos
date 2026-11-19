# Registro — v3.6.2 — 2026-11-03 — Imp. de integrantes com Fun. lista compacta

**Status:** Concluído e validado localmente. Versão3.6.2 (PATCH). Unidade local posterior à publicação3.6.1; sem commit/push inferido para esta unidade.

## Objetivo e requisitos

Aproximar seta de Ver integrantes do texto, seguindo Ver Seus Núcleos. Substituir cartões grandes por lista compacta com cabeçalhos/detalhes inspirada na organização do Explorador do Windows fornecida pelo usuário. Retirar botão Ver participação; nome abre detalhes, preservando funções administrativas.

## Implementação e integrações

Tabela semântica somente Nome/Papel, com nomes acionáveis e pequenos avatares. Nomeação removida da lista por direcionamento posterior; pendência e ações continuam nos detalhes. Modal limitado horizontalmente a580px desktop, com limite de viewport móvel. Mesmas ações e autorização de servidor/banco, sem migração nova. Espaçamento13px na seta. Sem botão/coluna extra de ações. Regras de modal/foco/fechamento externo mantidas, movimento reduzido respeitado. Atlas atualizado com a mesma organização.

## Validação

TDD:2 falhas esperadas por ausência de tabela antes da alteração. Após implementar:14 testes autenticados aprovados (lista, nomeação/aceite/destituição/saída, identidade/menus e fechamento externo), incluindo320/390/768/1280px sem overflow e linhas abaixo120px. Tipos aprovados. Verificador Atlas da lista aprovado. Revisão independente estática sem bloqueios de código; captura móvel aparentou cortar o título/X, então foi acrescentada checagem específica de botão Fechar no viewport e nova captura; resultado pendente. Não fazer correção de CSS sem evidência.

## Arquivos

nucleus-members.tsx, layout-system.css, testes de controles/people-merge e member-list; Atlas product-ui.js/product.css e verificador; galerias e registros. Teste de regressão people-merge passa a gravar capturas por padrão em artifacts para não sobrescrever galerias históricas; env NOS_PEOPLE_MERGE_GALLERY permite captura explícita.

## Próximo passo

Concluir enquadramento/captura, build e versão/documentação. Depois da lista pronta, implementar sincronização de nome/propósito entre integrantes sem recarregar, desktop/mobile, conforme pedido posterior do usuário. Publicação anterior16f47bd+a17052c confirmada no remoto; esta unidade permanece local.

## Verificação visual adicional

Título e X confirmados dentro do viewport em desktop/mobile (2testes adicionais aprovados); a captura por elemento podia reenquadrar a janela, então a evidência final usa captura do viewport, mantendo a checagem do botão Fechar. Sem mudança indevida no CSS do diálogo. Revisão independente não encontrou perda de ações/permissões. Versão final3.6.2. Build final e fechamento registrados no estado.

## Direcionamentos finais da mesma unidade local

Usuário pediu retirar Nomeação da lista: apresentação final só Nome/Papel, sem nomeação abaixo do nome; pendência e ações continuam apenas nos detalhes. Depois pediu encurtar dimensão horizontal: modal Integrantes passa ao padrão580px desktop (anteswide900), mantendo limite de viewport móvel. Teste final deve conferir largura, dois cabeçalhos, foco e nomeação nos detalhes. Sincronização entre integrantes continua como próxima unidade, após concluir esta.

## Fechamento final e pendência adiada

Após retirar Nomeação:8cenários autenticados de lista/administração aprovados. Após reduzir largura:2testes finais aprovados em desktop/mobile, confirmando dois cabeçalhos, ausência do botão antigo, acesso pelo nome, foco, X visível, largura<=580px desktop,320–1280px sem overflow e seta a13px. Tipos e build finais3.6.2 aprovados. Nenhuma nova migração, commit ou push desta unidade. Regressões de captura agora usam artifacts por padrão e variável explícita para galerias, preservando evidências históricas.

Usuário ADIOU explicitamente a sincronização automática de nome/propósito entre integrantes, depois de pedir concluir a tarefa atual. Nenhuma implementação dessa sincronização foi iniciada. Registrar como pendência para retomada futura, sem iniciar até novo direcionamento. Unidade atual concluída localmente; próxima ação é conferir com a própria conta e criar commit/push somente quando autorizado para estes ajustes posteriores.

## Conferência de publicação — 03/11/2026

Testes de integrantes e verificador Atlas passaram a usar artifacts/regression-captures por padrão, com destino opcional por variável de ambiente, evitando novas gravações sobre galerias de versões anteriores. Capturas depois-app foram reexecutadas na consolidação3.7.0, com a mesma composição compacta; capturas anteriores preservadas.
