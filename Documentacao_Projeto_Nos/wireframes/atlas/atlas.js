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
let inspectionOrigin = 'atlas';
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
    case 'tabs':return `<div class="block wire-tabs" role="group" aria-label="Opções da tela">${block.text.split('|').map((option,i)=>`<button data-local-tab aria-pressed="${i===0}">${escapeHtml(option)}</button>`).join('')}</div>`;
    case 'media':return `<div class="block media-slot"><div><span class="block-title">${t}</span><p class="block-text">${text}</p></div></div>`;
    case 'avatar':return `<div class="block avatar-block"><div class="wire-avatar" aria-hidden="true">${t[0]}</div><span class="block-title">${t}</span><p class="block-text">${text}</p></div>`;
    case 'tree':return `<div class="block tree-slot"><img src="assets/tree.png" alt="Árvore simbólica do Nós, sem indicadores de crescimento"><span class="block-title">${t}</span><p class="block-text">${text}</p></div>`;
    case 'calendar':return `<div class="block block-card"><span class="block-title">${t}</span><div class="wire-calendar" aria-label="Calendário ilustrativo de outubro de 2026">${['D','S','T','Q','Q','S','S'].map(day=>`<span class="calendar-day">${day}</span>`).join('')}${'<span></span>'.repeat(4)}${Array.from({length:31},(_,i)=>`<span class="${i===2?'selected':''}">${i+1}</span>`).join('')}</div></div>`;
    case 'connections':return `<div class="block"><div class="connections" aria-label="Mapa ilustrativo de quatro laços, sem métricas de força">${['Eu','A','B','C','D'].map(name=>`<span class="connection-node">${name}</span>`).join('')}</div><p class="block-text">${text}</p></div>`;
    default:return '';
  }
}
function stateHtml(screen){
  if(screen.id===12&&previewState==='empty')return '<div class="state-message product-panel product-help" role="status"><h4>Seus Núcleos</h4><p>Você ainda não participa de um Núcleo. Crie um espaço ou entre com um convite quando fizer sentido.</p><button class="product-primary forest" data-go="7">Criar um núcleo</button><button class="product-text-link access-link" data-go="10">Entrar com um convite</button></div>';
  if(screen.id<=5)return accountStateHtml(screen);
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
function accountStateHtml(screen){
  const content=screen.id<=2?onboardingContent(screen):accountAccessContent(screen);
  const blocked='Abra um link de recuperação válido. O link pode ter expirado, já ter sido usado ou precisar ser aberto no navegador em que você o solicitou.';
  if(previewState==='blocked'&&screen.id===5){return content.replace(/<form[\s\S]*?<\/form>/,'<p class="state-message access-error" role="alert">'+blocked+'</p>');}
  if(previewState==='loading')return content.replace(/(<button[^>]*type="submit"[^>]*>)[^<]+/,'$1'+(screen.id===5?'Salvando…':screen.id<=2?'Aguarde…':'Solicitando…'))+'<p class="state-message" role="status">Aguardando resposta do servidor.</p>';
  const messages={
    empty:screen.id<=2?'Informe seu nome, e-mail e uma senha.':screen.id===5?'Pelo menos 8 caracteres, com letra, número e símbolo. Use até 128 caracteres.':'Informe um e-mail válido.',
    error:screen.id===5?'Não foi possível salvar a senha. Use uma senha diferente da anterior ou solicite outro link.':'A autenticação ainda não está configurada neste ambiente.',
    blocked:screen.id<=2?'Não foi possível entrar. Confira o e-mail e a senha.':'Aguarde o intervalo de 60 segundos antes de solicitar outro link.',
    success:screen.id===4?'Se houver uma conta para este e-mail, enviaremos as instruções de recuperação. Confira também o spam.':screen.id===3?'Se este e-mail precisar de confirmação, enviaremos um novo link. Confira também o spam.':'Senha atualizada. Entre com sua nova senha.'
  };
  const success=previewState==='success';
  return content+'<p class="state-message '+(success?'access-note':'access-error')+'" role="'+(success?'status':'alert')+'">'+messages[previewState]+'</p>';
}
function phoneHtml(screen,interactive=false){
  return productPhoneHtml(screen,interactive);
}
function filteredScreens(){const query=$('#search').value.trim().toLocaleLowerCase('pt-BR');const status=$('#status-filter').value;return screens.filter(screen=>(chapterFilter<0||screen.chapter===chapterFilter)&&(status==='all'||screen.status===status)&&(!query||`${pad(screen.id)} ${screen.title} ${screen.route} ${screen.source} ${screen.rule} ${screen.dependency}`.toLocaleLowerCase('pt-BR').includes(query)));}
// A visão por áreas e o mapa global usam a mesma composição, ficha e estado de implementação.
function tileHtml(screen, global=false){
  const prefix=global?'global-tile':'tile';
  return `<article class="tile" id="${prefix}-${pad(screen.id)}" data-screen-id="${screen.id}"><div class="tile-header"><span class="screen-number">${pad(screen.id)}</span>${badge(screen)}</div>${phoneHtml(screen)}<div class="tile-caption"><h3>${escapeHtml(screen.title)}</h3><p>${screen.status==='Planejada'?'Pendente:':'Limites:'} ${escapeHtml(screen.dependency)}</p><button class="tile-open" data-open="${screen.id}">Inspecionar tela e contrato →</button>${global?`<details class="global-destinations"><summary>${screen.actions.length} saídas desta tela</summary><ul>${screen.actions.map(action=>`<li><button data-go="${action.to}" ${action.login?'data-entry-login':''} data-destination="${action.to}">${escapeHtml(action.label)} <span>→ ${pad(action.to)} · ${escapeHtml(byId(action.to).title)}</span></button></li>`).join('')}</ul></details>`:''}</div></article>`;
}
function renderAtlas(){
  const savedReference=referenceMode,savedLayout=documentLayoutKey;referenceMode=false;documentLayoutKey='';
  const filtered=filteredScreens();$('#result-count').textContent=`${filtered.length} de ${screens.length} telas · selecione uma para inspecionar`;
  $('#atlas-view').innerHTML=chapters.map((chapter,index)=>{
    const list=filtered.filter(screen=>screen.chapter===index);if(!list.length)return '';
    return `<section class="chapter" id="chapter-${index}"><div class="chapter-header"><h2><span>${pad(index+1)}</span>${escapeHtml(chapter)}</h2><p>${list.length} telas · ordem por percurso</p></div><div class="screen-grid">${list.map(screen=>tileHtml(screen)).join('')}</div></section>`;
  }).join('')||'<p class="no-results">Nenhuma tela corresponde aos filtros. Ajuste a busca ou selecione Todas as áreas.</p>';
  referenceMode=savedReference;documentLayoutKey=savedLayout;
  // Miniaturas são uma única parada de teclado; controles internos só funcionam na inspeção.
  document.querySelectorAll('.tile .phone').forEach(phone=>{for(const child of phone.children)child.inert=true;});
  scaleThumbnails();
}
function scaleThumbnails(){
  document.querySelectorAll('.tile .phone').forEach(phone=>{
    if(!phone.clientWidth)return;
    const scale=phone.clientWidth/384;let body=phone.querySelector(':scope>[data-thumbnail]');
    if(!body){body=document.createElement('div');body.dataset.thumbnail='';while(phone.firstChild)body.append(phone.firstChild);phone.append(body);body.inert=true;}
    phone.style.height=`${858*scale}px`;
    body.style.cssText=`width:384px;height:858px;position:absolute;display:flex;flex-direction:column;overflow:hidden;transform:scale(${scale});transform-origin:top left`;
  });
}
window.addEventListener('resize',scaleThumbnails);
window.addEventListener('beforeprint',scaleThumbnails);window.addEventListener('afterprint',scaleThumbnails);
function renderPrototype(){
  const screen=byId(selectedId);
  const source=approvedKey(screen.id);
  const origin=referenceMode?'Documento aprovado · composição original': [1,2,6,7,8,9,10,11].includes(screen.id)?'Aplicativo implementado · estrutura atual':approvedLayouts[documentLayoutKey||screen.id]?'Documento aprovado · estrutura preservada, regras atuais sinalizadas':'Extensão do atlas · identidade aprovada, contrato a conferir';
  $('#screen-preview').innerHTML=`<div class="preview-origin"><strong>${origin}</strong><br>${referenceMode?'Dados, níveis e textos históricos são exemplos do documento; consulte a ficha para o contrato vigente.': 'Prévia local. Conteúdo afetivo de exemplo; nenhuma informação é enviada ou salva.'}${source?`<div class="reference-controls"><button data-reference="current" aria-pressed="${!referenceMode}">Atlas vivo</button><button data-reference="approved" aria-pressed="${referenceMode}">Ver desenho aprovado do documento</button></div>`:''}${width==='desktop'&&approvedLayouts[documentLayoutKey||screen.id]?'O documento aprova composição móvel; sua adaptação web ainda precisa ser definida.':''}</div><div class="preview-wrap ${width}">${phoneHtml(screen,true)}</div>${previewState==='content'?`<div class="contract-outlets"><p>Destinos do contrato atual · navegação de planejamento</p>${screen.actions.map(action=>`<button data-go="${action.to}" ${action.login?'data-entry-login':''}>${escapeHtml(action.label)}</button>`).join('')}</div>`:''}`;
  $('#screen-spec').innerHTML=`<span class="screen-number">TELA ${pad(screen.id)}</span> ${badge(screen)}<h2>${escapeHtml(screen.title)}</h2><p>${escapeHtml(chapters[screen.chapter])}</p><h3>Rota e localização</h3><code class="route">${escapeHtml(screen.route)}</code><h3>Origem no catálogo v2.1</h3><p>${escapeHtml(screen.source)}. Nova numeração independente.</p><h3>Contrato e comportamento</h3><p>${escapeHtml(screen.rule)}</p><h3>Quem pode agir</h3><p>${escapeHtml(screen.permission)}</p><h3>${screen.status==='Planejada'?'Pendente antes de implementar':'Limites do recorte existente'}</h3><div class="pending-box"><p>${escapeHtml(screen.dependency)}</p></div><h3>Saídas deste desenho</h3><div class="spec-actions">${screen.actions.map(action=>`<button class="quiet" data-go="${action.to}" ${action.login?'data-entry-login':''}>${pad(action.to)} · ${escapeHtml(byId(action.to).title)}</button>`).join('')}</div><p>Ações desta prévia não persistem dados. Seleções e campos são descartados ao trocar de tela.</p><button class="quiet screen-back" data-view="atlas">← Voltar ao atlas</button>`;
  if(inspectionOrigin==='global'){
    const back=$('#screen-spec .screen-back');back.dataset.view='global';back.textContent='← Voltar à Visão global';
  }
  $('#previous').disabled=selectedId===1;$('#next').disabled=selectedId===screens.length;
  requestAnimationFrame(alignAccountPreview);
}
function renderFlows(){
  $('#flows-view').innerHTML=journeys.map((journey,index)=>`<article class="flow-card"><p class="eyebrow">PERCURSO ${pad(index+1)}</p><h2>${escapeHtml(journey.name)}</h2><div class="flow-path">${journey.ids.map((id,i)=>`${i?'<span class="flow-arrow" aria-hidden="true">→</span>':''}<button class="flow-node" data-go="${id}" ${journey.steps&&id===1?'data-entry-login':''}><strong>${pad(id)}</strong>${escapeHtml(byId(id).title)}${journey.steps?.[i]?`<small>${escapeHtml(journey.steps[i])}</small>`:''}</button>`).join('')}</div><p>${escapeHtml(journey.rule)}</p></article>`).join('');
}
function setView(nextView){
  view=nextView;
  for(const mode of ['atlas','prototype','flows','global'])$(`#${mode}-view`).hidden=mode!==view;
  document.body.dataset.view=view;
  document.querySelectorAll('#chapter-nav button').forEach(button=>button.setAttribute('aria-pressed',String(view==='global'?button.dataset.view==='global':view==='atlas'&&Number(button.dataset.chapter)===chapterFilter)));
  document.querySelectorAll('.view-tabs [data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===view)));
  // Ambas as visões do inventário filtram a mesma fonte; a inspeção percorre todas as telas.
  $('#search').disabled=!['atlas','global'].includes(view);$('#status-filter').disabled=!['atlas','global'].includes(view);
  if(view==='global')renderGlobal();
  if(view==='atlas')renderAtlas();
  if(!['global','prototype'].includes(view)&&location.hash==='#visao-global')history.replaceState(null,'',location.pathname+location.search);
  if(view==='prototype')renderPrototype();
  $('#result-count').textContent=view==='global'?`${filteredScreens().length} de ${screens.length} telas · sequência e ramificações do projeto`:view==='atlas'?`${filteredScreens().length} de ${screens.length} telas · selecione uma para inspecionar`:view==='prototype'?`Tela ${pad(selectedId)} · ${byId(selectedId).title}`:`${journeys.length} percursos · selecione uma etapa para abrir sua tela`;
}
function openScreen(id,updateHash=true){
  if(view!=='prototype')inspectionOrigin=view==='global'?'global':'atlas';
  if(!byId(id))return;selectedId=Number(id);previewState='content';referenceMode=false;documentLayoutKey='';document.querySelectorAll('[data-state]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.state===previewState)));setView('prototype');
  if(updateHash)history.replaceState(null,'',`#tela-${pad(selectedId)}`);
  $('#prototype-view').scrollIntoView({block:'start'});
  $('#screen-spec').setAttribute('tabindex','-1');$('#screen-spec').focus({preventScroll:true});
}
$('#chapter-nav').innerHTML=`<button class="chapter-button global-button" data-view="global" aria-pressed="false"><span>✳</span>Visão global</button><button class="chapter-button" data-chapter="-1" aria-pressed="true"><span>✳</span>Todas as áreas</button>${chapters.map((chapter,index)=>`<button class="chapter-button" data-chapter="${index}" aria-pressed="false"><span>${pad(index+1)}</span>${escapeHtml(chapter)}</button>`).join('')}`;
$('#total-count').textContent=screens.length;$('#planned-count').textContent=screens.filter(screen=>screen.status==='Planejada').length;$('#existing-count').textContent=screens.filter(screen=>screen.status==='Recorte existente').length;
renderAtlas();renderFlows();
document.addEventListener('click',event=>{
  const target=event.target.closest('button,[data-open]');if(!target)return;
  if(target.dataset.open){openScreen(target.dataset.open);return;}
  if(target.dataset.go){const login=target.hasAttribute('data-entry-login');openScreen(target.dataset.go);if(login)$('#screen-preview [data-auth="login"]').click();showToast('Navegação de exemplo. Nenhuma ação foi enviada.');return;}
  if(target.dataset.reference){referenceMode=target.dataset.reference==='approved';documentLayoutKey='';previewState='content';renderPrototype();return;}
  if(target.dataset.layout){documentLayoutKey=target.dataset.layout;renderPrototype();return;}
  if(target.dataset.auth){const section=target.closest('.product-panel');const signup=target.dataset.auth==='signup';section.querySelectorAll('[data-auth]').forEach(button=>button.setAttribute('aria-pressed',String(button===target)));section.querySelectorAll('[data-signup-field]').forEach(el=>el.hidden=!signup);section.querySelector('form').reset();section.querySelector('[data-auth-submit]').textContent=signup?'Criar conta':'Entrar';alignAccountPreview();return;}
  if(target.hasAttribute('data-suggestion')){const content=target.closest('.product-content');content.querySelector('[name="purpose"]').value=(nucleusOptions.find(option=>option[0]===onboardingType)||nucleusOptions[0])[2];return;}
  if(target.hasAttribute('data-edit-draft')){const content=target.closest('.product-content');content.querySelector('form').hidden=false;content.querySelector('.purpose-draft').hidden=true;return;}
  if(target.hasAttribute('data-local-tab')||target.dataset.localChoice){const group=target.parentElement;group.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button===target)));showToast('Seleção local para revisão do desenho. Sem persistência.');return;}
  if(target.dataset.demo){showToast('Ação ilustrativa do documento. O contrato e a implementação estão descritos na ficha.');return;}
  if(target.dataset.globalArea){const heading=$(`#global-area-${target.dataset.globalArea} h2`);heading.scrollIntoView({block:'start'});heading.focus({preventScroll:true});return;}
  if(target.dataset.view){if(target.dataset.view==='global'){chapterFilter=-1;setView('global');history.replaceState(null,'','#visao-global');$('#global-view').scrollIntoView({block:'start'});}else setView(target.dataset.view);return;}
  if(target.dataset.chapter!==undefined){chapterFilter=Number(target.dataset.chapter);document.querySelectorAll('[data-chapter]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.chapter)===chapterFilter)));renderAtlas();setView('atlas');$('#atlas-view').scrollIntoView({block:'start'});return;}
  if(target.dataset.state){previewState=target.dataset.state;document.querySelectorAll('[data-state]').forEach(button=>button.setAttribute('aria-pressed',String(button===target)));renderPrototype();return;}
  if(target.dataset.width){width=target.dataset.width;document.querySelectorAll('[data-width]').forEach(button=>button.setAttribute('aria-pressed',String(button===target)));renderPrototype();return;}
  if(target.hasAttribute('data-pick')){const group=target.closest('.wire-picks');group.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button===target)));return;}
  if(target.hasAttribute('data-retry')){previewState='content';document.querySelectorAll('[data-state]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.state==='content')));renderPrototype();}
});
document.addEventListener('change',event=>{if(event.target.name==='nucleus-type')onboardingType=event.target.value;});
document.addEventListener('input',event=>{if(event.target.name==='invitation-code'){const panel=event.target.closest('.product-content');panel.querySelector('.invitation-preview').hidden=true;}});
document.addEventListener('submit',event=>{
  const form=event.target.closest('[data-local-form]');if(!form)return;event.preventDefault();
  if(form.dataset.localForm==='type'){onboardingType=form.elements['nucleus-type'].value;if(onboardingType)openScreen(8);}
  if(form.dataset.localForm==='purpose'){const name=form.elements['nucleus-name'].value.trim(),purpose=form.elements.purpose.value.trim();if(!name||!purpose){showToast('Preencha o nome e o propósito para conferir o rascunho.');return;}const content=form.closest('.product-content');content.querySelector('[data-draft-name]').textContent=name;content.querySelector('[data-draft-purpose]').textContent=purpose;form.hidden=true;content.querySelector('.purpose-draft').hidden=false;}
  if(form.dataset.localForm==='invitation'){if(!form.elements['invitation-code'].value.trim()){showToast('Cole um código para conferir a composição da prévia.');return;}form.closest('.product-content').querySelector('.invitation-preview').hidden=false;showToast('Convite de exemplo. Nenhum código foi consultado.');}
  if(form.dataset.localForm==='account')showToast('Demonstração de formulário. Nenhuma conta foi criada e nenhum dado foi enviado.');
  if(form.dataset.localForm==='access'){
    const feedback=form.querySelector('.local-feedback');
    const kind=form.dataset.kind;
    if(kind==='password'){
      const password=form.elements['new-password'].value,confirmation=form.elements.confirmation.value;
      if(password.length<8||password.length>128||!/[A-Za-z]/.test(password)||!/[0-9]/.test(password)||!(/[^A-Za-z0-9]/.test(password))){feedback.textContent='Pelo menos 8 caracteres, com letra, número e símbolo. Use até 128 caracteres.';feedback.setAttribute('role','alert');return;}
      if(password!==confirmation){feedback.textContent='As senhas precisam ser iguais.';feedback.setAttribute('role','alert');return;}
      feedback.textContent='Senha atualizada. Entre com sua nova senha. · exemplo';
    }else{
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.elements['access-email'].value.trim())){feedback.textContent='Informe um e-mail válido.';feedback.setAttribute('role','alert');return;}
      feedback.textContent=kind==='recovery'?'Se houver uma conta para este e-mail, enviaremos as instruções de recuperação. Confira também o spam.':'Se este e-mail precisar de confirmação, enviaremos um novo link. Confira também o spam.';
    }
    feedback.setAttribute('role','status');showToast('Prévia local. Nenhum e-mail foi enviado, nenhuma senha ou sessão foi alterada.');
  }
});
document.addEventListener('keydown',event=>{const target=event.target.closest('[data-open]');if(target&&(event.key==='Enter'||event.key===' ')){event.preventDefault();openScreen(target.dataset.open);}});
function renderFilteredView(){if(view==='global')renderGlobal();else renderAtlas();$('#result-count').textContent=`${filteredScreens().length} de ${screens.length} telas · ${view==='global'?'sequência e ramificações do projeto':'selecione uma para inspecionar'}`;}
$('#search').addEventListener('input',renderFilteredView);$('#status-filter').addEventListener('change',renderFilteredView);
$('#previous').addEventListener('click',()=>openScreen(selectedId-1));$('#next').addEventListener('click',()=>openScreen(selectedId+1));
$('#print').addEventListener('click',()=>{const printingGlobal=view==='global';chapterFilter=-1;$('#search').value='';$('#status-filter').value='all';renderAtlas();setView(printingGlobal?'global':'atlas');window.print();});
function readHash(){if(location.hash==='#visao-global'){chapterFilter=-1;setView('global');return;}const match=location.hash.match(/^#tela-(\d+)$/);if(match&&byId(match[1]))openScreen(match[1],false);}
window.addEventListener('hashchange',readHash);readHash();
