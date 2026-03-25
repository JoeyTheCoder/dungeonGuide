import type { Dungeon } from '../types';

interface DungeonMetadata {
  expansion: string;
  summary: string;
}

const metadataByKey: Record<string, DungeonMetadata> = {
  'the seat of the triumvirate': {
    expansion: 'Legion',
    summary: 'A void-ravaged eredar sanctuary on Argus where adventurers fight through Shadowguard forces to reclaim the ancient Seat and stop the fallen naaru L\'ura.',
  },
  'seat-of-the-triumvirate': {
    expansion: 'Legion',
    summary: 'A void-ravaged eredar sanctuary on Argus where adventurers fight through Shadowguard forces to reclaim the ancient Seat and stop the fallen naaru L\'ura.',
  },
  skyreach: {
    expansion: 'Warlords of Draenor',
    summary: 'The arakkoa stronghold high above Spires of Arak, where the Adherents of Rukhmar wield Apexis sun magic from a city suspended in the clouds.',
  },
  'magisters\' terrace': {
    expansion: 'Midnight',
    summary: 'A reclaimed center of sin\'dorei arcane study where heroes race to seize the Cynosure of Twilight and turn ancient power against the Void.',
  },
  'magisters-terrace': {
    expansion: 'Midnight',
    summary: 'A reclaimed center of sin\'dorei arcane study where heroes race to seize the Cynosure of Twilight and turn ancient power against the Void.',
  },
  'pit of saron': {
    expansion: 'Wrath of the Lich King',
    summary: 'An ice-choked Scourge quarry beneath Icecrown where prisoners mine saronite and adventurers carve a path toward Scourgelord Tyrannus.',
  },
  'pit-of-saron': {
    expansion: 'Wrath of the Lich King',
    summary: 'An ice-choked Scourge quarry beneath Icecrown where prisoners mine saronite and adventurers carve a path toward Scourgelord Tyrannus.',
  },
  'algeth\'ar academy': {
    expansion: 'Dragonflight',
    summary: 'A legendary draconic academy in Thaldraszus where reopened classrooms, unstable lessons, and magical experiments have spiraled out of control.',
  },
  'algethar academy': {
    expansion: 'Dragonflight',
    summary: 'A legendary draconic academy in Thaldraszus where reopened classrooms, unstable lessons, and magical experiments have spiraled out of control.',
  },
  'algethar-academy': {
    expansion: 'Dragonflight',
    summary: 'A legendary draconic academy in Thaldraszus where reopened classrooms, unstable lessons, and magical experiments have spiraled out of control.',
  },
  'nexus-point xenas': {
    expansion: 'Midnight',
    summary: 'A fractured void tower in Voidstorm where unstable arcane and shadow energies rip through a collapsing fortress at a key turning point in the campaign.',
  },
  'nexus-point-xenas': {
    expansion: 'Midnight',
    summary: 'A fractured void tower in Voidstorm where unstable arcane and shadow energies rip through a collapsing fortress at a key turning point in the campaign.',
  },
  'windrunner spire': {
    expansion: 'Midnight',
    summary: 'The haunted ancestral home of the Windrunner family, transformed into a dungeon that digs into the buried history and scars of the Ghostlands.',
  },
  'windrunner-spire': {
    expansion: 'Midnight',
    summary: 'The haunted ancestral home of the Windrunner family, transformed into a dungeon that digs into the buried history and scars of the Ghostlands.',
  },
  'maisara caverns': {
    expansion: 'Midnight',
    summary: 'A dark troll cavern beneath Zul\'Aman where Vilebranch rituals drain Witherbark souls to feed a monstrous dire troll in the depths.',
  },
  'maisara-caverns': {
    expansion: 'Midnight',
    summary: 'A dark troll cavern beneath Zul\'Aman where Vilebranch rituals drain Witherbark souls to feed a monstrous dire troll in the depths.',
  },
  'the nexus': {
    expansion: 'Wrath of the Lich King',
    summary: 'Malygos\' arcane bastion in Coldarra, where diverted ley line energy floods a sprawling blue dragon fortress in the heart of Northrend.',
  },
  'nexus': {
    expansion: 'Wrath of the Lich King',
    summary: 'Malygos\' arcane bastion in Coldarra, where diverted ley line energy floods a sprawling blue dragon fortress in the heart of Northrend.',
  },
  'nerub-ar palace': {
    expansion: 'The War Within',
    summary: 'The nerubian seat of power beneath Khaz Algar, reshaped into an endgame stronghold of scheming royalty, ancient webs, and empire-scale conflict.',
  },
  'nerubar-palace': {
    expansion: 'The War Within',
    summary: 'The nerubian seat of power beneath Khaz Algar, reshaped into an endgame stronghold of scheming royalty, ancient webs, and empire-scale conflict.',
  },
  'earthcrawl mines': {
    expansion: 'The War Within',
    summary: 'A Khaz Algar delve of cramped tunnels and hostile burrowers, built around quick pulls, underground hazards, and compact route execution.',
  },
  'earthcrawl-mines': {
    expansion: 'The War Within',
    summary: 'A Khaz Algar delve of cramped tunnels and hostile burrowers, built around quick pulls, underground hazards, and compact route execution.',
  },
};

function normalizeKey(value: string): string {
  return value.trim().toLowerCase();
}

function getMetadata(dungeon: Dungeon): DungeonMetadata | undefined {
  return metadataByKey[normalizeKey(dungeon.id)] ?? metadataByKey[normalizeKey(dungeon.name)];
}

export function enrichDungeon(dungeon: Dungeon): Dungeon {
  const metadata = getMetadata(dungeon);
  if (!metadata) return dungeon;

  return {
    ...dungeon,
    summary: dungeon.summary?.trim() || metadata.summary,
    expansion: dungeon.expansion?.trim() || metadata.expansion,
  };
}

export function enrichDungeons(dungeons: Dungeon[]): Dungeon[] {
  return dungeons.map(enrichDungeon);
}