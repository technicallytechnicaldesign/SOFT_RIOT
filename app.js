import { sections, pieces, counts, activeAudience } from './catalog.js?v=20260920-soft-riot';

const $ = (selector) => document.querySelector(selector);
const figureModes = {
  adult: {
    asset: './assets/figure/cyber-goth-mannequin-base-v2.png',
    label: 'ADULT',
  },
  youngling: {
    asset: './assets/figure/cyber-goth-youngling-base-v1.png',
    label: 'YOUNGLINGS',
  },
};
const figureMode = activeAudience;
const selected = sections.map(() => 0);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduced.matches;
const routeOf = () => figureMode === 'youngling' ? 'flipbook' : location.hash === '#flipbook' ? 'flipbook' : location.hash === '#closet' ? 'closet' : 'wardrobe';
let route = routeOf();
let sceneWake = () => {};
const turns = new Map();
const gallery = $('#wardrobe-grid');
const pieceFor = (row) => pieces.find(p => p.row === row && p.variant === selected[row]);
const pad2 = (n) => String(n).padStart(2, '0');
const loadImage = (p) => new Promise(resolve => { const i = new Image(); i.onload = () => { p.img = i; resolve(i); }; i.onerror = () => resolve(null); i.src = p.asset; });
// Every garment is a transparent cutout, so thumbnails simply contain it.
function fitThumbnail(el, p) {
  el.style.backgroundImage = `url('${p.asset}')`;
  el.style.backgroundSize = 'contain';
  el.style.backgroundPosition = 'center';
}
const hangerCount = pieces.filter(p => p.row < 3).length;
const drawerCount = pieces.filter(p => p.row === 3).length;
const lookTotal = counts.reduce((n, c) => n * Math.max(1, c), 1);
$('#count-wardrobe').textContent = pieces.length;
$('#count-closet').textContent = hangerCount;
$('#count-pieces').textContent = `${pieces.length} PIECES`;
$('#count-range').textContent = `01—${pad2(pieces.length)}`;
$('#closet-lede').textContent = `${hangerCount} knits on hangers. Drag or scroll between them, or use the arrows. Pull the drawer for extras.`;
$('#count-drawer').textContent = drawerCount;
$('#look-total').textContent = `OF ${lookTotal.toLocaleString('en-GB')} POSSIBLE MUTATIONS`;

// One real button per garment keeps the WebGL wardrobe usable by keyboard,
// screen readers and browsers without WebGL.
const cardEntries = [...pieces].sort((a,b) => a.variant-b.variant || a.row-b.row).map((p, i) => {
  const button = document.createElement('button');
  button.className = 'piece-card';
  button.dataset.piece = p.id;
  button.style.setProperty('--tilt', `${[-1.8,1.2,-1.2,1.8][i%4]}deg`);
  button.setAttribute('aria-label', `Wear ${p.name}, ${sections[p.row].label}`);
  button.innerHTML = `<div class="card-art"><div class="card-image"></div><div class="card-top"><span>${pad2(i+1)} / ${sections[p.row].short}</span><span class="worn">↗</span></div><span class="card-arrow" aria-hidden="true">↗</span></div><div class="card-caption"><strong>${p.name}</strong><small>${sections[p.row].label}</small></div>`;
  button.addEventListener('click', () => { choose(p.row,p.variant,false); location.hash = 'flipbook'; });
  gallery.append(button);
  return { p, button, art: button.querySelector('.card-art'), image: button.querySelector('.card-image'), index:i };
});

