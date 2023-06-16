export class CreateLIUserSNCDTO {
  elements: Element[];
}

export interface Element {
  lastName: string;
  memorialized: boolean;
  objectUrn: string;
  geoRegion: string;
  saved: boolean;
  openLink: boolean;
  premium: boolean;
  currentPositions: CurrentPosition[];
  entityUrn: string;
  viewed: boolean;
  profilePictureDisplayImage?: ProfilePictureDisplayImage;
  trackingId: string;
  blockThirdPartyDataSharing: boolean;
  pendingInvitation: boolean;
  summary?: string;
  pastPositions?: PastPosition[];
  degree: number;
  fullName: string;
  listCount: number;
  firstName: string;
  facePiles?: ProfilePictureDisplayImage[];
  sharedConnectionsHighlight?: SharedConnectionsHighlight;
  $recipeType: string;
}

export interface CurrentPosition {
  tenureAtPosition: TenureAt;
  companyName: string;
  description?: string;
  title: string;
  companyUrnResolutionResult?: CompanyUrnResolutionResult;
  companyUrn?: string;
  posId: number;
  current: boolean;
  $recipeType: CurrentPositionRecipeType;
  tenureAtCompany: TenureAt;
  startedOn: EdOn;
}

export enum CurrentPositionRecipeType {
  COMLinkedinSalesDecoCommonProfileDecoratedPosition = 'com.linkedin.sales.deco.common.profile.DecoratedPosition',
}

export interface CompanyUrnResolutionResult {
  entityUrn: string;
  name: string;
  companyPictureDisplayImage?: ProfilePictureDisplayImage;
  industry: string;
  location: string;
  $recipeType: CompanyUrnResolutionResultRecipeType;
}

export enum CompanyUrnResolutionResultRecipeType {
  COMLinkedinSalesDecoCommonCompanyDecoratedCompanyEntity = 'com.linkedin.sales.deco.common.company.DecoratedCompanyEntity',
}

export interface ProfilePictureDisplayImage {
  rootUrl: string;
  artifacts: Artifact[];
}

export interface Artifact {
  width: number;
  fileIdentifyingUrlPathSegment: string;
  height: number;
}

export interface EdOn {
  year: number;
  month?: number;
}

export interface TenureAt {
  numYears?: number;
  numMonths?: number;
}

export interface PastPosition {
  endedOn: EdOn;
  companyName: string;
  title: string;
  companyUrn?: string;
  posId: number;
  current: boolean;
  startedOn: EdOn;
}

export interface SharedConnectionsHighlight {
  count: number;
  $recipeType: SharedConnectionsHighlightRecipeType;
}

export enum SharedConnectionsHighlightRecipeType {
  COMLinkedinSalesDecoDesktopSearchSharedConnectionsCount = 'com.linkedin.sales.deco.desktop.search.sharedConnectionsCount',
}

export interface DecoratedSmartFilters {
  title: Title;
}

export interface Title {
  decoratedValues: DecoratedValue[];
}

export interface DecoratedValue {
  id: string;
  decoratedValue: string;
}

export interface Tracking {
  requestId: string;
  sessionId: string;
}
