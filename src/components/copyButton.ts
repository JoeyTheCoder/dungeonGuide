async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error('Copy command failed.');
  }
}

function getButtonClassName(state: 'idle' | 'success' | 'error'): string {
  const base = 'inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors';

  if (state === 'success') {
    return `${base} border-emerald-400/40 bg-emerald-400/10 text-emerald-200`;
  }

  if (state === 'error') {
    return `${base} border-rose-400/40 bg-rose-400/10 text-rose-200`;
  }

  return `${base} border-gray-700/80 bg-gray-900/70 text-gray-300 hover:border-amber-400/40 hover:text-amber-200`;
}

export function createCopyButton(getText: () => string): HTMLButtonElement {
  const button = document.createElement('button');
  let resetTimer: number | undefined;

  function setState(state: 'idle' | 'success' | 'error') {
    button.className = getButtonClassName(state);
    button.textContent = state === 'idle' ? 'Copy' : state === 'success' ? 'Copied' : 'Retry';
  }

  button.type = 'button';
  button.setAttribute('aria-label', 'Copy WoW chat summary');
  button.title = 'Copy WoW chat summary';
  setState('idle');

  button.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (resetTimer) {
      window.clearTimeout(resetTimer);
    }

    try {
      await copyText(getText());
      setState('success');
    } catch {
      setState('error');
    }

    resetTimer = window.setTimeout(() => {
      setState('idle');
    }, 1800);
  });

  return button;
}