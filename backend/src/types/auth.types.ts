export interface JwtPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  userId: string;
  role: string;
}

export interface TokenResponse {
  token: string;
  expiresIn: string;
}
