/* Atlas offline: os controles demonstram navegação e nunca acessam serviços do app. */
'use strict';
const $ = selector => document.querySelector(selector);
const pad = id => String(id).padStart(2,'0');
const escapeHtml = value => String(value).replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const byId = id => screens.find(screen=>screen.id===Number(id));
let selectedId = 1;
let view = 'atlas';
let chapterFilter = -1;
let previewState = 'content';
let width = 'mobile';
let toastTimer;
const badge = screen => `<span class="badge ${screen.status==='Planejada'?'planned':'existing'}">${screen.status}</span>`;
function showToast(message){const toast=$('#toast');toast.textContent=message;toast.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.hidden=true,3000);}
function blockHtml(block,interactive,index,screenId){
  const t=escapeHtml(block.title), text=escapeHtml(block.text);
  switch(block.type){
    case 'field': case 'area': {
      const id=`field-${screenId}-${index}`;
      return `<div class="block"><label class="wire-label" for="${id}">${t}</label>${block.type==='area'?`<textarea id="${id}" class="wire-input wire-area" placeholder="${text}" ${interactive?'':'disabled'}></textarea>`:`<input id="${id}" class="wire-input" type="${/senha/i.test(block.title)?'password':'text'}" placeholder="${text}" ${interactive?'':'disabled'} autocomplete="off">`}</div>`;
    }
    case 'card':return `<div class="block block-card"><span class="block-title">${t}</span><p class="block-text">${text}</p>${interactive&&block.to?`<button class="tile-open" data-go="${block.to}">Ver tela ${pad(block.to)} →</button>`:''}</div>`;
    case 'hero':return `<div class="block block-hero"><span class="block-title">${t}</span><p class="block-text">${text}</p></div>`;
    case 'note':return `<p class="block block-note">${text}</p>`;
    case 'pick':return `<div class="block"><span class="wire-label">${t}</span><div class="wire-picks" role="group" aria-label="${t}">${block.text.split('|').map(option=>interactive?`<button class="wire-chip" data-pick aria-pressed="false">${escapeHtml(option)}</button>`:`<span class="wire-chip">${escapeHtml(option)}</span>`).join('')}</div></div>`;
    case 'tabs':return `<div class="block wire-tabs">${block.text.split('|').map(option=>`<span>${escapeHtml(option)}</span>`).join('')}</div>`;
    case 'media':return `<div class="block media-slot"><div><span class="block-title">${t}</span><p class="block-text">${text}</p></div></div>`;
    case 'avatar':return `<div class="block avatar-block"><div class="wire-avatar" aria-hidden="true">${t[0]}</div><span class="block-title">${t}</span><p class="block-text">${text}</p></div>`;
    case 'tree':return `<div class="block tree-slot"><img src="assets/tree.png" alt="Árvore simbólica do Nós, sem indicadores de crescimento"><span class="block-title">${t}</span><p class="block-text">${text}</p></div>`;
    case 'calendar':return `<div class="block block-card"><span class="block-title">${t}</span><div class="wire-calendar" aria-label="Calendário ilustrativo de outubro de 2026">${['D','S','T','Q','Q','S','S'].map(day=>`<span class="calendar-day">${day}</span>`).join('')}${'<span></span>'.repeat(4)}${Array.from({length:31},(_,i)=>`<span class="${i===2?'selected':''}">${i+1}</span>`).join('')}</div></div>`;
    case 'connections':return `<div class="block"><div class="connections" aria-label="Mapa ilustrativo de quatro laços, sem métricas de força">${['Eu','A','B','C','D'].map(name=>`<span class="connection-node">${name}</span>`).join('')}</div><p class="block-text">${text}</p></div>`;
    default:return '';
  }
}
function stateHtml(screen){
  const isAuth=screen.chapter===0;
  const states={
    empty: [isAuth?'Vamos começar pelo primeiro campo':'Este espaço ainda não tem registros',isAuth?'Informe os dados solicitados para seguir. Campos obrigatórios precisam de indicação clara.':'Quando houver dados autorizados, eles aparecerão aqui. Não preenchemos ausência com números ou histórias fictícias.'],
    error: ['Não foi possível concluir agora','Preserve o que foi preenchido e ofereça uma tentativa explícita. Erro de rede não significa sessão encerrada nem acesso negado.'],
    blocked: [isAuth?'Este link não permite continuar':'Este conteúdo não está disponível para você',isAuth?'Confirme a validade do link ou volte para Conta. A interface deve evitar revelar dados de terceiros.':'Revalidar sessão e associação. Sem permissão, não mostrar conteúdo afetivo ou detalhes que revelem a existência de dados privados.'],
    success: ['Ação concluída · exemplo visual','No aplicativo, mostrar sucesso somente após resposta confirmada do servidor. Neste atlas, nenhum dado foi salvo ou enviado.']
  };
  if(previewState==='loading')return '<div class="state-message" role="status"><h4>Carregando este espaço</h4><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div><p>Estrutura sem conteúdo íntimo. Evitar mudança brusca de layout.</p></div>';
  const [title,text]=states[previewState];
  return `<div class="state-message"><h4>${title}</h4><p>${text}</p>${previewState==='error'?'<button class="quiet" data-retry>Voltar ao conteúdo de exemplo</button>':''}</div><p class="state-warning">Padrão de estado para revisão. A mensagem final deve respeitar a operação e o contrato da tela.</p>`;
}
function phoneHtml(screen,interactive=false){
  // Barra principal apenas nos hubs: fluxos focados preservam saídas contextuais.
  const nav=[13,18,40,44,49,50].includes(screen.id);
  const hasNucleus=screen.chapter>=2||[9,11,12,58,59].includes(screen.id);
  const actions=interactive&&previewState!=='content'?[]:screen.actions;
  return `<div class="phone" ${interactive?'':`data-open="${screen.id}" role="button" tabindex="0" aria-label="Inspecionar tela ${pad(screen.id)} ${escapeHtml(screen.title)}"`}>
    <div class="phone-status"><span>9:41</span><span aria-hidden="true">••• ▰</span></div><div class="phone-top"><span>${nav?'Núcleo de exemplo':'Espaço privado'}</span><strong>nós</strong><span>Prévia</span></div>
    ${hasNucleus?'<div class="phone-context">NOSSO JARDIM · CONTEÚDO ILUSTRATIVO</div>':''}
    <div class="phone-scroll"><h3>${escapeHtml(screen.title)}</h3><p class="phone-subtitle">${escapeHtml(screen.subtitle)}</p>${interactive&&previewState!=='content'?stateHtml(screen):screen.blocks.map((block,index)=>blockHtml(block,interactive,index,screen.id)).join('')}</div>
    ${actions.length?`<div class="phone-actions">${actions.map(action=>interactive?`<button class="wire-action" data-go="${action.to}">${escapeHtml(action.label)}</button>`:`<span class="wire-action">${escapeHtml(action.label)}</span>`).join('')}</div>`:''}
    ${nav?`<nav class="phone-nav" aria-label="Navegação principal ${interactive?'da prévia':'ilustrativa'}">${[['Início',13],['Acordos',18],['Memórias',40],['Conexões',44],['Perfil',49]].map(([label,id])=>interactive?`<button data-go="${id}" class="${screen.id===id?'active':''}">${label}</button>`:`<span class="${screen.id===id?'active':''}">${label}</span>`).join('')}</nav>`:''}
  </div>`;
}
function filteredScreens(){const query=$('#search').value.trim().toLocaleLowerCase('pt-BR');const status=$('#status-filter').value;return screens.filter(screen=>(chapterFilter<0||screen.chapter===chapterFilter)&&(status==='all'||screen.status===status)&&(!query||`${pad(screen.id)} ${screen.title} ${screen.route} ${screen.source} ${screen.rule} ${screen.dependency}`.toLocaleLowerCase('pt-BR').includes(query)));}
function renderAtlas(){
  const filtered=filteredScreens();$('#result-count').textContent=`${filtered.length} de ${screens.length} telas · selecione uma para inspecionar`;
  $('#atlas-view').innerHTML=chapters.map((chapter,index)=>{
    const list=filtered.filter(screen=>screen.chapter===index);if(!list.length)return '';
    return `<section class="chapter" id="chapter-${index}"><div class="chapter-header"><h2><span>${pad(index+1)}</span>${escapeHtml(chapter)}</h2><p>${list.length} telas · ordem por percurso</p></div><div class="screen-grid">${list.map(screen=>`<article class="tile" id="tile-${pad(screen.id)}"><div class="tile-header"><span class="screen-number">${pad(screen.id)}</span>${badge(screen)}</div>${phoneHtml(screen)}<div class="tile-caption"><h3>${escapeHtml(screen.title)}</h3><p>${screen.status==='Planejada'?'Pendente:':'Limites:'} ${escapeHtml(screen.dependency)}</p><button class="tile-open" data-open="${screen.id}">Inspecionar tela e contrato →</button></div></article>`).join('')}</div></section>`;
  }).join('')||'<p class="no-results">Nenhuma tela corresponde aos filtros. Ajuste a busca ou selecione Todas as áreas.</p>';
}
function renderPrototype(){
  const screen=byId(selectedId);
  $('#screen-preview').innerHTML=`<div class="preview-wrap ${width}">${phoneHtml(screen,true)}</div>`;
  $('#screen-spec').innerHTML=`<span class="screen-number">TELA ${pad(screen.id)}</span> ${badge(screen)}<h2>${escapeHtml(screen.title)}</h2><p>${escapeHtml(chapters[screen.chapter])}</p><h3>Rota e localização</h3><code class="route">${escapeHtml(screen.route)}</code><h3>Origem no catálogo v2.1</h3><p>${escapeHtml(screen.source)}. Nova numeração independente.</p><h3>Contrato e comportamento</h3><p>${escapeHtml(screen.rule)}</p><h3>Quem pode agir</h3><p>${escapeHtml(screen.permission)}</p><h3>${screen.status==='Planejada'?'Pendente antes de implementar':'Limites do recorte existente'}</h3><div class="pending-box"><p>${escapeHtml(screen.dependency)}</p></div><h3>Saídas deste desenho</h3><div class="spec-actions">${screen.actions.map(action=>`<button class="quiet" data-go="${action.to}">${pad(action.to)} · ${escapeHtml(byId(action.to).title)}</button>`).join('')}</div><p>Ações desta prévia não persistem dados. Seleções e campos são descartados ao trocar de tela.</p><button class="quiet screen-back" data-view="atlas">← Voltar ao atlas</button>`;
  $('#previous').disabled=selectedId===1;$('#next').disabled=selectedId===screens.length;
}
function renderFlows(){
  $('#flows-view').innerHTML=journeys.map((journey,index)=>`<article class="flow-card"><p class="eyebrow">PERCURSO ${pad(index+1)}</p><h2>${escapeHtml(journey.name)}</h2><div class="flow-path">${journey.ids.map((id,i)=>`${i?'<span class="flow-arrow" aria-hidden="true">→</span>':''}<button class="flow-node" data-go="${id}"><strong>${pad(id)}</strong>${escapeHtml(byId(id).title)}</button>`).join('')}</div><p>${escapeHtml(journey.rule)}</p></article>`).join('');
}
function setView(nextView){
  view=nextView;
  for(const mode of ['atlas','prototype','flows'])$(`#${mode}-view`).hidden=mode!==view;
  document.querySelectorAll('.view-tabs [data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===view)));
  // Os filtros só se aplicam ao atlas. A prévia sempre permite percorrer todas as telas.
  $('#search').disabled=view!=='atlas';$('#status-filter').disabled=view!=='atlas';
  if(view==='prototype')renderPrototype();
  $('#result-count').textContent=view==='atlas'?`${filteredScreens().length} de ${screens.length} telas · selecione uma para inspecionar`:view==='prototype'?`Tela ${pad(selectedId)} · ${byId(selectedId).title}`:`${journeys.length} percursos · selecione uma etapa para abrir sua tela`;
}
function openScreen(id,updateHash=true){
  if(!byId(id))return;selectedId=Number(id);previewState='content';document.querySelectorAll('[data-state]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.state===previewState)));setView('prototype');
  if(updateHash)history.replaceState(null,'',`#tela-${pad(selectedId)}`);
  $('#prototype-view').scrollIntoView({block:'start'});
  $('#screen-spec').setAttribute('tabindex','-1');$('#screen-spec').focus({preventScroll:true});
}
$('#chapter-nav').innerHTML=`<button class="chapter-button" data-chapter="-1" aria-pressed="true"><span>✳</span>Todas as áreas</button>${chapters.map((chapter,index)=>`<button class="chapter-button" data-chapter="${index}" aria-pressed="false"><span>${pad(index+1)}</span>${escapeHtml(chapter)}</button>`).join('')}`;
$('#total-count').textContent=screens.length;$('#planned-count').textContent=screens.filter(screen=>screen.status==='Planejada').length;$('#existing-count').textContent=screens.filter(screen=>screen.status==='Recorte existente').length;
renderAtlas();renderFlows();
document.addEventListener('click',event=>{
  const target=event.target.closest('button,[data-open]');if(!target)return;
  if(target.dataset.open){openScreen(target.dataset.open);return;}
  if(target.dataset.go){openScreen(target.dataset.go);showToast('Navegação de exemplo. Nenhuma ação foi enviada.');return;}
  if(target.dataset.view){setView(target.dataset.view);return;}
  if(target.dataset.chapter!==undefined){chapterFilter=Number(target.dataset.chapter);document.querySelectorAll('[data-chapter]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.chapter)===chapterFilter)));renderAtlas();setView('atlas');$('#atlas-view').scrollIntoView({block:'start'});return;}
  if(target.dataset.state){previewState=target.dataset.state;document.querySelectorAll('[data-state]').forEach(button=>button.setAttribute('aria-pressed',String(button===target)));renderPrototype();return;}
  if(target.dataset.width){width=target.dataset.width;document.querySelectorAll('[data-width]').forEach(button=>button.setAttribute('aria-pressed',String(button===target)));renderPrototype();return;}
  if(target.hasAttribute('data-pick')){const group=target.closest('.wire-picks');group.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button===target)));return;}
  if(target.hasAttribute('data-retry')){previewState='content';document.querySelectorAll('[data-state]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.state==='content')));renderPrototype();}
});
document.addEventListener('keydown',event=>{const target=event.target.closest('[data-open]');if(target&&(event.key==='Enter'||event.key===' ')){event.preventDefault();openScreen(target.dataset.open);}});
$('#search').addEventListener('input',renderAtlas);$('#status-filter').addEventListener('change',renderAtlas);
$('#previous').addEventListener('click',()=>openScreen(selectedId-1));$('#next').addEventListener('click',()=>openScreen(selectedId+1));
$('#print').addEventListener('click',()=>{chapterFilter=-1;$('#search').value='';$('#status-filter').value='all';document.querySelectorAll('[data-chapter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.chapter==='-1')));renderAtlas();setView('atlas');window.print();});
function readHash(){const match=location.hash.match(/^#tela-(\d+)$/);if(match&&byId(match[1]))openScreen(match[1],false);}
window.addEventListener('hashchange',readHash);readHash();
