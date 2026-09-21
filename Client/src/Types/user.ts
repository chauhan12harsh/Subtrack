export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  role: string;
  createdAt: string;
}

export interface UpdateUserRequest {
  username: string;
  email: string;
}

export interface ChangePasswordRequest {
  Password: string;
}