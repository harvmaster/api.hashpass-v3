import { Request, Response } from 'express';
import User from '../../models/user';
import Service from '../../models/service';

interface AuthenticatedRequest extends Request {
  user: string;
}

export const createService = async (req: AuthenticatedRequest, res: Response) => {
  try {
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
    if (!algorithm) {
      return res.status(400).json({ error: 'Algorithm is required' })
    }

    const existingService = await Service.findOne({ name, user: user._id })
    if (existingService) {
      return res.status(409).json({ error: 'Service already exists' })
    }

    const service = new Service({
      name,
      logo,
      notes,
      algorithm,
      user: user._id,
    })

    await service.save()

    return res.status(201).json({ service: service.toAuthJSON() })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'An internal server error occurred. Please try again later' })
  }
}

export default createService