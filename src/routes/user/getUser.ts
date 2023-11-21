import { Request, Response } from 'express'
import User from '../../models/user'


interface AuthenticatedRequest extends Request {
    user: string;
}

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user
        console.log(userId)
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const userJSON = user.toAuthJSON()
        return res.status(200).json({ user: userJSON })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export default getUser
