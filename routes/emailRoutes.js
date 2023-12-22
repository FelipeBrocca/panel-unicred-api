import express from 'express';
const router = express.Router()
import { usersController } from '../controllers/usersController.js'
import verifyJWT from '../middlewares/verifyJWT.js';

router.post('/:email', verifyJWT, usersController.getUserByEmail)

export default router