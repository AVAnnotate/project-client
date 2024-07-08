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
  value: string;
  motivation: string;
}

export interface IIIFAnnotationTarget {
  source: {
    id: string;
    type: string;
    partOf: IIIFClass[];
  };
  selector: {
    type: string;
    t: string;
  };
}
export interface IIIFAnnotationItem extends IIIFClass {
  motivation: string | string[];
  '@context': string;
  body: IIIFResource[];
  target: IIIFAnnotationTarget;
}

export interface IIIFAnnotationPage extends IIIFClass {
  '@context'?: string | string[];
  items: IIIFAnnotationItem[];
}
