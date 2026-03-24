import { renderDungeonList } from './views/dungeonList';
import { renderDungeonDetail } from './views/dungeonDetail';

// Simple hash-based router.
// Routes: #/ → dungeon list, #/dungeon/:id → dungeon detail
// This can be swapped for a full router library later without changing the views.

type Route =
  | { view: 'list' }
  | { view: 'detail'; dungeonId: string };

function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '') || '/';

  const detailMatch = path.match(/^\/dungeon\/([a-z0-9-]+)$/);
  if (detailMatch) {
    return { view: 'detail', dungeonId: detailMatch[1] };
  }

  return { view: 'list' };
}

let contentContainer: HTMLElement | null = null;

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
  }

  // Scroll to top on navigation
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
