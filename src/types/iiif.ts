export interface IIIFLabel {
  en?: string | string[];
}

export interface IIIFClass {
  id: string;
  type: string;
  label?: IIIFLabel;
}

export interface IIIFResource {
  id?: string;
  type: string;
  language?: string;
  format?: string;
  value?: string;
  motivation?: string;
  purpose?: string;
}

export interface IIIFAnnotationTarget {
  source:
    | {
        id: string;
        type: string;
        partOf: IIIFClass[];
      }
    | string;
  selector?: {
    type: string;
    t: string;
  };
}
export interface IIIFAnnotationItem extends IIIFClass {
  motivation: string | string[];
  '@context'?: string;
  body: IIIFResource[];
  target: IIIFAnnotationTarget | string;
}

export interface IIIFAnnotationPage extends IIIFClass {
  '@context'?: string | string[];
  items?: IIIFAnnotationItem[];
}

export interface IIIFHomepage extends IIIFClass {
  format: string;
}

export interface IIIFProvider extends IIIFClass {}

export interface IIIFCanvas extends IIIFClass {
  duration: number;
  annotations: IIIFAnnotationPage[];
  items: IIIFAnnotationPage[];
}

export interface IIIFMetadata {
  label: IIIFLabel;
  value: IIIFLabel;
}
export interface IIIFPresentationManifest extends IIIFClass {
  '@context': string;
  homepage: IIIFHomepage[];
  provider?: IIIFProvider[];
  items: IIIFCanvas[];
  metadata: IIIFMetadata[];
}
