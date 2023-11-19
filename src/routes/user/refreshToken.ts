import { Request, Response } from 'express'
import { validateRefreshToken, generateAccessToken } from '../../auth'
import RefreshToken from '../../models/refreshToken'

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body

    if (!refresh_token) {
      return res.status(400).json({ message: 'Missing refresh token' })
    }

    const refreshToken = await RefreshToken.findOne({ token: refresh_token })
    if (!refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }

    const user_id = await validateRefreshToken(refresh_token)
    if (!user_id) {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }

    const access_token = await generateAccessToken(user_id)

    return res.status(200).json({ access_token })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export default refreshAccessToken