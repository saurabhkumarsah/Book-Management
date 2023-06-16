import express from 'express'
import { createUser, userLogin } from '../controllers/userController.js'
export const router = express.Router()

router.get('/test', (req, res) => {
    res.send({ status: true, message: "Fine" })
})


// User Router
router.post('/register', createUser)
router.post('/login', userLogin)