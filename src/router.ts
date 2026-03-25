import { renderDungeonList } from './views/dungeonList';
import { renderDungeonDetail } from './views/dungeonDetail';
import { isContentSectionId } from './config/sections';
import type { ContentSectionId } from './types';

// Simple hash-based router.
// Routes:
//   #/               → redirect to mythicplus
//   #/:section       → section list
//   #/:section/:id   → section detail

type Route =
  | { view: 'list'; section: ContentSectionId }
  | { view: 'detail'; section: ContentSectionId; dungeonId: string };

function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '') || '/mythicplus';

  const parts = path.replace(/^\//, '').split('/').filter(Boolean);
  const section = parts[0];

  if (!section || !isContentSectionId(section)) {
    return { view: 'list', section: 'mythicplus' };
  }

  if (parts[1]) {
    return { view: 'detail', section, dungeonId: parts[1] };
  }

  return { view: 'list', section };
}

let contentContainer: HTMLElement | null = null;

function render() {
  if (!contentContainer) return;

  const route = parseHash(window.location.hash);

  switch (route.view) {
    case 'list':
      renderDungeonList(contentContainer, route.section);
      break;
    case 'detail':
      renderDungeonDetail(contentContainer, route.section, route.dungeonId);
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
