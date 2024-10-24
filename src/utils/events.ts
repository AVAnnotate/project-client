import { getEntry, type CollectionEntry } from 'astro:content';
import { dynamicConfig } from 'dynamic-astro-config.js';

export const getCaptionSets = async (
  event: CollectionEntry<'events'>,
  file: string,
  annotationSets: CollectionEntry<'annotations'>[]
) => {
  const projectData = await getEntry('project', 'project');

  const baseUrl = import.meta.env.PROD
    ? projectData.data.project.slug
    : dynamicConfig.base;

  let captionSets: { url: string; label: string }[];

  const eventCaptionSet = event.data.audiovisual_files[file]?.caption_set;

  if (eventCaptionSet) {
    captionSets = eventCaptionSet.map((s: any) => {
      const set = annotationSets.find((set) => set.id === s.annotation_page_id);
      return {
        url: `/${baseUrl}/${s.annotation_page_id}.vtt`,
        label: set?.data.set || '',
      };
    });
  } else {
    captionSets = [];
  }

  return captionSets;
};
