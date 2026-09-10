const FLAGS = [
  {
    id: 'jp', name: 'にほん', level: 1,
    ratio: [3, 2],
    regions: [
      { id: 'bg', type: 'rect', x: 0, y: 0, width: 300, height: 200, color: '#ffffff' },
      { id: 'disc', type: 'circle', cx: 150, cy: 100, r: 60, color: '#bc002d' }
    ]
  },
  {
    id: 'ua', name: 'ウクライナ', level: 1,
    ratio: [3, 2],
    regions: [
      { id: 'top', type: 'rect', x: 0, y: 0, width: 300, height: 100, color: '#0057b7' },
      { id: 'bottom', type: 'rect', x: 0, y: 100, width: 300, height: 100, color: '#ffd700' }
    ]
  },
  {
    id: 'fr', name: 'フランス', level: 2,
    ratio: [3, 2],
    regions: [
      { id: 'left', type: 'rect', x: 0, y: 0, width: 100, height: 200, color: '#0055a4' },
      { id: 'middle', type: 'rect', x: 100, y: 0, width: 100, height: 200, color: '#ffffff' },
      { id: 'right', type: 'rect', x: 200, y: 0, width: 100, height: 200, color: '#ef4135' }
    ]
  },
  {
    id: 'de', name: 'ドイツ', level: 2,
    ratio: [5, 3],
    regions: [
      { id: 'top', type: 'rect', x: 0, y: 0, width: 300, height: 66.67, color: '#000000' },
      { id: 'middle', type: 'rect', x: 0, y: 66.67, width: 300, height: 66.66, color: '#dd0000' },
      { id: 'bottom', type: 'rect', x: 0, y: 133.33, width: 300, height: 66.67, color: '#ffce00' }
    ]
  },
  {
    id: 'it', name: 'イタリア', level: 2,
    ratio: [3, 2],
    regions: [
      { id: 'left', type: 'rect', x: 0, y: 0, width: 100, height: 200, color: '#009246' },
      { id: 'middle', type: 'rect', x: 100, y: 0, width: 100, height: 200, color: '#ffffff' },
      { id: 'right', type: 'rect', x: 200, y: 0, width: 100, height: 200, color: '#ce2b37' }
    ]
  }
];

const state = {
  score: 0,
  question: 0,
  current: null,
  queue: [],
  selectedColor: null,
  completed: [],
  locked: false
};

const el = {
  score: document.querySelector('#score'),
  finalScore: document.querySelector('#finalScore'),
  workFlag: document.querySelector('#workFlag'),
  sampleFlag: document.querySelector('#sampleFlag'),
  palette: document.querySelector('#palette'),
  countryName: document.querySelector('#countryName'),
  levelBadge: document.querySelector('#levelBadge'),
  progressText: document.querySelector('#progressText'),
  message: document.querySelector('#message'),
  checkBtn: document.querySelector('#checkBtn'),
  finishBtn: document.querySelector('#finishBtn'),
  restartBtn: document.querySelector('#restartBtn'),
  gameScreen: document.querySelector('#gameScreen'),
  resultScreen: document.querySelector('#resultScreen'),
  garland: document.querySelector('#garland'),
  celebration: document.querySelector('#celebration')
};

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeQueue() {
  const easy = shuffle(FLAGS.filter(f => f.level === 1));
  const medium = shuffle(FLAGS.filter(f => f.level === 2));
  return [...easy, ...medium];
}

function svgElement(region, fill, interactive = false) {
  const ns = 'http://www.w3.org/2000/svg';
  const node = document.createElementNS(ns, region.type);
  for (const [key, value] of Object.entries(region)) {
    if (['id', 'type', 'color'].includes(key)) continue;
    node.setAttribute(key, value);
  }
  node.setAttribute('fill', fill);
  node.dataset.regionId = region.id;
  if (interactive) {
    node.classList.add('paint-region');
    node.setAttribute('tabindex', '0');
    node.setAttribute('role', 'button');
    node.setAttribute('aria-label', 'この場所に色をぬる');
    node.addEventListener('click', () => paintRegion(node));
    node.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); paintRegion(node); }
    });
    node.addEventListener('dragover', e => { e.preventDefault(); node.classList.add('drop-target'); });
    node.addEventListener('dragleave', () => node.classList.remove('drop-target'));
    node.addEventListener('drop', e => {
      e.preventDefault();
      node.classList.remove('drop-target');
      const color = e.dataTransfer.getData('text/plain');
      if (color) paintRegion(node, color);
    });
  }
  return node;
}

function buildFlag(flag, interactive) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 300 200');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.classList.add('flag-svg');
  const blank = '#f7f7f2';
  flag.regions.forEach(region => svg.appendChild(svgElement(region, interactive ? blank : region.color, interactive)));
  const outline = document.createElementNS(ns, 'rect');
  outline.setAttribute('x', 1.5); outline.setAttribute('y', 1.5);
  outline.setAttribute('width', 297); outline.setAttribute('height', 197);
  outline.classList.add('flag-outline');
  svg.appendChild(outline);
  return svg;
}

function colorDistance(a, b) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return Math.sqrt((A.r-B.r)**2 + (A.g-B.g)**2 + (A.b-B.b)**2);
}

function hexToRgb(hex) {
  const h = hex.replace('#','');
  return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) };
}

