import { field, templateType } from '../types';

export class CreateTemplateDTO {
  type: templateType;
  linkedinProfileId: number;
  fields: field[];
}
