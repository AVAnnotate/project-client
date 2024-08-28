import { defineConfig } from 'astro/config';
import { dynamicConfig } from './dynamic-astro-config.js';

// We are utilizing a dynamic astro config in this 
// template.  When the template is used to create 
// a new project by the AVAnnotate admin application
// the dynamic configuration will be updated to reflect 
// the new project

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig(dynamicConfig); // Do not change!