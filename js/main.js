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

function towerSVG({ view = `0 0 ${TOWER_W} ${TOWER_H}`, slice = false, drop = false, stretch = false } = {}) {
  const body = STONES.map((s, i) =>
    `<image class="stone" style="--i:${i}" href="assets/tower/${s.f}.png" x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}"/>`
  ).join('');
  return `<svg class="tower${drop ? ' tower--drop' : ''}" viewBox="${view}" preserveAspectRatio="${stretch ? 'none' : `xMidYMid ${slice ? 'slice' : 'meet'}`}" role="img" aria-label="돌탑 일러스트">${body}</svg>`;
}

document.querySelectorAll('[data-tower]').forEach(el => {
  el.innerHTML = towerSVG({
    view: el.dataset.view || undefined,
    slice: 'slice' in el.dataset,
    drop: 'drop' in el.dataset,
    stretch: 'stretch' in el.dataset
  });
});

/* ===== 시작 ===== */
const body = document.body;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (location.hash === '#projects') {
  /* 상세 페이지에서 프로젝트 목록으로 돌아올 때는 애니메이션 없이 바로 보여줌 */
  body.classList.add('is-done');
  setTimeout(startLines, 0);
  addEventListener('load', () => document.getElementById('projects').scrollIntoView({ behavior: 'instant' }));
} else {
  requestAnimationFrame(() => {
    startLines();
    body.classList.add('is-done');
  });
}


/* ===== 스크롤: 로고 등장 / 돌탑 패럴랙스 / 메뉴 강조 ===== */
const heroTower = document.getElementById('heroTower');
const heroMain = document.getElementById('heroMain');
let ticking = false;

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
    heroTower.style.setProperty('--ry', `${nx * 8}deg`);
    heroTower.style.setProperty('--rx', `${-ny * 6}deg`);
    heroTower.style.setProperty('--mx', `${nx * 14}px`);
  });
  hero.addEventListener('pointerleave', () => ['--ry', '--rx', '--mx'].forEach(k => heroTower.style.removeProperty(k)));
}

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

/* ===== 메인 선 모션: 그려지듯 등장 → 살랑살랑 흔들림 + 스크롤 시 어긋남 ===== */
/* 파랑(위→아래) → 검정(같은 끝점에서 이어져 PROJECT까지) ┬ 노랑(검정 위의 한 점에서 갈라짐)
   세 선이 같은 꼭짓점을 공유하고, 흔들림도 꼭짓점 단위로 계산해서 항상 붙어 있음 */
const flowSvg = document.querySelector('.flow');
const flowHero = document.getElementById('home');
const fl = {
  blue: document.getElementById('flowBlue'),
  black: document.getElementById('flowBlack'),
  yellow: document.getElementById('flowYellow')
};
/* 1935×965 기준 좌표 (히어로 영역). 검정은 P1→P3 직선, 노랑 시작점은 그 위의 비율 u */
/* 스케치처럼 서로 가로지르고 끝이 교차점을 살짝 넘어감. 파랑×노랑, 노랑×검정이 교차하며 아래 섹션 쪽으로 이어짐 */
const FL = {
  blue:   [[1757, 0],   [1662, 800]],
  black:  [[760, 830],  [2000, 1118]],
  yellow: [[960, 1040], [1935, 620]]
};
let fW = innerWidth, fH = innerHeight;
function flowMeasure() {
  fW = flowHero.offsetWidth; fH = flowHero.offsetHeight;
  flowSvg.style.height = (fH + 600 * fW / 1935 + 60) + 'px';
}
flowMeasure();
addEventListener('resize', flowMeasure);
addEventListener('load', flowMeasure);
const fmap = ([x, y]) => [x * fW / 1935, y <= 965 ? y * fH / 965 : fH + (y - 965) * fW / 1935];
let linesStart = null;
const fE = (t, d, s) => { const p = Math.min(Math.max((t - d) / s, 0), 1); return 1 - Math.pow(1 - p, 3); };

function setLine(el, a, b, e) {
  el.setAttribute('x1', a[0]); el.setAttribute('y1', a[1]);
  el.setAttribute('x2', a[0] + (b[0] - a[0]) * e);
  el.setAttribute('y2', a[1] + (b[1] - a[1]) * e);
}

function paintLines(now) {
  const t = linesStart === null ? 0 : now - linesStart;
  const sway = reduce ? 0 : Math.min(Math.max((t - 2400) / 1500, 0), 1);
  const sy = Math.min(scrollY, innerHeight * 1.5);
  const wob = (p, i) => {
    const q = fmap(p), ph = now / 1700 + i * 1.7;
    return [q[0] + sway * Math.sin(ph) * 14, q[1] + sway * Math.cos(ph * .8) * 12];
  };
  /* 순서: 파랑 → 검정 → 노랑 */
  setLine(fl.blue, wob(FL.blue[0], 0), wob(FL.blue[1], 1), fE(t, 0, 900));
  setLine(fl.black, wob(FL.black[0], 2), wob(FL.black[1], 3), fE(t, 700, 1300));
  setLine(fl.yellow, wob(FL.yellow[0], 4), wob(FL.yellow[1], 5), fE(t, 1300, 1200));
  flowSvg.style.transform = `translateY(${sy * .12}px)`;
  if (!reduce) requestAnimationFrame(paintLines);
}
function startLines() { linesStart = performance.now() + 250; }
if (reduce) linesStart = -1e6;
paintLines(performance.now());

