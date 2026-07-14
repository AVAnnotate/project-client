import { defineConfig } from 'astro/config';
import { dynamicConfig } from './dynamic-astro-config.js';
import { createRequire } from 'module';

// We are utilizing a dynamic astro config in this
// template.  When the template is used to create
// a new project by the AVAnnotate admin application
// the dynamic configuration will be updated to reflect
// the new project

// --- Build-time config logging ---
const require = createRequire(import.meta.url);
const project = require('./src/content/project/project.json');

console.log('[AVAnnotate build] project.json raw values:');
console.log('  project.slug              :', project.project.slug);
console.log('  project.github_org        :', project.project.github_org);
console.log('  project.media_player      :', project.project.media_player);
console.log('  publish.include_slug_in_base:', project.publish.include_slug_in_base);
console.log('  publish.publish_pages_app :', project.publish.publish_pages_app);

console.log('[AVAnnotate build] resolved Astro config values:');
console.log('  site  :', dynamicConfig.site);
console.log('  base  :', dynamicConfig.base);
console.log('  srcDir:', dynamicConfig.srcDir);
// ---------------------------------

// https://astro.build/config
export default defineConfig(dynamicConfig); // Do not change!
