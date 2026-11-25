// Skylight skill: premium 9:16 podcast-clip graphics (two-tier captions, light-paper animations, generated worlds)
const SKB={bg:'#0d0d11',white:'#eceef5',ink:'#16181e'},abs='position:absolute;';
const DM="'DM Sans',system-ui,sans-serif",IS="'Instrument Serif',Georgia,serif";
const mix=(a,b,k)=>{const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),x=p(a),y=p(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*k).toString(16).padStart(2,'0')).join('')};
const tones=a=>({b:a,d:mix(a,'#000000',.42),p:mix(a,'#ffffff',.82)});
const G={dur:6,speed:1,anim:'blur',font:'DM Sans',size:100,tcOn:false,tc:'#ffffff',bgOn:false,bg:'#0d0d11',grain:false,vig:false,fps:'30',res:'1080p'};
const FONTS={'DM Sans':DM};
const GF=[{k:'dur',l:'Duration (s)',t:'num',min:3,max:15,step:.5},{k:'speed',l:'Animation speed',t:'num',min:.5,max:2,step:.1},{k:'size',l:'Overall scale %',t:'num',min:60,max:140,step:5},
 {k:'bgOn',l:'Custom background',t:'chk'},{k:'bg',l:'Background colour',t:'color'},{k:'grain',l:'Paper / halftone grain',t:'chk'},{k:'vig',l:'Vignette',t:'chk'},
 {k:'fps',l:'Frame rate',t:'sel',o:['24','30','60']},{k:'res',l:'Export size',t:'sel',o:['720p','1080p']}];
const sgf=v=>({k:'ground',l:'Scene',t:'sel',o:['a-roll','white','black'],v});
const CAPF={k:'cap',l:'Caption (lead / !!special / small)',h:'Split tiers with /. ! = bold, !! = special (add g, w or p for glitch, write, pop). [box] highlights, {pill} makes a pill.'};

function scene(g,W,H){const v=H>W;
 if(g=='white')return {bg:SKB.white,ink:'dark',extra:''};
 if(g=='black')return {bg:SKB.bg,ink:'light',extra:''};
 const fh=H*(v?.34:.5),cx=W/2,cy=H*(v?.24:.3);
 return {bg:SKB.bg,ink:'light',extra:`<div style="${abs}inset:0;background:radial-gradient(ellipse at 50% 25%,#2a2f3b 0%,${SKB.bg} 75%)"></div><div style="${abs}left:${cx-W*.42}px;top:${cy+fh*.45}px;width:${W*.84}px;height:${H}px;border-radius:50% 50% 0 0;background:#1b1e27"></div><div style="${abs}left:${cx-fh*.36}px;top:${cy-fh*.5}px;width:${fh*.72}px;height:${fh}px;border-radius:50%;background:#262b38"></div><div style="${abs}inset:0;background:linear-gradient(transparent 50%,rgba(0,0,0,.78))"></div>`}}

