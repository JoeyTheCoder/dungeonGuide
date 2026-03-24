import './style.css';
import { createHeader } from './components/header';
import { createSidebar } from './components/sidebar';
import { dungeons } from './data/dungeons';
import { initRouter } from './router';

// Mount the header
const headerEl = document.getElementById('app-header')!;
headerEl.appendChild(createHeader());

// Mount the sidebar and re-render on navigation to highlight the active dungeon
const sidebarEl = document.getElementById('app-sidebar')!;

function renderSidebar() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  const match = hash.match(/^\/dungeon\/([a-z0-9-]+)$/);
  const activeId = match ? match[1] : undefined;
  sidebarEl.innerHTML = '';
  sidebarEl.appendChild(createSidebar(dungeons, activeId));
}

renderSidebar();
window.addEventListener('hashchange', renderSidebar);

// Boot the router — renders into the content area
const contentEl = document.getElementById('app-content')!;
initRouter(contentEl);

