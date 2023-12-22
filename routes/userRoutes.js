import express from 'express';
const router = express.Router()
import { usersController } from '../controllers/usersController.js'
import verifyJWT from '../middlewares/verifyJWT.js';

router.use(verifyJWT)

router.get('/', usersController.getUsers)
router.get('/:id', usersController.getUser)
router.post('/', usersController.register)
router.put('/:id', usersController.updateUser)
router.delete('/:id', usersController.deleteUser)

export default router