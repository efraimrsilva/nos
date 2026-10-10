# Registro — v0.13.3 — 2026-10-10 — Imp. de diretriz de comparações com Fun. de identificação de tela

**Status:** concluído; documentação, sem incremento funcional. Inclusão no commit autorizado das diretrizes/migração comprovada por inspeção do objeto; controle no registro de sequência 06.

**Atualização posterior:** usuário autorizou [migração das seis galerias existentes e seus caminhos](registro-v0.13.3-2026-10-10-05-imp-migracao-comparacoes-fun-caminhos-versionados-telas.md). Conteúdo histórico preservado, nomes/referências adequados; a orientação anterior de não renomear foi substituída por essa autorização.

## Objetivo, contexto e requisitos

Usuário ampliou o padrão para incluir número da tela e esclareceu que deve ser escrito tela_tal. Aplicado como v<versão>-AAAA-MM-DD-assunto-tela_<número>, exemplo v0.13.3-2026-10-10-entrada-convite-tela_10. Versão vigente 0.13.3; main em dbefcd3. Alterações documentais da diretriz anterior presentes no Git foram preservadas.

## Decisões e integração

Usar prefixo literal tela_ e ID estável do atlas com pelo menos dois dígitos. Para várias telas, repetir cada identificador em ordem numérica no final (tela_10-tela_11). Em colisão de nomes, colocar revisao-02/revisao-03 no assunto, antes das telas, mantendo identificadores no final. Preservar galerias históricas. Se houver incremento funcional na entrega, ajustar versão da pasta e suas referências ao concluir.

## Arquivos alterados

wireframes/comparacoes/README.md e wireframes/GUIA.md: padrão vigente. _andamento/estado.md, historico.md e este registro: continuidade e unidade pendente. Registro de sequência 03 sinalizado como substituído, sem apagar a decisão original. Sem alteração em código, manifestos, banco, imagens ou nomes de pastas existentes.

## Validação, resultado e limites

Autorrevisão de exemplos e coerência dos procedimentos; alvos de links locais e git diff --check conferidos. Sem testes funcionais, tipos ou build, pois a alteração é documental. Superpowers de verificação aplicado proporcionalmente. Não houve commit, push ou deploy. Não foi solicitada renomeação retroativa de galerias.

## Próximo passo

Aplicar a identificação literal tela_ na próxima pasta de comparação. Decisão anterior e ampliação compõem uma única unidade documental para commit autorizado; a continuidade funcional permanece no estado vigente.
