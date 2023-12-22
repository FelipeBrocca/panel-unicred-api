import express from 'express'
const router = express.Router()

router.get('^/$|/index(.html)?', (req, res) => {
    res.send('MenusServer')
})

export default router