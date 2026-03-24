/**
 * Shared Notion query + transform logic.
 * Used by both the Vite dev server plugin and the CLI sync script.
 */
import { Client } from '@notionhq/client';

export const roster = [
  {
    id: 'magisters-terrace',
    name: "Magisters' Terrace",
    summary: "Blood elf citadel on the Isle of Quel'Danas. Heavy arcane interrupt checks and tight positioning throughout.",
  },
  {
    id: 'maisara-caverns',
    name: 'Maisara Caverns',
    summary: 'Deep subterranean cavern system with heavy bleed, stacking debuffs and rapid patrol density.',
  },
  {
    id: 'nexus-point-xenas',
    name: 'Nexus-Point Xenas',
    summary: 'Fractured interdimensional waypoint. Phase-shift and spatial displacement mechanics make positioning critical.',
  },
  {
    id: 'windrunner-spire',
    name: 'Windrunner Spire',
    summary: "The ancient spire of House Windrunner. Wind and movement mechanics heavily punish static positioning.",
  },
  {
    id: 'algethar-academy',
    name: "Algeth'ar Academy",
    summary: 'Dracthyr academy in the Azure Span. Arcane puzzle mechanics and aggressive add management are key.',
  },
  {
    id: 'seat-of-the-triumvirate',
    name: 'The Seat of the Triumvirate',
    summary: 'Eredar stronghold on Argus. Void corruption and spreading mechanics demand strict group positioning.',
  },
  {
    id: 'skyreach',
    name: 'Skyreach',
    summary: 'Arrakoa citadel in the Spires of Arak. Deadly Solar Winds and feather mechanics require constant movement.',
  },
  {
    id: 'pit-of-saron',
    name: 'Pit of Saron',
    summary: 'Scourge mine beneath Icecrown Citadel. Ice shatters, icicle barrages and permafrost require tight coordination.',
  },
];

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
  return '';
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

function parseTags(property) {
  if (!property) return [];

  if (property.type === 'multi_select') {
    return unique(property.multi_select
      .flatMap((item) => item.name.split(/[;,]/))
      .map((tag) => normalizeTag(tag))
      .filter(Boolean));
  }

  return unique(getPlainText(property)
    .split(/[;,]/)
    .map((tag) => normalizeTag(tag))
    .filter(Boolean));
}

function normalizePriority(value) {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'high') return 'High';
  if (normalized === 'medium') return 'Medium';
  return 'Low';
}

function normalizeSection(value) {
  return value.trim().toLowerCase() === 'trash' ? 'trash' : 'boss';
}

function mergePriority(currentPriority, nextPriority) {
  const rank = { High: 3, Medium: 2, Low: 1 };
  return rank[nextPriority] > rank[currentPriority] ? nextPriority : currentPriority;
}

function collectUniqueTags(...tagGroups) {
  return unique(tagGroups.flat().filter(Boolean));
}

function normalizeDungeonKey(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

async function resolveDataSourceId(notion, notionId) {
  try {
    const database = await notion.databases.retrieve({
      database_id: notionId,
    });

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

function buildDungeonData(rows) {
  const dungeonMap = new Map(
    roster.map((dungeon) => [
      normalizeDungeonKey(dungeon.name),
      {
        id: dungeon.id,
        name: dungeon.name,
        summary: dungeon.summary,
        bosses: [],
        trash: [],
      },
    ])
  );

  for (const page of rows) {
    if (!('properties' in page)) continue;

    const props = page.properties;
    const name = getPlainText(props.Name ?? props.Mechanics);
    const dungeonName = getPlainText(props.Dungeon);
    const section = normalizeSection(getPlainText(props.Section));
    const description = getPlainText(props.Description);
    const priority = normalizePriority(getPlainText(props.Priority));
    const tags = parseTags(props.Tags?.multi_select?.length ? props.Tags : (props['Tags 1'] ?? props.Tags));

    const dungeon = dungeonMap.get(normalizeDungeonKey(dungeonName));
    if (!dungeon || !name || !description) continue;

    const entry = {
      name,
      summary: description,
      mechanics: [],
      tags,
      priority,
    };

    if (section === 'boss') {
      const existingBoss = dungeon.bosses.find((boss) => boss.name === name);

      if (existingBoss) {
        existingBoss.priority = mergePriority(existingBoss.priority, priority);
        existingBoss.tags = collectUniqueTags(existingBoss.tags ?? [], tags);
        existingBoss.mechanics.push({
          text: description,
          tags,
        });
      } else {
        dungeon.bosses.push({
          name,
          summary: '',
          mechanics: [
            {
              text: description,
              tags,
            },
          ],
          tags: [...tags],
          priority,
        });
      }
    } else {
      dungeon.trash.push(entry);
    }
  }

  return roster.map((dungeon) => dungeonMap.get(normalizeDungeonKey(dungeon.name)));
}

/**
 * Fetch all dungeon data from Notion and return structured dungeon objects.
 */
export async function fetchDungeonsFromNotion(token, databaseId) {
  const notion = new Client({ auth: token });
  const pages = await queryAllPages(notion, databaseId);
  return buildDungeonData(pages);
}
