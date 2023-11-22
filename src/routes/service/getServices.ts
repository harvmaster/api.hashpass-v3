import { Request, Response } from 'express';
import User from '../../models/user';
import Service from '../../models/service';

interface AuthenticatedRequest extends Request {
  user: string;
}

// Returns a list of services for a user
export const getServices = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const user = await User.findById(userId)
  if (!user) {
    return res.status(400).json({ error: 'User not found' })
  }

  const services = await Service.find({ user: user._id })
  if (!services) {
    return res.status(400).json({ error: 'Services not found' })
  }

  const formattedServices = services.map(service => service.toAuthJSON())

  return res.json({ services: formattedServices })
}

export default getServices