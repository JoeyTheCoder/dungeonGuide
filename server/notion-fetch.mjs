/**
 * Shared Notion query + transform logic.
 * Used by both the Vite dev server plugin and the CLI sync script.
 */
import { Client } from '@notionhq/client';

function unique(values) {
  return [...new Set(values)];
}

function getPlainText(property) {
  if (!property) return '';
  if (property.type === 'title') return property.title.map((item) => item.plain_text).join('').trim();
  if (property.type === 'rich_text') return property.rich_text.map((item) => item.plain_text).join('').trim();
  if (property.type === 'select') return property.select?.name?.trim() || '';
  if (property.type === 'status') return property.status?.name?.trim() || '';
  if (property.type === 'multi_select') return property.multi_select.map((item) => item.name).join(';').trim();
  if (property.type === 'formula') {
    if (property.formula.type === 'string') return property.formula.string?.trim() || '';
    if (property.formula.type === 'number') return `${property.formula.number ?? ''}`.trim();
  }
  return '';
}

function getNumber(property) {
  if (!property) return 0;
  if (property.type === 'number') return property.number ?? 0;
  if (property.type === 'formula' && property.formula.type === 'number') return property.formula.number ?? 0;
  const value = Number.parseFloat(getPlainText(property));
  return Number.isFinite(value) ? value : 0;
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeTag(rawTag) {
  const value = rawTag.trim().toLowerCase();
  const map = {
    kick: 'Kick',
    stun: 'Stun',
    dispel: 'Dispel',
    dodge: 'Dodge',
    tank: 'Tank',
    defensive: 'Defensive',
    healer: 'Healer',
    dps: 'DPS',
    aoe: 'AOE',
    'priority target': 'Priority Target',
  };
  return map[value] || null;
}

function parseTagsFromText(value) {
  return unique(
    value
      .split(/[;,]/)
      .map((tag) => normalizeTag(tag))
      .filter(Boolean)
  );
}

function parseTags(property) {
  if (!property) return [];

  if (property.type === 'multi_select') {
    return unique(
      property.multi_select
        .flatMap((item) => item.name.split(/[;,]/))
        .map((tag) => normalizeTag(tag))
        .filter(Boolean)
    );
  }

  return parseTagsFromText(getPlainText(property));
}

function normalizePriority(value) {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'high') return 'High';
  if (normalized === 'medium') return 'Medium';
  return 'Low';
}

function normalizeSectionId(value) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return 'mythicplus';
  if (normalized === 'mythic+' || normalized === 'mythic plus' || normalized === 'mythicplus' || normalized === 'm+') {
    return 'mythicplus';
  }
  if (normalized === 'raid' || normalized === 'raids') return 'raids';
  if (normalized === 'delve' || normalized === 'delves') return 'delves';
  return 'mythicplus';
}

function normalizeEntrySection(value) {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'trash' || normalized === 'trash mob' || normalized === 'trashmob') {
    return 'trash';
  }
  return 'boss';
}

function isTrashNotesEntry(value) {
  return value.trim().toLowerCase() === 'trash notes';
}

function collectMechanicTags(mechanics, fallbackTags) {
  return unique([
    ...fallbackTags,
    ...mechanics.flatMap((mechanic) => mechanic.tags ?? (mechanic.tag ? [mechanic.tag] : [])),
  ]);
}

function parseInstructionLine(line, fallbackTags) {
  const cleaned = line.replace(/^[-*•\d.)\s]+/, '').trim();
  if (!cleaned) return null;

  const match = cleaned.match(/^\[(.+?)\]\s*(.+)$/);
  if (!match) {
    return { text: cleaned, tags: fallbackTags };
  }

  const tags = parseTagsFromText(match[1]);
  const text = match[2].trim();
  if (!text) return null;

  return { text, tags: tags.length > 0 ? tags : fallbackTags };
}

function parseInstructionBlock(value, fallbackTags) {
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines
    .map((line) => parseInstructionLine(line, fallbackTags))
    .filter(Boolean);
}

async function resolveDataSourceId(notion, notionId) {
  try {
    const database = await notion.databases.retrieve({ database_id: notionId });
    const firstDataSource = database.data_sources?.[0]?.id;
    if (!firstDataSource) {
      throw new Error(`Database ${database.id} does not expose any data sources.`);
    }
    return firstDataSource;
  } catch (error) {
    if (error?.code === 'object_not_found') {
      return notionId;
    }
    throw error;
  }
}

