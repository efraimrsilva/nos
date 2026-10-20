import { randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { test, expect, localSql } from "./fixtures";

test("reconstrução integral visita rotas e abre os diálogos sem herdar a composição antiga", async ({page,account},info)=>{
  test.setTimeout(240_000);
  const desktop=info.project.name==='desktop';
  await page.setViewportSize(desktop?{width:1440,height:1000}:{width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  const nucleus=randomUUID(),habit=randomUUID(),proposal=randomUUID(),event=randomUUID();
  localSql(`update auth.users set raw_user_meta_data=jsonb_build_object('name','Ana') where id='${account.id}'; insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','familia','Núcleo Casa','Cultivar uma casa onde cada pessoa possa ser quem é.','${account.id}');insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${account.id}','admin');insert into public.nucleus_agreements(id,nucleus_id,created_by,category,title,description,timing,frequency,status,trial_days) values('${habit}','${nucleus}','${account.id}','habit','Uma refeição com presença','Um tempo tranquilo, sem distrações.','No jantar','Três vezes por semana','testing',7),('${proposal}','${nucleus}','${account.id}','habit','Uma caminhada para conversar','Estar juntos ao ar livre.','Domingo','Semanal','pending',7);insert into public.nucleus_agreement_participants(agreement_id,user_id,response,accepted_version,responded_at) values('${habit}','${account.id}','accepted',1,now());insert into public.nucleus_events(id,nucleus_id,created_by,title,intention,starts_at,ends_at,time_zone) values('${event}','${nucleus}','${account.id}','Café e conversa','Uma pausa para estar perto.',now()+interval '1 day',now()+interval '1 day 1 hour','America/Sao_Paulo');insert into public.nucleus_event_participants(event_id,user_id,response) values('${event}','${account.id}','pending');`);
  const base='/nucleos/'+nucleus;
  const routes:[string,string][]=[['nucleos','/nucleos'],['inicio',base],['agenda',base+'/agenda'],['pessoas',base+'/pessoas'],['convites',base+'/convites'],['acordos',base+'/acordos'],['habito',base+'/acordos/'+habit],['registrar',base+'/acordos/'+habit+'/registrar'],['revisar',base+'/acordos/'+habit+'/revisar'],['confirmar',base+'/acordos/'+habit+'/confirmar'],...['arvore','memorias','conexoes','perfis','manifesto','cuidado'].map(s=>[s,base+'/'+s] as [string,string]),['comecar','/comecar'],['tipo','/comecar/tipo'],['proposito','/comecar/proposito?tipo=familia'],['convite','/comecar/convite'],['convite-inicial','/comecar/convite-inicial/'+nucleus],['conta','/conta'],['configuracoes','/configuracoes'],['privacidade','/configuracoes/privacidade'],['seguranca','/configuracoes/conta'],['ajuda','/ajuda'],['sair',base+'/sair']];
  const titles:Record<string,string>={nucleos:'Seus Núcleos',inicio:'Núcleo Casa',agenda:'Tempo para o que importa.',pessoas:'Cada pessoa tem seu lugar.',convites:'Um convite para estar perto.',acordos:'Cada combinado no seu tempo.',habito:'Uma refeição com presença',registrar:'Registrar momento',revisar:'Termos e histórico do acordo',confirmar:'Período e administração do hábito',arvore:'Raízes no que vivemos.',memorias:'Há instantes que ficam.',conexoes:'Conhecer para cuidar.',perfis:'Um jeito único de estar no Nós.',manifesto:'O que escolhemos cultivar.',cuidado:'Conversar também é um cuidado.',comecar:'Como você quer começar?',tipo:'Que relação vocês têm?',proposito:'Qual o propósito de vocês?',convite:'Você recebeu um convite?','convite-inicial':'Convide quem faz parte',conta:'Seu espaço também merece cuidado.',configuracoes:'Privacidade com clareza.',privacidade:'Privacidade e visibilidade',seguranca:'Conta e segurança',ajuda:'Ajuda e suporte',sair:'Sair de um Núcleo'};
  const gallery=process.env.NOS_LAYOUT_GALLERY;
  if(gallery)mkdirSync(gallery,{recursive:true});
  const captures: {name:string;kind:string;route:string;title:string;trigger?:string}[]=[];
  async function capture(name:string,title:string,trigger?:string){
    captures.push({name:name+"-"+info.project.name+".png",kind:name.includes("-modal-")?"Modal":"Tela",route:page.url().replace(nucleus,"[id]"),title,trigger});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name+' sem overflow').toBe(true);
    if(gallery){
      const target=path.join(gallery,name+'-'+info.project.name+'.png');
      // O recorte do diálogo mantém o foco visual; origem e gatilho ficam no manifesto.
      if(name.includes('-modal-'))await page.getByRole('dialog').last().screenshot({path:target});
      else await page.screenshot({path:target,fullPage:true});
    }
  }
  for(const [label,url]of routes){
    await page.goto(url);
    await expect(page.locator('[data-layout-revision="3"]:visible')).toHaveCount(1);
    await expect(page.getByRole('main').getByRole('heading',{level:1})).toHaveText(titles[label]);
    await expect(page.getByRole('main')).not.toContainText('Este espaço não está disponível.');
    await expect(page.getByRole('main').locator('.path-card,.garden-art,.surface-panel,.continue-button')).toHaveCount(0);
    await expect(page.getByRole('main')).not.toContainText('Conferindo as informações…');
    await capture(label,titles[label]);
    const triggers=page.locator('main button[aria-haspopup="dialog"]:visible');
    const count=await triggers.count();
    for(let i=0;i<count;i++){
      const trigger=triggers.nth(i);
      await trigger.click();
      const dialog=page.getByRole('dialog').last();
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('heading').first()).toBeVisible();
      expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth+1),label+' diálogo sem overflow').toBe(true);
      await capture(label+'-modal-'+(i+1),await dialog.getByRole('heading').first().innerText(),(await trigger.innerText()).trim());
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
    }
    if(label==='inicio')for(const [name,slug]of [['Buscar uma área','busca'],['Notificações — esboço','notificacoes'],['Mais áreas e preferências','menu']]){
      const trigger=page.getByRole('button',{name,exact:true});
      if(!await trigger.isVisible())continue;
      await trigger.click();
      const dialog=page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await capture('global-modal-'+slug,await dialog.getByRole('heading').first().innerText(),name);
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
    }
  }
  if(desktop)for(const width of [768,1024]){
    await page.setViewportSize({width,height:1000});
    for(const [label,url]of routes.filter(([name])=>['agenda','pessoas','acordos','configuracoes','inicio'].includes(name))){await page.goto(url);await expect(page.getByRole('main').getByRole('heading',{level:1})).toHaveText(titles[label]);await capture(label+'-'+width,titles[label]);}
  }
  if(gallery)writeFileSync(path.join(gallery,'manifest-'+info.project.name+'.json'),JSON.stringify(captures,null,2));
});
