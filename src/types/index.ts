import type { Node } from 'slate';

export type EventFile = {
  audiovisual_files: {
    label: string;
    file_url: string;
    duration: number;
    caption_set?: { annotation_page_id: string; speaker_category?: string }[];
  }[];
  auto_generate_web_page: boolean;
  description: Node[];
  citation?: string;
  created_at: string;
  created_by: string;
  item_type: 'Audio' | 'Video';
  label: string;
  updated_at: string;
  updated_by: string;
};

export type Tag = {
  category: string;
  tag: string;
};

export type TagGroup = {
  category: string;
  color: string;
};

export type Tags = {
  tagGroups: TagGroup[];
  tags: Tag[];
};

export type MediaPlayer = 'avannotate' | 'universal' | 'aviary';

export type Project = {
  github_org: string;
  title: string;
  description: string;
  language: string;
  slug: string;
  creator: string;
  authors: string;
  media_player: MediaPlayer;
  auto_populate_home_page: boolean;
  additional_users: ProviderUser[];
  tags?: Tags;
  created_at: string;
  updated_at: string;
};

export type ProviderUser = {
  login_name: string;
  avatar_url?: string;
  admin: boolean;
  name?: string;
};

export type Publish = {
  publish_pages_app: boolean;
  publish_sha: string;
  publish_iso_date: string;
};

export type Event = {
  audiovisual_files: {
    label: string;
    file_url: string;
    duration: number;
    caption_set?: { annotation_page_id: string; speaker_category?: string }[];
  }[];
  auto_generate_web_page: boolean;
  description: Node[];
  citation?: string;
  created_at: string;
  created_by: string;
  item_type: 'Audio' | 'Video';
  label: string;
  updated_at: string;
  updated_by: string;
};

export type ProjectFile = {
  project: Project;

  users: ProviderUser[];

  publish: Publish;

  events?: any[];
};

export type Annotation = {
  start_time: number;

  end_time: number;

  annotation: Node[];

  tags: Tag[];

  uuid: string;
};

export type DisplayedAnnotation = Annotation & {
  set: string;

  setName: string;
};

export type AnnotationFile = {
  event_id: string;

  source_id: string;

  set: string;

  annotations: Annotation[];
};

export type AutoGenerate = {
  enabled: boolean;
  type: string;
  type_id?: string;
};

export type Page = {
  content: Node[];
  created_at: string;
  created_by: string;
  title: string;
  parent?: string;
  slug?: string;
  updated_at: string;
  updated_by: string;
  autogenerate: AutoGenerate;
};
