# Plano — sincronização periódica dos nomes de perfil — 2026-11-07

Versão final3.11.0, concluído e validado localmente. Escopo: reaproveitar conferência a cada3s para refletir mudanças de nomes em outras sessões associadas, sem recarga integral e sem perder modal/rascunho. Preservar mudanças visuais preexistentes3.10.4–3.10.6. Sem publicação autorizada.

1. Regressão: teste local com2 sessões, alteração pelo formulário real e observador com integrantes/detalhes abertos; conferir lista de Núcleos e recuperação após falha. Capturar antes, depois e limitações.
2. Banco: RPC get_nucleus_identity_version sem argumentos, autenticada e com search_path vazio; resumo determinístico de Núcleos autorizados e nomes visíveis (próprio e integrantes atuais de Núcleos comuns). Não retornar nomes/e-mails/IDs ao navegador. SQL testa isolamento, estabilidade, novos nomes e remoção de vínculo. Sem trigger, tabela nova ou escrita extra ao salvar perfil.
3. Servidor: mesmo leitor na renderização e no polling; trocar leitura paginada por RPC única. Se indisponível, não bloquear página nem apagar dados. Manter temporizador3s, pausa em segundo plano/offline, retorno online e router.refresh existentes.
4. Validação: suíte autenticada afetada e SQL local, tipos/build, revisão independente e diff. Context7 para Next16 (índice até16.2.9; confirmar com instalado16.3.6/tipos), Supabase2.117.2. Sem dependência nova; Realtime adicionaria mecanismo/custo sem necessidade para o pedido.
5. Documentar contrato/Atlas/MVP, evidências, registro versionado, estado/histórico/Brag. MINOR3.11.0 concluída por evolução compatível. Migração local somente; aplicação remota/publicação pendentes de autorização correspondente.


Fechamento:8 testes autenticados/23 SQL/tipos/build aprovados, revisão independente sem bloqueantes e galeria registrada. RPC única implementada, leitor/polling integrados. Migração aplicada/registrada somente localmente. Publicação coordenada exige banco antes do frontend; não realizada nesta tarefa.
