import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";

// Please note that this file will be updated by the AVAnnotate Admin
// application. No changes made here to the `site` or `base` fields will be reflected in the deployed 
// site.

export const dynamicConfig = {
  integrations: [react(), tailwind()],
  site: 'https://AVAnnotate.github.io',
  base: '/'
}