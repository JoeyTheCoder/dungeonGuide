import { createDungeonCard } from '../components/dungeonCard';
import { createSearchBar } from '../components/searchBar';
import { getDungeons } from '../services/notion';
import { sectionMeta } from '../config/sections';
import type { ContentSectionId } from '../types';
import sapphirixLogo from '../assets/sapphirix-logo.png';

export function renderDungeonList(container: HTMLElement, section: ContentSectionId): void {
  container.innerHTML = '';
  const dungeons = getDungeons(section);
  const meta = sectionMeta[section];

  // ── Hero area with logo ──
  const hero = document.createElement('div');
  hero.className = 'mb-10';

  const logoRow = document.createElement('div');
  logoRow.className = 'flex items-center gap-4 mb-4';

  const logoImg = document.createElement('img');
  logoImg.src = sapphirixLogo;
  logoImg.alt = 'Sapphirix';
  logoImg.className = 'w-16 h-16 rounded-lg sm:w-18 sm:h-18';
  logoRow.appendChild(logoImg);

  const titleBlock = document.createElement('div');

  const title = document.createElement('h1');
  title.className = 'text-2xl font-extrabold text-gray-100 tracking-tight';
  title.textContent = meta.listTitle;
  titleBlock.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.className = 'text-sm text-gray-500 mt-0.5';
  subtitle.textContent = meta.listSubtitle;
  titleBlock.appendChild(subtitle);

  logoRow.appendChild(titleBlock);
  hero.appendChild(logoRow);

  container.appendChild(hero);

  // ── Search ──
  const searchWrap = document.createElement('div');
  searchWrap.className = 'mb-6 w-full';

  const grid = document.createElement('div');
  grid.className = 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3';

  function renderCards(query: string) {
    grid.innerHTML = '';
    const filtered = dungeons.filter(d =>
      d.name.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'text-sm text-gray-500 col-span-full';
      empty.textContent = query.trim()
        ? 'No entries match your search.'
        : `No ${meta.label.toLowerCase()} entries are available yet.`;
      grid.appendChild(empty);
      return;
    }

    for (const dungeon of filtered) {
      grid.appendChild(createDungeonCard(dungeon));
    }
  }

  searchWrap.appendChild(createSearchBar((q) => renderCards(q)));
  container.appendChild(searchWrap);
  container.appendChild(grid);

  // Initial render
  renderCards('');
}
