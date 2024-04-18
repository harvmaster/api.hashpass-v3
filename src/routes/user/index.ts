import Express from 'express'

import { validateAccessToken } from '../../auth';

import createUser from './createUser';
import loginUser from './loginUser';
import getUser from './getUser';
import refreshAccessToken from './refreshToken';
import deleteUser from './deleteUser';


const router = Express.Router()

router.get('/', validateAccessToken, getUser)

router.post('/', createUser)
router.post('/login', loginUser)
router.post('/refresh', refreshAccessToken)

router.delete('/', validateAccessToken, deleteUser)

// router.post('/getChallenge', getSignInChallenge)
// router.post('/verifyChallenge', verifySignInChallenge)

export default router
