import type { Annotation, Event } from '@ty/index.ts';

export const tagColors = [
  '#ADFFD9',
  '#ADFEFF',
  '#99E6FF',
  '#88C9F2',
  '#99AFF2',
  '#B3B3E6',
  '#C195DB',
  '#DA9ECF',
  '#F2A7C3',
  '#DC8F8D',
  '#FF9A6F',
  '#FCB55F',
  '#F7ED78',
  '#CBE364',
  '#A9D69A',
];

// inverse of getTagParam
export const fromTagParam = (str: string) => {
  if (str === 'uncategorized') {
    return '_uncategorized_';
  }

  return str.replaceAll('_', ' ');
};

// format a tag for display by capitalizing the first character of each word
// and handling the special case of the uncategorized category
export const getTagDisplay = (str: string) => {
  if (str === '_uncategorized_') {
    return 'Uncategorized';
  }

  const split = str.split(' ');

  return split
    .map((str) => `${str[0].toLocaleUpperCase()}${str.slice(1)}`)
    .join(' ');
};

// converts a tag or category name to a format more friendly to URLs
export const toTagParam = (str: string) => {
  if (str === '_uncategorized_') {
    return 'uncategorized';
  }

  return str.replaceAll(' ', '_').toLocaleLowerCase();
};

//sorting function for annotation sets, for use on tag detail pages
export const compareAnnotations = (a: any, b: any, events: any) => {
  const event_a = events.find((ev: any) => ev.id == a.data.event_id);
  const event_b = events.find((ev: any) => ev.id == b.data.event_id);
  if (event_a && event_b) {
    return event_a.data.label.toLowerCase() < event_b.data.label.toLowerCase()
      ? -1
      : event_a.data.label.toLowerCase() > event_b.data.label.toLowerCase()
      ? 1
      : a.data.set.toLowerCase() < b.data.set.toLowerCase()
      ? -1
      : a.data.set.toLowerCase() > b.data.set.toLowerCase()
      ? 1
      : 0;
  }
  return 0;
};

export const setHasCategory = (set: Annotation[], category: string) => {
  let hasCategory = false;
  const categoryCheck = fromTagParam(category);
  for (let i = 0; i < set.length; i++) {
    const a = set[i];
    for (let j = 0; j < a.tags.length; j++) {
      const t = a.tags[j];
      if (
        t.category.toLocaleLowerCase() === categoryCheck.toLocaleLowerCase()
      ) {
        hasCategory = true;
        break;
      }
    }
  }

  return hasCategory;
};

export const setsHasCategory = (sets: any[], category: string) => {
  for (let i = 0; i < sets.length; i++) {
    if (setHasCategory(sets[i].data.annotations, category)) {
      return true;
    }
  }

  return false;
};

export const setHasTag = (set: Annotation[], category: string, tag: string) => {
  let hasTag = false;
  const tagCheck = fromTagParam(tag);
  const categoryCheck = fromTagParam(category);
  for (let i = 0; i < set.length; i++) {
    const a = set[i];
    for (let j = 0; j < a.tags.length; j++) {
      const t = a.tags[j];
      if (
        t.category.toLocaleLowerCase() === categoryCheck &&
        t.tag.toLocaleLowerCase() === tagCheck
      ) {
        hasTag = true;
        //console.log('Tag found: ', t.tag.toLocaleLowerCase());
        break;
      }
    }
  }

  return hasTag;
};

export const setsHasTag = (sets: any[], category: string, tag: string) => {
  for (let i = 0; i < sets.length; i++) {
    if (setHasTag(sets[i].set.data.annotations, category, tag)) {
      return true;
    }
  }

  return false;
};
