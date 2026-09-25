# Escolher caminho

**Versão vigente do projeto:** 0.2.0

## Escopo autorizado

Primeira tela implementável aprovada pelo usuário em 2026-09-24. Reproduzir a intenção visual do passo `obCaminho` de `Telas/Nós App.dc.html`, com adaptação responsiva. Não implementar autenticação fictícia nem simular aceite de convite.

## Contrato de navegação

- `/` encaminha para `/comecar`.
- `/comecar`: escolher criar um Núcleo ou entrar por convite.
- `/comecar/tipo`: tela Tipo de Núcleo implementada na entrega de 2026-09-25; veja o registro abaixo.
- `/comecar/convite`: destino reservado para o fluxo de convite.
- O destino de convite continua preparatório e permite voltar. A seleção de tipo segue para o destino preparatório de Propósito.

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

Continuidade realizada em 2026-09-25: [registro da implementação de Tipo de Núcleo](<../registros/registro-v0.2.0-2026-09-25-imp-tela-tipo-nucleo-fun-selecao-vinculo-01.md>). O catálogo agora existe; a descrição anterior de destinos reservados e oito testes corresponde à entrega inicial. Próxima tela: Propósito, sem armazenar dados afetivos reais antes da proteção de backend.