// The closet: a horizontal rail of hangers for the hairpiece/top/bottoms
// pieces, plus a pull-out drawer for the accessory row. Wearing a piece from
// either uses the same choose() path as the wardrobe grid and the flipbook.
const railTrack = $('#rail-track');
const drawerTray = $('#drawer-tray');
const drawerHandle = $('#drawer-handle');
const hangerEntries = pieces.filter(p => p.row < 3).map(p => {
  const hanger = document.createElement('button');
  hanger.className = 'hanger';
  hanger.dataset.piece = p.id;
  hanger.setAttribute('aria-label', `Wear ${p.name}, ${sections[p.row].label}`);
  hanger.innerHTML = `<div class="hanger-rig"><span class="hook" aria-hidden="true"></span><span class="hanger-bar" aria-hidden="true"></span><div class="garment-window"><span class="garment-image"></span></div></div><span class="hanger-caption"><strong>${p.name}</strong><small>${sections[p.row].label}</small></span>`;
  hanger.addEventListener('click', () => { if (!railTrack.dragged) choose(p.row, p.variant, false); });
  railTrack.append(hanger);
  return { p, hanger, image: hanger.querySelector('.garment-image') };
});
// Accessories live in the drawer, not on the rail.
const drawerEntries = pieces.filter(p => p.row === 3).map(p => {
  const item = document.createElement('button');
  item.className = 'drawer-item';
  item.dataset.piece = p.id;
  item.setAttribute('aria-label', `Wear ${p.name}, ${sections[p.row].label}`);
  item.innerHTML = `<div class="drawer-art"><span class="garment-image"></span></div><span class="drawer-caption">${p.name}</span>`;
  item.addEventListener('click', () => choose(p.row, p.variant, false));
  drawerTray.append(item);
  return { p, item, image: item.querySelector('.garment-image') };
});
function refitCloset() {
  hangerEntries.forEach(({ image, p }) => fitThumbnail(image, p));
  if (!drawerTray.hidden) drawerEntries.forEach(({ image, p }) => fitThumbnail(image, p));
}
function markCloset() {
  hangerEntries.forEach(({ p, hanger }) => hanger.classList.toggle('is-worn', selected[p.row] === p.variant));
  drawerEntries.forEach(({ p, item }) => item.classList.toggle('is-worn', selected[p.row] === p.variant));
}
drawerHandle.addEventListener('click', () => {
  const opening = drawerTray.hidden;
  drawerTray.hidden = !opening;
  drawerHandle.setAttribute('aria-expanded', String(opening));
  if (opening) requestAnimationFrame(() => drawerEntries.forEach(({ image, p }) => fitThumbnail(image, p)));
});
railTrack.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { railTrack.scrollBy({ left: 200, behavior: 'smooth' }); e.preventDefault(); }
  if (e.key === 'ArrowLeft') { railTrack.scrollBy({ left: -200, behavior: 'smooth' }); e.preventDefault(); }
});
$('.rail-prev').addEventListener('click', () => railTrack.scrollBy({ left: -220, behavior: 'smooth' }));
$('.rail-next').addEventListener('click', () => railTrack.scrollBy({ left: 220, behavior: 'smooth' }));
// Drag-to-scroll for mouse/trackpad; touch already scrolls the rail natively.
let railDown = false, railStartX = 0, railStartScroll = 0;
railTrack.addEventListener('pointerdown', e => {
  if (e.pointerType === 'touch') return;
  railDown = true; railTrack.dragged = false; railStartX = e.clientX; railStartScroll = railTrack.scrollLeft;
  railTrack.classList.add('dragging'); railTrack.setPointerCapture(e.pointerId);
});
railTrack.addEventListener('pointermove', e => {
  if (!railDown) return;
  const dx = e.clientX - railStartX;
  if (Math.abs(dx) > 4) railTrack.dragged = true;
  railTrack.scrollLeft = railStartScroll - dx;
});
function releaseRail() { railDown = false; railTrack.classList.remove('dragging'); }
railTrack.addEventListener('pointerup', releaseRail);
railTrack.addEventListener('pointercancel', releaseRail);
new ResizeObserver(refitCloset).observe(railTrack);

