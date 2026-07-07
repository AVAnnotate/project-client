export const normalizeBasePath = (basePath: string) =>
  basePath === '/' ? '' : basePath.replace(/\/$/, '');
