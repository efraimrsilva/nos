# Plano — MVP 02 — Núcleo compartilhado

Versão vigente: v0.15.0. Referência inicial: v0.14.1, 2026-10-13. Status: plano executado e recorte local validado; publicação/migração online pendentes. Escopo autorizado: concluir o percurso existente e reservar ampliações sem contrato. Preservar alterações locais da conexão Netlify.

1. Conferir telas 12/06/07/08/09/58/59/10/11/13, código e permissões; registrar evidências antes.
2. Testar contrato de revogação: somente criador, repetição segura, sem remoção de membro e negativa de aceite revogado. Implementar RPC com bloqueios que ordenem aceite/revogação e geração simultânea.
3. Implementar gestão privada paginada, estados ativo/expirado/revogado, confirmação e navegação de retorno. Conectar convite inicial e Início; mostrar expiração real e espaços futuros.
4. Validar criação/conferência/aceite/retorno/isolamento e gestão com contas locais, desktop/celular; conferir banco, tipos/build e Atlas. Não alterar banco remoto.
5. Sincronizar fichas, MVP, percursos, cobertura, comparação datada, versão, registros e continuidade; revisar diff completo.

Critérios: associação somente após aceite; criador gerencia, participante não; revogar bloqueia novos aceites e preserva membros; geração simultânea reutiliza convite ativo; erro não simula lista vazia; datas em UTC explícito; futuro sem ações fictícias. Ordem: lista → escolha → tipo → propósito/conferência → convite → compartilhar/gerenciar → Início. Pessoa convidada: lista/escolha → código → prévia → aceite → Início → lista.

Futuro reservado: QR/câmera/link, destinatários individuais, histórico de utilização e administradores. SMTP e publicação/migração remota têm validação própria.
