// converts a category name to a proper title-cased name to display in the UI
export const getCategoryLabel = (cat: string) => {
  // uncategorized categories are called _uncategorized_
  const stripped = cat.replaceAll('_', '');
  return `${stripped[0].toLocaleUpperCase()}${stripped.slice(1)}`;
};
