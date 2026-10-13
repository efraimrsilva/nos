/* Identidade do produto: a aplicação é a referência das rotas existentes de entrada. */
'use strict';
const icon = (name, size = 24) => (atlasIcons[name] || atlasIcons.Sprout).replace(/width="24" height="24"/, `width="${size}" height="${size}"`);
const nucleusOptions = [
  ['casal','Casal','Construir um relacionamento presente e carinhoso.','Heart'],
  ['familia','Família','União, respeito e apoio mútuo no dia a dia.','House'],
  ['irmaos','Irmãos','Fortalecer os laços ao longo da vida.','UsersRound'],
  ['pais','Pais e Filhos','Convivência saudável e diálogo aberto.','HandHeart'],
  ['amigos','Amigos','Manter a amizade sempre viva e presente.','Smile'],
  ['equipes','Equipes','Cultivar cooperação e cuidado no trabalho.','BriefcaseBusiness'],
  ['comunidades','Comunidades','Construir pertencimento e apoio coletivo.','Network'],
  ['mentorias','Mentorias','Aprender e crescer com escuta e orientação.','Sprout'],
  ['grupos-religiosos','Grupos Religiosos','Fortalecer a convivência e o cuidado na comunidade.','Church'],
];
let onboardingType = '';
let documentLayoutKey = '';
let referenceMode = false;
const documentKeys = {1:'document-conta',2:'document-conta',6:'document-caminho',7:'document-tipo',8:'document-proposito',9:'document-convite-inicial',10:'document-convite-entrada'};
const approvedKey = id => documentKeys[id] || (approvedLayouts[id] ? String(id) : '');
function productField(label, name, options = {}) {
  const id = `product-${name}`;
  return `<div class="product-field"><label for="${id}">${label}</label>${options.area ? `<textarea id="${id}" name="${name}" rows="4" maxlength="500" placeholder="${options.placeholder || ''}"></textarea>` : `<input id="${id}" name="${name}" type="${options.type || 'text'}" ${options.max ? `maxlength="${options.max}"` : ''} placeholder="${options.placeholder || ''}" autocomplete="off">`}</div>`;
}
const productBack = id => `<button class="product-back" data-go="${id}">${icon('ArrowLeft',17)}Voltar</button>`;
const productHeading = (step, title, subtitle) => `<p class="product-step">${step}</p><h3>${title}</h3><p class="product-intro">${subtitle}</p>`;
const primary = (label, attributes = '') => `<button class="product-primary forest" ${attributes}>${label}${icon('ArrowRight',18)}</button>`;
function onboardingContent(screen) {
  const selected = nucleusOptions.find(option => option[0] === onboardingType);
  // Telas 09/58 são dois contextos da mesma rota real; códigos do Atlas nunca são válidos.
  if([9,58].includes(screen.id))return `${productHeading('Núcleo criado','Convide quem faz parte','Nosso jardim já é seu espaço privado. Convidar alguém agora é opcional.')}<section class="product-panel"><p>Quem tiver o código poderá conferir o Núcleo e entrar após aceitar o convite. O convite expira em sete dias e o aceite é sempre explícito.</p><p class="product-help">Código de convite · exemplo</p><p class="block-note">EXEMPLO · SEM VALIDADE</p><p class="product-help">Expiração em UTC · data real no aplicativo</p><button class="quiet" data-demo>Compartilhar código</button><button class="quiet" data-demo>Copiar código</button><button class="product-text-link access-link" data-go="59">Gerenciar convites</button><p class="block-note">QR e convites por link · planejados. Por enquanto, compartilhe o código para a outra pessoa conferir e aceitar na própria conta.</p></section><button class="product-text-link access-link" data-go="13">Concluir por enquanto</button>`;
  if(screen.id===59)return `${productBack(13)}${productHeading('A porta do Núcleo merece cuidado','Gerenciar convites','Só o criador gerencia os códigos. Revogar um convite não remove participantes.')}<nav class="auth-tabs" aria-label="Status dos convites">${['Ativos','Expirados','Revogados'].map((label,index)=>`<button data-local-tab aria-pressed="${index===0}">${label}</button>`).join('')}</nav><section class="product-panel"><h4>Convite ativo · exemplo</h4><p class="product-help">Criado em / Expira em · datas reais em UTC no aplicativo</p><p class="product-help">Lista privada sem códigos; até 20 itens por página.</p><button class="quiet" data-demo>Revogar convite · demonstração</button><p class="product-help">No aplicativo: confirmar ou cancelar antes de gravar.</p></section><button class="product-primary forest" data-go="58">Gerar ou compartilhar convite</button><aside class="block-note"><h4>Próximas possibilidades · planejadas</h4><p>QR/câmera/link, destinatários individuais, administradores e histórico de quem aceitou cada convite. Código atual pode ser usado por mais de uma pessoa; não registra esse histórico.</p></aside>`;
  if(screen.id===13)return `<button class="product-text-link access-link" data-go="12">Voltar a Seus Núcleos</button>${productHeading('Início do Núcleo','Nosso jardim','Um lugar para cultivar os vínculos no tempo de vocês.')}<section class="product-panel"><h4>Nosso propósito</h4><p>Cultivar respeito e presença. · exemplo</p></section><section class="product-panel"><h4>Seu lugar aqui</h4><p>Você criou este Núcleo · exemplo. Apenas participantes podem abrir esta página.</p><button class="product-primary forest" data-go="58">Convidar alguém</button><button class="product-text-link access-link" data-go="59">Gerenciar convites</button><p class="product-help">Estas duas ações aparecem somente para o criador.</p></section><section class="product-panel"><h4>Agenda do Núcleo</h4><p>Planejem momentos juntos e respondam no tempo de cada pessoa.</p><button class="product-text-link access-link" data-go="14">Abrir agenda</button></section><section class="product-panel"><h4>Acordos do Núcleo</h4><p>Construam propostas juntos. Cada pessoa decide se aceita participar.</p><button class="product-text-link access-link" data-go="18">Abrir acordos</button></section><button class="product-text-link access-link" data-go="1">Minha conta e sair</button>`;
  if ([1,2].includes(screen.id)) return `<button class="product-back" data-go="72">${icon('ArrowLeft',17)}Voltar às boas-vindas</button>${productHeading('Um lugar seguro para seus vínculos','Sua conta no Nós','Crie uma conta ou entre para cuidar dos seus Núcleos com privacidade.')}<section class="product-panel"><div class="auth-tabs" aria-label="Modo de acesso"><button data-auth="signup" aria-pressed="true">Criar conta</button><button data-auth="login" aria-pressed="false">Já tenho conta</button></div><form data-local-form="account"><div data-signup-field>${productField('Nome','name',{max:80})}</div>${productField('E-mail','email',{type:'email'})}${productField('Senha','password',{type:'password'})}<p class="product-help" data-signup-field>Pelo menos 8 caracteres, com letra, número e símbolo.</p><button class="product-primary forest" type="submit" data-auth-submit>Criar conta</button></form><button class="product-text-link access-link" data-go="4">Esqueci minha senha</button><button class="product-text-link access-link small" data-go="3">Preciso confirmar meu e-mail</button></section><p class="local-feedback" role="status"></p>`;
  if(screen.id===12) return `${productHeading('Seus vínculos','Seus Núcleos','Cada jardim tem sua própria história. Escolha o espaço que quer cuidar agora.')}<p class="product-help">${icon('LockKeyhole',15)} Apenas os Núcleos dos quais você participa aparecem aqui.</p><button class="product-panel nucleus-list-card" data-go="13"><span>Família · exemplo</span><h4>Nosso jardim · exemplo</h4><p>Cultivar presença, respeito e apoio mútuo. · exemplo</p><b>Abrir Núcleo ${icon('ArrowRight',17)}</b></button><div class="path-list"><button class="path-card" data-go="7"><span class="path-icon">${icon('Plus',25)}</span><span><strong>Criar um núcleo</strong><small>Comece um novo jardim com quem você ama.</small></span>${icon('ChevronRight',18)}</button><button class="path-card" data-go="10"><span class="path-icon invite">${icon('UsersRound',25)}</span><span><strong>Entrar com um convite</strong><small>Recebeu um código de alguém? Junte-se a eles.</small></span>${icon('ChevronRight',18)}</button></div><button class="product-text-link access-link" data-go="1">Minha conta e sair</button>`;
  if ([3,4,5].includes(screen.id)) return accountAccessContent(screen);
  if (screen.id === 6) return `<button class="product-back" data-go="12">Voltar a Seus Núcleos</button>${productHeading('Seu primeiro passo','Como você quer começar?','Crie um espaço novo ou junte-se a quem te convidou.')}<div class="path-list"><button class="path-card" data-go="7"><span class="path-icon">${icon('Plus',25)}</span><span><strong>Criar um núcleo</strong><small>Comece um novo jardim com quem você ama.</small></span>${icon('ChevronRight',18)}</button><button class="path-card" data-go="10"><span class="path-icon invite">${icon('UsersRound',25)}</span><span><strong>Entrar com um convite</strong><small>Recebeu um código de alguém? Junte-se a eles.</small></span>${icon('ChevronRight',18)}</button></div><p class="product-care">${icon('Leaf',16)}<span>Um Núcleo é um espaço de cuidado para as relações da sua vida. Cada vínculo tem seu jeito de florescer.</span></p>`;
  if (screen.id === 7) return `${productBack(6)}${productHeading('Um espaço com o jeito de vocês','Que relação vocês têm?','Cada tipo de Núcleo cresce com objetivos diferentes.')}<form data-local-form="type"><fieldset class="type-grid"><legend class="sr-only">Escolha o tipo de Núcleo</legend>${nucleusOptions.map(([value,label,description,ico])=>`<label class="type-option" data-type="${value}"><span class="type-icon ${value}">${icon(ico,23)}</span><span><strong>${label}</strong><small>${description}</small></span><input type="radio" name="nucleus-type" value="${value}" ${onboardingType===value?'checked':''} required aria-label="${label}"></label>`).join('')}</fieldset><p class="product-help">Escolha o tipo que melhor representa este vínculo para continuar.</p>${primary('Continuar','type="submit"')}</form>`;
  if (screen.id === 8) return `${productBack(7)}${productHeading('Um espaço com o jeito de vocês','Qual o propósito de vocês?','A bússola que guia as escolhas do Núcleo.')}<p class="product-selected">Tipo escolhido: ${selected?.[1] || 'Casal · exemplo'}</p><form data-local-form="purpose">${productField('Nome do Núcleo','nucleus-name',{max:80,placeholder:'Ex.: Nós dois'})}${productField('Nosso propósito','purpose',{area:true,placeholder:'O que vocês querem cultivar juntos?'})}<div class="purpose-suggestion">${icon('Lightbulb',16)}<div><p>${selected?.[2] || nucleusOptions[0][2]}</p><button type="button" data-suggestion>Usar sugestão</button></div></div><p class="product-help">Esta etapa é uma prévia. Seus textos ainda não serão salvos.</p>${primary('Continuar','type="submit"')}</form><section class="product-panel purpose-draft" hidden><p class="product-step">Confira seu rascunho</p><h4 data-draft-name></h4><p data-draft-purpose></p><p class="product-help">Nenhum Núcleo foi criado. Este rascunho é local, sem persistência.</p><button class="product-primary" data-go="9">Criar Núcleo · exemplo</button><button class="product-back" data-edit-draft>Editar</button></section>`;
  if (screen.id===9) return `${productHeading('Núcleo criado','Convide quem faz parte','Nosso jardim já é seu espaço privado. Convidar alguém agora é opcional.')}<section class="product-panel"><p class="product-intro">Quem tiver o código poderá conferir o Núcleo e entrar após aceitar o convite. O convite expira em sete dias e o aceite é sempre explícito.</p><p class="product-help">CÓDIGO DE CONVITE · EXEMPLO</p><p class="block-note" style="font-family:monospace;letter-spacing:.08em">EXEMPLO · SEM VALIDADE</p><button class="quiet" data-demo>Compartilhar código</button></section><button class="product-text-link" data-go="13" style="margin-top:20px">Concluir por enquanto</button>`;
  if ([10,11].includes(screen.id)) return `${productBack(6)}${productHeading('Um convite para cultivar juntos','Você recebeu um convite?','Digite o código que te enviaram. Você poderá conhecer o Núcleo antes de decidir.')}<form class="product-panel" data-local-form="invitation">${productField('Código de convite','invitation-code',{max:32,placeholder:'Cole o código recebido'})}<button type="submit" class="product-primary forest">Conferir convite</button></form><button class="product-text-link access-link" data-go="12">Voltar a Seus Núcleos</button><section class="product-panel invitation-preview" ${screen.id===11?'':'hidden'} aria-label="Prévia do convite"><p class="product-step">Confira antes de aceitar · exemplo</p><h4>Nosso jardim</h4><p class="product-help">Família</p><p>Propósito: Cultivar presença, respeito e apoio mútuo.</p><p class="product-help">Ao aceitar, você fará parte deste Núcleo e poderá ver as informações compartilhadas nele. A decisão é sua.</p><button class="product-primary forest" data-go="13">Aceitar convite · exemplo</button><button class="product-text-link access-link" data-go="12">Agora não</button></section>`;
  return '';
}
// A prévia usa o login como referência da marca, como a rota real de Conta.
function alignAccountPreview() {
  const shell = document.querySelector('#screen-preview .account-layout');
  if (!shell) return;
  const content = shell.querySelector('.product-content');
  const brand = shell.querySelector('.product-garden');
  // Mede o login sem pintar a alteração temporária; isso inclui margens colapsadas.
  const fields = [...content.querySelectorAll('[data-signup-field]')];
  const previous = fields.map(el => el.hidden);
  fields.forEach(el => el.hidden = true);
  const referenceHeight = content.getBoundingClientRect().height;
  fields.forEach((el, index) => el.hidden = previous[index]);
  shell.style.setProperty('--account-brand-offset', `${Math.max(0, (referenceHeight - brand.getBoundingClientRect().height) / 2)}px`);
}
window.addEventListener('resize', alignAccountPreview);

