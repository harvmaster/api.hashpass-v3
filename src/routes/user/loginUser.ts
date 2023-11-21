import { Request, Response } from "express"
import { generateRefreshToken, generateAccessToken } from "../../auth"
import User from "../../models/user"

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password' })
    }

    const user = await User.findOne({ username })
    if (!user || !user.validatePassword(password)) {
      return res.status(401).json({ message: 'Incorrect username or password' })
    }

    const refresh_token = await generateRefreshToken(user._id)
    const access_token = await generateAccessToken(user._id)
    
    return res.status(200).json({
      user: user.toAuthJSON(),
      refresh_token: refresh_token.toAuthJSON(),
      access_token
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export default loginUser