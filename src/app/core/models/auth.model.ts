export type UserRole = 'admin' | 'operator' | 'customer';
export type UserStatus = 'active' | 'blocked' | 'inactive';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

export type AuthLoginResponse = {
  user: AuthUser;
  token: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};
