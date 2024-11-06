import type { AnnotationFile, EventFile, ProjectFile } from '@ty/index.ts';
import type {
  AnnotationPage,
  Annotation,
  AnnotationBody,
  Manifest,
  Canvas,
} from '@iiif/presentation-3';
import { Node } from 'slate';
import fs, { writeFileSync } from 'fs';
import { snakeCase } from 'snake-case';
import mime from 'mime-types';
import commandLineArgs from 'command-line-args';

export const createAnnotationPage = (
  dataPath: string,
  _pagesURL: string,
  eventUUID: string,
  pageId: string,
  targetCanvas: string,
  id: string,
  avFile: string
) => {
  let output: AnnotationPage[] = [];
  // Iterate all  annotations and look for this event
  fs.readdirSync(`${dataPath}/annotations/`).forEach((file) => {
    if (file.endsWith('.json')) {
      // Read in the file
      // All annotation pages are assumed to be in ./annotations
      const annotationData: AnnotationFile = JSON.parse(
        fs.readFileSync(`${dataPath}/annotations/${file}`, 'utf8')
      );

      if (annotationData.event_id === eventUUID) {
        const obj: AnnotationPage = {
          '@context': 'http://iiif.io/api/presentation/3/context.json',
          id: pageId,
          type: 'AnnotationPage',
          label: {
            en: [annotationData.set],
          },
          items: [],
        };

        annotationData.annotations.forEach((annotation) => {
          const item: Annotation = {
            '@context': 'http://www.w3.org/ns/anno.jsonld',
            type: 'Annotation',
            motivation: 'supplementing',
            id: id,
            body: [
              {
                type: 'TextualBody',
                value: annotation.annotation
                  .map((n) => Node.string(n))
                  .join('\n'),
                format: 'text/plain',
                motivation: 'commenting',
              },
            ],
            target: `${avFile}#t=${annotation.start_time},${annotation.end_time}`,
          };

          annotation.tags.forEach((tag) => {
            (item.body as AnnotationBody[])?.push({
              type: 'TextualBody',
              value: tag.tag,
              format: 'text/plain',
              purpose: 'tagging',
              motivation: 'tagging',
            });
          });

          obj.items!.push(item);
        });

        output.push(obj);
      }
    }
  });

  return output;
};

export const createManifest = (
  dataDir: string,
  siteURL: string,
  allowSubPages: string
) => {
  const projectData: ProjectFile = JSON.parse(
    fs.readFileSync(`${dataDir}/project.json`, 'utf8')
  );
  const output: Manifest = {
    '@context': 'http://iiif.io/api/presentation/3/context.json',
    id: `${siteURL}/manifest.json`,
    type: 'Manifest',
    label: { en: [projectData.project.slug] },
    homepage: [
      {
        id: siteURL,
        type: 'Text',
        format: 'text/html',
      },
    ],
    metadata: [
      {
        label: { en: ['Description'] },
        value: { en: [projectData.project.description || ''] },
      },
      {
        label: { en: ['Language'] },
        value: { en: ['English'] },
      },
    ],
    items: [],
  };

  let canvasCount = 1;
  fs.readdirSync(`${dataDir}/events/`).forEach((file) => {
    if (file.endsWith('.json')) {
      const eventData: EventFile = JSON.parse(
        fs.readFileSync(`${dataDir}/events/${file}`, 'utf8')
      );

      const eventId = `${siteURL}/${snakeCase(
        eventData.label
      )}/canvas-${canvasCount}/canvas`;

      let pageCount = 1;
      for (const [_key, avFile] of Object.entries(
        eventData.audiovisual_files
      )) {
        const type = mime.lookup(avFile.file_url);
        const event: Canvas = {
          id: eventId,
          type: 'Canvas',
          duration: avFile.duration,
          annotations: [],
          items: [],
        };

        const annos = createAnnotationPage(
          dataDir,
          siteURL,
          file.replace(/\.[^/.]+$/, ''),
          `${siteURL}/manifests/${snakeCase(
            eventData.label
          )}-canvas${canvasCount}-${pageCount}${
            allowSubPages === 'true' || allowSubPages === 'TRUE' ? '.json' : ''
          }`,
          eventId,
          `${eventId}/page${pageCount}`,
          avFile.file_url
        );

        if (annos.length > 0) {
          if (allowSubPages === 'true' || allowSubPages === 'TRUE') {
            annos.forEach((anno) => {
              writeFileSync(
                `./client/src/content/manifests/${snakeCase(
                  eventData.label
                )}-canvas${canvasCount}-${pageCount}.json`,
                JSON.stringify(anno)
              );

              event.annotations = [
                ...(event.annotations as AnnotationPage[]),
                {
                  type: 'AnnotationPage',
                  id: `${siteURL}/manifests/${snakeCase(
                    eventData.label
                  )}-canvas${canvasCount}-${pageCount}.json`,
                  label: { en: ['Annotations'] },
                },
              ];
            });
          } else {
            (event.annotations as AnnotationPage[]) = [
              ...(event.annotations as AnnotationPage[]),
              ...annos,
            ];
          }

          event.items?.push({
            id: `${siteURL}/${snakeCase(
              eventData.label
            )}-canvas${canvasCount}/paintings`,
            type: 'AnnotationPage',
            items: [
              {
                id: `${siteURL}/${snakeCase(
                  eventData.label
                )}-canvas${canvasCount}/paintings`,
                type: 'Annotation',
                motivation: 'painting',
                body: {
                  id: avFile.file_url,
                  type: eventData.item_type === 'Audio' ? 'Sound' : 'Video',
                  format: type ? type : 'unknown',
                },
                target: `${siteURL}/${snakeCase(
                  `${eventData.label}`
                )}-canvas${canvasCount}`,
              },
            ],
          });

          output.items.push(event);
          pageCount++;
        }
      }
    }
    canvasCount++;
  });

  writeFileSync(
    projectData.project.media_player === 'avannotate'
      ? './client/src/content/manifests/manifest.json'
      : './client/src-aviary/content/manifests/manifest.json',
    JSON.stringify(output)
  );
};

const optionDefinitions = [
  { name: 'dir', alias: 'd', type: String },
  { name: 'url', alias: 'u', type: String },
  { name: 'subPages', alias: 's', type: String },
];

const options = commandLineArgs(optionDefinitions);

createManifest(options.dir, options.url, options.subPages);
