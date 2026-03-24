import { navigate } from '../router';

export function createHeader(): HTMLElement {
  const header = document.createElement('header');
  header.className = 'bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between';

  header.innerHTML = `
    <a href="#/" class="flex items-center gap-3 cursor-pointer" id="header-home-link">
      <span class="text-xl font-bold text-amber-400 tracking-wide">⚔ DungeonGuide</span>
      <span class="text-xs text-gray-500 hidden sm:inline">Mythic+ Playbook</span>
    </a>
    <nav class="text-sm text-gray-400">
      <a href="#/" class="hover:text-amber-400 transition-colors">All Dungeons</a>
    </nav>
  `;

  header.querySelector('#header-home-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigate('/');
  });

  return header;
}
