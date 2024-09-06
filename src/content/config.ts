import { defineCollection, z } from 'astro:content';

const annotationCollection = defineCollection({
  type: 'data',
});

const eventCollection = defineCollection({
  type: 'data',
});

const manifestCollection = defineCollection({
  type: 'data',
});

const pageCollection = defineCollection({
  type: 'data',
});

const projectCollection = defineCollection({
  type: 'data',
});

export const collections = {
  annotations: annotationCollection,
  events: eventCollection,
  manifests: manifestCollection,
  pages: pageCollection,
  project: projectCollection,
};
