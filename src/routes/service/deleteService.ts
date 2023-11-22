import { Request, Response } from 'express';
import User from '../../models/user';
import Service from '../../models/service';

interface AuthenticatedRequest extends Request {
  user: string;
}

export const deleteService = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const user = await User.findById(userId)
  if (!user) {
    return res.status(400).json({ error: 'User not found' })
  }

  const { name } = req.body
  if (!name) {
    return res.status(400).json({ error: 'Service name is required' })
  }

  const service = await Service.findOne({ name, user: user._id })
  if (!service) {
    return res.status(400).json({ error: 'Service not found' })
  }

  if (service.user.toString() !== user._id.toString()) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const deleted = await Service.findOneAndDelete({ id: service.id })
  if (!deleted) {
    return res.status(400).json({ error: 'Something went wrong while trying to delete the service' })
  }

  return res.status(200).send({ status: 'success' })
}

export default deleteService