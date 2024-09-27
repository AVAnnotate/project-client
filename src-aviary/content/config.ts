import { defineCollection, z } from 'astro:content';

const manifestCollection = defineCollection({
  type: 'data',
  schema: z.any(),
});

const projectCollection = defineCollection({
  type: 'data',
  schema: z.any(),
});

export const collections = {
  manifests: manifestCollection,
  project: projectCollection,
};
