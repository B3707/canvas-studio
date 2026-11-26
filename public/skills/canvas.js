const GROUND={paper:'#eeecf0',dark:'#161818',blue:'radial-gradient(ellipse at center,#2e4fba 0%,#1a3399 55%,#0a1643 100%)'};
const INK={paper:'#121212',dark:'#f3f2f5',blue:'#fff'};

const T={
caption:{name:'Caption',desc:'Big key word, small words in the gaps',
 fields:[{k:'text',l:'Line (5 words or fewer)',v:'There are four career patterns'},
  {k:'key',l:'Key word',v:'four'},
  {k:'style',l:'Key word style',t:'sel',o:['Inter Black','Playfair italic'],v:'Inter Black'},
  {k:'ground',l:'Ground',t:'sel',o:['paper','dark','blue'],v:'paper'},
  {k:'stagger',l:'Word delay (s)',t:'num',min:.1,max:.6,step:.02,v:.28},{k:'small',l:'Small word size',t:'num',min:20,max:64,step:1,v:34},{k:'keysize',l:'Key word size %',t:'num',min:50,max:150,step:5,v:100}],
 draw(p,t,a,W,H){
  const ws=p.text.trim().split(/\s+/).filter(Boolean).slice(0,6);
  const norm=s=>s.toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
  let ki=ws.findIndex(w=>norm(w)===norm(p.key));if(ki<0)ki=ws.reduce((b,w,i)=>w.length>ws[b].length?i:b,0);
  const on=i=>0.3+i*p.stagger,col=INK[p.ground];
  const row=(a0,b0,al)=>`<div style="align-self:${al};text-align:${al=='flex-start'?'left':'right'};font-size:${p.small}px" class="sm">${ws.slice(a0,b0).map((w,j)=>`<span class="w" style="${wIn(on(a0+j),t)}">${esc(w)}&nbsp;</span>`).join('')}</div>`;
  const big=(H>W?150:190)*p.keysize/100;
  return {bg:GROUND[p.ground],color:col,html:`<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><div style="display:inline-flex;flex-direction:column;gap:6px;color:${col}">
   ${ki>0?row(0,ki,'flex-start'):''}
   <div class="big ${p.style=='Playfair italic'?'serif':''}"><span class="w" style="font-size:${big}px;color:${p.ground=='paper'?a:col};${wIn(on(ki),t)}">${esc(ws[ki]||'')}</span></div>
   ${ki<ws.length-1?row(ki+1,ws.length,'flex-end'):''}</div></div>`}}},

quote:{name:'Quote on blue',desc:'The punchline, vignetted, word by word',
 fields:[{k:'text',l:'Quote',v:'The edit is not what makes the video. The idea is.'},
  {k:'who',l:'Said by',v:'You, to yourself'},
  {k:'stagger',l:'Word delay (s)',t:'num',min:.05,max:.5,step:.01,v:.17},{k:'align',l:'Alignment',t:'sel',o:['left','center'],v:'left'},{k:'mark',l:'Show quote mark',t:'chk',v:true},{k:'push',l:'Push-in (%/s)',t:'num',min:0,max:6,step:.5,v:2.5}],
 draw(p,t,a,W,H){
  const ws=p.text.trim().split(/\s+/).filter(Boolean);
  const sz=H>W?58:64,push=1+p.push/100*t;
  return {bg:GROUND.blue,color:'#fff',html:`<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:${H>W?'60px':'110px'};transform:scale(${push})">
   <div style="color:#fff;max-width:900px;text-align:${p.align}"><div class="serif" style="font-size:150px;line-height:.6;opacity:${p.mark?ease(t/0.4)*.6:0}">&ldquo;</div>
   <div class="big" style="font-size:${sz}px;line-height:1.08;letter-spacing:-.035em">${ws.map((w,i)=>`<span class="w" style="${wIn(0.5+i*p.stagger,t)}">${esc(w)}&nbsp;</span>`).join('')}</div>
   <div style="margin-top:28px;font-size:26px;opacity:${ease((t-0.5-ws.length*p.stagger)/0.4)*.75}">${esc(p.who)}</div></div></div>`}}},

versus:{name:'Versus card',desc:'Two options, the winner lifts',
 fields:[{k:'lt',l:'Left title',v:'By hand'},{k:'ls',l:'Left detail',v:'an hour per clip'},
  {k:'rt',l:'Right title',v:'Canvas'},{k:'rs',l:'Right detail',v:'free, in code'},
  {k:'win',l:'Winner',t:'sel',o:['right','left'],v:'right'},
  {k:'radius',l:'Corner radius',t:'num',min:0,max:60,step:2,v:18},{k:'card',l:'Card colour',t:'color',v:'#ffffff'}],
 draw(p,t,a,W,H){
  const card=(ti,su,side,i)=>{const win=p.win==side,e=ease((t-0.2-i*0.2)/0.5),pw=ease((t-2.2)/0.4);
   const y=(1-e)*40-(win?pw*26:0),op=e*(win?1:1-pw*0.55),sc=win?1+pw*0.05:1;
   return `<div style="flex:1;background:${p.card};border-radius:${p.radius}px;padding:${H>W?'40px 30px':'50px 44px'};box-shadow:0 14px 40px rgba(0,0,0,.12);opacity:${op};transform:translateY(${y}px) scale(${sc})">
    <div class="big" style="font-size:${H>W?54:68}px;letter-spacing:-.04em;line-height:1">${esc(ti)}</div>
    <div style="margin-top:12px;font-size:28px;color:#685b55">${esc(su)}</div>
    <div style="margin-top:26px;height:8px;border-radius:4px;background:${a};width:${win?pw*100:0}%"></div></div>`};
  return {bg:GROUND.paper,color:'#121212',html:`<div style="position:absolute;inset:0;display:flex;flex-direction:${H>W?'column':'row'};gap:26px;align-items:stretch;justify-content:center;padding:${H>W?'150px 50px':'150px 90px'};color:#121212">${card(p.lt,p.ls,'left',0)}${card(p.rt,p.rs,'right',1)}</div>`}}},

bars:{name:'Bar chart',desc:'Numbers grow in, last bar takes the accent',
 fields:[{k:'rows',l:'Rows (label: value)',t:'area',v:'Raw take: 12\nCut: 34\nCanvas edit: 78'},
  {k:'title',l:'Title',v:'Watch time kept (%)'},
  {k:'barh',l:'Bar height',t:'num',min:14,max:70,step:2,v:34},{k:'radius',l:'Corner radius',t:'num',min:0,max:30,step:1,v:6},{k:'barcolor',l:'Other bars colour',t:'color',v:'#685b55'},{k:'vals',l:'Show values',t:'chk',v:true}],
 draw(p,t,a,W,H){
  const rows=p.rows.split('\n').map(r=>r.split(':')).filter(r=>r[0]&&r[0].trim()).slice(0,6).map(r=>[r[0].trim(),parseFloat(r[1])||0]);
  const mx=Math.max(1,...rows.map(r=>r[1]));
  return {bg:GROUND.paper,color:'#121212',html:`<div style="position:absolute;inset:0;padding:${H>W?'160px 56px':'90px 120px'};color:#121212;display:flex;flex-direction:column;justify-content:center;gap:22px">
   <div class="big" style="font-size:52px;letter-spacing:-.035em;opacity:${ease(t/0.4)}">${esc(p.title)}</div>
   ${rows.map((r,i)=>{const e=ease((t-0.3-i*0.35)/0.9),last=i==rows.length-1;
    return `<div><div style="display:flex;justify-content:space-between;font-size:28px;margin-bottom:6px;opacity:${clamp(e*3)}"><span>${esc(r[0])}</span>${p.vals?`<b style="font-weight:900">${Math.round(r[1]*e)}</b>`:''}</div>
    <div style="height:${p.barh}px;background:rgba(0,0,0,.08);border-radius:${p.radius}px"><div style="height:100%;width:${(r[1]/mx*100*e).toFixed(1)}%;border-radius:${p.radius}px;background:${last?a:p.barcolor}"></div></div></div>`}).join('')}</div>`}}},

iconflow:{name:'Icon flow',desc:'A process: step, step, step',
 fields:[{k:'rows',l:'Steps',t:'area',h:'icon | label | detail, one per line. '+ICH,v:'download | Download | the raw clip\nscissors | Cut | silences gone\nsparkles | Style | the Canvas look\nvideo | Export | one MP4'},gf('paper')],
 draw(p,t,a,W,H){const v=H>W,g=p.ground,col=INK[g],mute=g=='paper'?'#685b55':'rgba(255,255,255,.7)',z=v?120:140,it=rowsOf(p.rows,5);
  const items=it.map((r,i)=>{const on=0.3+i*0.65,arrow=i<it.length-1?`<div style="opacity:${ease((t-on-0.35)/0.3)};${v?'transform:rotate(90deg)':''}">${ic('arrow-right',54,mute)}</div>`:'';
   return `<div style="display:flex;flex-direction:${v?'column':'row'};align-items:center;gap:${v?18:28}px"><div style="text-align:center;${pop(on,t)}"><div style="width:${z}px;height:${z}px;border-radius:50%;background:${a};display:flex;align-items:center;justify-content:center;margin:0 auto">${ic(r[0],z*.5,'#fff')}</div><div class="big" style="font-size:38px;letter-spacing:-.02em;margin-top:16px;line-height:1.05">${esc(r[1]||'')}</div><div style="font-size:24px;color:${mute};margin-top:6px">${esc(r[2]||'')}</div></div>${arrow}</div>`}).join('');
  return {bg:GROUND[g],color:col,html:`<div style="position:absolute;inset:0;display:flex;flex-direction:${v?'column':'row'};align-items:center;justify-content:center;gap:${v?18:28}px;color:${col}">${items}</div>`}}},

checklist:{name:'Checklist',desc:'Boxes fill and check, one by one',
 fields:[{k:'title',l:'Heading',v:'Setup'},{k:'rows',l:'Steps (one per line)',t:'area',v:'Install Node\nInstall Chrome\nRun npm start\nExport your video'},gf('paper')],
 draw(p,t,a,W,H){const v=H>W,g=p.ground,col=INK[g],rows=p.rows.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,7);
  const items=rows.map((r,i)=>{const on=0.4+i*0.55,e=ease((t-on)/0.35),c=ease((t-on-0.45)/0.25);
   return `<div style="display:flex;align-items:center;gap:26px;opacity:${e};transform:translateY(${(1-e)*24}px)"><div style="width:58px;height:58px;border-radius:14px;border:4px solid ${c>0?a:col};background:${c>0?a:'transparent'};display:flex;align-items:center;justify-content:center;flex:none;transform:scale(${1+0.14*Math.sin(c*Math.PI)})"><span style="opacity:${c};display:flex">${ic('check',38,'#fff',3.5)}</span></div><div class="big" style="font-size:${v?44:54}px;letter-spacing:-.03em;line-height:1.05">${esc(r)}</div></div>`}).join('');
  return {bg:GROUND[g],color:col,html:`<div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 ${v?70:200}px;gap:30px;color:${col}"><div style="font-size:30px;font-weight:600;opacity:${ease(t/0.3)};color:${a}">${esc(p.title)}</div>${items}</div>`}}},

