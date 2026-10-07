# Escolher caminho

**Versão vigente do projeto:** 0.13.0

## Escopo autorizado

Primeira tela implementável aprovada pelo usuário em 2026-09-24. Reproduzir a intenção visual do passo `obCaminho` de `Documentacao_Projeto_Nos/Telas/Nós App.dc.html`, com adaptação responsiva. Não implementar autenticação fictícia nem simular aceite de convite.

## Contrato de navegação

- `/` encaminha para `/comecar`.
- `/comecar`: escolher criar um Núcleo ou entrar por convite.
- `/comecar/tipo`: tela Tipo de Núcleo implementada na entrega de 2026-09-25; veja o registro abaixo.
- `/comecar/convite`: destino reservado para o fluxo de convite.
- O destino de convite continua preparatório e permite voltar. A seleção de tipo segue para Propósito, que oferece formulário e conferência local sem criação real.

## Sequência de trabalho

1. Criar projeto Next.js/TypeScript e testes de comportamento.
2. Confirmar teste falhando pela ausência da tela.
3. Implementar estrutura compartilhada, cartões de navegação e destinos.
4. Verificar mobile/desktop, teclado, navegação, tipos e build.
5. Atualizar documentação com evidências e limitações.

## Dependências e limites

Esta fatia é pública e não coleta nem persiste dados. A autenticação, associação a Núcleo, RLS, expiração e uso único dos convites precisam existir antes de qualquer operação real. A escolha de tipo agora usa o catálogo extensível implementado na entrega de 2026-09-25, sem pressupor casal ou apenas dois participantes. As regras de persistência e autorização continuam pendentes.

## Próxima ação

Status da entrega: tela e navegação implementadas. Oito testes passaram nos dois perfis (desktop/mobile), incluindo viewport 320px; build e tipos verificados. Destinos são espaços reservados, não telas concluídas de criação/aceite.

Continuidade realizada em 2026-09-25: [registro da implementação de Tipo de Núcleo](<../registros/registro-v0.2.0-2026-09-25-01-imp-tela-tipo-nucleo-fun-selecao-vinculo.md>). Em 2026-09-27, [Propósito](../registros/registro-v0.3.0-2026-09-27-imp-tela-proposito-nucleo-fun-rascunho-local.md) ganhou formulário e conferência local; depois, a [v0.4.0](../registros/registro-v0.4.0-2026-09-27-imp-integracao-supabase-fun-criacao-convite.md) acrescentou criação protegida, convite e entrada real. A descrição anterior de destinos reservados e oito testes corresponde à entrega inicial.


## v0.12.0 — Conta e entrada

A raiz agora abre `/conta`; `/comecar` continua acessível após autenticação. Recuperação, confirmação com reenvio e apresentação opcional integradas. Consulte o [contrato vigente de Conta e entrada](conta-entrada.md).

## v0.13.0 — Navegação e sessão

Raiz sem sessão abre Conta; autenticada abre Seus Núcleos. Login/confirmação sem retorno específico segue para /nucleos. Todo /comecar e /nucleos exige sessão validada, inclusive rascunho e convite. Lista real sob RLS, seleção explícita e retorno do Início à lista. Token expirado com renovação válida mantém acesso; sessão não renovável pede login preservando destino. Esta decisão substitui o retorno padrão ao onboarding e o rascunho pré-login dos marcos anteriores. [Contrato vigente](navegacao-sessao.md).
