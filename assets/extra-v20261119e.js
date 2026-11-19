(()=>{
/* Бегущая строка: кнопка паузы */
const tk=document.querySelector('.promo-ticker'),tb=tk&&tk.querySelector('.ticker-toggle');
if(tb){tb.addEventListener('click',()=>{const p=tk.classList.toggle('is-paused');tb.setAttribute('aria-pressed',String(p));tb.setAttribute('aria-label',p?'Запустить бегущую строку':'Остановить бегущую строку');const u=tb.querySelector('use');u&&u.setAttribute('href',p?'#i-play':'#i-pause')})}
const y=document.getElementById('year');if(y)y.textContent='2018';
/* Сцена шредера */
const svg=document.getElementById('shred-scene');if(!svg)return;
const NS='http://www.w3.org/2000/svg';
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const itemsG=svg.querySelector('#sh-items'),chipsG=svg.querySelector('#sh-chips'),cleats=svg.querySelector('#sh-cleats');
const machines=[svg.querySelector('#sh-machine'),svg.querySelector('#sh-machine2')];
const rotors=[...svg.querySelectorAll('.sh-rotor')],roller=svg.querySelector('.sh-roller');
const T={tower:{id:'it-tower',w:62,h:106,sh:30},monitor:{id:'it-monitor',w:104,h:90,sh:34},printer:{id:'it-printer',w:96,h:62,sh:46},laptop:{id:'it-laptop',w:100,h:64,sh:46},
fridge:{id:'it-fridge',w:80,h:153,sh:38},acin:{id:'it-acin',w:104,h:36,sh:48},acout:{id:'it-acout',w:96,h:72,sh:44},micro:{id:'it-micro',w:66,h:40,sh:31},
kettle:{id:'it-kettle',w:38,h:34,sh:14},coffee:{id:'it-coffee',w:36,h:54,sh:17},chair:{id:'it-chair',w:70,h:98,sh:30},stool:{id:'it-stool',w:50,h:84,sh:22},cabinet:{id:'it-cabinet',w:56,h:72,sh:24}};
const ORDER=['monitor','fridge','kettle','chair','printer','acout','micro','tower','cabinet','coffee','laptop','acin','stool','fridge','monitor','micro','chair','tower','kettle','acout','printer','cabinet','laptop','coffee','acin','stool'];
const BELT=221,PIVOT=446,SPEED=50,G=1350;
let items=[],k=0,belt=0,rot=0,rotV=120,shake=0,emit=0,emitX=575,last=0,run=true,raf=0;
function mk(type,x){const t=T[type],g=document.createElementNS(NS,'g'),s=document.createElementNS(NS,'ellipse'),u=document.createElementNS(NS,'use');
 s.setAttribute('rx',t.sh);s.setAttribute('ry','2.6');s.setAttribute('fill','#000');s.setAttribute('opacity','.45');u.setAttribute('href','#'+t.id);g.append(s,u);itemsG.appendChild(g);
 return{g,s,t,x,y:BELT,vx:SPEED,vy:0,r:0,vr:0,ph:Math.random()*6.28,falling:false}}
itemsG.textContent='';
[['tower',405],['fridge',318],['kettle',252],['chair',190],['acout',90],['laptop',-12]].forEach(([t,x])=>items.push(mk(t,x)));k=0;
const pool=[],COLORS=['#7c8885','#5c6965','#2f6a58','#c9ccca','#b07a3a','#1d2124','#3de0d0','#9aa5a1'];
for(let i=0;i<70;i++){const p=document.createElementNS(NS,'polygon');const a=1.5+Math.random()*3,b=1+Math.random()*2.5;
 p.setAttribute('points',`${-a},${-b} ${a},${-b*.6} ${a*.6},${b} ${-a*.8},${b*.7}`);p.setAttribute('fill',COLORS[i%COLORS.length]);p.style.display='none';chipsG.appendChild(p);pool.push({p,on:false})}
function chip(x,y,vx,vy,floor){const c=pool.find(c=>!c.on);if(!c)return;Object.assign(c,{on:true,x,y,vx,vy,r:Math.random()*360,vr:(Math.random()-.5)*900,floor});c.p.style.display=''}
function step(now){
 if(!run)return;const dt=Math.min(.05,(now-last)/1000||0);last=now;
 belt+=SPEED*dt;cleats.setAttribute('stroke-dashoffset',String(-belt));
 roller&&roller.setAttribute('transform',`rotate(${(belt/5.2*57.3)%360} 446 227.5)`);
 rotV+=((emit>0?210:120)-rotV)*Math.min(1,dt*3);rot+=rotV*dt;
 rotors[0]&&rotors[0].setAttribute('transform',`rotate(${rot%360} 538 354)`);
 rotors[1]&&rotors[1].setAttribute('transform',`rotate(${-rot%360} 604 354)`);
 // spawn
 const tail=items.filter(i=>!i.falling).reduce((m,i)=>Math.min(m,i.x-i.t.w/2),1e9);
 const nt=T[ORDER[k%ORDER.length]];
 if(tail>26){items.push(mk(ORDER[k%ORDER.length],-nt.w/2-12-Math.random()*20));k++}
 for(const it of items){
  if(!it.falling){it.x+=SPEED*dt;it.ph+=dt*9;it.y=BELT+Math.sin(it.ph)*.45;it.r=Math.sin(it.ph*.37)*.5;
   if(it.x>PIVOT-6){it.falling=true;it.vx=SPEED*1.6+it.t.w*.6;it.vy=10;it.vr=40}}
  else{it.vy+=G*dt;it.vr+=420*dt;it.x+=it.vx*dt;it.y+=it.vy*dt;it.r+=it.vr*dt;it.s.setAttribute('opacity','0');
   if(it.y-it.t.h/2-Math.hypot(it.t.w,it.t.h)/2>240)it.gone=true;
   if(it.y-it.t.h*.15>300&&!it.done){it.done=true;shake=.9;emit=1;emitX=530+Math.random()*90;
    for(let i=0;i<6;i++)chip(it.x+20+Math.random()*60,228,(Math.random()-.5)*120,-150-Math.random()*130,232)}}
  it.g.setAttribute('transform',`translate(${it.x.toFixed(2)} ${it.y.toFixed(2)}) rotate(${it.r.toFixed(2)} 0 ${-it.t.h/2})`)}
 items=items.filter(it=>{if(it.gone){it.g.remove();return false}return true});
 if(emit>0){emit-=dt*.9;const n=Math.random()<dt*55?2:0;for(let i=0;i<n;i++)chip(emitX-30+Math.random()*80,412,(Math.random()-.5)*50,30+Math.random()*80,440)}
 for(const c of pool){if(!c.on)continue;c.vy+=900*dt;c.x+=c.vx*dt;c.y+=c.vy*dt;c.r+=c.vr*dt;
  if(c.vy>0&&c.y>c.floor){c.on=false;c.p.style.display='none';continue}
  c.p.setAttribute('transform',`translate(${c.x.toFixed(1)} ${c.y.toFixed(1)}) rotate(${c.r.toFixed(0)})`)}
 if(shake>0){shake=Math.max(0,shake-dt);const a=shake/.9;const tx=(Math.sin(now*.09)*.7*a).toFixed(2),ty=(Math.cos(now*.07)*.45*a).toFixed(2);machines.forEach(m=>m&&m.setAttribute('transform',`translate(${tx} ${ty})`))}
 raf=requestAnimationFrame(step)}
function start(){if(run&&raf)return;run=true;last=performance.now();raf=requestAnimationFrame(step)}
function stop(){run=false;cancelAnimationFrame(raf);raf=0}
let vis=true;
if('IntersectionObserver'in window){new IntersectionObserver(e=>{vis=e[0].isIntersecting;vis&&!document.hidden?start():stop()}).observe(svg)}
document.addEventListener('visibilitychange',()=>{document.hidden?stop():vis&&start()});
start();
})();
(()=>{const d=document.getElementById('chat-dock'),cta=document.querySelector('.hero-cta');if(!d||!cta||!('IntersectionObserver'in window))return;
const mq=window.matchMedia('(max-width: 720px)');let on=false;
new IntersectionObserver(e=>{on=e[0].isIntersecting;d.classList.toggle('is-tucked',on&&mq.matches)},{rootMargin:'0px 0px 80px 0px'}).observe(cta);
mq.addEventListener&&mq.addEventListener('change',()=>d.classList.toggle('is-tucked',on&&mq.matches))})();

