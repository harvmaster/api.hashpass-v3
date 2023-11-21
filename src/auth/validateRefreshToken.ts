import jwt from 'jsonwebtoken'
import RefreshToken from '../models/refreshToken'
import config from '../../config'

const jwt_refresh_secret = config.jwt_secret

const validateRefreshToken = async (token: string): Promise<string | null> => {
  try {
    const refreshToken = await RefreshToken.findOne({ token })
    if (!refreshToken) {
      return null
    }

    const payload = jwt.verify(refreshToken.token, jwt_refresh_secret) as { userId: string }
    return payload.userId
  } catch (error) {
    console.error(error)
    return null
  }
}

export default validateRefreshToken