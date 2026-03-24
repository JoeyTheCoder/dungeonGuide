/**
 * Vite plugin — adds GET /api/dungeons during development.
 * Queries Notion on every request so a browser refresh always shows
 * the latest data. The Notion secret never leaves the dev server.
 */
import { loadEnv } from 'vite';
import { fetchDungeonsFromNotion } from './notion-fetch.mjs';

export function notionDevApi() {
  return {
    name: 'notion-dev-api',
    apply: 'serve', // dev server only — not included in production builds

    configureServer(server) {
      const env = loadEnv('development', process.cwd(), '');
      const token = env.NOTION_TOKEN;
      const dbId = env.NOTION_DATABASE_ID;

      if (!token || !dbId) {
        console.warn('[notion-dev-api] NOTION_TOKEN / NOTION_DATABASE_ID not set — /api/dungeons will return static fallback data.');
      }

      server.middlewares.use('/api/dungeons', async (_req, res) => {
        res.setHeader('Content-Type', 'application/json');

        if (!token || !dbId) {
          res.statusCode = 503;
          res.end(JSON.stringify({ error: 'Notion env vars not configured' }));
          return;
        }

        try {
          const dungeons = await fetchDungeonsFromNotion(token, dbId);
          res.end(JSON.stringify(dungeons));
        } catch (err) {
          console.error('[notion-dev-api]', err?.message || err);
          res.statusCode = 502;
          res.end(JSON.stringify({ error: 'Notion fetch failed' }));
        }
      });
    },
  };
}
