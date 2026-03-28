import type { Boss, MechanicNote, TrashMob, TrashNotes } from '../types';

type ChatCopyEntry = Pick<Boss, 'name' | 'summary' | 'mechanics' | 'tags'>
  | Pick<TrashMob, 'name' | 'summary' | 'mechanics' | 'tags'>
  | Pick<TrashNotes, 'name' | 'summary' | 'mechanics' | 'tags'>;

const WOW_CHAT_CHARACTER_LIMIT = 240;

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function getMechanicTags(mechanic: MechanicNote): string[] {
  return mechanic.tags ?? (mechanic.tag ? [mechanic.tag] : []);
}

function formatMechanic(mechanic: MechanicNote): string {
  const tags = getMechanicTags(mechanic);
  const prefix = tags.length > 0 ? `[${tags.join('/')}] ` : '';
  return `${prefix}${normalizeWhitespace(mechanic.text)}`;
}

function truncateToLimit(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  if (maxLength <= 3) return value.slice(0, maxLength);
  return `${value.slice(0, maxLength - 3).trimEnd()}...`;
}

export function formatEncounterChatText(entry: ChatCopyEntry): string {
  const heading = `${normalizeWhitespace(entry.name)}: `;
  const mechanics = entry.mechanics
    .map(formatMechanic)
    .filter(Boolean);
  const summary = normalizeWhitespace(entry.summary);
  const fallbackTagSummary = entry.tags?.length ? `[${entry.tags.join('/')}]` : '';
  const segments = mechanics.length > 0
    ? mechanics
    : [summary || fallbackTagSummary].filter(Boolean);

  if (segments.length === 0) {
    return truncateToLimit(heading.trimEnd(), WOW_CHAT_CHARACTER_LIMIT);
  }

  let message = heading;

  for (const segment of segments) {
    const next = message.endsWith(': ') ? `${message}${segment}` : `${message}; ${segment}`;
    if (next.length > WOW_CHAT_CHARACTER_LIMIT) {
      if (message === heading) {
        return truncateToLimit(next, WOW_CHAT_CHARACTER_LIMIT);
      }
      return truncateToLimit(message, WOW_CHAT_CHARACTER_LIMIT);
    }
    message = next;
  }

  return message;
}