import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { getUsersForSidebar, getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

//On the side bar in our chatapp we are fetching the users
router.get('/users', protectRoute, getUsersForSidebar)

//get messages between two users
router.get('/:id', protectRoute, getMessages)

//for sending messages
router.post('/send/:id', protectRoute, sendMessage)

export default router;