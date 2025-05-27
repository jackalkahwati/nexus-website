interface AuthError extends Error {
  code: string
}

class InvalidPasswordError extends Error implements AuthError {
  code: string
  constructor(message: string) {
    super(message)
    this.name = 'InvalidPasswordError'
    this.code = 'INVALID_PASSWORD'
  }
}

class InvalidTokenError extends Error implements AuthError {
  code: string
  constructor(message: string) {
    super(message)
    this.name = 'InvalidTokenError'
    this.code = 'INVALID_TOKEN'
  }
}

export const validatePassword = async (password: string): Promise<boolean> => {
  if (!password || password.length < 8) {
    throw new InvalidPasswordError('Password must be at least 8 characters long')
  }
  return true
}

export const hashPassword = async (password: string): Promise<string> => {
  if (!password) {
    throw new InvalidPasswordError('Password is required')
  }
  return `hashed_${password}`
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  if (!password || !hash) {
    throw new InvalidPasswordError('Password and hash are required')
  }
  return hash === `hashed_${password}`
}

export const generateToken = async (userId: string): Promise<string> => {
  if (!userId) {
    throw new Error('User ID is required')
  }
  return `token_${userId}`
}

export const verifyToken = async (token: string): Promise<string | null> => {
  if (!token) {
    throw new InvalidTokenError('Token is required')
  }
  if (token.startsWith('token_')) {
    return token.substring(6)
  }
  return null
}

export { AuthError, InvalidPasswordError, InvalidTokenError } 