import { defineCollection } from 'astro:content';

const manifestCollection = defineCollection({
  type: 'data',
});

export const collections = {
  manifests: manifestCollection,
};
