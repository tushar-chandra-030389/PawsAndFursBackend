import { Router } from 'express';

import { protect } from './../../utils/auth';
import { signIn, signUp } from './login.controller';

const router = Router();

router.post('/signin', signIn);
router.post('/signup', signUp);

export default router;