donut:{name:'Donut',desc:'A share or fraction, ring fills',
 fields:[{k:'pct',l:'Percent',t:'num',min:0,max:100,step:1,v:67},{k:'label',l:'Label',v:'of the edit is automatic'},{k:'sub',l:'Detail',v:'you only fix the story'},{k:'thick',l:'Ring thickness',t:'num',min:16,max:80,step:2,v:44},gf('dark')],
 draw(p,t,a,W,H){const v=H>W,g=p.ground,col=INK[g],R=190,C=2*Math.PI*R,val=p.pct*ease((t-0.3)/1.5),track=g=='dark'?'rgba(255,255,255,.12)':'rgba(0,0,0,.09)';
  return {bg:GROUND[g],color:col,html:`<div style="position:absolute;inset:0;display:flex;flex-direction:${v?'column':'row'};align-items:center;justify-content:center;gap:50px;color:${col}"><div style="position:relative;width:460px;height:460px"><svg viewBox="0 0 460 460" width="460" height="460" style="transform:rotate(-90deg)"><circle cx="230" cy="230" r="${R}" fill="none" stroke="${track}" stroke-width="${p.thick}"/><circle cx="230" cy="230" r="${R}" fill="none" stroke="${a}" stroke-width="${p.thick}" stroke-linecap="round" stroke-dasharray="${(C*val/100).toFixed(1)} ${C.toFixed(1)}"/></svg><div class="big" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:130px;letter-spacing:-.05em">${Math.round(val)}<span style="font-size:60px;margin-left:6px">%</span></div></div><div style="max-width:${v?'80%':'420px'};opacity:${ease((t-0.5)/0.4)};text-align:${v?'center':'left'}"><div class="big" style="font-size:56px;letter-spacing:-.035em;line-height:1">${esc(p.label)}</div><div style="font-size:28px;margin-top:12px;opacity:.7">${esc(p.sub)}</div></div></div>`}}},

