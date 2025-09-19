import express from 'express'
import { getUser, loginUser, registerUser } from '../controller/userController.js';
import { protect } from '../utils/protect.js';

const route = express.Router();

route.post('/register', registerUser);
route.post('/login', loginUser);
route.get('/getuser', protect, getUser);

export default route;