export const normalizeBasePath = (basePath: string) => {
  const trimmedBasePath = basePath.trim();

  if (trimmedBasePath === '' || trimmedBasePath === '/') {
    return '';
  }

  const noTrailingSlash = trimmedBasePath.replace(/\/$/, '');
  return noTrailingSlash.startsWith('/') ? noTrailingSlash : `/${noTrailingSlash}`;
};

export const joinBasePath = (basePath: string, segment = '') => {
  const normalizedBasePath = normalizeBasePath(basePath);
  const normalizedSegment = segment.trim().replace(/^\/+|\/+$/g, '');

  if (normalizedSegment === '') {
    return normalizedBasePath === '' ? '/' : `${normalizedBasePath}/`;
  }

  return `${normalizedBasePath}/${normalizedSegment}`;
};
