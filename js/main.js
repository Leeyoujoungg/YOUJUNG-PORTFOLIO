/* ===== 돌탑 (조각 PNG를 완성본 좌표에 맞춰 쌓음 · 아래 → 위 순서 = 쌓이는 순서) ===== */
const TOWER_W = 614, TOWER_H = 911;
const STONES = [
  { f:'shadow', x:-1,  y:712, w:614, h:198 },
  { f:'side',   x:368, y:447, w:185, h:252 },
  { f:'base',   x:106, y:516, w:411, h:292 },
  { f:'mid',    x:168, y:387, w:241, h:207 },
  { f:'disc',   x:74,  y:269, w:508, h:191 },
  { f:'egg',    x:136, y:67,  w:220, h:287 },
  { f:'top',    x:146, y:-1,  w:197, h:146 }
];

/* ===== 돌탑의 세 층 : 돌의 모양·기울기는 그대로 두고 의미만 얹음 =====
   PLAN = 받침돌·옆돌·그림자 / DESIGN = 가운데 돌·원반 / BUILD = 세운 돌·꼭대기 돌
   원래 메인의 파란 선을 '연결선'으로 바꿔, 세 층의 점을 아래에서부터 꿰고 화면 위로 이어지게 함 */
const LAYERS = [
  { no: '01', en: 'PLAN',   dot: [312, 655], w: 136 },
  { no: '02', en: 'DESIGN', dot: [292, 372], w: 164 },
  { no: '03', en: 'BUILD',  dot: [246, 212], w: 146 }
];

function layersSVG(mode) {
  /* 데스크톱은 화면 위까지 뻗고, 모바일은 꼭대기 돌 위에서 멈춤(위의 글자를 가리지 않도록) */
  const pts = [...LAYERS.map(l => l.dot), [330, innerWidth <= 860 ? -40 : -1100]];
  const d = 'M' + pts.map(p => p.join(' ')).join(' L');
  const tags = LAYERS.map((l, i) => {
    const [x, y] = l.dot;
    /* ttag__in : 점을 중심으로 01 → 02 → 03 차례로 커졌다 작아짐 */
    return `<g class="ttag" style="--i:${i}"><g class="ttag__in" style="--i:${i};transform-origin:${x}px ${y}px">
      <rect x="${x + 14}" y="${y - 21}" width="${l.w}" height="42" rx="21"/>
      <text x="${x + 32}" y="${y + 7}"><tspan>${l.no}</tspan> ${l.en}</text>
      <circle cx="${x}" cy="${y}" r="11"/>
    </g></g>`;
  }).join('');
  return `<path class="tlink" d="${d}" pathLength="1"/>${tags}`;
}

function towerSVG({ view = `0 0 ${TOWER_W} ${TOWER_H}`, slice = false, drop = false, stretch = false, layers = false } = {}) {
  const body = STONES.map((s, i) =>
    `<image class="stone" style="--i:${i}" href="assets/tower/${s.f}.png" x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}"/>`
  ).join('');
  return `<svg class="tower${drop ? ' tower--drop' : ''}" viewBox="${view}" preserveAspectRatio="${stretch ? 'none' : `xMidYMid ${slice ? 'slice' : 'meet'}`}" role="img" aria-label="돌탑 일러스트">${body}${layers ? layersSVG(layers) : ''}</svg>`;
}

document.querySelectorAll('[data-tower]').forEach(el => {
  const layers = 'layers' in el.dataset ? (el.dataset.layers || 'main') : false;
  el.innerHTML = towerSVG({
    view: el.dataset.view || undefined,
    slice: 'slice' in el.dataset,
    drop: 'drop' in el.dataset,
    stretch: 'stretch' in el.dataset,
    layers: layers === 'main' ? false : layers
  });
  /* 메인 : 연결선·태그는 별도 레이어로 고정하고, 돌만 마우스·스크롤에 따라 움직임 */
  if (layers === 'main') {
    el.insertAdjacentHTML('beforeend', `<svg class="tower tower__ov" viewBox="0 0 ${TOWER_W} ${TOWER_H}" aria-hidden="true">${layersSVG('main')}</svg>`);
  }
});

/* ===== 메인 밖에서도 같은 언어로 : 작은 '층 표시' =====
   돌탑의 각 층 끝점처럼 점이 위아래로 엇갈려 놓이고(지그재그), 얇은 선이 그 점들을 이음.
   data-lyr="PDB" 처럼 맡은 층만 파란 점으로 채움 */
const LAYER_NAMES = { P: 'PLAN', D: 'DESIGN', B: 'BUILD' };
const LYR_PTS = [[5, 10], [74, 10], [152, 10]]; /* 점 위치 : 일자로 */
document.querySelectorAll('[data-lyr]').forEach(el => {
  const on = el.dataset.lyr, keys = Object.keys(LAYER_NAMES);
  const isOn = i => on.includes(keys[i]);
  const lines = LYR_PTS.slice(1).map((p, i) => {
    const a = LYR_PTS[i];
    return `<line class="lyr__ln${isOn(i) && isOn(i + 1) ? ' is-on' : ''}" x1="${a[0]}" y1="${a[1]}" x2="${p[0]}" y2="${p[1]}"/>`;
  }).join('');
  const dots = keys.map((k, i) => {
    const [x, y] = LYR_PTS[i];
    return `<g class="lyr__i${isOn(i) ? ' is-on' : ''}"><circle cx="${x}" cy="${y}" r="3.5"/><text x="${x - 3}" y="31">${LAYER_NAMES[k]}</text></g>`;
  }).join('');
  el.innerHTML = `<svg viewBox="0 0 210 34" aria-hidden="true">${lines}${dots}</svg>`;
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', '맡은 단계: ' + [...on].map(k => LAYER_NAMES[k]).join(', '));
});
/* ===== 시작 ===== */
const body = document.body;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (location.hash === '#projects') {
  /* 상세 페이지에서 프로젝트 목록으로 돌아올 때는 애니메이션 없이 바로 보여줌 */
  body.classList.add('is-done');
  addEventListener('load', () => document.getElementById('projects').scrollIntoView({ behavior: 'instant' }));
} else {
  requestAnimationFrame(() => body.classList.add('is-done'));
}


