/* ===== 경험을 모아 붙인 다꾸 도화지 ===== */
const body = document.body;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ----- 첫 화면 : 이미지가 준비되면 등장 시작 (최대 0.6초 대기). 스크롤은 막지 않음 ----- */
/* 새로 열기·새로고침이면 (head에서 #주소를 지웠으니) 맨 위로 올려 쾅쾅부터 다시 */
if (document.documentElement.classList.contains('is-reload')) {
  scrollTo({ top: 0, behavior: 'instant' });
}
if (reduce || location.hash) {
  /* 움직임 줄이기 · 상세 페이지에서 돌아오는 등 섹션으로 바로 들어온 경우 → 완성된 화면 */
  body.classList.add('is-static');
  /* 섹션 주소로 들어오면 그 섹션으로 바로 (이미지·글꼴이 늦게 들어와 위치가 밀려도 다시 맞춤) */
  const target = location.hash && document.getElementById(location.hash.slice(1));
  if (target) {
    const go = () => target.scrollIntoView({ behavior: 'instant' });
    go();
    addEventListener('load', go, { once: true });
  }
} else {
  const imgs = [...document.querySelectorAll('.hero img')];
  const ready = Promise.all(imgs.map(i => (i.decode ? i.decode() : Promise.resolve()).catch(() => {})));
  const wait = new Promise(r => setTimeout(r, 600));
  Promise.race([ready, wait]).then(() => requestAnimationFrame(() => body.classList.add('is-play')));
}

/* ----- 스크롤 : 상단 배경 / 메뉴 강조 ----- */
const links = [...document.querySelectorAll('[data-link]')];
const sections = [...document.querySelectorAll('[data-section]')];
let currentId = null, ticking = false;
function onScroll() {
  body.classList.toggle('scrolled', scrollY > 60);
  const line = innerHeight * .5;
  let id = null;
  sections.forEach(s => { if (s.getBoundingClientRect().top <= line) id = s.id; });
  if (id !== currentId) {
    currentId = id;
    links.forEach(a => a.classList.toggle('on', a.dataset.link === id));
  }
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', onScroll);
onScroll();

/* ----- 모바일 메뉴 ----- */
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
const setMenu = open => { nav.classList.toggle('open', open); toggle.setAttribute('aria-expanded', open); };
toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', e => { if (e.target.tagName === 'A') setMenu(false); });

/* ----- 등장 순서 : 같은 묶음 안에서 한 장씩 차례로 ----- */
document.querySelectorAll('.pcard').forEach((el, i) => el.style.setProperty('--d', `${(i % 3) * .14}s`));
document.querySelectorAll('.skl__group').forEach(g => g.querySelectorAll('.sticker').forEach((li, i) => li.style.setProperty('--d', `${i * .08}s`)));
document.querySelectorAll('.note').forEach((n, i) => n.style.setProperty('--i', i));

const revObs = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target;
  el.classList.add('in');
  revObs.unobserve(el);
  /* 다 붙은 뒤에는 지연을 없애 마우스 반응이 바로 오도록 */
  setTimeout(() => {
    el.style.setProperty('--d', '0s');
    el.querySelectorAll('.sticker').forEach(s => s.style.setProperty('--d', '0s'));
  }, 1400);
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ----- SKILLS : 호버하면 설명 위에 숙련도 BAR(%)가 나타남. 수치는 각 li의 data-level ----- */
document.querySelectorAll('.sticker[data-level]').forEach(li => {
  const p = li.querySelector('p'), v = +li.dataset.level;
  const wrap = document.createElement('div');
  wrap.className = 'skl__desc';
  wrap.innerHTML = `<span class="skl__bar" style="--v:${v}" aria-label="숙련도 ${v}%"><i></i><em>${v}%</em></span>`;
  p.replaceWith(wrap);
  wrap.appendChild(p);
});

/* ----- SKILLS : 프로젝트 칩 → 해당 우표로 이동 + 잠깐 표시 ----- */
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

/* ----- PROJECTS : 스탬프 투어
   상세 페이지를 열어 본 우표에는 소인(SEEN + 날짜)이 찍히고, 다섯 장을 다 모으면 엽서 빈 우표 자리에 우표가 붙음.
   기록은 이 브라우저(localStorage)에만. 방금 보고 돌아온 우표만 "쾅" 찍히는 움직임을 보여줌 ----- */
const SEEN = 'yojg-seen', FRESH = 'yojg-seen-new';
const readStore = (area, k) => { try { return JSON.parse(window[area].getItem(k)); } catch (e) { return null; } };
const writeStore = (area, k, v) => { try { window[area].setItem(k, JSON.stringify(v)); } catch (e) {} };

const cards = [...document.querySelectorAll('.pcard')];
const tourMemo = document.querySelector('#projects .memo');
const tourMemoText = tourMemo.textContent;
const postFrame = document.querySelector('.frame--empty');

const seenMark = date => `<svg class="seen" viewBox="0 0 220 96" aria-hidden="true" focusable="false">
  <circle cx="48" cy="48" r="42"/><circle cx="48" cy="48" r="35" stroke-dasharray="3 3.4"/>
  <text x="48" y="46">SEEN</text><text class="seen__d" x="48" y="64">${date}</text>
  <path d="M102 32q10-8 20 0t20 0t20 0t20 0t20 0M102 48q10-8 20 0t20 0t20 0t20 0t20 0M102 64q10-8 20 0t20 0t20 0t20 0t20 0"/></svg>`;

/* 보이면 한 번 실행 */
const whenSeen = (el, fn) => {
  const o = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { o.disconnect(); fn(); } }, { threshold: .5 });
  o.observe(el);
};

