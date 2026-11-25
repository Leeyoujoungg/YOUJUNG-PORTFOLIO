/* ===== 푸터 'W3C 웹 표준 검증' 배지 → 검증 결과 팝업 =====
   기본 <dialog> 사용 : 포커스 가두기 · Esc 닫기 · 닫으면 배지로 포커스 복귀를 브라우저가 처리 */
(() => {
  const dlg = document.getElementById('w3cDialog');
  const open = document.getElementById('w3cOpen');
  if (!dlg || !open || typeof dlg.showModal !== 'function') { if (open) open.hidden = true; return; }

  open.addEventListener('click', () => dlg.showModal());
  dlg.addEventListener('click', e => {
    if (e.target.closest('[data-w3c-close]') || e.target === dlg) dlg.close(); /* 버튼 또는 바깥(배경) 클릭 */
  });

  /* 캡처 이미지가 아직 없으면 그 칸은 숨김 (assets/w3c/html.png · css.png 를 넣으면 자동으로 보임) */
  dlg.querySelectorAll('.w3c__shots img').forEach(img => {
    const hide = () => { img.closest('figure').hidden = true; };
    img.addEventListener('error', hide);
    if (img.complete && img.naturalWidth === 0) hide();
  });

  /* 배포된 주소에서 볼 때만 : W3C 검사기로 이 사이트를 바로 검사하는 링크 */
  if (/^https?:$/.test(location.protocol) && !/^(localhost|127\.|\[::1\])/.test(location.hostname)) {
    const page = location.href.split('#')[0];
    const css = new URL('css/dakku.css', page).href;
    document.getElementById('w3cLiveHtml').href = 'https://validator.w3.org/nu/?doc=' + encodeURIComponent(page);
    document.getElementById('w3cLiveCss').href = 'https://jigsaw.w3.org/css-validator/validator?profile=css3svg&uri=' + encodeURIComponent(css);
    document.getElementById('w3cLive').hidden = false;
  }
})();
