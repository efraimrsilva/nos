# Aparência da conta — v3.4.1

Atualização v3.3.1 — 29/10/2026: Aparência abre no painel do perfil desktop ou na seção de /conta, acessível também pelo menu mobile. O seletor mantém nove temas e feedback após operação; descrições redundantes e espaço vazio removidos. Indicações anteriores de atalho independente na navegação são históricas. [Registro](../registros/registro-v3.3.1-2026-10-29-imp-conta-perfil-fun-navegacao-contextual.md).

Integração em 28/10/2026: código recuperado da branch `codex/temas-conta` e conciliado com a main atual, incluindo mudanças locais. Tipos, build, testes gerais/retestes e Atlas aprovados; sem nova validação autenticada ou publicação nesta rodada. [Registro](../registros/registro-v3.3.0-2026-10-28-integracao-temas-main.md).

Status: implementada e validada localmente em 2026-10-23. Publicação pendente. Atlas: MVP05, Tela66 e navegação compartilhada. Design aprovado no chat; ajustes posteriores: login/boas-vindas sempre claros e destaque da localização por tema no computador/celular.

## Uso e comportamento

Mais → Aparência reúne nove temas; o computador oferece a mesma opção na navegação lateral. Configurações também abre o seletor. Todos podem escolher qualquer tema: Claro/Jardim, Escuro/Anoitecer, Preto/Meia-noite, Rosé/Aurora, Lilás/Lavanda, Azul/Oceano, Verde/Floresta, Solar/Âmbar e Noturno/Neon. A nomenclatura não restringe acesso por gênero.

A seleção altera imediatamente a área interna. O seletor informa o salvamento; sucesso só aparece após confirmação do Auth. Falha mantém a prévia e oferece Tentar salvar novamente. Cliques rápidos são serializados: a última escolha é enviada por último. A preferência é geral da conta, não de um Núcleo. Sessão antiga não grava na conta de outra pessoa. Boas-vindas e telas públicas da Conta, incluindo login, cadastro, recuperação e confirmação, mantêm as cores originais.

Cada tema possui cor de navegação própria: verde, turquesa, violeta, vinho, roxo, azul, esmeralda, cobre e verde-lima, respectivamente. A área atual usa aria-current=page, peso700 e fundo suave. No computador há uma faixa lateral; no celular um indicador superior. Mais fica marcado quando a rota está fora dos itens da barra inferior. A seleção de tema não muda a localização da página. Subpáginas preservam a área de origem destacada: convites/saída em Pessoas, memórias em Árvore, perfis em Conexões, cuidado em Manifesto, Ajuda em Preferências e criação em Núcleos.

## Padrão visual permanente

Aparência usa o mesmo alinhamento, cor, fonte, espaçamento e fundo dos demais itens da navegação desktop e menu Mais. A variante navigation do diálogo evita herdar o estilo de botão de ação; o foco acessível permanece.

As cores originais dos ícones coloridos são invariantes nos nove temas, inclusive em itens ativos. Não uniformizar ícones com a cor do tema; o destaque de localização pertence ao texto, ao fundo e ao marcador. Preservar as cores específicas também em Agenda, Pessoas, convites e exclusão da conta.

## Integração

`src/features/appearance/themes.ts` valida os identificadores e fornece as prévias. `actions.ts` consulta getUser, compara o identificador da sessão e chama updateUser com somente data.appearance_theme. user_metadata serve exclusivamente para preferência pessoal; não concede permissão. Não há tabela, migração, nova dependência ou gravação localStorage.

O layout raiz lê a preferência antes da primeira renderização e identifica o provedor pela conta. CSS (folhas de estilo em cascata) utiliza papéis para fundo, superfície, texto, destaque e estados. A regra das telas públicas também funciona antes da hidratação (ativação do HTML pelo React no navegador). Os gatilhos dos diálogos e do menu aguardam essa ativação para não perder o primeiro clique.

## Evidências e limites

- v3.2.1:158 testes gerais;16 focados repetidos após a ampliação dos ícones. Seis autenticados de temas/navegação, mais quatro de temas repetidos com as cores finais. Oito autenticados da entrega3.2.0 permanecem como evidência histórica.
- Ação real com transporte isolado: tema inválido, sessão ausente/trocada, resposta sem confirmação e falha de conexão.
- Navegador real: nove temas, persistência após reload, leitura em outra sessão Auth, exclusão de cookies, público claro, falha/reenvio, cliques rápidos, movimento reduzido e indicadores por tema.
- Contraste mínimo de4,5:1 verificado nos tokens e em componentes reais de texto/campos/ações/sucesso/erro/revogação. Não equivale a auditoria completa de acessibilidade de todas as telas.
- Revisão independente encontrou dois problemas de contraste, corrigidos e cobertos por estilos computados reais. Autorrevisão complementar.
- [Galeria](../../wireframes/comparacoes/v3.2.1-2026-10-23-temas-solar-neon/index.html):36 capturas reais de seletor/navegação e duas capturas da prévia do Atlas. Diálogos capturados pela área visível; fullPage do Chromium produziu artefato de composição reproduzido separadamente.
- Atlas oferece prévia local sem salvar preferência na conta. Nenhuma conta real foi alterada. Outra aba já aberta mantém a escolha atual até novo carregamento; não há sincronização em tempo real entre dispositivos/abas.

[Roteiro manual](../testes-manuais/aparencia-conta.md) · [Plano](../planos/temas-conta-2026-10-23.md).

## Complemento de validação — 28/10/2026

Supabase local preparado e persistência real revalidada. Dez cenários autenticados de temas/navegação aprovados em desktop/celular, incluindo nove temas, reload, outra sessão, falha/reenvio e cliques rápidos. Recuperação com sessão abre modal na conta interna e conserva o tema; apenas as telas públicas permanecem claras. [Registro do ambiente e resultados](../registros/registro-v3.3.0-2026-10-28-supabase-local.md) · [galeria real](../../wireframes/comparacoes/2026-10-28-supabase-local/index.html). Sem nova publicação.

## v3.4.1 — Meia-noite — 30/10/2026
Fundo cinza escuro #101312; cartões/painéis e coluna lateral pretos #000000. Prévia do seletor e Atlas acompanham as camadas. Identificador black, textos, acentos e persistência preservados.
