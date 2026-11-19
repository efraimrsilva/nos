// Execute nesta pasta: node serve.cjs. A porta pode ser definida pela variável PORT.
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
http.createServer((req,res)=>{
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);}catch{res.writeHead(400).end();return;}
 const file=path.resolve(__dirname,'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(__dirname+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(error,content)=>{if(error){res.writeHead(404).end('Arquivo não encontrado');return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(content);});
}).listen(Number(process.env.PORT)||4177,'127.0.0.1',()=>process.stdout.write('Combinado aprovado 2: http://127.0.0.1:'+ (Number(process.env.PORT)||4177)+'\n'));
