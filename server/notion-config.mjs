export const DUNGEONS_INDEX_ENV_KEY = 'NOTION_DUNGEONS_DATABASE_ID';
export const LEGACY_DUNGEONS_INDEX_ENV_KEY = 'NOTION_DATABASE_ID';
export const RAIDS_INDEX_ENV_KEY = 'NOTION_RAIDS_DATABASE_ID';

export const OVERVIEW_DATABASE_ENV_HINT = `${DUNGEONS_INDEX_ENV_KEY}, ${LEGACY_DUNGEONS_INDEX_ENV_KEY}, or ${RAIDS_INDEX_ENV_KEY}`;

function getEnvValue(env, keys) {
  for (const key of keys) {
    const value = env[key]?.trim();
    if (value) {
      return value;
    }
  }

  return '';
}

export function getDungeonIndexDatabaseId(env) {
  return getEnvValue(env, [DUNGEONS_INDEX_ENV_KEY, LEGACY_DUNGEONS_INDEX_ENV_KEY]);
}

export function getRaidIndexDatabaseId(env) {
  return getEnvValue(env, [RAIDS_INDEX_ENV_KEY]);
}

export function getNotionIndexSources(env) {
  const sources = [];

  const dungeonDatabaseId = getDungeonIndexDatabaseId(env);
  if (dungeonDatabaseId) {
    sources.push({
      section: 'mythicplus',
      databaseId: dungeonDatabaseId,
      envKey: DUNGEONS_INDEX_ENV_KEY,
    });
  }

  const raidDatabaseId = getRaidIndexDatabaseId(env);
  if (raidDatabaseId) {
    sources.push({
      section: 'raids',
      databaseId: raidDatabaseId,
      envKey: RAIDS_INDEX_ENV_KEY,
    });
  }

  return sources;
}
