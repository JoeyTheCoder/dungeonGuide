import { dungeons as staticDungeons } from '../data/dungeons';
import type { Dungeon } from '../types';

/** Live dungeon data — starts with static, replaced by API data on load */
let liveDungeons: Dungeon[] = staticDungeons;
let fetchPromise: Promise<void> | null = null;

/**
 * Kick off a fetch from /api/dungeons (served by the Vite dev plugin).
 * In production the endpoint won't exist, so this gracefully falls back
 * to the static dataset baked in at build time.
 */
export function refreshDungeons(): Promise<void> {
  if (!fetchPromise) {
    fetchPromise = fetch('/api/dungeons')
      .then(async (res) => {
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data: Dungeon[] = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          liveDungeons = data;
        }
      })
      .catch(() => {
        // Dev API not available or Notion unreachable — keep static data
      })
      .finally(() => {
        fetchPromise = null;
      });
  }
  return fetchPromise;
}

export function getDungeons(): Dungeon[] {
  return liveDungeons;
}

export function getDungeonById(dungeonId: string): Dungeon | undefined {
  return liveDungeons.find((dungeon) => dungeon.id === dungeonId);
}