/* ===== 스크롤 연결선: 메인의 파랑·검정·노랑이 섹션 경계에서 사선으로 갈아타며 아래로 이어짐 ===== */
/* 각 점: [x 비율, 섹션 id, 섹션 내 y 비율]. 섹션 경계 근처에서 좌↔우 사선으로 교차 */
const trailMain = document.querySelector('main');
const trailSvg = document.getElementById('trail');
/* 각 선은 예전 위치 그대로. 모두 CONTACT(03) 중간까지 내려오고, 끝 약 190px(≈5cm)에서만 가늘어져 끝남 */
const TRAIL = [
  { el: document.getElementById('trailBlue'), pts: [
    ['hero', 's'], ['projects', 't'], ['projects', 'b'], ['about', 't'], ['about', 'b'], ['skills', 't'], ['skills', 'bA'], ['contact', 'tA'], ['contact', .5]
  ], xs: [.859, .955, .955, .045, .045, .955, .955, .045, .045] },
  { el: document.getElementById('trailBlack'), pts: [
    ['projects', 't'], ['projects', .35], ['projects', 'b'], ['about', 't'], ['about', .55], ['skills', 't'], ['skills', 'b'], ['contact', 't'], ['contact', .5]
  ], xs: [.015, .015, .015, .985, .985, .015, .015, .985, .985] },
  { el: document.getElementById('trailYellow'), pts: [
    ['hero', 'y'], ['projects', 't'], ['projects', .6], ['about', 't2'], ['about', 'b2'], ['skills', 't2'], ['skills', 'k-1.5'], ['contact', 'k0.9'], ['contact', .5]
  ], xs: [1, .99, .99, .03, .03, .99, .99, .015, .015] }
];
const TAPER = 240, TRAIL_W = 5;
/* 't' / 'b' = 섹션 콘텐츠의 시작/끝 근처(여백 안쪽). 사선은 섹션 사이 빈 여백 안에서만 가로지름 */
const secEl = {
  hero: document.getElementById('home'), projects: document.getElementById('projects'),
  about: document.getElementById('about'), skills: document.getElementById('skills'),
  contact: document.getElementById('contact')
};
let trailGeo = [];
function trailMeasure() {
  const mt = trailMain.getBoundingClientRect().top + scrollY, W = trailMain.offsetWidth;
  trailSvg.style.height = trailMain.offsetHeight + 'px';
  trailGeo = TRAIL.map(t => t.pts.map(([id, f], i) => {
    const s = secEl[id], top = s.getBoundingClientRect().top + scrollY - mt;
    /* 히어로의 파랑선 끝점은 실제 선 끝 위치에 맞춤 */
    const pad = Math.min(Math.max(90, W * .11), 200) * .85;
    const y = id === 'hero' ? fH * (f === 'y' ? .64 : 800 / 965)
      : f === 't' ? top + pad : f === 'b' ? top + s.offsetHeight - pad
      : typeof f === 'string' && f[0] === 'k' ? (id === 'skills' ? top + s.offsetHeight : top) + parseFloat(f.slice(1)) * pad
      : f === 'bA' ? top + s.offsetHeight - pad * 1.18 : f === 'tA' ? top + pad * .35
      : f === 'bB' ? top + s.offsetHeight - pad * .75 : f === 'tB' ? top + pad * .8
      : f === 't2' ? top + pad * .45 : f === 'b2' ? top + s.offsetHeight - pad * .45 : top + s.offsetHeight * f;
    return [t.xs[i] * W, y];
  }));
}
function trailPaint() {
  const par = Math.min(scrollY, innerHeight * 1.5) * .12;
  TRAIL.forEach((t, k) => {
    const pts = trailGeo[k].map((p, i) => p);
    /* 스크롤 0에서는 아무것도 없고, 스크롤한 만큼만 시작점에서 앞쪽 끝이 내려옴 */
    const head = pts[0][1] + scrollY * 1.25;
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (p[1] <= head) { out.push(p); continue; }
      if (i > 0) {
        const q = pts[i - 1], r = (head - q[1]) / (p[1] - q[1]);
        if (r > 0) out.push([q[0] + (p[0] - q[0]) * r, head]);
      }
      break;
    }
    /* 굵기 5px 고정. 시작·끝(그려지는 앞쪽 끝 포함) TAPER 길이만큼 서서히 투명해져 자연스럽게 나타나고 사라짐 */
    let D = 0;
    for (let i = 1; i < out.length; i++) D += Math.hypot(out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1]);
    const ease = x => x * x * (3 - 2 * x);
    let svg = '', acc = 0;
    for (let i = 1; i < out.length; i++) {
      const a = out[i - 1], b = out[i], sl = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const fine = acc < TAPER + 30 || acc + sl > D - TAPER - 30;
      const n = Math.max(1, Math.ceil(sl / (fine ? 5 : 90)));
      for (let j = 0; j < n; j++) {
        const u0 = j / n, u1 = (j + 1) / n, sm = acc + sl * (u0 + u1) / 2;
        const f = ease(Math.min(Math.max(Math.min(sm, D - sm) / TAPER, 0), 1));
        const op = f.toFixed(2);
        svg += `<line x1="${(a[0] + (b[0] - a[0]) * u0).toFixed(1)}" y1="${(a[1] + (b[1] - a[1]) * u0).toFixed(1)}" x2="${(a[0] + (b[0] - a[0]) * u1).toFixed(1)}" y2="${(a[1] + (b[1] - a[1]) * u1).toFixed(1)}" stroke-width="${TRAIL_W}" stroke-opacity="${op}"${f >= 1 ? ` stroke-linecap="round"` : ` stroke-linecap="butt"`}/>`;
      }
      acc += sl;
    }    t.el.innerHTML = svg;
  });
}
trailMeasure();
trailPaint();
addEventListener('scroll', trailPaint, { passive: true });
addEventListener('resize', () => { trailMeasure(); trailPaint(); });
addEventListener('load', () => { trailMeasure(); trailPaint(); });
if (document.fonts) document.fonts.ready.then(() => { trailMeasure(); trailPaint(); });

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










