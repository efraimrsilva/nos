import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { test, expect, localSql } from './fixtures';
import { withPeer } from './peer';

const gallery=path.resolve(process.env.NOS_MEMBER_LIST_GALLERY || 'artifacts/regression-captures/member-list');
test('integrantes em lista compacta, detalhes pelo nome e seta próxima do texto', async ({ page, account }, info) => {
  const id=randomUUID();
  mkdirSync(gallery,{recursive:true});
  await withPeer(page,async peer=>{
    localSql(`update auth.users set raw_user_meta_data=jsonb_build_object('name','Ana') where id='${account.id}'; update auth.users set raw_user_meta_data=jsonb_build_object('name','Bruno') where id='${peer.id}'; insert into public.nuclei(id,type,name,purpose,created_by) values('${id}','amigos','Jardim da lista','Cultivar respeito','${account.id}'); insert into public.nucleus_members(nucleus_id,user_id,role) values('${id}','${account.id}','admin'),('${id}','${peer.id}','member');`);
    await page.goto(`/nucleos/${id}`);
    await page.getByRole('button',{name:'Ver integrantes',exact:true}).click();
    const dialog=page.getByRole('dialog',{name:'Integrantes do Núcleo',exact:true});
    await expect(dialog.getByRole('button',{name:'Fechar Integrantes do Núcleo',exact:true})).toBeInViewport();
    if(info.project.name==='desktop') expect((await dialog.boundingBox())!.width).toBeLessThanOrEqual(580);
    await page.screenshot({path:path.join(gallery,`${process.env.NOS_MEMBER_STAGE||'depois'}-app-modal-${info.project.name}.png`),animations:'disabled'});
    const table=dialog.getByRole('table',{name:'Integrantes do Núcleo'});
    await expect(table.getByRole('columnheader',{name:'Nome',exact:true})).toBeVisible();
    await expect(table.getByRole('columnheader',{name:'Papel',exact:true})).toBeVisible();
    await expect(table.getByRole('columnheader')).toHaveCount(2);
    await expect(table.getByRole('columnheader',{name:'Nomeação',exact:true})).toHaveCount(0);
    await expect(table.locator('tbody tr')).toHaveCount(2);
    await expect(dialog.getByRole('button',{name:/Ver participação/})).toHaveCount(0);
    const name=table.getByRole('button',{name:'Abrir detalhes de Bruno',exact:true});
    await name.click();
    await expect(page.getByRole('dialog',{name:'Participação de Bruno',exact:true}).getByRole('button',{name:'Convidar para administrar',exact:true})).toBeVisible();
    await page.keyboard.press('Escape');await expect(name).toBeFocused();
    for(const width of [320,390,768,1280]){
      await page.setViewportSize({width,height:844});
      expect(await dialog.evaluate(node=>node.scrollWidth<=node.clientWidth+1),`modal sem overflow em ${width}px`).toBe(true);
      const row=await table.locator('tbody tr').first().boundingBox();
      expect(row!.height).toBeLessThan(120);
    }
    await page.keyboard.press('Escape');
    const trigger=page.getByRole('button',{name:'Ver integrantes',exact:true});
    const gap=await trigger.evaluate(node=>{const text=[...node.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent?.trim())!;const range=document.createRange();range.selectNodeContents(text);return node.querySelector('svg')!.getBoundingClientRect().left-range.getBoundingClientRect().right;});
    expect(gap).toBeGreaterThanOrEqual(5);expect(gap).toBeLessThanOrEqual(16);
  });
});
