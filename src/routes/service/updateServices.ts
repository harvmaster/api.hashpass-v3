import { Request, Response } from 'express';
import User from '../../models/user';
import Service from '../../models/service';

import { APIResponse, UpdateServiceResponse } from '../types';

interface AuthenticatedRequest extends Request {
  user: string;
}

export const updateService = async (req: AuthenticatedRequest, res: Response<APIResponse<UpdateServiceResponse>>) => {
  try {
    const userId = req.user
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    interface UpdateBody extends Partial<typeof Service> {
      name: string;
    }

    const updateBody = req.body as UpdateBody;
    if (!updateBody.name) {
      return res.status(400).json({ error: 'Name is required' })
    }
    
    const service = await Service.findOne({ name: updateBody.name, user: user._id })
    if (!service) {
      return res.status(400).json({ error: 'Service not found' })
    }
    if (service.user.toString() !== user._id.toString()) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const isValidService = Service.isValidService(req.body);
    if (!isValidService[0]) {
      return res.status(400).json({ error: isValidService[1] })
    }

    const updatedBody = { ...service.toAuthJSON(), ...updateBody }

    const updatedService = await Service.findOneAndUpdate({ name: updateBody.name, user: user._id }, updatedBody, { new: true })
    return res.json({ service: updatedService.toAuthJSON() })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'An internal server error occurred. Please try again later' })
  }
}

export default updateService