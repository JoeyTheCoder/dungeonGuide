import { navigate } from '../router';

export function createHeader(): HTMLElement {
  const header = document.createElement('header');
  header.className = [
    'h-14 shrink-0 flex items-center gap-5 px-6',
    'bg-gray-950 border-b border-gray-800',
  ].join(' ');

  header.innerHTML = `
    <!-- Logo -->
    <a href="#/mythicplus" id="header-logo"
       class="flex items-center gap-2 shrink-0 group select-none">
      <span class="text-base font-black tracking-widest uppercase text-amber-400
                   group-hover:text-amber-300 transition-colors">
        ⚔ FFG-Playbook
      </span>
    </a>

    <!-- Vertical divider -->
    <div class="h-5 w-px bg-gray-800 shrink-0"></div>

    <!-- Section tabs -->
    <nav id="header-tabs" class="flex items-center gap-1">
      <button data-tab="mythicplus"
        class="tab-btn px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded transition-all">
        Mythic+
      </button>
      <button data-tab="raids"
        class="tab-btn px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded transition-all">
        Raids
      </button>
      <button data-tab="delves"
        class="tab-btn px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded transition-all">
        Delves
      </button>
    </nav>
  `;

  const tabs = header.querySelectorAll<HTMLButtonElement>('.tab-btn');

  function getActiveSection(): string {
    const path = window.location.hash.replace(/^#\//, '');
    if (path.startsWith('raids')) return 'raids';
    if (path.startsWith('delves')) return 'delves';
    return 'mythicplus';
  }

  function refreshTabs() {
    const active = getActiveSection();
    tabs.forEach(btn => {
      const isActive = btn.dataset.tab === active;
      btn.className = isActive
        ? 'tab-btn px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded transition-all text-amber-400 bg-amber-500/10 ring-1 ring-inset ring-amber-500/30'
        : 'tab-btn px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded transition-all text-gray-500 hover:text-gray-200 hover:bg-gray-800/60';
    });
  }

  refreshTabs();
  window.addEventListener('hashchange', refreshTabs);

  tabs.forEach(btn => {
    btn.addEventListener('click', () => navigate(`/${btn.dataset.tab!}`));
  });

  header.querySelector('#header-logo')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigate('/mythicplus');
  });

  return header;
}