tiles:{name:'Tile grid',desc:'2 to 6 parallel things',
 fields:[{k:'rows',l:'Tiles',t:'area',h:'icon | label | detail, one per line. '+ICH,v:'video | Creators | talking-head videos\nscissors | Editors | fast rough cuts\nbot | Teams | repeatable style\nbrain | Teachers | explainers'},{k:'radius',l:'Corner radius',t:'num',min:0,max:50,step:2,v:22},gf('paper')],
 draw(p,t,a,W,H){const v=H>W,g=p.ground,col=INK[g],it=rowsOf(p.rows,6),cols=v||it.length==4?2:Math.min(3,it.length),card=g=='dark'?'#232526':'#fff';
  return {bg:GROUND[g],color:col,html:`<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:0 ${v?56:110}px;color:${col}"><div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:24px;width:100%">${it.map((r,i)=>`<div style="background:${card};border-radius:${p.radius}px;padding:34px 28px;box-shadow:0 12px 34px rgba(0,0,0,.12);${pop(0.3+i*0.28,t)}">${ic(r[0],64,a)}<div class="big" style="font-size:38px;margin-top:18px;letter-spacing:-.03em;line-height:1.05">${esc(r[1]||'')}</div><div style="font-size:23px;margin-top:8px;opacity:.65">${esc(r[2]||'')}</div></div>`).join('')}</div></div>`}}},

