export enum RoleEnum {
  ADMIN = 'ROLE_ADMIN',
  USER = 'ROLE_USER',
}

// RoleEnum hierarchy key:value pairs
export const RoleEnumHierarchy: { [key in RoleEnum]: number } = {
  [RoleEnum.ADMIN]: 2,
  [RoleEnum.USER]: 1,
};