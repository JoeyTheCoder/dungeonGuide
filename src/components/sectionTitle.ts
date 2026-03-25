export function createSectionTitle(text: string): HTMLElement {
  const h2 = document.createElement('h2');
  h2.className = 'text-sm font-bold text-amber-400/80 border-b border-gray-800/50 pb-2 mb-5 uppercase tracking-widest';
  h2.textContent = text;
  return h2;
}
