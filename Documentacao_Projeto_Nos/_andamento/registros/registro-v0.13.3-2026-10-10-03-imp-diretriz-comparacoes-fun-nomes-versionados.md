# Registro — v0.13.3 — 2026-10-10 — Imp. de diretriz de comparações com Fun. de nomes versionados

**Status:** concluído; alteração documental, sem incremento funcional. Inclusão no commit autorizado das diretrizes/migração comprovada por inspeção do objeto; controle no registro de sequência 06.

**Atualização posterior:** formato substituído pela [diretriz com identificação de tela](registro-v0.13.3-2026-10-10-04-imp-diretriz-comparacoes-fun-identificacao-tela.md), usando v<versão>-AAAA-MM-DD-assunto-tela_<número>. Este registro preserva a decisão original; aplicar o padrão atualizado.

**Migração posteriormente autorizada:** o usuário solicitou também adequar as pastas existentes; a [migração e atualização de caminhos](registro-v0.13.3-2026-10-10-05-imp-migracao-comparacoes-fun-caminhos-versionados-telas.md) substitui a preservação dos nomes antigos descrita neste registro histórico.

## Objetivo e contexto

Usuário solicitou que as pastas dentro de wireframes/comparacoes/ incluam a versão vigente, data e assunto, como v0.13.3-2026-10-10-entrada-convite. Git inicialmente limpo em main, HEAD dbefcd3. Versão vigente conferida: 0.13.3.

## Requisitos e decisões

Padrão obrigatório para novas galerias: v<versão>-AAAA-MM-DD-assunto. Usar estado.md como referência de versão, data da entrega/comparação e assunto curto em minúsculas, sem espaços/acentos. Em colisão, acrescentar sufixo sequencial sem sobrescrever evidência. Se a entrega incrementar a versão ao finalizar, ajustar nome e referências para a versão final. Preservar nomes e links das galerias históricas; não foi solicitada migração retroativa.

## Arquivos e integração

wireframes/comparacoes/README.md contém a diretriz central; wireframes/GUIA.md referencia o mesmo padrão no procedimento obrigatório. Estado, histórico e este registro preservam decisão, versão, validação e pendência. Sem mudança em telas, scripts, código do produto, banco ou manifestos; não há nova galeria visual para esta alteração exclusiva de regra documental.

## Validações e resultado

Autorrevisão do diff e coerência entre guia/padrão/estado; alvos de links locais e git diff --check conferidos. Sem testes funcionais, tipos ou build: somente documentação foi alterada. Superpowers de verificação aplicado proporcionalmente; nenhuma documentação técnica de biblioteca ou pesquisa avançada de código necessária nesta tarefa.

## Limitações e próximo passo

Pastas existentes mantêm seus nomes. Aplicar o padrão na próxima galeria criada. Próximo recorte funcional permanece documentado no estado; esta diretriz não autoriza implementação, commit, push ou deploy. Unidade documental pronta para commit quando autorizado.
