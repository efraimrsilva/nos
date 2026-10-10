# Entrar por convite — v0.13.3

Atualizado em 2026-10-10. Referências: [percursos na Visão global](../../wireframes/atlas/index.html#visao-global), [Tela 10](../../wireframes/atlas/index.html#tela-10), [Tela 11](../../wireframes/atlas/index.html#tela-11) e [comparação](../../wireframes/comparacoes/v0.13.3-2026-10-10-entrar-convite-tela_10-tela_11/index.html).

## Sequência e decisões

- **Chegada direta:** `/comecar/convite` → Conta quando necessário → retorno a `/comecar/convite` → inserir código → conferir → prévia → aceite explícito → `/nucleos/[id]` → Seus Núcleos. A Tela 12 não é uma etapa obrigatória antes de conferir quando já existe destino específico.
- **Entrada comum:** Conta → Seus Núcleos → Entrar com um convite → conferir → prévia → aceite → Início. Escolher caminho permanece alternativa protegida.
- **Cadastro/confirmação/recuperação:** caminhos alternativos dos Percursos 02/03 preservam o destino interno validado. Autenticar ou confirmar e-mail não aceita convite. O código precisa ser colado após autenticação; o contrato atual não o transporta por URL.
- **Agora não:** da prévia para Seus Núcleos, sem associação, resposta de recusa, revogação ou penalidade. Não há entidade de convite individual respondido; o código atual pode ser usado por mais de uma pessoa enquanto válido.

## Contrato existente

Código hexadecimal de 32 caracteres, normalizado com trim e minúsculas. Formato inválido não consulta o banco. `inspect_invitation` revela somente nome, tipo e propósito; não libera membros, acordos, agenda ou dados privados. Editar código oculta a prévia e o erro de aceite associado.

`accept_invitation` revalida autenticação, validade e revogação, cria vínculo `member` e retorna o identificador do Núcleo. A chave composta impede duplicação; repetir preserva papel, inclusive o do criador. Aceitar convite não responde nem aceita acordos. A leitura privada depende da associação e das políticas RLS (Row Level Security, segurança por linha).

Criador associado pode gerar/reutilizar convite ativo por `create_initial_invitation` nas Telas 09/58. Código expira em sete dias; compartilhamento nativo e alternativa de cópia já existem. Nenhum código deve constar em logs, documentação ou capturas. A prévia do Atlas usa exemplos e não consulta o banco.

## Estados e validação

Sem sessão: login com retorno. Código vazio/incompleto: erro de entrada. Convite desconhecido, expirado ou revogado: mensagem sem prévia. Revogação depois de conferir: aceite negado e nenhum vínculo criado. Consulta/aceite pendentes: botão desabilitado e texto de andamento. Falha não equivale a sucesso. Edição após erro permite conferir outro código. Início de Núcleo alheio permanece indisponível antes da associação.

Testes locais com duas identidades reais cobrem esses estados, adiamento, retorno de login, navegação à lista e repetição sem mudança de papel. Backend e dados de teste são exclusivamente locais; resultados não certificam operação remota ou deploy. [Registro da entrega](../registros/registro-v0.13.3-2026-10-10-imp-entrada-convite-fun-percurso-04.md).

## Espaços reservados

| Extensão | Reserva no Atlas | Dependências antes de implementar |
| --- | --- | --- |
| Gerar QR e ler por câmera | Telas 58 e 10 | Formato seguro, origem HTTPS, permissão de câmera hoje bloqueada pela configuração, acessibilidade e alternativa por código. |
| Convite por link com código | Tela 10 e Percurso 04 | Transporte seguro durante autenticação, remoção de credencial da URL, política de referência e retenção. Não habilitado pela lista atual de retornos. |
| Listar ativos/aceitos/expirados e revogar | Tela 59, Planejada | Contrato de status/consumo/rastreabilidade, RPC autorizada de revogação, concorrência, confirmação e testes. Revogar não remove quem já entrou. |
| Administradores e limites ampliados | Telas 58/59 | Papéis e permissões próprios; o banco atual autoriza geração ao criador associado. |
| Convites individuais/notificações | Telas 59/65 | Destinatário, entrega e respostas precisam de modelo próprio; não inferir aceite/recusa de silêncio. |

SMTP (Simple Mail Transfer Protocol, envio de e-mail) público ainda depende da senha de aplicativo do Gmail e recebimento externo comprovado, além de origem e URLs HTTPS. Isso afeta cadastro/recuperação de quem recebe convite; não invalida a integração local testada. [Preparação operacional](recuperacao-smtp-gmail.md).
