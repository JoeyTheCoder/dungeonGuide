import './style.css';
import { createSidebar } from './components/sidebar';
import { isContentSectionId } from './config/sections';
import { getDungeons, refreshDungeons } from './services/notion';
import { initRouter } from './router';

// Mount the sidebar
const sidebarEl = document.getElementById('app-sidebar')!;

function renderSidebar() {
  const path = window.location.hash.replace(/^#\//, '') || 'mythicplus';
  const section = path.split('/')[0];

  if (!section || !isContentSectionId(section)) {
    sidebarEl.innerHTML = '';
    sidebarEl.appendChild(createSidebar([], 'mythicplus'));
    return;
  }

  const dungeons = getDungeons(section);
  const match = path.match(new RegExp(`^${section}\\/([a-z0-9-]+)$`));
  const activeId = match ? match[1] : undefined;
  sidebarEl.innerHTML = '';
  sidebarEl.appendChild(createSidebar(dungeons, section, activeId));
}

renderSidebar();
window.addEventListener('hashchange', renderSidebar);

// Boot the router
const contentEl = document.getElementById('app-content')!;
const footerEl = document.getElementById('app-footer')!;

footerEl.textContent = `© ${new Date().getFullYear()} Sapphirix. All rights reserved.`;

initRouter(contentEl);

// Fetch latest Notion data, then re-render
refreshDungeons().then(() => {
  renderSidebar();
  window.dispatchEvent(new HashChangeEvent('hashchange'));
});

