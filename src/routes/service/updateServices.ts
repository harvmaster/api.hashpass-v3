import { Request, Response } from 'express';
import User from '../../models/user';
import Service from '../../models/service';

interface AuthenticatedRequest extends Request {
  user: string;
}

export const updateService = async (req: AuthenticatedRequest, res: Response<APIResponse<UpdateServiceResponse>>) => {
  const userId = req.user
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const user = await User.findById(userId)
  if (!user) {
    return res.status(400).json({ error: 'User not found' })
  }

  interface UpdateBody extends Partial<Service> {
    id: string;
  }

  const updateBody = req.body as UpdateBody;
  
  const service = await Service.findById(updateBody.id)
  if (service.user.toString() !== user._id.toString()) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const updatedBody = { ...service, ...updateBody }

  const updatedService = await Service.findOneAndUpdate({ id: service.id }, updatedBody, { new: true })

  return res.json({ updatedService.toAuthJSON() })
}

export default updateService