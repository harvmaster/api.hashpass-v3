import Express from 'express'

import user from './user'
import service from './service'

const router = Express.Router()

router.use('/user', user)
router.use('/service', service)

export default router