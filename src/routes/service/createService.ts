import { Request, Response } from 'express';
import User from '../../models/user';
import Service from '../../models/service';

interface AuthenticatedRequest extends Request {
  user: string;
}

export const createService = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const user = await User.findById(userId)
  if (!user) {
    return res.status(400).json({ error: 'User not found' })
  }

  const { name, logo, notes, algorithm } = req.body
  if (!name) {
    return res.status(400).json({ error: 'Name is required' })
  }

  const service = new Service({
    name,
    logo,
    notes,
    algorithm,
    user: user._id,
  })

  await service.save()

  return res.json({ service })
}

export default createService