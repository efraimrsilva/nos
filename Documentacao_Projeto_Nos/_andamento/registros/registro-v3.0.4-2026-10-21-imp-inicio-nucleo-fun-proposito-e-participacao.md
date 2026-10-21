# Registro — v3.0.4 — 2026-10-21 — Imp. de início do Núcleo com Fun. de propósito e participação

Status: concluído localmente, sem publicação.

## Objetivo e requisitos
Mover o conteúdo de “O que nos reúne” para o cabeçalho do Início em Meu Espaço. Substituir a frase genérica por “Nosso propósito:”, seguida do propósito cadastrado; mostrar o vínculo da pessoa na linha abaixo.

## Decisões e alterações
Reutilizados nucleus.purpose e details.participation, já obtidos com a sessão autenticada. Administradores veem “Você administra este Núcleo”; membros veem “Você faz parte deste Núcleo”. Removido o diálogo anterior para evitar duplicação. Nenhuma consulta, permissão ou esquema alterado. Atlas alinhado com exemplo estático. PATCH 3.0.4 em package.json e package-lock.json.

Arquivos: src/app/nucleos/[id]/page.tsx; Documentacao_Projeto_Nos/wireframes/atlas/product-ui.js; manifestos e registros de continuidade.

## Validação e revisão
TypeScript direto: node node_modules/typescript/bin/tsc --noEmit --incremental false, aprovado. Seis execuções dos testes existentes nucleus-home.spec.ts aprovadas com configuração temporária ignorada em artifacts/home-unit.config.ts, sem webServer por serem testes de lógica. Sintaxe do Atlas aprovada com node --check. Autorrevisão do diff; sem revisão independente. Tentativa inicial com servidor local excedeu o limite de 120 segundos de inicialização; sem validação visual autenticada ou build novo. Os testes de lógica não certificam o layout renderizado.

## Resultado, limites e próximo passo
Propósito e vínculo visíveis acima dos blocos, sem diálogo duplicado. Testar manualmente /nucleos/[id] com administrador e participante, incluindo largura móvel e propósito longo. Sem commit, push ou deploy. Unidade pronta para commit: fix(inicio): destacar propósito e participação no Núcleo.

## Fechamento GitHub autorizado — 2026-10-21
Commit e push autorizados pelo usuário. Tipos, seis testes de lógica e sintaxe do Atlas reexecutados e aprovados. Base c1fff28/main sincronizada com origin/main antes da publicação. Esta unidade integra o commit de publicação; confirmação do hash remoto ao final da operação. Sem confirmação de deploy nesta etapa.
