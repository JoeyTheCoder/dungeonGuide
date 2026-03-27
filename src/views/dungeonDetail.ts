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

  if (dungeon.trashNotes) {
    container.appendChild(createSectionTitle('Trash Notes'));

    const trashNotesCard = document.createElement('div');
    trashNotesCard.className = 'w-full bg-gray-900/60 border border-gray-800/50 rounded-xl p-5 mb-10';

    if (dungeon.trashNotes.summary.trim()) {
      const trashNotesSummary = document.createElement('p');
      trashNotesSummary.className = 'text-sm text-gray-400 mb-4';
      trashNotesSummary.textContent = dungeon.trashNotes.summary;
      trashNotesCard.appendChild(trashNotesSummary);
    }

    if (dungeon.trashNotes.mechanics.length > 0) {
      const notesList = document.createElement('ul');
      notesList.className = 'space-y-3';

      for (const mechanic of dungeon.trashNotes.mechanics) {
        const item = document.createElement('li');
        item.className = 'rounded-lg border border-gray-700/70 bg-gray-900/40 px-4 py-3';

        const text = document.createElement('p');
        text.className = 'text-sm text-gray-200 leading-6';
        text.textContent = `• ${mechanic.text}`;
        item.appendChild(text);

        notesList.appendChild(item);
      }

      trashNotesCard.appendChild(notesList);
    }

    container.appendChild(trashNotesCard);
  }

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

  if (dungeon.editUrl) {
    const editWrap = document.createElement('div');
    editWrap.className = 'mt-12 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-gray-900/70 to-gray-900/90 p-5 sm:p-6';

    const editHeading = document.createElement('h2');
    editHeading.className = 'text-base font-bold text-gray-100';
    editHeading.textContent = 'Help improve this dungeon';
    editWrap.appendChild(editHeading);

    const editCopy = document.createElement('p');
    editCopy.className = 'mt-2 max-w-2xl text-sm leading-6 text-gray-400';
    editCopy.textContent = 'Open the matching Notion page to update notes directly or invite other players to contribute.';
    editWrap.appendChild(editCopy);

    const editLink = document.createElement('a');
    editLink.href = dungeon.editUrl;
    editLink.target = '_blank';
    editLink.rel = 'noreferrer noopener';
    editLink.className = 'mt-4 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-300 transition-colors hover:border-amber-300 hover:bg-amber-400/20 hover:text-amber-200';
    editLink.textContent = 'Edit In Notion';
    editWrap.appendChild(editLink);

    container.appendChild(editWrap);
  }
}
