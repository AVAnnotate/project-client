import { defineConfig } from 'astro/config';
import dynamic from './dynamic-astro-config.js';

// We are utilizing a dynamic astro config in this 
// template.  When the template is used to create 
// a new project by the AVAnnotate admin application
// the dynamic configuration will be updated to reflect 
// the new project


// https://astro.build/config
export default defineConfig(dynamic); // Do not change!