function rgbToHex({r,g,b}) {
  const h = n => Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

function makeDistractor(hex, amount = 0.05) {
  const rgb = hexToRgb(hex);
  const shift = () => (Math.random() < .5 ? -1 : 1) * 255 * amount * (.7 + Math.random() * .6);
  return rgbToHex({ r: rgb.r + shift(), g: rgb.g + shift(), b: rgb.b + shift() });
}

function paletteFor(flag) {
  const correct = [...new Set(flag.regions.map(r => r.color.toLowerCase()))];
  const distractors = [];
  correct.forEach(color => {
    let candidate = makeDistractor(color);
    let guard = 0;
    while ((correct.some(c => colorDistance(c, candidate) < 10) || distractors.includes(candidate)) && guard++ < 10) {
      candidate = makeDistractor(color);
    }
    distractors.push(candidate);
  });
  return shuffle([...correct, ...distractors]);
}

function renderPalette(flag) {
  el.palette.innerHTML = '';
  state.selectedColor = null;
  paletteFor(flag).forEach(color => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'color-chip';
    chip.style.background = color;
    chip.dataset.color = color;
    chip.draggable = true;
    chip.setAttribute('aria-label', `色 ${color}`);
    chip.addEventListener('click', () => selectColor(color, chip));
    chip.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', color);
      e.dataTransfer.effectAllowed = 'copy';
    });
    el.palette.appendChild(chip);
  });
}

function selectColor(color, chip) {
  state.selectedColor = color;
  el.palette.querySelectorAll('.color-chip').forEach(c => c.classList.remove('selected'));
  chip.classList.add('selected');
  el.message.textContent = 'ぬりたい ばしょを タップしてね！';
  el.message.className = 'message';
}

function paintRegion(node, forcedColor = null) {
  if (state.locked) return;
  const color = forcedColor || state.selectedColor;
  if (!color) {
    el.message.textContent = 'さきに いろを えらんでね！';
    el.message.className = 'message wrong';
    return;
  }
  node.setAttribute('fill', color);
  node.dataset.paint = color.toLowerCase();
  el.message.textContent = '';
  el.message.className = 'message';
}

function loadQuestion() {
  if (!state.queue.length) state.queue = makeQueue();
  state.current = state.queue.shift();
  state.question += 1;
  state.locked = false;
  el.countryName.textContent = state.current.name;
  el.levelBadge.textContent = `レベル ${'★'.repeat(state.current.level)}`;
  el.progressText.textContent = `${state.question}もんめ`;
  el.message.textContent = '';
  el.message.className = 'message';
  el.workFlag.replaceChildren(buildFlag(state.current, true));
  el.sampleFlag.replaceChildren(buildFlag(state.current, false));
  renderPalette(state.current);
}

function isCorrect() {
  const nodes = [...el.workFlag.querySelectorAll('.paint-region')];
  return state.current.regions.every(region => {
    const node = nodes.find(n => n.dataset.regionId === region.id);
    return node && (node.dataset.paint || '').toLowerCase() === region.color.toLowerCase();
  });
}

function celebrate() {
  const colors = ['#ff5f6d','#ffc371','#4ecdc4','#5c7cfa','#b197fc','#69db7c'];
  el.celebration.innerHTML = '';
  for (let i=0; i<90; i++) {
    const piece = document.createElement('i');
    piece.className = 'confetti';
    piece.style.left = `${Math.random()*100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty('--drift', `${-120 + Math.random()*240}px`);
    piece.style.animationDelay = `${Math.random()*.45}s`;
    el.celebration.appendChild(piece);
  }
  setTimeout(() => { el.celebration.innerHTML = ''; }, 3200);
}

function checkAnswer() {
  if (state.locked) return;
  if (!isCorrect()) {
    el.message.textContent = 'おしい！ おてほんを よくみて もういちど！';
    el.message.className = 'message wrong';
    return;
  }
  state.locked = true;
  state.score += 1;
  state.completed.push(state.current);
  el.score.textContent = state.score;
  el.message.textContent = 'せいかい！ できたね！ 🎉';
  el.message.className = 'message correct';
  celebrate();
  setTimeout(loadQuestion, 3000);
}

function miniFlag(flag) {
  const svg = buildFlag(flag, false);
  svg.classList.add('mini-flag');
  return svg;
}

function finishGame() {
  state.locked = true;
  el.gameScreen.hidden = true;
  el.resultScreen.hidden = false;
  el.finalScore.textContent = state.score;
  el.garland.innerHTML = '';
  const flags = state.completed.length ? state.completed : FLAGS.slice(0, 3);
  const positions = [
    [8,8,-8],[26,4,6],[48,7,-5],[70,3,7],[86,10,-6],
    [5,78,7],[24,86,-5],[48,80,6],[72,86,-7],[88,76,5]
  ];
  positions.forEach(([x,y,a], i) => {
    const flag = miniFlag(flags[i % flags.length]);
    flag.style.left = `${x}%`; flag.style.top = `${y}%`; flag.style.setProperty('--angle', `${a}deg`);
    el.garland.appendChild(flag);
  });
}

function restartGame() {
  state.score = 0;
  state.question = 0;
  state.completed = [];
  state.queue = makeQueue();
  el.score.textContent = '0';
  el.resultScreen.hidden = true;
  el.gameScreen.hidden = false;
  loadQuestion();
}

el.checkBtn.addEventListener('click', checkAnswer);
el.finishBtn.addEventListener('click', finishGame);
el.restartBtn.addEventListener('click', restartGame);

restartGame();
