/* La Subtituleta · comportamiento mínimo (sin dependencias) */
(function () {
  'use strict';

  // Pestañas Windows / Mac (con teclado) y selección según el sistema del visitante
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  if (tabs.length) {
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          var next = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
          select(tabs[next], true);
        }
      });
    });
    var platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
    var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (/mac/i.test(platform) && !isIOS) select(document.getElementById('tab-mac'), false);
  }
})();
