let D=G.dur;
const S={tpl:SKILL.start,fmt:SKILL.fmt||'16:9',params:{},accent:SKILL.accent,t:0,play:true};
const $=id=>document.getElementById(id);
const dims=()=>S.fmt=='16:9'?[1280,720]:[720,1280];
function resetParams(){S.params={};T[S.tpl].fields.forEach(f=>S.params[f.k]=f.v)}

function thumb(k,W,H){const p={};T[k].fields.forEach(f=>p[f.k]=f.v);let r;try{r=T[k].draw(p,3.6,S.accent,W,H)}catch(x){return ''}
 return `<div class="th" style="aspect-ratio:${W}/${H}"><div class="thin" style="width:${W}px;height:${H}px;background:${r.bg};color:${r.color};font-family:${FONTS[G.font]}">${r.html}</div></div>`}
function buildTpls(){if(document.body.classList.contains('render'))return;const [W,H]=dims();
 $('tpls').innerHTML=Object.entries(T).map(([k,v])=>`<button class="tpl" data-k="${k}" aria-pressed="${k==S.tpl}">${thumb(k,W,H)}<b>${v.name}</b><span>${v.desc}</span></button>`).join('');
 $('tpls').querySelectorAll('.th').forEach(x=>{if(x.firstChild)x.firstChild.style.transform=`scale(${x.clientWidth/W})`});
 $('tpls').querySelectorAll('.tpl').forEach(b=>b.onclick=()=>{S.tpl=b.dataset.k;S.t=0;resetParams();buildTpls();buildFields();draw()});
}
function fld(f,o,id){const v=o[f.k];
 if(f.t=='sel')return `<select id="${id}">${f.o.map(x=>`<option${x==v?' selected':''}>${x}</option>`).join('')}</select>`;
 if(f.t=='area')return `<textarea id="${id}">${esc(v)}</textarea>`;
 if(f.t=='num')return `<div class="rng"><input type="range" id="${id}" min="${f.min}" max="${f.max}" step="${f.step}" value="${v}"><output id="${id}o">${v}</output></div>`;
 if(f.t=='color')return `<input type="color" id="${id}" value="${v}">`;
 return `<input type="text" id="${id}" value="${esc(v)}">`}
function section(fs,o,pre){return fs.map(f=>{const id=pre+f.k;return f.t=='chk'?`<label class="chk"><input type="checkbox" id="${id}"${o[f.k]?' checked':''}> ${f.l}</label>`:`<label for="${id}">${f.l}</label>${f.h?`<div class="msg">${f.h}</div>`:''}${fld(f,o,id)}`}).join('')}
function wire(f,o,id){const el=$(id);el.oninput=el.onchange=e=>{const t=e.target;o[f.k]=f.t=='chk'?t.checked:f.t=='num'?+t.value:t.value;
 if(f.t=='num')$(id+'o').textContent=t.value;if(f.k=='dur'){D=G.dur;S.t=Math.min(S.t,D)}draw()}}
function buildFields(){const tf=T[S.tpl].fields;
 $('fields').innerHTML='<h2>(template)</h2>'+section(tf,S.params,'f_')+'<h2>(style &amp; export)</h2>'+section(GF,G,'g_');
 tf.forEach(f=>wire(f,S.params,'f_'+f.k));GF.forEach(f=>wire(f,G,'g_'+f.k))}
