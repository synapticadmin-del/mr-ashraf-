/* =========================================================
   FUSHA PLATFORM — shared shell, config, and mock data layer
   Pages: login, dashboard, bank, challenge, chats, mistakes,
   common-mistakes, build-exam, profile, wallet
   ========================================================= */

/* theme: apply persisted dark mode before first paint */
try {
  const _t = localStorage.getItem('fusha_theme');
  if (_t === 'dark' || (!_t && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}

tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: { 950: '#0D1D18', 900: '#142B24', 850: '#1E3E34', 800: '#24463A', 700: '#2C5346', 600: '#356054', 500: '#3E6E60' },
        'neon-lime': '#EAA72E',
        'neon-limeHover': '#D49420',
        'neon-limeLight': '#FDF3DC',
        'royal-blue': '#142B24',
        'royal-blue-hover': '#1E3E34',
        'royal-blue-dark': '#0D1D18',
        'royal-blue-light': '#5F7A61',
        fusha: {
          forest: '#142B24', forestDark: '#0D1D18', forestLight: '#1E3E34',
          khaki: '#B7B19B', khakiLight: '#E8E4DA', sage: '#5F7A61', sageLight: '#F0F4F1',
          olive: '#8B9565', oliveDark: '#5C6640', sun: '#EAA72E', sunDark: '#96690B', sunHover: '#D49420',
          cream: '#FBFBFA', stone: '#F4F5F0',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        alexandria: ['Alexandria', 'sans-serif'],
      },
    },
  },
};

