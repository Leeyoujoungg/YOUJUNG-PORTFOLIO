/* ===== 프로젝트 모달 : 카드 썸네일에서 자연스럽게 커지며 열림 ===== */
const PROJECTS = [
  { title: '말모이', img: 'assets/p-malmoi.webp' }, // 카드가 malmoi.html 로 바로 이동 → 썸네일만 사용
  {
    title: 'DIV',
    img: 'assets/p-div.webp',
    meta: '3인 프로젝트 · 웹 디자인 · 프로그래밍 담당 · 2026.03 ~ 2026.06',
    lead: '기부 이후 경험을 연결하는 기부 서비스 소개 웹사이트',
    desc: '기부자 감소라는 문제에서 출발해, 한눈에 보이는 투명한 기부 경험을 제안하는 앱을 소개합니다.',
    list: [
      ['스크롤 스토리텔링', 'GSAP ScrollTrigger로 기부자 감소 시각화와 섹션 전환 구현'],
      ['앱 체험 섹션', '홈 → 탐색 → 상세 → 결제 → 비밀번호까지 기부 흐름을 목업으로 시뮬레이션'],
      ['세액공제·핵심 기능', '폰 목업 애니메이션, 부채꼴 카드 스크롤 연출']
    ],
    story: '웹 디자인과 프로그래밍을 함께 맡아, 서비스의 가치를 스크롤 기반의 스토리텔링으로 전달했습니다.',
    fix: [
      {
        title: '스크롤 애니메이션이 끊기는 문제',
        rows: [
          ['문제', '스크롤에 맞춰 움직이는 애니메이션이 끊겨 보였습니다.'],
          ['해결', '원인을 찾아 애니메이션 설정을 조정해 개선했습니다.'],
          ['배운 점', '화면이 움직인다고 끝이 아니라, 사용자가 자연스럽게 느끼는지까지 확인해야 완성된다는 것을 배웠습니다.']
        ]
      },
      {
        title: '그래프 막대 애니메이션이 다시 재생되지 않는 문제',
        rows: [
          ['문제', '스크롤로 다시 돌아왔을 때 막대가 0에서 다시 차오르지 않고 그대로 멈춰 있었습니다.'],
          ['해결', '막대를 0으로 초기화한 뒤, 브라우저가 한 프레임을 그린 다음에 애니메이션을 다시 켜도록 프레임을 두 번 기다리게 했습니다.']
        ]
      },
      {
        title: '체험 앱 화면이 뚝 바뀌는 문제',
        rows: [
          ['문제', '홈 → 탐색 → 상세 → 결제로 넘어갈 때 화면이 순간적으로 교체되어 앱처럼 느껴지지 않았습니다.'],
          ['해결', '화면을 바꾼 뒤 첫 요소를 투명하게 두었다가 한 프레임 뒤에 나타나게 해 짧은 페이드로 이어지게 했습니다.']
        ]
      },
      {
        title: '비밀번호 입력 오류',
        rows: [
          ['문제', '비밀번호를 6자리 이상 누르거나 지울 때 입력 상태가 어긋날 수 있었습니다.'],
          ['해결', '6자리를 넘는 입력을 막고 지우기를 처리했으며, 마지막 자리가 채워진 것을 보여준 뒤 완료 화면이 나오도록 약간의 지연을 두었습니다.']
        ]
      }
    ],
    stack: 'HTML · CSS · JavaScript · Illustrator',
    link: 'https://leeyoujoungg.github.io/Reboot-GIV.github.io/'
  },
  {
    title: 'Is Life',
    img: 'assets/p-islife.webp',
    meta: '1인 프로젝트 · 2026.05 ~ 2026.06',
    lead: '경제적 불안정 삶을 체험하는 시리어스 게임',
    desc: '출근 → 업무 → 퇴근 → 식사 → 수면을 2일간 반복하며 한 달을 압축해 보여주고, 마지막에 급여명세서로 지출이 월급과 같아지는 결말을 마주하게 됩니다.',
    list: [
      ['2일 사이클 구조', '두 번의 하루 후 "한 달이 지났습니다"로 넘어가는 시간 압축 연출'],
      ['인터랙션', '스프라이트 애니메이션, 핫스팟 이동, 타이핑 미니게임(키보드 입력)'],
      ['시청각 연출', '페이드 전환, 암전 + 캡션, Web Audio API로 직접 합성한 효과음'],
      ['엔딩', '영수증 연출로 잔액 0원, "파산하였습니다" 표시']
    ],
    story: 'JavaScript만으로 경제적 불안정 속의 삶을 체험하는 횡스크롤 게임을 만들며, 웹 인터랙션부터 게임 로직까지 직접 구현했습니다.',
    fix: [
      {
        title: 'Space를 연타하면 장면 전환·효과음이 겹치는 문제',
        rows: [
          ['문제', '장면 전환이나 식사, 수면 연출 중에 Space를 계속 누르면 같은 동작이 겹쳐 실행되었습니다.'],
          ['해결', '연출 중에는 입력을 잠그는 상태 값을 두고, 식사처럼 한 번만 일어나야 하는 동작은 실행 여부를 기록해 다시 발동하지 않게 했습니다.']
        ]
      },
      {
        title: '컴퓨터마다 캐릭터 속도가 달라지는 문제',
        rows: [
          ['문제', '프레임이 다른 환경에서는 캐릭터의 이동 속도가 달라졌습니다.'],
          ['해결', '프레임 간 시간 차이로 이동량을 보정하고, 한 번에 튀는 값에는 상한을 두었습니다.']
        ]
      },
      {
        title: '효과음이 나오지 않는 문제',
        rows: [
          ['문제', '브라우저 자동재생 정책 때문에 직접 합성한 효과음이 처음에는 재생되지 않았습니다.'],
          ['해결', '사용자의 첫 키 입력 시점에 오디오를 재개하도록 처리했습니다.']
        ]
      },
      {
        title: '화면 크기에 따라 게임 화면이 깨지는 문제',
        rows: [
          ['문제', '창 크기에 따라 게임 화면이 잘리거나 어긋났습니다.'],
          ['해결', '기준 해상도 대비 창 크기 비율을 계산해 화면 전체를 같은 비율로 확대·축소하도록 했습니다.']
        ]
      }
    ],
    stack: 'HTML · CSS · JavaScript · Illustrator',
    link: 'https://leeyoujoungg.github.io/IsLife/'
  },
  {
    title: '도자기',
    img: 'assets/p-dojagi.webp',
    meta: '1인 프로젝트 · 2026.05 ~ 2026.06',
    lead: '한국 전통 도자기를 소개하는 React 기반 웹사이트',
    desc: '백자·청자·분청사기 등 도자기의 역사, 종류, 제작, 관리 방법을 페이지별로 풀어낸 가이드 사이트입니다. 따뜻한 크림/베이지 톤과 큰 한자 타이포(陶瓷器) 위주로 디자인했습니다.',
    list: [
      ['페이지 구성', 'Main, History, Type, Explore, Making, Care (useState 기반 페이지 전환)'],
      ['인터랙션', '시대별 풀스크린 스크롤, 카드 클릭 시 모달 + 이미지 슬라이드, 탭 전환'],
      ['디자인 → 개발', 'Figma/Illustrator로 비주얼 설계 후 React로 구현']
    ],
    story: 'HTML, CSS, JavaScript와 함께 React로 컴포넌트 기반 UI를 만들며, 각 기술이 어떤 기능에 필요한지 고민하고 활용 범위를 넓혔습니다.',
    fix: [
      {
        title: '카드 모달 안쪽을 눌러도 닫히는 문제',
        rows: [
          ['문제', '모달 안쪽을 눌렀는데도 배경을 누른 것처럼 모달이 닫혔습니다.'],
          ['해결', '클릭 이벤트가 위쪽 배경(오버레이)으로 전달되기 때문이라고 보고, 모달 내용에서 이벤트 전파를 막아 배경을 눌렀을 때만 닫히게 했습니다.']
        ]
      },
      {
        title: '페이지를 오갈 때 스크롤 이벤트가 쌓이는 문제',
        rows: [
          ['문제', 'useState로 페이지를 바꾸는 구조라, 페이지가 바뀔 때마다 스크롤 이벤트가 중복으로 등록될 수 있었습니다.'],
          ['해결', '페이지가 사라질 때 이벤트를 해제하는 정리 함수를 추가했습니다.']
        ]
      },
      {
        title: '시대별 스크롤과 사이드바 표시가 어긋나는 문제',
        rows: [
          ['문제', '스크롤, 사이드바 클릭, 화살표 버튼으로 이동할 때 현재 시대 표시가 서로 달랐습니다.'],
          ['해결', '스크롤할 때 각 시대 섹션의 위치를 계산해 현재 시대 값을 갱신하고, 세 가지 이동 방식이 같은 값을 공유하도록 맞췄습니다.']
        ]
      }
    ],
    stack: 'HTML · CSS · JavaScript · Illustrator · Figma',
    link: 'https://leeyoujoungg.github.io/yujung.github.io/'
  },
  {
    title: 'Thailand',
    img: 'assets/p-thailand.webp',
    meta: '1인 프로젝트 · 웹 디자인 · 2024.09 ~ 2024.12',
    lead: '태국 음식 문화를 소개하는 웹페이지 디자인',
    desc: '"welcome to thailand" 인트로를 시작으로 cook · buy · chef · news · map 메뉴로 태국 음식 문화를 탐색하는 웹페이지입니다. 빨강·주황·초록·노랑의 둥근 도형과 얇은 산세리프 타이포로 태국의 생기를 표현했습니다.',
    list: [
      ['메뉴 구조', 'cook · buy · chef · news · map 5개 메뉴로 요리, 구매, 셰프, 소식, 지도를 구분'],
      ['비주얼 디자인', '별·삼각형·타원 등 둥근 모서리의 컬러 도형을 겹쳐 배치한 그래픽 구성'],
      ['타이포그래피', '큰 사이즈의 얇은 산세리프 "thailand"를 반복 배치해 리듬감 부여']
    ],
    stack: 'Figma',
    link: 'https://www.figma.com/design/MAmP71hZ9dD2u75NdluRRk/Untitled?node-id=76-14&t=16cCxhhTgYFq98I7-1'
  }];