function fit(){
 if(document.body.classList.contains('render')){const[W,H]=dims();Object.assign($('stage').style,{position:'fixed',left:'0',top:'0',zIndex:'99',width:W+'px',height:H+'px',transform:'none'});return}
 const [W,H]=dims(),wrapW=$('wrap').clientWidth-56,maxH=Math.max(240,$('wrap').clientHeight-56);
 const sc=Math.min(wrapW/W,maxH/H,1);
 $('frame').style.width=W*sc+'px';$('frame').style.height=H*sc+'px';
 $('stage').style.width=W+'px';$('stage').style.height=H+'px';$('stage').style.transform=`scale(${sc})`;
}
function draw(){
 const [W,H]=dims(),r=T[S.tpl].draw(S.params,S.t*G.speed,S.accent,W,H);
 const st=$('stage');st.style.background=G.bgOn?G.bg:r.bg;st.style.color=G.tcOn?G.tc:r.color;st.style.fontFamily=FONTS[G.font];
 st.classList.toggle('tc',G.tcOn);st.style.setProperty('--tc',G.tc);
 const ov=(G.vig?'<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.38) 100%)"></div>':'')+(G.grain?`<div style="position:absolute;inset:0;pointer-events:none;opacity:.2;mix-blend-mode:multiply;background:url('${GRAIN}')"></div>`:'');
 st.innerHTML=`<div style="position:absolute;inset:0;transform:scale(${G.size/100})">${r.html}</div>`+ov;
 $('scrub').value=Math.round(S.t/D*1000);$('time').textContent=S.t.toFixed(2)+' / '+D.toFixed(2)+' s';
 $('json').value=JSON.stringify({skill:SKILL.id,template:S.tpl,format:S.fmt,accent:S.accent,params:S.params,global:G},null,2);
}
let last=performance.now();
function tick(n){const dt=(n-last)/1000;last=n;
 if(S.play){S.t+=dt;if(S.t>D+0.8)S.t=0;if(S.t<=D)draw();else{S.t=Math.min(S.t,D)}}
 requestAnimationFrame(tick)}
function setFmt(f){S.fmt=f;$('f169').setAttribute('aria-pressed',f=='16:9');$('f916').setAttribute('aria-pressed',f!='16:9');fit();draw();buildTpls()}
$('f169').onclick=()=>setFmt('16:9');$('f916').onclick=()=>setFmt('9:16');
const PL='<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5v11l9-5.5z"/></svg>',PA='<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2.5" width="3.5" height="11" rx="1"/><rect x="9.5" y="2.5" width="3.5" height="11" rx="1"/></svg>';
function setPlay(){$('play').innerHTML=S.play?PA:PL;$('play').setAttribute('aria-label',S.play?'Pause':'Play')}
$('play').onclick=()=>{S.play=!S.play;setPlay()};
$('scrub').oninput=e=>{S.play=false;setPlay();S.t=e.target.value/1000*D;draw()};
$('accent').oninput=e=>{S.accent=e.target.value;draw();clearTimeout(window.__tt);window.__tt=setTimeout(buildTpls,200)};
$('theme').onclick=()=>{const r=document.documentElement,d=getComputedStyle(r).colorScheme=='dark';r.dataset.theme=d?'light':'dark'};
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText($('json').value);$('cmsg').textContent='Copied.'}catch(e){$('json').select();$('cmsg').textContent='Press Ctrl/Cmd+C to copy.'}};
window.addEventListener('resize',fit);

const FONTFILES=SKILL.fontFiles;
{const st=document.createElement('style');st.textContent=SKILL.css.replace(/\.tc \*\{[^}]*\}/,'')+FONTFILES.map(f=>`@font-face{font-family:'${f.fam}';font-weight:${f.w};font-style:${f.st};src:url(${f.src}) format('woff2');font-display:swap}`).join('');document.head.appendChild(st)}
let SERVER=false;const LS='canvasStudio.templates';
const lsGet=()=>{try{return JSON.parse(localStorage.getItem(LS)||'[]')}catch(e){return[]}};
async function getAll(){if(SERVER){try{return await(await fetch('/api/templates')).json()}catch(e){}}return lsGet()}
const getList=async()=>(await getAll()).filter(x=>((x.data&&x.data.skill)||'canvas')==SKILL.id);
function applyData(d,name){S.tpl=d.template||d.canvas_template;if(!T[S.tpl])S.tpl=SKILL.start;S.fmt=d.format;S.accent=d.accent;resetParams();Object.assign(S.params,d.params);Object.assign(G,d.global||{});D=G.dur;S.t=0;$('accent').value=S.accent;if(name)$('sname').value=name;buildTpls();buildFields();setFmt(S.fmt)}
async function loadList(){const list=await getList();
 $('slist').innerHTML=list.length?list.map((t,i)=>`<button class="chip" data-i="${i}">${esc(t.name)}</button>`).join(''):'<span class="msg">No saved templates yet.</span>';
 $('slist').querySelectorAll('.chip').forEach(b=>b.onclick=()=>applyData(list[b.dataset.i].data,list[b.dataset.i].name))}