async function queryAllPages(notion, notionId) {
  const pages = [];
  let cursor = undefined;
  const dataSourceId = await resolveDataSourceId(notion, notionId);

  while (true) {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      page_size: 100,
    });

    pages.push(...response.results);
    if (!response.has_more || !response.next_cursor) break;
    cursor = response.next_cursor;
  }

  return pages;
}

function getDungeonInlineDatabaseId(props) {
  return getPlainText(
    props.databaseId
    ?? props['Database ID']
    ?? props['Dungeon Database ID']
    ?? props['Inline Database ID']
  );
}

function buildDungeonSources(indexRows) {
  const sources = [];

  for (const row of indexRows) {
    if (!('properties' in row)) continue;
    const props = row.properties;
    const name = getPlainText(props.Name ?? props.Dungeon ?? props.Title);
    const databaseId = getDungeonInlineDatabaseId(props);
    if (!name || !databaseId) continue;

    sources.push({
      id: getPlainText(props.Slug) || slugify(name),
      name,
      section: normalizeSectionId(getPlainText(props.Section ?? props['Content Type'])),
      summary: getPlainText(props.Summary ?? props.Description),
      databaseId,
      sortOrder: getNumber(props['Sort Order'] ?? props.Sort),
    });
  }

  return sources;
}

function buildDungeonFromRows(source, rows) {
  const dungeon = {
    id: source.id,
    section: source.section,
    name: source.name,
    summary: source.summary,
    trashNotes: undefined,
    bosses: [],
    trash: [],
    sortOrder: source.sortOrder,
  };

  for (const row of rows) {
    if (!('properties' in row)) continue;
    const props = row.properties;
    const entrySection = normalizeEntrySection(getPlainText(props.Section ?? props.Type ?? props.Category));
    const name = getPlainText(props.Name ?? props.Boss ?? props['Trash Mob'] ?? props.Title);
    if (!name) continue;

    const summary = getPlainText(props.Summary ?? props.Overview ?? props.Description);
    const defaultTags = parseTags(props.Tags ?? props['Mechanic Tags']);
    const body = getPlainText(props.Description ?? props.Notes);
    const mechanics = parseInstructionBlock(body, defaultTags);
    const entry = {
      name,
      summary,
      mechanics,
      tags: collectMechanicTags(mechanics, defaultTags),
      priority: normalizePriority(getPlainText(props.Priority)),
      sortOrder: getNumber(props['Sort Order'] ?? props.Sort),
    };

    if (isTrashNotesEntry(name)) {
      dungeon.trashNotes = entry;
      continue;
    }

    if (entrySection === 'trash') {
      dungeon.trash.push(entry);
    } else {
      dungeon.bosses.push(entry);
    }
  }

  dungeon.bosses.sort((a, b) => (a.sortOrder - b.sortOrder) || a.name.localeCompare(b.name));
  dungeon.trash.sort((a, b) => (a.sortOrder - b.sortOrder) || a.name.localeCompare(b.name));

  return dungeon;
}

function sortDungeons(dungeonEntries) {
  dungeonEntries.sort((a, b) => (a.sortOrder - b.sortOrder) || a.name.localeCompare(b.name));

  return dungeonEntries.map(({ sortOrder, bosses, trash, trashNotes, ...dungeon }) => ({
    ...dungeon,
    ...(trashNotes
      ? {
          trashNotes: (({ sortOrder: _trashNotesSort, ...notes }) => notes)(trashNotes),
        }
      : {}),
    bosses: bosses.map(({ sortOrder: _bossSort, ...boss }) => boss),
    trash: trash.map(({ sortOrder: _trashSort, ...mob }) => mob),
  }));
}

export async function fetchDungeonsFromNotion(token, dungeonsDatabaseId) {
  const notion = new Client({ auth: token });
  const indexRows = await queryAllPages(notion, dungeonsDatabaseId);
  const dungeonSources = buildDungeonSources(indexRows);

  const dungeons = await Promise.all(
    dungeonSources.map(async (source) => {
      const rows = await queryAllPages(notion, source.databaseId);
      return buildDungeonFromRows(source, rows);
    })
  );

  return sortDungeons(dungeons);
}
