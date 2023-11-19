import { verify, JwtPayload } from 'jsonwebtoken'
import User from '../models/user'

const auth = async (req, res, next) => {
  const public_key = req.headers['x-public-key']
  const user = await User.findOne({ public_key }) 
  if (!user) {
    return res.status(400).json({ error: 'User not found' })
  }

  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const payload = verify(token, user.public_key, {
      algorithms: ['ES256']
    }) as JwtPayload
    
    // Check timestamp
    const timestamp = payload.timestamp
    if (!timestamp) {
      return res.status(401).json({ error: 'Invalid token, timestamp is required in payload' })
    }
    const now = new Date().getTime()
    if (now - timestamp > 300000) {
      return res.status(401).json({ error: 'Invalid token, timestamp is too old' })
    }
    
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  return res.status(401).json({ error: 'An authentication error occurred' })
}

export default auth