export type Includes = 'media' | 'annotations' | 'label' | 'description';

export interface SlateEventNodeData {
  end?: number;
  file: string;
  includes: Includes[];
  start?: number;
  uuid: string;
}

export interface SlateCompareEventData {
  event1: Omit<SlateEventNodeData, 'includes'>;
  event2: Omit<SlateEventNodeData, 'includes'>;
  includes: Includes[];
}
