import express from 'express';
const router = express.Router()
import { usersController } from '../controllers/usersController.js'
import verifyJWT from '../middlewares/verifyJWT.js';


router.get('/', usersController.getUsers)
router.get('/:id', usersController.getUser)
router.post('/', verifyJWT, usersController.register)
router.put('/:id', verifyJWT, usersController.updateUser)
router.delete('/:id', verifyJWT, usersController.deleteUser)

export default router