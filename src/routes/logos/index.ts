import Express from 'express'

import { validateAccessToken } from '../../auth'

import getDomainRecommendation from './getDomainRecommendation'
import getLogo from './getLogo'

const router = Express.Router()

// router.get('/', validateAccessToken, getLogo)
router.get('/domain', validateAccessToken, getDomainRecommendation)
router.get('/', getLogo)
// router.put('/', validateAccessToken, updateService)
// router.delete('/', validateAccessToken, deleteService)

export default router
