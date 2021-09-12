import { ILIUserState } from 'src/linkedin-user/types';
import { nodeType, minMax } from '../types';

export class updateNodesFieldsDTO {
  id: number;
  type: nodeType;
  inmailFields?: inmailFields;
}

class inmailFields {
  title: string;
  message: string;
  state: ILIUserState;
  next_profile: minMax;
  click_message: minMax;
  insert_message: minMax;
  insert_title: minMax;
  click_send: minMax;
}
