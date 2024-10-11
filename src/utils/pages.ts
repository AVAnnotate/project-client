import type { Page } from '@ty/index.ts';
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

// These util functions are necessary to avoid a bunch of TypeScript complaints.
// Since order.json is in the pages collection, TS thinks we might be running into
// order.json every time we access an object property on a page. These functions
// wrap around Astro's standard collections API while guaranteeing that we get
// normal page objects only, and typecasting that way.

export interface PageCollectionEntry
  extends Omit<CollectionEntry<'pages'>, 'data'> {
  data: Page;
}

export interface OrderCollectionEntry
  extends Omit<CollectionEntry<'pages'>, 'data'> {
  data: string[];
}

// fetch all pages, skipping order.json and also applying any extra filter passed
// in, then typecasting now that we've guaranteed that order.json isn't in the array
export const getPages = async (
  filterCallback?: (page: PageCollectionEntry) => boolean
) => {
  const pageOrder = await getOrder();

  const results = await getCollection('pages', (page) => {
    if ((page as PageCollectionEntry).id === 'order') {
      return false;
    }

    // skip pages that aren't mentioned in the order file
    // something has gone terribly wrong if this happens!
    if (!pageOrder.data.includes((page as PageCollectionEntry).id)) {
      return false;
    }

    return filterCallback ? filterCallback(page as PageCollectionEntry) : true;
  });

  // sort to match the order from pageOrder
  results.sort((a, b) => {
    const aIndex = pageOrder.data.indexOf(a.id);
    const bIndex = pageOrder.data.indexOf(b.id);

    if (aIndex > bIndex) {
      return 1;
    } else if (aIndex < bIndex) {
      return -1;
    }

    return 0;
  });

  return results as PageCollectionEntry[];
};

function isValidUUID(uuid: string) {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

// fetch a single page and typecast it as
export const getPage = async (uuid: string) => {
  if (uuid === 'order') {
    throw new Error(
      "Hey! Don't use getPage to get the order file! Use getOrder instead!"
    );
  }

  // Determine if UUID
  if (isValidUUID(uuid)) {
    return (await getEntry('pages', uuid)) as PageCollectionEntry;
  } else {
    // using slugs
    const pageOrder = await getOrder();
    const results = await getCollection('pages', (page) => {
      if ((page as PageCollectionEntry).id === 'order') {
        return false;
      }

      // skip pages that aren't mentioned in the order file
      // something has gone terribly wrong if this happens!
      if (!pageOrder.data.includes((page as PageCollectionEntry).id)) {
        return false;
      }

      // Look for the slug
      if ((page as PageCollectionEntry).data.slug === uuid) {
        return true;
      }

      return false;
    });

    // assume there is only one...
    return results[0] as PageCollectionEntry;
  }
};

export const getOrder = async () =>
  (await getEntry('pages', 'order')) as OrderCollectionEntry;
