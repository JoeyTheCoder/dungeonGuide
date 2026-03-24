import { renderDungeonList } from './views/dungeonList';
import { renderDungeonDetail } from './views/dungeonDetail';

// Simple hash-based router.
// Routes:
//   #/             → redirect to mythicplus
//   #/mythicplus   → dungeon list
//   #/mythicplus/:id → dungeon detail
//   #/raids        → placeholder
//   #/delves       → placeholder

type Route =
  | { view: 'list' }
  | { view: 'detail'; dungeonId: string }
  | { view: 'placeholder'; section: string };

function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '') || '/mythicplus';

  const detailMatch = path.match(/^\/mythicplus\/([a-z0-9-]+)$/);
  if (detailMatch) return { view: 'detail', dungeonId: detailMatch[1] };

  if (path === '/' || path === '/mythicplus') return { view: 'list' };
  if (path === '/raids') return { view: 'placeholder', section: 'Raids' };
  if (path === '/delves') return { view: 'placeholder', section: 'Delves' };

  return { view: 'list' };
}

let contentContainer: HTMLElement | null = null;

function renderPlaceholder(container: HTMLElement, section: string) {
  container.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'flex flex-col items-center justify-center h-64 text-center gap-3';
  wrap.innerHTML = `
    <span class="text-4xl">🚧</span>
    <p class="text-lg font-bold text-gray-300">${section}</p>
    <p class="text-sm text-gray-500">Content coming soon.</p>
  `;
  container.appendChild(wrap);
}

function render() {
  if (!contentContainer) return;

  const route = parseHash(window.location.hash);

  switch (route.view) {
    case 'list':
      renderDungeonList(contentContainer);
      break;
    case 'detail':
      renderDungeonDetail(contentContainer, route.dungeonId);
      break;
    case 'placeholder':
      renderPlaceholder(contentContainer, route.section);
      break;
  }

  window.scrollTo(0, 0);
}

/** Navigate programmatically */
export function navigate(path: string) {
  window.location.hash = path;
}

/** Initialize the router — call once from main.ts */
export function initRouter(container: HTMLElement) {
  contentContainer = container;
  window.addEventListener('hashchange', render);
  render();
}
