export function createSectionTitle(text: string): HTMLElement {
  const h2 = document.createElement('h2');
  h2.className = 'text-lg font-bold text-amber-400 border-b border-gray-700 pb-2 mb-4 uppercase tracking-wide';
  h2.textContent = text;
  return h2;
}
