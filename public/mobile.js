/* Mobile interaction layer: snap rails, segmented tabs synced to swipe panes, bottom sheets, show-more.
   Pairs with /cse/mobile.css. Under 1024px only; everything it inserts is display:none on desktop. */
(function () {
  var MQ = window.matchMedia('(max-width:1199px)');
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raf = function (fn) { var t = false; return function () { if (t) return; t = true; requestAnimationFrame(function () { t = false; fn(); }); }; };

  function nearest(rail) {
    var kids = rail.children, r = rail.getBoundingClientRect();
    var pad = parseFloat(getComputedStyle(rail).scrollPaddingLeft) || 0;
    var x = r.left + pad, best = 0, bd = Infinity;
    for (var i = 0; i < kids.length; i++) {
      var d = Math.abs(kids[i].getBoundingClientRect().left - x);
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }
  function offsetIn(rail, el) { return el.getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft - (parseFloat(getComputedStyle(rail).scrollPaddingLeft) || 0); }

  /* ---- rails ---- */
  function rails() {
    document.querySelectorAll('[data-mrail]').forEach(function (rail) {
      if (rail._mrail) return; rail._mrail = true;
      var n = rail.children.length;
      if (n < 2 || /\bnodots\b/.test(rail.getAttribute('data-mrail') || '')) return;
      var dots = document.createElement('div');
      dots.className = 'm-dots'; dots.setAttribute('aria-hidden', 'true');
      dots.innerHTML = '<span class="m-track"><i></i></span><span class="m-n">1 / ' + n + '</span>';
      rail.insertAdjacentElement('afterend', dots);
      var fill = dots.querySelector('i'), num = dots.querySelector('.m-n');
      fill.style.setProperty('--w', (100 / n) + '%');
      var upd = raf(function () { var i = nearest(rail); fill.style.transform = 'translateX(' + (i * 100) + '%)'; num.textContent = (i + 1) + ' / ' + n; });
      rail.addEventListener('scroll', upd, { passive: true });
      upd();
    });
  }

  /* ---- segmented tabs + panes ---- */
  function tabs() {
    document.querySelectorAll('[data-mtabs]').forEach(function (rail) {
      if (rail._mtabs) return; rail._mtabs = true;
      var panes = [].slice.call(rail.children);
      if (panes.length < 2) return;
      var seg = document.createElement('div');
      seg.className = 'm-seg ' + (rail.getAttribute('data-mtabs') || '');
      seg.setAttribute('role', 'tablist');
      var numbered = false;
      var btns = panes.map(function (p, i) {
        var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab');
        b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        var label = p.getAttribute('data-mtab') || ('<i>0' + (i + 1) + '</i>');
        /* "<i>01</i>Data": the number stays, the word collapses on inactive segments */
        var m = label.match(/^(<i>[^<]*<\/i>)\s*([\s\S]+)$/);
        if (m) { numbered = true; label = m[1] + '<span class="lbl">' + m[2] + '</span>'; }
        b.innerHTML = label;
        b.addEventListener('click', function () { go(i, true); });
        seg.appendChild(b); return b;
      });
      if (numbered) seg.classList.add('numbered');
      var railSel = rail.getAttribute('data-mtabs-rail'), railEl = railSel ? document.querySelector(railSel) : null;
      var railTotal = parseInt(rail.getAttribute('data-mtabs-rail-total'), 10) || panes.length;
      var slotSel = rail.getAttribute('data-mtabs-seg'), slot = slotSel ? document.querySelector(slotSel) : null;
      if (slot) slot.appendChild(seg); else rail.insertAdjacentElement('beforebegin', seg);
      var cur = -1, settling = 0, settleT = 0, touching = false, stableSL = -1, even = rail.hasAttribute('data-mtabs-even');
      function place(i) {
        var b = btns[i];
        /* horizontal only: scrollIntoView would also drag the page down to the strip on load */
        if (seg.scrollWidth > seg.clientWidth + 2) seg.scrollTo({ left: Math.max(0, b.offsetLeft - (seg.clientWidth - b.offsetWidth) / 2), behavior: RM ? 'auto' : 'smooth' });
      }
      function fit(i) { if (!MQ.matches || even) { rail.style.height = ''; return; } var h = panes[i].offsetHeight; if (h) rail.style.height = h + 'px'; }
      function setActive(i, silent) {
        if (i === cur) return; cur = i;
        btns.forEach(function (b, k) { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
        if (railEl && MQ.matches) railEl.style.setProperty('--rail', Math.round((i + 1) / railTotal * 100) + '%');
        place(i);
        if (!silent) rail.dispatchEvent(new CustomEvent('mtabs:change', { bubbles: true, detail: { index: i, pane: panes[i] } }));
      }
      /* once the swipe has stopped: land exactly on the nearest pane (iOS can leave a snap rail resting between two),
         then size the rail to it. Resizing the scroller mid-fling is what threw WebKit's snap off in the first place. */
      function settle() {
        if (touching) return;
        var i = nearest(rail), target = offsetIn(rail, panes[i]);
        if (MQ.matches && Math.abs(rail.scrollLeft - target) > 2) rail.scrollTo({ left: target, behavior: RM ? 'auto' : 'smooth' });
        setActive(i); fit(i);
      }
      /* settle only once the position has held still for a tick: WebKit's snap tail can keep moving without
         firing scroll events, and a scrollTo in the middle of it is the jerk it was meant to cure */
      function check() { if (touching) return; if (rail.scrollLeft !== stableSL) { stableSL = rail.scrollLeft; settleT = setTimeout(check, 140); return; } settle(); }
      function armSettle() { clearTimeout(settleT); stableSL = rail.scrollLeft; settleT = setTimeout(check, 140); }
      function go(i, smooth) {
        settling = Date.now() + 700;
        rail.scrollTo({ left: offsetIn(rail, panes[i]), behavior: smooth && !RM ? 'smooth' : 'auto' });
        setActive(i); fit(i);
      }
      /* the tabs follow the finger; only a real horizontal move counts, layout-only scroll events leave the active pane alone */
      var lastSL = rail.scrollLeft;
      var follow = raf(function () { if (Math.abs(rail.scrollLeft - lastSL) < 2) return; lastSL = rail.scrollLeft; if (Date.now() < settling) return; setActive(nearest(rail)); });
      rail.addEventListener('scroll', function () { if (!touching) armSettle(); follow(); }, { passive: true });
      if ('onscrollend' in window) rail.addEventListener('scrollend', function () { if (!touching) { clearTimeout(settleT); settle(); } });
      rail.addEventListener('touchstart', function () { touching = true; clearTimeout(settleT); }, { passive: true });
      rail.addEventListener('touchend', function () { touching = false; armSettle(); }, { passive: true });
      rail.addEventListener('touchcancel', function () { touching = false; armSettle(); }, { passive: true });
      rail.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') go(Math.min(cur + 1, panes.length - 1), true); if (e.key === 'ArrowLeft') go(Math.max(cur - 1, 0), true); });
      if ('ResizeObserver' in window) new ResizeObserver(function () { if (cur >= 0) { place(cur); fit(cur); } }).observe(rail);
      panes.forEach(function (p) { p.setAttribute('role', 'tabpanel'); });
      setActive(0);
      requestAnimationFrame(function () { place(0); fit(0); });
      MQ.addEventListener && MQ.addEventListener('change', function () { rail.style.height = ''; if (MQ.matches) requestAnimationFrame(function () { place(cur); fit(cur); }); });
    });
  }

  /* ---- sheets: drag the handle / header down to dismiss ---- */
  function sheets() {
    var panels = [].slice.call(document.querySelectorAll('dialog:not([data-mcenter]) > .dlg, [data-msheet]'));
    panels.forEach(function (p) {
      if (p._msheet) return; p._msheet = true;
      p.classList.add('m-sheet');
      var handle = document.createElement('span'); handle.className = 'm-handle'; handle.setAttribute('aria-hidden', 'true');
      p.insertBefore(handle, p.firstChild);
      var host = p.parentElement; if (host && host.tagName !== 'DIALOG') host.classList.add('m-sheet-host');
      var drag = false, y0 = 0, dy = 0, t0 = 0;
      function closeIt() {
        var d = p.closest('dialog'); if (d && d.open) { d.close(); return; }
        var sel = p.getAttribute('data-msheet-close'); var c = sel ? document.querySelector(sel) : null;
        if (c) c.click();
      }
      function grabbable(t) { return t.closest('.m-handle,[data-msheet-grab],.bar-top') && !t.closest('button,a,input,select,textarea'); }
      p.addEventListener('pointerdown', function (e) {
        if (!MQ.matches || e.pointerType === 'mouse' || !grabbable(e.target)) return;
        drag = true; dy = 0; y0 = e.clientY; t0 = performance.now(); p.classList.add('m-dragging');
        if (p.setPointerCapture) { try { p.setPointerCapture(e.pointerId); } catch (err) {} }
      });
      p.addEventListener('pointermove', function (e) { if (!drag) return; dy = Math.max(0, e.clientY - y0); p.style.transform = 'translateY(' + dy + 'px)'; });
      function end() {
        if (!drag) return; drag = false; p.classList.remove('m-dragging');
        var v = dy / Math.max(1, performance.now() - t0);
        p.style.transform = '';
        if (dy > 110 || v > 0.7) closeIt();
      }
      p.addEventListener('pointerup', end); p.addEventListener('pointercancel', end);
      /* arrival: the sheet rises once each time its host opens */
      var d = p.closest('dialog');
      if (d) { new MutationObserver(function () { if (d.open && MQ.matches) { p.classList.remove('m-rise'); void p.offsetWidth; p.classList.add('m-rise'); } }).observe(d, { attributes: true, attributeFilter: ['open'] }); }
      else if (host) { new MutationObserver(function () { var shown = getComputedStyle(host).display !== 'none' && !host.hidden; if (shown && MQ.matches) { p.classList.remove('m-rise'); void p.offsetWidth; p.classList.add('m-rise'); } }).observe(host, { attributes: true, attributeFilter: ['class', 'style', 'hidden', 'open'] }); }
    });
  }

  /* ---- show N, then the rest ---- */
  function more() {
    document.querySelectorAll('[data-mmore]').forEach(function (box) {
      if (box._mmore) return; box._mmore = true;
      var spec = (box.getAttribute('data-mmore') || '4').split(/\s+/);
      var n = parseInt(spec[0], 10) || 4, sel = spec.slice(1).join(' ');
      var items = [].slice.call(sel ? box.querySelectorAll(':scope > ' + sel) : box.children);
      if (items.length <= n) return;
      var rest = items.slice(n);
      var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'm-more'; btn.setAttribute('aria-expanded', 'false');
      var label = box.getAttribute('data-mmore-label') || ('Show all ' + items.length);
      btn.innerHTML = '<span>' + label + '</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
      var open = false;
      function apply() { rest.forEach(function (el) { el.classList.toggle('m-hide', !open); }); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); btn.querySelector('span').textContent = open ? (box.getAttribute('data-mmore-less') || 'Show fewer') : label; }
      btn.addEventListener('click', function () { open = !open; apply(); });
      apply();
      var anchor = box.getAttribute('data-mmore-after'); var target = anchor ? box.querySelector(anchor) : null;
      if (target) target.insertAdjacentElement('afterend', btn); else box.insertAdjacentElement('afterend', btn);
    });
  }

  /* ---- move a wide block into a sheet on tap ---- */
  function toSheet() {
    var host = null, slot = null, home = null, placeholder = null;
    function ensureHost() {
      if (host) return;
      host = document.createElement('div'); host.className = 'm-tosheet-host'; host.setAttribute('role', 'dialog'); host.setAttribute('aria-modal', 'true');
      slot = document.createElement('div'); slot.setAttribute('data-msheet', ''); slot.setAttribute('data-msheet-close', '.m-tosheet-x');
      slot.innerHTML = '<div class="m-tosheet-head" data-msheet-grab><b></b><button type="button" class="m-tosheet-x">CLOSE ✕</button></div>';
      host.appendChild(slot); document.body.appendChild(host);
      function close() { if (!home) return; host.classList.remove('open'); document.documentElement.style.overflow = ''; placeholder.replaceWith(home); home = placeholder = null; }
      host.addEventListener('click', function (e) { if (e.target === host || e.target.closest('.m-tosheet-x')) close(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && host.classList.contains('open')) close(); });
      sheets();
    }
    document.querySelectorAll('[data-mtosheet]').forEach(function (el) {
      if (el._mtosheet) return; el._mtosheet = true;
      var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'm-more m-tosheet-btn';
      btn.innerHTML = '<span>' + (el.getAttribute('data-mtosheet') || 'Open') + '</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>';
      el.insertAdjacentElement('beforebegin', btn);
      el.classList.add('m-hide');
      btn.addEventListener('click', function () {
        ensureHost();
        if (home) return;
        home = el; placeholder = document.createComment('m-tosheet');
        el.replaceWith(placeholder);
        slot.querySelector('b').textContent = el.getAttribute('data-mtosheet-title') || btn.querySelector('span').textContent;
        slot.appendChild(el); el.classList.remove('m-hide');
        host.classList.add('open'); document.documentElement.style.overflow = 'hidden';
      });
      MQ.addEventListener && MQ.addEventListener('change', function () { if (!MQ.matches) el.classList.remove('m-hide'); else if (!home) el.classList.add('m-hide'); });
    });
  }

  function init() { rails(); tabs(); sheets(); more(); toSheet(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.__kmobile = { refresh: init, isMobile: function () { return MQ.matches; } };
})();
