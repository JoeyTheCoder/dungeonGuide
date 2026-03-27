// --- Core domain types for the WoW playbook ---

export type ContentSectionId = 'mythicplus' | 'raids' | 'delves';

export type MechanicTag =
  | 'Kick'
  | 'Stun'
  | 'Dispel'
  | 'Dodge'
  | 'Tank'
  | 'Defensive'
  | 'Healer'
  | 'DPS'
  | 'Priority Target'
  | 'AOE';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface MechanicNote {
  tag?: MechanicTag;
  tags?: MechanicTag[];
  text: string;
}

export interface Boss {
  name: string;
  summary: string;
  mechanics: MechanicNote[];
  tags?: MechanicTag[];
  priority: PriorityLevel;
}

export interface TrashMob {
  name: string;
  summary: string;
  mechanics: MechanicNote[];
  tags?: MechanicTag[];
  priority: PriorityLevel;
}

export interface TrashNotes {
  name: string;
  summary: string;
  mechanics: MechanicNote[];
  tags?: MechanicTag[];
  priority: PriorityLevel;
}

export interface Dungeon {
  id: string;
  section: ContentSectionId;
  name: string;
  summary: string;
  expansion?: string;
  trashNotes?: TrashNotes;
  bosses: Boss[];
  trash: TrashMob[];
}
