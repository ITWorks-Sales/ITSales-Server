export type ILIUserState =
  | 'No Action'
  | 'Initial Message'
  | 'Follow Up'
  | 'Meeting Scheduled'
  | 'Search Started by HR'
  | 'Provided Candidates'
  | 'Deal Finished';

export type updateTagLIUserType = 'add' | 'remove';

export type CRMFilters = {
  nameSearchFilter: string;
  contactDateFilter: string[];
  premiumProfileFilter: boolean;
  openProfileFilter: boolean;
  userStateFilter: ILIUserState[];
  tagsFilter: number[];
};