function renderTour(animate) {
  const seen = readStore('localStorage', SEEN) || {};
  const fresh = animate && !reduce ? readStore('sessionStorage', FRESH) : null;
  if (animate) writeStore('sessionStorage', FRESH, null);

  let count = 0;
  cards.forEach(card => {
    const date = seen[card.id];
    if (!date) return;
    count++;
    if (card.querySelector('.seen')) return;
    const box = card.querySelector('.pcard__stamp');
    box.insertAdjacentHTML('beforeend', seenMark(date));
    const link = card.querySelector('.pcard__link');
    link.setAttribute('aria-label', `${link.textContent} (봤던 프로젝트)`);
    if (card.id === fresh) {
      const mark = box.querySelector('.seen');
      mark.classList.add('is-wait');
      /* 우표가 붙는 등장 움직임이 끝난 다음 찍히도록 살짝 기다림 */
      whenSeen(card, () => setTimeout(() => {
        mark.classList.replace('is-wait', 'is-hit');
        card.classList.add('is-stamped');
      }, 450));
    }
  });

  tourMemo.textContent = count ? `${count} / ${cards.length} collected` : tourMemoText;
  tourMemo.classList.toggle('is-done', count === cards.length);

  /* 다 모으면 엽서에 우표 (첫 화면 사진 우표를 그대로) */
  if (count === cards.length && postFrame && !postFrame.querySelector('img')) {
    postFrame.insertAdjacentHTML('beforeend', '<img class="frame__pic" src="assets/dakku/hero-photo.webp" alt="" width="1086" height="1448" loading="lazy">');
    postFrame.classList.add('is-filled');
    if (fresh) {
      postFrame.classList.add('is-wait');
      whenSeen(postFrame, () => setTimeout(() => postFrame.classList.replace('is-wait', 'is-stick'), 300));
    }
  }
}

/* 상세 페이지로 가는 순간 기록 (새 탭으로 열어도 기록) */
cards.forEach(card => {
  const link = card.querySelector('.pcard__link');
  const mark = e => {
    if (e.type === 'auxclick' && e.button !== 1) return;
    const seen = readStore('localStorage', SEEN) || {};
    if (seen[card.id]) return;
    const d = new Date();
    seen[card.id] = `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    writeStore('localStorage', SEEN, seen);
    writeStore('sessionStorage', FRESH, card.id);
    if (e.type === 'auxclick' || e.ctrlKey || e.metaKey || e.shiftKey) renderTour(true); /* 이 탭에 그대로 있으면 바로 찍힘 */
  };
  link.addEventListener('click', mark);
  link.addEventListener('auxclick', mark);
});
renderTour(true);
/* 뒤로 가기로 돌아왔을 때 (페이지가 캐시에서 그대로 살아난 경우) */
addEventListener('pageshow', e => { if (e.persisted) renderTour(true); });

/* ----- CONTACT : 엽서 보내기 = 메일 앱 열기 ----- */
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