graph:{name:'Climbing graph',desc:'Dark, a glowing ball steps on each word',
 fields:[{k:'text',l:'Words (up to 8)',v:'better and better and better'}],
 draw(p,t,a,W,H){const ws=p.text.trim().split(/\s+/).filter(Boolean).slice(0,8),n=Math.max(1,ws.length),m=H>W?110:200,x0=m,x1=W-m,yb=H*0.78,yt=H*0.24;
  const pt=i=>[x0+(x1-x0)*(i+0.5)/n,yb-(yb-yt)*(i+1)/n],st=i=>0.5+i*0.55;let bi=-1;for(let i=0;i<n;i++)if(t>=st(i))bi=i;
  const fr=bi>0?pt(bi-1):[x0,yb],to=bi>=0?pt(bi):[x0,yb],k=bi>=0?ease((t-st(bi))/0.4):0,bx=fr[0]+(to[0]-fr[0])*k,by=fr[1]+(to[1]-fr[1])*k;
  const path=[[x0,yb],...Array.from({length:Math.max(0,bi)},(_,i)=>pt(i)),[bx,by]];
  return {bg:GROUND.dark,color:'#f6f5f8',html:`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="position:absolute;inset:0"><defs><filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter></defs><path d="M${x0} ${yt-40}V${yb}H${x1+40}" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="4" stroke-linecap="round"/>
  ${bi>=0?`<polyline points="${path.map(q=>q.map(z=>z.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#f2f4ff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${bx}" cy="${by}" r="46" fill="${a}" opacity=".65" filter="url(#gl)"/><circle cx="${bx}" cy="${by}" r="20" fill="${a}"/>`:''}
  ${ws.map((w,i)=>{const q=pt(i);return `<text x="${q[0]}" y="${q[1]-50}" text-anchor="middle" font-size="46" font-weight="900" fill="#f6f5f8" style="${wIn(st(i),t)}">${esc(w)}</text>`}).join('')}</svg>`}}},

