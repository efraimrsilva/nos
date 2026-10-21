# Registro — v3.0.6 — 2026-10-21 — Imp. de publicação GitHub com Fun. de consolidação dos ajustes

**Autorização:** usuário solicitou commit/push de todas as alterações pendentes, com descrição abrangente. Branch main, base0813046, sincronizada com origin/main antes de preparar a publicação. Versão final3.0.6. Operação de Git, sem alteração de banco ou credenciais.

## Escopo e unidades
1. 1e6fb0d — documentação da execução local: causa do layout antigo comprovada como build obsoleto, npm run dev validado, orientação build/start e limites da limpeza registrados. Compilações e capturas ignoradas não fazem parte do Git.
2. 1c8be96 — destaque visual da administração: selo verde, negrito e ícone decorativo, condicionado ao papel admin; Atlas e manifestos3.0.5 alinhados.
3. Commit que contém este registro — navegação móvel complementar: Mais deixa de repetir Início/Acordos/Agenda/Pessoas, grupos vazios removidos; barra inferior, desktop, busca e demais áreas preservados. Asserções adicionadas ao teste autenticado existente; Atlas e manifestos3.0.6 alinhados. Estado e histórico consolidam também os eventos anteriores da mesma publicação.

## Descrição abrangente
Execução local e navegação seguem o layout atual. O modo dev já compila as fontes atuais; produção local depende de build recente. A indicação de administração fica visualmente distinta no Início. No celular, Mais reúne os caminhos complementares à barra inferior. As mudanças reutilizam dados, permissões e estilos existentes, sem novos serviços ou dependências.

## Validação e revisão
- npm run typecheck aprovado.
- Dez execuções de nucleus-home.spec.ts/layout-system.spec.ts aprovadas, contemplando lógica de vínculo e interface pública em desktop/mobile, contra servidor de desenvolvimento real.
- Verificação isolada de ApplicationShell aprovada: sem duplicação em Mais, sem grupos vazios e com barra inferior/desktop/demais destinos preservados.
- node --check do Atlas e git diff --check aprovados.
- npm run build padrão aprovado: Next.js16.3.6/Turbopack, TypeScript e19 páginas estáticas.
- Autorrevisão do conjunto e dos índices por unidade; sem nova revisão independente.

## Limites e continuidade
Suíte autenticada completa não executada nesta rodada; as novas asserções ficam disponíveis para futura execução local. Inspeção autenticada do selo/menu não foi refeita. Pastas antigas permanecem isoladas fora de nos por bloqueio automático de exclusão, sem uso pelo aplicativo. Nenhuma nova tentativa de exclusão no fechamento. Sem confirmação de deploy Netlify: o push pode acioná-lo automaticamente, mas a publicação Git não certifica seu resultado.

Próximo passo: confirmar hashes de HEAD/origin/main e conteúdo dos commits após push; posteriormente conferir a versão publicada em celular e conta administradora. Unidades anteriores de execução local, destaque e menu são incorporadas aos commits desta publicação; nenhuma outra pendência pronta para commit conhecida.
