import type { APIRoute } from 'astro';

import manifest from '@manifests/manifest.json';

export const GET: APIRoute = async function GET() {
  try {
    return new Response(manifest, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    throw new Error('Something went wrong in the manifest route!');
  }
};
