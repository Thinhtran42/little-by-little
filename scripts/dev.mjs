import {spawn} from 'node:child_process';
import net from 'node:net';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
async function free(port){return new Promise((resolve,reject)=>{const s=net.createServer();s.once('error',()=>reject(new Error(`Port ${port} is already in use. Stop the previous project terminal (Ctrl+C), then run npm run dev again.`)));s.listen(port,'0.0.0.0',()=>s.close(resolve));});}
try{await free(3001);await free(5173);}catch(e){console.error(e.message);process.exit(1);}
const children=[];let closing=false;
function stop(){if(closing)return;closing=true;for(const child of children)child.kill('SIGTERM');}
function launch(args){const child=spawn(process.execPath,args,{cwd:root,stdio:'inherit',windowsHide:true});children.push(child);child.on('exit',code=>{if(!closing){stop();process.exitCode=code||0;}});return child;}
process.on('SIGINT',stop);process.on('SIGTERM',stop);
launch(['--env-file-if-exists=.env','backend/index.js']);
let ready=false;for(let i=0;i<90&&!closing;i++){try{const r=await fetch('http://127.0.0.1:3001/api/health');if(r.ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,500));}
if(!ready){console.error('API did not become ready. Check the database connection above.');stop();process.exitCode=1;}else launch(['node_modules/vite/bin/vite.js','--config','frontend/vite.config.js','--host','0.0.0.0','--port','5173','--strictPort']);