function onboardingLayout(screen, interactive) {
  return `<div class="product-onboarding ${[1,2].includes(screen.id)?'account-layout':''}"><header class="product-brand"><span>${icon('Sprout',30)}<b>nós<i>.</i></b></span><small>UM COMEÇO, MUITAS POSSIBILIDADES</small></header><div class="product-welcome"><aside class="product-garden"><div><img src="assets/tree.png" alt="Árvore com troncos entrelaçados, símbolo dos vínculos que cultivamos"></div><h4>Toda relação é uma semente.</h4><p>Com presença e pequenos gestos,<br>a gente cresce junto.</p><span class="garden-dashes" aria-hidden="true">━ · ·</span></aside><section class="product-content">${interactive&&previewState!=='content'?stateHtml(screen):onboardingContent(screen)}</section></div><footer class="product-footer">${icon('Heart',13)}<p>Vínculos reais. Pequenos cuidados. No tempo de vocês.</p></footer></div>`;
}
const sourceDestinations = {goSplash:72,goHome:13,goAcordos:18,goHabitos:18,goArvore:38,goHabit:24,goNovo:19,goMemorias:40,goPerfil:49,goOnboarding:1,goNucleos:12,goConvite:58,goNotificacoes:60,goRegistrar:27,goGratidao:43,goAceitar:11,goMembro:45,goExperiencia:34,goRevisao:30,goPromocao:37,goDesencontro:61,goManifesto:55,goConfig:66,goSobreMim:51,goVinculos:47,goJornada:48,goConexoes:44,goAprovacoes:23,goDialogo:62,goHabitBack:18,goNovoNucleo:7,obChooseCreate:7,obChooseJoin:10,setHDet:24,setHHist:25,setHRef:26,setMFotos:42,setMMarcos:39,setMTudo:40};
const sourceTabKeys = {setHabitos:'18',setExper:'acordos-experiencias',setEssencia:'acordos-essencia',setMAgrad:'memorias-agradecimentos'};
function adaptCurrentContract(fragment, screen, key){
  const leafElements=[...fragment.querySelectorAll('div,span,p,b,text,tspan')].filter(el=>!el.children.length);
  for(const el of leafElements){
    const text=el.textContent.trim();
    if(/^Nível \d/.test(text))el.textContent='Nossa árvore';
    if(/^\d+(?:\.\d+)? \/ \d+(?:\.\d+)? exp$/.test(text))el.textContent='Crescimento a definir';
    if(/^\d+%$/.test(text))el.textContent='—';
    if(/^(Forte|Médio|Frágil|Transformador)$/.test(text))el.textContent='A definir';
    if(/assinado por todos/i.test(text))el.textContent='Assinaturas · dependem de aceite explícito';
    if(/Só quem tem o código entra/i.test(text))el.textContent='O código permite conferir o convite. Entrar exige conta e aceite explícito.';
    if(/Depois de 5 meses|já faz parte da essência|Será adicionado à Nossa Essência/i.test(text))el.textContent='Uma proposta de Essência, sujeita a critérios e consentimento próprios.';
    if(/Um hábito virou quem vocês são/.test(text))el.textContent='Um hábito pode virar parte da Essência ✨';
    if(/^Força do laço$/.test(text))el.textContent='Percepção do vínculo · contrato pendente';
    if(/Laço florescendo|Vai bem|Faz um tempo/.test(text))el.textContent='Cuidar do vínculo respeita o tempo de cada pessoa, sem classificação automática.';
  }
  // Conservar a composição da árvore sem inventar contadores, níveis ou recompensa.
  if(screen.id===38){
    const groups=fragment.querySelector('.nos-scroll>div').children;
    const stage=groups[1],stats=groups[2],next=groups[3];
    const caption=stage.lastElementChild;
    caption.innerHTML='<div style="font-family:Fredoka;font-size:15px;color:#2e4a20">Nossa história floresce com cuidado</div><div style="font-size:11px;color:#69725e;margin-top:5px">Crescimento · contrato pendente</div>';
    for(const stat of stats.children)stat.children[1].textContent='—';
    next.children[0].textContent='Evolução do jardim';
    next.children[1].textContent='Fontes, critérios e regras de crescimento ainda precisam ser definidos.';
  }
  if(key==='acordos-essencia'){
    const body=fragment.querySelector('.nos-scroll>div');
    body.lastElementChild.innerHTML='<div class="product-panel"><h4>Ainda estamos cultivando</h4><p class="product-help">Nenhuma Essência está registrada neste recorte. Promoção exige contrato e consentimento próprios.</p><button class="product-text-link" data-go="37">Conhecer o desenho de promoção</button></div>';
  }
  if(screen.id===24){
    // O desenho histórico contém indicadores/evento sem contrato. No modo vivo, reservar sem simular integração.
    for(const el of leafElements){
      const text=el.textContent.trim();
      if(text==='IMPACTO ESPERADO')el.textContent='IMPACTO · PLANEJADO';
      if(text==='Alto')el.textContent='A definir';
      if(text==='LINGUAGEM')el.textContent='LINGUAGEM · PLANEJADA';
      if(text==='Tempo de qualidade')el.textContent='Declaração futura';
      if(text==='Progresso')el.textContent='Progresso · planejado';
      if(text==='Próxima conversa marcada')el.textContent='Evento associado · planejado';
      if(text==='Amanhã às 20:00')el.textContent='Sem integração com a agenda';
      if(text==='Reflexões')el.textContent='Reflexões · planejadas';
    }
    const panel=document.createElement('section');panel.className='product-panel';
    panel.innerHTML='<h4>Próximas possibilidades · planejadas</h4><p class="product-help">Reflexões, Impacto e Linguagens de cuidado dependem de autoria, visibilidade e consentimento. Fotos exigem mídia protegida e retenção. Essência e Nossa Árvore dependem de fontes reais e regras próprias; confirmar não gera promoção ou pontuação.</p><p class="product-help">O período real e a confirmação ficam na rota /confirmar. Legado sem prazo usa a alternativa da Tela 29.</p><button class="product-primary" data-go="28">Ver período e confirmação</button>';
    const reflections=fragment.querySelector('[data-source-action="setHRef"]');
    if(reflections)reflections.textContent='Reflexões · planejadas';
    const progress=leafElements.find(el=>el.textContent==='Progresso · planejado');
    if(progress){
      const progressPanel=progress.parentElement.parentElement;
      progressPanel.innerHTML='<h4>Progresso · planejado</h4><p class="product-help">Fontes e regras ainda precisam ser definidas. Momentos registrados não comprovam frequência praticada; nenhum dia é marcado automaticamente.</p>';
    }
    fragment.querySelector('.nos-scroll')?.append(panel);
  }
  if(screen.id===30){
    fragment.querySelector('.nos-scroll').innerHTML=`<div class="extension-scroll"><header class="extension-header">${productBack(24)}${icon('Handshake')}</header><h3>Revisar Hábito</h3><p class="product-intro">Combinados podem amadurecer.</p><div class="block block-hero"><span class="block-title">Nosso combinado atual</span><p class="block-text">Conversar sem distrações · exemplo de termos a consultar antes da mudança.</p></div><p class="block-note">Solicitar uma revisão preserva o combinado atual. Ajuste e encerramento exigem unanimidade, sete dias de reflexão e aplicação explícita.</p><div class="extension-actions"><button class="product-primary" data-go="31">${icon('NotebookPen')}Propor ajuste</button><button class="product-primary" data-go="32">${icon('Leaf')}Propor encerramento</button><button class="product-primary" data-go="33">${icon('CircleCheck')}Acompanhar revisão</button><button class="product-primary" data-go="61">${icon('Heart')}Preparar conversa</button></div></div>`;
  }
  if(screen.id===62){
    fragment.querySelector('.nos-scroll').innerHTML=`<div class="extension-scroll"><header class="extension-header">${productBack(61)}${icon('Heart')}</header><p class="product-step">Ponte de compreensão</p><h3>Um tempo para se entender</h3><p class="product-intro">Comece por você, sem pressa de responder.</p><div class="block block-hero"><span class="block-title">Preparação privada</span><p class="block-text">Este rascunho é seu. Nenhuma mensagem é enviada e nenhuma conversa entre membros é aberta.</p></div>${productField('O que quero compreender melhor?','bridge-intention',{area:true,placeholder:'Uma percepção em primeira pessoa, sem cobrança.'})}<p class="block-note">A próxima etapa confere um único Cartão de Intenção. Destinatários e compartilhamento exigem escolha explícita.</p><div class="extension-actions"><button class="product-primary" data-go="63">Conferir Cartão de Intenção${icon('ArrowRight',18)}</button><button class="product-primary" data-go="64">Marcar conversa ao vivo${icon('CalendarDays',18)}</button></div></div>`;
  }
  if(screen.id===27){
    const example=leafElements.find(el=>/^Ex: Conversamos/.test(el.textContent.trim()));
    if(example){const input=document.createElement('textarea');input.className='wire-input wire-area';input.placeholder='O que gostaria de guardar?';input.maxLength=500;input.rows=4;input.setAttribute('aria-label','Nota opcional, visível para integrantes do Núcleo');example.replaceWith(input);}
    const photoHeading=leafElements.find(el=>el.textContent.trim()==='Adicionar foto');
    if(photoHeading){photoHeading.nextElementSibling?.remove();photoHeading.textContent='Foto · evolução planejada';}
    const note=document.createElement('p');note.className='block-note';note.textContent='Humor obrigatório. A nota é opcional e será visível para integrantes do Núcleo. Fotografia exige contrato e armazenamento próprios.';
    fragment.querySelector('.nos-scroll>div')?.append(note);
  }
  if(screen.id===44){
    for(const [action,text] of [['setFilterForte','Pessoas'],['setFilterMedio','Núcleos'],['setFilterFraco','Recentes']]){
      const button=fragment.querySelector(`[data-source-action="${action}"]`);if(button)button.textContent=text;
    }
    for(const el of [...fragment.querySelectorAll('span,div,text,tspan')].filter(el=>!el.children.length))if(/^(Forte|Médio|Frágil)$/.test(el.textContent.trim()))el.textContent='Vínculo';
    const tree=fragment.querySelector('svg[viewBox="0 0 360 392"]');
    tree?.querySelectorAll('path').forEach(path=>{path.setAttribute('stroke-width','3');path.setAttribute('stroke','#9dbe79');path.removeAttribute('stroke-dasharray');});
    const legend=tree?.parentElement.nextElementSibling;
    if(legend)legend.textContent='Mapa ilustrativo de vínculos · sem classificação de força';
  }
  // Termos históricos de promoção não se tornam critérios atuais por aparecerem no desenho.
  for(const el of [...fragment.querySelectorAll('div,p')].reverse()){
    if(/Em breve poderá ser elegível|Este hábito está ativo há|cada hábito praticado e momento registrado faz a árvore crescer/.test(el.textContent)&&el.children.length<3){el.textContent='Critérios de evolução pendentes. Tempo e registros não promovem automaticamente para Essência.';}
  }
}
// Adapta ações históricas ao inventário atual. O HTML aprovado permanece disponível integralmente.
function approvedLayout(screen, key) {
  const template = document.createElement('template');
  template.innerHTML = approvedLayouts[key];
  template.content.querySelectorAll('[data-source-action]').forEach(control => {
    let button=control;
    if(button.tagName!=='BUTTON'){const native=document.createElement('button');for(const attr of [...button.attributes])native.setAttribute(attr.name,attr.value);native.innerHTML=button.innerHTML;native.type='button';button.replaceWith(native);button=native;}
    const action=button.dataset.sourceAction;
    if(sourceDestinations[action])button.dataset.go=sourceDestinations[action];
    if(screen.id===30&&action==='goNovo')button.dataset.go=31;
    if(screen.id===30&&action==='goAcordos')button.dataset.go=32;
    if(screen.id===45&&action==='goSobreMim')button.dataset.go=46;
    if(screen.id===48&&action==='goPromocao')button.dataset.go=23;
    if(screen.id===49&&/Privacidade/.test(button.textContent))button.dataset.go=67;
    if(screen.id===62&&action==='goRegistrar')button.dataset.go=64;
    if(screen.id===27&&action==='goHabit'&&/Salvar/.test(button.textContent))button.dataset.go=25;
    if(screen.id===34&&action==='goHome')button.dataset.go=16;
    if(screen.id===37&&action==='goAcordos')button.dataset.go=23;
    if(screen.id===47&&action==='goNovoNucleo'){button.dataset.go=23;if(!referenceMode)button.textContent='Propor este vínculo';}
    if(sourceTabKeys[action])button.dataset.layout=sourceTabKeys[action];
    if(button.dataset.layout)button.setAttribute('aria-pressed',String(button.dataset.layout===key));
    if(action==='prevStep')button.dataset.go=screen.id===19?18:screen.id-1;
    if(action==='contAction'||action==='nextStep')button.dataset.go=screen.id===22?23:screen.id+1;
    if(action==='obBack')button.dataset.go=screen.id===1?72:screen.id===6?1:screen.id===10?6:screen.id-1;
    if(action==='obNext')button.dataset.go=screen.id===1?6:screen.id===9?13:screen.id===10?11:screen.id+1;
    if(!button.textContent.trim())button.setAttribute('aria-label',button.dataset.go?byId(button.dataset.go).title:'Ação de exemplo');
    if(/^set|^reg|^obPick|chip\./.test(action)&&!button.dataset.go&&!button.dataset.layout){button.dataset.localChoice=action;button.setAttribute('aria-pressed','false');}
    if(!button.dataset.go&&!button.dataset.layout&&!button.dataset.localChoice)button.dataset.demo='true';
  });
  template.content.querySelectorAll('button:not([data-source-action])').forEach(button=>{if(!button.textContent.trim())button.setAttribute('aria-label','Ação de exemplo');if(screen.id===55&&/Compartilhar manifesto/.test(button.textContent))button.dataset.go=57;});
  template.content.querySelectorAll('svg:not([aria-label])').forEach(svg=>svg.setAttribute('aria-hidden','true'));
  template.content.querySelectorAll('input,textarea,select').forEach((input,index)=>{input.setAttribute('aria-label',input.getAttribute('placeholder')||`Campo do desenho ${index+1}`);});
  // Dados e regras antigos só permanecem no modo de referência, nunca como contrato vigente.
  if(!referenceMode){
    adaptCurrentContract(template.content, screen, key);
    template.content.querySelectorAll('button').forEach(button=>{button.style.minHeight='44px';button.style.minWidth='44px';});
    const walker=document.createTreeWalker(template.content,NodeFilter.SHOW_TEXT);let node;
    while((node=walker.nextNode())){
      node.textContent=node.textContent.replace(/\b\d+%\b/g,'Indicador pendente').replace(/\b\d+%/g,'—').replace(/1\.250 \/ 1\.800 exp/g,'Crescimento · contrato pendente').replace(/Nível 7(?: •)?/g,'Nossa história').replace(/Faltam 550 exp/g,'Critério de evolução a definir').replace(/Criar acordo/g,'Enviar proposta');
      if([18,24,25,26].includes(screen.id))node.textContent=node.textContent.replace(/Em andamento/g,'Em teste').replace(/Concluídos/g,'Ativos');
      if(screen.id===24 && /^impacto esperado$/i.test(node.textContent.trim()))node.textContent='Impacto · planejado';
      if(screen.id===24 && /^linguagem$/i.test(node.textContent.trim()))node.textContent='Linguagem · planejada';
      if(/Em breve poderá ser elegível|cada hábito praticado e momento registrado faz a árvore crescer|Este hábito está ativo há/.test(node.textContent))node.textContent='Critérios ainda pendentes. Tempo e registros não promovem automaticamente para Essência.';
    }
    template.content.querySelectorAll('[style]').forEach(el=>{if(/width:\s*\d+%;/.test(el.getAttribute('style'))&&el.style.height==='100%'){el.style.width='0%';el.setAttribute('aria-label','Indicador sem contrato; sem valor simulado');}});
  }
  return template.innerHTML;
}
// Formulário/conferência/respostas são recortes do mesmo hub, sem central futura simulada.
function habitProposalLayout(screen,interactive){
 const heading=productHeading('Acordos e consentimento',screen.id===22?'Confira antes de propor':screen.id===23?'Respostas à proposta':'Acordos','Demonstração do recorte disponível · nenhum dado é salvo neste Atlas.');
 const review='<dl class="product-panel"><dt>Categoria</dt><dd>Hábito · exemplo</dd><dt>O que vamos fazer?</dt><dd>Conversar sem distrações · exemplo</dd><dt>Como será?</dt><dd>Reservar um tempo de presença.</dd><dt>Quando?</dt><dd>Depois do jantar</dd><dt>Com que frequência?</dt><dd>Diária</dd><dt>Duração do teste</dt><dd>14 dias · exemplo</dd></dl>';
 const category=documentLayoutKey==='acordos-experiencias'?'Experiências':documentLayoutKey==='acordos-essencia'?'Essência':'Hábitos';
 const categoryTabs=screen.id===18?`<nav class="auth-tabs" aria-label="Categorias dos acordos">${[['Hábitos','18'],['Experiências','acordos-experiencias'],['Essência','acordos-essencia']].map(([label,key])=>`<button data-layout="${key}" aria-pressed="${label===category}">${label}</button>`).join('')}</nav>`:'';
 const hub=category==='Essência'?'<section class="product-panel"><h4>Essência</h4><p>Nenhuma Essência. Essa etapa ainda não está disponível.</p></section>':`<div class="product-panel"><h4>${category}</h4><p>Todos · Aguardando · Em teste · Ativos · Recusados · Encerrados</p><p>${category==='Hábitos'?'Proposta aguardando aceite':'Jantar romântico'} · exemplo</p></div><section class="product-panel"><h4>Nova proposta</h4><p>Todas as pessoas atuais do Núcleo serão incluídas. Mínimo de duas pessoas.</p>`+productField('O que vamos fazer?','habit-title',{max:100,placeholder:'Conversar sem distrações · exemplo'})+productField('Como será?','habit-description',{area:true,placeholder:'Reservar um tempo de presença.'})+productField('Quando?','habit-timing',{max:120,placeholder:'Depois do jantar'})+productField('Com que frequência?','habit-frequency',{max:120,placeholder:'Diária'})+(category==='Hábitos'?productField('Duração do teste (dias)','habit-trial',{type:'number',placeholder:'7 a 30 dias'}):'')+'</section>';
 const content=screen.id===18?categoryTabs+hub:review;
 const note=screen.id===22?'Ao enviar, você registra seu aceite. Conferir e editar não gravam. Inclui os membros atuais do Núcleo; seleção individual ainda não existe. Uma recusa encerra a proposta.':screen.id===23?'Seu aceite é individual. Aceite parcial permanece aguardando; somente o último aceite inicia o teste e seu prazo. Recusa encerra a proposta. Esta prévia não revela respostas alheias.':'Conferir precede o envio. Necessidade, compreensão e seleção de participantes permanecem planejadas; a Essência tem contrato próprio.';
 return `<div class="extension-scroll">${productBack(screen.id===18?13:18)}${heading}${interactive&&previewState!=='content'?stateHtml(screen):`${content}<p class="block-note">${note}</p><p class="product-help">Hábito em teste não é ativo. Confirmação após o prazo: Percurso 06.</p><div class="extension-actions">${screen.actions.map(action=>`<button class="product-primary" data-go="${action.to}">${escapeHtml(action.label)}</button>`).join('')}</div>`}</div>`;
}
function productPhoneHtml(screen, interactive) {
  // O recorte vivo expõe as seções reais da agenda; desenho histórico continua no modo documento.
  if([14,16,15,17].includes(screen.id)&&!referenceMode)return `<div class="phone product-phone extension-phone" ${interactive?'':`data-open="${screen.id}" role="button" tabindex="0" aria-label="Inspecionar tela ${pad(screen.id)} ${escapeHtml(screen.title)}"`}>${extensionLayout(screen,interactive)}<p class="block-note">Recorte existente · seção da agenda interna. A prévia usa exemplos; nenhuma resposta ou evento é salvo no Atlas.</p></div>`;
  if([18,22,23].includes(screen.id)&&!referenceMode)return `<div class="phone product-phone extension-phone" ${interactive?'':`data-open="${screen.id}" role="button" tabindex="0" aria-label="Inspecionar tela ${pad(screen.id)} ${escapeHtml(screen.title)}"`}>${habitProposalLayout(screen,interactive)}</div>`;
  if(screen.id===72&&!referenceMode)return `<div class="phone product-phone welcome-entry-phone" ${interactive?'':`data-open="72" role="button" tabindex="0" aria-label="Inspecionar tela 72 Entrada afetiva"`}>${interactive&&previewState!=='content'?stateHtml(screen):welcomeEntryHtml()}</div>`;
  const onboarding=[1,2,3,4,5,6,7,8,9,10,11,12,13,58,59].includes(screen.id)&&!referenceMode;
  const key=documentLayoutKey||(referenceMode?approvedKey(screen.id):String(screen.id));
  const imported=!!approvedLayouts[key]&&!onboarding;
  let body=onboarding?onboardingLayout(screen,interactive):imported&&(!interactive||previewState==='content')?`<div class="approved-stage" data-approved="${key}">${approvedLayout(screen,key)}</div>`:extensionLayout(screen,interactive);
  if([19,20,21].includes(screen.id)&&!referenceMode)body='<p class="block-note" role="note">Planejada · espaço reservado para o fluxo guiado. Esta etapa e a rota /novo ainda não estão disponíveis no aplicativo.</p>'+body;
  return `<div class="phone product-phone ${onboarding?'onboarding-phone':imported?'approved-phone':'extension-phone'}" ${interactive?'':`data-open="${screen.id}" role="button" tabindex="0" aria-label="Inspecionar tela ${pad(screen.id)} ${escapeHtml(screen.title)}"`}>${body}</div>`;
}
function welcomeEntryHtml(){return `<main class="welcome-entry"><div class="welcome-entry-content"><div class="garden-art"><img src="assets/tree.png" alt="Árvore com troncos entrelaçados, símbolo dos vínculos que cultivamos"></div><h3>nós<span>.</span></h3><span class="entry-heart">${icon('Heart',17)}</span><p class="welcome-entry-intro">Fortalecendo os laços<br>que unem quem você ama.</p><div class="welcome-entry-actions"><button data-go="1">${icon('Sprout',19)}Começar agora</button><button data-go="1" data-entry-login>${icon('UserRound',19)}Entrar na minha conta</button></div><p class="welcome-entry-footer">Vínculos reais. Pequenos cuidados. No tempo de vocês.</p></div></main>`;}
function extensionLayout(screen,interactive) {
  const nav=[50].includes(screen.id);
  const symbols=['ShieldCheck','Sprout','CalendarDays','Handshake','TreeDeciduous','UsersRound','Heart','Settings'];
  return `<div class="extension-scroll"><header class="extension-header">${productBack(screen.actions.at(-1)?.to||13)}<span>${icon(symbols[screen.chapter])}</span></header><p class="product-step">${chapters[screen.chapter]}</p><h3>${escapeHtml(screen.title)}</h3><p class="product-intro">${escapeHtml(screen.subtitle)}</p>${interactive&&previewState!=='content'?stateHtml(screen):`<div class="extension-blocks">${screen.blocks.map((block,index)=>blockHtml(block,interactive,index,screen.id)).join('')}</div><div class="extension-actions">${screen.actions.map(action=>`<button class="product-primary" data-go="${action.to}">${escapeHtml(action.label)}${icon('ArrowRight',18)}</button>`).join('')}</div>`}</div>${nav?productNavigation(screen):''}`;
}
function productNavigation(screen){return `<nav class="product-nav" aria-label="Navegação principal">${[['Início',13,'House'],['Acordos',18,'Handshake'],['Memórias',40,'Images'],['Conexões',44,'UsersRound']].map(([label,id,ico])=>`<button data-go="${id}" ${screen.id===id?'aria-current="page"':''}>${icon(ico,23)}<span>${label}</span></button>`).join('')}</nav>`;}

