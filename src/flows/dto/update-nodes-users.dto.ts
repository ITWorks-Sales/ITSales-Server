import { nodeDetails } from 'src/flows/types';
import { CRMFilters } from '../../linkedin-user/types';

export class UpdateNodesUsersDTO {
  filters: CRMFilters;
  nodeDetails: nodeDetails;
}
