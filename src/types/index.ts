// --- Core domain types for the Mythic+ playbook ---

export type MechanicTag = 'Kick' | 'Stun' | 'Dispel' | 'Dodge' | 'Tank' | 'Healer';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface MechanicNote {
  tag: MechanicTag;
  text: string;
}

export interface Boss {
  name: string;
  summary: string;
  mechanics: MechanicNote[];
  priority: PriorityLevel;
}

export interface TrashMob {
  name: string;
  summary: string;
  mechanics: MechanicNote[];
  priority: PriorityLevel;
}

export interface Dungeon {
  id: string;
  name: string;
  summary: string;
  bosses: Boss[];
  trash: TrashMob[];
}
