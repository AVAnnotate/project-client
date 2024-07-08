import type { AnnotationFile, EventFile, ProjectFile } from '@ty/index.ts';
import type { IIIFAnnotationItem, IIIFAnnotationPage } from '@ty/iiif.ts';
import { Node } from 'slate';
import { it } from 'node:test';

const commandLineArgs = require('command-line-args');
const fs = require('fs');

const createAnnotationPage = (
  fileName: string,
  pagesURL: string,
  targetCanvas: string,
  id: string,
  manifestId: string
) => {
  // Read in the file
  // All annotation pages are assumed to be in ./annotations
  const annotationData: AnnotationFile = JSON.parse(
    fs.readFileSync(`./annotations/${fileName}`, 'utf8')
  );

  // Read in the matching Event file
  // All Event files are assumed to be in ./events
  const eventData: EventFile = JSON.parse(
    fs.readFileSync(`./events/${annotationData.event_id}.json`, 'utf8')
  );

  const output: IIIFAnnotationPage = {
    '@context': 'http://iiif.io/api/presentation/3/context.json',
    id: `${pagesURL}/manifests/${eventData.label}`,
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
          value: annotation.annotation.map((n) => Node.string(n)).join('\n'),
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
        selector: annotation.end_time
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

    output.items.push(item);
  });

  return output;
};