(() => {
  const modal = document.getElementById('pmodal');
  const panel = modal.querySelector('.pmodal__panel');
  const $ = id => document.getElementById(id);
  const reduceM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DUR = reduceM ? 1 : 520, EASE = 'cubic-bezier(.2,.7,.2,1)';
  let origin = null, lastCard = null, busy = false;

  const fill = p => {
    $('pmThumb').style.backgroundImage = `url(${p.img})`;
    $('pmTitle').textContent = p.title;
    $('pmMeta').textContent = p.meta;
    $('pmLead').textContent = p.lead;
    $('pmDesc').textContent = p.desc;
    $('pmDesc').hidden = !p.desc;
    $('pmStory').textContent = p.story || '';
    $('pmStory').hidden = !p.story;
    const fx = $('pmFix'); fx.innerHTML = ''; fx.hidden = !p.fix;
    if (p.fix) {
      const lb = document.createElement('p'); lb.className = 'pmodal__fix-label'; lb.textContent = 'TROUBLE SHOOTING';
      fx.append(lb);
      [].concat(p.fix).forEach(f => {
        const item = document.createElement('div'); item.className = 'pmodal__fix-item';
        const h = document.createElement('h4'); h.textContent = f.title;
        const dl = document.createElement('dl');
        f.rows.forEach(([k, v]) => {
          const d = document.createElement('div');
          const dt = document.createElement('dt'); dt.textContent = k;
          const dd = document.createElement('dd'); dd.textContent = v;
          d.append(dt, dd); dl.append(d);
        });
        item.append(h, dl); fx.append(item);
      });
    }
    const st = $('pmStack');
    st.innerHTML = '';
    st.hidden = !p.stack;
    if (p.stack) {
      const lb = document.createElement('span'); lb.className = 'pmodal__stack-label'; lb.textContent = 'STACK';
      st.append(lb);
      p.stack.split('·').forEach(t => {
        const c = document.createElement('span'); c.className = 'chip'; c.textContent = t.trim(); st.append(c);
      });
    }
    const ul = $('pmList'); ul.innerHTML = '';
    p.list.forEach(([k, v]) => {
      const li = document.createElement('li');
      const b = document.createElement('strong'); b.textContent = k;
      const s = document.createElement('span'); s.textContent = v;
      li.append(b, s); ul.append(li);
    });
    ul.hidden = !p.list.length;
    const a = $('pmLink');
    a.hidden = !p.link;
    if (p.link) a.href = p.link;
  };

  const delta = (from, to) => ({
    x: from.left - to.left, y: from.top - to.top,
    sx: from.width / to.width, sy: from.height / to.height
  });

  function open(card) {
    if (busy) return;
    const p = PROJECTS[+card.dataset.project];
    if (!p) return;
    busy = true; lastCard = card;
    fill(p);
    origin = card.querySelector('.pcard__thumb').getBoundingClientRect();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    const to = panel.getBoundingClientRect();
    const d = delta(origin, to);
    modal.querySelector('.pmodal__backdrop').animate([{ opacity: 0 }, { opacity: 1 }], { duration: DUR, easing: 'ease', fill: 'both' });
    panel.animate([
      { transformOrigin: '0 0', transform: `translate(${d.x}px,${d.y}px) scale(${d.sx},${d.sy})`, opacity: .6 },
      { transformOrigin: '0 0', transform: 'none', opacity: 1 }
    ], { duration: DUR, easing: EASE }).onfinish = () => { busy = false; panel.querySelector('.pmodal__close').focus({ preventScroll: true }); };
    panel.querySelector('.pmodal__body').animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: DUR, delay: DUR * .35, easing: 'ease', fill: 'backwards' });
  }

  function close() {
    if (busy || !modal.classList.contains('is-open')) return;
    busy = true;
    const live = lastCard.querySelector('.pcard__thumb').getBoundingClientRect();
    const to = panel.getBoundingClientRect();
    const d = delta(live, to);
    modal.querySelector('.pmodal__backdrop').animate([{ opacity: 1 }, { opacity: 0 }], { duration: DUR * .8, easing: 'ease', fill: 'forwards' });
    panel.animate([
      { transformOrigin: '0 0', transform: 'none', opacity: 1 },
      { transformOrigin: '0 0', transform: `translate(${d.x}px,${d.y}px) scale(${d.sx},${d.sy})`, opacity: .4 }
    ], { duration: DUR * .8, easing: EASE, fill: 'forwards' }).onfinish = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      modal.getAnimations({ subtree: true }).forEach(a => a.cancel());
      busy = false;
      lastCard.focus({ preventScroll: true });
    };
  }

  document.querySelectorAll('[data-project]').forEach(c => {
    const pj = PROJECTS[+c.dataset.project];
    if (pj && pj.img) c.querySelector('.pcard__thumb').style.backgroundImage = `url(${pj.img})`;
    const go = () => c.dataset.href ? (location.href = c.dataset.href) : open(c);
    c.addEventListener('click', go);
    c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
  modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
