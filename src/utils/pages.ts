import type { Page } from '@ty/index.ts';
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

// These util functions are necessary to avoid a bunch of TypeScript complaints.
// Since order.json is in the pages collection, TS thinks we might be running into
// order.json every time we access an object property on a page. These functions
// wrap around Astro's standard collections API while guaranteeing that we get
// normal page objects only, and typecasting that way.

interface PageCollectionEntry extends Omit<CollectionEntry<'pages'>, 'data'> {
  data: Page;
}

interface OrderCollectionEntry extends Omit<CollectionEntry<'pages'>, 'data'> {
  data: string[];
}

// fetch all pages, skipping order.json and also applying any extra filter passed
// in, then typecasting now that we've guaranteed that order.json isn't in the array
export const getPages = async (
  filterCallback?: (page: PageCollectionEntry) => boolean
) => {
  const results = await getCollection('pages', (page) => {
    if (page.id === 'order') {
      return false;
    }

    return filterCallback ? filterCallback(page as PageCollectionEntry) : true;
  });

  return results as PageCollectionEntry[];
};

// fetch a single page and typecast it as
export const getPage = async (uuid: string) => {
  if (uuid === 'order') {
    throw new Error(
      "Hey! Don't use getPage to get the order file! Use getOrder instead!"
    );
  }

  return (await getEntry('pages', uuid)) as PageCollectionEntry;
};

export const getOrder = async () =>
  (await getEntry('pages', 'order')) as OrderCollectionEntry;
