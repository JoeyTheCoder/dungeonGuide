import './style.css';
import { createHeader } from './components/header';
import { createSidebar } from './components/sidebar';
import { getDungeons, refreshDungeons } from './services/notion';
import { initRouter } from './router';

// Mount the header
const headerEl = document.getElementById('app-header')!;
headerEl.appendChild(createHeader());

// Mount the sidebar — only visible when on the Mythic+ section
const sidebarEl = document.getElementById('app-sidebar')!;

function renderSidebar() {
  const path = window.location.hash.replace(/^#\//, '') || 'mythicplus';
  const dungeons = getDungeons();

  // Only show the dungeon sidebar on the mythicplus section
  if (!path.startsWith('mythicplus') && path !== '/') {
    sidebarEl.innerHTML = '';
    return;
  }

  const match = path.match(/^mythicplus\/([a-z0-9-]+)$/);
  const activeId = match ? match[1] : undefined;
  sidebarEl.innerHTML = '';
  sidebarEl.appendChild(createSidebar(dungeons, activeId));
}

renderSidebar();
window.addEventListener('hashchange', renderSidebar);

// Boot the router — renders into the content area
const contentEl = document.getElementById('app-content')!;
initRouter(contentEl);

// Fetch latest Notion data, then re-render everything
refreshDungeons().then(() => {
  renderSidebar();
  // Re-trigger the current route so the content area updates too
  window.dispatchEvent(new HashChangeEvent('hashchange'));
});

