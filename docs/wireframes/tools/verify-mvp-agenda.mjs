import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Inspeciona o modo vivo atual; os dados são ilustrativos e nenhuma ação usa o banco.
const browser = await chromium.launch();
try {
  for (const [mode,width] of [['desktop',1440],['mobile',390]]) {
    const page = await browser.newPage({viewport:{width,height:960},reducedMotion:'reduce'});
    const errors=[], external=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('request',request=>{if(/^https?:/.test(request.url())) external.push(request.url());});
    await page.goto(pathToFileURL(path.resolve('docs/wireframes/atlas/index.html')).href);
    assert.deepEqual(await page.evaluate(()=>mvpPhases.find(p=>p.key==='agenda').ids),[14,16,15,17]);
    assert.deepEqual(await page.evaluate(()=>journeys.find(j=>j.name==='Combinar um encontro na agenda interna').ids),[13,14,16,15,17,14]);
    const preview=page.locator('#screen-preview .phone');
    for (const id of [14,16,15,17]) {
      await page.evaluate(id=>openScreen(id),id);
      await page.locator('[data-width="'+mode+'"]').click();
      assert.equal(await preview.count(),1);
      assert.equal(await page.evaluate(id=>byId(id).status,id),'Recorte existente');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    }
    await page.evaluate(()=>openScreen(14));
    await page.locator('[data-width="'+mode+'"]').click();
    assert.equal(await preview.locator('.live-month-picker').count(),1);
    assert.equal(await preview.locator('.live-week').isVisible(),mode==='desktop');
    assert.equal(await preview.locator('.live-agenda-list').isVisible(),mode==='mobile');
    await preview.locator('[data-live-year]').selectOption('2031');
    const date=preview.locator('[data-live-day="10"]');
    await date.click();
    assert.equal(await date.getAttribute('aria-pressed'),'true');
    assert.match(await preview.locator('.live-calendar-toolbar strong').innerText(),/2031/);
    const dialog=page.locator('#atlas-live-dialog');
    await preview.getByRole('button',{name:/^Novo momento/}).click();
    assert.equal(await dialog.isVisible(),true);
    assert.match(await dialog.innerText(),/Sua presença é confirmada ao criar/);
    assert.equal(await dialog.getByRole('group',{name:'Horários do encontro'}).count(),1);
    await page.keyboard.press('Escape');
    assert.equal(await dialog.isVisible(),false);
    await preview.getByRole('button',{name:/^Editar evento/}).click();
    assert.match(await dialog.innerText(),/Mudar o horário pede nova resposta/);
    assert.equal(await dialog.getByLabel('Título',{exact:true}).inputValue(),'Café e conversa');
    await dialog.getByRole('button',{name:'Cancelar',exact:true}).click();
    assert.equal(await dialog.isVisible(),false);
    await preview.getByRole('button',{name:/^Remover evento/}).click();
    assert.equal(await dialog.getByRole('checkbox').count(),1);
    const confirm=dialog.getByRole('button',{name:'Confirmar remoção · exemplo'});
    assert.equal(await confirm.isEnabled(),false);
    await dialog.getByRole('checkbox').check();
    assert.equal(await confirm.isEnabled(),true);
    await dialog.getByRole('button',{name:'Manter evento'}).click();
    assert.equal(await dialog.isVisible(),false);
    const responder=preview.getByRole('button',{name:/^Responder convite/});
    await responder.click();
    assert.equal(await dialog.isVisible(),true);
    await page.keyboard.press('Escape');
    assert.equal(await dialog.isVisible(),false);
    await responder.click();
    await dialog.getByRole('button',{name:'Não posso participar · exemplo',exact:true}).click();
    assert.equal(await dialog.isVisible(),false);
    assert.match(await preview.locator('.live-own-attendance').innerText(),/não posso participar/);
    await responder.click();
    assert.equal(await dialog.getByRole('button',{name:'Não posso participar · exemplo',exact:true}).getAttribute('aria-pressed'),'true');
    await dialog.getByRole('button',{name:'Posso participar · exemplo',exact:true}).click();
    assert.match(await preview.locator('.live-own-attendance').innerText(),/vou participar/);
    assert.deepEqual(errors,[]);
    assert.deepEqual(external,[]);
    await page.close();
  }
  console.log('Atlas Agenda: quatro telas, mês/ano, grade/lista, presença e quatro diálogos em desktop e celular.');
} finally { await browser.close(); }
