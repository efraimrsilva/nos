# Registro — v3.0.5 — 2026-10-21 — Imp. de início com Fun. de destaque da administração

Status: concluído localmente; sem commit, push ou deploy.

Objetivo: destacar “Você administra este Núcleo.” no Início de Meu Espaço.

Decisão: reutilizar ui-badge, com fundo verde, texto em strong e ícone ShieldCheck decorativo, apenas quando membership.role é admin. Propósito e texto dos demais participantes preservados. Sem novas consultas, dependências ou permissões. Sem animação, por ser informação estática.

Arquivos: src/app/nucleos/[id]/page.tsx; wireframes/atlas/product-ui.js; package.json; package-lock.json; registros de continuidade. PATCH 3.0.5. Alterações documentais preexistentes da execução local preservadas separadamente.

Validação: npm run typecheck aprovado; seis testes existentes nucleus-home.spec.ts aprovados com configuração temporária sem servidor; node --check do Atlas aprovado após corrigir aspas da representação estática; git diff --check e autorrevisão do diff. Sem build novo, revisão independente ou inspeção visual autenticada. Testes de lógica verificam papéis, não a aparência do selo.

Resultado: administração visualmente distinguida pela mesma linguagem de selos do aplicativo. Próximo passo: conferir no Início com conta administradora e participante, inclusive em celular.

Unidade pronta para commit: fix(inicio): destacar indicação de administração do Núcleo.

## Fechamento autorizado — 2026-10-21
Unidade de destaque visual autorizada para commit/push. No fechamento conjunto, tipos, testes de lógica/interface pública e build Turbopack3.0.6 aprovados; sem nova validação autenticada do selo.
