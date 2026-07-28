// =============================================
// CONFIGURACION SUPABASE
// =============================================
const SUPABASE_URL = 'https://zzufpmagbfvlqexivzdx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dWZwbWFnYmZ2bHFleGl2emR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNjQwNDIsImV4cCI6MjEwMDg0MDA0Mn0.h2KzwmRC4kXuoi_0J0mx3BGarDR1xPRgcs8_I8MSqI4';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// =============================================
// AUTH
// =============================================
async function checkAuth() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session && !window.location.pathname.includes('login')) {
    window.location.href = '/admin/login.html';
    return null;
  }
  return session;
}

async function logout() {
  await sb.auth.signOut();
  window.location.href = '/admin/login.html';
}

// Verificar auth al cargar cada pagina (excepto login)
if (!window.location.pathname.includes('login')) {
  checkAuth();
}

// =============================================
// HELPERS
// =============================================
function fmtMoney(n) {
  return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}

function toast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.style.cssText = 'position:fixed;bottom:24px;right:24px;padding:14px 24px;border-radius:10px;font-size:13px;font-weight:600;z-index:999;box-shadow:0 8px 24px rgba(0,0,0,.2);font-family:Inter,sans-serif;transition:opacity .3s;';
  el.style.background = type === 'success' ? '#27ae60' : '#c0392b';
  el.style.color = 'white';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3000);
}

function daysBetween(start, end) {
  const a = new Date(start + 'T12:00:00');
  const b = new Date(end + 'T12:00:00');
  return Math.max(1, Math.round((b - a) / 86400000));
}

function expiryStatus(dateStr) {
  if (!dateStr) return 'gray';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(dateStr + 'T12:00:00');
  const diff = (exp - today) / 86400000;
  if (diff < 0) return 'red';
  if (diff < 30) return 'yellow';
  return 'green';
}

function genReservaNum() {
  const y = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `RCE-${y}-${seq}`;
}

// Set active nav
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  document.querySelectorAll('.admin-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path.endsWith('/admin/') && href === '/admin/') ||
        (path.endsWith('index.html') && href === '/admin/')) {
      a.classList.add('active');
    }
  });
});
