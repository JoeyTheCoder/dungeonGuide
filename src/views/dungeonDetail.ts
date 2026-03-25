import { createBossCard } from '../components/bossCard';
import { createTrashCard } from '../components/trashCard';
import { createSectionTitle } from '../components/sectionTitle';
import { navigate } from '../router.ts';
import { getDungeonById } from '../services/notion';
import type { ContentSectionId } from '../types';

export function renderDungeonDetail(
  container: HTMLElement,
  section: ContentSectionId,
  dungeonId: string,
): void {
  container.innerHTML = '';

  const dungeon = getDungeonById(section, dungeonId);

  if (!dungeon) {
    const msg = document.createElement('p');
    msg.className = 'text-gray-400';
    msg.textContent = 'Dungeon not found.';

    const backBtn = document.createElement('button');
    backBtn.className = 'mt-4 text-sm text-amber-400 hover:underline';
    backBtn.textContent = '← Back to all dungeons';
    backBtn.addEventListener('click', () => navigate(`/${section}`));

    container.appendChild(msg);
    container.appendChild(backBtn);
    return;
  }

  // Back link
  const back = document.createElement('button');
  back.className = 'text-sm text-gray-500 hover:text-amber-400 transition-colors mb-6 inline-flex items-center gap-1';
  back.textContent = '← All Dungeons';
  back.addEventListener('click', () => navigate(`/${section}`));
  container.appendChild(back);

  // Dungeon title + expansion
  const titleRow = document.createElement('div');
  titleRow.className = 'mb-2';

  const title = document.createElement('h1');
  title.className = 'text-2xl font-extrabold text-gray-100 tracking-tight';
  title.textContent = dungeon.name;
  titleRow.appendChild(title);

  if (dungeon.expansion) {
    const expBadge = document.createElement('span');
    expBadge.className = 'inline-block text-xs font-medium text-gray-500 bg-gray-800/60 px-2.5 py-1 rounded-md mt-2';
    expBadge.textContent = dungeon.expansion;
    titleRow.appendChild(expBadge);
  }

  container.appendChild(titleRow);

  // Summary
  const summary = document.createElement('p');
  summary.className = 'text-sm text-gray-400 mb-10 max-w-2xl leading-relaxed';
  summary.textContent = dungeon.summary;
  container.appendChild(summary);

  // Bosses section
  if (dungeon.bosses.length > 0) {
    container.appendChild(createSectionTitle(`Bosses (${dungeon.bosses.length})`));
    const bossGrid = document.createElement('div');
    bossGrid.className = 'grid gap-5 grid-cols-1 mb-10';
    for (const boss of dungeon.bosses) {
      bossGrid.appendChild(createBossCard(boss));
    }
    container.appendChild(bossGrid);
  }

  // Trash section
  if (dungeon.trash.length > 0) {
    container.appendChild(createSectionTitle(`Key Trash (${dungeon.trash.length})`));
    const trashGrid = document.createElement('div');
    trashGrid.className = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10';
    for (const mob of dungeon.trash) {
      trashGrid.appendChild(createTrashCard(mob));
    }
    container.appendChild(trashGrid);
  }
}