// As telas 03–05 compartilham a mesma composição do OnboardingShell da aplicação.
function accountAccessContent(screen) {
  const back='<button class="product-back" data-go="1" data-entry-login>'+icon('ArrowLeft',17)+'Voltar para Conta</button>';
  const titles={3:['Confirmar e-mail','Um pequeno passo para proteger sua conta.'],4:['Recuperar acesso','Vamos ajudar você a voltar.'],5:['Redefinir senha','Um novo acesso, com segurança.']};
  let content=back+productHeading('Conta e entrada',...titles[screen.id]);
  if(screen.id===5) return content+'<form class="product-panel" data-local-form="access" data-kind="password">'+productField('Nova senha','new-password',{type:'password',max:128})+productField('Confirmar nova senha','confirmation',{type:'password',max:128})+'<p class="product-help">Pelo menos 8 caracteres, com letra, número e símbolo. Use até 128 caracteres.</p><p class="access-note">Ao salvar, encerraremos as sessões da sua conta. Depois, entre com a nova senha.</p><p class="local-feedback" role="status"></p><button class="product-primary forest" type="submit">Salvar senha</button></form><button class="product-text-link access-link" data-go="4">Solicitar outro link</button>';
  const recovery=screen.id===4;
  return content+'<form class="product-panel" data-local-form="access" data-kind="'+(recovery?'recovery':'confirmation')+'">'+productField('E-mail da conta','access-email',{type:'email',max:254})+'<p class="access-note">'+(recovery?'Se houver uma conta para este e-mail, enviaremos as instruções. A mensagem não revela se alguém está cadastrado.':'Abra o link enviado ao cadastrar sua conta. Confira também o spam. Nunca compartilhe o link de acesso.')+'</p><p class="local-feedback" role="status"></p><button class="product-primary forest" type="submit">'+(recovery?'Solicitar link':'Reenviar confirmação')+'</button></form>';
}
