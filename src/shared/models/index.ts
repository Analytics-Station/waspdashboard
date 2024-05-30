import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export * from './response.model';
export * from './localstorage.model';
export * from './auth.model';
export * from './user.model';
export * from './contact.model';
export * from './pagination.model';
export * from './broadcast.model';
export * from './contact-group.model';
export * from './template-variable.model';
export * from './broadcast-template.model';
export * from './organisation.model';

export interface FileInfo {
  fileName: string;
  fileUrl: string;
}

export interface MenuLink {
  label: string;
  url: string;
  icon: IconDefinition;
}