(()=>{
/* Отправка заявок: Telegram + FormSubmit (почта), без почтового клиента */
const F=document.getElementById('callback-form');if(!F)return;
const ST=document.getElementById('form-status'),BTN=F.querySelector('button[type="submit"]');
const P=["857921219", "1De5EAA:4", "RAjI10sM0", "JJfFcGLga", "NRhiW2AQR", "M"];const TK=P.map(x=>x.split('').reverse().join('')).join('');
const CHAT='7840685309',MAIL='https://formsubmit.co/ajax/sborregion@yandex.ru',PHONE='+7 (937) 182-50-00';
const KEY='vega_lead_ts';
function msg(t,err){if(!ST)return;ST.hidden=!1;ST.classList.toggle('is-error',!!err);ST.textContent=t}
function now(){try{return new Intl.DateTimeFormat('ru-RU',{timeZone:'Europe/Samara',dateStyle:'short',timeStyle:'short'}).format(new Date())+' (Самара)'}catch(e){return new Date().toISOString()}}
function digits(v){let d=String(v||'').replace(/\D/g,'');if(d.startsWith('8'))d='7'+d.slice(1);if(d&&!d.startsWith('7'))d='7'+d;return d.slice(0,11)}
function tg(d){const text=['📞 Новая заявка с сайта sbor-region.ru','','Имя: '+d.name,'Телефон: +'+d.tel+' ('+d.phone+')','Удобное время: '+(d.time||'—'),'Комментарий: '+(d.comment||'—'),'','Источник: '+d.source,'Дата и время: '+d.when].join('\n');
 const b=new URLSearchParams({chat_id:CHAT,text,disable_web_page_preview:'true'});
 return fetch('https://api.telegram.org/bot'+TK+'/sendMessage',{method:'POST',body:b}).then(r=>r.json()).then(j=>{if(!j.ok)throw Error('tg');return j})}
function mail(d){return fetch(MAIL,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({'Имя':d.name,'Телефон':d.phone,'Удобное время':d.time||'—','Комментарий':d.comment||'—','Источник':d.source,'Дата и время':d.when,_subject:'Заявка на звонок — ВЕГА',_template:'table',_captcha:'false'})}).then(r=>r.json()).then(j=>{if(!(j.success===true||j.success==='true'))throw Error('mail:'+(j.message||''));return j})}
function icon(n){return '<svg class="ic" aria-hidden="true" focusable="false"><use href="#i-'+n+'"/></svg>'}
function done(){const box=document.createElement('div');box.className='form-result form-result--ok';box.setAttribute('role','status');box.tabIndex=-1;
 box.innerHTML='<span class="form-result-ic">'+icon('check-circle')+'</span><h4>Спасибо! Заявка принята</h4><p>Перезвоним в ближайшее время. Если вопрос срочный — звоните: <a href="tel:+79371825000">'+PHONE+'</a></p><button type="button" class="btn btn-secondary btn-sm">Отправить ещё одну заявку</button>';
 F.hidden=!0;F.after(box);box.focus({preventScroll:!0});box.scrollIntoView({block:'center',behavior:'smooth'});
 box.querySelector('button').addEventListener('click',()=>{box.remove();F.reset();F.hidden=!1;ST&&(ST.hidden=!0)})}
function fail(){if(!ST)return;ST.hidden=!1;ST.classList.add('is-error');ST.innerHTML='';const w=document.createElement('div');w.className='form-fail';
 w.innerHTML='<p>'+icon('alert')+' Не удалось отправить заявку. Позвоните нам: <a href="tel:+79371825000"><b>'+PHONE+'</b></a> или напишите в мессенджер:</p><div class="form-fail-actions"><a class="btn btn-tg btn-sm" href="https://t.me/Sbor163" target="_blank" rel="noopener noreferrer">'+icon('telegram')+'Telegram</a><a class="btn btn-max btn-sm" href="https://max.ru/u/f9LHodD0cOJhTyeif9vHuZFb9ZZM55hiYiT4rAvGvWeXcsyK72ipQbrWw3I" target="_blank" rel="noopener noreferrer">'+icon('max')+'Max</a></div>';ST.appendChild(w)}
F.addEventListener('submit',async e=>{e.preventDefault();e.stopImmediatePropagation();
 const fd=new FormData(F);if(String(fd.get('website')||'').trim()){done();return}
 const name=String(fd.get('name')||'').trim(),phone=String(fd.get('phone')||'').trim(),time=String(fd.get('time')||'').trim(),comment=String(fd.get('comment')||'').trim();
 const tel=digits(phone);
 F.querySelectorAll('[aria-invalid]').forEach(x=>x.removeAttribute('aria-invalid'));
 if(name.length<2){F.elements.name.setAttribute('aria-invalid','true');F.elements.name.focus();msg('Укажите, как к вам обращаться.',1);return}
 if(tel.length<11){F.elements.phone.setAttribute('aria-invalid','true');F.elements.phone.focus();msg('Укажите полный номер телефона: +7 (XXX) XXX-XX-XX.',1);return}
 if(F.elements.consent&&!F.elements.consent.checked){msg('Подтвердите согласие на обработку персональных данных.',1);return}
 let last=0;try{last=+localStorage.getItem(KEY)||0}catch(_){}
 if(Date.now()-last<30000){msg('Заявка уже отправлена. Повторно можно через '+Math.ceil((30000-(Date.now()-last))/1000)+' с.',1);return}
 const d={name:name.slice(0,120),phone:phone.slice(0,40),tel,time:time.slice(0,120),comment:comment.slice(0,1500),source:'Форма «Заказать звонок», '+location.hostname+location.pathname,when:now()};
 const label=BTN?BTN.textContent:'';if(BTN){BTN.disabled=!0;BTN.textContent='Отправляем…'}ST&&(ST.hidden=!0);
 const res=await Promise.allSettled([tg(d),mail(d)]);
 window.__leadResult=res.map(r=>r.status==='fulfilled'?'ok':String(r.reason&&r.reason.message||r.reason));
 if(BTN){BTN.disabled=!1;BTN.textContent=label}
 if(res.some(r=>r.status==='fulfilled')){try{localStorage.setItem(KEY,String(Date.now()))}catch(_){}try{window.ym&&ym(114349653,'reachGoal','lead')}catch(_){}done()}else fail()},!0);
})();
