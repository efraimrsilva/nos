# Registro — v4.0.0-alpha.19 — 2026-11-19 — Imp. da paridade Angular com Fun. de convites

**Status:** concluída localmente na branch `codex/migracao-angular`, a partir de `c1eb035`.

## Objetivo e decisões

Portar a apresentação Next.js v3.11.1 nas Telas 10, 11, 58 e 59. Separar conferência de aceite explícito, aproximar cartões, tipografia, realce de propósito, filtros e detalhes da referência. Os formulários e diálogos nativos, o componente de ícones e os estilos Angular atuais atendem ao recorte sem uma biblioteca nova.

## Arquivos e integrações

- `apps/web/src/app/invitations/` atualiza entrada, gerador, lista e detalhes. A validação de formato liga o aviso ao campo antes de focá-lo. O erro de aceite aparece ao lado da ação quando a prévia ainda está disponível.
- A consulta e o aceite seguem separados. Aceite, revogação e geração reaproveitam as funções e permissões existentes do Supabase. As capturas ocultam o código real. Câmera, QR e link seguem planejados.
- Atlas vivo, fichas, verificadores, guia Migração e manifestos sincronizados. Na Tela 59, **Preparar convite** abre um diálogo para gerar, copiar ou compartilhar. **Revogar convite** abre confirmação com cancelamento. Revogar impede novos aceites e preserva participantes.

## Validação e resultado

O teste reproduziu a ausência do atributo de campo inválido e passou após a correção. Playwright autenticado em desktop e celular cobriu conferência, foco, adiamento, cópia simulada, fechamento do diálogo pelo fundo, aceite repetido, revogação e acesso de participante. Checagem de tipos, compilação Angular e 257 testes de banco local aprovados. Os verificadores do percurso de convite, do MVP de Núcleos, da guia Migração e do fechamento de diálogos do Atlas também passaram. As 36 capturas e os links da galeria foram conferidos. [Galeria](../../wireframes/comparacoes/v4.0.0-alpha.19-2026-11-19-paridade-convites-tela-10-tela-11-tela-58-tela-59/index.html)

## Limites e próximo passo

Autorrevisão do diff, sem revisão independente. O compartilhamento pelo seletor nativo do sistema e a publicação desta versão ficam fora da validação local. Retomar a paridade visual 06 em Seus Núcleos, Início e participação.
