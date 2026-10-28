# Aparência da conta — plano de implementação — v3.2.0

Design aprovado no chat em 2026-10-23: sete temas (Claro/Jardim, Escuro/Anoitecer, Preto/Meia-noite, Rosé/Aurora, Lilás/Lavanda, Azul/Oceano, Verde/Floresta), disponíveis para todas as pessoas. Uma opção Aparência no menu Mais agrupa a escolha; acesso equivalente no computador e em Configurações. Aplicação imediata, salvamento automático na conta, feedback de erro e nova tentativa.

## Entregas e verificação

- [x] Preferência e interface: catálogo validado, ação autenticada que atualiza somente appearance_theme em user_metadata, tema inicial renderizado no servidor e seletor acessível. Arquivos em src/features/appearance; integração em src/app/layout.tsx, src/shared/components/application-shell.tsx e src/app/configuracoes/page.tsx. Teste inicial em tests/authenticated/themes.spec.ts deve falhar pela ausência de Aparência. Sem migração SQL ou dependência nova. Não usar metadados de aparência para autorização.
- [x] Paletas: variáveis para fundos, superfícies, textos, ações e estados; preservar semântica de alertas e contraste em todas as famílias existentes. CSS de aparência e ajuste dos estilos de Conta, Acordos, Pessoas e Agenda. Preto tem fundo #000000. Conferir contraste, teclado, movimento reduzido, largura móvel e sete capturas por dispositivo.
- [x] Fechamento: testes da ação real com transporte externo isolado, suíte autenticada com contas descartáveis locais, regressões sem backend, tipos/build, autorrevisão e revisão independente; sincronizar Atlas, contrato, roteiro manual, cobertura, registro versionado, estado/histórico/Brag e manifestos. Incrementar MINOR somente depois da validação. Nenhum commit/push/deploy autorizado.

## Decisões

Supabase JavaScript 2.117.2 / SSR 0.12.7, Next 16.3.6, React 19.3.0, versões declaradas no projeto. Context7 consultado para updateUser/getUser; catálogo sem versão exata do cliente, verificar também os tipos instalados. Octocode 19.1.0 já configurado; ferramenta não exposta nesta sessão, sem pesquisa avançada entre repositórios necessária. Buscas locais delimitadas. Branch codex/temas-conta, base 34d0598; Git limpo antes dos arquivos desta entrega.

O servidor obtém a preferência da conta antes de emitir a página, evitando flash do tema padrão no recarregamento. A interface mantém a prévia em caso de falha, informa que não foi salva e permite tentar novamente. Gravações serializadas evitam que respostas fora de ordem sobrescrevam a escolha mais recente. Nenhuma preferência global em localStorage deve contaminar outra conta.

Entrega validada:154 gerais,12 focados e oito autenticados. Escopo ampliado pelo usuário: telas públicas sempre claras e cor de navegação própria por tema, com faixa desktop e indicador móvel/Mais ativo. Revisões corrigiram dois contrastes; capturas por viewport. Versão3.2.0; sem commit/push/deploy.
