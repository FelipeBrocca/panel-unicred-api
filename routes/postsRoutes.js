import express from 'express';
const router = express.Router()
import { postsControllers } from '../controllers/postsController.js'
import verifyJWT from '../middlewares/verifyJWT.js';


router.get('/', postsControllers.getPosts)
router.get('/:category', postsControllers.getPostsByCategory)
router.get('/:id', postsControllers.getPost)
router.post('/', verifyJWT, postsControllers.newPost)
router.put('/:id', verifyJWT, postsControllers.updatePost)
router.delete('/:id', verifyJWT, postsControllers.deletePost)

export default router