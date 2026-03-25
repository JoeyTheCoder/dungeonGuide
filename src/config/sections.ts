import type { ContentSectionId } from '../types';

export const sectionOrder: ContentSectionId[] = ['mythicplus', 'raids', 'delves'];

export const sectionMeta: Record<ContentSectionId, { label: string; listTitle: string; listSubtitle: string }> = {
  mythicplus: {
    label: 'Mythic+',
    listTitle: 'Mythic+ Dungeons',
    listSubtitle: 'Select a dungeon to view bosses, trash, and mechanic notes.',
  },
  raids: {
    label: 'Raids',
    listTitle: 'Raid Instances',
    listSubtitle: 'Select a raid to view bosses, trash, and encounter notes.',
  },
  delves: {
    label: 'Delves',
    listTitle: 'Delves',
    listSubtitle: 'Select a delve to view bosses, trash, and quick-reference notes.',
  },
};

export function isContentSectionId(value: string): value is ContentSectionId {
  return sectionOrder.includes(value as ContentSectionId);
}