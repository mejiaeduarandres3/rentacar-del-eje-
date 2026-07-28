(function() {
  var SUPABASE_URL = 'https://zzufpmagbfvlqexivzdx.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dWZwbWFnYmZ2bHFleGl2emR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNjQwNDIsImV4cCI6MjEwMDg0MDA0Mn0.h2KzwmRC4kXuoi_0J0mx3BGarDR1xPRgcs8_I8MSqI4';

  window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  window.checkAuth = async function() {
    var s = await window.sb.auth.getSession();
    var session = s.data.session;
    if (!session && !window.location.pathname.includes('login')) {
      window.location.href = '/admin/login.html';
      return null;
    }
    return session;
  };

  window.logout = async function() {
    await window.sb.auth.signOut();
    window.location.href = '/admin/login.html';
  };

  if (!window.location.pathname.includes('login')) {
    window.checkAuth();
  }

  window.fmtMoney = function(n) {
    return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
  };

  window.fmtDate = function(dateStr) {
    if (!dateStr) return '—';
    var d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  window.toast = function(message, type) {
    type = type || 'success';
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    var el = document.createElement('div');
    el.className = 'toast';
    el.style.cssText = 'position:fixed;bottom:24px;right:24px;padding:14px 24px;border-radius:10px;font-size:13px;font-weight:600;z-index:999;box-shadow:0 8px 24px rgba(0,0,0,.2);font-family:Inter,sans-serif;transition:opacity .3s;';
    el.style.background = type === 'success' ? '#27ae60' : '#c0392b';
    el.style.color = 'white';
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(function() { el.style.opacity = '0'; setTimeout(function() { el.remove(); }, 300); }, 3000);
  };

  window.daysBetween = function(start, end) {
    var a = new Date(start + 'T12:00:00');
    var b = new Date(end + 'T12:00:00');
    return Math.max(1, Math.round((b - a) / 86400000));
  };

  window.expiryStatus = function(dateStr) {
    if (!dateStr) return 'gray';
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var exp = new Date(dateStr + 'T12:00:00');
    var diff = (exp - today) / 86400000;
    if (diff < 0) return 'red';
    if (diff < 30) return 'yellow';
    return 'green';
  };

  window.genReservaNum = function() {
    var y = new Date().getFullYear();
    var seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
    return 'RCE-' + y + '-' + seq;
  };

  document.addEventListener('DOMContentLoaded', function() {
    var path = window.location.pathname;
    document.querySelectorAll('.admin-nav a').forEach(function(a) {
      var href = a.getAttribute('href');
      if (href === path || (path.endsWith('/admin/') && href === '/admin/') ||
          (path.endsWith('index.html') && href === '/admin/')) {
        a.classList.add('active');
      }
    });
  });
})();
