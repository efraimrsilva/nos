# Integração de temas e navegação — 2026-10-28

Integração local da branch `origin/codex/temas-conta` à base atual de `main`, preservando mudanças locais de acesso, árvore/reflexões, rodapé e transporte com proxy. Nove temas, preferência por conta, navegação e totais pessoais restaurados. Sem commit, push, deploy ou operação no banco remoto nesta rodada.

## Escopo

- Nove paletas em Mais → Aparência, navegação lateral e Configurações; atualização imediata, salvamento da preferência da própria conta e tratamento de falha/reenvio.
- Telas públicas conservam o tema claro; ícones preservam suas cores.
- Totais pessoais e migração `20261024120000_navigation_counts.sql` recuperados da branch original. A migração não foi executada em banco remoto nesta integração.
- Diálogos mantêm abertura inicial, fechamento ao navegar, foco e ícone de fechar da main atual. Árvore, rodapé, autenticação e inicialização local foram conciliados sem reverter as mudanças preexistentes.
- Contratos, roteiros e galerias históricos importados; a nova galeria preserva os arquivos das verificações anteriores.

## Verificação desta integração

Tipos e build de produção (Turbopack, saída isolada em `.next-verify`) aprovados. Verificadores do Atlas aprovados: nove temas, menu Mais, navegação desktop/mobile e totais ilustrativos; sem erros JavaScript ou requisições externas.

Os testes antigos de acesso foram adaptados aos modais já existentes na main: seletor do formulário de login, retorno pelo logotipo, resposta com submittedEmail e consulta de conta na recuperação. Incluída verificação de que conta inexistente não recebe pedido de recuperação.

Supabase local indisponível: a persistência real após recarregar e as suítes autenticadas/SQL não foram reexecutadas. A ação real de temas é exercitada com transporte isolado na suíte geral; isso não certifica a integração com Auth real. Os resultados históricos da branch não são resultados desta rodada. Testes de caixa preta permanecem Não executados.

Resultado final: a primeira execução geral teve 166 aprovados e 16 falhas de expectativas antigas. Após atualizar os seis arquivos de testes afetados, todos os 58 cenários desse recorte passaram, incluindo dois novos casos (desktop/celular). Cobertura combinada: 184 cenários aprovados entre execução geral e retestes; nenhuma falha remanescente. Verificação de tipos repetida após os testes: aprovada. `git diff --check`: aprovado. Arquivos locais preexistentes fora da integração conferidos byte a byte com o backup: inalterados.

[Galeria desta integração](../../wireframes/comparacoes/2026-10-28-integracao-temas/index.html).
