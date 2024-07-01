import type { AnnotationFile, EventFile, ProjectFile } from '@ty/index.ts';

const commandLineArgs = require('command-line-args');
const fs = require('fs');

const createAnnotationPage = (
  fileName: string,
  outputDir: string,
  project: ProjectFile,
  pagesURL: string,
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

  const output = {
    '@context': 'http://iiif.io/api/presentation/3/context.json',
    id: `${pagesURL}/manifests/${eventData.label}`,
  };
};
