import { defineCollection, z } from 'astro:content';

const slateNodeArray = z.array(z.any());

const annotationCollection = defineCollection({
  type: 'data',
  schema: z.any(),
});

const eventCollection = defineCollection({
  type: 'data',
  schema: z.object({
    audiovisual_files: z.record(
      z.string(),
      z.object({
        label: z.string(),
        is_offline: z.boolean().optional(),
        file_url: z.string(),
        duration: z.number(),
      })
    ),
    auto_generate_web_page: z.boolean(),
    description: slateNodeArray,
    citation: z.string().optional(),
    created_at: z.string(),
    created_by: z.string(),
    item_type: z.enum(['Audio', 'Video']),
    label: z.string(),
    updated_at: z.string(),
    updated_by: z.string(),
  }),
});

const manifestCollection = defineCollection({
  type: 'data',
  schema: z.any(),
});

const pageCollection = defineCollection({
  type: 'data',
  schema: z
    .object({
      content: slateNodeArray,
      created_at: z.string(),
      created_by: z.string(),
      title: z.string(),
      parent: z.string().optional(),
      updated_at: z.string(),
      updated_by: z.string(),
      autogenerate: z.object({
        enabled: z.boolean(),
        type: z.string(),
        type_id: z.string().optional(),
      }),
    })
    // this "or" statement prevents a schema error on order.json
    .or(z.array(z.string())),
});

const projectCollection = defineCollection({
  type: 'data',
  schema: z.any(),
});

export const collections = {
  annotations: annotationCollection,
  events: eventCollection,
  manifests: manifestCollection,
  pages: pageCollection,
  project: projectCollection,
};
