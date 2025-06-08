export interface AuthModel {
  access: string
  refresh?: string
}

export type JwtPayload = {
  token_type: 'access' | 'refresh'
  exp: number  // timestamp (en secondes)
  iat: number  // issued at
  jti: string
  user_id: number
}