blueline:{name:'Blue line',desc:'One thought runs into the next',
 fields:[{k:'text',l:'Two phrases split by /',v:'nobody sees / that value'},{k:'thick',l:'Line thickness',t:'num',min:6,max:40,step:2,v:16},gf('dark')],
 draw(p,t,a,W,H){const v=H>W,g=p.ground,col=INK[g],bg=GROUND[g],[A,B]=p.text.split('/').map(x=>x.trim()),fs=v?84:104,na=(A||'').split(' ').length;
  const blk=(tx,on,al)=>`<div class="big" style="background:${bg};padding:0 ${v?18:34}px;font-size:${fs}px;max-width:${v?'46%':'44%'};text-align:${al}">${(tx||'').split(' ').map((w,i)=>`<span class="w" style="${wIn(on+i*0.2,t)}">${esc(w)}&nbsp;</span>`).join('')}</div>`;
  return {bg,color:col,html:`<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:space-between;padding:0 ${v?30:90}px;color:${col}"><div style="position:absolute;left:0;top:50%;height:${p.thick}px;margin-top:-${p.thick/2}px;width:${ease(t/0.8)*100}%;background:${a}"></div><div style="position:relative">${blk(A,0.6,'left')}</div><div style="position:relative">${blk(B,0.9+na*0.2,'right')}</div></div>`}}},

counter:{name:'Counter',desc:'A number that lands with weight',
 fields:[{k:'prefix',l:'Prefix',v:'$'},{k:'value',l:'Number',v:'48'},{k:'suffix',l:'Suffix',v:'k'},{k:'label',l:'Label',v:'saved per year'},gf('dark')],
 draw(p,t,a,W,H){const g=p.ground,col=INK[g],val=(+p.value||0)*ease((t-0.3)/1.6),dec=(String(p.value).split('.')[1]||'').length,num=val.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec});
  return {bg:GROUND[g],color:col,html:`<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:${col};text-align:center;padding:0 40px"><div class="big" style="font-size:${H>W?170:260}px;letter-spacing:-.06em;font-variant-numeric:tabular-nums;white-space:nowrap">${esc(p.prefix)}${num}<span style="color:${a}">${esc(p.suffix)}</span></div><div style="font-size:44px;font-weight:600;margin-top:18px;opacity:${ease((t-0.6)/0.4)*.8}">${esc(p.label)}</div></div>`}}},

roadmap:{name:'Roadmap',desc:'What the video covers, lights that stop',
 fields:[{k:'title',l:'Heading',v:'In this video'},{k:'rows',l:'Chapters (one per line)',t:'area',v:'The problem\nThe setup\nThe edit\nThe export'},gf('dark')],
 draw(p,t,a,W,H){const v=H>W,g=p.ground,col=INK[g],it=p.rows.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,6),lit=Math.floor((t-1.7)/0.7);
  return {bg:GROUND[g],color:col,html:`<div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 ${v?70:200}px;gap:${v?26:22}px;color:${col}"><div style="font-size:30px;font-weight:600;color:${a};opacity:${ease(t/0.3)}">${esc(p.title)}</div>
  ${it.map((r,i)=>{const e=ease((t-0.3-i*0.25)/0.35),on=i==lit;return `<div style="display:flex;align-items:baseline;gap:26px;opacity:${(e*(on?1:i<lit?.55:.4)).toFixed(3)};transform:translateX(${((1-e)*-40+(on?18:0)).toFixed(1)}px)"><span class="big" style="font-size:${v?34:40}px;color:${on?a:'inherit'}">${String(i+1).padStart(2,'0')}</span><span class="big" style="font-size:${v?54:66}px;letter-spacing:-.04em">${esc(r)}</span></div>`}).join('')}</div>`}}},

