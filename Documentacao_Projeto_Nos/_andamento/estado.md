# Estado do Projeto Nós

**DOCS_DIR:** `Documentacao_Projeto_Nos`

**Atualizado:** 2026-09-25

**Objetivo ativo:** implementar o onboarding do app Nós em etapas, abrangendo todos os tipos de Núcleo desde o início.

## Situação

A tela **Escolher caminho** está implementada em `/comecar`. Os caminhos de criação e convite navegam para telas preparatórias compartilhadas. Não há criação persistente, autenticação ou Supabase configurado. O app ainda não está publicado.

## Decisões vigentes

- TypeScript, React, Next.js, Tailwind; Supabase para backend futuro; Capacitor depois da web, Android antes de iOS.
- Suporte a todos os tipos de Núcleo por um modelo extensível.
- Usar Context7 em consultas de documentação técnica, respeitando a versão instalada e sem enviar dados privados.
- Manter este diretório atualizado; monitoramento automático permanece cancelado.

## Verificações recentes

Na entrega inicial: oito testes Playwright passaram; build e verificação de tipos passaram. Para a alteração de comentários desta interação, não foram adicionados nem executados testes.

Em 2026-09-25, o comando de desenvolvimento foi reproduzido: `ENOENT` na pasta pai sem `package.json`; inicialização `Ready` em `nos`; navegador exibiu `/comecar` sem sobreposição de erro. O servidor temporário foi encerrado e a porta 3000 ficou livre para o terminal do usuário.

Na interação seguinte, foi criado um lançador local em `G:\Efraim\Dev\PROJETOS\Projeto Nós\package.json` para aceitar `npm run dev` na pasta principal. O comando encaminhou ao Next.js; uma instância já ativa respondeu HTTP 200 em `/comecar` e bloqueou uma segunda execução pelo lock de desenvolvimento. O lançador fica fora do repositório Git `nos`.

Para a entrega GitHub de 2026-09-25, oito testes Playwright, build de produção e checagem de tipos passaram. A revisão independente encontrou uma instrução de verificação incorreta no README (corrigida) e um comando de teste específico do Windows (substituído por `npm run dev` conforme documentação do Playwright 1.63). Testes e tipos passaram novamente após o ajuste.

## Trabalho local e commit

Git: branch `main`, base anterior `2b17d18`. A aplicação inicial, documentação e comentários formam uma unidade de entrega registrada em commit da branch `main`. O envio a `origin/main` deve ser conferido pelo Git; este registro não substitui a verificação do remoto. A configuração global do Context7 e o lançador da pasta principal ficam fora do repositório.

**Unidades prontas para commit:** nenhuma desta entrega após a confirmação do commit no Git.

## Continuidade, contagem e auditoria

- A contagem começa em 2026-09-25, por não haver contagem histórica verificável: 4 interações concluídas desde esse marco; próxima auditoria na interação 100.
- Última revisão de over-engineering: nenhuma (0).
- Próximo passo executável, quando solicitado: implementar catálogo e tela Tipo de Núcleo, conforme a documentação de produto.
- Bloqueio: nenhum para a tela atual. Backend e contas de serviços ainda não configurados.

## Índice

- [Histórico](historico.md): eventos e resultados em ordem cronológica.
- [Brag document](../brag/BRAG.md): contribuições verificáveis.
- [Primeira tela](funcionalidades/escolher-caminho.md): escopo e continuidade.
- [Frontend web](tecnologias/frontend.md): stack, segurança e organização.
- [Registro da primeira sessão](registro-2026-09-24.md): decisões e implantação inicial.
- [Estado anterior](estado-atual.md): referência histórica.
- `README.md`: protocolo do andamento.
