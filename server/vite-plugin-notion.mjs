/**
 * Vite plugin — adds GET /api/dungeons during development.
 * Queries Notion on every request so a browser refresh always shows
 * the latest data. The Notion secret never leaves the dev server.
 */
import { loadEnv } from 'vite';
import { OVERVIEW_DATABASE_ENV_HINT, getNotionIndexSources } from './notion-config.mjs';
import { fetchContentFromNotion } from './notion-fetch.mjs';

function getMissingEnvVars(token, indexSources) {
  const missing = [];

  if (!token) {
    missing.push('NOTION_TOKEN');
  }

  if (indexSources.length === 0) {
    missing.push(OVERVIEW_DATABASE_ENV_HINT);
  }

  return missing;
}

export function notionDevApi() {
  return {
    name: 'notion-dev-api',
    apply: 'serve', // dev server only — not included in production builds

    configureServer(server) {
      const env = loadEnv('development', process.cwd(), '');
      const token = env.NOTION_TOKEN;
      const indexSources = getNotionIndexSources(env);
      const missingEnvVars = getMissingEnvVars(token, indexSources);

      if (missingEnvVars.length > 0) {
        console.warn(
          `[notion-dev-api] Missing env vars: ${missingEnvVars.join(', ')} — /api/dungeons will return static fallback data.`
        );
      }

      server.middlewares.use('/api/dungeons', async (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        if (missingEnvVars.length > 0) {
          res.statusCode = 503;
          res.end(JSON.stringify({
            error: 'Notion env vars not configured',
            missing: missingEnvVars,
          }));
          return;
        }

        try {
          const dungeons = await fetchContentFromNotion(token, indexSources);
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
