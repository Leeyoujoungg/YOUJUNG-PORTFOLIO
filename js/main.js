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

/* ===== 로딩 ===== */
const body = document.body;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
/* 돌 7개가 모두 쌓이는 시간(마지막 돌 delay 1.35s + 0.8s)에 로딩 바를 맞춤 */
const DURATION = reduce ? 300 : 2150;

if (location.hash === '#projects') {
  /* 상세 페이지에서 프로젝트 목록으로 돌아올 때는 로딩 없이 바로 보여줌 */
  body.classList.remove('is-loading');
  body.classList.add('is-loaded', 'is-done');
  setTimeout(startLines, 0);
  addEventListener('load', () => document.getElementById('projects').scrollIntoView({ behavior: 'instant' }));
} else {
  setTimeout(() => {
    body.classList.add('is-loaded');
    startLines();
    body.classList.remove('is-loading');
    setTimeout(() => body.classList.add('is-done'), 1300);
  }, DURATION + 350);
}


/* ===== 스크롤: 로고 등장 / 돌탑 패럴랙스 / 메뉴 강조 ===== */
const heroTower = document.getElementById('heroTower');
let ticking = false;

function onScroll() {
  const y = scrollY;
  body.classList.toggle('scrolled', y > 80);
  if (!reduce && y < innerHeight * 1.2) heroTower.style.setProperty('--py', `${y * 0.18}px`);
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
const heroLines = [...document.querySelectorAll('.hero__lines line')].map((el, i) => ({
  el, i,
  x1: +el.getAttribute('x1'), y1: +el.getAttribute('y1'),
  x2: +el.getAttribute('x2'), y2: +el.getAttribute('y2')
}));
let linesStart = null;

function paintLines(now) {
  const t = linesStart === null ? 0 : now - linesStart;
  const sy = Math.min(scrollY, innerHeight * 1.2);
  heroLines.forEach(l => {
    const p = linesStart === null ? 0 : Math.min(Math.max((t - l.i * 220) / 1200, 0), 1);
    const e = 1 - Math.pow(1 - p, 3);
    const sway = reduce ? 0 : Math.min(Math.max((t - l.i * 220 - 1200) / 1500, 0), 1);
    const ph = now / 1700 + l.i * 1.7;
    const dx = sway * Math.sin(ph) * 14;
    const dy = sway * Math.cos(ph * .8) * 12 + sy * (l.i % 2 ? -.35 : .35);
    l.el.setAttribute('x1', l.x1 + dx);
    l.el.setAttribute('y1', l.y1 + dy);
    l.el.setAttribute('x2', l.x1 + (l.x2 - l.x1) * e + dx);
    l.el.setAttribute('y2', l.y1 + (l.y2 - l.y1) * e + dy);
  });
  if (!reduce) requestAnimationFrame(paintLines);
}
function startLines() { linesStart = performance.now() + 250; }
if (reduce) linesStart = -1e6;
paintLines(performance.now());

/* skills : hover 시 퍼센트가 0에서 올라감 */
document.querySelectorAll('.skills__group li').forEach(li => {
  const pct = li.querySelector('.pct');
  if (!pct) return;
  const to = parseInt(pct.textContent, 10);
  let raf = 0, rest = 0;
  li.addEventListener('mouseenter', () => {
    cancelAnimationFrame(raf);
    clearTimeout(rest);
    if (reduce) return;
    const t0 = performance.now(), delay = 60, dur = 450;
    const tick = now => {
      const k = Math.min(Math.max((now - t0 - delay) / dur, 0), 1);
      pct.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + '%';
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    pct.textContent = '0%';
    raf = requestAnimationFrame(tick);
  });
  li.addEventListener('mouseleave', () => {
    cancelAnimationFrame(raf);
    rest = setTimeout(() => { pct.textContent = to + '%'; }, 260);
  });
});
/* skills : 프로젝트 칩 클릭 시 해당 카드로 이동 */
document.querySelectorAll('.lv a[data-goto]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const card = document.getElementById(a.dataset.goto);
    if (!card) return;
    card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    card.classList.add('is-ping');
    setTimeout(() => card.classList.remove('is-ping'), 1800);
  });
});