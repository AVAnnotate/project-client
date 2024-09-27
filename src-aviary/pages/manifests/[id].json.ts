// @ts-ignore
import { getCollection, getEntry } from 'astro:content';
import type { APIRoute } from 'astro';

export async function getStaticPaths() {
  const paths: any[] = [];
  await getCollection('manifests', (j: any) => {
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
  const mani = await getEntry('manifests', id as string);
  if (mani) {
    // @ts-ignore
    return new Response(JSON.stringify(mani.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } else {
    return new Response(null, {
      status: 404,
    });
  }
};
