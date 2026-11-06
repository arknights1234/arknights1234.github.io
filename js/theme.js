// 야간/주간 모드. head에서 동기 로드해 화면이 그려지기 전에 적용한다.
(function () {
  var KEY = 'ac-theme';
  var root = document.documentElement;
  var theme = 'dark';
  try {
    var saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch (e) {}

  function apply(next) {
    theme = next;
    root.setAttribute('data-theme', next);
    root.style.colorScheme = next;
  }
  apply(theme);

  var SUN = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>';

  function mount() {
    var slot = document.querySelector('[data-theme-slot]');
    if (!slot) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-btn';
    function sync() {
      // 지금 누르면 바뀔 모드를 아이콘과 설명으로 보여 준다
      btn.innerHTML = theme === 'dark' ? SUN : MOON;
      var label = theme === 'dark' ? '주간 모드로 전환' : '야간 모드로 전환';
      btn.setAttribute('aria-label', label);
      btn.title = label;
    }
    btn.addEventListener('click', function () {
      apply(theme === 'dark' ? 'light' : 'dark');
      try { localStorage.setItem(KEY, theme); } catch (e) {}
      sync();
    });
    sync();
    slot.appendChild(btn);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
