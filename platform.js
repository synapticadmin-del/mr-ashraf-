/* =========================================================
   FUSHA PLATFORM — shared shell, config, and mock data layer
   Pages: login, dashboard, bank, challenge, chats, mistakes,
   common-mistakes, build-exam, profile, wallet
   ========================================================= */

tailwind.config = {
  theme: {
    extend: {
      colors: {
        space: { 950: '#050817', 900: '#0A0E27', 850: '#0C1233', 800: '#111B47', 700: '#1A2456', 600: '#23306B', 500: '#2D3A6E' },
        'neon-lime': '#AADB1E',
        'neon-limeHover': '#8BC200',
        'neon-limeLight': '#F0F9D6',
        'royal-blue': '#0033CC',
        'royal-blue-hover': '#1A4FE0',
        'royal-blue-dark': '#001A66',
        'royal-blue-light': '#6699FF',
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

  const NAV_LINKS = [
    { href: 'dashboard.html', icon: 'layout-dashboard', label: 'لوحة الطالب', key: 'dashboard' },
    { href: 'dashboard.html#courses', icon: 'book-open', label: 'كورساتك', key: 'courses' },
    { href: 'mistakes.html', icon: 'notebook-pen', label: 'كشكول الأخطاء', key: 'mistakes' },
    { href: 'wallet.html', icon: 'wallet', label: 'المحفظة', key: 'wallet' },
    { href: 'challenge.html', icon: 'swords', label: 'التحدي', key: 'challenge' },
    { href: 'bank.html', icon: 'layers', label: 'بنك الأسئلة', key: 'bank' },
  ];
  const MORE_LINKS = [
    { href: 'build-exam.html', icon: 'file-pen-line', label: 'ابني امتحانك', key: 'build-exam' },
    { href: 'chats.html', icon: 'messages-square', label: 'مجموعة الطلاب والمعلم', key: 'chats' },
    { href: 'common-mistakes.html', icon: 'alert-triangle', label: 'الأخطاء الشائعة', key: 'common-mistakes' },
  ];

  function linkCls(active, key) {
    const base = 'px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ';
    return base + (active === key ? 'bg-royal-blue text-white shadow-sm' : 'text-slate-600 hover:text-space-900 hover:bg-stone-100');
  }

  function renderHeader(active) {
    const u = getUser();
    const w = { balance: getWallet() };
    const navItems = NAV_LINKS.map(l => `
      <a href="${l.href}" class="${linkCls(active, l.key)}">
        <i data-lucide="${l.icon}" class="w-4 h-4 ${active === l.key ? 'text-neon-lime' : 'text-royal-blue'}"></i>
        <span>${l.label}</span>
      </a>`).join('');
    const moreItems = MORE_LINKS.map(l => `
      <a href="${l.href}" class="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-fusha-stone hover:text-royal-blue transition rounded-xl">
        <i data-lucide="${l.icon}" class="w-4 h-4 text-royal-blue"></i><span>${l.label}</span>
      </a>`).join('');
    const allMobile = NAV_LINKS.concat(MORE_LINKS).map(l => `
      <a href="${l.href}" class="flex items-center gap-2.5 px-4 py-3 text-sm font-bold ${active === l.key ? 'text-royal-blue bg-royal-blue/5' : 'text-slate-700'} rounded-xl">
        <i data-lucide="${l.icon}" class="w-4 h-4 text-royal-blue"></i><span>${l.label}</span>
      </a>`).join('');

    const userArea = u ? `
      <div class="relative">
        <button id="userMenuBtn" class="flex items-center gap-2 cursor-pointer group">
          <span class="hidden sm:flex flex-col items-start leading-tight">
            <span class="text-[9px] text-slate-400 font-bold">أهلاً</span>
            <span class="text-[11px] font-black text-space-900">${esc(u.name)}</span>
          </span>
          <span class="hidden md:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-neon-limeLight text-[10px] font-black text-[#5c7a00]">
            <i data-lucide="coins" class="w-3 h-3"></i><span id="navPoints">${w.balance}</span>
          </span>
          <span class="w-9 h-9 rounded-full bg-royal-blue/10 border-2 border-royal-blue/20 flex items-center justify-center text-royal-blue">
            <i data-lucide="user" class="w-4.5 h-4.5"></i>
          </span>
          <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400 group-hover:text-space-900 transition"></i>
        </button>
        <div id="userMenu" class="hidden absolute end-0 top-full mt-2 w-60 bg-white rounded-2xl border border-stone-200 shadow-xl shadow-blue-900/10 p-2 z-[60]">
          <div class="px-3.5 py-3 border-b border-stone-100 mb-1">
            <p class="text-sm font-black text-space-900">${esc(u.name)}</p>
            <p class="text-[10px] font-bold text-slate-400 mt-0.5">${esc(u.grade)} — كود: <span dir="ltr">${esc(u.code)}</span></p>
          </div>
          <a href="profile.html" class="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-fusha-stone rounded-xl transition"><i data-lucide="user-round" class="w-4 h-4 text-royal-blue"></i>الملف الشخصي</a>
          <a href="wallet.html" class="flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-fusha-stone rounded-xl transition"><span class="flex items-center gap-2.5"><i data-lucide="wallet" class="w-4 h-4 text-royal-blue"></i>المحفظة</span><span class="text-[10px] text-slate-400 font-black">(${w.balance})</span></a>
          <a href="mistakes.html" class="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-fusha-stone rounded-xl transition"><i data-lucide="notebook-pen" class="w-4 h-4 text-royal-blue"></i>إدارة الأخطاء</a>
          <button onclick="FUSHA.logout()" class="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer text-start"><i data-lucide="log-out" class="w-4 h-4"></i>تسجيل الخروج</button>
        </div>
      </div>` : `
      <a href="login.html" class="px-4 py-2.5 rounded-xl bg-royal-blue hover:bg-royal-blue-hover text-white text-xs font-black shadow-md transition flex items-center gap-1.5">
        <i data-lucide="log-in" class="w-4 h-4"></i><span>تسجيل الدخول</span>
      </a>`;

    return `
    <header class="fixed top-3 sm:top-4 inset-x-3 sm:inset-x-6 lg:inset-x-8 max-w-7xl 2xl:max-w-[1420px] mx-auto z-50 transition-all duration-300 backdrop-blur-md bg-white/95 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-lg shadow-blue-900/10" id="navbar">
      <div class="px-3.5 sm:px-5 lg:px-6 xl:px-7 2xl:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        <a href="dashboard.html" class="flex items-center gap-2 sm:gap-2.5 group shrink-0">
          <img src="assets/logo.jpg?v=4" alt="شعار فُصْحَى" class="h-9 sm:h-11 w-9 sm:w-11 rounded-xl object-cover transition-transform group-hover:scale-105" />
          <div class="hidden sm:flex flex-col border-r border-stone-200 pr-2 sm:pr-2.5">
            <span class="text-xs font-alexandria font-bold text-space-900 tracking-tight whitespace-nowrap">أ. أشرف سليم</span>
            <span class="text-[10px] text-royal-blue font-bold whitespace-nowrap">لغة عربية — ثانوية عامة</span>
          </div>
        </a>
        <nav id="navbar-links" class="hidden lg:flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-700">
          ${navItems}
          <div class="relative">
            <button id="moreBtn" class="px-3.5 py-2 rounded-xl text-slate-600 hover:text-space-900 hover:bg-stone-100 transition-all flex items-center gap-1.5 cursor-pointer">
              <i data-lucide="layout-grid" class="w-4 h-4 text-royal-blue"></i><span>المزيد</span><i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
            </button>
            <div id="moreMenu" class="hidden absolute start-0 top-full mt-2 w-56 bg-white rounded-2xl border border-stone-200 shadow-xl shadow-blue-900/10 p-2 z-[60]">${moreItems}</div>
          </div>
        </nav>
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          ${userArea}
          <button id="mobileNavBtn" class="lg:hidden w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-slate-600 cursor-pointer" aria-label="القائمة">
            <i data-lucide="menu" class="w-5 h-5"></i>
          </button>
        </div>
      </div>
      <div id="mobileNav" class="hidden lg:hidden border-t border-stone-100 px-3 py-3 space-y-1 rounded-b-3xl bg-white">${allMobile}</div>
    </header>
    <div class="h-[108px] sm:h-[128px] lg:h-24"></div>`;
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
    <div class="bg-space-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden">
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
    if (h) h.innerHTML = renderHeader(active);
    if (f) f.innerHTML = renderFooter();
    const y = document.getElementById('currentYear');
    if (y) y.textContent = new Date().getFullYear();

    // dropdowns
    const bind = (btnId, menuId) => {
      const b = document.getElementById(btnId), m = document.getElementById(menuId);
      if (!b || !m) return;
      b.addEventListener('click', (e) => { e.stopPropagation(); m.classList.toggle('hidden'); });
    };
    bind('userMenuBtn', 'userMenu');
    bind('moreBtn', 'moreMenu');
    const mob = document.getElementById('mobileNavBtn'), mobM = document.getElementById('mobileNav');
    if (mob && mobM) mob.addEventListener('click', () => mobM.classList.toggle('hidden'));
    document.addEventListener('click', (e) => {
      ['userMenu', 'moreMenu'].forEach(id => {
        const m = document.getElementById(id);
        if (m && !m.classList.contains('hidden') && !m.contains(e.target)) m.classList.add('hidden');
      });
    });
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
    t.style.background = ok === false ? '#E11D48' : '#0A0E27';
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
