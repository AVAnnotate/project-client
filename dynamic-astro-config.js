import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";

// Please note that this file will be updated by the AVAnnotate Admin
// application. No changes made here to the `site` or `base` fields will be reflected in the deployed
// site.

import project from './src/content/project/project.json'

export const dynamicConfig = {
  integrations: [react(), tailwind()],
  site: import.meta.env.PROD ? `https://${project.project.github_org}.github.io/${project.project.slug}` : undefined,
  base: import.meta.env.PROD ? `${project.project.slug}` : 'dist'
}
