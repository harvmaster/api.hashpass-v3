import Express from 'express'

import { validateAccessToken } from '../../auth'

import getDomainRecommendation from './getDomainRecommendation'
import getLogos from './getLogo'

const router = Express.Router()

// router.get('/', validateAccessToken, getLogo)
router.get('/domain', validateAccessToken, getDomainRecommendation)
router.get('/', validateAccessToken, getLogos)
// router.put('/', validateAccessToken, updateService)
// router.delete('/', validateAccessToken, deleteService)

export default router
