import { updateTagLIUserType } from '../types';

export class UpdateTagLIUserDTO {
  actionType: updateTagLIUserType;
  tagId: number;
  LIUserId: number;
}