// The flipbook figure: a rendered featureless neon-black mannequin with one layered garment per section.
// Each garment is placed from its fit (garments.json): x,y are its centre as a fraction of the figure
// box (width 1, height 2), w is its width as a fraction of the figure width, z is the layer order.
const figureEl = $('#figure');
figureEl.insertAdjacentHTML('beforeend', `<img class="figure-avatar" alt="" aria-hidden="true">`);
const avatar = figureEl.querySelector('.figure-avatar');
function applyFigureMode() {
  const isYoungling = figureMode === 'youngling';
  const model = figureModes[figureMode];
  document.body.classList.toggle('youngling-mode', isYoungling);
  avatar.src = model.asset;
  figureEl.setAttribute('aria-label', isYoungling ? 'Youngling mannequin ready for knit layers' : 'Current adult outfit');
  document.querySelectorAll('[data-figure-mode]').forEach(button => {
    const isCurrent = button.dataset.figureMode === figureMode;
    button.setAttribute('aria-pressed', String(isCurrent));
    button.classList.toggle('is-active', isCurrent);
  });
  $('#flipbook-eyebrow').textContent = isYoungling ? 'THE YOUNGLING FITTING BAY' : 'THE FITTING EXPERIMENT';
  $('#flipbook-title').innerHTML = isYoungling ? 'SMALL<br><span>RIOT.</span>' : 'ALTER<br><span>EGO.</span>';
  $('#flip-note').innerHTML = isYoungling ? 'Tiny fits.<br>Maximum volume.' : 'Four parts.<br>No correct combination.';
  $('#specimen').textContent = isYoungling ? 'NEON SPROUT' : 'BLUE DEVIL';
  $('#stage-instruction').textContent = isYoungling ? 'YOUTH LAYERS ONLY' : '↔ FLIP EACH SECTION';
  $('#stage-footer').textContent = isYoungling ? 'YOUNGLING CHAOS / STAGING' : 'HANDMADE / REASSEMBLED';
  $('#youngling-callout').hidden = !isYoungling;
  $('#adult-outfit-panel').hidden = isYoungling;
  $('#youngling-panel').hidden = !isYoungling;
  if (isYoungling) {
    $('#look-number').textContent = '001';
    $('#look-total').textContent = 'READY FOR FIRST KNIT';
  }
}
document.querySelectorAll('[data-figure-mode]').forEach(button => button.addEventListener('click', () => {
  const next = button.dataset.figureMode;
  if (!figureModes[next] || next === figureMode) return;
  localStorage.setItem('soft-riot-audience', next);
  location.hash = 'flipbook';
  location.reload();
}));
applyFigureMode();
function placeLayer(el, fit) {
  el.style.left = `${fit.x * 100}%`;
  el.style.top = `${fit.y * 100}%`;
  el.style.width = `${fit.w * 100}%`;
  el.style.zIndex = String(fit.z);
  el.style.transform = `translate(-50%,-50%) rotate(${fit.rot || 0}deg) scaleX(${fit.flip ? -1 : 1})`;
}
const layers = sections.map((s, row) => {
  const el = document.createElement('button');
  el.className = 'garment';
  const img = new Image();
  img.alt = '';
  img.draggable = false;
  el.append(img);
  el.addEventListener('click', () => { if (!el.swiped) step(row, 1); });
  let startX = 0, startY = 0;
  el.addEventListener('pointerdown', e => { startX = e.clientX; startY = e.clientY; el.swiped = false; });
  el.addEventListener('pointerup', e => {
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) { el.swiped = true; step(row, dx < 0 ? 1 : -1); setTimeout(() => el.swiped = false, 350); }
  });
  figureEl.append(el);
  return { el, img };
});
const controls = sections.map((s,row) => {
  const control = document.createElement('div');
  control.className = 'outfit-control';
  control.innerHTML = `<div class="control-label"><span>0${row+1} / ${s.label}</span><span class="piece-count"></span></div><div class="control-main"><div><h3></h3><p></p></div><div class="arrows"><button aria-label="Previous ${s.label.toLowerCase()}">←</button><button aria-label="Next ${s.label.toLowerCase()}">→</button></div></div>`;
  const arrows=control.querySelectorAll('button');
  arrows[0].addEventListener('click',()=>step(row,-1));arrows[1].addEventListener('click',()=>step(row,1));
  $('#outfit-controls').append(control);
  return control;
});
function renderSelection(row) {
  const p=pieceFor(row),{el,img}=layers[row],control=controls[row];
  if (!p) {
    el.hidden = true;
    control.hidden = true;
    return;
  }
  el.hidden = false;
  control.hidden = false;
  img.src=p.asset;
  placeLayer(el,p.fit);
  el.setAttribute('aria-label',`${sections[row].label}: ${p.name}. Click or swipe to change.`);
  control.querySelector('h3').textContent=p.name;
  control.querySelector('p').textContent=p.description;
  control.querySelector('.piece-count').textContent=`${pad2(p.variant+1)} / ${pad2(counts[row])}`;
  $('#look-number').textContent=String(selected.reduce((n,v,r)=>n*Math.max(1,counts[r])+v,0)+1).padStart(3,'0');
  $('#specimen').textContent=pieceFor(1).name.toUpperCase();
  cardEntries.forEach(({p,button})=>{
    const isSelected=selected[p.row]===p.variant;
    button.classList.toggle('is-selected',isSelected);
    button.querySelector('.worn').textContent=isSelected?'ON':'↗';
  });
  markCloset();
}
// A stationary next garment sits below a separate leaf hinged at its own left edge.
function finishTurn(row) {
  const turn=turns.get(row);
  if(turn){turns.delete(row);turn.animation.cancel();turn.leaf.remove();}
  renderSelection(row);
}
function choose(row,variant,animate=true,direction=1) {
  if (!counts[row]) return;
  if(!Number.isInteger(row)||row<0||row>=sections.length||!Number.isInteger(variant)||variant<0||variant>=counts[row])throw new Error('Unknown piece.');
  finishTurn(row);
  const oldP=pieceFor(row);
  selected[row]=variant;
  renderSelection(row);
  const newP=pieceFor(row);
  if(animate&&!paused&&oldP!==newP){
    const {el,img}=layers[row];
    const leafP=direction>0?oldP:newP;
    const leaf=document.createElement('div');
    leaf.className='turning-leaf';
    leaf.setAttribute('aria-hidden','true');
    const leafImg=new Image();leafImg.src=leafP.asset;leafImg.alt='';
    leaf.append(leafImg);
    placeLayer(leaf,leafP.fit);
    leaf.style.zIndex='60';
    // Going back closes the new leaf over the garment still visible underneath.
    if(direction<0){img.src=oldP.asset;placeLayer(el,oldP.fit);}
    figureEl.append(leaf);
    const base=`translate(-50%,-50%) rotate(${leafP.fit.rot||0}deg) scaleX(${leafP.fit.flip?-1:1})`;
    const frames=[
      {transform:`${base} rotateY(0deg)`,opacity:1},
      {transform:`${base} rotateY(-75deg)`,opacity:1,offset:.6},
      {transform:`${base} rotateY(-100deg)`,opacity:0}
    ];
    const animation=leaf.animate(frames,{duration:720,easing:'cubic-bezier(.3,.05,.2,1)',direction:direction>0?'normal':'reverse',fill:'both'});
    const turn={leaf,animation};
    turns.set(row,turn);
    animation.onfinish=()=>{if(turns.get(row)===turn)finishTurn(row);};
  }
  $('#announce').textContent=`${sections[row].label}: ${pieceFor(row).name}`;
}
function step(row,direction){if(counts[row]>1)choose(row,(selected[row]+direction+counts[row])%counts[row],true,direction);}
$('#shuffle').addEventListener('click',()=>{
  if (!counts.some(Boolean)) return;
  sections.forEach((_,row)=>{if(counts[row]>1)choose(row,(selected[row]+1+Math.floor(Math.random()*(counts[row]-1)))%counts[row]);});
  $('#announce').textContent='Outfit remixed. Four new pieces selected.';
});
function setPaused(value) {
  paused=value;
  document.body.classList.toggle('paused',paused);
  $('#motion').setAttribute('aria-pressed',String(paused));
  $('#motion').setAttribute('aria-label',paused?'Resume motion':'Pause motion');
  $('#motion').innerHTML=`<span aria-hidden="true">${paused?'▷':'Ⅱ'}</span><span class="motion-label">${paused?'Resume':'Pause'} motion</span>`;
  sections.forEach((_,row)=>finishTurn(row));
  sceneWake();
}
$('#motion').addEventListener('click',()=>setPaused(!paused));
reduced.addEventListener('change',e=>setPaused(e.matches));
function showRoute() {
  route=routeOf();
  $('#wardrobe').hidden=route!=='wardrobe';$('#closet').hidden=route!=='closet';$('#flipbook').hidden=route!=='flipbook';
  document.querySelectorAll('[data-route]').forEach(el=>{
    el.classList.toggle('active',el.dataset.route===route);
    if(el.dataset.route===route)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');
  });
  document.title=figureMode==='youngling'?'SOFT RIOT / younglings':route==='wardrobe'?'SOFT RIOT — the wardrobe':route==='closet'?'SOFT RIOT — the closet':'SOFT RIOT — the flipbook';
  if(route==='wardrobe')requestAnimationFrame(()=>{cardEntries.forEach(e=>fitThumbnail(e.image,e.p));sceneWake();});
  if(route==='closet')requestAnimationFrame(refitCloset);
  window.scrollTo({top:0,behavior:'instant'});
}
addEventListener('hashchange',showRoute);
// Render the default outfit (first piece in every section) once, so the flipbook and closet
// both show real garments on first visit instead of an empty figure/rail.
sections.forEach((_,row)=>{ if (counts[row]) choose(row,selected[row],false); });
setPaused(paused);showRoute();

