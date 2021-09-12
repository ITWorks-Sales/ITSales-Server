import { field, templateType } from '../types';

export class UpdateTemplateDTO {
  type: templateType;
  templateId: number;
  fields: field[];
}
