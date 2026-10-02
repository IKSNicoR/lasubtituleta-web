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

  // Panel de la extensión: al pasar por una tarjeta se ilumina su zona
  var fig = document.querySelector('.panel-fig');
  if (fig) {
    Array.prototype.forEach.call(document.querySelectorAll('.product .card[data-zone]'), function (card) {
      var on = function () { fig.setAttribute('data-active', card.getAttribute('data-zone')); };
      var off = function () { fig.setAttribute('data-active', '0'); };
      card.addEventListener('mouseenter', on); card.addEventListener('mouseleave', off);
      card.addEventListener('focusin', on); card.addEventListener('focusout', off);
    });
  }

  // Eventos de GA4 (si gtag no existe, no hace nada)
  var track = function (name, params) {
    try { if (typeof gtag === 'function') gtag('event', name, params); } catch (e) {}
  };
  var placementOf = function (el) {
    if (el.closest('.grille')) return 'parrilla';
    if (el.closest('.install')) return 'instalacion';
    if (el.closest('.closing')) return 'cierre';
    if (el.closest('.hero')) return 'hero';
    return 'otro';
  };
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    if (a.dataset.os) track('download_click', { os: a.dataset.os, placement: placementOf(a) });
    else if (a.dataset.provider) track('api_key_click', { provider: a.dataset.provider });
    else if (a.dataset.video) track('video_click', { video: a.dataset.video, placement: a.closest('.tuts') ? 'tutoriales' : (a.closest('.cards') ? 'que-hace' : 'otro') });
    else if (a.closest('.lang')) track('language_switch', { to: a.getAttribute('lang') });
    else if (/youtu\.be|youtube\.com/.test(a.href) && a.closest('.after')) track('install_video_click', {});
  });
})();
