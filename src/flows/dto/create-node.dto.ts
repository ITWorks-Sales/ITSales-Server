import { nodeType } from '../types';

export class CreateNodeDTO {
  flowId: number;
  position_x: number;
  position_y: number;
  type: nodeType;
}