// Three.js owns the floating, lit, textured garment planes. The semantic DOM
// remains underneath as a complete and functional fallback.
async function initWardrobe() {
  try {
    const THREE=await import('./vendor/three.module.js');
    await Promise.all(pieces.map(loadImage));
    if(pieces.some(p=>!p.img))throw new Error('A garment image failed to load');
    const canvas=$('#wardrobe-canvas');
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
    renderer.setClearColor(0x000000,0);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(35,1,.1,5000);
    camera.position.z=1000;
    scene.add(new THREE.AmbientLight(0xffffff,2.8));
    const light=new THREE.DirectionalLight(0xffffff,1.2);light.position.set(-200,300,500);scene.add(light);
    const geometry=new THREE.PlaneGeometry(1,1,8,8);
    let width=1,height=1,raf=0,last=0,elapsed=0,visible=true;
    const pointer={x:0,y:0};
    const meshes=cardEntries.map(entry=>{
      const surface=document.createElement('canvas');surface.width=640;surface.height=460;
      const ctx=surface.getContext('2d');
      const texture=new THREE.CanvasTexture(surface);texture.colorSpace=THREE.SRGBColorSpace;
      const material=new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide});
      const mesh=new THREE.Mesh(geometry,material);mesh.userData={entry,ctx,surface,texture,hover:false,x:0,y:0,tilt:parseFloat(entry.button.style.getPropertyValue('--tilt'))};
      scene.add(mesh);
      for(const [ev,val] of [['pointerenter',true],['pointerleave',false],['focus',true],['blur',false]])entry.button.addEventListener(ev,()=>{mesh.userData.hover=val;wake();});
      return mesh;
    });
    function layout() {
      if(route!=='wardrobe')return;
      const rect=gallery.getBoundingClientRect();width=rect.width;height=rect.height;
      if(!width||!height)return;
      renderer.setSize(width,height,false);
      camera.aspect=width/height;camera.fov=2*Math.atan(height/2/1000)*180/Math.PI;camera.updateProjectionMatrix();
      meshes.forEach(mesh=>{
        const d=mesh.userData,a=d.entry.art;
        // offsets are untransformed so the WebGL rotation matches the CSS edge.
        const x=d.entry.button.offsetLeft+a.offsetLeft,y=d.entry.button.offsetTop+a.offsetTop;
        const w=a.clientWidth+2,h=a.clientHeight+2;
        d.x=x+w/2-width/2;d.y=height/2-y-h/2;mesh.scale.set(w,h,1);
        d.surface.height=Math.round(640*h/w);
        d.ctx.fillStyle='#e8e8df';d.ctx.fillRect(0,0,d.surface.width,d.surface.height);
        const img=d.entry.p.img,top=Math.round(d.surface.height*.16),pad=Math.round(d.surface.width*.03);
        const scale=Math.min((d.surface.width-pad*2)/img.naturalWidth,(d.surface.height-top-pad)/img.naturalHeight);
        const dw=img.naturalWidth*scale,dh=img.naturalHeight*scale;
        d.ctx.drawImage(img,(d.surface.width-dw)/2,top+(d.surface.height-top-pad-dh)/2,dw,dh);
        d.texture.needsUpdate=true;
        fitThumbnail(d.entry.image,d.entry.p);
      });
      wake();
    }
    function frame(time) {
      raf=0;
      if(document.hidden||route!=='wardrobe'||!visible){last=0;return;}
      const dt=last?Math.min((time-last)/1000,.05):0;last=time;
      if(!paused)elapsed+=dt;
      meshes.forEach((mesh,i)=>{
        const d=mesh.userData,drift=paused?0:Math.sin(elapsed*.8+i*1.8)*5;
        mesh.position.set(d.x,d.y+drift,d.hover&&!paused?18:0);
        mesh.rotation.z=-d.tilt*Math.PI/180+(paused?0:Math.sin(elapsed*.5+i)*.025);
        mesh.rotation.y=paused?0:(d.hover?pointer.x*.16:Math.sin(elapsed*.6+i)*.025);
        mesh.rotation.x=paused?0:(d.hover?-pointer.y*.1:Math.cos(elapsed*.45+i)*.02);
      });
      renderer.render(scene,camera);
      if(!paused)raf=requestAnimationFrame(frame);
    }
    function wake(){if(!raf)raf=requestAnimationFrame(frame);}
    gallery.addEventListener('pointermove',e=>{const r=gallery.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width*2-1;pointer.y=(e.clientY-r.top)/r.height*2-1;});
    new ResizeObserver(layout).observe(gallery);
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)wake();}).observe(gallery);
    document.addEventListener('visibilitychange',wake);
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();gallery.classList.remove('webgl');if(raf)cancelAnimationFrame(raf);});
    sceneWake=()=>{layout();};
    layout();gallery.classList.add('webgl');
  }catch(error){console.warn('Using accessible static wardrobe:',error);gallery.classList.remove('webgl');}
}
initWardrobe();
new ResizeObserver(()=>{if(route==='wardrobe')cardEntries.forEach(e=>fitThumbnail(e.image,e.p));}).observe(gallery);

