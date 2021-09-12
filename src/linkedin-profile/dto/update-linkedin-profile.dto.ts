export class UpdateLinkedinProfileDTO {
  id: number;
  email?: string;
  password?: string;
  name?: string;
  linkedin_image?: string;
  active?: boolean;
  proxyId?: number | null;
}
