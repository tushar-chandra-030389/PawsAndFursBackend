import { Router } from 'express';

import { getUser, addUser } from './user.controller';

const router = Router();

router.get('/', getUser);
router.post('/', addUser);

export default router;
