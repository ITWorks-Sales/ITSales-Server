import { nodeType } from '../types';

export class DeleteNodesDTO {
  nodes: {
    type: nodeType;
    id: number;
  }[];
}
