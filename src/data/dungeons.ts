import type { Dungeon } from '../types';

// Placeholder dungeon data — replace with Notion API data later.
// Each dungeon entry follows the Dungeon interface from types/index.ts.

export const dungeons: Dungeon[] = [
  {
    id: 'ara-kara',
    name: 'Ara-Kara, City of Echoes',
    summary: 'Nerubian underground city with tight corridors and heavy poison mechanics. Watch for frequent kicks and dispels.',
    bosses: [
      {
        name: 'Avanoxx',
        summary: 'Spider boss that summons waves of adds. Kill eggs quickly to prevent overwhelming spawns.',
        mechanics: [
          { tag: 'Dodge', text: 'Avoid web lines on the ground' },
          { tag: 'Tank', text: 'Face boss away — frontal cleave' },
          { tag: 'Healer', text: 'Heavy AoE during egg hatches' },
        ],
        priority: 'Medium',
      },
      {
        name: 'Anub\'zekt',
        summary: 'Nerubian commander with a dangerous charge and burrow phase.',
        mechanics: [
          { tag: 'Dodge', text: 'Move out of burrow zones' },
          { tag: 'Stun', text: 'Stun adds during swarm phase' },
          { tag: 'Tank', text: 'Use cooldowns on Impale' },
        ],
        priority: 'High',
      },
      {
        name: 'Ki\'katal the Harvester',
        summary: 'Final boss with spreading void zones and a healer-intensive burn phase.',
        mechanics: [
          { tag: 'Dispel', text: 'Dispel Cultivated Poison immediately' },
          { tag: 'Dodge', text: 'Move out of expanding void pools' },
          { tag: 'Healer', text: 'Save cooldowns for harvest phase' },
        ],
        priority: 'High',
      },
    ],
    trash: [
      {
        name: 'Nerubian Darkcaster',
        summary: 'Casts Shadow Bolt Volley — must be interrupted or the group takes heavy damage.',
        mechanics: [
          { tag: 'Kick', text: 'Interrupt Shadow Bolt Volley' },
        ],
        priority: 'High',
      },
      {
        name: 'Venomous Creeper',
        summary: 'Applies stacking poison — dispel or kite.',
        mechanics: [
          { tag: 'Dispel', text: 'Remove Venomous Spit stacks' },
          { tag: 'Dodge', text: 'Avoid poison puddles' },
        ],
        priority: 'Medium',
      },
      {
        name: 'Bloodstained Webmage',
        summary: 'Channels a heal on nearby allies. Must be interrupted.',
        mechanics: [
          { tag: 'Kick', text: 'Interrupt Dark Mending' },
          { tag: 'Stun', text: 'Can stun to delay if kick is on cooldown' },
        ],
        priority: 'High',
      },
    ],
  },
  {
    id: 'city-of-threads',
    name: 'City of Threads',
    summary: 'Dense nerubian hive with overlapping patrols. Careful pulling and kick coordination are essential.',
    bosses: [
      {
        name: 'Orator Krix\'vizk',
        summary: 'Propaganda-spewing boss that buffs nearby adds. Kill adds first.',
        mechanics: [
          { tag: 'Kick', text: 'Interrupt Subjugate on party members' },
          { tag: 'Stun', text: 'Stun empowered adds' },
          { tag: 'Healer', text: 'Dispel mind-control quickly' },
        ],
        priority: 'Medium',
      },
      {
        name: 'Fangs of the Queen',
        summary: 'Dual-boss encounter — both must die within 10 seconds of each other.',
        mechanics: [
          { tag: 'Tank', text: 'Separate the two bosses' },
          { tag: 'Dodge', text: 'Avoid criss-crossing charge lines' },
          { tag: 'Healer', text: 'Heavy sustained damage throughout' },
        ],
        priority: 'High',
      },
      {
        name: 'The Coaglamation',
        summary: 'Ooze boss that splits and reforms. Manage add health carefully.',
        mechanics: [
          { tag: 'Dodge', text: 'Don\'t stand in ooze pools' },
          { tag: 'Kick', text: 'Interrupt Dark Reconstitution' },
          { tag: 'Tank', text: 'Pick up split oozes quickly' },
        ],
        priority: 'Medium',
      },
      {
        name: 'Izo, the Grand Splicer',
        summary: 'Final boss with stacking debuffs and a deadly splice mechanic.',
        mechanics: [
          { tag: 'Dispel', text: 'Dispel Splice targets before detonation' },
          { tag: 'Dodge', text: 'Avoid rotating thread beams' },
          { tag: 'Tank', text: 'Swap on high Splice stacks' },
        ],
        priority: 'High',
      },
    ],
    trash: [
      {
        name: 'Eye of the Queen',
        summary: 'Casts Psychic Venom — high priority kick.',
        mechanics: [
          { tag: 'Kick', text: 'Interrupt Psychic Venom' },
        ],
        priority: 'High',
      },
      {
        name: 'Royal Venomshell',
        summary: 'Frontal cone poison. Tank should face away from party.',
        mechanics: [
          { tag: 'Tank', text: 'Face away from group' },
          { tag: 'Dodge', text: 'Avoid frontal cone' },
        ],
        priority: 'Medium',
      },
    ],
  },
  {
    id: 'stonevault',
    name: 'The Stonevault',
    summary: 'Earthen facility with machine bosses and dangerous ground effects. High movement fight density.',
    bosses: [
      {
        name: 'E.D.N.A.',
        summary: 'Defense construct that deploys turrets and mines across the room.',
        mechanics: [
          { tag: 'Dodge', text: 'Avoid mine detonation zones' },
          { tag: 'Kick', text: 'Interrupt Recharge Turret' },
          { tag: 'Tank', text: 'Position boss away from mines' },
        ],
        priority: 'Medium',
      },
      {
        name: 'Skarmorak',
        summary: 'Stone golem that shatters the ground. Collect crystals to weaken his shield.',
        mechanics: [
          { tag: 'Dodge', text: 'Avoid Shatter ground zones' },
          { tag: 'Tank', text: 'Heavy physical damage — use mitigation' },
          { tag: 'Healer', text: 'Spike damage on Crystalline Smash' },
        ],
        priority: 'High',
      },
      {
        name: 'Master Machinists',
        summary: 'Multi-boss encounter with overlapping mechanical hazards.',
        mechanics: [
          { tag: 'Dodge', text: 'Watch for rotating drill beams' },
          { tag: 'Kick', text: 'Interrupt Exhaust Vents heal' },
          { tag: 'Stun', text: 'Stun repair bots' },
        ],
        priority: 'High',
      },
      {
        name: 'Void Speaker Eirich',
        summary: 'Final boss channeling void energy. Interrupt-heavy fight with brutal AoE.',
        mechanics: [
          { tag: 'Kick', text: 'Interrupt Unbridled Darkness — lethal' },
          { tag: 'Dispel', text: 'Dispel Entropy on DPS' },
          { tag: 'Dodge', text: 'Move from void eruptions' },
          { tag: 'Healer', text: 'Heavy ticking damage throughout' },
        ],
        priority: 'High',
      },
    ],
    trash: [
      {
        name: 'Earthen Warder',
        summary: 'Casts Stone Shield on allies, making them nearly immune. Must be purged or killed first.',
        mechanics: [
          { tag: 'Dispel', text: 'Purge Stone Shield from mobs' },
        ],
        priority: 'High',
      },
      {
        name: 'Forge Loader',
        summary: 'Picks up a party member and slams them. Stun or CC to break the grab.',
        mechanics: [
          { tag: 'Stun', text: 'Stun to break Seismic Grab' },
          { tag: 'Healer', text: 'Grabbed target takes heavy damage' },
        ],
        priority: 'Medium',
      },
      {
        name: 'Cursed Geomancer',
        summary: 'Channels Ground Pound — interruptible AoE.',
        mechanics: [
          { tag: 'Kick', text: 'Interrupt Ground Pound' },
          { tag: 'Dodge', text: 'Move out of aftershock zones' },
        ],
        priority: 'Medium',
      },
    ],
  },
];
