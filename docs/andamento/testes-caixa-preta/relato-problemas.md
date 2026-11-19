# Relato de problemas — v3.7.0 — validado localmente

MVP05, telas66/70 e navegação compartilhada. Todos os casos **Não executados pelo usuário**; automação não os aprova. Autenticação SMTP real aprovada; recebimento externo ainda precisa de teste autorizado. Repetir desktop/celular, registrar cada execução em resultados.md.

| ID | Caminho / pré-condição | Ação | Resultado esperado | Status |
|---|---|---|---|---|
| M05-SUP-001 | Conta confirmada → Ajuda e suporte | Abrir Relatar um problema | Modal com descrição e passos opcionais; endereço da equipe oculto | Não executado |
| M05-SUP-002 | Perfil desktop / Mais mobile / cabeçalho | Abrir atalho | Mesmo formulário, sem sair da rota, nome acessível | Não executado |
| M05-SUP-003 | Modal aberto e SMTP válido | Descrever problema e enviar uma vez | Pendente bloqueia novo clique; confirmação somente após aceite do envio; equipe recebe relato com tela/versão/contato corretos | Não executado |
| M05-SUP-004 | Modal aberto | Enviar descrição curta ou acima do limite; passos acima do limite | Entrada rejeitada sem envio; corrigir e tentar novamente | Não executado |
| M05-SUP-005 | Envio recente da mesma conta | Reabrir em outra aba e enviar novamente antes de1min | Limite por conta bloqueia nova entrega; texto preservado | Não executado |
| M05-SUP-006 | SMTP indisponível | Enviar relato descartável | Erro honesto, texto mantido, sem confirmação falsa; tentativa respeita intervalo | Não executado |
| M05-SUP-007 | Relato aberto dentro da orientação | Fechar por X/Escape/fora, repetir teclado e320px | Apenas modal superior fecha, foco retorna; fechar antes de enviar não dispara mensagem; sem overflow | Não executado |
| M05-SUP-008 | Conta sem sessão/e-mail confirmado | Tentar envio | Servidor impede envio e orienta autenticar/confirmar | Não executado |
| M05-SUP-009 | Tela com parâmetro/código de convite | Enviar relato autorizado | Mensagem não inclui query/hash/código/identificador; destinatário e contato não podem ser alterados pelo formulário | Não executado |
