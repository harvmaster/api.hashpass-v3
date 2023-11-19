import Express from 'express'

import { validateAccessToken } from '../../auth'

import getServices from './getServices'
import createService from './createService'
import updateService from './updateServices'
import deleteService from './deleteService'

const router = Express.Router()

router.get('/', validateAccessToken, getServices)
router.post('/', validateAccessToken, createService)
router.put('/', validateAccessToken, updateService)
router.delete('/', validateAccessToken, deleteService)

export default router