linechart:{name:'Line chart',desc:'Something grows over time',
 fields:[{k:'title',l:'Title',v:'It keeps getting better'},{k:'pts',l:'Values (comma separated)',v:'5, 12, 18, 35, 60, 100'},gf('paper')],
 draw(p,t,a,W,H){const v=H>W,g=p.ground,col=INK[g],vs=p.pts.split(/[,\s]+/).map(Number).filter(x=>!isNaN(x)).slice(0,10),n=Math.max(2,vs.length);
  const x0=v?110:220,x1=W-x0,yb=H*0.74,yt=H*0.3,mx=Math.max(...vs,1),mn=Math.min(0,...vs),P=vs.map((y,i)=>[x0+(x1-x0)*i/(n-1),yb-(yb-yt)*(y-mn)/(mx-mn||1)]);
  const k=ease((t-0.4)/1.8)*(n-1),sg=Math.min(Math.floor(k),n-1),f=k-sg,pts=P.slice(0,sg+1);if(sg<n-1)pts.push([P[sg][0]+(P[sg+1][0]-P[sg][0])*f,P[sg][1]+(P[sg+1][1]-P[sg][1])*f]);
  const ax=g=='dark'?'rgba(255,255,255,.35)':'rgba(0,0,0,.25)';
  return {bg:GROUND[g],color:col,html:`<div class="big" style="position:absolute;left:0;right:0;top:${H*0.13}px;text-align:center;font-size:56px;letter-spacing:-.035em;opacity:${ease(t/0.4)};color:${col}">${esc(p.title)}</div><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="position:absolute;inset:0"><path d="M${x0-30} ${yt-30}V${yb+20}H${x1+30}" fill="none" stroke="${ax}" stroke-width="4" stroke-linecap="round"/>${pts.length>1?`<polyline points="${pts.map(q=>q.map(z=>z.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${a}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`:''}${P.map((q,i)=>i<=sg?`<circle cx="${q[0]}" cy="${q[1]}" r="15" fill="${a}"/>`:'').join('')}</svg>`}}}

};
const G={dur:4.5,speed:1,anim:'blur',font:'Inter',size:100,tcOn:false,tc:'#121212',bgOn:false,bg:'#eeecf0',grain:false,vig:false,fps:'30',res:'1080p'};
const FONTS={Inter:"Inter,system-ui,sans-serif",Playfair:"'Playfair Display',Georgia,serif","Space Grotesk":"'Space Grotesk',system-ui,sans-serif","DM Serif":"'DM Serif Display',Georgia,serif",Georgia:"Georgia,serif",Mono:"ui-monospace,Menlo,Consolas,monospace"};
const GF=[{k:'dur',l:'Duration (s)',t:'num',min:2,max:15,step:.5},{k:'speed',l:'Animation speed',t:'num',min:.5,max:2,step:.1},
 {k:'anim',l:'Entrance style',t:'sel',o:['blur','rise','fade','pop']},{k:'font',l:'Font',t:'sel',o:Object.keys(FONTS)},
 {k:'size',l:'Overall scale %',t:'num',min:60,max:140,step:5},
 {k:'bgOn',l:'Custom background',t:'chk'},{k:'bg',l:'Background colour',t:'color'},{k:'tcOn',l:'Override text colour',t:'chk'},{k:'tc',l:'Text colour',t:'color'},
 {k:'grain',l:'Paper grain',t:'chk'},{k:'vig',l:'Vignette',t:'chk'},
 {k:'fps',l:'Frame rate',t:'sel',o:['24','30','60']},{k:'res',l:'Export size',t:'sel',o:['720p','1080p']}];
const SKILL={id:'canvas',name:'Canvas',tagline:'Premium minimal explainer graphics. Pick a design, edit it, export it.',accent:'#2148e0',start:'caption',fmt:'16:9',
 css:`.w{display:inline-block;will-change:filter,opacity}
.big{font-weight:900;letter-spacing:-.045em;line-height:.95}
.serif{font-family:'Playfair Display',Georgia,serif;font-style:italic;font-weight:900;letter-spacing:-.02em}
.sm{font-weight:500;font-size:34px;line-height:1.2}\n.tc *{color:var(--tc)!important}`,
 fontFiles:[{fam:'Inter',w:500,st:'normal',src:'/fonts/inter-500.woff2'},{fam:'Inter',w:600,st:'normal',src:'/fonts/inter-600.woff2'},{fam:'Inter',w:900,st:'normal',src:'/fonts/inter-900.woff2'},{fam:'Playfair Display',w:900,st:'italic',src:'/fonts/playfair-900i.woff2'},{fam:'Space Grotesk',w:500,st:'normal',src:'/fonts/spacegrotesk-500.woff2'},{fam:'Space Grotesk',w:700,st:'normal',src:'/fonts/spacegrotesk-700.woff2'},{fam:'DM Serif Display',w:400,st:'normal',src:'/fonts/dmserif-400.woff2'}]};
