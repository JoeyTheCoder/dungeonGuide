import type { Dungeon } from '../types';
import { navigate } from '../router.ts';
import { sectionMeta, sectionOrder } from '../config/sections';
import type { ContentSectionId } from '../types';
import sapphirixLogo from '../assets/sapphirix-logo.png';

export function createSidebar(
  dungeons: Dungeon[],
  section: ContentSectionId,
  activeId?: string,
): HTMLElement {
  const aside = document.createElement('div');
  aside.className = 'flex flex-col h-full';

  // ── Logo ──
  const logoWrap = document.createElement('a');
  logoWrap.href = '#/mythicplus';
  logoWrap.className = 'flex items-center gap-3 px-5 py-5 group select-none';
  logoWrap.addEventListener('click', (e) => {
    e.preventDefault();
    navigate('/mythicplus');
  });

  const logoImg = document.createElement('img');
  logoImg.src = sapphirixLogo;
  logoImg.alt = 'Sapphirix';
  logoImg.className = 'w-10 h-10 rounded-md';
  logoWrap.appendChild(logoImg);

  const logoText = document.createElement('span');
  logoText.className = 'text-sm font-extrabold uppercase tracking-widest text-gray-100 group-hover:text-amber-400 transition-colors';
  logoText.textContent = 'FFG-Playbook';
  logoWrap.appendChild(logoText);

  aside.appendChild(logoWrap);

  // ── Divider ──
  const divider1 = document.createElement('div');
  divider1.className = 'mx-4 border-t border-gray-800/60';
  aside.appendChild(divider1);

  // ── Section tabs ──
  const tabsWrap = document.createElement('div');
  tabsWrap.className = 'flex flex-col gap-0.5 px-3 py-3';

  for (const sec of sectionOrder) {
    const meta = sectionMeta[sec];
    const isActive = sec === section;
    const btn = document.createElement('button');
    btn.className = [
      'w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all',
      isActive
        ? 'text-amber-400 bg-amber-500/10'
        : 'text-gray-500 hover:text-gray-200 hover:bg-gray-800/50',
    ].join(' ');
    btn.textContent = meta.label;
    btn.addEventListener('click', () => navigate(`/${sec}`));
    tabsWrap.appendChild(btn);
  }

  aside.appendChild(tabsWrap);

  // ── Divider ──
  const divider2 = document.createElement('div');
  divider2.className = 'mx-4 border-t border-gray-800/60';
  aside.appendChild(divider2);

  // ── Dungeon list ──
  const listWrap = document.createElement('div');
  listWrap.className = 'flex-1 overflow-y-auto px-3 py-3';

  const listLabel = document.createElement('p');
  listLabel.className = 'text-[10px] font-bold uppercase tracking-widest text-gray-600 px-3 mb-2';
  listLabel.textContent = 'Dungeons';
  listWrap.appendChild(listLabel);

  for (const d of dungeons) {
    const isActive = d.id === activeId;
    const link = document.createElement('a');
    link.href = `#/${section}/${d.id}`;
    link.className = [
      'block px-3 py-1.5 text-sm rounded-md transition-all mb-0.5',
      isActive
        ? 'text-amber-400 bg-amber-500/10 font-medium'
        : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/40',
    ].join(' ');
    link.textContent = d.name;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(`/${section}/${d.id}`);
    });
    listWrap.appendChild(link);
  }

  aside.appendChild(listWrap);

  return aside;
}
