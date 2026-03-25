import './style.css';
import { createSidebar } from './components/sidebar';
import { isContentSectionId } from './config/sections';
import { getDungeons, refreshDungeons } from './services/notion';
import { initRouter } from './router';

// Mount the sidebar
const appShellEl = document.getElementById('app-shell')!;
const sidebarEl = document.getElementById('app-sidebar')!;
const sidebarToggleEl = document.getElementById('app-sidebar-toggle') as HTMLButtonElement | null;
const sidebarBackdropEl = document.getElementById('app-sidebar-backdrop') as HTMLDivElement | null;
const mobileBreakpoint = window.matchMedia('(max-width: 1023px)');

function setSidebarOpen(isOpen: boolean) {
  const mobileOpen = isOpen && mobileBreakpoint.matches;
  appShellEl.dataset.sidebarOpen = mobileOpen ? 'true' : 'false';
  document.body.classList.toggle('sidebar-open', mobileOpen);

  if (sidebarToggleEl) {
    sidebarToggleEl.setAttribute('aria-expanded', String(mobileOpen));
    sidebarToggleEl.textContent = mobileOpen ? 'Close' : 'Menu';
  }

  if (sidebarBackdropEl) {
    sidebarBackdropEl.hidden = !mobileOpen;
  }
}

function closeSidebar() {
  setSidebarOpen(false);
}

function syncResponsiveShell() {
  if (!mobileBreakpoint.matches) {
    closeSidebar();
  } else if (appShellEl.dataset.sidebarOpen !== 'true') {
    if (sidebarBackdropEl) {
      sidebarBackdropEl.hidden = true;
    }
  }
}

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
window.addEventListener('hashchange', () => {
  renderSidebar();
  closeSidebar();
});

sidebarToggleEl?.addEventListener('click', () => {
  const isOpen = appShellEl.dataset.sidebarOpen === 'true';
  setSidebarOpen(!isOpen);
});

sidebarBackdropEl?.addEventListener('click', closeSidebar);
mobileBreakpoint.addEventListener('change', syncResponsiveShell);
syncResponsiveShell();

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

