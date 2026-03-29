export function createSearchBar(onInput: (query: string) => void, placeholder = 'Search entries...'): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'relative';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = placeholder;
  input.className = 'w-full bg-gray-900/60 border border-gray-800/50 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:bg-gray-900 transition-all';

  input.addEventListener('input', () => {
    onInput(input.value);
  });

  wrapper.appendChild(input);
  return wrapper;
}
