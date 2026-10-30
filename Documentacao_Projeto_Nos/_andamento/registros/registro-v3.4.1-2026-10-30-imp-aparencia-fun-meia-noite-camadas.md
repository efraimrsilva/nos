# Registro — v3.4.1 — 2026-10-30 — Imp. de Aparência com Fun. inversão das camadas Meia-noite

Status: concluído localmente. Versão: 3.4.1 (PATCH).

## Objetivo, contexto e requisitos
Usuário solicitou inverter preto e cinza escuro no tema Preto — Meia-noite: preto à frente, cinza atrás, incluindo a coluna lateral.

## Decisões técnicas e integrações
canvas passa de #000000 a #101312; surface de #101312 a #000000; nav de #080a09 a #000000. Tokens de texto, estados, bordas e acentos preservados. themes.ts alimenta a prévia e themes.css o aplicativo: ambas as fontes sincronizadas. Sem dependências, migração ou mudança de preferência salva; identificador black preservado. Atlas tem dados da paleta sincronizados e prévia Meia-noite para fundo, superfícies e coluna lateral, somente local. Nenhum novo modal ou mudança no fluxo de Aparência.

## Arquivos e escopo
src/features/appearance/themes.ts e themes.css; tests/authenticated/themes.spec.ts (expectativa antiga do fundo atualizada); midnight-theme.spec.ts (paleta real e persistência em desktop/mobile); Atlas product-ui.js/product.css; scripts/verify-midnight-atlas.mjs; manifestos, README e acompanhamento. Mudanças anteriores de Núcleos, convites e nome do perfil preservadas.

## Validações
Tipos e build aprovados; npm test -- tests/themes.spec.ts: 16 aprovados, incluindo contraste de texto/campos/ações nas nove paletas. node scripts/verify-midnight-atlas.mjs: desktop/mobile e zero erros aprovados. Captura anterior real do aplicativo: dois cenários locais concluídos. Rodada intermediária após inversão teve falha desktop ao incluir a asserção da coluna lateral depois de a cópia isolada já ter sido criada; essa cópia ainda tinha o valor anterior da navegação. Reteste final com fontes atuais: dois cenários aprovados, incluindo coluna lateral preta e persistência após reload. Verificador de Visão global:73 telas e zero erros. Build final após coluna lateral aprovado. Capturas finais inspecionadas e git diff --check aprovado. Autorrevisão das alterações de paleta e diff; sem revisão independente nesta tarefa. Context7 disponível, sem consulta nova necessária para troca de valores de cores; Octocode não exposto, sem pesquisa avançada necessária. Superpowers entendimento/revisão/verificação aplicadas.

## Resultado, limitações e próximos passos
Galeria antes/depois de Conta e Aparência, aplicativo local com contas descartáveis e Atlas ilustrativo. Manual M05-TEM-017 não executado pelo usuário. Nenhuma alteração em contas reais, banco remoto, commit, push ou deploy. Próximo passo: selecionar Preto — Meia-noite na própria conta e conferir cartões, fundo e coluna lateral.

[Galeria antes/depois](../../wireframes/comparacoes/v3.4.1-2026-10-30-meia-noite-tela_66/index.html). Manifestos/README/identificação do Atlas sincronizados em3.4.1 após validação funcional.
