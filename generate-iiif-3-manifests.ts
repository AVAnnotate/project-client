import type { AnnotationFile, EventFile, ProjectFile } from '@ty/index.ts';
import type {
  IIIFAnnotationItem,
  IIIFAnnotationPage,
  IIIFCanvas,
  IIIFPresentationManifest,
} from '@ty/iiif.ts';
import { Node } from 'slate';
import fs, { writeFileSync } from 'fs';
import { snakeCase } from 'snake-case';
import mime from 'mime-types';
import commandLineArgs from 'command-line-args';

export const createAnnotationPage = (
  dataPath: string,
  pagesURL: string,
  eventUUID: string,
  targetCanvas: string,
  id: string,
  manifestId: string
) => {
  // Iterate all annotations and look for this event
  fs.readdirSync(`${dataPath}/annotations/`).forEach((file) => {
    // Read in the file
    // All annotation pages are assumed to be in ./annotations
    const annotationData: AnnotationFile = JSON.parse(
      fs.readFileSync(`${dataPath}/annotations/${file}`, 'utf8')
    );

    // Read in the matching Event file
    // All Event files are assumed to be in ./events
    const eventData: EventFile = JSON.parse(
      fs.readFileSync(
        `${dataPath}/events/${annotationData.event_id}.json`,
        'utf8'
      )
    );

    if (annotationData.event_id === eventUUID) {
      const output: IIIFAnnotationPage = {
        '@context': 'http://iiif.io/api/presentation/3/context.json',
        id: `${pagesURL}/manifests/${snakeCase(eventData.label)}`,
        type: 'AnnotationPage',
        label: {
          en: [eventData.label],
        },
        items: [],
      };

      annotationData.annotations.forEach((annotation) => {
        const item: IIIFAnnotationItem = {
          '@context': 'http://www.w3.org/ns/anno.jsonld',
          type: 'Annotation',
          id: id,
          motivation: ['commenting', 'tagging'],
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
          target: {
            source: {
              id: targetCanvas,
              type: 'Canvas',
              partOf: [
                {
                  id: manifestId,
                  type: 'Manifest',
                },
              ],
            },
            selector:
              annotation.end_time &&
              annotation.end_time !== annotation.start_time
                ? {
                    type: 'RangeSelector',
                    t: `${annotation.start_time},${annotation.end_time}`,
                  }
                : {
                    type: 'PointSelector',
                    t: `${annotation.start_time}`,
                  },
          },
        };

        annotation.tags.forEach((tag) => {
          item.body.push({
            type: 'TextualBody',
            value: `${tag.category}:${tag.tag}`,
            format: 'text/plain',
            motivation: 'tagging',
          });
        });

        output.items!.push(item);
      });

      return output;
    }
  });

  return null;
};

export const createManifest = (
  dataDir: string,
  label: string,
  siteURL: string,
  title: string
) => {
  const output: IIIFPresentationManifest = {
    '@context': 'http://iiif.io/api/presentation/3/context.json',
    id: `${siteURL}/manifest.json`,
    type: 'Manifest',
    label: { en: [label] },
    homepage: [
      {
        id: siteURL,
        type: 'Text',
        label: { en: [title] },
        format: 'text/html',
      },
    ],
    items: [],
  };

  let canvasCount = 1;
  fs.readdirSync(`${dataDir}/events/`).forEach((file) => {
    const eventData: EventFile = JSON.parse(
      fs.readFileSync(`${dataDir}/events/${file}`, 'utf8')
    );

    const eventId = `${siteURL}/${snakeCase(
      eventData.label
    )}/canvas-${canvasCount}/canvas`;

    let pageCount = 1;
    for (const [key, avFile] of Object.entries(eventData.audiovisual_files)) {
      const type = mime.lookup(avFile.file_url);
      const event: IIIFCanvas = {
        id: eventId,
        type: 'Canvas',
        duration: avFile.duration,
        annotations: [],
        items: [],
      };

      const anno = createAnnotationPage(
        dataDir,
        siteURL,
        key,
        eventId,
        `${eventId}/page${pageCount}`,
        `${siteURL}/manifests.json`
      );

      writeFileSync(
        `./client/public/${snakeCase(
          eventData.label
        )}-canvas${canvasCount}-${pageCount}`,
        JSON.stringify(anno)
      );

      event.annotations.push({
        type: 'AnnotationPage',
        id: `${siteURL}/${snakeCase(
          eventData.label
        )}-canvas${canvasCount}-${pageCount}`,
        label: { en: ['Annotations'] },
      });

      event.items.push({
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
            body: [
              {
                id: avFile.file_url,
                type: eventData.item_type === 'Audio' ? 'Sound' : 'Video',
                format: type ? type : 'unknown',
              },
            ],
            target: `${siteURL}/${snakeCase(
              eventData.label
            )}-canvas${canvasCount}`,
          },
        ],
      });

      output.items.push(event);
      pageCount++;
    }
    canvasCount++;
  });

  writeFileSync('./client/public/mainfest', JSON.stringify(output));
};

const optionDefinitions = [
  { name: 'dir', alias: 'd', type: String },
  { name: 'label', alias: 'l', type: String },
  { name: 'url', alias: 'u', type: String },
  { name: 'title', alias: 't', type: String },
];

const options = commandLineArgs(optionDefinitions);

createManifest(options.dir, options.label, options.url, options.title);
