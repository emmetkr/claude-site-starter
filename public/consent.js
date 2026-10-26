// Consent gate. Trackers are written as <script type="text/plain" data-consent src="..."> (or inline) and do
// nothing until the visitor accepts. Accept runs them and remembers; decline remembers and leaves them off.
// Clear the choice with: localStorage.removeItem('site_consent_v1')
(function () {
  var KEY = 'site_consent_v1', banner = document.getElementById('consent-banner');
  var prior = null; try { prior = localStorage.getItem(KEY); } catch (e) {}
  function run() {
    document.querySelectorAll('script[type="text/plain"][data-consent]').forEach(function (s) {
      var n = document.createElement('script');
      for (var i = 0; i < s.attributes.length; i++) { var a = s.attributes[i]; if (a.name !== 'type' && a.name !== 'data-consent') n.setAttribute(a.name, a.value); }
      n.text = s.text; s.parentNode.replaceChild(n, s);
    });
    document.dispatchEvent(new CustomEvent('consent:granted'));
  }
  function choose(v) { try { localStorage.setItem(KEY, v); } catch (e) {} if (banner) banner.hidden = true; if (v === 'yes') run(); }
  if (prior === 'yes') run();
  else if (!prior && banner) {
    banner.hidden = false;
    banner.querySelector('[data-accept]').addEventListener('click', function () { choose('yes'); });
    banner.querySelector('[data-decline]').addEventListener('click', function () { choose('no'); });
  }
})();
