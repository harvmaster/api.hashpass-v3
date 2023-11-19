import jwt from 'jsonwebtoken';
import config from '../../config'

const jwt_secret = config.jwt_secret

export const generateAccessToken = (user: string): string => {
  const jwtOptions = {
    expiresIn : '7d'
  }
  const jwtPayload = {
    id: user,
  }

  const token = jwt.sign(jwtPayload, jwt_secret, jwtOptions)
  return token
}

export default generateAccessToken