import { Request, Response } from 'express'
import User from '../../models/user'
import { generateAccessToken, generateRefreshToken } from '../../auth'

export const createUser = async (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username) {
    return res.status(400).json({ error: 'Username is required' })
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required' })
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.status(409).json({ error: 'Username is taken' })
  }

  let user = new User({ username })
  await user.setPassword(password)

  await user.save()

  const refresh_token = await generateRefreshToken(user._id)
  const access_token = await generateAccessToken(user._id)

  return res.status(201).json({ 
    user: user.toAuthJSON(), 
    refresh_token: refresh_token.toAuthJSON(), 
    access_token 
  })
}

export default createUser