function cap(txt,o,t,W,H){
 const v=H>W,base=v?H:H*1.45,dark=o.ink=='dark',col=dark?SKB.ink:'#fff',tn=tones(o.a),sf=o.font=='serif',pace=o.pace||.18;
 const tiers=txt.split('/').map(s=>s.trim()).filter(Boolean).slice(0,4);let k=0;
 const rows=tiers.map((tr,ti)=>{let kind='p',eff=o.sp||'blur',m=tr.match(/^(!!?)([gwp])?\s*/);
  if(m&&m[0]){kind=m[1]=='!!'?'s':'b';if(m[2])eff={g:'glitch',w:'write',p:'pop'}[m[2]];tr=tr.slice(m[0].length)}
  const sz=kind=='s'?base*.088:kind=='b'?base*.065:base*(ti>=2?.027:.035),fam=kind=='s'&&sf?IS:DM,wt=kind=='p'?300:(kind=='s'&&sf?400:700);
  const c2=kind=='s'&&!dark?mix('#ffffff',tn.p,.55):col;
  const html=(tr.match(/\[[^\]]+\]|\{[^}]+\}|\S+/g)||[]).map(tk=>{const on=(o.start||0)+.25+(k++)*pace,e=ease((t-on)/.28);
   if(tk[0]=='[')return `<span style="display:inline-block;position:relative;margin-right:.3em"><span style="${abs}inset:-.04em -.2em;background:${tn.b};transform-origin:left;transform:scaleX(${ease((t-on)/.4).toFixed(3)})"></span><span style="position:relative;color:#fff;font-weight:700;opacity:${clamp(e*3).toFixed(2)}">${esc(tk.slice(1,-1))}</span></span> `;
   if(tk[0]=='{')return `<span style="display:inline-block;padding:.02em .5em .08em;margin-right:.3em;border-radius:99px;background:${tn.d};border:2px solid ${tn.p};color:#fff;font-weight:600;font-size:.7em;transform:scale(${(.7+.3*e).toFixed(3)});opacity:${e.toFixed(2)}">${esc(tk.slice(1,-1))}</span> `;
   if(kind=='s'&&eff=='glitch')return `<span style="display:inline-block;white-space:nowrap;margin-right:.22em">`+[...tk].map((c,i)=>{const x=t-(on+i*.035),vis=x>=0,j=vis&&x<.12?((i*37)%11-5)*3:0;return `<span style="display:inline-block;opacity:${vis?(x<.05?.5:1):0};transform:translate(${j}px,${(j*-.4).toFixed(1)}px);color:${vis&&x<.12?tn.b:'inherit'}">${esc(c)}</span>`}).join('')+`</span>`;
   let st=`opacity:${e.toFixed(3)};filter:blur(${((1-e)*(kind=='s'?18:8)).toFixed(1)}px)`;
   if(kind=='s'&&eff=='write')st=`clip-path:inset(-10% ${((1-ease((t-on)/.5))*100).toFixed(1)}% -10% 0);opacity:${t>on?1:0}`;
   if(kind=='s'&&eff=='pop')st=`opacity:${e.toFixed(3)};transform:scale(${(1.35-.35*e).toFixed(3)})`;
   return `<span class="w" style="${st};margin-right:.22em">${esc(tk)}</span>`}).join('');
  return `<div style="font:${wt} ${sz.toFixed(1)}px/1.04 ${fam};letter-spacing:${kind=='p'?0:'-.025em'};color:${c2};margin-top:${ti?(sz*.12).toFixed(1):0}px">${html}</div>`});
 const pos=o.pos||'aroll',top={aroll:.65,top:.14,mid:.5,bottom:.82,low:.82}[pos]*H;
 return `<div style="${abs}left:${W*.07}px;width:${W*.86}px;top:${top}px;transform:translateY(-50%);text-align:${pos=='aroll'?'left':'center'}">${rows.join('')}</div>`}
const capOf=(p,sc,a,t,W,H,pos)=>cap(p.cap,{ink:sc.ink,pos,sp:'glitch',font:'sans',a,pace:.18},t,W,H);

