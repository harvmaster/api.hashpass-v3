import Express from 'express'

import { validateAccessToken } from '../../auth';

import createUser from './createUser';
import loginUser from './loginUser';
import getUser from './getUser';
import refreshAccessToken from './refreshToken';


const router = Express.Router()

router.get('/', validateAccessToken, getUser)

router.post('/', createUser)
router.post('/login', loginUser)
router.post('/refresh', refreshAccessToken)

// router.post('/getChallenge', getSignInChallenge)
// router.post('/verifyChallenge', verifySignInChallenge)

export default router
