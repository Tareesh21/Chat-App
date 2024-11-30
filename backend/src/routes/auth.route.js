import express from 'express'
import { signup, login, logout, updateProfile, checkAuth } from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

//The below route is possible only when the user is logged-in, or authenticated
router.put('/update-profile', protectRoute, updateProfile)

//We are goining to call below whenever we refresh the page
//While running in postman getting error i.e., showing sending request in the console of postman
router.get('/check', protectRoute, checkAuth)

export default router