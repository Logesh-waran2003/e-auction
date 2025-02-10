import { Role } from "@prisma/client";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: Role;
  isApproved: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface FormData {
  email: string;
  password: string;
  userType: Role;
  name?: string;
}
