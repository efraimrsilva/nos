# Plano — MVP 05 — autonomia e proteção

Data: 2026-10-13. Base: main c40594f, inicialmente limpo. DOCS_DIR: Documentacao_Projeto_Nos.

Objetivo autorizado: conferir Telas 66/67/69/70/71, concluir o viável, ordenar navegação e reservar funções sem contrato. O Atlas impede remover vínculo sem retenção/dependências; saída efetiva não pode ser inventada nesta entrega.

1. Conferir contratos, Auth, matriz e desenho vivo. Identificar orientação disponível versus mutações ainda sem regras.
2. Testar retorno interno e bloqueio de acesso; implementar páginas autenticadas próximas do dado, reusando shell e Auth. Configurações abre Privacidade, Conta e segurança ou Ajuda; Início abre orientação de saída.
3. Testar com contas locais: criador/participante, Núcleo alheio, recuperação com retorno e logout preservando vínculo. Capturar desktop/mobile com dados fictícios autorizados.
4. Sincronizar fichas/desenhos/MVP/Visão global/cobertura e galeria antes/depois. Preservar desenho histórico; não mostrar toggles de funcionalidades indisponíveis.
5. Revisar diff e boas práticas React, testes gerais, tipos/build, verificadores Atlas. Atualizar versão somente após a conclusão do recorte, registrando a etapa global como parcial.

Arquivos: src/app/configuracoes, ajuda, nucleos/[id]/sair; src/features/controls; proxy/retorno/routes; links Conta/lista/Início; tests/controls e authenticated/controls; Atlas e documentos relacionados.

Aceite: páginas disponíveis apenas com sessão; saída exige associação própria e distingue papel; nenhum acesso indevido, remoção, exportação ou envio fictício; retorno permitido sem parâmetros privados; teclado/responsividade/feedback de logout; reservas explicam o que falta. Sem nova tabela/migração/dependência.

Pendências de produto/operação: saída e transferência consentida; retenção/direitos; responsável/canal de suporte e termos; preferências; reautenticação/administração granular de sessões; SMTP/segredo de recuperação, limites, logs, backup/restauração e prova online. Nenhuma autorização de publicação nesta solicitação.

Resultado — v0.16.0: recorte concluído localmente; etapa parcial.106 gerais produção, quatro autenticados finais, tipos/build e Atlas aprovados;125 arquivos idênticos por SHA-256,584 referências válidas e46 imagens. Revisão independente P2 corrigido e P3 documentais ajustados. Sem commit/push/deploy.
