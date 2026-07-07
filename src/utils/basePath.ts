export const normalizeBasePath = (basePath: string) => {
  const trimmedBasePath = basePath.trim();

  if (trimmedBasePath === '' || trimmedBasePath === '/') {
    return '';
  }

  const noTrailingSlash = trimmedBasePath.replace(/\/+$/, '');
  return noTrailingSlash.startsWith('/') ? noTrailingSlash : `/${noTrailingSlash}`;
};
