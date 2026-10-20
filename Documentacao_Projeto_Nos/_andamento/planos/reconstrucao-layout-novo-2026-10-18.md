# Reconstrução integral da apresentação — Layout novo

Status: Concluído — v3.0.0. Implementação, revisão, verificações, galeria/manifestos, documentação e limpeza concluídas localmente. Sem commit ou publicação.

Objetivo: remover o uso visual do primeiro layout em todas as rotas e reconstruir interiores/modais conforme Telas/Layout novo. O usuário reafirmou que nada do layout antigo deve permanecer no aplicativo. Regras de negócio, sessão, permissões e dados permanecem reais; funcionalidades futuras ficam sinalizadas.

Arquitetura: um único sistema de estilos com tokens da referência, cabeçalho tipográfico sem serifa e painéis editoriais; diálogos nativos acessíveis para criação, detalhes e gestão. Rotas diretas continuam acessíveis com composição nova. Sem camada de overrides de CSS legado e sem nova dependência.

- [x] Capturar referência e estado encontrado (desktop/celular) antes das alterações.
- [x] Shell, estilos, componentes de diálogo; reconstruir início/listagem e módulos de esboço.
- [x] Agenda, pessoas e convites: grade e painéis da referência, criação/edição/participação/gestão em diálogos.
- [x] Acordos: quadros, detalhes, proposta, registro, termos e administração na composição nova, com modais.
- [x] Conta/onboarding/configurações/ajuda: remover cartões antigos, agrupar tarefas, novos formulários/modais; preservar autenticação e frases10s.
- [x] Auditoria de fontes: remover CSS morto e componentes antigos de apresentação; todas as rotas com novo marcador de revisão.
- [x] Verificar testes gerais e fluxos autenticados locais, tipos/build, teclados, overflow e movimento reduzido.
- [x] Atualizar Atlas/referências e criar galeria versionada com antes/depois/referência e modais realmente abertos.
- [x] Revisão independente, correções, registro/estado/histórico/Brag e versão final.

Aceite: interiores coerentes com a referência; nenhum formulário extenso permanentemente empilhado quando houver ação de modal; nenhuma mutação simulada apresentada como real; links e confirmações preservados; prints reais de todas as famílias e dos novos diálogos. Não publicar nem commitar sem autorização.
