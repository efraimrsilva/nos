# Referência visual do Next.js

Este diretório guarda a estética da última publicação do Nós em Next.js, v3.11.1. O código de referência é o commit [`604a142`](https://github.com/efraimrsilva/nos/tree/604a142d484ec2a284bc37a1225752cbc0715cc2). O [deploy anterior](https://6af77e4a9a6348f87af8b9e1--noslife.netlify.app) preserva a aplicação tal como publicada.

- [Estilos globais](src/app/globals.css) e [sistema de layout](src/app/layout-system.css) registram tipografia, cores, espaçamento e composição. `src/features/` guarda os estilos específicos de cada área.
- [Marca e imagens](public/brand/) preservam os recursos visuais da referência.
- [Atlas](../../docs/wireframes/atlas/index.html#migracao), [comparações](../../docs/wireframes/comparacoes/readme.md) e [mapa de paridade](../../docs/andamento/planos/paridade-angular-fontes.md) mostram telas, estados, diálogos e o código que produziu as composições.

O CSS é uma referência de leitura. As classes foram feitas para os componentes originais. O arquivo não contém um aplicativo executável e fica fora da compilação e da publicação Angular.

As saídas antigas de build desta cópia de trabalho foram movidas para `arquivo/nextjs-local/`, uma pasta local ignorada pelo Git. Para consultar o código original em outra máquina, use o snapshot Git indicado acima.
