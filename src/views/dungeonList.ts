import { createDungeonCard } from '../components/dungeonCard';
import { createSearchBar } from '../components/searchBar';
import { getDungeons } from '../services/notion';

export function renderDungeonList(container: HTMLElement): void {
  container.innerHTML = '';
  const dungeons = getDungeons();

  // Page header
  const pageHeader = document.createElement('div');
  pageHeader.className = 'mb-6';

  const title = document.createElement('h1');
  title.className = 'text-2xl font-bold text-gray-100 mb-1';
  title.textContent = 'Mythic+ Dungeons';

  const subtitle = document.createElement('p');
  subtitle.className = 'text-sm text-gray-500';
  subtitle.textContent = 'Select a dungeon to view bosses, trash, and mechanic notes.';

  pageHeader.appendChild(title);
  pageHeader.appendChild(subtitle);
  container.appendChild(pageHeader);

  // Search bar
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
      empty.textContent = 'No dungeons match your search.';
      grid.appendChild(empty);
      return;
    }

    for (const dungeon of filtered) {
      grid.appendChild(createDungeonCard(dungeon));
    }
  }

  container.appendChild(createSearchBar((q) => renderCards(q)));

  const spacer = document.createElement('div');
  spacer.className = 'mt-4';
  container.appendChild(spacer);

  container.appendChild(grid);

  // Initial render
  renderCards('');
}
