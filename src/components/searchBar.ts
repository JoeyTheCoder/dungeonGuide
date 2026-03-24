export function createSearchBar(onInput: (query: string) => void): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'relative';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Search dungeons…';
  input.className = 'w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors';

  input.addEventListener('input', () => {
    onInput(input.value);
  });

  wrapper.appendChild(input);
  return wrapper;
}
