import type { AnnotationFile, EventFile, ProjectFile } from '@ty/index.ts';
import type { IIIFAnnotationItem, IIIFAnnotationPage } from '@ty/iiif.ts';
import { Node } from 'slate';

const commandLineArgs = require('command-line-args');
const fs = require('fs');

const createAnnotationPage = (
  fileName: string,
  outputDir: string,
  project: ProjectFile,
  pagesURL: string,
  targetCanvas: string,
  id: string
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
        },
      },
    };
    annotation.tag;
    output.items.push(item);
  });
};
