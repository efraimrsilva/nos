# Escolher caminho

## Escopo autorizado

Primeira tela implementável aprovada pelo usuário em 2026-09-24. Reproduzir a intenção visual do passo `obCaminho` de `Telas/Nós App.dc.html`, com adaptação responsiva. Não implementar autenticação fictícia nem simular aceite de convite.

## Contrato de navegação

- `/` encaminha para `/comecar`.
- `/comecar`: escolher criar um Núcleo ou entrar por convite.
- `/comecar/tipo`: destino reservado para a próxima tela de criação.
- `/comecar/convite`: destino reservado para o fluxo de convite.
- Os destinos devem explicar seu estado de preparação e permitir voltar. Não representam funcionalidades concluídas.

## Sequência de trabalho

1. Criar projeto Next.js/TypeScript e testes de comportamento.
2. Confirmar teste falhando pela ausência da tela.
3. Implementar estrutura compartilhada, cartões de navegação e destinos.
4. Verificar mobile/desktop, teclado, navegação, tipos e build.
5. Atualizar documentação com evidências e limitações.

## Dependências e limites

Esta fatia é pública e não coleta nem persiste dados. A autenticação, associação a Núcleo, RLS, expiração e uso único dos convites precisam existir antes de qualquer operação real. A escolha de tipo será orientada por catálogo extensível, sem pressupor casal ou apenas dois participantes. O catálogo e suas regras ainda precisam ser implementados e validados contra a documentação.

## Próxima ação

Status da entrega: tela e navegação implementadas. Oito testes passaram nos dois perfis (desktop/mobile), incluindo viewport 320px; build e tipos verificados. Destinos são espaços reservados, não telas concluídas de criação/aceite.

Implementar a tela Tipo de Núcleo sobre o layout compartilhado, definir catálogo tipado de todos os tipos e encaminhar a escolha para Propósito. Não armazenar dados afetivos reais antes da proteção de backend.
