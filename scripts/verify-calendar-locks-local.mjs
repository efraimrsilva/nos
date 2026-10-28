// Prova concorrente: gravações da agenda devem esperar o bloqueio da associação.
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { localSupabaseConfig } from "./local-supabase.mjs";

localSupabaseConfig();
const actor = randomUUID(), nucleus = randomUUID(), event = randomUUID();
const args = ["exec", "-i", "supabase_db_nos", "psql", "-U", "postgres", "-d", "postgres", "-X", "-At", "-v", "ON_ERROR_STOP=1"];
const sql = query => execFileSync("docker", args, { input: query, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"], windowsHide: true });
let holder;
try {
  sql(`begin;
    insert into auth.users(id) values('${actor}');
    insert into public.nuclei(id,type,name,purpose,created_by) values('${nucleus}','amigos','Teste concorrente local','Verificar serialização','${actor}');
    insert into public.nucleus_members(nucleus_id,user_id,role) values('${nucleus}','${actor}','admin');
    insert into public.nucleus_events(id,nucleus_id,created_by,title,starts_at,ends_at,time_zone) values('${event}','${nucleus}','${actor}','Encontro local',now()+interval '1 hour',now()+interval '2 hours','UTC');
    insert into public.nucleus_event_participants(event_id,user_id,response) values('${event}','${actor}','accepted');
    commit;`);
  holder = spawn("docker", args, { stdio: ["pipe", "pipe", "pipe"], windowsHide: true });
  const closed = new Promise(resolve => holder.once("close", resolve));
  holder.stderr.resume();
  const locked = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("A sessão local não obteve o bloqueio.")), 15_000);
    let output = "";
    holder.stdout.on("data", chunk => {
      output += chunk;
      if (output.includes("MEMBER_LOCK_HELD")) { clearTimeout(timer); resolve(); }
    });
    holder.once("error", error => { clearTimeout(timer); reject(error); });
    holder.once("close", () => { clearTimeout(timer); reject(new Error("A sessão de bloqueio encerrou antes da verificação.")); });
  });
  // NO KEY UPDATE deixa a checagem de chave estrangeira passar; só o bloqueio comum deve esperar.
  holder.stdin.write(`begin; select 1 from public.nuclei where id='${nucleus}' for no key update;\n\\echo MEMBER_LOCK_HELD\n`);
  await locked;
  const calls = {
    create_nucleus_event: `public.create_nucleus_event('${nucleus}','Outro encontro','Convivência',now()+interval '2 hours',now()+interval '3 hours','UTC')`,
    update_nucleus_event: `public.update_nucleus_event('${event}','Encontro atualizado','Convivência',now()+interval '2 hours',now()+interval '3 hours','UTC')`,
    delete_nucleus_event: `public.delete_nucleus_event('${event}')`,
    respond_nucleus_event: `public.respond_nucleus_event('${event}','accepted')`,
  };
  for (const [name, call] of Object.entries(calls)) {
    let failure;
    try {
      sql(`\\set VERBOSITY verbose
        begin; set local role authenticated;
        select set_config('request.jwt.claim.sub','${actor}',true);
        set local lock_timeout='250ms'; select ${call}; rollback;`);
    } catch (error) { failure = error; }
    assert.ok(failure && /55P03/.test(String(failure.stderr)), `${name} deve aguardar o bloqueio da associação.`);
    console.log(`${name}: bloqueio concorrente confirmado.`);
  }
  holder.stdin.end("rollback;\n");
  await closed;
  for (const call of Object.values(calls)) {
    sql(`begin; set local role authenticated; select set_config('request.jwt.claim.sub','${actor}',true);
      set local lock_timeout='250ms'; select ${call}; rollback;`);
  }
  console.log("Quatro rotinas da agenda serializam com a associação atual.");
} finally {
  if (holder && holder.exitCode === null) { holder.stdin.end("rollback;\n"); holder.kill(); }
  sql(`begin; delete from public.nuclei where id='${nucleus}'; delete from auth.users where id='${actor}'; commit;`);
}
