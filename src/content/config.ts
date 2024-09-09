import { defineCollection, z } from 'astro:content';

const annotationCollection = defineCollection({
  type: 'data',
  schema: z.any()
});

const eventCollection = defineCollection({
  type: 'data',
  schema: z.any()
});

const manifestCollection = defineCollection({
  type: 'data',
  schema: z.any()
});

const pageCollection = defineCollection({
  type: 'data',
  schema: z.any()
});

const projectCollection = defineCollection({
  type: 'data',
  schema: z.any()
});

export const collections = {
  annotations: annotationCollection,
  events: eventCollection,
  manifests: manifestCollection,
  pages: pageCollection,
  project: projectCollection,
};
