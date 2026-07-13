import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";
import relativeLinks from 'astro-relative-links';

// Please note that this file will be updated by the AVAnnotate Admin
// application. No changes made here to the `site` or `base` fields will be reflected in the deployed
// site.

import project from './src/content/project/project.json';

// include_slug_in_base is written by the admin client and is the authoritative
// source; fall back to publish_pages_app for projects generated before this
// field was introduced.
const shouldIncludeSlugInBase = project.publish.include_slug_in_base !== undefined
  ? project.publish.include_slug_in_base
  : project.publish.publish_pages_app;

export const dynamicConfig = {
  integrations: [react(), tailwind(), relativeLinks()],
  site: import.meta.env.PROD
    ? shouldIncludeSlugInBase
      ? `https://${project.project.github_org}.github.io/${project.project.slug}`
      : `https://${project.project.github_org}.github.io`
    : undefined,
  base: import.meta.env.PROD ? (shouldIncludeSlugInBase ? `${project.project.slug}` : '') : 'dist',
  srcDir: import.meta.env.PROD ?
    project.project.media_player === 'avannotate' ?
      './src' : project.project.media_player === 'aviary' ?
        './src-aviary' :
        './src' :
    './src'
}
