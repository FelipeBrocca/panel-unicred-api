import express from 'express';
const router = express.Router()
import {
    login,
    loggedIn,
    logout
} from '../controllers/authController.js'
import loginLimiter from '../middlewares/loginLimiter.js';


router.post('/', loginLimiter, login)

router.get('/loggedIn', loggedIn)

router.post('/logout', logout)



export default router