/* ===== 스크롤: 로고 등장 / 메뉴 강조 ===== */
let ticking = false;

const heroTower = document.getElementById('heroTower');
const heroMain = document.getElementById('heroMain');

function onScroll() {
  const y = scrollY;
  body.classList.toggle('scrolled', y > 80);
  if (!reduce && y < innerHeight * 1.2) heroTower.style.setProperty('--py', `${y * 0.18}px`);
  if (y < innerHeight * 1.2) {
    heroMain.style.opacity = Math.max(0, 1 - y / (innerHeight * .75));
    if (!reduce) heroMain.style.transform = `translateY(${-y * .12}px)`;
  }
  updateActive();
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', updateActive);

const links = [...document.querySelectorAll('[data-link]')];
const sections = [...document.querySelectorAll('[data-section]')];
let currentId = null;
function updateActive() {
  const line = innerHeight * .5;
  let id = null;
  sections.forEach(s => { if (s.getBoundingClientRect().top <= line) id = s.id; });
  if (id === currentId) return;
  currentId = id;
  links.forEach(a => a.classList.toggle('on', a.dataset.link === id));
}
onScroll();


/* ===== 메인 돌탑: 마우스를 따라 미세하게 회전 ===== */
const hero = document.getElementById('home');
if (!reduce && matchMedia('(hover:hover)').matches) {
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
    /* 마우스를 따라가는 폭을 크게 (돌만 움직이고 선·태그는 고정) */
    heroTower.style.setProperty('--ry', `${nx * 20}deg`);
    heroTower.style.setProperty('--rx', `${-ny * 14}deg`);
    heroTower.style.setProperty('--mx', `${nx * 46}px`);
    heroTower.style.setProperty('--my', `${ny * 28}px`);
  });
  hero.addEventListener('pointerleave', () => ['--ry', '--rx', '--mx', '--my'].forEach(k => heroTower.style.removeProperty(k)));
}

/* ===== 메인 스크롤 : YOJG / PORTFOLiO가 좌우로 갈라짐 ===== */
const heroSpans = document.querySelectorAll('.hero2__title span');
function heroSplit() {
  if (reduce) return;
  const y = Math.min(scrollY, innerHeight);
  if (heroSpans[0]) heroSpans[0].style.translate = `${-y * .35}px 0`;
  if (heroSpans[1]) heroSpans[1].style.translate = `${y * .25}px 0`;
}
addEventListener('scroll', () => requestAnimationFrame(heroSplit), { passive: true });
heroSplit();

/* ===== 스크롤 등장 순서 : 같은 묶음 안에서 하나씩 차례로 ===== */
document.querySelectorAll('.pshow__grid .pitem').forEach((el, i) => el.style.setProperty('--d', `${(i % 3) * .12}s`));
document.querySelectorAll('.skl__group').forEach(g => g.querySelectorAll('li').forEach((li, i) => li.style.setProperty('--d', `${i * .08}s`)));

/* ===== 등장 애니메이션 ===== */
const revObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ===== 모바일 메뉴 ===== */
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
const setMenu = open => { nav.classList.toggle('open', open); toggle.setAttribute('aria-expanded', open); };
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', e => { if (e.target.tagName === 'A') setMenu(false); });

/* ===== 이메일 보내기 (메일 앱 열기) ===== */
const form = document.getElementById('mailForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', e => {
  e.preventDefault();
  const { name, email, msg } = form.elements;
  if (!name.value.trim() || !email.validity.valid || !msg.value.trim()) {
    note.textContent = '이름, 올바른 이메일, 내용을 모두 입력해주세요.';
    return;
  }
  note.textContent = '';
  const subject = encodeURIComponent(`[포트폴리오] ${name.value.trim()}님의 문의`);
  const text = encodeURIComponent(`${msg.value.trim()}\n\n- ${name.value.trim()} (${email.value.trim()})`);
  location.href = `mailto:youkh0503@gmail.com?subject=${subject}&body=${text}`;
});

/* 섹션을 관통하던 장식 흐름선(파랑·검정·노랑)은 제거 — 선은 돌탑의 의미를 설명할 때만 사용 */

/* skills : 호버하면 설명 위에 숙련도 BAR(%)가 나타남. 수치는 각 li의 data-level */
document.querySelectorAll('.skl__group li[data-level]').forEach(li => {
  const p = li.querySelector('p'), v = +li.dataset.level;
  const wrap = document.createElement('div');
  wrap.className = 'skl__desc';
  wrap.innerHTML = `<span class="skl__bar" style="--v:${v}" aria-label="숙련도 ${v}%"><i></i><em>${v}%</em></span>`;
  p.replaceWith(wrap);
  wrap.appendChild(p);
});

/* skills : 프로젝트 칩 클릭 시 해당 카드로 이동 */
document.querySelectorAll('a[data-goto]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const card = document.getElementById(a.dataset.goto);
    if (!card) return;
    card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    card.classList.add('is-ping');
    setTimeout(() => card.classList.remove('is-ping'), 1800);
  });
});










