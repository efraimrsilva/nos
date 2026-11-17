# Referência de código para a paridade Angular

O código Next.js v3.11.1 no commit `604a142` é a referência principal. Antes de portar um passo, leia a rota, os componentes, os estilos importados, o estado e as ações. O Atlas conferirá a apresentação e o inventário de telas, inclusive esboços. Registre divergências entre o código e o Atlas e preserve as regras de domínio e permissões vigentes. Mantenha Angular como único frontend da migração.

| Passos na guia Migração | Código Next.js a conferir |
| --- | --- |
| 01–02 · Entrada e assistência | [Conta](../../../src/app/conta), [autenticação](../../../src/features/auth), [abertura](../../../src/features/onboarding) e [estrutura pública](../../../src/shared/components/application-shell.tsx) |
| 03 · Estrutura autenticada | [ApplicationShell](../../../src/shared/components/application-shell.tsx), [OnboardingShell](../../../src/features/onboarding/components/onboarding-shell.tsx), [painel de perfil](../../../src/features/controls/components/account-popover.tsx), [notificações](../../../src/shared/components/notifications-popover.tsx) e [suporte](../../../src/features/support/components) |
| 04–05 · Começar e convites | [Rotas Começar](../../../src/app/comecar), [formulários](../../../src/features/onboarding) e [convites](../../../src/features/invitations) |
| 06 · Seus Núcleos e participação | [Rotas de Núcleos](../../../src/app/nucleos), [domínio dos Núcleos](../../../src/features/nuclei) e [controles](../../../src/features/controls) |
| 07–08 · Agenda | [Agenda](../../../src/features/calendar) |
| 09–11 · Acordos e Hábitos | [Acordos e Hábitos](../../../src/features/agreements) |
| 12–14 · Áreas planejadas | [Componentes de prévia](../../../src/features/preview) |
| 15 · Conta, privacidade e suporte | [Controles da Conta](../../../src/features/controls), [aparência](../../../src/features/appearance) e [suporte](../../../src/features/support) |
| 16 · Revisão transversal | [Layout](../../../src/app/layout-system.css), [tokens e utilitários](../../../src/app/globals.css), [temas](../../../src/features/appearance) e [movimento público](../../../src/features/auth/account-motion.css) |

## Estilos

O Angular usa o Tailwind 4 já instalado pelo lockfile da raiz, com o mesmo plugin PostCSS. O ponto de entrada Angular carrega tema e utilitários e lista explicitamente os templates portados. O Preflight (reset global) fica fora dessa entrada para preservar os estilos Angular existentes. Ao portar um componente, confira as classes do Next.js e inclua seu template em `@source` quando usar os utilitários. Reuse a paleta e os ativos; porte apenas as regras específicas do componente, adaptando seletores e estados ao template Angular. Compare os estilos computados em 1440 e 390 px e verifique foco e movimento reduzido. [Tailwind com Angular](https://tailwindcss.com/docs/installation/framework-guides/angular) · [Preflight](https://tailwindcss.com/docs/preflight)

