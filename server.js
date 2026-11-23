// Canvas Studio local server. Run: npm start  ->  http://localhost:5173
const http=require('http'),fs=require('fs'),path=require('path'),{spawn,spawnSync}=require('child_process');
const PORT=process.env.PORT||5173,PUB=path.join(__dirname,'public'),TPL=path.join(__dirname,'templates'),EXP=path.join(__dirname,'exports');
[TPL,EXP].forEach(d=>fs.mkdirSync(d,{recursive:true}));
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
const safe=n=>String(n).replace(/[^\w\- ]/g,'').trim().replace(/\s+/g,'-').slice(0,60);
const send=(res,code,body,type='application/json')=>{res.writeHead(code,{'Content-Type':type});res.end(typeof body==='string'||Buffer.isBuffer(body)?body:JSON.stringify(body))};
const readBody=req=>new Promise((ok,no)=>{let b='';req.on('data',c=>{b+=c;if(b.length>2e6){req.destroy();no(new Error('too big'))}});req.on('end',()=>ok(b))});

// ---- MP4 rendering: Chrome draws each frame, ffmpeg stitches them ----
process.on('uncaughtException',e=>console.error('uncaught:',e.message));process.on('unhandledRejection',e=>console.error('unhandled:',e&&e.message||e));
const jobs={};
function chromePath(){
  const L=process.env.LOCALAPPDATA||'';
  return [process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/Applications/Chromium.app/Contents/MacOS/Chromium',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe','C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    L+'\\Google\\Chrome\\Application\\chrome.exe','C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].find(p=>p&&fs.existsSync(p));
}
async function render(id,data){
  const job=jobs[id];
  let puppeteer;try{puppeteer=require('puppeteer-core')}catch(e){throw new Error('Run "npm install" in the project folder first.')}
  const exe=chromePath();if(!exe)throw new Error('Chrome not found. Install Google Chrome, or set CHROME_PATH to its location.');
  let ff=process.env.FFMPEG_PATH||'ffmpeg';if(!process.env.FFMPEG_PATH){try{ff=require('ffmpeg-static')||ff}catch(e){}}
  const chk=spawnSync(ff,['-version']);
  if(chk.error||chk.status!==0)throw new Error('ffmpeg is not working ('+ff+'). Run "npm install" again, or install ffmpeg and set FFMPEG_PATH.');
  const g=data.global||{},fps=+g.fps||30,dur=Math.min(60,+g.dur||4.5),scale=g.res==='720p'?1:1.5;
  const [W,H]=data.format==='16:9'?[1280,720]:[720,1280],total=Math.max(1,Math.round(dur*fps));
  const out=path.join(EXP,`${safe(data.canvas_template)}-${data.format.replace(':','x')}-${id}.mp4`);
  let p=null;
  const browser=await puppeteer.launch({executablePath:exe,headless:true,args:['--no-sandbox']});
  try{
    const page=await browser.newPage();await page.setViewport({width:W,height:H,deviceScaleFactor:scale});
    await page.goto(`http://127.0.0.1:${PORT}/?render=1`,{waitUntil:'load'});
    await page.evaluate(d=>window.__load(d),data);
    await Promise.race([page.evaluate(()=>document.fonts.ready),new Promise(r=>setTimeout(r,6000))]);
    p=spawn(ff,['-y','-loglevel','error','-f','image2pipe','-framerate',String(fps),'-c:v','mjpeg','-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','16','-preset','medium','-movflags','+faststart',out]);
    let err='',dead=false;p.stderr.on('data',d=>err+=d);p.stdin.on('error',()=>{dead=true});
    p.on('error',e=>{dead=true;err+=e.message});
    const closed=new Promise(r=>{p.on('close',r);p.on('error',()=>r(-1))});
    for(let i=0;i<total;i++){
      if(dead)throw new Error('ffmpeg stopped early. '+err.slice(0,200));
      await page.evaluate(t=>window.__frame(t),i/fps);
      const buf=await page.screenshot({type:'jpeg',quality:95});
      if(!p.stdin.write(buf)&&!dead)await Promise.race([new Promise(r=>p.stdin.once('drain',r)),closed]);
      job.progress=(i+1)/total;
    }
    p.stdin.end();const code=await closed;
    if(code!==0)throw new Error('ffmpeg failed. Is ffmpeg installed? '+err.slice(0,200));
    job.file=out;job.status='done';console.log('export done',out);
  }finally{try{if(p&&p.exitCode===null)p.kill()}catch(e){}await browser.close()}
}

http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://x');
  try{
    if(url.pathname==='/api/templates'){
      if(req.method==='GET')return send(res,200,fs.readdirSync(TPL).filter(f=>f.endsWith('.json')).map(f=>{try{return JSON.parse(fs.readFileSync(path.join(TPL,f),'utf8'))}catch(e){return null}}).filter(Boolean));
      if(req.method==='POST'){const {name,data}=JSON.parse(await readBody(req)),f=safe(name);if(!f)throw 0;
        fs.writeFileSync(path.join(TPL,f+'.json'),JSON.stringify({name:String(name).slice(0,60),data},null,2));return send(res,200,{ok:true})}
    }
    if(url.pathname==='/api/render'&&req.method==='POST'){
      const data=JSON.parse(await readBody(req)),id=Date.now().toString(36);
      jobs[id]={status:'running',progress:0};console.log('export started',id,data.canvas_template,data.format);
      render(id,data).catch(e=>{jobs[id].status='error';jobs[id].error=e.message;console.error('render error:',e.message)});
      return send(res,200,{id});
    }
    if(url.pathname==='/api/job'){const j=jobs[url.searchParams.get('id')];return j?send(res,200,{status:j.status,progress:j.progress,error:j.error}):send(res,404,{error:'no such job'})}
    if(url.pathname==='/api/video'){const j=jobs[url.searchParams.get('id')];if(!j||!j.file)return send(res,404,{error:'not ready'});
      res.writeHead(200,{'Content-Type':'video/mp4','Content-Disposition':`attachment; filename="${path.basename(j.file)}"`});return fs.createReadStream(j.file).pipe(res)}
  }catch(e){return send(res,400,{ok:false,error:String(e.message||e)})}
  const p=path.normalize(path.join(PUB,url.pathname==='/'?'index.html':url.pathname));
  if(!p.startsWith(PUB))return send(res,403,'Forbidden','text/plain');
  fs.readFile(p,(e,d)=>e?send(res,404,'Not found','text/plain'):send(res,200,d,MIME[path.extname(p)]||'application/octet-stream'));
}).listen(PORT,'127.0.0.1',()=>console.log(`\nCanvas Studio running at http://localhost:${PORT}\n(Ctrl+C to stop)\n`));
