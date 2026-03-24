import type { Dungeon } from '../types';
import { navigate } from '../router';

/** Sidebar listing all dungeons for quick navigation */
export function createSidebar(dungeons: Dungeon[], activeId?: string): HTMLElement {
  const aside = document.createElement('aside');
  aside.className = 'hidden lg:block w-56 shrink-0 bg-gray-900/50 border-r border-gray-800 p-4 space-y-1 overflow-y-auto';

  const title = document.createElement('h2');
  title.className = 'text-xs font-bold text-gray-500 uppercase tracking-wider mb-3';
  title.textContent = 'Dungeons';
  aside.appendChild(title);

  for (const d of dungeons) {
    const link = document.createElement('a');
    link.href = `#/dungeon/${d.id}`;
    link.className = `block text-sm px-3 py-1.5 rounded transition-colors ${
      d.id === activeId
        ? 'bg-amber-500/20 text-amber-400'
        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
    }`;
    link.textContent = d.name;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(`/dungeon/${d.id}`);
    });
    aside.appendChild(link);
  }

  return aside;
}