// Optional WebMCP: all actions use the same validated selection path as the UI.
if(counts.every(count => count > 0) && document.modelContext?.registerTool){
  const lifetime=new AbortController();
  try{Promise.resolve(document.modelContext.registerTool({
    name:'configure_outfit',title:'Choose outfit pieces',description:`Select one garment per section by index (${sections.map((s,r)=>`${s.id} 0-${counts[r]-1}`).join(', ')}) and open the visible flipbook.`,
    inputSchema:{type:'object',properties:Object.fromEntries(sections.map((s,r)=>[s.id,{type:'integer',minimum:0,maximum:counts[r]-1}])),required:sections.map(s=>s.id),additionalProperties:false},
    annotations:{readOnlyHint:false,untrustedContentHint:false},
    execute(input){
      if(!input||typeof input!=='object'||Object.keys(input).length!==sections.length||sections.some((s,r)=>!Number.isInteger(input[s.id])||input[s.id]<0||input[s.id]>=counts[r]))throw new Error('Provide one in-range integer for every section.');
      sections.forEach((s,row)=>choose(row,input[s.id],false));location.hash='flipbook';showRoute();
      return {pieces:sections.map((s,row)=>({section:s.id,name:pieceFor(row).name}))};
    }
  },{signal:lifetime.signal})).catch(()=>{});}catch{}
  addEventListener('pagehide',()=>lifetime.abort(),{once:true});
}