window.FUSHA = (function () {
  const USER_KEY = 'fusha_user';
  const WALLET_KEY = 'fusha_wallet';
  const MISTAKES_KEY = 'fusha_mistakes';

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function getUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
  }
  function login(name, phone) {
    const u = {
      name: name || 'إبراهيم ممدوح',
      phone: phone || '01000000000',
      grade: 'الصف الثالث الثانوي',
      code: 'FUSHA-' + Math.floor(1000 + Math.random() * 9000) + '-KRDR',
      points: 0,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    return u;
  }
  function logout() {
    localStorage.removeItem(USER_KEY);
    window.location.href = 'login.html';
  }
  function isLoggedIn() { return !!getUser(); }
  function requireAuth() {
    if (!isLoggedIn()) {
      const here = location.pathname.split('/').pop() || 'dashboard.html';
      window.location.href = 'login.html?redirect=' + encodeURIComponent(here);
      return false;
    }
    return true;
  }

  const WALLET_OPS_KEY = 'fusha_wallet_ops';
  function getWallet() {
    const v = parseFloat(localStorage.getItem(WALLET_KEY));
    return isNaN(v) ? 0 : v;
  }
  function getWalletOps() {
    try { return JSON.parse(localStorage.getItem(WALLET_OPS_KEY) || '[]'); } catch { return []; }
  }
  function addWalletOp(op) {
    const ops = getWalletOps();
    ops.unshift(op);
    localStorage.setItem(WALLET_OPS_KEY, JSON.stringify(ops));
    localStorage.setItem(WALLET_KEY, String(getWallet() + (op.amount || 0)));
  }

  const SIDE_LINKS = [
    { href: 'dashboard.html', icon: 'layout-grid', label: 'لوحة الطالب', key: 'dashboard' },
    { href: 'dashboard.html#courses', icon: 'book-open-text', label: 'كورساتك', key: 'courses' },
    { href: 'bank.html', icon: 'layers', label: 'بنك الأسئلة', key: 'bank' },
    { href: 'challenge.html', icon: 'swords', label: 'التحدي', key: 'challenge' },
    { href: 'chats.html', icon: 'messages-square', label: 'المحادثات', key: 'chats' },
    { href: 'mistakes.html', icon: 'notebook-pen', label: 'كشكول الأخطاء', key: 'mistakes' },
    { href: 'common-mistakes.html', icon: 'octagon-alert', label: 'الأخطاء الشائعة', key: 'common-mistakes' },
    { href: 'build-exam.html', icon: 'file-pen-line', label: 'ابني امتحانك', key: 'build-exam' },
    { href: 'wallet.html', icon: 'wallet', label: 'المحفظة', key: 'wallet' },
    { href: 'profile.html', icon: 'user-round', label: 'حسابي', key: 'profile' },
  ];

  function renderSidebar(active) {
    const items = SIDE_LINKS.map(l => {
      const on = active === l.key;
      return `
      <a href="${l.href}" title="${l.label}" class="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 ${on ? 'bg-fusha-sage/40 text-white' : 'text-fusha-sageLight/60 hover:bg-white/5 hover:text-white'} transition-colors">
        ${on ? '<span class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-fusha-sun"></span>' : ''}
        <i data-lucide="${l.icon}" class="w-5 h-5 shrink-0 ${on ? 'text-fusha-sun' : ''}"></i>
        <span class="nav-label">${l.label}</span>
      </a>`;
    }).join('');
    return `
    <aside id="sidebar" class="fixed top-0 right-0 h-screen w-[4.5rem] z-50 bg-fusha-forest rounded-l-[1.5rem] flex flex-col items-center py-4 gap-1.5 shadow-2xl shadow-fusha-forest/30">
      <a href="dashboard.html" class="w-11 h-11 rounded-2xl border border-white/15 shrink-0 overflow-hidden block" title="فُصْحَى">
        <img src="assets/logo.jpg?v=5" alt="فُصْحَى" class="w-full h-full object-cover" />
      </a>
      <button id="side-toggle" class="absolute -left-3 top-[5.5rem] w-7 h-7 rounded-full bg-fusha-sun text-fusha-forestDark flex items-center justify-center shadow-lg hover:bg-fusha-sunHover transition-colors z-10" aria-label="طي/فتح القائمة">
        <i data-lucide="chevron-left" class="collapse-arrow w-4 h-4 transition-transform duration-300"></i>
      </button>
      <nav class="mt-2 flex flex-col items-stretch gap-1 w-full px-2.5 overflow-y-auto platform-scroll">${items}</nav>
      <a href="#" onclick="FUSHA.logout(); return false;" class="mt-auto w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-fusha-sageLight/60 hover:text-rose-300 hover:border-rose-300/40 flex items-center justify-center transition-colors shrink-0" title="تسجيل الخروج">
        <i data-lucide="log-out" class="w-5 h-5"></i>
      </a>
    </aside>`;
  }

  function renderTopbar() {
    const u = getUser();
    return `
    <header class="sticky top-0 z-40 bg-fusha-cream/90 backdrop-blur-md px-4 sm:px-7 py-4 flex items-center gap-3">
      <button id="themeToggle" class="w-10 h-10 rounded-full bg-fusha-sun/15 border border-fusha-sun/40 flex items-center justify-center hover:bg-fusha-sun/25 transition-colors" title="الوضع الليلي">
        <i data-lucide="sun" class="icon-sun w-5 h-5 text-fusha-sunDark"></i>
        <i data-lucide="moon" class="icon-moon w-5 h-5 text-fusha-sun"></i>
      </button>
      <button class="relative w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:border-fusha-sage transition-colors" title="الإشعارات">
        <i data-lucide="bell" class="w-5 h-5 text-fusha-forest"></i>
        <span class="absolute -top-1 -left-1 min-w-5 h-5 px-1 rounded-full bg-fusha-forest text-white text-[10px] font-black flex items-center justify-center">0</span>
      </button>
      <button class="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:border-fusha-sage transition-colors" title="بحث">
        <i data-lucide="search" class="w-5 h-5 text-fusha-forest"></i>
      </button>
      <a href="profile.html" class="mr-auto flex items-center gap-2.5 bg-fusha-forest text-white rounded-full py-1.5 pr-1.5 pl-4 shadow-md shadow-fusha-forest/20 hover:bg-fusha-forestLight transition-colors" title="حسابي">
        <span class="w-8 h-8 rounded-full bg-fusha-sun text-fusha-forestDark flex items-center justify-center">
          <i data-lucide="user-round" class="w-4 h-4"></i>
        </span>
        <span class="text-sm font-bold whitespace-nowrap">${esc(u?.name || 'طالب فُصْحَى')}</span>
      </a>
    </header>`;
  }

  function renderFooter() {
    return `
    <footer class="bg-space-900 text-white diagonal-cut-top pt-24 pb-12 mt-10">
      <div class="max-w-7xl 2xl:max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/10">
          <div class="flex items-center gap-4">
            <img src="assets/fusha-brand-logo-white.png" alt="فُصْحَى" class="h-12 w-auto object-contain" />
            <div>
              <h4 class="font-alexandria font-bold text-xl text-white">منصة وتطبيق فُصْحَى</h4>
              <p class="text-xs text-neon-lime">أستاذ أشرف سليم — خبير تدريس اللغة العربية</p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <a href="https://api.whatsapp.com/send?phone=201000000000" target="_blank" rel="noopener" class="w-10 h-10 rounded-full bg-emerald-600/30 text-emerald-400 hover:bg-emerald-500 hover:text-space-900 flex items-center justify-center transition-all border border-emerald-500/40" title="واتساب الحجز والدعم"><i data-lucide="message-circle" class="w-4 h-4"></i></a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener" class="w-10 h-10 rounded-full bg-red-600/30 text-red-400 hover:bg-red-600 hover:text-space-900 flex items-center justify-center transition-all border border-red-500/40" title="يوتيوب"><i data-lucide="youtube" class="w-4 h-4"></i></a>
            <a href="https://www.facebook.com/fusha.application" target="_blank" rel="noopener" class="w-10 h-10 rounded-full bg-blue-600/30 text-blue-400 hover:bg-blue-600 hover:text-space-900 flex items-center justify-center transition-all border border-blue-500/40" title="فيسبوك"><i data-lucide="facebook" class="w-4 h-4"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noopener" class="w-10 h-10 rounded-full bg-pink-600/30 text-pink-400 hover:bg-pink-600 hover:text-space-900 flex items-center justify-center transition-all border border-pink-500/40" title="إنستجرام"><i data-lucide="instagram" class="w-4 h-4"></i></a>
            <a href="https://tiktok.com" target="_blank" rel="noopener" class="w-10 h-10 rounded-full bg-white/10 hover:bg-neon-lime hover:text-space-900 flex items-center justify-center transition-all border border-white/20" title="تيك توك"><i data-lucide="music-2" class="w-4 h-4"></i></a>
          </div>
        </div>
        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>Fusha Mobile Application — جميع الحقوق محفوظة © <span id="currentYear">2026</span></div>
          <div class="flex flex-wrap items-center justify-center sm:justify-end gap-1.5" dir="ltr">
            <span>Designed & Developed with passion for</span>
            <span class="font-bold text-white">Mr. Ashraf Selim</span>
            <span>by</span>
            <a href="https://engaz.tech" target="_blank" rel="noopener" class="font-bold text-white hover:text-neon-lime transition-colors">⚡ Engaz.tech Team</a>
          </div>
        </div>
      </div>
    </footer>`;
  }

  function hero(icon, title, sub, extraHtml) {
    return `
    <div class="bg-space-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-fusha-forest/15 relative overflow-hidden">
      <div class="absolute -end-10 -top-16 w-64 h-64 rounded-full bg-royal-blue/25 blur-3xl pointer-events-none"></div>
      <div class="absolute -start-14 -bottom-20 w-72 h-72 rounded-full bg-neon-lime/10 blur-3xl pointer-events-none"></div>
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="font-alexandria font-black text-2xl sm:text-3xl flex items-center gap-3">
            <i data-lucide="${icon}" class="w-8 h-8 text-neon-lime shrink-0"></i>
            <span>${title}</span>
          </h1>
          ${sub ? `<p class="text-sm text-white/80 mt-2 font-medium">${sub}</p>` : ''}
        </div>
        ${extraHtml || ''}
      </div>
    </div>`;
  }

  function mount(active) {
    const h = document.getElementById('app-header');
    const f = document.getElementById('app-footer');
    const main = document.querySelector('main');
    if (h) h.innerHTML = renderSidebar(active);
    if (main) {
      const wrap = document.createElement('div');
      wrap.id = 'page';
      wrap.className = 'mr-[4.5rem] transition-all duration-300';
      main.before(wrap);
      wrap.appendChild(main);
      if (f) wrap.appendChild(f);
      main.insertAdjacentHTML('beforebegin', renderTopbar());
    }
    if (f) f.innerHTML = renderFooter();
    const y = document.getElementById('currentYear');
    if (y) y.textContent = new Date().getFullYear();

    const sb = document.getElementById('sidebar'), pg = document.getElementById('page'), tg = document.getElementById('side-toggle');
    if (sb && pg && tg) {
      tg.addEventListener('click', () => {
        const open = sb.classList.toggle('expanded');
        sb.classList.toggle('w-[4.5rem]', !open);
        sb.classList.toggle('w-60', open);
        pg.classList.toggle('mr-[4.5rem]', !open);
        pg.classList.toggle('mr-60', open);
      });
    }
    const tt = document.getElementById('themeToggle');
    if (tt) {
      tt.addEventListener('click', () => {
        const dark = document.documentElement.classList.toggle('dark');
        try { localStorage.setItem('fusha_theme', dark ? 'dark' : 'light'); } catch (e) {}
      });
    }
    if (window.lucide) window.lucide.createIcons();
  }

  function toast(msg, ok) {
    let t = document.getElementById('fushaToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'fushaToast';
      t.className = 'fixed bottom-6 inset-x-0 mx-auto w-fit z-[120] px-5 py-3 rounded-2xl text-sm font-black text-white shadow-2xl transition-all duration-300 translate-y-20 opacity-0';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.background = ok === false ? '#E11D48' : '#142B24';
    requestAnimationFrame(() => { t.classList.remove('translate-y-20', 'opacity-0'); });
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.add('translate-y-20', 'opacity-0'), 3200);
  }

  function getMistakes() {
    try { return JSON.parse(localStorage.getItem(MISTAKES_KEY) || '[]'); } catch { return []; }
  }
  function addMistake(m) {
    const list = getMistakes();
    list.unshift(m);
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(list));
  }

  return { esc, getUser, login, logout, isLoggedIn, requireAuth, getWallet, getWalletOps, addWalletOp, mount, hero, toast, getMistakes, addMistake };
})();
