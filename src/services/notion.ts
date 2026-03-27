import { dungeons as staticDungeons } from '../data/dungeons';
import { enrichDungeons } from '../data/dungeon-metadata';
import type { ContentSectionId, Dungeon } from '../types';

/** Live dungeon data — starts with static, replaced by API data on load */
let liveDungeons: Dungeon[] = enrichDungeons(staticDungeons);
let fetchPromise: Promise<void> | null = null;

/**
 * Kick off a fetch from /api/dungeons.
 * When a live API is available, this pulls fresh data on every page load.
 * If the endpoint is missing or unavailable, the app gracefully falls back
 * to the static dataset baked in at build time.
 */
export function refreshDungeons(): Promise<void> {
  if (!fetchPromise) {
    fetchPromise = fetch(`/api/dungeons?ts=${Date.now()}`, {
      cache: 'no-store',
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data: Dungeon[] = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          liveDungeons = enrichDungeons(data);
          console.info('[notion] Loaded live Notion data.', {
            dungeons: data.length,
          });
        }
      })
      .catch((error) => {
        console.warn('[notion] Falling back to static data.', {
          reason: error instanceof Error ? error.message : String(error),
        });
      })
      .finally(() => {
        fetchPromise = null;
      });
  }
  return fetchPromise;
}

export function getDungeons(section?: ContentSectionId): Dungeon[] {
  if (!section) return liveDungeons;
  return liveDungeons.filter((dungeon) => (dungeon.section ?? 'mythicplus') === section);
}

export function getDungeonById(section: ContentSectionId, dungeonId: string): Dungeon | undefined {
  return liveDungeons.find(
    (dungeon) => (dungeon.section ?? 'mythicplus') === section && dungeon.id === dungeonId
  );
}
