
export interface AuthResponse {
  userId: string;
  fullName: string;
  email: string;
  accessToken: string;
  expiresAt: string;
  roles: string[];
}
