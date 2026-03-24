import { createBossCard } from '../components/bossCard';
import { createTrashCard } from '../components/trashCard';
import { createSectionTitle } from '../components/sectionTitle';
import { navigate } from '../router';
import { getDungeonById } from '../services/notion';

export function renderDungeonDetail(container: HTMLElement, dungeonId: string): void {
  container.innerHTML = '';

  const dungeon = getDungeonById(dungeonId);

  if (!dungeon) {
    const msg = document.createElement('p');
    msg.className = 'text-gray-400';
    msg.textContent = 'Dungeon not found.';

    const backBtn = document.createElement('button');
    backBtn.className = 'mt-4 text-sm text-amber-400 hover:underline';
    backBtn.textContent = '← Back to all dungeons';
    backBtn.addEventListener('click', () => navigate('/mythicplus'));

    container.appendChild(msg);
    container.appendChild(backBtn);
    return;
  }

  // Back link
  const back = document.createElement('button');
  back.className = 'text-sm text-gray-500 hover:text-amber-400 transition-colors mb-4 inline-block';
  back.textContent = '← All Dungeons';
  back.addEventListener('click', () => navigate('/mythicplus'));
  container.appendChild(back);

  // Dungeon title
  const title = document.createElement('h1');
  title.className = 'text-2xl font-bold text-gray-100 mb-2';
  title.textContent = dungeon.name;
  container.appendChild(title);

  // Summary
  const summary = document.createElement('p');
  summary.className = 'text-sm text-gray-400 mb-8 max-w-2xl';
  summary.textContent = dungeon.summary;
  container.appendChild(summary);

  // Bosses section
  container.appendChild(createSectionTitle(`Bosses (${dungeon.bosses.length})`));
  const bossGrid = document.createElement('div');
  bossGrid.className = 'grid gap-5 grid-cols-1 mb-8';
  for (const boss of dungeon.bosses) {
    bossGrid.appendChild(createBossCard(boss));
  }
  container.appendChild(bossGrid);

  // Trash section
  container.appendChild(createSectionTitle(`Key Trash (${dungeon.trash.length})`));
  const trashGrid = document.createElement('div');
  trashGrid.className = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8';
  for (const mob of dungeon.trash) {
    trashGrid.appendChild(createTrashCard(mob));
  }
  container.appendChild(trashGrid);
}