$('save').onclick=async()=>{const name=$('sname').value.trim();if(!name){$('smsg').textContent='Give it a name first.';return}
 const item={name,data:JSON.parse($('json').value)};
 try{if(SERVER){const r=await fetch('/api/templates',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(item)});if(!r.ok)throw 0}
  else{const l=lsGet().filter(x=>x.name!==name);l.push(item);localStorage.setItem(LS,JSON.stringify(l))}
  $('smsg').textContent=SERVER?'Saved to templates/ folder.':'Saved in this browser.';loadList()}catch(e){$('smsg').textContent='Could not save.'}};
const saveBlob=(blob,name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000)};
$('dl').onclick=()=>saveBlob(new Blob([JSON.stringify({name:$('sname').value.trim()||S.tpl,data:JSON.parse($('json').value)},null,2)],{type:'application/json'}),(($('sname').value.trim()||S.tpl).replace(/[^\w-]+/g,'-'))+'.json');
$('imp').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const j=JSON.parse(await f.text()),dd=j.data||j;if((dd.skill||'canvas')!=SKILL.id){$('smsg').textContent='That template belongs to the '+(dd.skill||'canvas')+' skill.';e.target.value='';return}applyData(dd,j.name)}catch(x){$('smsg').textContent='Not a valid template file.'}e.target.value=''};

// ---- in-browser MP4 export (used when there is no local server, e.g. on Vercel) ----
const STAGE_CSS=SKILL.css;
let FONTCSS='';
async function fontCss(){if(FONTCSS)return FONTCSS;
 const parts=await Promise.all(FONTFILES.map(async f=>{const b=new Uint8Array(await(await fetch(f.src)).arrayBuffer());let x='';for(let i=0;i<b.length;i+=0x8000)x+=String.fromCharCode.apply(null,b.subarray(i,i+0x8000));
  return `@font-face{font-family:'${f.fam}';font-weight:${f.w};font-style:${f.st};src:url(data:font/woff2;base64,${btoa(x)}) format('woff2')}`}));
 return FONTCSS=parts.join('')}
