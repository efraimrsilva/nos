# Registro — v0.2.0 — 2026-09-25 — Imp. de padronização do registro histórico com Fun. rastreabilidade

**Versão vigente do aplicativo:** 0.2.0.
**Status:** concluído e verificado; commit e push adiados por instrução do usuário para a próxima funcionalidade.
**Impacto:** documentação apenas; sem incremento de versão.

## Objetivo, contexto e requisitos

Aplicar o padrão de registros ao diário de 2026-09-24, anterior à entrega Tipo de Núcleo, preservando o conteúdo e sua posição cronológica. Corrigir a sequência dos registros de 2026-09-25 para ficar após a data, como na máscara atual do usuário. Manter os links do projeto válidos.

## Decisões técnicas e integrações

- A primeira entrega tinha versão 0.1.0 no `package.json` do commit `32f208c`; esse é o número histórico do registro. A versão vigente 0.2.0 permanece em `estado.md` e nos manifestos.
- O diário foi movido para `registros/registro-v0.1.0-2026-09-24-imp-tela-escolher-caminho-fun-entrada-nucleo.md`, recebeu título, status e seções exigidas. Suas notas cronológicas originais foram preservadas sob uma seção própria; ações posteriores continuam identificáveis.
- As renomeações locais dos dois registros v0.2.0 já estavam presentes ao iniciar esta tarefa. Seus novos nomes `-01-imp-...` e `-02-imp-...` foram preservados e os links ajustados. Esta adequação documental é o registro `-03-imp-...`.
- Links em README, estado, histórico, Brag e documentos temáticos foram atualizados. O protocolo local em `AGENTS.md` e `_andamento/README.md` registra a posição correta do sequencial.

## Arquivos alterados

Registro histórico v0.1.0, registros v0.2.0 renomeados, `AGENTS.md`, `README.md`, `_andamento/README.md`, `estado.md`, `historico.md`, documentos temáticos e `brag/BRAG.md`. Código de produto e manifestos de versão não foram modificados.

## Validações realizadas e resultado

Versão original confirmada em Git; links locais, diff documental e estado da árvore Git verificados nesta interação. O resultado é uma sequência de registros legível, sem reatribuir à v0.1.0 comportamentos da v0.2.0. Testes, build e tipos não são necessários para esta mudança documental; os resultados anteriores permanecem históricos.

## Limitações e próximos passos

Não há alteração de produto ou publicação nesta entrega. Incluir esta pendência documental, com revisão, no commit da próxima funcionalidade autorizada, respeitando o pedido explícito de adiar o envio. A próxima funcionalidade prevista é Propósito do Núcleo e deverá ter registro próprio e versão definida após implementação e validação.
