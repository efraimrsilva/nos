/* O mapa referencia IDs; conteúdo, desenhos, ações e percursos continuam nas fontes do atlas. */
'use strict';
const globalAreaNotes=[
  'Conta é a entrada. Cadastro, confirmação e recuperação são caminhos alternativos; a Tela 72 é acolhimento opcional.',
  'Após login, Seus Núcleos reúne associações reais e abre o Início escolhido. Sem associações, oferece criação ou convite. Escolher caminho é uma alternativa protegida; não há rascunho antes do login.',
  'O Início é o retorno do Núcleo. Agenda14 → criação16 → evento/respostas15 → edição17 opcional → agenda14. Evento existente abre15 diretamente; os quatro estados compartilham a rota. Remover exige confirmação; manter não grava. Mês/recorrência/local/integrações são planejados.',
  'Publicar, participar individualmente, testar e registrar são etapas distintas; administrador gerencia o ciclo sem votação. Revisão, encerramento e experiências são ramificações.',
  'Árvore e Memórias têm rotas protegidas de esboço, sem persistência. Marcos e gratidão continuam planejados. Indicadores e Essência exigem seus contratos; não avançam automaticamente.',
  'Conexões e Perfis têm esboços protegidos, sem persistência; o módulo completo depende de autorização e compartilhamento voluntário. Consultar outra pessoa não permite editar seus dados.',
  'Manifesto e Cuidado têm esboços protegidos sem persistência; convites e notificações partem de contextos distintos. Preparação privada, cartão e encontro não formam um chat.',
  'Preferências e segurança são acessos contextuais. Sair da conta, sair do Núcleo e tratar dados têm consequências diferentes.'
];
// Ajustes de leitura: criação antes do detalhe, registro antes do histórico; legado é alternativa da confirmação.
const globalReadingOrder={1:[12,6,7,8,9,10,11],2:[13,14,16,15,17],3:[18,19,20,21,22,23,24,27,25,28,29,26,30,31,32,33,34,35,36,37],4:[38,39,40,42,41,43],7:[73,71,66,67,69,70,68]};
function orderedGlobalScreens(list,chapter){
  const order=globalReadingOrder[chapter];
  const rank=screen=>order?.includes(screen.id)?order.indexOf(screen.id):1000+screen.id;
  return [...list].sort((a,b)=>rank(a)-rank(b));
}
function globalJourneyHtml(journey,index){
  return `<details class="global-journey" ${index<3?'open':''}><summary><span>Percurso ${pad(index+1)}</span>${escapeHtml(journey.name)}</summary><div class="flow-path">${journey.ids.map((id,i)=>{
    const direct=i&&byId(journey.ids[i-1]).actions.some(action=>action.to===id);
    const transition=i?`<span class="global-transition ${direct?'direct':'context'}" data-from="${journey.ids[i-1]}" data-to="${id}" title="${direct?'Saída prevista na ficha':'Etapa de contexto; não implica botão direto'}"><span aria-hidden="true">${direct?'→':'↝'}</span><small>${direct?'Saída':'Contexto'}</small></span>`:'';
    return `${transition}<button class="flow-node" data-go="${id}" ${journey.steps&&id===1?'data-entry-login':''}><strong>${pad(id)}</strong>${escapeHtml(byId(id).title)}<small>${escapeHtml(byId(id).status)}</small>${journey.steps?.[i]?`<small>${escapeHtml(journey.steps[i])}</small>`:''}</button>`;
  }).join('')}</div><p>${escapeHtml(journey.rule)}</p>${futurePathHtml(journey)}</details>`;
}
function renderGlobal(){
  const savedReference=referenceMode,savedLayout=documentLayoutKey;referenceMode=false;documentLayoutKey='';
  const filtered=filteredScreens();
  try{
    const visible=new Set(filtered.map(screen=>screen.id));
    const paths=journeys.filter(journey=>journey.ids.some(id=>visible.has(id)));
    $('#global-view').innerHTML=`<header class="global-intro"><p class="eyebrow">VISÃO GLOBAL / ATLAS VIVO</p><h2>Do acesso ao cuidado diário</h2><p>Comece por Conta, escolha criar ou entrar com convite e chegue ao Início do Núcleo. A partir daí, explore os módulos conforme a intenção de vocês.</p><div class="global-facts"><span>${screens.length} telas na mesma fonte</span><span>${screens.filter(s=>s.status==='Recorte existente').length} recortes existentes</span><span>${screens.filter(s=>s.status==='Planejada').length} planejadas</span></div><p class="global-notice">Layout atual em migração · base v1.1.0. Esboços futuros permanecem identificados como Planejada. Ordem de leitura e caminhos com condições. Todas as áreas abaixo não são etapas obrigatórias. As imagens, fichas e saídas são as mesmas do atlas; o conteúdo afetivo é ilustrativo.</p><nav class="global-jumps" aria-label="Ir para um módulo">${chapters.map((chapter,index)=>filtered.some(screen=>screen.chapter===index)?`<button data-global-area="${index}">${pad(index+1)} · ${escapeHtml(chapter)}</button>`:'').join('')}</nav></header>${filtered.length?`<section class="global-paths" aria-label="Sequências e alternativas"><h2>Os caminhos entre as telas</h2><p>Os ${journeys.length} percursos vêm do mesmo inventário usado em Percursos. Ao filtrar, cada caminho permanece completo para preservar seu contexto.</p><p class="global-legend">→ Saída: destino previsto na ficha. ↝ Contexto: etapa conceitual, sem sugerir navegação direta. Consultar situação e condições em cada tela.</p>${paths.map(journey=>globalJourneyHtml(journey,journeys.indexOf(journey))).join('')}</section>${chapters.map((chapter,index)=>{
      const list=orderedGlobalScreens(filtered.filter(screen=>screen.chapter===index),index);if(!list.length)return '';
      return `<section class="chapter global-area" id="global-area-${index}"><div class="chapter-header"><h2 tabindex="-1"><span>${pad(index+1)}</span>${escapeHtml(chapter)}</h2><p>${list.length} telas · mesma fonte visual</p></div><p class="global-area-note">${escapeHtml(globalAreaNotes[index]||'Área acrescentada ao inventário. Conferir seu contexto e as saídas das fichas.')}</p><div class="screen-grid">${list.map(screen=>tileHtml(screen,true)).join('')}</div></section>`;
    }).join('')}`:'<p class="no-results">Nenhuma tela corresponde aos filtros. Ajuste a busca ou selecione Todas as situações.</p>'}`;
  }finally{referenceMode=savedReference;documentLayoutKey=savedLayout;}
  document.querySelectorAll('#global-view .phone').forEach(phone=>{for(const child of phone.children)child.inert=true;});
  scaleThumbnails();
}
