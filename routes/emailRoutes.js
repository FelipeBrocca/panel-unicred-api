import express from 'express';
const router = express.Router()
import { usersController } from '../controllers/usersController.js'
import verifyJWT from '../middlewares/verifyJWT.js';

router.get('/:email', verifyJWT, usersController.getUserByEmail)

export default router