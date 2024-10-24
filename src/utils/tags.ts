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

// format a tag for display by capitalizing the first character and
// handling the special case of the uncategorized category
export const getTagDisplay = (str: string) => {
  if (str === '_uncategorized_') {
    return 'Uncategorized';
  }

  return `${str[0].toLocaleUpperCase()}${str.slice(1)}`;
};

// converts a tag or category name to a format more friendly to URLs
export const toTagParam = (str: string) => {
  if (str === '_uncategorized_') {
    return 'uncategorized';
  }

  return str.replaceAll(' ', '_').toLocaleLowerCase();
};