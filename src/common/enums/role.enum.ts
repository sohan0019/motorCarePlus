export enum RoleEnum {
  SUPER_ADMIN = "RoleEnum_SUPER_ADMIN",
  ADMIN = "RoleEnum_ADMIN",
  USER = "RoleEnum_USER",
  DEPARTMENT_HEAD = "RoleEnum_DEPARTMENT_HEAD",
  COURSE_CONVENOR = "RoleEnum_COURSE_CONVENOR",
  THESIS_ADMIN = "RoleEnum_THESIS_ADMIN",
  THESIS_CONVENER = "RoleEnum_THESIS_CONVENER",
  THESIS_MEMBER = "RoleEnum_THESIS_MEMBER",
  THESIS_SUPERVISOR = "RoleEnum_USER",
  OPERATOR = "OPERATOR",
}

// RoleEnum hierarchy key:value pairs
export const RoleEnumHierarchy: { [key in RoleEnum]: number } = {
  [RoleEnum.SUPER_ADMIN]: 8,
  [RoleEnum.ADMIN]: 7,
  [RoleEnum.DEPARTMENT_HEAD]: 6,
  [RoleEnum.COURSE_CONVENOR]: 5,
  [RoleEnum.THESIS_ADMIN]: 4,
  [RoleEnum.THESIS_CONVENER]: 3,
  [RoleEnum.THESIS_MEMBER]: 2,
  [RoleEnum.OPERATOR]: 2,
  [RoleEnum.USER]: 1,
//   [RoleEnum.THESIS_SUPERVISOR]: 1,
};
