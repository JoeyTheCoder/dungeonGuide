export const DUNGEONS_INDEX_ENV_KEY = 'NOTION_DUNGEONS_DATABASE_ID';
export const LEGACY_DUNGEONS_INDEX_ENV_KEY = 'NOTION_DATABASE_ID';

export function getDungeonIndexDatabaseId(env) {
  return env[DUNGEONS_INDEX_ENV_KEY]?.trim() || env[LEGACY_DUNGEONS_INDEX_ENV_KEY]?.trim() || '';
}
