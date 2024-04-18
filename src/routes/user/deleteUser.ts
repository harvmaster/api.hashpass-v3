import { Request, Response } from 'express'

import User from '../../models/user'

interface AuthenticatedRequest extends Request {
  user: string;
}

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.user })
    if (!user) {
      return res.status(404).send({ error: 'User not found' })
    }

    return res.status(200).send({ status: 'success' })
  } catch (err: any) {
    console.log(err)
    return res.status(500).send({ error: 'Internal server error' })
  }
}

export default deleteUser