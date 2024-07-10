// @ts-ignore
import { getCollection, getEntry } from 'astro:content';
import type { APIRoute } from 'astro';

export async function getStaticPaths() {
  const paths: any[] = [];
  await getCollection('manifests', (j) => {
    const path = j.data.id.split('/');
    if (path.length > 0) {
      const id = path[path.length - 1].replace(/\.[^/.]+$/, '');
      paths.push({
        params: { id },
        props: { json: j.data },
      });
    } else {
      paths.push({
        params: { id: 'unknown' },
        props: { json: {} },
      });
    }
  });

  return paths;
}

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  const data = await getEntry('manifests', id as string);
  return new Response(JSON.stringify(data));
};
