export enum RoleType {
  USER_START = 'USER_START',
  USER_MONTHLY_PRO = 'USER_MONTHLY_PRO'
}

export type Role = {
  role_id: string;
  role_type: RoleType;
  role_description: string;
  role_created_at: string;
  role_updated_at: string;
}