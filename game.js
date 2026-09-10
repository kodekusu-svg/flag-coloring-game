const FLAGS = window.FLAGS || [];
const state = { score:0, question:0, current:null, queue:[], selectedColor:null, completed:[], locked:false };
const el = {
  score:document.querySelector('#score'), finalScore:document.querySelector('#finalScore'),
  workFlag:document.querySelector('#workFlag'), sampleFlag:document.querySelector('#sampleFlag'), palette:document.querySelector('#palette'),
  countryName:document.querySelector('#countryName'), levelBadge:document.querySelector('#levelBadge'), progressText:document.querySelector('#progressText'),
  message:document.querySelector('#message'), checkBtn:document.querySelector('#checkBtn'), finishBtn:document.querySelector('#finishBtn'),
  restartBtn:document.querySelector('#restartBtn'), gameScreen:document.querySelector('#gameScreen'), resultScreen:document.querySelector('#resultScreen'),
  garland:document.querySelector('#garland'), celebration:document.querySelector('#celebration')
};
function shuffle(items){const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
function makeQueue(){const q=[];for(let level=1;level<=5;level++)q.push(...shuffle(FLAGS.filter(f=>f.level===level)));return q;}
function svgElement(region,fill,interactive=false){
  const ns='http://www.w3.org/2000/svg'; const node=document.createElementNS(ns,region.type);
  for(const [key,value] of Object.entries(region)){if(['id','type','color'].includes(key))continue;node.setAttribute(key,value);}
  node.setAttribute('fill',fill); node.dataset.regionId=region.id;
  if(interactive){
    node.classList.add('paint-region'); node.setAttribute('tabindex','0'); node.setAttribute('role','button'); node.setAttribute('aria-label','この場所に色をぬる');
    node.addEventListener('click',()=>paintRegion(node));
    node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();paintRegion(node);}});
    node.addEventListener('dragover',e=>{e.preventDefault();node.classList.add('drop-target');});
    node.addEventListener('dragleave',()=>node.classList.remove('drop-target'));
    node.addEventListener('drop',e=>{e.preventDefault();node.classList.remove('drop-target');const color=e.dataTransfer.getData('text/plain');if(color)paintRegion(node,color);});
  }
  return node;
}
function buildFlag(flag,interactive){
  const ns='http://www.w3.org/2000/svg'; const svg=document.createElementNS(ns,'svg'); svg.setAttribute('viewBox','0 0 300 200'); svg.setAttribute('preserveAspectRatio','xMidYMid meet'); svg.classList.add('flag-svg');
  const blank='#f7f7f2'; flag.regions.forEach(region=>svg.appendChild(svgElement(region,interactive?blank:region.color,interactive)));
  const outline=document.createElementNS(ns,'rect'); outline.setAttribute('x',1.5);outline.setAttribute('y',1.5);outline.setAttribute('width',297);outline.setAttribute('height',197);outline.classList.add('flag-outline');svg.appendChild(outline);return svg;
}
function hexToRgb(hex){const h=hex.replace('#','');return{r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16)};}
function rgbToHex({r,g,b}){const h=n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');return`#${h(r)}${h(g)}${h(b)}`;}
function colorDistance(a,b){const A=hexToRgb(a),B=hexToRgb(b);return Math.sqrt((A.r-B.r)**2+(A.g-B.g)**2+(A.b-B.b)**2);}
function makeDistractor(hex,amount=.25){const rgb=hexToRgb(hex),delta=Math.round(255*amount),direction=Math.random()<.5?-1:1;const shift=value=>{let x=value+direction*delta;if(x<0||x>255)x=value-direction*delta;return Math.max(0,Math.min(255,x));};return rgbToHex({r:shift(rgb.r),g:shift(rgb.g),b:shift(rgb.b)});}
function paletteFor(flag){
  const correct=[...new Set(flag.regions.map(r=>r.color.toLowerCase()))], distractors=[];
  correct.forEach(color=>{let candidate=makeDistractor(color),guard=0;while((correct.some(c=>colorDistance(c,candidate)<70)||distractors.includes(candidate))&&guard++<12)candidate=makeDistractor(color);distractors.push(candidate);});
  return shuffle([...correct,...distractors]);
}
function renderPalette(flag){
  el.palette.innerHTML='';state.selectedColor=null;const colors=paletteFor(flag);el.palette.classList.toggle('dense',colors.length>6);
  colors.forEach(color=>{const chip=document.createElement('button');chip.type='button';chip.className='color-chip';chip.style.background=color;chip.dataset.color=color;chip.draggable=true;chip.setAttribute('aria-label',`色 ${color}`);chip.addEventListener('click',()=>selectColor(color,chip));chip.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',color);e.dataTransfer.effectAllowed='copy';});el.palette.appendChild(chip);});
}
function selectColor(color,chip){state.selectedColor=color;el.palette.querySelectorAll('.color-chip').forEach(c=>c.classList.remove('selected'));chip.classList.add('selected');el.message.textContent='ぬりたい ばしょを タップしてね！';el.message.className='message';}
function paintRegion(node,forcedColor=null){if(state.locked)return;const color=forcedColor||state.selectedColor;if(!color){el.message.textContent='さきに いろを えらんでね！';el.message.className='message wrong';return;}node.setAttribute('fill',color);node.dataset.paint=color.toLowerCase();el.message.textContent='';el.message.className='message';}
function loadQuestion(){if(!state.queue.length)state.queue=makeQueue();state.current=state.queue.shift();state.question++;state.locked=false;el.countryName.textContent=state.current.name;el.levelBadge.textContent=`レベル ${'★'.repeat(state.current.level)}`;el.progressText.textContent=`${state.question}もんめ`;el.message.textContent='';el.message.className='message';el.workFlag.replaceChildren(buildFlag(state.current,true));el.sampleFlag.replaceChildren(buildFlag(state.current,false));renderPalette(state.current);}
function isCorrect(){const nodes=[...el.workFlag.querySelectorAll('.paint-region')];return state.current.regions.every(region=>{const node=nodes.find(n=>n.dataset.regionId===region.id);return node&&(node.dataset.paint||'').toLowerCase()===region.color.toLowerCase();});}
function celebrate(){const colors=['#ff5f6d','#ffc371','#4ecdc4','#5c7cfa','#b197fc','#69db7c'];el.celebration.innerHTML='';for(let i=0;i<90;i++){const piece=document.createElement('i');piece.className='confetti';piece.style.left=`${Math.random()*100}%`;piece.style.background=colors[i%colors.length];piece.style.setProperty('--drift',`${-120+Math.random()*240}px`);piece.style.animationDelay=`${Math.random()*.45}s`;el.celebration.appendChild(piece);}setTimeout(()=>{el.celebration.innerHTML='';},3200);}
function checkAnswer(){if(state.locked)return;if(!isCorrect()){el.message.textContent='おしい！ おてほんを よくみて もういちど！';el.message.className='message wrong';return;}state.locked=true;state.score++;state.completed.push(state.current);el.score.textContent=state.score;el.message.textContent='せいかい！ できたね！ 🎉';el.message.className='message correct';celebrate();setTimeout(loadQuestion,3000);}
function miniFlag(flag){const svg=buildFlag(flag,false);svg.classList.add('mini-flag');return svg;}
function chunk(items,size){const chunks=[];for(let i=0;i<items.length;i+=size)chunks.push(items.slice(i,i+size));return chunks;}
function renderGarland(flags){
  el.garland.innerHTML='';if(!flags.length)return;const vw=Math.max(document.documentElement.clientWidth,window.innerWidth||0);const perRow=vw<760?5:vw<1100?7:9;const rows=chunk(flags,perRow);
  rows.forEach((rowFlags,rowIndex)=>{const row=document.createElement('div');row.className='garland-row';const rope=document.createElement('div');rope.className='garland-rope';row.appendChild(rope);const line=document.createElement('div');line.className='garland-flags';rowFlags.forEach((flag,index)=>{const wrap=document.createElement('div');wrap.className='garland-flag-wrap';const center=(rowFlags.length-1)/2;const normalized=center===0?0:Math.abs(index-center)/center;const drop=Math.round((1-normalized*normalized)*34);const swing=((index+rowIndex)%2===0?-1:1)*(3+(index%3)*2);wrap.style.setProperty('--drop',`${drop}px`);wrap.style.setProperty('--swing',`${swing}deg`);wrap.appendChild(miniFlag(flag));line.appendChild(wrap);});row.appendChild(line);el.garland.appendChild(row);});
}
function finishGame(){state.locked=true;document.body.classList.add('showing-result');el.gameScreen.hidden=true;el.resultScreen.hidden=false;el.finalScore.textContent=state.score;renderGarland(state.completed);}
function restartGame(){state.score=0;state.question=0;state.completed=[];state.queue=makeQueue();state.locked=false;document.body.classList.remove('showing-result');el.score.textContent='0';el.garland.innerHTML='';el.resultScreen.hidden=true;el.gameScreen.hidden=false;loadQuestion();}
el.checkBtn.addEventListener('click',checkAnswer);el.finishBtn.addEventListener('click',finishGame);el.restartBtn.addEventListener('click',restartGame);restartGame();
