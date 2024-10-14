import { defineCollection, z } from 'astro:content';

const slateNodeArray = z.array(z.any());

const annotationCollection = defineCollection({
  type: 'data',
  schema: z.object({
    event_id: z.string(),
    source_id: z.string(),
    set: z.string(),
    annotations: z.array(
      z.object({
        uuid: z.string(),
        start_time: z.number(),
        end_time: z.number(),
        annotation: slateNodeArray,
        tags: z.array(
          z.object({
            category: z.string(),
            tag: z.string(),
          })
        ),
      })
    ),
  }),
});

const eventCollection = defineCollection({
  type: 'data',
  schema: z.object({
    audiovisual_files: z.record(
      z.string(),
      z.object({
        label: z.string(),
        is_offline: z.boolean().nullish(),
        file_url: z.string(),
        duration: z.number(),
        caption_set: z
          .array(
            z.object({
              annotation_page_id: z.string(),
              speaker_category: z.string().nullish(),
            })
          )
          .nullish(),
      })
    ),
    auto_generate_web_page: z.boolean(),
    description: slateNodeArray.nullish(),
    citation: z.string().nullish(),
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
      parent: z.string().nullish(),
      updated_at: z.string(),
      updated_by: z.string(),
      slug: z.string().nullish(),
      autogenerate: z.object({
        enabled: z.boolean(),
        type: z.string(),
        type_id: z.string().nullish(),
      }),
    })
    // this "or" statement prevents a schema error on order.json
    .or(z.array(z.string())),
});

const projectCollection = defineCollection({
  type: 'data',
  schema: z.object({
    project: z.object({
      github_org: z.string(),
      title: z.string(),
      description: z.string().nullish(),
      language: z.string(),
      slug: z.string(),
      creator: z.string(),
      authors: z.string(),
      media_player: z.enum(['avannotate', 'universal', 'aviary']),
      auto_populate_home_page: z.boolean(),
      additional_users: z.array(
        z.object({
          login_name: z.string(),
          avatar_url: z.string(),
          admin: z.boolean(),
          name: z.string().nullish(),
        })
      ),
      tags: z.object({
        tagGroups: z.array(
          z.object({
            category: z.string(),
            color: z.string(),
          })
        ),
        tags: z.array(
          z.object({
            category: z.string(),
            tag: z.string(),
          })
        ),
      }),
      created_at: z.string(),
      updated_at: z.string(),
    }),
    publish: z.object({
      publish_pages_app: z.boolean(),
      publish_sha: z.string(),
      publish_iso_date: z.string(),
    }),
    // not sure what goes in here
    users: z.array(z.any()),
  }),
});

export const collections = {
  annotations: annotationCollection,
  events: eventCollection,
  manifests: manifestCollection,
  pages: pageCollection,
  project: projectCollection,
};