const T={
caption:{name:'Two-tier caption',desc:'Thin lead-in, bold special word, on the speaker',
 fields:[{k:'text',l:'Caption (lead / !!special / small)',t:'area',h:CAPF.h,v:'and we couldn’t / !!shut it down / for a [month.]'},sgf('a-roll'),
  {k:'pos',l:'Position',t:'sel',o:['aroll','top','mid','bottom'],v:'aroll'},{k:'special',l:'Special word effect',t:'sel',o:['glitch','blur','write','pop'],v:'glitch'},
  {k:'font',l:'Special font',t:'sel',o:['sans','serif'],v:'sans'},{k:'pace',l:'Word delay (s)',t:'num',min:.08,max:.4,step:.01,v:.18}],
 draw(p,t,a,W,H){const sc=scene(p.ground,W,H);return {bg:sc.bg,color:'#fff',html:sc.extra+cap(p.text,{ink:sc.ink,pos:p.pos,sp:p.special,font:p.font,pace:p.pace,a},t,W,H)}}},

namecard:{name:'Name card',desc:'Name, a rule that draws out, then the title',
 fields:[{k:'name',l:'Name',v:'Roman Yampolskiy'},{k:'title',l:'Title',v:'AI safety researcher'},{k:'side',l:'Side',t:'sel',o:['left','right'],v:'right'},sgf('a-roll')],
 draw(p,t,a,W,H){const sc=scene(p.ground,W,H),base=H>W?H:H*1.45,L=p.side=='left',col=sc.ink=='dark'?SKB.ink:'#fff',e1=ease((t-.3)/.35),e2=ease((t-1.1)/.35),rw=ease((t-.7)/.45)*W*.34;
  return {bg:sc.bg,color:col,html:sc.extra+`<div style="${abs}${L?'left':'right'}:${W*.07}px;bottom:${H*.09}px;text-align:${L?'left':'right'};color:${col}"><div style="font:700 ${base*.027}px/1.1 ${DM};opacity:${e1};filter:blur(${(1-e1)*8}px)">${esc(p.name)}</div><div style="height:2px;width:${rw}px;background:${col};margin:${base*.008}px 0 ${base*.008}px ${L?0:'auto'}"></div><div style="font:300 ${base*.019}px/1.2 ${DM};opacity:${e2};filter:blur(${(1-e2)*6}px)">${esc(p.title)}</div></div>`}}},

bars:{name:'Bars',desc:'Bars grow on the spoken word, light paper',
 fields:[{k:'cap',l:'Caption',h:CAPF.h,v:'the gap / !!keeps growing'},{k:'rows',l:'Bars (label: value)',t:'area',v:'2021: 20\n2022: 35\n2023: 60\n2024: 100'},sgf('white')],
 draw(p,t,a,W,H){const sc=scene(p.ground,W,H),tn=tones(a),r=p.rows.split('\n').map(x=>x.split(':')).filter(x=>x[0].trim()).slice(0,7).map(x=>[x[0].trim(),parseFloat(x[1])||0]),n=r.length,mx=Math.max(1,...r.map(x=>x[1])),x0=W*.1,sw=(W*.8)/n,y1=H*.82,hh=H*.46,col=sc.ink=='dark'?SKB.ink:'#fff';
  return {bg:sc.bg,color:col,html:sc.extra+capOf(p,sc,a,t,W,H,'top')+r.map((q,i)=>{const e=ease((t-.9-i*.45)/.5),h=q[1]/mx*hh*e,last=i==n-1;return `<div style="${abs}left:${x0+i*sw+sw*.19}px;width:${sw*.62}px;top:${y1-h}px;height:${h}px;background:${last?tn.b:tn.d};border-radius:${sw*.08}px ${sw*.08}px 0 0"></div><div style="${abs}left:${x0+i*sw}px;width:${sw}px;top:${y1-h-H*.035}px;text-align:center;font:700 ${H*.026}px ${DM};color:${col};opacity:${clamp(e*2)}">${Math.round(q[1]*e)}</div><div style="${abs}left:${x0+i*sw}px;width:${sw}px;top:${y1+H*.012}px;text-align:center;font:300 ${H*.022}px ${DM};color:${col}">${esc(q[0])}</div>`}).join('')}}},

line:{name:'Threshold line',desc:'A line climbs and crosses a threshold',
 fields:[{k:'cap',l:'Caption',h:CAPF.h,v:'until it / !!crosses / the line'},{k:'pts',l:'Values (comma separated)',v:'5, 12, 20, 38, 62, 90'},{k:'thr',l:'Threshold value',t:'num',min:1,max:200,step:1,v:50},{k:'tl',l:'Threshold label',v:'point of no return'},sgf('white')],
 draw(p,t,a,W,H){const sc=scene(p.ground,W,H),tn=tones(a),col=sc.ink=='dark'?SKB.ink:'#fff',vs=p.pts.split(/[,\s]+/).map(Number).filter(x=>!isNaN(x)).slice(0,10),n=Math.max(2,vs.length),mx=Math.max(...vs,+p.thr,1)*1.08,x0=W*.12,x1=W*.9,y0=H*.8,y1=H*.34,Y=v=>y0-(y0-y1)*v/mx,P=vs.map((v,i)=>[x0+(x1-x0)*i/(n-1),Y(v)]);
  const k=ease((t-.7)/2)*(n-1),s=Math.min(Math.floor(k),n-1),f=k-s,pts=P.slice(0,s+1);if(s<n-1)pts.push([P[s][0]+(P[s+1][0]-P[s][0])*f,P[s][1]+(P[s+1][1]-P[s][1])*f]);
  const crossed=vs[Math.min(s,n-1)]>=+p.thr&&s>0,ty=Y(+p.thr),te=ease((t-.5)/.4);
  return {bg:sc.bg,color:col,html:sc.extra+capOf(p,sc,a,t,W,H,'top')+`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="${abs}inset:0"><path d="M${x0} ${y1-20}V${y0}H${x1+10}" fill="none" stroke="${col}" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/><line x1="${x0}" x2="${x1}" y1="${ty}" y2="${ty}" stroke="${crossed?tn.b:col}" stroke-opacity="${(te*.8).toFixed(2)}" stroke-width="3" stroke-dasharray="14 12"/>${pts.length>1?`<polyline points="${pts.map(q=>q.map(z=>z.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${tn.b}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`:''}${pts.length?`<circle cx="${pts[pts.length-1][0]}" cy="${pts[pts.length-1][1]}" r="${crossed?18:12}" fill="${tn.b}"/>`:''}<text x="${x1}" y="${ty-16}" text-anchor="end" font-family="DM Sans" font-size="${H*.022}" font-weight="500" fill="${col}" opacity="${te}">${esc(p.tl)}</text></svg>`}}},

orbs:{name:'Orbs merge',desc:'Drifting orbs slide together and bloom into one',
 fields:[{k:'cap',l:'Caption',h:CAPF.h,v:'two things / !!become one'},{k:'labels',l:'Orb labels (separate with |)',v:'AI | Humans'},{k:'result',l:'Merged label',v:'together'},{k:'merge',l:'Merge at (s)',t:'num',min:1,max:5,step:.1,v:3},sgf('white')],
 draw(p,t,a,W,H){const sc=scene(p.ground,W,H),tn=tones(a),col=sc.ink=='dark'?SKB.ink:'#fff',ls=p.labels.split('|').map(x=>x.trim()).filter(Boolean).slice(0,3),n=ls.length,q=ease((t-p.merge)/.7),R=W*.15,cy=H*.52;
  const orb=(x,y,r,lab,op,bl)=>{const hr=r*(1.7+bl*1.2);return `<div style="${abs}left:${x-hr}px;top:${y-hr}px;width:${2*hr}px;height:${2*hr}px;border-radius:50%;background:radial-gradient(circle,${tn.b}66 0%,${tn.b}00 68%);opacity:${op}"></div><div style="${abs}left:${x-r}px;top:${y-r}px;width:${2*r}px;height:${2*r}px;border-radius:50%;background:radial-gradient(circle at 35% 30%,${tn.p} 0%,${tn.b} 55%,${tn.d} 100%);opacity:${op};display:flex;align-items:center;justify-content:center;font:700 ${r*.3}px ${DM};color:#fff">${esc(lab)}</div>`};
  const orbs=ls.map((l,i)=>{const bx=W/2+(i-(n-1)/2)*W*.36,x=bx+(W/2-bx)*q+Math.sin(t*.9+i*2)*W*.025*(1-q),y=cy+Math.cos(t*.7+i*1.7)*H*.02*(1-q),r=R*(1+.05*Math.sin(t*2+i));return orb(x,y,r,l,(1-q*.95).toFixed(2),0)}).join('');
  return {bg:sc.bg,color:col,html:sc.extra+capOf(p,sc,a,t,W,H,'top')+orbs+(q>0?orb(W/2,cy,R*(1+.45*q),p.result,q.toFixed(2),q):'')}}},

days:{name:'Days',desc:'Calendar or named tiles that light up',
 fields:[{k:'cap',l:'Caption',h:CAPF.h,v:'36 days / !!and counting'},{k:'mode',l:'Tiles',t:'sel',o:['calendar','named'],v:'calendar'},{k:'n',l:'Calendar days',t:'num',min:7,max:35,step:1,v:28},{k:'lit',l:'Days lit',t:'num',min:1,max:35,step:1,v:21},{k:'labels',l:'Named tiles (one per line)',t:'area',v:'Plan\nBuild\nShip\nRepeat'},sgf('white')],
 draw(p,t,a,W,H){const sc=scene(p.ground,W,H),tn=tones(a),col=sc.ink=='dark'?SKB.ink:'#fff',off=sc.ink=='dark'?'rgba(22,24,30,.09)':'rgba(255,255,255,.12)';let tiles='';
  if(p.mode=='calendar'){const n=Math.min(35,p.n),lit=Math.min(n,p.lit),cols=7,g=W*.018,sz=(W*.84-g*6)/7,x0=W*.08,y0=H*.34;
   for(let i=0;i<n;i++){const on=.8+i*(2/Math.max(1,lit)),on_=i<lit&&t>on,last=i==lit-1&&on_,e=ease((t-on)/.3);tiles+=`<div style="${abs}left:${x0+(i%cols)*(sz+g)}px;top:${y0+Math.floor(i/cols)*(sz+g)}px;width:${sz}px;height:${sz}px;border-radius:${sz*.2}px;background:${on_?(last?tn.b:tn.d):off};transform:scale(${i<lit?(.85+.15*e).toFixed(3):1});${last?`box-shadow:0 0 ${sz*.5}px ${tn.b}88`:''}"></div>`}}
  else{const ls=p.labels.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,6),h=H*.085;ls.forEach((l,i)=>{const e=ease((t-.8-i*.5)/.4);tiles+=`<div style="${abs}left:${W*.1}px;width:${W*.8}px;top:${H*.34+i*(h+H*.02)}px;height:${h}px;border-radius:${h*.28}px;background:${e>.5?tn.d:off};display:flex;align-items:center;padding-left:${W*.05}px;font:700 ${h*.38}px ${DM};color:${e>.5?'#fff':col};opacity:${(.5+.5*e).toFixed(2)}">${esc(l)}</div>`})}
  return {bg:sc.bg,color:col,html:sc.extra+capOf(p,sc,a,t,W,H,'top')+tiles}}},

world:{name:'World',desc:'An object floating in a generated place',
 fields:[{k:'cap',l:'Caption',h:CAPF.h,v:'36 hours / !!a day'},{k:'plate',l:'Place',t:'sel',o:['sky','sunset','night','studio','space','paper'],v:'sky'},{k:'obj',l:'Object (icon name)',h:ICH,v:'clock'},{k:'osz',l:'Object size',t:'num',min:160,max:560,step:10,v:360},
  {k:'enter',l:'Enters',t:'sel',o:['rise','drop','pop','fade'],v:'rise'},{k:'glow',l:'Glow',t:'chk',v:true},{k:'clouds',l:'Clouds',t:'chk',v:true},{k:'spark',l:'Sparkles',t:'chk',v:false}],
 draw(p,t,a,W,H){const tn=tones(a),PL={sky:'linear-gradient(#3f86e6 0%,#8fc3ff 55%,#eaf4ff 100%)',sunset:'linear-gradient(#2d1b4e 0%,#b0476b 45%,#ff9a5c 80%,#ffd9a0 100%)',night:'linear-gradient(#050818 0%,#10194a 70%,#1d2d7a 100%)',studio:'radial-gradient(ellipse at 50% 35%,#f1f1f5 0%,#b9bcc8 90%)',space:'radial-gradient(ellipse at 50% 40%,#161a45 0%,#05061a 80%)',paper:SKB.white},
  light=p.plate=='paper'||p.plate=='studio',col=light?tn.d:'#fff',e=ease((t-.4)/.7),o=p.osz,cx=W/2,cy=H*.4+Math.sin(t*1.8)*H*.012,rot=Math.sin(t*.9)*6;
  let tr=`translate(0,${(1-e)*H*.3}px)`,op=e,bl=(1-e)*12;if(p.enter=='drop')tr=`translate(0,${-(1-e)*H*.45}px)`;if(p.enter=='pop'){tr=`scale(${(.3+.7*e).toFixed(3)})`;bl=0}if(p.enter=='fade'){tr='none';bl=0}
  const cl=(i,sp,al,y)=>`<div style="${abs}left:${((i*W*.55+t*sp)%(W*1.7))-W*.35}px;top:${y}px;width:${W*.55}px;height:${H*.07}px;border-radius:50%;background:rgba(255,255,255,${al});filter:blur(18px)"></div>`;
  const back=p.clouds?[0,1,2].map(i=>cl(i,14,.6,H*(.52+(i%2)*.12))).join(''):'',front=p.clouds?[0,1,2].map(i=>cl(i+.4,34,.9,H*(.7+(i%2)*.1))).join(''):'';
  const sp=p.spark?Array.from({length:28},(_,i)=>`<div style="${abs}left:${(i*97%100)/100*W}px;top:${H-((t*(18+i*13%30)+(i*211)%H)%H)}px;width:${3+i%4}px;height:${3+i%4}px;border-radius:50%;background:#fff;box-shadow:0 0 12px #fff;opacity:${(.5+.5*Math.sin(t*3+i)).toFixed(2)}"></div>`).join(''):'';
  return {bg:PL[p.plate],color:'#fff',html:back+(p.glow?`<div style="${abs}left:${cx-o*.9}px;top:${cy-o*.9}px;width:${o*1.8}px;height:${o*1.8}px;border-radius:50%;background:radial-gradient(${tn.b}99,transparent 65%);opacity:${e}"></div>`:'')+`<div style="${abs}left:${cx-o/2}px;top:${cy-o/2}px;opacity:${op.toFixed(3)};filter:blur(${bl.toFixed(1)}px) drop-shadow(0 24px 30px rgba(0,0,0,.3));transform:${tr} rotate(${rot}deg)">${ic(p.obj,o,col,1.4)}</div>`+sp+front+(light?'':`<div style="${abs}inset:0;background:linear-gradient(transparent 58%,rgba(0,0,0,.55))"></div>`)+cap(p.cap,{ink:light?'dark':'light',pos:'bottom',sp:'glitch',font:'sans',a,pace:.18},t,W,H)}}},

callout:{name:'Callout',desc:'Selector box and a hand-drawn arrow on B-roll',
 fields:[{k:'cap',l:'Caption',h:CAPF.h,v:'the one / !!detail / nobody checks'},{k:'obj',l:'Target (icon name)',h:ICH,v:'eye'},{k:'tag',l:'Box label',v:'look here'}],
 draw(p,t,a,W,H){const tn=tones(a),o=W*.3,cx=W/2,cy=H*.36,e=ease((t-.9)/.4),bw=o*(1.7-.35*e),bx=cx-bw/2,by=cy-bw/2,Lg=bw*.2,fl=t<.9?(Math.sin(t*60)>0?1:.25):1,vis=ease((t-.5)/.1)*fl;
  const ax=W*.14,ay=H*.12,ex=bx-6,ey=by+bw*.1,qx=W*.1,qy=cy*.9,pr=ease((t-1.4)/.4),ang=Math.atan2(ey-qy,ex-qx),h=(d)=>`${(ex-Math.cos(ang+d)*34).toFixed(1)},${(ey-Math.sin(ang+d)*34).toFixed(1)}`;
  return {bg:'linear-gradient(135deg,#3a3f52,#1c1f2b)',color:'#fff',html:`<div style="${abs}inset:0;background:repeating-linear-gradient(45deg,rgba(255,255,255,.03) 0 6px,transparent 6px 14px)"></div><div style="${abs}left:${cx-o/2}px;top:${cy-o/2}px;opacity:.95">${ic(p.obj,o,'#fff',1.3)}</div>
  <svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="${abs}inset:0;opacity:${vis}"><path d="M${bx} ${by+Lg}V${by}H${bx+Lg}M${bx+bw-Lg} ${by}H${bx+bw}V${by+Lg}M${bx+bw} ${by+bw-Lg}V${by+bw}H${bx+bw-Lg}M${bx+Lg} ${by+bw}H${bx}V${by+bw-Lg}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><text x="${bx}" y="${by-14}" font-family="DM Sans" font-size="${H*.022}" font-weight="500" fill="#fff" opacity="${e}">${esc(p.tag)}</text></svg>
  <svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="${abs}inset:0"><path d="M${ax} ${ay}Q${qx-W*.08} ${qy} ${ex} ${ey}" pathLength="1" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="${(1-pr).toFixed(3)}"/>${pr>.92?`<polyline points="${h(.5)} ${ex},${ey} ${h(-.5)}" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`:''}</svg>
  <div style="${abs}inset:0;background:linear-gradient(transparent 58%,rgba(0,0,0,.6))"></div>`+cap(p.cap,{ink:'light',pos:'bottom',sp:'glitch',font:'sans',a,pace:.18},t,W,H)}}}
};
const SKILL={id:'skylight',name:'Skylight',tagline:'Premium 9:16 podcast-clip graphics: captions, light-paper animations, worlds.',accent:'#2a5cff',start:'caption',fmt:'9:16',
 css:`.w{display:inline-block}.tc *{color:var(--tc)!important}`,
 fontFiles:[{fam:'DM Sans',w:'100 1000',st:'normal',src:'/fonts/dmsans-var.woff2'},{fam:'Instrument Serif',w:400,st:'normal',src:'/fonts/instrumentserif-400.woff2'},{fam:'Instrument Serif',w:400,st:'italic',src:'/fonts/instrumentserif-400i.woff2'}]};
