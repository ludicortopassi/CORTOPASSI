document.querySelectorAll('[data-filter]').forEach(button => {
 button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  let count = 0;
  document.querySelectorAll('[data-category]').forEach(card => {
   card.hidden = selected !== 'Todos' && !card.dataset.category.split('|').includes(selected);
   if (!card.hidden) count++;
  });
  document.querySelector('#project-count').textContent = String(count).padStart(2,'0') + (document.documentElement.lang === 'en' ? (count === 1 ? ' project' : ' projects') : (count === 1 ? ' projeto' : ' projetos'));
 });
});
(() => {
 const view=document.querySelector('.frame-viewport');if(!view)return;
 const track=view.querySelector('.frame-track'),cards=[...track.children];
 const previous=document.querySelector('#frames-prev'),next=document.querySelector('#frames-next');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let x=0,target=0,raf=0,active=false,moved=false,start=0,origin=0,last=0,lastTime=0,velocity=0,pointer=null;
 function center(i){return view.clientWidth/2-cards[i].offsetLeft-cards[i].offsetWidth/2}
 function limit(value){return Math.max(center(cards.length-1),Math.min(center(0),value))}
 function paint(){track.style.setProperty('--frame-x',x+'px');previous.disabled=target>=center(0)-1;next.disabled=target<=center(cards.length-1)+1}
 let frameTime=0;
 function tick(time){const dt=Math.min(40,time-(frameTime||time-16));frameTime=time;x+=(target-x)*(1-Math.exp(-dt/95));if(Math.abs(target-x)<.25){x=target;raf=0;frameTime=0;paint();return}paint();raf=requestAnimationFrame(tick)}
 function glide(value){target=limit(value);if(reduce.matches){cancelAnimationFrame(raf);raf=0;x=target;paint()}else if(!raf){frameTime=0;raf=requestAnimationFrame(tick)}}
 function nearest(value){let best=0;cards.forEach((_,i)=>{if(Math.abs(center(i)-value)<Math.abs(center(best)-value))best=i});return best}
 function step(direction){glide(center(Math.max(0,Math.min(cards.length-1,nearest(target)+direction))))}
 x=target=center(0);paint();
 view.addEventListener('pointerdown',e=>{if(e.button!==0||active)return;cancelAnimationFrame(raf);raf=0;frameTime=0;active=true;moved=false;pointer=e.pointerId;start=last=e.clientX;origin=x;target=x;lastTime=performance.now();velocity=0;view.classList.add('dragging')});
 view.addEventListener('pointermove',e=>{if(!active||e.pointerId!==pointer)return;const delta=e.clientX-start;if(!moved&&Math.abs(delta)<6)return;moved=true;view.setPointerCapture(pointer);const now=performance.now();velocity=.65*velocity+.35*(e.clientX-last)/Math.max(1,now-lastTime);last=e.clientX;lastTime=now;x=target=limit(origin+delta);paint()});
 function finish(cancelled=false){if(!active)return;active=false;view.classList.remove('dragging');const momentum=performance.now()-lastTime>100?0:velocity*230;glide(x+(cancelled||reduce.matches?0:momentum))}
 view.addEventListener('pointerup',()=>finish());view.addEventListener('pointercancel',()=>finish(true));view.addEventListener('lostpointercapture',()=>finish(true));
 window.addEventListener('pointerup',()=>finish());
 view.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
 view.addEventListener('focusin',e=>{if(active)return;const i=cards.indexOf(e.target.closest('.feature-frame'));if(i>=0)glide(center(i))});
 view.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();step(e.key==='ArrowRight'?1:-1)}});
 previous.onclick=()=>step(-1);next.onclick=()=>step(1);
 new ResizeObserver(()=>{glide(limit(target))}).observe(view);
 const preview=document.querySelector('.opening-video');
 if(preview){
  preview.muted=true;
  if(reduce.matches){preview.autoplay=false;preview.pause();}
  else {new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)preview.play().catch(()=>{});else preview.pause()})},{threshold:.15}).observe(preview);}
 }
 const video=document.querySelector('#showcase-video'),source=window.showcaseConfig?.video;
 if(source && video){video.src=source;video.hidden=false;video.autoplay=!reduce.matches;video.addEventListener('error',()=>video.hidden=true);if(!reduce.matches)video.play().catch(()=>{});}
})();

(() => {
 const headerElement=document.querySelector('header');
 if(headerElement){const measureHeader=()=>document.documentElement.style.setProperty('--header-height',headerElement.getBoundingClientRect().height+'px');new ResizeObserver(measureHeader).observe(headerElement);measureHeader();}
 const section=document.querySelector('.opening-scroll');if(!section)return;
 const header=document.querySelector('header'),film=section.querySelector('.film-layer'),gallery=section.querySelector('.highlights-layer'),video=section.querySelector('video'),pause=section.querySelector('.film-pause');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),compact=matchMedia('(max-height: 600px)');let pending=false,userPaused=reduced.matches;
 function update(){pending=false;const h=header.getBoundingClientRect().height;document.documentElement.style.setProperty('--header-height',h+'px');
 const span=section.offsetHeight-(innerHeight-h);const raw=Math.max(0,Math.min(1,(h-section.getBoundingClientRect().top)/Math.max(1,span)));
 const t=(reduced.matches||compact.matches)?0:Math.max(0,Math.min(1,raw/.7));const smooth=t*t*(3-2*t);
 section.style.setProperty('--reveal',smooth);section.style.setProperty('--film-blur',(smooth*16)+'px');
 gallery.inert=!reduced.matches&&!compact.matches&&t<.15;film.inert=!reduced.matches&&t>.85;
 const visible=section.getBoundingClientRect().bottom>h&&section.getBoundingClientRect().top<innerHeight;
 if(userPaused||!visible||(!reduced.matches&&t>.9))video.pause();else video.play().catch(()=>{});
 }
 function request(){if(!pending){pending=true;requestAnimationFrame(update)}}
 pause.onclick=()=>{userPaused=!userPaused;pause.textContent=document.documentElement.lang === 'en' ? (userPaused?'Play video ▷':'Pause video Ⅱ') : (userPaused?'Reproduzir vídeo ▷':'Pausar vídeo Ⅱ');pause.setAttribute('aria-label',document.documentElement.lang === 'en' ? (userPaused?'Play video':'Pause video') : (userPaused?'Reproduzir vídeo':'Pausar vídeo'));update()};
 section.querySelector('.opening-cue').onclick=e=>{if(reduced.matches||compact.matches)return;e.preventDefault();const h=header.offsetHeight;const top=scrollY+section.getBoundingClientRect().top-h+(section.offsetHeight-innerHeight+h)*.8;window.scrollTo({top,behavior:'smooth'})};
 window.addEventListener('scroll',request,{passive:true});window.addEventListener('resize',request);reduced.addEventListener('change',request);compact.addEventListener('change',request);new ResizeObserver(request).observe(header);update();
})();