function frameSvg(css,W,H){const st=$('stage'),w=document.createElement('div');
 w.setAttribute('xmlns','http://www.w3.org/1999/xhtml');w.className=st.classList.contains('tc')?'tc':'';
 w.style.cssText=`position:relative;overflow:hidden;width:${W}px;height:${H}px;background:${st.style.background};color:${st.style.color};font-family:${st.style.fontFamily};--tc:${G.tc}`;
 w.innerHTML=st.innerHTML;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><foreignObject width="${W}" height="${H}"><style>${css}</style>${new XMLSerializer().serializeToString(w)}</foreignObject></svg>`}
async function exportInBrowser(m){
 if(!window.VideoEncoder||!window.Mp4Muxer)throw new Error('This browser can’t encode video. Use desktop Chrome or Edge.');
 const [W,H]=dims(),fps=+G.fps||30,total=Math.max(1,Math.round(D*fps)),sc=G.res=='720p'?1:1.5,OW=Math.round(W*sc),OH=Math.round(H*sc);
 m.textContent='Preparing fonts…';const css=STAGE_CSS+await fontCss();
 let cfg=null;for(const [c,k] of [['avc1.640033','avc'],['avc1.64002A','avc'],['avc1.4d0028','avc'],['vp09.00.40.08','vp9']]){
  const conf={codec:c,width:OW,height:OH,bitrate:8e6,framerate:fps};try{if((await VideoEncoder.isConfigSupported(conf)).supported){cfg={conf,k};break}}catch(e){}}
 if(!cfg)throw new Error('No supported video codec in this browser. Try desktop Chrome or Edge.');
 const wasPlay=S.play,t0=S.t;S.play=false;
 const muxer=new Mp4Muxer.Muxer({target:new Mp4Muxer.ArrayBufferTarget(),video:{codec:cfg.k,width:OW,height:OH},fastStart:'in-memory'});
 let encErr=null;const enc=new VideoEncoder({output:(c,md)=>muxer.addVideoChunk(c,md),error:e=>{encErr=e}});enc.configure(cfg.conf);
 const cv=document.createElement('canvas');cv.width=OW;cv.height=OH;const ctx=cv.getContext('2d');
 try{for(let i=0;i<total;i++){if(encErr)throw encErr;
   S.t=i/fps;draw();
   const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(frameSvg(css,W,H));await img.decode();
   ctx.drawImage(img,0,0,OW,OH);
   const vf=new VideoFrame(cv,{timestamp:Math.round(i*1e6/fps),duration:Math.round(1e6/fps)});enc.encode(vf,{keyFrame:i%(fps*2)==0});vf.close();
   while(enc.encodeQueueSize>6)await new Promise(r=>setTimeout(r,5));
   m.textContent='Rendering '+Math.round((i+1)/total*100)+'%';if(i%3==0)await new Promise(r=>setTimeout(r,0))}
  await enc.flush();if(encErr)throw encErr;muxer.finalize();
  saveBlob(new Blob([muxer.target.buffer],{type:'video/mp4'}),`${S.tpl}-${S.fmt.replace(':','x')}.mp4`);m.textContent='Done. Your MP4 was downloaded.';
 }finally{S.play=wasPlay;S.t=t0;draw()}}
fetch('/api/templates').then(r=>{SERVER=r.ok&&(r.headers.get('content-type')||'').includes('json')}).catch(()=>{}).finally(loadList);
if(location.search.includes('render=1'))document.body.classList.add('render');
document.title=SKILL.name+' Studio';$('brand').innerHTML=SKILL.name+' <em>studio</em>';if($('clk'))startClock($('clk'));setPlay();new ResizeObserver(()=>fit()).observe($('wrap'));$('tag').textContent=SKILL.tagline;
$('nav').innerHTML='<a href="/">Home</a>'+SKILLS_INDEX.map(k=>`<a href="${k.href}"${k.id==SKILL.id?' aria-current="page"':''}>${k.name}</a>`).join('');
$('accent').value=S.accent;
resetParams();buildTpls();buildFields();setFmt(S.fmt);requestAnimationFrame(tick);
window.__load=d=>{document.body.classList.add('render');S.tpl=d.template||d.canvas_template;S.fmt=d.format;S.accent=d.accent;resetParams();Object.assign(S.params,d.params);Object.assign(G,d.global||{});D=G.dur;S.play=false;fit();draw()};
window.__frame=t=>{S.t=t;draw()};
const NOSRV='Can’t reach the local server. Open http://localhost:5173 in your browser (not the HTML file), and keep the terminal running npm start.';
if(location.protocol==='file:'){const w=document.createElement('div');w.className='msg';w.style.cssText='color:#c0392b;font-weight:600';w.textContent=NOSRV;document.querySelector('main').prepend(w)}
$('exp').onclick=async()=>{const b=$('exp'),m=$('emsg');if(location.protocol==='file:'){m.textContent=NOSRV;return}b.disabled=true;m.textContent='Starting…';
 if(!SERVER){try{await exportInBrowser(m)}catch(e){m.textContent='Export failed: '+(e&&e.message||e)}b.disabled=false;return}
 try{const r=await fetch('/api/render',{method:'POST',headers:{'Content-Type':'application/json'},body:$('json').value});const j=await r.json();if(!j.id)throw new Error(j.error||'could not start');
  for(;;){await new Promise(x=>setTimeout(x,500));const q=await(await fetch('/api/job?id='+j.id)).json();
   if(q.status=='error')throw new Error(q.error);m.textContent='Rendering '+Math.round(q.progress*100)+'%';
   if(q.status=='done'){m.textContent='Done. Also saved in the exports folder.';const a=document.createElement('a');a.href='/api/video?id='+j.id;a.download='';document.body.appendChild(a);a.click();a.remove();break}}
 }catch(e){m.textContent=e instanceof TypeError?NOSRV:'Export failed: '+e.message}b.disabled=false};