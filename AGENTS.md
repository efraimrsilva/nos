# Diretrizes permanentes do projeto Nós

## Versionamento do sistema e Atlas vivo

- Toda entrega que altere o sistema deve atualizar sua versão antes de ser considerada concluída. Agrupar os ajustes de uma mesma entrega em uma versão, sem incrementar a cada edição de arquivo.
- Usar versionamento semântico: PATCH para correções e ajustes compatíveis; MINOR para novas funcionalidades compatíveis; MAJOR para mudanças incompatíveis.
- Manter a mesma versão em `package.json`, na raiz e no pacote principal de `package-lock.json`, na indicação de versão vigente do `README.md` e na identificação visível do Atlas vivo em `Documentacao_Projeto_Nos/wireframes/atlas/index.html`.
- O Atlas vivo deve ser sempre o espelho do sistema atual. Na mesma entrega, refletir nele as alterações de telas, textos, navegação, componentes, estilos, estados e interações representadas. Atualizar apenas o número da versão não basta.
- Conferir a correspondência entre implementação e Atlas antes de concluir a entrega. Preservar a identificação explícita de funcionalidades planejadas e de dados ilustrativos; não apresentar planejamento como funcionalidade implementada.
- Preservar versões e datas dos registros históricos. Atualizar as indicações vigentes sem reescrever o histórico.
- Incluir o versionamento e as alterações correspondentes do Atlas no mesmo conjunto de entrega do sistema. Quando commit e push estiverem autorizados, publicar esse conjunto junto.
- Não afirmar que uma versão foi implantada ou verificada em produção sem confirmação. Distinguir a versão atual do código da situação da implantação.
- Mudanças exclusivamente documentais, sem alteração no sistema ou em sua representação no Atlas, não exigem incremento da versão.

Estas diretrizes permanecem válidas para as próximas entregas, salvo orientação explícita diferente do usuário.