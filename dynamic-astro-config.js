import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";
import relativeLinks from 'astro-relative-links';

// Please note that this file will be updated by the AVAnnotate Admin
// application. No changes made here to the `site` or `base` fields will be reflected in the deployed
// site.

import project from './src/content/project/project.json';

console.log('Base: ', import.meta.env.PROD ? project.publish.publish_pages_app ? `${project.project.slug}` : undefined : 'dist')
export const dynamicConfig = {
  integrations: [react(), tailwind(), relativeLinks()],
  site: import.meta.env.PROD ? `https://${project.project.github_org}.github.io/${project.project.slug}` : undefined,
  base: import.meta.env.PROD ? `${project.project.slug}` : 'dist',
  srcDir: import.meta.env.PROD ?
    project.project.media_player === 'avannotate' ?
      './src' : project.project.media_player === 'aviary' ?
        './src-aviary' :
        './src' :
    './src'
}
