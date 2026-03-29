import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { OVERVIEW_DATABASE_ENV_HINT, getNotionIndexSources } from './notion-config.mjs';
import { fetchContentFromNotion } from './notion-fetch.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

const app = express();
const host = process.env.HOST?.trim() || '0.0.0.0';
const port = Number.parseInt(process.env.PORT || '3000', 10);

function getMissingEnvVars() {
  const missing = [];

  if (!process.env.NOTION_TOKEN?.trim()) {
    missing.push('NOTION_TOKEN');
  }

  if (getNotionIndexSources(process.env).length === 0) {
    missing.push(OVERVIEW_DATABASE_ENV_HINT);
  }

  return missing;
}

function setNoCacheHeaders(res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
}

app.disable('x-powered-by');

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/dungeons', async (_req, res) => {
  setNoCacheHeaders(res);
  res.type('application/json');

  const missingEnvVars = getMissingEnvVars();
  if (missingEnvVars.length > 0) {
    res.status(503).json({
      error: 'Notion env vars not configured',
      missing: missingEnvVars,
    });
    return;
  }

  try {
    const dungeons = await fetchContentFromNotion(process.env.NOTION_TOKEN, getNotionIndexSources(process.env));
    res.json(dungeons);
  } catch (error) {
    console.error('[api/dungeons]', error?.message || error);
    res.status(502).json({ error: 'Notion fetch failed' });
  }
});

app.use(express.static(distDir, {
  index: false,
}));

app.get(/^(?!\/api(?:\/|$)).*/, (_req, res) => {
  res.sendFile(indexHtmlPath);
});

app.listen(port, host, () => {
  console.log(`dungeonGuide server listening on http://${host}:${port}`);
});